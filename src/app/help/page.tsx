import { buildMetadata } from "@/lib/seo";
import { HelpHub, UtilityPageHeader } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Help Center",
  description:
    "Find Ixquisite support for ordering, fit guidance, shipping, returns, care, and other premium menswear purchase questions.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="Client Concierge"
        title="Bespoke Care & Assistance"
        copy="Access guidance on fit consultations, custom sizing, wedding party coordination, express delivery, and garment care."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help Center" }]}
      />
      <HelpHub />
    </>
  );
}
