import Link from "next/link";
import { submitWeddingInquiryAction } from "@/app/actions/support";
import { UtilityPageHeader } from "@/components/page-templates";
import { groomCoordinationPoints, groomSupportTopics, weddingDeliveryPoints } from "@/data/site";
import { getAccountProfileForCurrentUser } from "@/lib/account";
import { getVisualAsset } from "@/lib/visual-assets";
import { VisualPanel } from "@/components/ui";

export default async function WeddingInquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, profile] = await Promise.all([searchParams, getAccountProfileForCurrentUser()]);

  return (
    <>
      <UtilityPageHeader
        eyebrow="Wedding inquiry"
        title="High-touch support for grooms, custom sizing, and wedding-party coordination."
        copy="Use this route when the package needs human support: custom ceremony colours, multiple groomsmen, premium consultation, or timing that needs more certainty."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wedding Inquiry" }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <div className="support-card">
            <VisualPanel
              title="Wedding inquiry"
              kicker="Direct support"
              tone="stone"
              size="landscape"
              image={getVisualAsset("Wedding inquiry")}
            />
            <div className="summary-list" style={{ marginTop: "1rem" }}>
              <div>
                <h3 className="minor-title">WhatsApp</h3>
                <p className="body-copy">+234 800 000 0001</p>
              </div>
              <div>
                <h3 className="minor-title">Email</h3>
                <p className="body-copy">weddings@ixquisite.com</p>
              </div>
              <div>
                <h3 className="minor-title">Best for</h3>
                <p className="body-copy">Custom sizing, premium consults, groomsmen coordination, and urgent timelines.</p>
              </div>
            </div>
            <div className="hero__actions" style={{ marginTop: "1rem" }}>
              <Link href="/groom-package" className="button">
                Back to groom package
              </Link>
              <Link href="/contact" className="pill-link">
                General contact
              </Link>
            </div>
          </div>
          <form action={submitWeddingInquiryAction} className="support-card">
            {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
            {params.message ? <p className="auth-notice auth-notice--success">{params.message}</p> : null}
            <div className="field">
              <label htmlFor="wedding_name">Full name</label>
              <input
                id="wedding_name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                defaultValue={profile?.fullName ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="wedding_email">Email</label>
              <input
                id="wedding_email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                defaultValue={profile?.email ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="wedding_event">Wedding date or timeline</label>
              <input id="wedding_event" name="timeline" placeholder="Wedding date / delivery window" />
            </div>
            <div className="field">
              <label htmlFor="wedding_message">What do you need help with?</label>
              <textarea
                id="wedding_message"
                name="message"
                placeholder="Package tier, custom sizing, theme colours, number of groomsmen, urgency"
              />
            </div>
            <button type="submit" className="button" style={{ width: "fit-content" }}>
              Send wedding inquiry
            </button>
          </form>
        </div>
      </section>

      <section className="page-section">
        <div className="grid grid--2">
          <article className="support-card">
            <p className="eyebrow">Styling support</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Reasons to use the inquiry route.
            </h2>
            <ul className="groom-list">
              {groomSupportTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
          <article className="support-card">
            <p className="eyebrow">Groomsmen support</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Coordination that stays organized.
            </h2>
            <ul className="groom-list">
              {groomCoordinationPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="grid grid--3">
          {weddingDeliveryPoints.map((point) => (
            <article key={point.title} className="support-card">
              <h3 className="minor-title">{point.title}</h3>
              <p className="body-copy">{point.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
