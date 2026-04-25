import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Men's Size Guide",
  description:
    "Use the Ixquisite men's size guide for suits, shirts, trousers, and measurement guidance before placing your order.",
  path: "/size-guide",
});

export default function SizeGuidePage() {
  return (
    <PolicyPage
      eyebrow="Size guide"
      title="Men's size guidance for a more confident fit."
      copy="Use this size guide to understand how Ixquisite suits, shirts, trousers, and accessories are described before you order."
      items={[
        { title: "Suit sizing", copy: "Start from your chest measurement, then review the shoulder shape, waist suppression, and trouser pairing to choose the cleanest formal fit." },
        { title: "Shirt sizing", copy: "Check collar and sleeve measurements first, then use the fit notes to decide whether you want a slimmer or more relaxed silhouette." },
        { title: "Trouser sizing", copy: "Use waist and inseam as your base, then consider seat room and taper if you want a sharper or easier line through the leg." },
        { title: "How to measure", copy: "If you need help, take your measurements in a shirt and trousers that already fit well and compare them against the product guidance before ordering." },
      ]}
    />
  );
}
