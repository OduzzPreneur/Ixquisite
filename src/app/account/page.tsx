import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { AccountShell } from "@/components/page-templates";
import { accountOrders } from "@/data/site";

export default function AccountPage() {
  return (
    <AccountShell
      title="Account dashboard"
      copy="Utility-first pages keep profile, addresses, saved items, and order visibility easy to scan."
    >
      <div className="summary-list">
        <div>
          <h3 className="minor-title">Recent order</h3>
          <p className="body-copy">{accountOrders[0].id} · {accountOrders[0].status}</p>
        </div>
        <div>
          <h3 className="minor-title">Saved pieces</h3>
          <p className="body-copy">4 items waiting in your wishlist.</p>
        </div>
      </div>
      <div className="hero__actions" style={{ marginTop: "1.4rem" }}>
        <Link href="/account/orders" className="button">View orders</Link>
        <Link href="/wishlist" className="pill-link">Open wishlist</Link>
        <form action={signOutAction}>
          <button type="submit" className="pill-link">Sign out</button>
        </form>
      </div>
    </AccountShell>
  );
}
