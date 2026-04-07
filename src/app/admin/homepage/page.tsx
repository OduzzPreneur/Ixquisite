import Link from "next/link";
import { updateHomepageSettingsAction } from "@/app/actions/admin";
import { AdminNotice, AdminPageHeader, HomepageEditorForm } from "@/components/admin-panel";
import { getCollections, getLookbookLooks } from "@/lib/catalog";
import { getHomePageSettings } from "@/lib/homepage";

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, settings, collections, lookbookLooks] = await Promise.all([
    searchParams,
    getHomePageSettings(),
    getCollections(),
    getLookbookLooks(),
  ]);

  return (
    <div className="cta-stack">
      <AdminPageHeader
        eyebrow="Homepage"
        title="Homepage editor"
        copy="Control the hero, the groom-package feature, and the closing CTA without changing code or touching the database directly."
      />
      <AdminNotice error={params.error} message={params.message} />

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Live storefront</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Edit homepage messaging
            </h2>
          </div>
          <div className="hero__actions hero__actions--compact">
            <Link href="/" className="pill-link">
              View homepage
            </Link>
          </div>
        </div>
        <HomepageEditorForm
          settings={settings}
          collections={collections}
          lookbookLooks={lookbookLooks.map((look) => ({ slug: look.slug, title: look.title }))}
          action={updateHomepageSettingsAction}
        />
      </section>
    </div>
  );
}
