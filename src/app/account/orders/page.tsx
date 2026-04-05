import Link from "next/link";
import { AccountShell } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getOrdersForCurrentUser } from "@/lib/orders";

export default async function AccountOrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <AccountShell title="Order history" copy="Customers should be able to review order status, totals, and re-order paths without contacting support.">
      <div className="table-like">
        {orders.map((order) => (
          <article key={order.id}>
            <div>
              <strong>{order.reference}</strong>
              <p className="muted">{order.status} · {order.payment_status}</p>
            </div>
            <div style={{ display: "grid", gap: "0.5rem", justifyItems: "end" }}>
              <span>{formatPrice(order.total)}</span>
              <Link href={`/account/orders/${order.id}`} className="pill-link">View details</Link>
            </div>
          </article>
        ))}
      </div>
    </AccountShell>
  );
}
