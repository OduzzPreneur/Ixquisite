import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCategoryAction, upsertCategoryAction } from "@/app/actions/admin";
import { AdminNotice, AdminPageHeader, CategoryEditorForm } from "@/components/admin-panel";
import { getCategory } from "@/lib/catalog";

export default async function AdminCategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="cta-stack">
      <AdminPageHeader
        eyebrow="Categories"
        title={category.title}
        copy="Edit the live category record used by navigation, category landing pages, and homepage shortcuts."
      />
      <AdminNotice error={query.error} message={query.message} />

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Edit category</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Category details
            </h2>
          </div>
          <div className="hero__actions hero__actions--compact">
            <Link href={`/category/${category.slug}`} className="pill-link">
              View storefront page
            </Link>
            <Link href="/admin/categories" className="pill-link">
              Back to categories
            </Link>
          </div>
        </div>
        <CategoryEditorForm category={category} action={upsertCategoryAction} submitLabel="Save category" />
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Danger zone</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Remove category
            </h2>
          </div>
          <p className="section-copy">
            Deletion will fail while products still reference this category, which is the intended safety check.
          </p>
        </div>
        <form action={deleteCategoryAction} className="hero__actions">
          <input type="hidden" name="slug" value={category.slug} />
          <button type="submit" className="button button--danger">
            Delete category
          </button>
        </form>
      </section>
    </div>
  );
}
