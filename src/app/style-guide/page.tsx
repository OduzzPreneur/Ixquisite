import { UtilityPageHeader } from "@/components/page-templates";
import { getArticles } from "@/lib/catalog";
import { EditorialCard } from "@/components/ui";

export default async function StyleGuidePage() {
  const articles = await getArticles();

  return (
    <>
      <UtilityPageHeader
        eyebrow="Style guide"
        title="Editorial guidance for professionals who prefer fewer mistakes."
        copy="The style guide keeps the site premium by offering wardrobe advice, not just a grid of products."
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
