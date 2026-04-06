"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureProfileForCurrentUser } from "@/lib/account";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getSiteUrl, hasSupabaseConfig } from "@/lib/supabase/shared";

function getRedirectTarget(formData: FormData, fallback: string) {
  const next = formData.get("next");
  return typeof next === "string" && next.startsWith("/") ? next : fallback;
}

export async function signInAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/sign-in?error=Add%20Supabase%20credentials%20to%20enable%20authentication.");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getRedirectTarget(formData, "/account");
  const supabase = await createSupabaseAuthServerClient();

  if (!email || !password || !supabase) {
    redirect("/sign-in?error=Enter%20your%20email%20and%20password.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  try {
    await ensureProfileForCurrentUser();
  } catch {
    // Authentication should not fail just because profile sync is unavailable.
  }
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/create-account?error=Add%20Supabase%20credentials%20to%20enable%20sign%20up.");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseAuthServerClient();

  if (!fullName || !email || !password || !supabase) {
    redirect("/create-account?error=Complete%20all%20required%20fields.");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
    },
  });

  if (error) {
    redirect(`/create-account?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/sign-in?message=Account%20created.%20Sign%20in%20to%20continue.");
}

export async function requestPasswordResetAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/forgot-password?error=Add%20Supabase%20credentials%20to%20enable%20password%20reset.");
  }

  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createSupabaseAuthServerClient();

  if (!email || !supabase) {
    redirect("/forgot-password?error=Enter%20the%20email%20address%20for%20your%20account.");
  }

  const redirectTo = `${getSiteUrl()}/update-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/forgot-password?message=${encodeURIComponent(
      "Check your email for the reset link. Make sure the update-password URL is allowed in Supabase redirect settings.",
    )}`,
  );
}

export async function signOutAction() {
  if (!hasSupabaseConfig()) {
    redirect("/");
  }

  const supabase = await createSupabaseAuthServerClient();
  await supabase?.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
