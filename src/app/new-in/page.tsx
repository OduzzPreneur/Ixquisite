import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/page-templates";
import { getNewInProducts } from "@/lib/catalog";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";

export const metadata = buildMetadata({
  title: "New In Men's Suits, Shirts & Accessories",
  description:
    "Discover the latest arrivals from Ixquisite across premium men's suits, shirts, trousers, ties, and accessories for work, weddings, and refined daily dressing.",
  path: "/new-in",
});

export default async function NewInPage() {
  const [products, wishlistSlugs] = await Promise.all([
    getNewInProducts(),
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
