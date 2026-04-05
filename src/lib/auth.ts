import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

export type AuthUserSummary = {
  id: string;
  email: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthUserSummary | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export async function requireAuthenticatedUser(next = "/account") {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  return user;
}
