import { ListingPage } from "@/components/page-templates";
import { getBestSellerProducts } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

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
