import "server-only";

import { getAuthenticatedUser } from "@/lib/auth";
import { getProductsBySlugs } from "@/lib/catalog";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

type StoredWishlistItem = {
  id: string;
  product_slug: string;
  selected_variant_slug?: string | null;
  created_at: string;
};

export type WishlistSelection = {
  id: string;
  productSlug: string;
  selectedVariantSlug: string | null;
};

export type WishlistProductSelection = {
  product: Awaited<ReturnType<typeof getProductsBySlugs>>[number];
  selectedVariantSlug: string | null;
};

async function getWishlistSelectionsForCurrentUser(): Promise<WishlistSelection[]> {
  const user = await getAuthenticatedUser();

  if (!user || !hasSupabaseConfig()) {
    return [];
  }

  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return [];
  }

  const preferred = await supabase
    .from("wishlist_items")
    .select("id,product_slug,selected_variant_slug,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (preferred.error) {
    const fallback = await supabase
      .from("wishlist_items")
      .select("id,product_slug,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fallback.error) {
      return [];
    }

    return ((fallback.data as StoredWishlistItem[] | null) ?? []).map((item) => ({
      id: item.id,
      productSlug: item.product_slug,
      selectedVariantSlug: null,
    }));
  }

  return ((preferred.data as StoredWishlistItem[] | null) ?? []).map((item) => ({
    id: item.id,
    productSlug: item.product_slug,
    selectedVariantSlug: item.selected_variant_slug ?? null,
  }));
}

export async function getWishlistProductSlugsForCurrentUser() {
  const selections = await getWishlistSelectionsForCurrentUser();
  return [...new Set(selections.map((item) => item.productSlug))];
}

export async function getWishlistProductsForCurrentUser() {
  const selections = await getWishlistSelectionsForCurrentUser();
  const slugs = [...new Set(selections.map((item) => item.productSlug))];
  if (!slugs.length) {
    return [];
  }

  const products = await getProductsBySlugs(slugs);
  const productMap = new Map(products.map((product) => [product.slug, product]));

  return selections
    .map((selection) => {
      const product = productMap.get(selection.productSlug);
      if (!product) {
        return null;
      }

      return {
        product,
        selectedVariantSlug: selection.selectedVariantSlug,
      } satisfies WishlistProductSelection;
    })
    .filter((entry): entry is WishlistProductSelection => Boolean(entry));
}

export async function getWishlistStateForCurrentUser() {
  const [user, selections] = await Promise.all([
    getAuthenticatedUser(),
    getWishlistSelectionsForCurrentUser(),
  ]);

  const slugs = [...new Set(selections.map((item) => item.productSlug))];

  return {
    isAuthenticated: Boolean(user),
    slugs,
    count: selections.length,
  };
}
