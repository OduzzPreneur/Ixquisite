import "server-only";

import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/admin";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAdminEmails() {
  const source = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";

  return source
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

export function hasAdminAccessConfig() {
  return hasSupabaseAdminConfig() && getAdminEmails().length > 0;
}

export async function requireAdminUser(next = "/admin") {
  const user = await requireAuthenticatedUser(next);
  const adminEmails = getAdminEmails();

  if (!hasSupabaseAdminConfig()) {
    redirect(
      `/sign-in?error=${encodeURIComponent("Admin access requires Supabase service credentials on the server.")}&next=${encodeURIComponent(next)}`,
    );
  }

  if (!adminEmails.length) {
    redirect(
      `/sign-in?error=${encodeURIComponent("Admin access is not configured. Add ADMIN_EMAILS on the server.")}&next=${encodeURIComponent(next)}`,
    );
  }

  if (!user.email || !adminEmails.includes(normalizeEmail(user.email))) {
    redirect(
      `/sign-in?error=${encodeURIComponent("This account does not have admin access.")}&next=${encodeURIComponent(next)}`,
    );
  }

  return user;
}
