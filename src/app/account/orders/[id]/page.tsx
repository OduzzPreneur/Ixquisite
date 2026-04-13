import Link from "next/link";
import { notFound } from "next/navigation";
import { reorderOrderItemsAction } from "@/app/actions/orders";
import { AccountShell } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getMeasurementStatusLabel, getOrderForCurrentUser } from "@/lib/orders";

export default async function AccountOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const [order, query] = await Promise.all([getOrderForCurrentUser(id), searchParams]);

  if (!order) {
    notFound();
  }

  return (
    <AccountShell title={`Order ${order.reference}`} copy="Single-order pages should keep shipping, payment, and reorder paths close together.">
      {query.error ? <p className="auth-notice auth-notice--error">{query.error}</p> : null}
      <div className="summary-list">
        <div>
          <h3 className="minor-title">Status</h3>
          <p className="body-copy">{order.status}</p>
        </div>
        <div>
          <h3 className="minor-title">Total</h3>
          <p className="body-copy">{formatPrice(order.total)}</p>
        </div>
        <div>
          <h3 className="minor-title">Payment</h3>
          <p className="body-copy">{order.payment_status}</p>
        </div>
        <div>
          <h3 className="minor-title">Measurements</h3>
          <p className="body-copy">{getMeasurementStatusLabel(order.measurement_status)}</p>
        </div>
      </div>
      <div className="table-like" style={{ marginTop: "1.5rem" }}>
        {order.items.map((item) => (
          <article key={item.id}>
            <div>
              <strong>{item.product_title}</strong>
              <p className="muted">
                {item.quantity} × {item.selected_color ?? "Default colour"}
              </p>
            </div>
            <span>{formatPrice(item.line_total)}</span>
          </article>
        ))}
      </div>
      {order.measurement_notes ? (
        <div className="support-card" style={{ marginTop: "1.2rem" }}>
          <h3 className="minor-title">Measurement note</h3>
          <p className="body-copy" style={{ marginTop: "0.8rem" }}>{order.measurement_notes}</p>
        </div>
      ) : null}
      <div className="hero__actions" style={{ marginTop: "1.4rem" }}>
        <Link href={`/track-order?reference=${encodeURIComponent(order.reference)}`} className="button">Track delivery</Link>
        <Link href={`/order-confirmation?order=${encodeURIComponent(order.id)}&reference=${encodeURIComponent(order.reference)}`} className="pill-link">
          Add measurements
        </Link>
        <form action={reorderOrderItemsAction}>
          <input type="hidden" name="order_id" value={order.id} />
          <button type="submit" className="pill-link">Reorder</button>
        </form>
      </div>
    </AccountShell>
  );
}
