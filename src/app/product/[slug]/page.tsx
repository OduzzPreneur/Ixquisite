import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductDetailExperience } from "@/components/product-detail-experience";
import { UtilityPageHeader } from "@/components/page-templates";
import { getCategory, getProduct, getProducts, getProductsBySlugs } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildProductSchema } from "@/lib/schema";
import { getProductVariants, resolveProductVariant, resolveVariantByColor } from "@/lib/product-variants";
import { getVisualAsset } from "@/lib/visual-assets";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import { ProductCard } from "@/components/ui";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

const categoryCopy: Record<string, string> = {
  suits: "men's suit",
  shirts: "men's shirt",
  trousers: "men's trousers",
  ties: "men's tie",
  accessories: "men's accessory",
};

function formatOccasionCopy(slugs: string[]) {
  const labels = slugs.map((slug) => slug.replace(/-/g, " "));
  return labels.slice(0, 2).join(", ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.isPlaceholder) {
    return buildMetadata({
      title: "Product",
      description: "Premium menswear product page.",
      path: `/product/${slug}`,
      noIndex: true,
    });
  }

  const primaryColor = product.colors[0] ?? product.swatches[0]?.label ?? "";
  const categoryLabel = categoryCopy[product.category] ?? "menswear piece";
  const occasions = formatOccasionCopy(product.occasions);

  return buildMetadata({
    title: `${product.title} - Premium ${primaryColor || product.category} ${categoryLabel}`.trim(),
    description: `Shop ${product.title} from Ixquisite. ${product.blurb} Designed for ${occasions || "formal dressing"} with premium styling, refined fit, and confident menswear presence.`,
    path: `/product/${slug}`,
    image: product.image ?? getVisualAsset(product.title),
    keywords: [
      product.title,
      primaryColor ? `${primaryColor} ${categoryLabel}` : categoryLabel,
      "premium menswear",
      "Ixquisite",
    ],
  });
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; message?: string; color?: string; variant?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const product = await getProduct(slug);

  if (!product || product.isPlaceholder) {
    notFound();
  }

  const [allProducts, completeLook, wishlistSlugs] = await Promise.all([
    getProducts(),
    getProductsBySlugs(product.completeTheLook),
    getWishlistProductSlugsForCurrentUser(),
  ]);
  const category = await getCategory(product.category);
  const related = allProducts.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);
  const isSaved = wishlistSlugs.includes(product.slug);
  const variants = getProductVariants(product);
  const fallbackVariant = variants[0] ?? null;
  const variantFromQuery = resolveProductVariant({ ...product, variants }, query.variant);
  const variantFromColor = resolveVariantByColor({ ...product, variants }, query.color);
  const selectedVariant = variantFromQuery ?? variantFromColor ?? fallbackVariant;
  const categoryTitle = category?.title ?? product.category;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: categoryTitle, path: `/category/${product.category}` },
          { name: product.title, path: `/product/${product.slug}` },
        ])}
      />
      <JsonLd data={buildProductSchema(product)} />
      <UtilityPageHeader
        eyebrow={categoryTitle}
        title={product.title}
        copy={product.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: categoryTitle, href: `/category/${product.category}` }, { label: product.title }]}
      />
      <section className="page-section">
        <ProductDetailExperience
          product={product}
          defaultImage={product.image ?? getVisualAsset(product.title)}
          detailImage={getVisualAsset(`${product.title}::detail`)}
          styledImage={getVisualAsset(`${product.title}::styled`)}
          initialVariantSlug={selectedVariant?.slug ?? ""}
          isSaved={isSaved}
          error={query.error}
          message={query.message}
        />
      </section>
      <section className="page-section">
        <div className="surface-panel">
          <p className="eyebrow">Shop the wardrobe around it</p>
          <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
            Keep this product connected to the rest of the look.
          </h2>
          <div className="pill-row" style={{ marginTop: "1rem" }}>
            <Link href={`/category/${product.category}`} className="pill-link">
              Shop this category
            </Link>
            {product.occasions.includes("wedding-guest") || product.occasions.includes("black-tie") ? (
              <Link href="/groom-package" className="pill-link">
                Explore groom packages
              </Link>
            ) : null}
            <Link href="/style-guide" className="pill-link">
              Read the men&apos;s style guide
            </Link>
          </div>
        </div>
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
