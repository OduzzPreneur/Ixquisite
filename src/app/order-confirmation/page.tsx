import Link from "next/link";
import { submitOrderMeasurementsAction } from "@/app/actions/orders";
import { PostCheckoutSignupPrompt } from "@/components/post-checkout-signup-prompt";
import { UtilityPageHeader } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getAuthenticatedUser } from "@/lib/auth";
import { getMeasurementStatusLabel, getOrderById, getOrderEtaLabel } from "@/lib/orders";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reference?: string; error?: string; message?: string }>;
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
          {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
          {params.message ? <p className="auth-notice auth-notice--success">{params.message}</p> : null}
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
            <div>
              <h3 className="minor-title">Measurements</h3>
              <p className="body-copy">{order ? getMeasurementStatusLabel(order.measurement_status) : "Awaiting order"}</p>
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
      {order && isSuccessfulCheckout ? (
        <section className="page-section">
          <div className="surface-panel">
            <div className="section-head">
              <p className="eyebrow">Measurements</p>
              <h2 className="section-title">Finish the order fit details.</h2>
              <p className="section-copy">
                You have already secured the product and colour. Add measurements now, or request measurement help and the order can continue from there.
              </p>
            </div>
            <form action={submitOrderMeasurementsAction} className="cta-stack">
              <input type="hidden" name="order_id" value={order.id} />
              <input type="hidden" name="order_reference" value={order.reference} />
              <input type="hidden" name="email" value={order.email} />
              <div className="pill-row">
                <span className="pill-link">Colour selections stay attached to the order</span>
                <span className="pill-link">{getMeasurementStatusLabel(order.measurement_status)}</span>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="measurement_chest">Chest</label>
                  <input id="measurement_chest" name="measurement_chest" placeholder="40 in" defaultValue={order.measurements?.chest ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="measurement_shoulder">Shoulder</label>
                  <input id="measurement_shoulder" name="measurement_shoulder" placeholder="18 in" defaultValue={order.measurements?.shoulder ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="measurement_sleeve">Sleeve</label>
                  <input id="measurement_sleeve" name="measurement_sleeve" placeholder="25 in" defaultValue={order.measurements?.sleeve ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="measurement_waist">Waist</label>
                  <input id="measurement_waist" name="measurement_waist" placeholder="34 in" defaultValue={order.measurements?.waist ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="measurement_hips">Hips</label>
                  <input id="measurement_hips" name="measurement_hips" placeholder="40 in" defaultValue={order.measurements?.hips ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="measurement_inseam">Inseam</label>
                  <input id="measurement_inseam" name="measurement_inseam" placeholder="31 in" defaultValue={order.measurements?.inseam ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="measurement_height">Height</label>
                  <input id="measurement_height" name="measurement_height" placeholder="6 ft 1 in" defaultValue={order.measurements?.height ?? ""} />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="measurement_notes">Fit notes</label>
                  <textarea
                    id="measurement_notes"
                    name="measurement_notes"
                    placeholder="Anything the tailoring team should know about preferred fit, posture, or existing suit size."
                    defaultValue={order.measurement_notes ?? ""}
                  />
                </div>
              </div>
              <div className="hero__actions">
                <button type="submit" name="intent" value="submit_measurements" className="button">
                  Save measurements
                </button>
                <button type="submit" name="intent" value="needs_assistance" className="pill-link">
                  Need help with measurements
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}
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
