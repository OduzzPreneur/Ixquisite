import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/page-templates";
import { getBestSellerProducts } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export const metadata = buildMetadata({
  title: "Best Selling Men's Suits, Shirts & Accessories",
  description:
    "Shop Ixquisite best sellers across premium men's suits, shirts, trousers, ties, and accessories chosen most often for corporate wear, ceremony, and polished everyday dressing.",
  path: "/best-sellers",
});

export default async function BestSellersPage() {
  const [products, wishlistSlugs] = await Promise.all([
    getBestSellerProducts(),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  return (
    <ListingPage
      eyebrow="Best sellers"
      title="The pieces clients return to first."
      copy="A tighter edit of proven suiting, shirting, and finishing pieces that already carry the strongest demand."
      tone="espresso"
      visualTitle="Best Sellers"
      visualKicker="Most shopped edit"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]}
      products={products}
      wishlistSlugs={wishlistSlugs}
      wishlistNext="/best-sellers"
    />
  );
}
