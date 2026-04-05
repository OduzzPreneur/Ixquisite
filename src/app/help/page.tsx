import { HelpHub, UtilityPageHeader } from "@/components/page-templates";

export default function HelpPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="Help center"
        title="Support architecture that reduces hesitation before checkout."
        copy="Ordering, fit, shipping, returns, and care information should stay easy to find from anywhere in the shopping flow."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help Center" }]}
      />
      <HelpHub />
    </>
  );
}
