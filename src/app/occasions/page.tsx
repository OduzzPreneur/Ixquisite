import Link from "next/link";
import { UtilityPageHeader } from "@/components/page-templates";
import { OccasionTile, VisualPanel } from "@/components/ui";
import { getVisualAsset } from "@/lib/visual-assets";
import { getOccasions } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop Men's Outfits by Occasion",
  description:
    "Shop premium men's outfits by occasion, including boardroom looks, wedding guest style, groom packages, formal evenings, business travel, and executive dressing.",
  path: "/occasions",
});

export default async function OccasionsPage() {
  const occasions = await getOccasions();

  return (
    <>
      <UtilityPageHeader
        eyebrow="Occasions"
        title="Shop Men's Outfits by Occasion"
        copy="Shop premium men's outfits by occasion, including boardroom looks, wedding guest style, groom packages, formal evenings, business travel, and executive dressing."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Occasions" }]}
      />
      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Dress-code edits</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Choose the room, then narrow the wardrobe.
            </h2>
          </div>
          <p className="section-copy">
            These edits are built to reduce the catalog into a smaller visual decision,
            whether you need daily office structure, wedding polish, or after-dark formality.
          </p>
        </div>
        <div className="grid grid--3 grid--mobile-duo">
          {occasions.map((occasion) => (
            <OccasionTile key={occasion.slug} occasion={occasion} />
          ))}
        </div>
      </section>
      <section className="page-section">
        <div className="feature-split surface-panel" style={{ padding: "clamp(1.3rem, 2vw, 1.8rem)" }}>
          <VisualPanel
            title="Groom's Full Package"
            kicker="Ceremony support"
            tone="espresso"
            size="landscape"
            image={getVisualAsset("Dress your team")}
          />
          <div className="detail-card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
            <p className="eyebrow">Wedding extension</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Build the groom look, then coordinate the rest of the line-up.
            </h2>
            <p className="section-copy">
              The groom package takes the same occasion-first logic into full ceremony planning,
              with package tiers, coordinated finishing pieces, and inquiry support for group dressing.
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
