import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Returns & Exchanges",
  description:
    "Read the Ixquisite returns and exchanges policy for eligibility, fit-related exchanges, refunds, and product exclusions.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Returns & exchanges"
      title="Returns and exchanges for ready-to-wear orders."
      copy="Read the eligibility rules, exchange flow, refund handling, and exclusions that apply to Ixquisite returns."
      items={[
        { title: "Eligibility", copy: "Unworn ready-to-wear pieces in original condition can be submitted for review within the stated return window." },
        { title: "Exchange flow", copy: "Size and fit exchanges should route quickly with support visibility where stock permits." },
        { title: "Refund handling", copy: "Approved returns are refunded through the original payment method after inspection and confirmation." },
        { title: "Exclusions", copy: "Hygiene-sensitive items, specially handled pieces, or orders with additional support conditions may have separate return limitations when stated before purchase." },
      ]}
    />
  );
}
