import Link from "next/link";
import { HelpHub, UtilityPageHeader } from "@/components/page-templates";

export default function TrackOrderPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="Track order"
        title="Order visibility should be immediate and trust-building."
        copy="Tracking sits close to support because delivery confidence is part of the premium experience, not an afterthought."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <div className="support-card">
            <div className="field">
              <label htmlFor="track_order_number">Order number</label>
              <input
                id="track_order_number"
                name="order_number"
                placeholder="IXQ-24018"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label htmlFor="track_email">Email address</label>
              <input
                id="track_email"
                name="email"
                placeholder="client@example.com"
                type="email"
                autoComplete="email"
              />
            </div>
            <button type="button" className="button" style={{ width: "fit-content" }}>
              Track delivery
            </button>
          </div>
          <div className="support-card">
            <h2 className="minor-title">Latest status</h2>
            <p className="body-copy">
              Order IXQ-24018 is currently in transit and expected on Apr 8.
            </p>
            <div className="pill-row">
              <span className="pill-link">Packed</span>
              <span className="pill-link">In transit</span>
              <span className="pill-link">Out for delivery next</span>
            </div>
            <Link href="/contact" className="pill-link" style={{ width: "fit-content" }}>
              Contact support
            </Link>
          </div>
        </div>
      </section>
      <HelpHub />
    </>
  );
}
