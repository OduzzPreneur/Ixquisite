import { ListingPage } from "@/components/page-templates";
import { getProducts } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export default async function NewInPage() {
  const [products, wishlistSlugs] = await Promise.all([
    getProducts(),
    getWishlistProductSlugsForCurrentUser(),
  ]);

  return (
    <ListingPage
      eyebrow="New in"
      title="The latest tailoring and finishing pieces."
      copy="A compact edit of recent arrivals across suiting, shirting, trousers, and elevated accessories."
      tone="navy"
      visualTitle="Latest arrivals"
      visualKicker="New season edit"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "New In" }]}
      products={products}
      wishlistSlugs={wishlistSlugs}
      wishlistNext="/new-in"
    />
  );
}
