import Link from "next/link";
import { UtilityPageHeader } from "@/components/page-templates";
import { getProductsBySlugs } from "@/lib/catalog";
import { ProductCard } from "@/components/ui";

export default async function WishlistPage() {
  const products = await getProductsBySlugs([
    "midnight-commander-suit",
    "cocoa-double-breasted-suit",
    "ivory-broadcloth-shirt",
    "heirloom-accessory-set",
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
        <div className="price-row" style={{ marginBottom: "1rem" }}>
          <p className="muted">{products.length} saved pieces</p>
          <Link href="/account" className="pill-link">
            View in account
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
