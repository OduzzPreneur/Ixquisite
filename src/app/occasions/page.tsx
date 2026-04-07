import { SectionCardGrid, UtilityPageHeader } from "@/components/page-templates";
import { getOccasions } from "@/lib/catalog";

export default async function OccasionsPage() {
  const occasions = await getOccasions();

  return (
    <>
      <UtilityPageHeader
        eyebrow="Occasions"
        title="Start from the room you are dressing for."
        copy="Occasion-led entry points reduce friction and make menswear shopping feel guided instead of overwhelming."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Occasions" }]}
      />
      <section className="page-section">
        <SectionCardGrid
          items={[
            ...occasions.map((occasion) => ({
              title: occasion.title,
              copy: occasion.description,
              href: `/occasion/${occasion.slug}`,
            })),
            {
              title: "Groom's Full Package",
              copy: "A dedicated wedding hub with curated package tiers, guided look-building, and inquiry support for custom ceremony needs.",
              href: "/groom-package",
            },
          ]}
        />
      </section>
    </>
  );
}
