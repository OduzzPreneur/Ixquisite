import { SearchShell } from "@/components/page-templates";
import { getProducts } from "@/lib/catalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const lowered = query.toLowerCase();
  const products = await getProducts();
  const results = lowered
    ? products.filter(
        (product) =>
          product.title.toLowerCase().includes(lowered) ||
          product.category.toLowerCase().includes(lowered) ||
          product.occasions.some((occasion) => occasion.includes(lowered.replace(/\s+/g, "-"))),
      )
    : products.slice(0, 6);

  return <SearchShell query={query} results={results} />;
}
