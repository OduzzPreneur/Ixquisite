"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

function getNextTarget(formData: FormData, fallback: string) {
  const next = formData.get("next");
  return typeof next === "string" && next.startsWith("/") ? next : fallback;
}

export async function addToWishlistAction(formData: FormData) {
  const next = getNextTarget(formData, "/wishlist");

  if (!hasSupabaseConfig()) {
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  const user = await requireAuthenticatedUser(next);
  const supabase = await createSupabaseAuthServerClient();
  const productSlug = String(formData.get("product_slug") ?? "").trim();

  if (!supabase || !productSlug) {
    redirect(`${next}?error=Choose%20a%20product%20to%20save.`);
  }

  const { error } = await supabase
    .from("wishlist_items")
    .upsert({ user_id: user.id, product_slug: productSlug }, { onConflict: "user_id,product_slug" });

  if (error) {
    redirect(`${next}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/wishlist");
  revalidatePath("/account");
  revalidatePath(next);
  redirect(`${next}?message=Saved%20to%20wishlist.`);
}

export async function removeFromWishlistAction(formData: FormData) {
  const next = getNextTarget(formData, "/wishlist");

  if (!hasSupabaseConfig()) {
    redirect(next);
  }

  const user = await requireAuthenticatedUser(next);
  const supabase = await createSupabaseAuthServerClient();
  const productSlug = String(formData.get("product_slug") ?? "").trim();

  if (!supabase || !productSlug) {
    redirect(`${next}?error=Choose%20a%20product%20to%20remove.`);
  }

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_slug", productSlug);

  if (error) {
    redirect(`${next}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/wishlist");
  revalidatePath("/account");
  revalidatePath(next);
  redirect(`${next}?message=Removed%20from%20wishlist.`);
}
