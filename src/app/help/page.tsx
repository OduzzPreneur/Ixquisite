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
        eyebrow="Help center"
        title="Help that keeps the purchase process clear."
        copy="Find answers on ordering, fit guidance, shipping, returns, care, and other support topics without leaving the shopping flow."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help Center" }]}
      />
      <HelpHub />
    </>
  );
}
