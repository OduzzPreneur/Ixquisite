import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart";
import { addToWishlistAction, removeFromWishlistAction } from "@/app/actions/wishlist";
import { UtilityPageHeader } from "@/components/page-templates";
import { formatPrice } from "@/data/site";
import { getProduct, getProducts, getProductsBySlugs } from "@/lib/catalog";
import { getVisualAsset } from "@/lib/visual-assets";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import { ProductCard, VisualPanel } from "@/components/ui";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const [allProducts, completeLook, wishlistSlugs] = await Promise.all([
    getProducts(),
    getProductsBySlugs(product.completeTheLook),
    getWishlistProductSlugsForCurrentUser(),
  ]);
  const related = allProducts.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);
  const isSaved = wishlistSlugs.includes(product.slug);

  return (
    <>
      <UtilityPageHeader
        eyebrow={product.category}
        title={product.title}
        copy={product.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: product.category, href: `/category/${product.category}` }, { label: product.title }]}
      />
      <section className="page-section">
        <div className="detail-layout">
          <div className="gallery-grid">
            <VisualPanel
              title={product.title}
              kicker="Front view"
              tone={product.tone}
              size="portrait"
              image={getVisualAsset(product.title)}
              preload
            />
            <div className="gallery-stack">
              <VisualPanel
                title="Fabric detail"
                kicker="Close-up"
                tone={product.tone}
                size="wide"
                image={getVisualAsset(`${product.title}::detail`)}
              />
              <VisualPanel
                title="Styled full look"
                kicker="Look pairing"
                tone={product.tone}
                size="wide"
                image={getVisualAsset(`${product.title}::styled`)}
              />
            </div>
          </div>
          <div className="support-card product-detail-card">
            {query.error ? <p className="auth-notice auth-notice--error">{query.error}</p> : null}
            {query.message ? <p className="auth-notice auth-notice--success">{query.message}</p> : null}
            <div className="price-row">
              <h1 className="page-title" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>{product.title}</h1>
              <strong>{formatPrice(product.price)}</strong>
            </div>
            <p className="body-copy">{product.blurb}</p>
            <div className="pill-row">
              <span className="pill-link">{product.availability}</span>
              <span className="pill-link">{product.delivery}</span>
              <span className="pill-link">{product.fit}</span>
            </div>

            <form action={addToCartAction} className="cta-stack">
              <input type="hidden" name="product_slug" value={product.slug} />
              <div className="field">
                <label htmlFor="selected_size">Size</label>
                <select id="selected_size" name="selected_size" defaultValue={product.sizes[0] ?? ""}>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="selected_color">Colour</label>
                <select id="selected_color" name="selected_color" defaultValue={product.colors[0] ?? ""}>
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="quantity">Quantity</label>
                <select id="quantity" name="quantity" defaultValue="1">
                  {[1, 2, 3, 4].map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hero__actions">
                <button type="submit" className="button">Add to cart</button>
                <input type="hidden" name="next" value={`/product/${product.slug}`} />
                <button
                  type="submit"
                  formAction={isSaved ? removeFromWishlistAction : addToWishlistAction}
                  className="pill-link"
                >
                  {isSaved ? "Remove" : "Save"}
                </button>
                <Link href="/checkout" className="pill-link">Buy now</Link>
              </div>
            </form>

            <div className="tab-list">
              <div className="tab-item">
                <h4>Fit and size confidence</h4>
                <p className="body-copy">Structured fit notes and a direct route to the size guide reduce hesitation before checkout.</p>
              </div>
              <div className="tab-item">
                <h4>Fabric & care</h4>
                <p className="body-copy">{product.details.join(" · ")}</p>
              </div>
              <div className="tab-item">
                <h4>Shipping & returns</h4>
                <p className="body-copy">Fast dispatch, visible tracking, and policy routes that stay close to the purchase action.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Complete the look</p>
          <h2 className="section-title">Recommended pairings for this piece.</h2>
        </div>
        <div className="product-grid">
          {completeLook.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              wishlistState={wishlistSlugs.includes(item.slug) ? "saved" : "idle"}
              wishlistNext={`/product/${product.slug}`}
            />
          ))}
        </div>
      </section>
      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Related products</p>
          <h2 className="section-title">More in the same wardrobe lane.</h2>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              wishlistState={wishlistSlugs.includes(item.slug) ? "saved" : "idle"}
              wishlistNext={`/product/${product.slug}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
