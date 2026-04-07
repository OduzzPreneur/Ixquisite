"use server";

import { redirect } from "next/navigation";
import { addItemToCart } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";

const tierAccessoryRules = {
  basic: false,
  standard: true,
  premium: true,
} as const;

function readSlug(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function addGroomPackageToCartAction(formData: FormData) {
  const tier = readSlug(formData, "tier");
  const suitSlug = readSlug(formData, "suit_slug");
  const shirtSlug = readSlug(formData, "shirt_slug");
  const tieSlug = readSlug(formData, "tie_slug");
  const accessorySlug = readSlug(formData, "accessory_slug");

  if (!["basic", "standard", "premium"].includes(tier)) {
    redirect("/groom-package?error=Choose%20a%20valid%20package%20tier.");
  }

  const [suit, shirt, tie, accessory] = await Promise.all([
    getProduct(suitSlug),
    getProduct(shirtSlug),
    getProduct(tieSlug),
    accessorySlug ? getProduct(accessorySlug) : Promise.resolve(null),
  ]);

  if (!suit || !shirt || !tie) {
    redirect("/groom-package?error=Choose%20valid%20package%20items.");
  }

  await addItemToCart({ productSlug: suit.slug, quantity: 1 });
  await addItemToCart({ productSlug: shirt.slug, quantity: 1 });
  await addItemToCart({ productSlug: tie.slug, quantity: 1 });

  if (tierAccessoryRules[tier as keyof typeof tierAccessoryRules]) {
    if (!accessory) {
      redirect("/groom-package?error=Choose%20a%20valid%20accessory%20finish.");
    }

    await addItemToCart({ productSlug: accessory.slug, quantity: 1 });
  }

  redirect("/cart");
}
