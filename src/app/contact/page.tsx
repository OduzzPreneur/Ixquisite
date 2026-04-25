import Link from "next/link";
import { submitContactRequestAction } from "@/app/actions/support";
import { UtilityPageHeader } from "@/components/page-templates";
import { getAccountProfileForCurrentUser } from "@/lib/account";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Ixquisite",
  description:
    "Contact Ixquisite for sizing guidance, delivery questions, corporate menswear requests, and premium styling support.",
  path: "/contact",
  keywords: ["contact Ixquisite", "menswear support", "corporate wear support", "groom package help"],
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, profile] = await Promise.all([searchParams, getAccountProfileForCurrentUser()]);

  return (
    <>
      <UtilityPageHeader
        eyebrow="Contact"
        title="Contact Ixquisite for sizing, delivery, and wardrobe support."
        copy="Use the contact form for product questions, delivery clarification, corporate requests, and premium styling support without relying on generic customer-service loops."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <div className="support-card">
            <div className="summary-list">
              <div>
                <h3 className="minor-title">General support</h3>
                <p className="body-copy">Use the contact form for product, delivery, and order questions.</p>
              </div>
              <div>
                <h3 className="minor-title">Wedding requests</h3>
                <p className="body-copy">For ceremony styling or groomsmen coordination, use the dedicated wedding inquiry route.</p>
              </div>
              <div>
                <h3 className="minor-title">Response window</h3>
                <p className="body-copy">Support requests are reviewed as quickly as possible during working hours.</p>
              </div>
              <div>
                <h3 className="minor-title">Best for</h3>
                <p className="body-copy">Sizing guidance, delivery clarification, corporate orders, and product pairing help.</p>
              </div>
            </div>
            <div className="hero__actions" style={{ marginTop: "1rem" }}>
              <Link href="/wedding-inquiry" className="button">
                Wedding inquiry
              </Link>
              <Link href="/size-guide" className="pill-link">
                View size guide
              </Link>
            </div>
          </div>
          <form action={submitContactRequestAction} className="support-card">
            {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
            {params.message ? <p className="auth-notice auth-notice--success">{params.message}</p> : null}
            <div className="field">
              <label htmlFor="contact_name">Name</label>
              <input
                id="contact_name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                defaultValue={profile?.fullName ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="contact_email">Email</label>
              <input
                id="contact_email"
                name="email"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                defaultValue={profile?.email ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="contact_message">Message</label>
              <textarea
                id="contact_message"
                name="message"
                placeholder="Sizing help, corporate order, or delivery question"
              />
            </div>
            <button type="submit" className="button" style={{ width: "fit-content" }}>
              Send message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
