import { notFound } from "next/navigation";
import { ListingPage } from "@/components/page-templates";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products, wishlistSlugs] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getWishlistProductSlugsForCurrentUser(),
  ]);

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
      products={products}
      wishlistSlugs={wishlistSlugs}
      wishlistNext={`/category/${slug}`}
    />
  );
}
