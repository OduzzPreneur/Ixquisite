import { PolicyPage } from "@/components/page-templates";

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage
      eyebrow="Terms & conditions"
      title="The commerce rules should be explicit before the customer reaches friction."
      copy="Use this page to define the governing terms for ordering, payment, fulfillment, customer responsibilities, and support handling."
      items={[
        { title: "Orders and acceptance", copy: "Orders are confirmed when payment is successfully verified and Ixquisite accepts the purchase for fulfillment." },
        { title: "Pricing and availability", copy: "Product availability, delivery timing, and pricing may change without notice until an order is confirmed." },
        { title: "Fulfillment obligations", copy: "Ixquisite will prepare, dispatch, and support orders in line with the published shipping, delivery, and returns policies." },
        { title: "Customer responsibilities", copy: "Customers are responsible for providing accurate contact, sizing, and delivery information to avoid preventable order issues." },
      ]}
    />
  );
}
