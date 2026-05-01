import "server-only";

import { cookies } from "next/headers";
import { getProduct, getProductsBySlugs } from "@/lib/catalog";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/auth";
import type { Product } from "@/data/site";
import { getProductVariants, resolveProductVariant, resolveVariantByColor } from "@/lib/product-variants";

const CART_COOKIE = "ixq_cart_state";
const CART_TOKEN_COOKIE = "ixq_cart_token";
const CART_COOKIE_DAYS = 30;

export type CartLine = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  product: Product;
  variantId: string;
  variantSlug: string;
  sku: string;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  image: string | null;
  lineTotal: number;
};

export type CartState = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
};

type LocalCartItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantSlug: string;
  sku: string;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  image: string | null;
};

type SupabaseCart = {
  id: string;
  cart_token: string | null;
  user_id: string | null;
  status: string;
};

type SupabaseCartItem = {
  id: string;
  cart_id: string;
  product_slug: string;
  product_id: string | null;
  product_name: string | null;
  variant_id: string | null;
  variant_slug: string | null;
  sku: string | null;
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
  image: string | null;
};

export type CartContext = {
  state: CartState;
  cartId: string | null;
  cartToken: string | null;
  source: "supabase" | "cookie";
};

function parseLocalCart(value: string | undefined): LocalCartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Array<Partial<LocalCartItem>>;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        id: String(item.id ?? ""),
        productId: String(item.productId ?? item.productSlug ?? ""),
        productName: String(item.productName ?? item.productSlug ?? ""),
        productSlug: String(item.productSlug ?? ""),
        variantId: String(item.variantId ?? `${String(item.productSlug ?? "")}-default`),
        variantSlug: String(item.variantSlug ?? "default"),
        sku: String(item.sku ?? `${String(item.productSlug ?? "").toUpperCase()}-DEFAULT`),
        quantity: Number(item.quantity ?? 1),
        selectedSize: typeof item.selectedSize === "string" ? item.selectedSize : null,
        selectedColor: typeof item.selectedColor === "string" ? item.selectedColor : null,
        image: typeof item.image === "string" ? item.image : null,
      }))
      .filter((item) => item.id && item.productSlug);
  } catch {
    return [];
  }
}

function serializeLocalCart(items: LocalCartItem[]) {
  return JSON.stringify(items);
}

function buildLocalItemId(productId: string, variantId: string, selectedSize: string | null) {
  return [productId, variantId, selectedSize ?? "default-size"].join("::");
}

function resolveVariantSelection(
  product: Product,
  input: {
    selectedVariantId?: string | null;
    selectedVariantSlug?: string | null;
    selectedColor?: string | null;
  },
) {
  const variants = getProductVariants(product);
  const normalizedId = input.selectedVariantId?.trim();
  const byId = normalizedId ? variants.find((variant) => variant.id === normalizedId) : null;
  const bySlug = resolveProductVariant({ ...product, variants }, input.selectedVariantSlug);
  const byColor = resolveVariantByColor({ ...product, variants }, input.selectedColor);
  const selected = byId ?? bySlug ?? byColor ?? variants[0] ?? null;
  return { variants, selected };
}

async function hydrateCart(items: LocalCartItem[]): Promise<CartState> {
  const products = await getProductsBySlugs(items.map((item) => item.productSlug));
  const productMap = new Map(products.map((product) => [product.slug, product]));

  const hydrated = items
    .map((item) => {
      const product = productMap.get(item.productSlug);
      if (!product) {
        return null;
      }

      return {
        id: item.id,
        productId: item.productId || product.id || product.slug,
        productName: item.productName || product.name || product.title,
        productSlug: item.productSlug,
        product,
        variantId: item.variantId,
        variantSlug: item.variantSlug,
        sku: item.sku,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.image,
        lineTotal: item.quantity * product.price,
      } satisfies CartLine;
    })
    .filter((item): item is CartLine => Boolean(item));

  return {
    items: hydrated,
    itemCount: hydrated.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: hydrated.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

async function getCookieStore() {
  return cookies();
}

async function getExistingCartToken() {
  const cookieStore = await getCookieStore();
  return cookieStore.get(CART_TOKEN_COOKIE)?.value ?? null;
}

async function ensureCartToken() {
  const existing = await getExistingCartToken();

  if (existing) {
    return existing;
  }

  const cookieStore = await getCookieStore();
  const token = crypto.randomUUID();

  try {
    cookieStore.set(CART_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * CART_COOKIE_DAYS,
    });
  } catch {
    // Server Components cannot set cookies during render in Next 16.
  }

  return token;
}

async function readLocalCartItems() {
  const cookieStore = await getCookieStore();
  return parseLocalCart(cookieStore.get(CART_COOKIE)?.value);
}

async function writeLocalCartItems(items: LocalCartItem[]) {
  const cookieStore = await getCookieStore();
  cookieStore.set(CART_COOKIE, serializeLocalCart(items), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * CART_COOKIE_DAYS,
  });
}

