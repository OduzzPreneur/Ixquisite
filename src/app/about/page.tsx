import { SectionCardGrid, UtilityPageHeader } from "@/components/page-templates";

export default function AboutPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="About Ixquisite"
        title="Premium corporate wear built around confidence and convenience."
        copy="Ixquisite exists for professionals and style-conscious men who want a polished wardrobe without searching multiple stores."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <section className="page-section">
        <SectionCardGrid
          items={[
            {
              title: "Brand story",
              copy: "The brand balances quiet luxury with direct utility: fewer, better pieces that solve repeat dressing decisions.",
            },
            {
              title: "Craft focus",
              copy: "Structured tailoring, dependable shirting, and finishing pieces designed to work together rather than compete.",
            },
            {
              title: "Client promise",
              copy: "Confidence, speed, and clarity from product discovery through delivery and support.",
            },
            {
              title: "Delivery stance",
              copy: "Fast, visible delivery windows help the convenience promise feel real, not just promotional.",
            },
          ]}
        />
      </section>
    </>
  );
}
