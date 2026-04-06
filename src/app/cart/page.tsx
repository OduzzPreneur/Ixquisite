import Link from "next/link";
import { removeCartItemAction, updateCartItemQuantityAction } from "@/app/actions/cart";
import { UtilityPageHeader } from "@/components/page-templates";
import { ProductCard } from "@/components/ui";
import { formatPrice } from "@/data/site";
import { getCurrentCart } from "@/lib/cart";
import { getProductsBySlugs } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export default async function CartPage() {
  const cart = await getCurrentCart();
  const [recommendations, wishlistSlugs] = await Promise.all([
    getProductsBySlugs([
      "ivory-broadcloth-shirt",
      "regent-silk-tie",
      "heirloom-accessory-set",
    ]),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  return (
    <>
      <UtilityPageHeader
        eyebrow="Cart"
        title="A calm, premium cart review."
        copy="The cart should feel decisive, with enough trust and cross-sell depth to finish the outfit without becoming noisy."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />
      <section className="page-section">
        <div className="checkout-layout">
          <div className="support-card">
            {cart.items.length ? (
              <div className="table-like">
                {cart.items.map((item) => (
                  <article key={item.id}>
                    <div>
                      <strong>{item.product.title}</strong>
                      <p className="muted">
                        {item.selectedSize ? `Size ${item.selectedSize}` : "Standard"}
                        {item.selectedColor ? ` · ${item.selectedColor}` : ""}
                      </p>
                      <div className="hero__actions hero__actions--compact" style={{ marginTop: "0.8rem" }}>
                        <form action={updateCartItemQuantityAction}>
                          <input type="hidden" name="item_id" value={item.id} />
                          <input type="hidden" name="quantity" value={Math.max(1, item.quantity - 1)} />
                          <button type="submit" className="pill-link">-</button>
                        </form>
                        <span className="pill-link">Qty {item.quantity}</span>
                        <form action={updateCartItemQuantityAction}>
                          <input type="hidden" name="item_id" value={item.id} />
                          <input type="hidden" name="quantity" value={item.quantity + 1} />
                          <button type="submit" className="pill-link">+</button>
                        </form>
                        <form action={removeCartItemAction}>
                          <input type="hidden" name="item_id" value={item.id} />
                          <button type="submit" className="pill-link">Remove</button>
                        </form>
                      </div>
                    </div>
                    <span>{formatPrice(item.lineTotal)}</span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div>
                  <h2 className="minor-title">Your cart is empty.</h2>
                  <p className="body-copy" style={{ marginTop: "0.8rem" }}>
                    Add a suit, shirt, or accessory from any product page to start building the order.
                  </p>
                  <Link href="/category/suits" className="button" style={{ marginTop: "1rem" }}>
                    Shop suits
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="checkout-card">
            <h3 className="minor-title">Order summary</h3>
            <div className="table-like" style={{ marginTop: "1rem" }}>
              <article>
                <div>
                  <strong>Items</strong>
                  <p className="muted">{cart.itemCount} piece(s)</p>
                </div>
                <span>{formatPrice(cart.subtotal)}</span>
              </article>
              <article>
                <div>
                  <strong>Estimated delivery</strong>
                  <p className="muted">2-4 days</p>
                </div>
                <span>{formatPrice(cart.items.length ? 8000 : 0)}</span>
              </article>
            </div>
            <div className="price-row" style={{ marginTop: "1rem" }}>
              <strong>Total</strong>
              <strong>{formatPrice(cart.subtotal + (cart.items.length ? 8000 : 0))}</strong>
            </div>
            <Link href="/checkout" className="button" style={{ width: "100%", marginTop: "1rem" }}>
              Proceed to checkout
            </Link>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Recommended add-ons</p>
          <h2 className="section-title">Finish the look while you are here.</h2>
        </div>
        <div className="product-grid">
          {recommendations.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              wishlistState={wishlistSlugs.includes(product.slug) ? "saved" : "idle"}
              wishlistNext="/cart"
            />
          ))}
        </div>
      </section>
    </>
  );
}
