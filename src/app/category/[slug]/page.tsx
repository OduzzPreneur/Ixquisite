import { notFound } from "next/navigation";
import { ListingPage } from "@/components/page-templates";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <ListingPage
      eyebrow={category.caption}
      title={category.title}
      copy={category.description}
      tone={category.tone}
      visualTitle={category.title}
      visualKicker="Category spotlight"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: category.title }]}
      products={await getProductsByCategory(slug)}
    />
  );
}
