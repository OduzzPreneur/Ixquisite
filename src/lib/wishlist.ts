import "server-only";

import { getAuthenticatedUser } from "@/lib/auth";
import { getProductsBySlugs } from "@/lib/catalog";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

type StoredWishlistItem = {
  id: string;
  product_slug: string;
  created_at: string;
};

export async function getWishlistProductSlugsForCurrentUser() {
  const user = await getAuthenticatedUser();

  if (!user || !hasSupabaseConfig()) {
    return [] as string[];
  }

  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return [] as string[];
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("id,product_slug,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [] as string[];
  }

  return ((data as StoredWishlistItem[] | null) ?? []).map((item) => item.product_slug);
}

export async function getWishlistProductsForCurrentUser() {
  const slugs = await getWishlistProductSlugsForCurrentUser();
  if (!slugs.length) {
    return [];
  }

  return getProductsBySlugs(slugs);
}

export async function getWishlistStateForCurrentUser() {
  const [user, slugs] = await Promise.all([
    getAuthenticatedUser(),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  return {
    isAuthenticated: Boolean(user),
    slugs,
    count: slugs.length,
  };
}