async function clearLocalCartStorage() {
  const cookieStore = await getCookieStore();
  cookieStore.set(CART_COOKIE, "[]", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function getOrCreateSupabaseCart(options?: { createIfMissing?: boolean }) {
  if (!hasSupabaseAdminConfig()) {
    return null;
  }

  const { createIfMissing = true } = options ?? {};
  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();
  const existingToken = await getExistingCartToken();
  const token = existingToken ?? (createIfMissing ? await ensureCartToken() : null);

  if (!admin) {
    return null;
  }

  if (user) {
    const { data: existingUserCart } = await admin
      .from("carts")
      .select("id,cart_token,user_id,status")
      .eq("status", "open")
      .eq("user_id", user.id)
      .maybeSingle<SupabaseCart>();

    if (existingUserCart) {
      return existingUserCart;
    }

    if (token) {
      const { data: guestCart } = await admin
        .from("carts")
        .select("id,cart_token,user_id,status")
        .eq("status", "open")
        .eq("cart_token", token)
        .is("user_id", null)
        .maybeSingle<SupabaseCart>();

      if (guestCart) {
        const { data: promoted } = await admin
          .from("carts")
          .update({ user_id: user.id })
          .eq("id", guestCart.id)
          .select("id,cart_token,user_id,status")
          .single<SupabaseCart>();

        return promoted ?? guestCart;
      }
    }

    if (!createIfMissing) {
      return null;
    }
  }

  if (token) {
    const { data: existingGuestCart } = await admin
      .from("carts")
      .select("id,cart_token,user_id,status")
      .eq("status", "open")
      .eq(user ? "user_id" : "cart_token", user ? user.id : token)
      .maybeSingle<SupabaseCart>();

    if (existingGuestCart) {
      return existingGuestCart;
    }
  }

  if (!createIfMissing || !token) {
    return null;
  }

  const { data: createdCart } = await admin
    .from("carts")
    .insert({
      status: "open",
      user_id: user?.id ?? null,
      cart_token: token,
    })
    .select("id,cart_token,user_id,status")
    .single<SupabaseCart>();

  return createdCart ?? null;
}

async function readSupabaseCartItems(cartId: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return [] as SupabaseCartItem[];
  }

  const { data } = await admin
    .from("cart_items")
    .select("id,cart_id,product_slug,product_id,product_name,variant_id,variant_slug,sku,quantity,selected_size,selected_color,image")
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });

  if (data) {
    return (data as SupabaseCartItem[] | null) ?? [];
  }

  const fallback = await admin
    .from("cart_items")
    .select("id,cart_id,product_slug,quantity,selected_size,selected_color")
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });

  return ((fallback.data as Array<Partial<SupabaseCartItem>> | null) ?? []).map((item) => ({
    id: String(item.id ?? ""),
    cart_id: String(item.cart_id ?? cartId),
    product_slug: String(item.product_slug ?? ""),
    product_id: null,
    product_name: null,
    variant_id: null,
    variant_slug: null,
    sku: null,
    quantity: Number(item.quantity ?? 1),
    selected_size: (item.selected_size as string | null | undefined) ?? null,
    selected_color: (item.selected_color as string | null | undefined) ?? null,
    image: null,
  }));
}

function mapSupabaseItems(items: SupabaseCartItem[]): LocalCartItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.product_id ?? item.product_slug,
    productName: item.product_name ?? item.product_slug,
    productSlug: item.product_slug,
    variantId: item.variant_id ?? `${item.product_slug}-default`,
    variantSlug: item.variant_slug ?? "default",
    sku: item.sku ?? `${item.product_slug.toUpperCase()}-DEFAULT`,
    quantity: item.quantity,
    selectedSize: item.selected_size,
    selectedColor: item.selected_color,
    image: item.image ?? null,
  }));
}

export async function getCurrentCartContext(): Promise<CartContext> {
  if (hasSupabaseAdminConfig()) {
    const cart = await getOrCreateSupabaseCart({ createIfMissing: false });

    if (cart) {
      const items = await readSupabaseCartItems(cart.id);
      return {
        state: await hydrateCart(mapSupabaseItems(items)),
        cartId: cart.id,
        cartToken: cart.cart_token ?? (await getExistingCartToken()),
        source: "supabase",
      };
    }
  }

  const items = await readLocalCartItems();
  return {
    state: await hydrateCart(items),
    cartId: null,
    cartToken: await getExistingCartToken(),
    source: "cookie",
  };
}

