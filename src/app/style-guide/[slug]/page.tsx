import Link from "next/link";
import { notFound } from "next/navigation";
import { UtilityPageHeader } from "@/components/page-templates";
import { getArticle, getArticles, getProductsBySlugs } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import { ProductCard } from "@/components/ui";

const articleProductMap: Record<string, string[]> = {
  "how-to-style-a-brown-suit": ["cocoa-double-breasted-suit", "heirloom-accessory-set"],
  "shirt-and-tie-combinations": ["ivory-broadcloth-shirt", "regent-silk-tie"],
  "professional-wardrobe-essentials": ["midnight-commander-suit", "tailored-ink-trouser"],
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function StyleGuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const [relatedProducts, wishlistSlugs] = await Promise.all([
    getProductsBySlugs(articleProductMap[slug] ?? []),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  return (
    <>
      <UtilityPageHeader
        eyebrow={article.category}
        title={article.title}
        copy={article.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Style Guide", href: "/style-guide" }, { label: article.title }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <article className="support-card">
            <p className="body-copy">
              Premium editorial pages should read cleanly, with high-contrast typography and just enough supporting imagery to feel intentional. This article page demonstrates that structure with a reading surface, related products, and a path back into shopping.
            </p>
            <p className="body-copy">
              Use this format for occasion guidance, color pairing advice, and wardrobe strategy content. Each article should strengthen the brand and increase confidence before purchase.
            </p>
            <Link href="/style-guide" className="pill-link" style={{ width: "fit-content" }}>
              Back to style guide
            </Link>
          </article>
          <article className="support-card">
            <h2 className="minor-title">Related products</h2>
            <div className="product-grid">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  wishlistState={wishlistSlugs.includes(product.slug) ? "saved" : "idle"}
                  wishlistNext={`/style-guide/${article.slug}`}
                />
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
