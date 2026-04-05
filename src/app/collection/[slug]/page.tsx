import { notFound } from "next/navigation";
import { ListingPage } from "@/components/page-templates";
import { getCollection, getCollections, getProductsByCollection } from "@/lib/catalog";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <ListingPage
      eyebrow="Collection"
      title={collection.title}
      copy={collection.description}
      tone={collection.tone}
      visualTitle={collection.title}
      visualKicker="Collection edit"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.title }]}
      products={await getProductsByCollection(slug)}
    />
  );
}
