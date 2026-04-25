import { UtilityPageHeader } from "@/components/page-templates";
import { getArticles } from "@/lib/catalog";
import { EditorialCard } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Men's Style Guide",
  description:
    "Read Ixquisite style guides on men's suits, corporate wear, shirt and tie combinations, wedding menswear, colour pairing, fit, and quiet luxury dressing.",
  path: "/style-guide",
});

export default async function StyleGuidePage() {
  const articles = await getArticles();

  return (
    <>
      <UtilityPageHeader
        eyebrow="Style guide"
        title="Men's Style Guide"
        copy="Read Ixquisite style guides on suits, corporate wear, shirt and tie combinations, wedding menswear, colour pairing, fit, and quiet luxury dressing."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Style Guide" }]}
      />
      <section className="page-section">
        <div className="grid grid--3">
          {articles.map((article) => (
            <EditorialCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
