import Link from "next/link";
import { AccountShell } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getOrdersForCurrentUser } from "@/lib/orders";

export default async function AccountOrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <AccountShell title="Order history" copy="Customers should be able to review order status, totals, and re-order paths without contacting support.">
      {orders.length ? (
        <div className="table-like">
          {orders.map((order) => (
            <article key={order.id}>
              <div>
                <strong>{order.reference}</strong>
                <p className="muted">{order.status} · {order.payment_status}</p>
              </div>
              <div className="table-meta">
                <span>{formatPrice(order.total)}</span>
                <Link href={`/account/orders/${order.id}`} className="pill-link">View details</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="support-card">
          <h3 className="minor-title">No order history yet</h3>
          <p className="body-copy">Your first completed Ixquisite order will appear here with status visibility and reorder access.</p>
        </div>
      )}
    </AccountShell>
  );
}
