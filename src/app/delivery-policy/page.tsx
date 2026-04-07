import { PolicyPage } from "@/components/page-templates";

export default function DeliveryPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Delivery policy"
      title="Delivery commitments should be separated from general browsing copy."
      copy="This page sets clear expectations around dispatch timing, delivery regions, handoff, and tracking communication."
      items={[
        { title: "Dispatch cadence", copy: "In-stock ready-to-wear orders are prepared quickly, with dispatch timing communicated clearly after payment verification." },
        { title: "Delivery regions", copy: "Ixquisite supports core city delivery, broader nationwide dispatch, and a clarified process for any longer-distance or special handling requests." },
        { title: "Tracking communication", copy: "Every eligible order should have a visible order reference and tracking path so customers can monitor delivery progress independently." },
        { title: "Exceptions", copy: "Urgent requests, premium wedding support, and any custom handling should be clarified through direct support before fulfillment begins." },
      ]}
    />
  );
}
