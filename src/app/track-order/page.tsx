import Link from "next/link";
import { HelpHub, UtilityPageHeader } from "@/components/page-templates";
import { getAccountProfileForCurrentUser } from "@/lib/account";
import { buildNoIndexMetadata } from "@/lib/seo";
import { getTrackedOrder, getTrackingStages } from "@/lib/orders";

export const metadata = buildNoIndexMetadata(
  "Track order",
  "Private order tracking page.",
);

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; email?: string }>;
}) {
  const params = await searchParams;
  const profile = await getAccountProfileForCurrentUser();
  const reference = params.reference?.trim() ?? "";
  const email = params.email?.trim() ?? profile?.email ?? "";
  const order = reference ? await getTrackedOrder(reference, email) : null;
  const stages = order ? getTrackingStages(order.status, order.payment_status) : [];

  return (
    <>
      <UtilityPageHeader
        eyebrow="Track order"
        title="Track your Ixquisite order."
        copy="Enter your order reference and email address to check the latest delivery status and payment confirmation for your order."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <form method="GET" action="/track-order" className="support-card">
            <div className="field">
              <label htmlFor="track_order_number">Order number</label>
              <input
                id="track_order_number"
                name="reference"
                placeholder="IXQ-24018"
                autoComplete="off"
                defaultValue={reference}
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
                defaultValue={email}
              />
            </div>
            <button type="submit" className="button" style={{ width: "fit-content" }}>
              Track delivery
            </button>
          </form>
          <div className="support-card">
            <h2 className="minor-title">Latest status</h2>
            {order ? (
              <>
                <p className="body-copy">
                  Order {order.reference} is currently {order.status.toLowerCase().replace(/_/g, " ")}.
                  Payment is {order.payment_status.toLowerCase().replace(/_/g, " ")}.
                </p>
                <div className="pill-row">
                  {stages.map((stage) => (
                    <span key={stage} className="pill-link">
                      {stage}
                    </span>
                  ))}
                </div>
              </>
            ) : reference ? (
              <p className="body-copy">
                No matching order was found for that reference and email combination.
              </p>
            ) : (
              <p className="body-copy">
                Enter your order reference and email address to view the current delivery stage.
              </p>
            )}
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
