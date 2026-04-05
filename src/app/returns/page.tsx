import { PolicyPage } from "@/components/page-templates";

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Returns & exchanges"
      title="Apparel returns should feel fair, clear, and easy to understand."
      copy="Keep the return window, exchange logic, exclusions, and refund handling explicit."
      items={[
        { title: "Eligibility", copy: "Unworn ready-to-wear pieces in original condition can be submitted for review within the stated return window." },
        { title: "Exchange flow", copy: "Size and fit exchanges should route quickly with support visibility where stock permits." },
        { title: "Refund handling", copy: "Approved returns are refunded through the original payment method after inspection and confirmation." },
        { title: "Exclusions", copy: "Any hygiene-sensitive or specially handled items should be listed clearly to avoid ambiguity." },
      ]}
    />
  );
}
