import Link from "next/link";
import { UtilityPageHeader } from "@/components/page-templates";

export default function ForgotPasswordPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="Password recovery"
        title="Reset account access without contacting support."
        copy="Password recovery is not wired yet. Once Supabase reset emails are configured, this page should post the email address and send a recovery link."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Forgot password" }]}
      />
      <section className="page-section">
        <div className="surface-panel">
          <div className="field">
            <label>Email</label>
            <input placeholder="you@example.com" type="email" disabled />
          </div>
          <div className="hero__actions" style={{ marginTop: "1rem" }}>
            <button className="button" type="button" disabled>
              Reset coming next
            </button>
            <Link href="/sign-in" className="pill-link">
              Return to sign in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
