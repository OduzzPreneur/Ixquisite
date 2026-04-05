import "server-only";

import { cookies } from "next/headers";
import { getProduct, getProductsBySlugs } from "@/lib/catalog";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/auth";
import type { Product } from "@/data/site";

const CART_COOKIE = "ixq_cart_state";
const CART_TOKEN_COOKIE = "ixq_cart_token";
const CART_COOKIE_DAYS = 30;

export type CartLine = {
  id: string;
  productSlug: string;
  product: Product;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  lineTotal: number;
};

export type CartState = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
};

type LocalCartItem = {
  id: string;
  productSlug: string;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
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
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
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
    const parsed = JSON.parse(value) as LocalCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serializeLocalCart(items: LocalCartItem[]) {
  return JSON.stringify(items);
}

function buildLocalItemId(productSlug: string, selectedSize: string | null, selectedColor: string | null) {
  return [productSlug, selectedSize ?? "default-size", selectedColor ?? "default-colour"].join("::");
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
        productSlug: item.productSlug,
        product,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
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

async function ensureCartToken() {
  const cookieStore = await getCookieStore();
  const existing = cookieStore.get(CART_TOKEN_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  cookieStore.set(CART_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * CART_COOKIE_DAYS,
  });

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

async function getOrCreateSupabaseCart() {
  if (!hasSupabaseAdminConfig()) {
    return null;
  }

  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();
  const token = await ensureCartToken();

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

  const { data: existingGuestCart } = await admin
    .from("carts")
    .select("id,cart_token,user_id,status")
    .eq("status", "open")
    .eq(user ? "user_id" : "cart_token", user ? user.id : token)
    .maybeSingle<SupabaseCart>();

  if (existingGuestCart) {
    return existingGuestCart;
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
    .select("id,cart_id,product_slug,quantity,selected_size,selected_color")
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });

  return (data as SupabaseCartItem[] | null) ?? [];
}

function mapSupabaseItems(items: SupabaseCartItem[]): LocalCartItem[] {
  return items.map((item) => ({
    id: item.id,
    productSlug: item.product_slug,
    quantity: item.quantity,
    selectedSize: item.selected_size,
    selectedColor: item.selected_color,
  }));
}

export async function getCurrentCartContext(): Promise<CartContext> {
  if (hasSupabaseAdminConfig()) {
    const cart = await getOrCreateSupabaseCart();

    if (cart) {
      const items = await readSupabaseCartItems(cart.id);
      return {
        state: await hydrateCart(mapSupabaseItems(items)),
        cartId: cart.id,
        cartToken: cart.cart_token,
        source: "supabase",
      };
    }
  }

  const items = await readLocalCartItems();
  return {
    state: await hydrateCart(items),
    cartId: null,
    cartToken: await ensureCartToken(),
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
  selectedColor?: string | null;
}) {
  const product = await getProduct(input.productSlug);

  if (!product) {
    throw new Error("Product not found.");
  }

  const selectedSize = input.selectedSize || product.sizes[0] || null;
  const selectedColor = input.selectedColor || product.colors[0] || null;
  const quantity = Math.max(1, Math.min(input.quantity || 1, 10));

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const cart = await getOrCreateSupabaseCart();

    if (admin && cart) {
      const { data: existing } = await admin
        .from("cart_items")
        .select("id,quantity")
        .eq("cart_id", cart.id)
        .eq("product_slug", input.productSlug)
        .eq("selected_size", selectedSize)
        .eq("selected_color", selectedColor)
        .maybeSingle<{ id: string; quantity: number }>();

      if (existing) {
        await admin
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
      } else {
        await admin.from("cart_items").insert({
          cart_id: cart.id,
          product_slug: input.productSlug,
          quantity,
          selected_size: selectedSize,
          selected_color: selectedColor,
        });
      }

      return;
    }
  }

  const items = await readLocalCartItems();
  const id = buildLocalItemId(input.productSlug, selectedSize, selectedColor);
  const existing = items.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id,
      productSlug: input.productSlug,
      quantity,
      selectedSize,
      selectedColor,
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
