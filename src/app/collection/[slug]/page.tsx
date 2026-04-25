import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ListingPage } from "@/components/page-templates";
import { getCollection, getCollections, getProductsByCollection } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    return buildMetadata({
      title: "Collection",
      description: "Explore Ixquisite collections.",
      path: `/collection/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: collection.title,
    description: collection.description,
    path: `/collection/${slug}`,
    image: collection.image,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [collection, products, wishlistSlugs] = await Promise.all([
    getCollection(slug),
    getProductsByCollection(slug),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: collection.title, path: `/collection/${slug}` },
        ])}
      />
      <ListingPage
        eyebrow="Collection"
        title={collection.title}
        copy={collection.description}
        tone={collection.tone}
        visualTitle={collection.title}
        visualKicker="Collection edit"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.title }]}
        products={products}
        wishlistSlugs={wishlistSlugs}
        wishlistNext={`/collection/${slug}`}
      />
    </>
  );
}
