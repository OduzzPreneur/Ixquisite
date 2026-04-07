import Link from "next/link";
import { PostCheckoutSignupPrompt } from "@/components/post-checkout-signup-prompt";
import { UtilityPageHeader } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getAuthenticatedUser } from "@/lib/auth";
import { getOrderById, getOrderEtaLabel } from "@/lib/orders";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reference?: string }>;
}) {
  const params = await searchParams;
  const [order, user] = await Promise.all([
    params.order ? getOrderById(params.order) : null,
    getAuthenticatedUser(),
  ]);
  const eta = getOrderEtaLabel();
  const orderReference = order?.reference ?? params.reference ?? null;
  const isSuccessfulCheckout = order ? order.payment_status === "paid" || order.status === "confirmed" : false;
  const signupPrompt = order && isSuccessfulCheckout && !user && !order.user_id && order.email && orderReference
    ? {
      orderReference,
      email: order.email,
      createAccountHref: `/create-account?email=${encodeURIComponent(order.email)}&next=${encodeURIComponent(`/account/orders/${order.id}`)}`,
    }
    : null;

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
              <p className="body-copy">{orderReference ?? "Pending"}</p>
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
            <Link
              href={orderReference ? `/track-order?reference=${encodeURIComponent(orderReference)}` : "/track-order"}
              className="button"
            >
              Track order
            </Link>
            <Link href="/new-in" className="pill-link">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
      {signupPrompt ? (
        <PostCheckoutSignupPrompt
          orderReference={signupPrompt.orderReference}
          email={signupPrompt.email}
          createAccountHref={signupPrompt.createAccountHref}
        />
      ) : null}
    </>
  );
}
