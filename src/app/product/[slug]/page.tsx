import { notFound } from "next/navigation";
import { ProductDetailExperience } from "@/components/product-detail-experience";
import { UtilityPageHeader } from "@/components/page-templates";
import { getProduct, getProducts, getProductsBySlugs } from "@/lib/catalog";
import { getVisualAsset } from "@/lib/visual-assets";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import { ProductCard } from "@/components/ui";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; message?: string; color?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const [allProducts, completeLook, wishlistSlugs] = await Promise.all([
    getProducts(),
    getProductsBySlugs(product.completeTheLook),
    getWishlistProductSlugsForCurrentUser(),
  ]);
  const related = allProducts.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);
  const isSaved = wishlistSlugs.includes(product.slug);
  const swatchLabels = product.swatches.map((swatch) => swatch.label);
  const selectedColor = query.color && swatchLabels.includes(query.color) ? query.color : (swatchLabels[0] ?? product.colors[0] ?? "");

  return (
    <>
      <UtilityPageHeader
        eyebrow={product.category}
        title={product.title}
        copy={product.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: product.category, href: `/category/${product.category}` }, { label: product.title }]}
      />
      <section className="page-section">
        <ProductDetailExperience
          product={product}
          defaultImage={product.image ?? getVisualAsset(product.title)}
          detailImage={getVisualAsset(`${product.title}::detail`)}
          styledImage={getVisualAsset(`${product.title}::styled`)}
          initialColor={selectedColor}
          isSaved={isSaved}
          error={query.error}
          message={query.message}
        />
      </section>
      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Complete the look</p>
          <h2 className="section-title">Recommended pairings for this piece.</h2>
        </div>
        <div className="product-grid">
          {completeLook.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              wishlistState={wishlistSlugs.includes(item.slug) ? "saved" : "idle"}
              wishlistNext={`/product/${product.slug}`}
            />
          ))}
        </div>
      </section>
      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Related products</p>
          <h2 className="section-title">More in the same wardrobe lane.</h2>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              wishlistState={wishlistSlugs.includes(item.slug) ? "saved" : "idle"}
              wishlistNext={`/product/${product.slug}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
