import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { addToWishlistAction } from "@/app/actions/wishlist";
import type {
  Article,
  Category,
  Collection,
  Occasion,
  Product,
  Tone,
} from "@/data/site";
import { formatPrice } from "@/data/site";
import { getVisualAsset, type VisualAsset } from "@/lib/visual-assets";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const panelSizes: Record<NonNullable<VisualPanelProps["size"]>, string> = {
  hero: "(max-width: 1100px) 100vw, 42vw",
  portrait: "(max-width: 1100px) 100vw, (max-width: 1440px) 33vw, 24vw",
  occasion: "(max-width: 1100px) 100vw, (max-width: 1440px) 33vw, 26vw",
  wide: "(max-width: 1100px) 100vw, 28vw",
  landscape: "(max-width: 1100px) 100vw, 38vw",
  compact: "(max-width: 1100px) 100vw, 24vw",
};

type VisualPanelProps = {
  title: string;
  kicker?: string;
  tone: Tone;
  size?: "hero" | "portrait" | "occasion" | "wide" | "landscape" | "compact";
  className?: string;
  image?: VisualAsset;
  preload?: boolean;
};

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <div className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 ? " /" : ""}
        </span>
      ))}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  split,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  split?: ReactNode;
}) {
  return (
    <div className={cx("section-head", split ? "section-head--split" : undefined)}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title" style={{ marginTop: eyebrow ? "0.75rem" : 0 }}>
          {title}
        </h2>
      </div>
      {split ? split : copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

export function VisualPanel({
  title,
  kicker,
  tone,
  size = "portrait",
  className,
  image,
  preload = false,
}: VisualPanelProps) {
  return (
    <div className={cx("visual-panel", `tone-${tone}`, `visual-panel--${size}`, image && "visual-panel--with-image", className)}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload={preload}
            loading={preload ? "eager" : undefined}
            sizes={panelSizes[size]}
            className="visual-panel__image"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
          <span className="visual-panel__scrim" />
        </>
      ) : (
        <span className="visual-panel__line" />
      )}
      <div className="visual-panel__content">
        {kicker ? <span className="visual-panel__kicker">{kicker}</span> : null}
        <h3 className="visual-panel__title">{title}</h3>
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  tone,
  visualTitle,
  visualKicker,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  tone: Tone;
  visualTitle: string;
  visualKicker: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}) {
  const image = getVisualAsset(visualTitle);

  return (
    <section className="page-section page-hero">
      <div className="page-hero__grid">
        <div className="surface-panel" style={{ padding: "clamp(1.4rem, 2vw, 2rem)" }}>
          <Breadcrumbs items={breadcrumbs} />
          <p className="eyebrow" style={{ marginTop: "1.2rem" }}>
            {eyebrow}
          </p>
          <h1 className="page-title" style={{ marginTop: "0.8rem" }}>
            {title}
          </h1>
          <p className="page-copy" style={{ marginTop: "1rem", maxWidth: "40rem" }}>
            {copy}
          </p>
        </div>
        <VisualPanel title={visualTitle} kicker={visualKicker} tone={tone} size="wide" image={image} />
      </div>
    </section>
  );
}

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="tile-link">
      <VisualPanel
        title={category.title}
        kicker={category.caption}
        tone={category.tone}
        size="wide"
        image={category.image ?? getVisualAsset(category.title)}
      />
      <div className="tile-link__meta">
        <h3 className="tile-link__title">{category.title}</h3>
        <p className="tile-link__copy">{category.description}</p>
      </div>
    </Link>
  );
}

