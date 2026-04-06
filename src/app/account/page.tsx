import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { AccountShell } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getAccountDashboardData } from "@/lib/account";
import { getWishlistStateForCurrentUser } from "@/lib/wishlist";

export default async function AccountPage() {
  const [{ profile, recentOrder, addressCount, orders }, wishlistState] = await Promise.all([
    getAccountDashboardData(),
    getWishlistStateForCurrentUser(),
  ]);

  return (
    <AccountShell
      title="Account dashboard"
      copy="Your profile, saved delivery details, and order visibility stay in one calm utility surface."
    >
      <div className="summary-list">
        <div>
          <h3 className="minor-title">Profile</h3>
          <p className="body-copy">
            {profile?.fullName ?? "Ixquisite Client"}
            {profile?.email ? ` · ${profile.email}` : ""}
          </p>
        </div>
        <div>
          <h3 className="minor-title">Saved addresses</h3>
          <p className="body-copy">
            {addressCount > 0 ? `${addressCount} delivery address${addressCount > 1 ? "es" : ""}` : "No saved delivery addresses yet."}
          </p>
        </div>
        <div>
          <h3 className="minor-title">Saved pieces</h3>
          <p className="body-copy">
            {wishlistState.count > 0 ? `${wishlistState.count} item${wishlistState.count > 1 ? "s" : ""} waiting in your wishlist.` : "Your wishlist is empty for now."}
          </p>
        </div>
        <div>
          <h3 className="minor-title">Recent order</h3>
          <p className="body-copy">
            {recentOrder ? `${recentOrder.reference} · ${recentOrder.status}` : "No orders placed yet."}
          </p>
        </div>
        <div>
          <h3 className="minor-title">Order activity</h3>
          <p className="body-copy">
            {orders.length > 0 ? `${orders.length} recorded order${orders.length > 1 ? "s" : ""}` : "Your first order will appear here."}
          </p>
        </div>
      </div>

      {recentOrder ? (
        <div className="support-card" style={{ marginTop: "1.5rem" }}>
          <h3 className="minor-title">Latest order snapshot</h3>
          <p className="body-copy">
            {recentOrder.reference} is currently {recentOrder.status.toLowerCase().replace(/_/g, " ")}.
            Total: {formatPrice(recentOrder.total)}.
          </p>
        </div>
      ) : null}

      <div className="hero__actions" style={{ marginTop: "1.4rem" }}>
        <Link href="/account/orders" className="button">
          View orders
        </Link>
        <Link href="/account/profile" className="pill-link">
          Update profile
        </Link>
        <Link href="/account/addresses" className="pill-link">
          Review addresses
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="pill-link">
            Sign out
          </button>
        </form>
      </div>
    </AccountShell>
  );
}
