import Link from "next/link";
import { addGroomPackageToCartAction } from "@/app/actions/groom-package";
import {
  groomAccessoryBundle,
  groomBuilderOptions,
  groomCoordinationPoints,
  groomPackageAddOns,
  groomPackageBundleNotes,
  groomPackageIncluded,
  groomPackageIntro,
  groomPackageReasons,
  groomPackageTiers,
  groomSupportTopics,
  groomTrustStory,
  weddingDeliveryPoints,
} from "@/data/site";
import { getProductsBySlugs } from "@/lib/catalog";
import { getVisualAsset } from "@/lib/visual-assets";
import { ProductCard, TrustStrip, VisualPanel } from "@/components/ui";

export default async function GroomPackagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const [packageProducts, accessoryProducts] = await Promise.all([
    getProductsBySlugs([
      ...new Set([
        ...groomBuilderOptions.suits,
        ...groomBuilderOptions.shirts,
        ...groomBuilderOptions.ties,
        ...groomBuilderOptions.accessories,
      ]),
    ]),
    getProductsBySlugs(groomBuilderOptions.accessories),
  ]);

  return (
    <>
      <section className="hero hero--groom">
        <div className="hero__frame">
          <div className="hero__grid hero__grid--groom">
            <div className="hero__copy">
              <p className="eyebrow">{groomPackageIntro.eyebrow}</p>
              <h1 className="display-title">{groomPackageIntro.title}</h1>
              <p className="section-copy">{groomPackageIntro.description}</p>
              <div className="hero__actions">
                <a href="#groom-builder" className="button">
                  Choose Your Package
                </a>
                <Link href="/wedding-inquiry" className="button-ghost">
                  Get Styling Help
                </Link>
              </div>
              <div className="hero__meta">
                <span className="tag">Curated ceremony bundle</span>
                <span className="tag">Standard package recommended</span>
                <span className="tag">Groomsmen support available</span>
              </div>
            </div>
            <div className="hero__visual">
              <VisualPanel
                title="Your Wedding Look. Perfectly Handled."
                kicker="Groom's package"
                tone="espresso"
                size="hero"
                image={getVisualAsset("Your Wedding Look. Perfectly Handled.")}
                preload
              />
              <div className="hero__note">
                <strong>Wedding hub direction</strong>
                Ceremony-first, emotionally elevated, and still unmistakably Ixquisite.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Why the package exists</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Ceremony dressing without the search fatigue.
            </h2>
          </div>
          <p className="section-copy">
            The groom package keeps the tone premium and the path practical: one look, clear tiers, and support when the wedding details stop being standard.
          </p>
        </div>
        <div className="grid grid--3">
          {groomPackageReasons.map((reason) => (
            <article key={reason.title} className="support-card">
              <h3 className="minor-title">{reason.title}</h3>
              <p className="body-copy">{reason.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Choose your package</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Three curated tiers. One clear recommendation.
            </h2>
          </div>
          <p className="section-copy">
            Standard is the anchor because it gives the groom the full polished read without overcomplicating the decision.
          </p>
        </div>
        <div className="grid grid--3 groom-tier-grid">
          {groomPackageTiers.map((tier) => (
            <article
              key={tier.slug}
              className={`groom-tier${tier.recommended ? " groom-tier--featured" : ""}`}
            >
              <VisualPanel
                title={tier.title}
                kicker={tier.recommended ? "Recommended package" : "Curated tier"}
                tone={tier.recommended ? "espresso" : "navy"}
                size="landscape"
                image={getVisualAsset(tier.title)}
              />
              <div className="groom-tier__body">
                <div className="price-row">
                  <h3 className="minor-title">{tier.title}</h3>
                  <strong>{tier.priceLabel}</strong>
                </div>
                <p className="body-copy">{tier.description}</p>
                <div className="pill-row">
                  {tier.included.map((item) => (
                    <span key={item} className="pill-link">
                      {item}
                    </span>
                  ))}
                </div>
                <ul className="groom-tier__list">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div className="hero__actions hero__actions--compact">
                  <a href="#groom-builder" className="button">
                    Build {tier.recommended ? "the standard look" : "this package"}
                  </a>
                  <Link href="/wedding-inquiry" className="pill-link">
                    Ask for guidance
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="feature-split">
          <article className="support-card">
            <p className="eyebrow">What&apos;s included</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              A full groom look before any deeper customization.
            </h2>
            <ul className="groom-list">
              {groomPackageIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="support-card">
            <p className="eyebrow">Optional add-ons</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Upsells that stay ceremony-relevant.
            </h2>
            <ul className="groom-list">
              {groomPackageAddOns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="groom-builder" className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Guided look building</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Constrained choices, premium outcome.
            </h2>
          </div>
          <p className="section-copy">
            This stays intentionally narrow. If the wedding asks for something more custom, the inquiry route takes over.
          </p>
        </div>
        <div className="feature-split">
          <form action={addGroomPackageToCartAction} className="support-card groom-builder">
            {query.error ? <p className="auth-notice auth-notice--error">{query.error}</p> : null}
            <div className="field">
              <label htmlFor="tier">Package tier</label>
              <select id="tier" name="tier" defaultValue="standard">
                {groomPackageTiers.map((tier) => (
                  <option key={tier.slug} value={tier.slug}>
                    {tier.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="suit_slug">Suit option</label>
              <select id="suit_slug" name="suit_slug" defaultValue="cocoa-double-breasted-suit">
                {packageProducts
                  .filter((product) => groomBuilderOptions.suits.some((slug) => slug === product.slug))
                  .map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="shirt_slug">Shirt</label>
              <select id="shirt_slug" name="shirt_slug" defaultValue="ivory-broadcloth-shirt">
                {packageProducts
                  .filter((product) => groomBuilderOptions.shirts.some((slug) => slug === product.slug))
                  .map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="tie_slug">Tie finish</label>
              <select id="tie_slug" name="tie_slug" defaultValue="regent-silk-tie">
                {packageProducts
                  .filter((product) => groomBuilderOptions.ties.some((slug) => slug === product.slug))
                  .map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="accessory_slug">Accessory finish</label>
              <select id="accessory_slug" name="accessory_slug" defaultValue="heirloom-accessory-set">
                {accessoryProducts.map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="hero__actions">
              <button type="submit" className="button">
                Add package to cart
              </button>
              <Link href="/wedding-inquiry" className="pill-link">
                Request custom help
              </Link>
            </div>
            <div className="cta-stack" style={{ marginTop: "1rem" }}>
              {groomPackageBundleNotes.map((note) => (
                <p key={note} className="muted">
                  {note}
                </p>
              ))}
            </div>
          </form>
          <div className="support-card">
            <p className="eyebrow">Current ceremony edit</p>
            <h3 className="section-title" style={{ marginTop: "0.75rem" }}>
              Real catalog pieces behind the package.
            </h3>
            <div className="product-grid product-grid--compact">
              {packageProducts.map((product) => (
                <ProductCard key={product.slug} product={product} wishlistNext="/groom-package" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="feature-split">
          <article className="support-card">
            <p className="eyebrow">Accessories bundle</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Finish the look without opening a second tab.
            </h2>
            <p className="section-copy">{groomAccessoryBundle.description}</p>
            <ul className="groom-list">
              {groomAccessoryBundle.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="support-card">
            <p className="eyebrow">Styling support</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Help when the brief stops being standard.
            </h2>
            <ul className="groom-list">
              {groomSupportTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <div className="hero__actions" style={{ marginTop: "1rem" }}>
              <Link href="/wedding-inquiry" className="button">
                Start wedding inquiry
              </Link>
              <Link href="/contact" className="pill-link">
                Contact Ixquisite
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="feature-split surface-panel" style={{ padding: "clamp(1.3rem, 2vw, 1.8rem)" }}>
          <VisualPanel
            title="Dress your team"
            kicker="Groomsmen coordination"
            tone="navy"
            size="landscape"
            image={getVisualAsset("Dress your team")}
          />
          <div className="detail-card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
            <p className="eyebrow">Groomsmen coordination</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Keep the groom central. Keep the team aligned.
            </h2>
            <ul className="groom-list">
              {groomCoordinationPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="hero__actions">
              <Link href="/wedding-inquiry" className="button">
                Dress your team
              </Link>
              <Link href="/occasion/wedding-guest" className="pill-link">
                Browse wedding guest looks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Delivery assurance</p>
          <h2 className="section-title">Wedding purchases need more clarity than usual.</h2>
        </div>
        <TrustStrip points={weddingDeliveryPoints} />
      </section>

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Why this still feels like Ixquisite</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Proof through positioning, not generic wedding-store tropes.
            </h2>
          </div>
          <p className="section-copy">
            We are using trust and story here instead of testimonials because the brand should only show ceremony proof when the assets are strong enough.
          </p>
        </div>
        <div className="grid grid--3">
          {groomTrustStory.map((story) => (
            <article key={story.title} className="support-card">
              <h3 className="minor-title">{story.title}</h3>
              <p className="body-copy">{story.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
