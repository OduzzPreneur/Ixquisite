import Link from "next/link";
import { BeforeAfterComparison } from "@/components/before-after-comparison";
import { getHomePageData } from "@/lib/catalog";
import { getVisualAsset } from "@/lib/visual-assets";
import {
  CategoryTile,
  CollectionFeature,
  EditorialCard,
  LatestMosaic,
  OccasionTile,
  ProductCard,
  TrustStrip,
  VisualPanel,
} from "@/components/ui";

function normalizeHeroMetaLabel(value: string) {
  return value.trim().toLowerCase();
}

function HeroMetaIcon({ item }: { item: string }) {
  const normalized = normalizeHeroMetaLabel(item);

  if (normalized === "premium corporate wear") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="hero__meta-icon">
        <path
          d="M7.5 4.5h9l2 3.5-2 11H7.5l-2-11 2-3.5Zm2.2 0 2.3 2.7 2.3-2.7M9.4 9.3l2.6 2.6 2.6-2.6M12 7.2v8.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (normalized === "delivered in a few days") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="hero__meta-icon">
        <path
          d="M3.5 7.5h10.5v8H3.5Zm10.5 2.2h3l2.5 2.3v3.5H14M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="hero__meta-icon">
      <path
        d="M6.5 8.8a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Zm5.5 5.5v2.2m-4.6-1 1.6 2.7m9.2-2.7-1.6 2.7M4.8 12h2.4m12 0h-2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function Home() {
  const {
    settings,
    categories,
    occasions,
    articles,
    trustPoints,
    featuredCollection,
    featuredProducts,
    bestSellerProducts,
    latestProducts,
    completeLook,
    completeLookProducts,
  } = await getHomePageData();

  return (
    <>
      <section className="hero">
        <div className="hero__frame">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow hero__mobile-hidden">{settings.heroEyebrow}</p>
              <h1 className="display-title hero__mobile-hidden">{settings.heroTitle}</h1>
              <p className="section-copy hero__mobile-hidden-copy">
                {settings.heroCopy}
              </p>
              <div className="hero__actions">
                <Link href={settings.heroPrimaryHref} className="button">
                  {settings.heroPrimaryLabel}
                </Link>
                <Link href={settings.heroSecondaryHref} className="button-ghost">
                  {settings.heroSecondaryLabel}
                </Link>
              </div>
              <div className="hero__meta">
                {settings.heroMeta.map((item) => (
                  <span key={item} className="tag hero__meta-card">
                    <span className="hero__meta-icon-shell">
                      <HeroMetaIcon item={item} />
                    </span>
                    <span className="hero__meta-card-copy">{item}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hero__visual">
              <VisualPanel
                title={settings.heroVisualTitle}
                kicker="Ixquisite signature"
                tone="espresso"
                size="hero"
                image={{
                  src: settings.heroVisualSrc,
                  alt: settings.heroVisualAlt,
                  position: settings.heroVisualPosition,
                }}
                preload
              />
              <div className="hero__note">
                <strong>{settings.heroNoteTitle}</strong>
                {settings.heroNoteCopy}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section category-shortcuts">
        <div className="section-head category-shortcuts__head">
          <p className="eyebrow">Category shortcuts</p>
          <h2 className="section-title">Start from the wardrobe area that matters most.</h2>
        </div>
        <div className="grid grid--5 grid--mobile-duo category-shortcuts__grid">
          {categories.map((category) => (
            <CategoryTile key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="page-section comparison-band">
        <div className="comparison-band__frame surface-panel">
          <div className="comparison-band__copy">
            <p className="eyebrow">The Shift</p>
            <h2 className="section-title comparison-band__title">
              See the Difference
            </h2>
            <p className="section-copy comparison-band__subcopy">
              From underdressed to unmistakably refined.
            </p>
          </div>

          <BeforeAfterComparison
            beforeImage={{
              src: "/images/ixquisite/slider-before-underdressed.webp",
              alt: "Before Ixquisite: underdressed and less structured.",
              position: "center 12%",
            }}
            afterImage={{
              src: "/images/ixquisite/slider-after-confident.webp",
              alt: "The Ixquisite standard: sharp, confident, and executive.",
              position: "center 10%",
            }}
            beforeLabel="Before Ixquisite"
            beforeSubLabel="Underdressed."
            afterLabel="The Ixquisite Standard"
            afterSubLabel="Sharp. Confident."
            initialPosition={52}
          />

          <div className="comparison-band__footer">
            <p className="comparison-band__note">
              Tailored suits, shirts, ties, and finishing pieces that remove the guesswork from looking sharp.
            </p>
            <div className="comparison-band__actions">
              <Link href="/category/suits" className="button comparison-band__button">
                Shop Suits
              </Link>
              <Link href="/groom-package" className="pill-link comparison-band__pill">
                Explore Groom Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              The proven pieces clients reach for first.
            </h2>
          </div>
          <div>
            <p className="section-copy">
              Start with the strongest suit, the cleanest shirt, and the finishing piece
              that already earns repeat orders.
            </p>
            <Link href="/best-sellers" className="pill-link" style={{ marginTop: "1rem", width: "fit-content" }}>
              View all best sellers
            </Link>
          </div>
        </div>
        <div className="product-grid">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.slug} product={product} wishlistNext="/best-sellers" />
          ))}
        </div>
      </section>

      <LatestMosaic products={latestProducts} />

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Shop by occasion</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Dress for the room before you dress for the rack.
            </h2>
          </div>
          <p className="section-copy">
            Occasion-led shopping gives the homepage the same commerce clarity as a
            large retailer, but the edits stay narrow and premium.
          </p>
        </div>
        <div className="grid grid--3 grid--mobile-duo">
          {occasions.map((occasion) => (
            <OccasionTile key={occasion.slug} occasion={occasion} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="feature-split surface-panel">
          <VisualPanel
            title={settings.groomFeatureImageTitle}
            kicker="Ceremony hub"
            tone="espresso"
            size="landscape"
            image={{
              src: settings.groomFeatureImageSrc,
              alt: settings.groomFeatureImageAlt,
              position: settings.groomFeatureImagePosition,
            }}
          />
          <div className="detail-card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
            <p className="eyebrow">{settings.groomFeatureEyebrow}</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              {settings.groomFeatureTitle}
            </h2>
            <p className="section-copy">
              {settings.groomFeatureCopy}
            </p>
            <div className="pill-row">
              {settings.groomFeaturePills.map((item) => (
                <span key={item} className="pill-link">
                  {item}
                </span>
              ))}
            </div>
            <div className="hero__actions">
              <Link href={settings.groomFeaturePrimaryHref} className="button">
                {settings.groomFeaturePrimaryLabel}
              </Link>
              <Link href={settings.groomFeatureSecondaryHref} className="pill-link">
                {settings.groomFeatureSecondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <CollectionFeature collection={featuredCollection} supporting={featuredProducts} />
      </section>

      <section className="page-section">
        <div className="feature-split surface-panel">
          <VisualPanel
            title={completeLook.title}
            kicker="Complete the look"
            tone={completeLook.tone}
            size="landscape"
            image={getVisualAsset(completeLook.title)}
          />
          <div className="detail-card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
            <p className="eyebrow">Complete the look</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              {completeLook.title}
            </h2>
            <p className="section-copy">{completeLook.description}</p>
            <div className="pill-row">
              {completeLookProducts.map((product) => (
                <Link key={product.slug} href={`/product/${product.slug}`} className="pill-link">
                  {product.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Why Ixquisite</p>
          <h2 className="section-title">Trust is part of the merchandising.</h2>
        </div>
        <TrustStrip points={trustPoints} />
      </section>

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Style guidance</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Editorial guidance that still points back to product.
            </h2>
          </div>
          <p className="section-copy">
            The homepage should feel like a luxury menswear magazine that also knows
            how to convert.
          </p>
        </div>
        <div className="grid grid--3 grid--mobile-duo">
          {articles.map((article) => (
            <EditorialCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="cta-banner">
          <div>
            <p className="eyebrow" style={{ color: "rgba(240, 231, 215, 0.78)" }}>
              {settings.finalCtaEyebrow}
            </p>
            <h2 className="section-title" style={{ marginTop: "0.7rem" }}>
              {settings.finalCtaTitle}
            </h2>
            <p style={{ marginTop: "0.9rem" }}>{settings.finalCtaCopy}</p>
          </div>
          <div className="hero__actions">
            <Link href={settings.finalCtaPrimaryHref} className="button">
              {settings.finalCtaPrimaryLabel}
            </Link>
            <Link href={settings.finalCtaSecondaryHref} className="button-ghost">
              {settings.finalCtaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
