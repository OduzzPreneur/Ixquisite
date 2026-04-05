import { requireAuthenticatedUser } from "@/lib/auth";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (hasSupabaseConfig()) {
    await requireAuthenticatedUser("/account");
  }

  return children;
}
