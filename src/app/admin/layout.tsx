import Link from "next/link";
import { buildNoIndexMetadata } from "@/lib/seo";
import { requireAdminUser } from "@/lib/admin";

const adminNavItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/homepage", label: "Homepage" },
] as const;

export const metadata = buildNoIndexMetadata(
  "Admin workspace",
  "Internal Ixquisite commerce workspace.",
);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser("/admin");

  return (
    <section className="page-section admin-page">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="surface-panel admin-sidebar__intro">
            <p className="eyebrow">Admin panel</p>
            <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
              Commerce workspace
            </h1>
            <p className="section-copy" style={{ marginTop: "0.85rem" }}>
              Manage live catalog data and homepage messaging without opening the Supabase dashboard.
            </p>
          </div>
          <nav className="admin-nav" aria-label="Admin navigation">
            {adminNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="admin-sidebar__meta">
            <span className="pill-link">Server-validated actions</span>
            <span className="pill-link">Supabase-backed catalog</span>
            <span className="pill-link">Homepage content control</span>
          </div>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </section>
  );
}
