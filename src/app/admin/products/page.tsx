import Link from "next/link";
import { deleteProductAction, upsertProductAction } from "@/app/actions/admin";
import { AdminNotice, AdminPageHeader, ProductEditorForm } from "@/components/admin-panel";
import { formatPrice } from "@/data/site";
import { getCategories, getCollections, getOccasions, getProducts } from "@/lib/catalog";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, products, categories, collections, occasions] = await Promise.all([
    searchParams,
    getProducts(),
    getCategories(),
    getCollections(),
    getOccasions(),
  ]);

  return (
    <div className="cta-stack">
      <AdminPageHeader
        eyebrow="Products"
        title="Catalog editor"
        copy="Create new products, keep merchandising flags current, and edit the exact fields driving the storefront."
      />
      <AdminNotice error={params.error} message={params.message} />

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">New product</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Add a catalog entry
            </h2>
          </div>
          <p className="section-copy">
            Image paths should point to files in `public/`, for example `/images/ixquisite/hero-teal-double-breasted.jpg`.
          </p>
        </div>
        <ProductEditorForm
          action={upsertProductAction}
          categories={categories}
          collections={collections}
          occasions={occasions}
          submitLabel="Create product"
        />
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Existing products</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Live catalog
            </h2>
          </div>
          <p className="section-copy">
            Open a product to edit every detail, or remove it directly from this list.
          </p>
        </div>
        <div className="table-like">
          {products.map((product) => (
            <article key={product.slug}>
              <div>
                <strong>{product.title}</strong>
                <p className="section-copy" style={{ marginTop: "0.35rem" }}>
                  {product.category} · {product.collection} · {formatPrice(product.price)}
                </p>
                <p className="section-copy" style={{ marginTop: "0.35rem" }}>
                  {product.availability}
                </p>
              </div>
              <div className="table-meta">
                <Link href={`/admin/products/${product.slug}`} className="pill-link">
                  Edit
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="slug" value={product.slug} />
                  <input type="hidden" name="category_slug" value={product.category} />
                  <input type="hidden" name="collection_slug" value={product.collection} />
                  <input type="hidden" name="occasion_slugs" value={product.occasions.join(",")} />
                  <button type="submit" className="pill-link">
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
