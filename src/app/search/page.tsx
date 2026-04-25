import { SearchShell } from "@/components/page-templates";
import { getProducts } from "@/lib/catalog";
import { buildNoIndexMetadata } from "@/lib/seo";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export const metadata = buildNoIndexMetadata(
  "Search",
  "Internal storefront search results.",
);

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const lowered = query.toLowerCase();
  const [products, wishlistSlugs] = await Promise.all([
    getProducts(),
    getWishlistProductSlugsForCurrentUser(),
  ]);
  const results = lowered
    ? products.filter(
        (product) =>
          product.title.toLowerCase().includes(lowered) ||
          product.category.toLowerCase().includes(lowered) ||
          product.occasions.some((occasion) => occasion.includes(lowered.replace(/\s+/g, "-"))),
      )
    : products.slice(0, 6);
  return <SearchShell query={query} results={results} wishlistSlugs={wishlistSlugs} />;
}
