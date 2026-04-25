import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ListingPage } from "@/components/page-templates";
import { getOccasion, getOccasions, getProductsByOccasion } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export async function generateStaticParams() {
  const occasions = await getOccasions();
  return occasions.map((occasion) => ({ slug: occasion.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const occasion = await getOccasion(slug);

  if (!occasion) {
    return buildMetadata({
      title: "Occasion",
      description: "Shop Ixquisite by occasion.",
      path: `/occasion/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${occasion.title} outfits`,
    description: `Shop premium men's outfits for ${occasion.title.toLowerCase()} dressing at Ixquisite. ${occasion.description}`,
    path: `/occasion/${slug}`,
    image: occasion.image,
  });
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [occasion, products, wishlistSlugs] = await Promise.all([
    getOccasion(slug),
    getProductsByOccasion(slug),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  if (!occasion) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Occasions", path: "/occasions" },
          { name: occasion.title, path: `/occasion/${slug}` },
        ])}
      />
      <ListingPage
        eyebrow="Occasion"
        title={occasion.title}
        copy={occasion.description}
        tone={occasion.tone}
        visualTitle={occasion.title}
        visualKicker="Occasion-led shop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Occasions", href: "/occasions" }, { label: occasion.title }]}
        products={products}
        wishlistSlugs={wishlistSlugs}
        wishlistNext={`/occasion/${slug}`}
      />
    </>
  );
}
