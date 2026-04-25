import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Refund Policy",
  description:
    "Read the Ixquisite refund policy for approved refunds, exchange handling, settlement timing, and non-refundable cases.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Refund policy"
      title="How approved refunds are handled."
      copy="Read how Ixquisite approaches approved refunds, exchange-first resolutions, expected timing, and any cases where refunds do not apply."
      items={[
        { title: "Approved refunds", copy: "Refunds are processed after return review and are issued back through the original payment method where applicable." },
        { title: "Exchange versus refund", copy: "Where stock allows, customers may be encouraged toward an exchange for size or fit issues before a refund is processed." },
        { title: "Timeline expectations", copy: "Refund timing should account for delivery back to Ixquisite, inspection, approval, and the payment provider settlement window." },
        { title: "Non-refundable cases", copy: "Specially handled, hygiene-sensitive, or custom-supported items may fall outside the standard refund path when that limitation is stated before purchase." },
      ]}
    />
  );
}
