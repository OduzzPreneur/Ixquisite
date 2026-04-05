import { beginCheckoutAction } from "@/app/actions/checkout";
import { UtilityPageHeader } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getCurrentCart } from "@/lib/cart";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const cart = await getCurrentCart();
  const deliveryFee = cart.items.length ? 8000 : 0;

  return (
    <>
      <UtilityPageHeader
        eyebrow="Checkout"
        title="Low-friction checkout with visible trust."
        copy="Contact, delivery, shipping, payment, and review should sit in one calm flow with no unnecessary distractions."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section className="page-section">
        <div className="checkout-layout">
          <form action={beginCheckoutAction} className="support-card">
            {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
            <div className="form-grid">
              <div className="field">
                <label htmlFor="full_name">Full name</label>
                <input id="full_name" name="full_name" placeholder="Client Name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" placeholder="you@example.com" type="email" />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" placeholder="0800 000 0000" />
              </div>
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" placeholder="Lagos" />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="shipping_address">Delivery address</label>
                <textarea id="shipping_address" name="shipping_address" placeholder="Street, landmark, and notes" />
              </div>
              <div className="field">
                <label htmlFor="shipping_method">Shipping method</label>
                <select id="shipping_method" name="shipping_method" defaultValue="standard">
                  <option value="standard">Standard delivery · 2-4 days</option>
                  <option value="express">Express delivery · 24-48 hours</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="payment_method">Payment</label>
                <select id="payment_method" name="payment_method" defaultValue="paystack">
                  <option value="paystack">Paystack card payment</option>
                </select>
              </div>
            </div>
            <div className="pill-row" style={{ marginTop: "1rem" }}>
              <span className="pill-link">Guest checkout enabled</span>
              <span className="pill-link">Secure payment flow</span>
              <span className="pill-link">Returns guidance visible</span>
            </div>
            <button type="submit" className="button" style={{ width: "fit-content", marginTop: "1rem" }} disabled={!cart.items.length}>
              Continue to Paystack
            </button>
          </form>
          <div className="checkout-card">
            <h3 className="minor-title">Review order</h3>
            <div className="table-like" style={{ marginTop: "1rem" }}>
              {cart.items.map((item) => (
                <article key={item.id}>
                  <div>
                    <strong>{item.product.title}</strong>
                    <p className="muted">
                      {item.quantity} × {item.selectedSize ?? "Standard"}
                      {item.selectedColor ? ` · ${item.selectedColor}` : ""}
                    </p>
                  </div>
                  <span>{formatPrice(item.lineTotal)}</span>
                </article>
              ))}
              <article>
                <div>
                  <strong>Delivery</strong>
                  <p className="muted">2-4 days</p>
                </div>
                <span>{formatPrice(deliveryFee)}</span>
              </article>
            </div>
            <div className="price-row" style={{ marginTop: "1rem" }}>
              <strong>Total</strong>
              <strong>{formatPrice(cart.subtotal + deliveryFee)}</strong>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
