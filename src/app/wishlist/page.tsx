import Link from "next/link";
import { removeFromWishlistAction } from "@/app/actions/wishlist";
import { UtilityPageHeader } from "@/components/page-templates";
import { ProductCard } from "@/components/ui";
import { buildNoIndexMetadata } from "@/lib/seo";
import { getWishlistProductsForCurrentUser, getWishlistStateForCurrentUser } from "@/lib/wishlist";

export const metadata = buildNoIndexMetadata(
  "Wishlist",
  "Private wishlist page for saved Ixquisite products.",
);

export default async function WishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, wishlistState, products] = await Promise.all([
    searchParams,
    getWishlistStateForCurrentUser(),
    getWishlistProductsForCurrentUser(),
  ]);

  return (
    <>
      <UtilityPageHeader
        eyebrow="Wishlist"
        title="Saved pieces for later decisions."
        copy="Wishlists support repeat visits and keep the buying journey calm instead of rushed."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <section className="page-section">
        {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
        {params.message ? <p className="auth-notice auth-notice--success">{params.message}</p> : null}

        {!wishlistState.isAuthenticated ? (
          <div className="empty-state surface-panel">
            <div>
              <h3 className="minor-title">Sign in to save pieces</h3>
              <p className="body-copy" style={{ marginTop: "0.8rem" }}>
                Your wishlist is tied to your account, so saved products stay available across visits.
              </p>
              <div className="hero__actions" style={{ marginTop: "1rem" }}>
                <Link href="/sign-in?next=/wishlist" className="button">
                  Sign in
                </Link>
                <Link href="/create-account?next=/wishlist" className="pill-link">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="price-row" style={{ marginBottom: "1rem" }}>
              <p className="muted">{products.length} saved pieces</p>
              <Link href="/account" className="pill-link">
                View in account
              </Link>
            </div>
            <div className="grid grid--3">
              {products.map((entry) => (
                <article key={`${entry.product.slug}-${entry.selectedVariantSlug ?? "default"}`} className="cta-stack">
                  <ProductCard
                    product={entry.product}
                    wishlistState="saved"
                    wishlistNext="/wishlist"
                    initialVariantSlug={entry.selectedVariantSlug ?? undefined}
                  />
                  <form action={removeFromWishlistAction}>
                    <input type="hidden" name="product_slug" value={entry.product.slug} />
                    <input type="hidden" name="selected_variant_slug" value={entry.selectedVariantSlug ?? ""} />
                    <input type="hidden" name="next" value="/wishlist" />
                    <button type="submit" className="pill-link">
                      Remove
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state surface-panel">
            <div>
              <h3 className="minor-title">No saved pieces yet</h3>
              <p className="body-copy" style={{ marginTop: "0.8rem" }}>
                Save products from any product card or product page and they will appear here.
              </p>
              <div className="hero__actions" style={{ marginTop: "1rem" }}>
                <Link href="/new-in" className="button">
                  Browse new arrivals
                </Link>
                <Link href="/category/suits" className="pill-link">
                  Shop suits
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
