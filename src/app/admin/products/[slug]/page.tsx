import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteProductAction,
  upsertProductAction,
  uploadProductGalleryImageAction,
  uploadProductImageAction,
  uploadProductSwatchImageAction,
} from "@/app/actions/admin";
import { AdminNotice, AdminPageHeader, ProductEditorForm, ProductImageUploadPanel } from "@/components/admin-panel";
import { getCategories, getCollections, getOccasions, getProduct } from "@/lib/catalog";

export default async function AdminProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [{ slug }, query, categories, collections, occasions] = await Promise.all([
    params,
    searchParams,
    getCategories(),
    getCollections(),
    getOccasions(),
  ]);
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const uploadProductImage = uploadProductImageAction.bind(null, product.slug);
  const uploadProductGalleryImage = uploadProductGalleryImageAction.bind(null, product.slug);
  const uploadProductSwatchImage = uploadProductSwatchImageAction.bind(null, product.slug);

  return (
    <div className="cta-stack">
      <AdminPageHeader
        eyebrow="Products"
        title={product.title}
        copy="Edit the live product record that powers category pages, product detail, homepage modules, and wishlist surfaces."
      />
      <AdminNotice error={query.error} message={query.message} />

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Edit product</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Product details
            </h2>
          </div>
          <div className="hero__actions hero__actions--compact">
            <Link href={`/product/${product.slug}`} className="pill-link">
              View storefront page
            </Link>
            <Link href="/admin/products" className="pill-link">
              Back to products
            </Link>
          </div>
        </div>
        <ProductEditorForm
          action={upsertProductAction}
          categories={categories}
          collections={collections}
          occasions={occasions}
          product={product}
          submitLabel="Save product"
        />
      </section>

      <ProductImageUploadPanel
        product={product}
        uploadProductImageAction={uploadProductImage}
        uploadProductGalleryImageAction={uploadProductGalleryImage}
        uploadProductSwatchImageAction={uploadProductSwatchImage}
      />

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Danger zone</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Remove product
            </h2>
          </div>
          <p className="section-copy">
            This removes the product from live storefront pages, wishlist relations, and cart selection for future orders.
          </p>
        </div>
        <form action={deleteProductAction} className="hero__actions">
          <input type="hidden" name="slug" value={product.slug} />
          <input type="hidden" name="category_slug" value={product.category} />
          <input type="hidden" name="collection_slug" value={product.collection} />
          <input type="hidden" name="occasion_slugs" value={product.occasions.join(",")} />
          <button type="submit" className="button button--danger">
            Delete product
          </button>
        </form>
      </section>
    </div>
  );
}
