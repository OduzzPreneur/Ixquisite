import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { UtilityPageHeader } from "@/components/page-templates";
import { getArticle, getArticles, getProductsBySlugs } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { getVisualAsset } from "@/lib/visual-assets";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import { ProductCard } from "@/components/ui";

const articleProductMap: Record<string, string[]> = {
  "how-to-style-a-brown-suit": ["cocoa-double-breasted-suit", "heirloom-accessory-set"],
  "shirt-and-tie-combinations": ["ivory-broadcloth-shirt", "regent-silk-tie"],
  "professional-wardrobe-essentials": ["midnight-commander-suit", "tailored-ink-trouser"],
};

const articleContent: Record<
  string,
  Array<{ heading: string; paragraphs: string[]; links?: Array<{ href: string; label: string }> }>
> = {
  "how-to-style-a-brown-suit": [
    {
      heading: "Use brown as a refined formal colour, not a casual compromise",
      paragraphs: [
        "A brown suit works best when the tone is rich, the silhouette is clean, and the finishing pieces stay controlled. That is what keeps it formal enough for wedding guest dressing, evening dinners, and premium ceremony settings.",
        "The easiest mistake is overloading brown with too many warm accents at once. Keep the shirt clean, the tie restrained, and the accessories deliberate so the suit remains the lead decision.",
      ],
      links: [
        { href: "/category/suits", label: "Shop premium men's suits" },
        { href: "/groom-package", label: "Explore groom packages" },
      ],
    },
    {
      heading: "What to pair with a brown suit",
      paragraphs: [
        "Ivory or crisp white shirting keeps the look elevated. A darker tie or minimal accessory set creates enough contrast without turning the outfit theatrical.",
        "For weddings and formal evenings, the finishing goal is polish. Pocket square, lapel detail, and tie texture should feel coordinated rather than loud.",
      ],
    },
    {
      heading: "Where a brown suit works best",
      paragraphs: [
        "Brown tailoring is strongest for wedding guest style, warm-weather ceremony dressing, executive dinners, and any event where black or navy would feel more severe than necessary.",
        "If you need one dependable direction, start with the suit, add a clean shirt, and then keep the rest of the styling disciplined.",
      ],
    },
  ],
  "shirt-and-tie-combinations": [
    {
      heading: "Start with contrast and restraint",
      paragraphs: [
        "The most expensive-looking shirt and tie combinations are usually the simplest ones. A crisp light shirt with a deeper tie gives enough separation for the outfit to read cleanly from a distance and polished up close.",
        "This is especially important in corporate dressing, where the goal is confidence and clarity rather than novelty.",
      ],
      links: [
        { href: "/category/shirts", label: "Shop men's shirts" },
        { href: "/category/ties", label: "Shop men's ties" },
      ],
    },
    {
      heading: "Dependable pairings that work repeatedly",
      paragraphs: [
        "White or ivory shirting with a deep navy tie is a strong baseline for meetings, ceremonies, and evening events. Blue shirting with a darker solid tie can work for weekday dressing when the suit is neutral and the texture stays controlled.",
        "If the suit already carries pattern or visual depth, keep the tie quieter. If the suit is clean and plain, the tie can do slightly more work.",
      ],
    },
    {
      heading: "How to avoid common pairing mistakes",
      paragraphs: [
        "Do not let the shirt, tie, and suit all compete at the same time. One piece should lead, while the others support it.",
        "When in doubt, choose cleaner colour relationships and better fabric texture rather than louder colour combinations.",
      ],
    },
  ],
  "professional-wardrobe-essentials": [
    {
      heading: "Buy the pieces that solve repeat dressing decisions",
      paragraphs: [
        "A professional wardrobe does not need dozens of items to feel complete. It needs the right core pieces: one dependable suit, clean shirting, one or two refined finishing pieces, and trousers that can extend the life of the wardrobe outside full-suit dressing.",
        "That is what creates confidence without constant decision fatigue.",
      ],
      links: [
        { href: "/collection/boardroom-edit", label: "View the boardroom edit" },
        { href: "/category/accessories", label: "Explore men's accessories" },
      ],
    },
    {
      heading: "What to buy first",
      paragraphs: [
        "Start with a premium suit in a versatile colour, then add white or ivory shirting, a dependable tie option, and one finishing set that works across both meetings and formal events.",
        "This gives you a compact system rather than a set of disconnected purchases.",
      ],
    },
    {
      heading: "Build depth only after the foundation is working",
      paragraphs: [
        "Once the base wardrobe is reliable, add ceremony pieces, stronger textures, or occasion-specific tailoring. The order matters. Foundation first, expression second.",
        "That is how a wardrobe stays refined, useful, and premium instead of crowded.",
      ],
    },
  ],
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return buildMetadata({
      title: "Style guide article",
      description: "Ixquisite style guide article.",
      path: `/style-guide/${slug}`,
      noIndex: true,
      type: "article",
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/style-guide/${article.slug}`,
    image: getVisualAsset(article.title),
    type: "article",
  });
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
  const sections = articleContent[slug] ?? [
    {
      heading: "Editorial guidance",
      paragraphs: article.body
        ? article.body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
        : [article.description],
    },
  ];
  const articleImage = getVisualAsset(article.title);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Style Guide", path: "/style-guide" },
          { name: article.title, path: `/style-guide/${article.slug}` },
        ])}
      />
      <JsonLd
        data={buildArticleSchema({
          title: article.title,
          description: article.description,
          path: `/style-guide/${article.slug}`,
          image: articleImage,
          section: article.category,
        })}
      />
      <UtilityPageHeader
        eyebrow={article.category}
        title={article.title}
        copy={article.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Style Guide", href: "/style-guide" }, { label: article.title }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <article className="support-card">
            {sections.map((section) => (
              <div key={section.heading} className="cta-stack" style={{ gap: "0.8rem" }}>
                <h2 className="minor-title">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="body-copy">
                    {paragraph}
                  </p>
                ))}
                {section.links?.length ? (
                  <div className="pill-row">
                    {section.links.map((link) => (
                      <Link key={link.href} href={link.href} className="pill-link">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
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
