import Link from "next/link";
import { CollectionFeature, PageHero, VisualPanel } from "@/components/ui";
import { getVisualAsset } from "@/lib/visual-assets";
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
      <section className="page-section">
        <div className="feature-split surface-panel" style={{ padding: "clamp(1.3rem, 2vw, 1.8rem)" }}>
          <VisualPanel
            title="Groom's Package"
            kicker="Wedding collection extension"
            tone="espresso"
            size="landscape"
            image={getVisualAsset("Groom's Package")}
          />
          <div className="detail-card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
            <p className="eyebrow">Ceremony collection extension</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Groom dressing built as a package, not a product hunt.
            </h2>
            <p className="section-copy">
              The wedding hub translates Ixquisite&apos;s collection logic into package tiers, coordinated finishing pieces, and inquiry support for the moments that need more than a simple catalog browse.
            </p>
            <div className="hero__actions">
              <Link href="/groom-package" className="button">
                Explore groom package
              </Link>
              <Link href="/wedding-inquiry" className="pill-link">
                Start wedding inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
