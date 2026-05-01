"use server";

import { redirect } from "next/navigation";
import { addItemToCart, removeCartItem, updateCartItemQuantity } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const productSlug = String(formData.get("product_slug") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const selectedSize = String(formData.get("selected_size") ?? "").trim() || null;
  const selectedVariantId = String(formData.get("selected_variant_id") ?? "").trim() || null;
  const selectedVariantSlug = String(formData.get("selected_variant_slug") ?? "").trim() || null;
  const selectedVariantSku = String(formData.get("selected_variant_sku") ?? "").trim() || null;
  const selectedColor = String(formData.get("selected_color") ?? "").trim() || null;
  const selectedImage = String(formData.get("selected_image") ?? "").trim() || null;

  if (!productSlug) {
    redirect("/cart");
  }

  await addItemToCart({
    productSlug,
    quantity,
    selectedSize,
    selectedVariantId,
    selectedVariantSlug,
    selectedVariantSku,
    selectedColor,
    selectedImage,
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
