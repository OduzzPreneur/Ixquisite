import { PolicyPage } from "@/components/page-templates";

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow="Shipping & delivery"
      title="Delivery windows should feel specific, not vague."
      copy="Use this page to communicate regions, dispatch cadence, express options, and expected timing."
      items={[
        { title: "Processing", copy: "Ready-to-wear orders are prepared within 24 hours before handoff to the delivery partner." },
        { title: "Delivery windows", copy: "Standard delivery arrives in 2 to 4 days for core service areas, with express options where available." },
        { title: "Regions", copy: "Primary city delivery, nationwide dispatch, and a clearly stated process for longer-distance requests." },
        { title: "Tracking", copy: "Every shipment receives an order-tracking state so customers can monitor progress without contacting support first." },
      ]}
    />
  );
}
