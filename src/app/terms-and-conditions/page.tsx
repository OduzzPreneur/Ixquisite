import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Read the Ixquisite terms and conditions covering orders, pricing, availability, fulfillment, and customer responsibilities.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage
      eyebrow="Terms & conditions"
      title="Terms that govern shopping with Ixquisite."
      copy="These terms explain how Ixquisite handles ordering, payment, fulfillment, pricing, availability, and customer responsibilities."
      items={[
        { title: "Orders and acceptance", copy: "Orders are confirmed when payment is successfully verified and Ixquisite accepts the purchase for fulfillment." },
        { title: "Pricing and availability", copy: "Product availability, delivery timing, and pricing may change without notice until an order is confirmed." },
        { title: "Fulfillment obligations", copy: "Ixquisite will prepare, dispatch, and support orders in line with the published shipping, delivery, and returns policies." },
        { title: "Customer responsibilities", copy: "Customers are responsible for providing accurate contact, sizing, and delivery information to avoid preventable order issues." },
      ]}
    />
  );
}
