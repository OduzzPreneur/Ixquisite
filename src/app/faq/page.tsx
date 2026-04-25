import { buildMetadata } from "@/lib/seo";
import { UtilityPageHeader } from "@/components/page-templates";
import { faqItems } from "@/data/site";

export const metadata = buildMetadata({
  title: "Shopping FAQ",
  description:
    "Read frequently asked questions about Ixquisite orders, delivery, sizing, returns, groom packages, and premium menswear support.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="FAQ"
        title="Clear answers for the most common purchase questions."
        copy="FAQs support checkout confidence by answering delivery, sizing, exchange, and wardrobe-planning concerns in one place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="page-section">
        <div className="grid grid--2">
          {faqItems.map((item) => (
            <article key={item.question} className="support-card">
              <h2 className="minor-title">{item.question}</h2>
              <p className="body-copy">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
