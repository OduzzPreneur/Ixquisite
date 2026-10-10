import Link from "next/link";
import { UtilityPageHeader } from "@/components/page-templates";
import { getLookbookLooks, getProductsBySlugs } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { getVisualAsset } from "@/lib/visual-assets";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import { ProductCard, VisualPanel } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Men's Lookbook",
  description:
    "Explore the Ixquisite lookbook for complete premium menswear outfits built around suits, shirts, trousers, ties, and accessories that work together.",
  path: "/lookbook",
});

export default async function LookbookPage() {
  const looks = await getLookbookLooks();
  const [featuredProducts, wishlistSlugs] = await Promise.all([
    getProductsBySlugs(looks.flatMap((look) => look.products).slice(0, 4)),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  return (
    <>
      <UtilityPageHeader
        eyebrow="Curated Editorial"
        title="The Ixquisite Lookbook"
        copy="Complete sartorial ensembles curated for executive authority, quiet confidence, and unforgettable ceremonial presence."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Lookbook" }]}
      />
      <section className="page-section">
        <div className="grid grid--3">
          {await Promise.all(
            looks.map(async (look) => {
              const products = await getProductsBySlugs(look.products);

              return (
                <article key={look.slug} className="support-card">
                  <VisualPanel
                    title={look.title}
                    kicker="Lookbook look"
                    tone={look.tone}
                    size="landscape"
                    image={getVisualAsset(look.title)}
                  />
                  <p className="body-copy">{look.description}</p>
                  <div className="pill-row">
                    {products.map((product) => (
                      <Link key={product.slug} href={`/product/${product.slug}`} className="pill-link">
                        {product.title}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            }),
          )}
        </div>
      </section>
      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Shop the looks</p>
          <h2 className="section-title">Key pieces from the current looks.</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              wishlistState={wishlistSlugs.includes(product.slug) ? "saved" : "idle"}
              wishlistNext="/lookbook"
            />
          ))}
        </div>
      </section>
    </>
  );
}