export async function getCurrentCart(): Promise<CartState> {
  return (await getCurrentCartContext()).state;
}

export async function addItemToCart(input: {
  productSlug: string;
  quantity: number;
  selectedSize?: string | null;
  selectedVariantId?: string | null;
  selectedVariantSlug?: string | null;
  selectedVariantSku?: string | null;
  selectedColor?: string | null;
  selectedImage?: string | null;
}) {
  const product = await getProduct(input.productSlug);

  if (!product) {
    throw new Error("Product not found.");
  }

  const selectedSize = input.selectedSize || product.sizes[0] || null;
  const { selected } = resolveVariantSelection(product, {
    selectedVariantId: input.selectedVariantId,
    selectedVariantSlug: input.selectedVariantSlug,
    selectedColor: input.selectedColor,
  });

  const productId = product.id || product.slug;
  const productName = product.name || product.title;
  const variantId = input.selectedVariantId || selected?.id || `${product.slug}-default`;
  const variantSlug = input.selectedVariantSlug || selected?.slug || "default";
  const selectedColor = input.selectedColor || selected?.colorName || product.colors[0] || null;
  const sku = input.selectedVariantSku || selected?.sku || `${product.slug.toUpperCase()}-${variantSlug.toUpperCase()}`;
  const image = input.selectedImage || selected?.images.main || product.baseImage || product.image?.src || null;
  const quantity = Math.max(1, Math.min(input.quantity || 1, 10));

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const cart = await getOrCreateSupabaseCart();

    if (admin && cart) {
      const existingLookup = await admin
        .from("cart_items")
        .select("id,quantity")
        .eq("cart_id", cart.id)
        .eq("product_slug", input.productSlug)
        .eq("variant_id", variantId)
        .eq("selected_size", selectedSize)
        .maybeSingle<{ id: string; quantity: number }>();

      let existing = existingLookup.data;
      let schemaSupportsVariants = !existingLookup.error;

      if (existingLookup.error) {
        const fallbackLookup = await admin
          .from("cart_items")
          .select("id,quantity")
          .eq("cart_id", cart.id)
          .eq("product_slug", input.productSlug)
          .eq("selected_size", selectedSize)
          .eq("selected_color", selectedColor)
          .maybeSingle<{ id: string; quantity: number }>();

        existing = fallbackLookup.data;
        schemaSupportsVariants = false;
      }

      if (existing) {
        await admin
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
      } else {
        if (schemaSupportsVariants) {
          await admin.from("cart_items").insert({
            cart_id: cart.id,
            product_slug: input.productSlug,
            product_id: productId,
            product_name: productName,
            variant_id: variantId,
            variant_slug: variantSlug,
            sku,
            quantity,
            selected_size: selectedSize,
            selected_color: selectedColor,
            image,
          });
        } else {
          await admin.from("cart_items").insert({
            cart_id: cart.id,
            product_slug: input.productSlug,
            quantity,
            selected_size: selectedSize,
            selected_color: selectedColor,
          });
        }
      }

      return;
    }
  }

  const items = await readLocalCartItems();
  const id = buildLocalItemId(productId, variantId, selectedSize);
  const existing = items.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id,
      productId,
      productName,
      productSlug: input.productSlug,
      variantId,
      variantSlug,
      sku,
      quantity,
      selectedSize,
      selectedColor,
      image,
    });
  }

  await writeLocalCartItems(items);
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const nextQuantity = Math.max(1, Math.min(quantity, 10));

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    if (admin) {
      await admin.from("cart_items").update({ quantity: nextQuantity }).eq("id", itemId);
      return;
    }
  }

  const items = await readLocalCartItems();
  const target = items.find((item) => item.id === itemId);
  if (target) {
    target.quantity = nextQuantity;
    await writeLocalCartItems(items);
  }
}

export async function removeCartItem(itemId: string) {
  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    if (admin) {
      await admin.from("cart_items").delete().eq("id", itemId);
      return;
    }
  }

  const items = await readLocalCartItems();
  await writeLocalCartItems(items.filter((item) => item.id !== itemId));
}

export async function clearCart(cartId?: string | null) {
  if (hasSupabaseAdminConfig() && cartId) {
    const admin = createSupabaseAdminClient();
    if (admin) {
      await admin.from("carts").update({ status: "converted" }).eq("id", cartId);
      return;
    }
  }

  await clearLocalCartStorage();
}
