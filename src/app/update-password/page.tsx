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
        eyebrow="Account Security"
        title="Set a New Password"
        copy="Enter a secure new password to update your Ixquisite account credentials and regain access."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Update password" }]}
      />
      <section className="page-section">
        <UpdatePasswordForm />
      </section>
    </>
  );
}
