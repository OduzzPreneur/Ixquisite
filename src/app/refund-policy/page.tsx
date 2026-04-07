import { PolicyPage } from "@/components/page-templates";

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Refund policy"
      title="Refund handling should be visible before the customer has to ask for it."
      copy="This page explains how approved refunds are handled, what timeline customers should expect, and how exchanges differ from refund requests."
      items={[
        { title: "Approved refunds", copy: "Refunds are processed after return review and are issued back through the original payment method where applicable." },
        { title: "Exchange versus refund", copy: "Where stock allows, customers may be encouraged toward an exchange for size or fit issues before a refund is processed." },
        { title: "Timeline expectations", copy: "Refund timing should account for delivery back to Ixquisite, inspection, approval, and the payment provider settlement window." },
        { title: "Non-refundable cases", copy: "Any specially handled, hygiene-sensitive, or custom-supported items should be listed clearly so customers understand exceptions up front." },
      ]}
    />
  );
}
