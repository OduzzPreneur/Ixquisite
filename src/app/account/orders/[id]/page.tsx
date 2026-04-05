import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getOrderForCurrentUser } from "@/lib/orders";

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderForCurrentUser(id);

  if (!order) {
    notFound();
  }

  return (
    <AccountShell title={`Order ${order.reference}`} copy="Single-order pages should keep shipping, payment, and reorder paths close together.">
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
          <h3 className="minor-title">Items</h3>
          <p className="body-copy">{order.items.length} piece(s)</p>
        </div>
      </div>
      <div className="table-like" style={{ marginTop: "1.5rem" }}>
        {order.items.map((item) => (
          <article key={item.id}>
            <div>
              <strong>{item.product_title}</strong>
              <p className="muted">
                {item.quantity} × {item.selected_size ?? "Standard"}
                {item.selected_color ? ` · ${item.selected_color}` : ""}
              </p>
            </div>
            <span>{formatPrice(item.line_total)}</span>
          </article>
        ))}
      </div>
      <div className="hero__actions" style={{ marginTop: "1.4rem" }}>
        <Link href="/track-order" className="button">Track delivery</Link>
        <Link href="/cart" className="pill-link">Reorder</Link>
      </div>
    </AccountShell>
  );
}
