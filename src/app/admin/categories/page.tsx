import Link from "next/link";
import { deleteCategoryAction, upsertCategoryAction } from "@/app/actions/admin";
import { AdminNotice, AdminPageHeader, CategoryEditorForm } from "@/components/admin-panel";
import { getCategories } from "@/lib/catalog";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, categories] = await Promise.all([searchParams, getCategories()]);

  return (
    <div className="cta-stack">
      <AdminPageHeader
        eyebrow="Categories"
        title="Category manager"
        copy="Update the top-level wardrobe lanes that power shortcuts, taxonomy, and category landing pages."
      />
      <AdminNotice error={params.error} message={params.message} />

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">New category</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Add a wardrobe lane
            </h2>
          </div>
          <p className="section-copy">
            Category tiles still use the existing visual-asset system, so new categories should be added intentionally.
          </p>
        </div>
        <CategoryEditorForm action={upsertCategoryAction} submitLabel="Create category" />
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Existing categories</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Live taxonomy
            </h2>
          </div>
          <p className="section-copy">
            Open a category to edit its copy and ordering, or delete it if nothing references it.
          </p>
        </div>
        <div className="table-like">
          {categories.map((category) => (
            <article key={category.slug}>
              <div>
                <strong>{category.title}</strong>
                <p className="section-copy" style={{ marginTop: "0.35rem" }}>
                  {category.caption}
                </p>
                <p className="section-copy" style={{ marginTop: "0.35rem" }}>
                  {category.description}
                </p>
              </div>
              <div className="table-meta">
                <Link href={`/admin/categories/${category.slug}`} className="pill-link">
                  Edit
                </Link>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="slug" value={category.slug} />
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
