import Link from "next/link";
import { getHomePageData } from "@/lib/catalog";
import { getVisualAsset } from "@/lib/visual-assets";
import { getWishlistProductSlugsForCurrentUser } from "@/lib/wishlist";
import {
  CategoryTile,
  CollectionFeature,
  EditorialCard,
  OccasionTile,
  ProductCard,
  TrustStrip,
  VisualPanel,
} from "@/components/ui";

export default async function Home() {
  const [{
    categories,
    occasions,
    articles,
    trustPoints,
    featuredCollection,
    featuredProducts,
    latestProducts,
    completeLook,
    completeLookProducts,
  }, wishlistSlugs] = await Promise.all([getHomePageData(), getWishlistProductSlugsForCurrentUser()]);

  return (
    <>
      <section className="hero">
        <div className="hero__frame">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow hero__mobile-hidden">Quiet luxury for professionals</p>
              <h1 className="display-title hero__mobile-hidden">Tailoring that removes the search.</h1>
              <p className="section-copy hero__mobile-hidden-copy">
                Ixquisite Menswear delivers premium suits, shirts, trousers, ties,
                and accessories for men who want to look confident without moving
                across multiple stores.
              </p>
              <div className="hero__actions">
                <Link href="/category/suits" className="button">
                  Shop Suits
                </Link>
                <Link href="/collection/boardroom-edit" className="button-ghost">
                  Explore Collection
                </Link>
              </div>
              <div className="hero__meta">
                <span className="tag">Premium corporate wear</span>
                <span className="tag">Delivered in a few days</span>
                <span className="tag">Fit guidance available</span>
              </div>
            </div>
            <div className="hero__visual">
              <VisualPanel
                title="Cocoa Ceremony Suit"
                kicker="Ixquisite signature"
                tone="espresso"
                size="hero"
                image={getVisualAsset("Cocoa Ceremony Suit")}
                preload
              />
              <div className="hero__note">
                <strong>Hero product direction</strong>
                Refined, suit-led, and image-dominant without discount-store noise.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-head">
          <p className="eyebrow">Category shortcuts</p>
          <h2 className="section-title">Start from the wardrobe area that matters most.</h2>
        </div>
        <div className="grid grid--5 grid--mobile-duo">
          {categories.map((category) => (
            <CategoryTile key={category.slug} category={category} />
          ))}
        </div>
      </section>

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
        <CollectionFeature collection={featuredCollection} supporting={featuredProducts} />
      </section>

      <section className="page-section">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Best sellers and new in</p>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>
              Compact merchandising, not endless clutter.
            </h2>
          </div>
          <Link href="/new-in" className="pill-link" style={{ width: "fit-content", alignSelf: "end" }}>
            View all arrivals
          </Link>
        </div>
        <div className="product-grid">
          {latestProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              wishlistState={wishlistSlugs.includes(product.slug) ? "saved" : "idle"}
              wishlistNext="/"
            />
          ))}
        </div>
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
              Final call
            </p>
            <h2 className="section-title" style={{ marginTop: "0.7rem" }}>
              Shop the latest collection or join the private arrivals list.
            </h2>
            <p style={{ marginTop: "0.9rem" }}>
              New tailoring drops, ceremony edits, and quiet essentials for men who prefer less noise.
            </p>
          </div>
          <div className="hero__actions">
            <Link href="/collections" className="button">
              View collections
            </Link>
            <Link href="/create-account" className="button-ghost">
              Join VIP
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