export function LatestMosaic({ products }: { products: Product[] }) {
  const latestProducts = products.slice(0, 6);
  const usesMosaicLayout = latestProducts.length >= 6;

  return (
    <section className="page-section latest-mosaic">
      <div className="section-head latest-mosaic__head">
        <p className="eyebrow">Latest arrivals</p>
        <h2 className="section-title">Shop by latest</h2>
      </div>
      <div className={cx("latest-mosaic__grid", !usesMosaicLayout && "latest-mosaic__grid--compact")}>
        <Link href="/new-in" className="latest-mosaic__tile latest-mosaic__tile--lead">
          <VisualPanel
            title="Latest Arrivals"
            tone="navy"
            size="landscape"
            image={getVisualAsset("Latest Arrivals")}
            className="latest-mosaic__panel latest-mosaic__panel--lead"
          />
        </Link>
        {latestProducts.map((product, index) => (
          <Link
            key={product.slug}
            href={product.isPlaceholder ? "/new-in" : `/product/${product.slug}`}
            className={cx("latest-mosaic__tile", usesMosaicLayout && `latest-mosaic__tile--slot-${index + 2}`)}
          >
            <VisualPanel
              title={product.title}
              tone={product.tone}
              size="wide"
              image={product.image ?? getVisualAsset(product.title)}
              className="latest-mosaic__panel"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function OccasionTile({ occasion }: { occasion: Occasion }) {
  return (
    <Link href={`/occasion/${occasion.slug}`} className="tile-link">
      <VisualPanel
        title={occasion.title}
        kicker="Curated occasion"
        tone={occasion.tone}
        size="occasion"
        image={occasion.image ?? getVisualAsset(occasion.title)}
      />
      <div className="tile-link__meta">
        <h3 className="tile-link__title">{occasion.title}</h3>
        <p className="tile-link__copy">{occasion.description}</p>
      </div>
    </Link>
  );
}

export function ProductCard({
  product,
  wishlistState = "idle",
  wishlistNext = "/wishlist",
}: {
  product: Product;
  wishlistState?: "idle" | "saved";
  wishlistNext?: string;
}) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`}>
        <VisualPanel
          title={product.title}
          kicker={product.category}
          tone={product.tone}
          size="portrait"
          image={product.image ?? getVisualAsset(product.title)}
        />
      </Link>
      <div className="product-card__meta">
        <Link href={`/product/${product.slug}`}>
          <div className="price-row">
            <span className="product-card__title">{product.title}</span>
            <strong>{formatPrice(product.price)}</strong>
          </div>
          <p className="product-card__copy">{product.blurb}</p>
          <div className="price-row">
            <span>{product.fit}</span>
            <span>{product.colors.length} colours</span>
          </div>
        </Link>
        {wishlistState === "saved" ? (
          <span className="pill-link" aria-label="Saved to wishlist">
            Saved
          </span>
        ) : (
          <form action={addToWishlistAction}>
            <input type="hidden" name="product_slug" value={product.slug} />
            <input type="hidden" name="next" value={wishlistNext} />
            <button type="submit" className="pill-link">
              Save
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

export function EditorialCard({ article }: { article: Article }) {
  return (
    <Link href={`/style-guide/${article.slug}`} className="editorial-card">
      <VisualPanel
        title={article.title}
        kicker={article.category}
        tone={article.tone}
        size="wide"
        image={getVisualAsset(article.title)}
      />
      <div className="editorial-card__meta">
        <h3 className="editorial-card__title">{article.title}</h3>
        <p className="editorial-card__copy">{article.description}</p>
        <span className="muted">{article.readingTime}</span>
      </div>
    </Link>
  );
}

export function CollectionFeature({ collection, supporting }: { collection: Collection; supporting: Product[] }) {
  return (
    <div className="feature-split surface-panel" style={{ padding: "clamp(1.3rem, 2vw, 1.8rem)" }}>
      <VisualPanel
        title={collection.title}
        kicker="Featured collection"
        tone={collection.tone}
        size="landscape"
        image={collection.image ?? getVisualAsset(collection.title)}
      />
      <div className="detail-card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
        <p className="eyebrow">Featured collection</p>
        <h3 className="section-title" style={{ marginTop: "0.8rem" }}>
          {collection.title}
        </h3>
        <p className="section-copy">{collection.description}</p>
        <div className="pill-row">
          {supporting.map((product) => (
            <Link key={product.slug} href={`/product/${product.slug}`} className="pill-link">
              {product.title}
            </Link>
          ))}
        </div>
        <Link href={`/collection/${collection.slug}`} className="button" style={{ width: "fit-content" }}>
          {collection.cta}
        </Link>
      </div>
    </div>
  );
}

export function TrustStrip({
  points,
}: {
  points: Array<{ title: string; copy: string }>;
}) {
  return (
    <div className="trust-strip surface-panel" style={{ padding: "0.2rem 0.2rem 0.8rem" }}>
      {points.map((point) => (
        <article key={point.title}>
          <strong>{point.title}</strong>
          <p className="muted">{point.copy}</p>
        </article>
      ))}
    </div>
  );
}

export function FilterPanel({ groups }: { groups: Array<{ title: string; items: string[] }> }) {
  return (
    <aside className="filter-panel surface-panel">
      <div>
        <p className="eyebrow">Filter & sort</p>
        <h3 className="minor-title" style={{ marginTop: "0.6rem" }}>
          Refine the edit
        </h3>
      </div>
      {groups.map((group) => (
        <div key={group.title} className="filter-group">
          <h4>{group.title}</h4>
          <div className="filter-row">
            {group.items.map((item) => (
              <span key={item} className="filter-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

export function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="checkout-card">
      <h3 className="minor-title">{title}</h3>
      <div className="body-copy" style={{ marginTop: "0.9rem" }}>
        {children}
      </div>
    </section>
  );
}
