import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { ListingPage } from "@/components/page-templates";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

const categorySeo: Record<string, { title: string; description: string; intro: string; links: Array<{ href: string; label: string }> }> = {
  suits: {
    title: "Men's Suits",
    description:
      "Shop premium men's suits from Ixquisite, designed for boardrooms, weddings, formal evenings, executive events, and refined everyday confidence.",
    intro:
      "Explore premium men's suits designed for boardrooms, weddings, formal evenings, and refined everyday confidence. Ixquisite suits combine structured tailoring, quiet luxury, and complete styling support.",
    links: [
      { href: "/category/shirts", label: "Pair with men's shirts" },
      { href: "/category/ties", label: "Finish with men's ties" },
      { href: "/groom-package", label: "Explore groom suit packages" },
      { href: "/style-guide", label: "Read suit styling guidance" },
    ],
  },
  shirts: {
    title: "Men's Shirts",
    description:
      "Shop premium men's shirts from Ixquisite, designed for corporate wear, smart casual styling, formal occasions, and polished everyday dressing.",
    intro:
      "Shop premium men's shirts for corporate wear, formal styling, and polished everyday dressing. Pair with Ixquisite suits, trousers, and ties for a complete refined look.",
    links: [
      { href: "/category/suits", label: "Shop premium men's suits" },
      { href: "/category/trousers", label: "Pair with men's trousers" },
      { href: "/category/ties", label: "Explore men's ties" },
      { href: "/style-guide/shirt-and-tie-combinations", label: "Read shirt and tie combinations" },
    ],
  },
  trousers: {
    title: "Men's Trousers",
    description:
      "Shop premium men's trousers from Ixquisite, designed for refined office wear, formal styling, versatile pairing, and confident everyday dressing.",
    intro:
      "Discover premium men's trousers designed for office wear, formal events, and versatile pairing with shirts, jackets, and accessories.",
    links: [
      { href: "/category/shirts", label: "Shop men's shirts" },
      { href: "/category/accessories", label: "Explore men's accessories" },
      { href: "/collection/boardroom-edit", label: "View the boardroom edit" },
    ],
  },
  ties: {
    title: "Men's Ties",
    description:
      "Shop premium men's ties from Ixquisite, curated for business suits, wedding looks, formal events, and complete corporate styling.",
    intro:
      "Complete your suit with premium men's ties selected for business, weddings, formal evenings, and sharp professional dressing.",
    links: [
      { href: "/category/suits", label: "Shop premium men's suits" },
      { href: "/category/shirts", label: "Pair with men's shirts" },
      { href: "/groom-package", label: "Explore groom packages" },
    ],
  },
  accessories: {
    title: "Men's Accessories",
    description:
      "Shop refined men's accessories from Ixquisite, selected to complete premium suits, shirts, trousers, ties, and occasion-ready menswear looks.",
    intro:
      "Finish your look with refined men's accessories curated to complement Ixquisite suits, shirts, trousers, and occasion-ready outfits.",
    links: [
      { href: "/category/suits", label: "Shop premium men's suits" },
      { href: "/category/ties", label: "Explore men's ties" },
      { href: "/groom-package", label: "View groom suit packages" },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return buildMetadata({
      title: "Category",
      description: "Shop premium menswear by category at Ixquisite.",
      path: `/category/${slug}`,
      noIndex: true,
    });
  }

  const seo = categorySeo[slug];

  return buildMetadata({
    title: seo?.title ?? category.title,
    description: seo?.description ?? category.description,
    path: `/category/${slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products, wishlistSlugs] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  if (!category) {
    notFound();
  }

  const seo = categorySeo[slug];
  const pageTitle = seo?.title ?? category.title;
  const pageCopy = seo?.intro ?? category.description;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: pageTitle, path: `/category/${slug}` },
        ])}
      />
      <ListingPage
        eyebrow={category.caption}
        title={pageTitle}
        copy={pageCopy}
        tone={category.tone}
        visualTitle={category.title}
        visualKicker="Category spotlight"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: pageTitle }]}
        products={products}
        wishlistSlugs={wishlistSlugs}
        wishlistNext={`/category/${slug}`}
      />
      {seo?.links?.length ? (
        <section className="page-section">
          <div className="surface-panel">
            <p className="eyebrow">Related routes</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Keep the wardrobe decision connected.
            </h2>
            <div className="pill-row" style={{ marginTop: "1rem" }}>
              {seo.links.map((link) => (
                <Link key={link.href} href={link.href} className="pill-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
