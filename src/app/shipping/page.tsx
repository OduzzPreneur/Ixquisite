import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Shipping & Delivery",
  description:
    "Read the Ixquisite shipping and delivery information for processing time, standard delivery windows, regions, and tracking visibility.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow="Shipping & delivery"
      title="Shipping timing and delivery visibility."
      copy="Find the current guidance on order processing, delivery windows, covered regions, and tracking for Ixquisite shipments."
      items={[
        { title: "Processing", copy: "Ready-to-wear orders are prepared within 24 hours before handoff to the delivery partner." },
        { title: "Delivery windows", copy: "Standard delivery arrives in 2 to 4 days for core service areas, with express options where available." },
        { title: "Regions", copy: "Primary city delivery, nationwide dispatch, and a clearly stated process for longer-distance requests." },
        { title: "Tracking", copy: "Every shipment receives an order-tracking state so customers can monitor progress without contacting support first." },
      ]}
    />
  );
}
