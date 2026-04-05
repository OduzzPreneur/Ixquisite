import Link from "next/link";
import { UtilityPageHeader } from "@/components/page-templates";
import { getLookbookLooks, getProductsBySlugs } from "@/lib/catalog";
import { getVisualAsset } from "@/lib/visual-assets";
import { ProductCard, VisualPanel } from "@/components/ui";

export default async function LookbookPage() {
  const looks = await getLookbookLooks();
  const featuredProducts = await getProductsBySlugs(looks.flatMap((look) => look.products).slice(0, 4));

  return (
    <>
      <UtilityPageHeader
        eyebrow="Lookbook"
        title="Full outfits, not disconnected products."
        copy="Each look is composed to show how Ixquisite styling should feel in motion: quiet, tailored, and immediately shoppable."
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
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
