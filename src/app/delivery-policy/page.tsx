import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Delivery Policy",
  description:
    "Read the Ixquisite delivery policy for dispatch timing, delivery regions, tracking, and special handling guidance.",
  path: "/delivery-policy",
});

export default function DeliveryPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Delivery policy"
      title="Delivery guidance for ready-to-wear orders."
      copy="Read how Ixquisite handles dispatch, delivery regions, tracking, and special requests so timing expectations stay clear before purchase."
      items={[
        { title: "Dispatch timing", copy: "In-stock ready-to-wear orders are prepared after payment verification, with dispatch timing communicated clearly once the order is confirmed." },
        { title: "Delivery regions", copy: "Ixquisite supports core city delivery and broader nationwide dispatch, with extra coordination where distance or handling requirements make timing less standard." },
        { title: "Tracking updates", copy: "Eligible orders receive an order reference and tracking visibility so you can follow delivery progress without needing a manual update first." },
        { title: "Special handling", copy: "Urgent requests, wedding-related orders, and any delivery needing extra coordination should be discussed with support before fulfillment begins." },
      ]}
    />
  );
}
