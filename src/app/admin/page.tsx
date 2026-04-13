import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-panel";
import { formatPrice } from "@/data/site";
import { getCategories, getCollections, getHomePageData, getLookbookLooks, getOccasions, getProducts } from "@/lib/catalog";
import { getMeasurementStatusLabel, getRecentOrdersForAdmin } from "@/lib/orders";

export default async function AdminOverviewPage() {
  const [products, categories, collections, occasions, homepageData, lookbookLooks, recentOrders] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections(),
    getOccasions(),
    getHomePageData(),
    getLookbookLooks(),
    getRecentOrdersForAdmin(),
  ]);
  const measurementOrders = recentOrders.filter((order) => order.payment_status === "paid" || order.status === "confirmed");
  const pendingMeasurementCount = measurementOrders.filter((order) => order.measurement_status !== "submitted").length;

  return (
    <div className="cta-stack">
      <AdminPageHeader
        eyebrow="Overview"
        title="Admin control room"
        copy="This workspace manages the live catalog, category structure, and homepage merchandising that power the storefront."
      />

      <section className="admin-summary-grid">
        <article className="surface-panel admin-summary-card">
          <span className="eyebrow">Products</span>
          <strong>{products.length}</strong>
          <p>Live catalog entries available to storefront pages.</p>
          <Link href="/admin/products" className="pill-link">
            Manage products
          </Link>
        </article>
        <article className="surface-panel admin-summary-card">
          <span className="eyebrow">Categories</span>
          <strong>{categories.length}</strong>
          <p>Top-level wardrobe lanes shown in navigation and homepage shortcuts.</p>
          <Link href="/admin/categories" className="pill-link">
            Manage categories
          </Link>
        </article>
        <article className="surface-panel admin-summary-card">
          <span className="eyebrow">Homepage</span>
          <strong>{collections.length + lookbookLooks.length}</strong>
          <p>Current featured collection and complete-look sections are editable here.</p>
          <Link href="/admin/homepage" className="pill-link">
            Edit homepage
          </Link>
        </article>
        <article className="surface-panel admin-summary-card">
          <span className="eyebrow">Measurements</span>
          <strong>{pendingMeasurementCount}</strong>
          <p>Recent paid orders still waiting for measurements or direct fit assistance.</p>
          <span className="pill-link">Tracked from confirmation flow</span>
        </article>
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Current homepage setup</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Merchandising snapshot
            </h2>
          </div>
          <p className="section-copy">
            This is the live homepage configuration the customer sees right now.
          </p>
        </div>
        <div className="admin-meta-grid">
          <div>
            <span className="admin-kicker">Hero title</span>
            <strong>{homepageData.settings.heroTitle}</strong>
          </div>
          <div>
            <span className="admin-kicker">Featured collection</span>
            <strong>{homepageData.featuredCollection.title}</strong>
          </div>
          <div>
            <span className="admin-kicker">Complete look</span>
            <strong>{homepageData.completeLook.title}</strong>
          </div>
          <div>
            <span className="admin-kicker">Final CTA</span>
            <strong>{homepageData.settings.finalCtaTitle}</strong>
          </div>
        </div>
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Order follow-up</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Recent measurement status
            </h2>
          </div>
          <p className="section-copy">
            This gives the team a direct view of which new orders still need fit details after payment.
          </p>
        </div>
        {measurementOrders.length ? (
          <div className="table-like">
            {measurementOrders.map((order) => (
              <article key={order.id}>
                <div>
                  <strong>{order.reference}</strong>
                  <p className="section-copy" style={{ marginTop: "0.45rem" }}>
                    {order.full_name} · {order.email}
                  </p>
                </div>
                <div className="table-meta">
                  <span className="muted">{getMeasurementStatusLabel(order.measurement_status)}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="section-copy">No paid or confirmed orders are waiting for measurement follow-up right now.</p>
        )}
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Recent catalog view</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Latest products in admin scope
            </h2>
          </div>
          <p className="section-copy">
            Use this as a quick scan before opening the deeper product editor.
          </p>
        </div>
        <div className="table-like">
          {products.slice(0, 6).map((product) => (
            <article key={product.slug}>
              <div>
                <strong>{product.title}</strong>
                <p className="section-copy" style={{ marginTop: "0.45rem" }}>
                  {product.category} · {product.collection}
                </p>
              </div>
              <div className="table-meta">
                <span className="muted">{product.availability}</span>
                <Link href={`/admin/products/${product.slug}`} className="pill-link">
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-panel admin-overview-panel">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Store structure</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Collections and occasions
            </h2>
          </div>
          <p className="section-copy">
            Product forms use these references when assigning each piece to the right merchandising lane.
          </p>
        </div>
        <div className="admin-dual-list">
          <div>
            <span className="admin-kicker">Collections</span>
            <ul className="admin-link-list">
              {collections.map((collection) => (
                <li key={collection.slug}>{collection.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="admin-kicker">Occasions</span>
            <ul className="admin-link-list">
              {occasions.map((occasion) => (
                <li key={occasion.slug}>{occasion.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
