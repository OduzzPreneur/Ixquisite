import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/page-templates";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read the Ixquisite privacy policy covering customer data, orders, account information, payments, and support submissions.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy policy"
      title="How customer information is handled at Ixquisite."
      copy="This policy explains the information Ixquisite collects, why it is used, and how account, order, and support data are handled."
      items={[
        { title: "Information collected", copy: "Ixquisite collects account details, order information, delivery addresses, and support submissions required to fulfill purchases and provide customer care." },
        { title: "How data is used", copy: "Customer data is used to process orders, provide delivery visibility, support fit or wedding inquiries, and improve the purchase experience." },
        { title: "Payments", copy: "Payments are processed through secure third-party providers. Ixquisite does not expose or surface raw card details in customer account pages." },
        { title: "Support and inquiries", copy: "Messages submitted through contact and wedding inquiry flows are stored so the Ixquisite team can respond, coordinate, and resolve requests." },
      ]}
    />
  );
}
