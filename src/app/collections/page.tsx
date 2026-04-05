import { CollectionFeature, PageHero } from "@/components/ui";
import { getCollections, getProductsByCollection } from "@/lib/catalog";

export default async function CollectionsPage() {
  const collections = await getCollections();
  const collectionEntries = await Promise.all(
    collections.map(async (collection) => ({
      collection,
      products: await getProductsByCollection(collection.slug),
    })),
  );

  return (
    <>
      <PageHero
        eyebrow="Collections"
        title="Curated wardrobes built around how professionals actually dress."
        copy="Collections narrow the search and group products by tone, role, and daily rhythm rather than dumping the full catalog at once."
        tone="stone"
        visualTitle="Collection architecture"
        visualKicker="Editorial merchandising"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />
      <section className="page-section">
        <div className="grid grid--2">
          {collectionEntries.map(({ collection, products }) => (
            <CollectionFeature
              key={collection.slug}
              collection={collection}
              supporting={products.slice(0, 3)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
