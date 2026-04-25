import { requireAuthenticatedUser } from "@/lib/auth";
import { buildNoIndexMetadata } from "@/lib/seo";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

export const metadata = buildNoIndexMetadata(
  "Account",
  "Private Ixquisite account area.",
);

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (hasSupabaseConfig()) {
    await requireAuthenticatedUser("/account");
  }

  return children;
}
