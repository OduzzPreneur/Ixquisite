import Link from "next/link";
import type { ReactNode } from "react";
import { accountLinks, helpTopics, searchSuggestions, type Product } from "@/data/site";
import { getVisualAsset } from "@/lib/visual-assets";
import { Breadcrumbs, FilterPanel, PageHero, ProductCard, VisualPanel } from "@/components/ui";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

export function ListingPage({
  eyebrow,
  title,
  copy,
  tone,
  visualTitle,
  visualKicker,
  breadcrumbs,
  products,
  wishlistSlugs = [],
  wishlistNext,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  tone: "navy" | "espresso" | "stone" | "slate" | "ink" | "gold";
  visualTitle: string;
  visualKicker: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  products: Product[];
  wishlistSlugs?: string[];
  wishlistNext?: string;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        copy={copy}
        tone={tone}
        visualTitle={visualTitle}
        visualKicker={visualKicker}
        breadcrumbs={breadcrumbs}
      />
      <section className="page-section">
        <div className="listing-layout">
          <FilterPanel
            groups={[
              { title: "Size", items: ["48", "50", "52", "54", "56"] },
              { title: "Colour", items: ["Navy", "Ivory", "Cocoa", "Slate"] },
              { title: "Fit", items: ["Slim", "Tailored", "Classic"] },
              { title: "Occasion", items: ["Office", "Executive", "Wedding Guest"] },
            ]}
          />
          <div>
            <div className="price-row" style={{ marginBottom: "1rem" }}>
              <p className="muted">{products.length} curated results</p>
              <span className="pill-link">Sort: Featured</span>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  wishlistState={wishlistSlugs.includes(product.slug) ? "saved" : "idle"}
                  wishlistNext={wishlistNext}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function PolicyPage({
  eyebrow,
  title,
  copy,
  items,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  items: Array<{ title: string; copy: string }>;
}) {
  return (
    <>
      <section className="page-section page-hero">
        <div className="surface-panel">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title" style={{ marginTop: "0.8rem" }}>
            {title}
          </h1>
          <p className="page-copy" style={{ marginTop: "1rem", maxWidth: "44rem" }}>
            {copy}
          </p>
        </div>
      </section>
      <section className="page-section">
        <div className="grid grid--2">
          {items.map((item) => (
            <article key={item.title} className="support-card">
              <h2 className="minor-title">{item.title}</h2>
              <p className="body-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function AccountShell({ title, copy, children }: { title: string; copy: string; children: ReactNode }) {
  return (
    <section className="page-section page-hero">
      <div className="account-layout">
        <aside className="account-sidebar surface-panel">
          <p className="eyebrow">Account</p>
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </aside>
        <div className="account-card">
          <h1 className="page-title">{title}</h1>
          <p className="page-copy" style={{ marginTop: "0.9rem" }}>
            {copy}
          </p>
          <div style={{ marginTop: "1.5rem" }}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export function AuthPage({
  eyebrow,
  title,
  copy,
  fields,
  cta,
  footer,
  action,
  next,
  error,
  message,
  showSocialAuth = false,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder: string;
    autoComplete?: string;
    defaultValue?: string;
  }>;
  cta: string;
  footer: ReactNode;
  action: (formData: FormData) => void | Promise<void>;
  next?: string;
  error?: string;
  message?: string;
  showSocialAuth?: boolean;
}) {
  return (
    <section className="page-section page-hero">
      <div className="feature-split">
        <div className="surface-panel">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title" style={{ marginTop: "0.8rem" }}>
            {title}
          </h1>
          <p className="page-copy" style={{ marginTop: "0.9rem" }}>
            {copy}
          </p>
          {error ? <p className="auth-notice auth-notice--error">{error}</p> : null}
          {message ? <p className="auth-notice auth-notice--success">{message}</p> : null}
          <form action={action} className="cta-stack" style={{ marginTop: "1.5rem" }}>
            {next ? <input type="hidden" name="next" value={next} /> : null}
            <div className="form-grid">
              {fields.map((field) => (
                <div key={field.name} className="field">
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    defaultValue={field.defaultValue}
                  />
                </div>
              ))}
            </div>
            <button className="button" type="submit">
              {cta}
            </button>
          </form>
          {showSocialAuth ? <SocialAuthButtons next={next} /> : null}
          <div className="cta-stack" style={{ marginTop: "1rem" }}>
            {footer}
          </div>
        </div>
        <VisualPanel
          title="Private fittings made simple"
          kicker="Account access"
          tone="navy"
          size="landscape"
          image={getVisualAsset("Private fittings made simple")}
        />
      </div>
    </section>
  );
}

export function HelpHub() {
  return (
    <section className="page-section">
      <div className="grid grid--2">
        {helpTopics.map((topic) => (
          <Link key={topic.href} href={topic.href} className="support-card">
            <h2 className="minor-title">{topic.title}</h2>
            <p className="body-copy">{topic.copy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SearchShell({
  query,
  results,
  wishlistSlugs = [],
}: {
  query: string;
  results: Product[];
  wishlistSlugs?: string[];
}) {
  return (
    <>
      <section className="page-section page-hero">
        <div className="surface-panel">
          <p className="eyebrow">Search</p>
          <h1 className="page-title" style={{ marginTop: "0.8rem" }}>
            Find the exact look faster.
          </h1>
          <div className="form-grid" style={{ marginTop: "1.4rem" }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="search_query">Search terms</label>
              <input
                id="search_query"
                name="q"
                defaultValue={query}
                placeholder="Brown double-breasted suit"
              />
            </div>
          </div>
          <div className="pill-row" style={{ marginTop: "1rem" }}>
            {searchSuggestions.map((suggestion) => (
              <span key={suggestion} className="pill-link">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="listing-layout">
          <FilterPanel
            groups={[
              { title: "Category", items: ["Suits", "Shirts", "Trousers", "Ties"] },
              { title: "Occasion", items: ["Office", "Wedding Guest", "Executive"] },
              { title: "Availability", items: ["In stock", "Ready to ship"] },
            ]}
          />
          <div>
            <div className="price-row" style={{ marginBottom: "1rem" }}>
              <p className="muted">{results.length} result(s)</p>
              <span className="pill-link">Sort: Relevance</span>
            </div>
            {results.length ? (
              <div className="product-grid">
                {results.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    wishlistState={wishlistSlugs.includes(product.slug) ? "saved" : "idle"}
                    wishlistNext={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}
                  />
                ))}
              </div>
            ) : (
              <div className="surface-panel">
                <h2 className="minor-title">No exact matches</h2>
                <p className="body-copy">
                  Try a broader term like suits, shirts, or executive accessories.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function SectionCardGrid({ items }: { items: Array<{ title: string; copy: string; href?: string }> }) {
  return (
    <div className="grid grid--2">
      {items.map((item) => {
        const body = (
          <>
            <h2 className="minor-title">{item.title}</h2>
            <p className="body-copy">{item.copy}</p>
          </>
        );

        return item.href ? (
          <Link key={item.title} href={item.href} className="support-card">
            {body}
          </Link>
        ) : (
          <article key={item.title} className="support-card">
            {body}
          </article>
        );
      })}
    </div>
  );
}

export function UtilityPageHeader({
  eyebrow,
  title,
  copy,
  breadcrumbs,
  compactOnMobile = false,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  compactOnMobile?: boolean;
}) {
  return (
    <section className="page-section page-hero">
      <div className={`surface-panel utility-page-header${compactOnMobile ? " utility-page-header--compact-mobile" : ""}`}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <p className={`eyebrow utility-page-header__eyebrow${breadcrumbs ? "" : " utility-page-header__eyebrow--flush"}`}>
          {eyebrow}
        </p>
        <h1 className="page-title utility-page-header__title">
          {title}
        </h1>
        <p className="page-copy utility-page-header__copy">
          {copy}
        </p>
      </div>
    </section>
  );
}
