"use server";

import { redirect } from "next/navigation";
import { addItemToCart, removeCartItem, updateCartItemQuantity } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const productSlug = String(formData.get("product_slug") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const selectedSize = String(formData.get("selected_size") ?? "").trim() || null;
  const selectedColor = String(formData.get("selected_color") ?? "").trim() || null;

  if (!productSlug) {
    redirect("/cart");
  }

  await addItemToCart({
    productSlug,
    quantity,
    selectedSize,
    selectedColor,
  });

  redirect("/cart");
}

export async function updateCartItemQuantityAction(formData: FormData) {
  const itemId = String(formData.get("item_id") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);

  if (itemId) {
    await updateCartItemQuantity(itemId, quantity);
  }

  redirect("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("item_id") ?? "").trim();

  if (itemId) {
    await removeCartItem(itemId);
  }

  redirect("/cart");
}
