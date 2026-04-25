import { UtilityPageHeader } from "@/components/page-templates";
import { UpdatePasswordForm } from "@/components/update-password-form";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata = buildNoIndexMetadata(
  "Update password",
  "Private password update page for Ixquisite customers.",
);

export default function UpdatePasswordPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="Update password"
        title="Set a new password and return to your account."
        copy="This page is used after a Supabase recovery email redirects you back into the storefront."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Update password" }]}
      />
      <section className="page-section">
        <UpdatePasswordForm />
      </section>
    </>
  );
}
