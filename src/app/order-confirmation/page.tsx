import Link from "next/link";
import { UtilityPageHeader } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getOrderById, getOrderEtaLabel } from "@/lib/orders";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reference?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ? await getOrderById(params.order) : null;
  const eta = getOrderEtaLabel();

  return (
    <>
      <UtilityPageHeader
        eyebrow="Order confirmed"
        title={order ? "Your order is in and being prepared." : "Payment processed."}
        copy="This screen closes the purchase with clarity: order number, delivery window, tracking path, and a route back to shopping."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Order confirmation" }]}
      />
      <section className="page-section">
        <div className="surface-panel">
          <div className="summary-list">
            <div>
              <h3 className="minor-title">Order number</h3>
              <p className="body-copy">{order?.reference ?? params.reference ?? "Pending"}</p>
            </div>
            <div>
              <h3 className="minor-title">Estimated delivery</h3>
              <p className="body-copy">{eta}</p>
            </div>
            <div>
              <h3 className="minor-title">Status</h3>
              <p className="body-copy">{order?.status ?? "confirmed"}</p>
            </div>
            <div>
              <h3 className="minor-title">Total</h3>
              <p className="body-copy">{order ? formatPrice(order.total) : "Awaiting verification"}</p>
            </div>
          </div>
          <div className="hero__actions" style={{ marginTop: "1.5rem" }}>
            <Link href="/track-order" className="button">
              Track order
            </Link>
            <Link href="/new-in" className="pill-link">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
