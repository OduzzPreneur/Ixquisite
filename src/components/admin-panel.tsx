import Link from "next/link";
import type { Category, Collection, HomePageSettings, Occasion, Product, Tone } from "@/data/site";
import { serializeSwatches } from "@/lib/product-swatches";

const toneOptions: Tone[] = ["navy", "espresso", "stone", "slate", "ink", "gold"];

function serializeList(value?: string[]) {
  return value?.join("\n") ?? "";
}

function AdminFormSectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="admin-form-section__header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="minor-title" style={{ marginTop: "0.6rem" }}>
          {title}
        </h2>
      </div>
      {copy ? <p className="section-copy admin-form-section__copy">{copy}</p> : null}
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="surface-panel utility-page-header">
      <p className="eyebrow utility-page-header__eyebrow--flush">{eyebrow}</p>
      <h1 className="page-title utility-page-header__title">{title}</h1>
      <p className="page-copy utility-page-header__copy">{copy}</p>
    </div>
  );
}

export function AdminNotice({ error, message }: { error?: string; message?: string }) {
  return (
    <>
      {error ? <p className="auth-notice auth-notice--error">{error}</p> : null}
      {message ? <p className="auth-notice auth-notice--success">{message}</p> : null}
    </>
  );
}

export function AdminEmptyState({
  title,
  copy,
  href,
  label,
}: {
  title: string;
  copy: string;
  href: string;
  label: string;
}) {
  return (
    <div className="surface-panel admin-empty-state">
      <h2>{title}</h2>
      <p>{copy}</p>
      <Link href={href} className="button">
        {label}
      </Link>
    </div>
  );
}

export function CategoryEditorForm({
  category,
  action,
  submitLabel,
}: {
  category?: Category | null;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="cta-stack admin-form">
      {category?.slug ? <input type="hidden" name="previous_slug" value={category.slug} /> : null}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={category?.slug ?? ""} placeholder="suits" required />
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={category?.title ?? ""} placeholder="Suits" required />
        </div>
        <div className="field">
          <label htmlFor="caption">Caption</label>
          <input id="caption" name="caption" defaultValue={category?.caption ?? ""} placeholder="Signature tailoring" required />
        </div>
        <div className="field">
          <label htmlFor="tone">Tone</label>
          <select id="tone" name="tone" defaultValue={category?.tone ?? "navy"}>
            {toneOptions.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort_order">Sort order</label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={String(category?.sortOrder ?? 0)}
          />
        </div>
        <div className="field field--span-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={category?.description ?? ""}
            placeholder="Sharp silhouettes for boardrooms, ceremonies, and polished evenings."
            required
          />
        </div>
      </div>
      <div className="hero__actions">
        <button type="submit" className="button">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function ProductEditorForm({
  action,
  categories,
  collections,
  occasions,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  collections: Collection[];
  occasions: Occasion[];
  product?: Product | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="cta-stack admin-form">
      {product?.slug ? <input type="hidden" name="previous_slug" value={product.slug} /> : null}
      {product?.category ? <input type="hidden" name="previous_category_slug" value={product.category} /> : null}
      {product?.collection ? <input type="hidden" name="previous_collection_slug" value={product.collection} /> : null}
      {product?.occasions?.length ? (
        <input type="hidden" name="previous_occasion_slugs" value={product.occasions.join(",")} />
      ) : null}
      <section className="surface-panel admin-form-section">
        <AdminFormSectionHeader
          eyebrow="Catalog identity"
          title="Core record"
          copy="Set the title, slug, pricing, and the top-level storefront state for this product."
        />
        <div className="form-grid">
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={product?.slug ?? ""} placeholder="midnight-commander-suit" required />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" defaultValue={product?.title ?? ""} placeholder="Midnight Commander Suit" required />
          </div>
          <div className="field">
            <label htmlFor="price">Price (kobo)</label>
            <input id="price" name="price" type="number" min="0" defaultValue={String(product?.price ?? 0)} required />
          </div>
          <div className="field">
            <label htmlFor="availability">Availability</label>
            <input id="availability" name="availability" defaultValue={product?.availability ?? ""} placeholder="In stock" required />
          </div>
          <div className="field">
            <label htmlFor="tone">Tone</label>
            <select id="tone" name="tone" defaultValue={product?.tone ?? "navy"}>
              {toneOptions.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="featured_rank">Featured rank</label>
            <input
              id="featured_rank"
              name="featured_rank"
              type="number"
              defaultValue={String(product?.featuredRank ?? 100)}
            />
          </div>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <AdminFormSectionHeader
          eyebrow="Merchandising"
          title="Placement and flags"
          copy="Control where the product appears across navigation lanes, occasion editing, and promotional lists."
        />
        <div className="form-grid">
          <div className="field">
            <label htmlFor="category_slug">Category</label>
            <select id="category_slug" name="category_slug" defaultValue={product?.category ?? categories[0]?.slug ?? ""}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="collection_slug">Collection</label>
            <select id="collection_slug" name="collection_slug" defaultValue={product?.collection ?? collections[0]?.slug ?? ""}>
              {collections.map((collection) => (
                <option key={collection.slug} value={collection.slug}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field field--span-2">
            <label htmlFor="occasion_slugs">Occasion slugs</label>
            <textarea
              id="occasion_slugs"
              name="occasion_slugs"
              defaultValue={serializeList(product?.occasions)}
              placeholder={occasions.map((occasion) => occasion.slug).join("\n")}
            />
            <p className="admin-field-hint">One slug per line. These control the “Shop by occasion” links and occasion detail pages.</p>
          </div>
          <div className="field field--span-2">
            <label htmlFor="complete_the_look">Complete the look</label>
            <textarea
              id="complete_the_look"
              name="complete_the_look"
              defaultValue={serializeList(product?.completeTheLook)}
              placeholder={"ivory-broadcloth-shirt\nregent-silk-tie"}
            />
            <p className="admin-field-hint">Add related product slugs, one per line, to power the companion recommendations.</p>
          </div>
        </div>
        <div className="admin-checklist admin-checklist--grid">
          <label className="admin-checkbox">
            <input type="checkbox" name="is_new" defaultChecked={product?.isNew ?? false} />
            <span>Show in New In</span>
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" name="is_best_seller" defaultChecked={product?.isBestSeller ?? false} />
            <span>Show in Best Sellers</span>
          </label>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <AdminFormSectionHeader
          eyebrow="Storefront copy"
          title="Description and selling points"
          copy="These fields appear in product listings and product detail pages, so keep them concise and specific."
        />
        <div className="form-grid">
          <div className="field field--span-2">
            <label htmlFor="blurb">Short blurb</label>
            <textarea
              id="blurb"
              name="blurb"
              defaultValue={product?.blurb ?? ""}
              placeholder="A deep navy two-piece designed to hold structure from morning briefings to evening dinners."
              required
            />
          </div>
          <div className="field field--span-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              placeholder="Half-canvas tailoring, a clean shoulder, and subtle sheen make this the dependable hero of the wardrobe."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="delivery">Delivery copy</label>
            <input id="delivery" name="delivery" defaultValue={product?.delivery ?? ""} placeholder="Delivered in 2-4 days" required />
          </div>
          <div className="field">
            <label htmlFor="fit">Fit</label>
            <input id="fit" name="fit" defaultValue={product?.fit ?? ""} placeholder="Structured slim fit" required />
          </div>
          <div className="field">
            <label htmlFor="rating_value">Rating</label>
            <input
              id="rating_value"
              name="rating_value"
              type="number"
              min="0"
              max="5"
              step="0.1"
              defaultValue={String(product?.ratingValue ?? 4.8)}
            />
          </div>
          <div className="field">
            <label htmlFor="review_count">Review count</label>
            <input
              id="review_count"
              name="review_count"
              type="number"
              min="0"
              defaultValue={String(product?.reviewCount ?? 0)}
            />
          </div>
          <div className="field field--span-2">
            <label htmlFor="card_features">Card features</label>
            <textarea
              id="card_features"
              name="card_features"
              defaultValue={serializeList(product?.cardFeatures)}
              placeholder={"Tailored fit\nPremium fabric"}
            />
            <p className="admin-field-hint">Keep this to two short lines. These appear directly under the rating row on the product card.</p>
          </div>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <AdminFormSectionHeader
          eyebrow="Specifications"
          title="Options, swatches, and detail lists"
          copy="Use structured swatch rows plus one line per value for sizes and detail bullets."
        />
        <div className="form-grid">
          <div className="field field--span-2">
            <label htmlFor="swatches">Swatches</label>
            <textarea
              id="swatches"
              name="swatches"
              defaultValue={serializeSwatches(product?.swatches)}
              placeholder={"Midnight Navy | #244669\nGraphite | #5a616a\nIvory & Gold | linear-gradient(135deg, #ebe1cf 0% 50%, #ba9a55 50% 100%) | /images/ixquisite/heirloom-accessory-set.webp | center 18%"}
            />
            <p className="admin-field-hint">One swatch per line: label | value | optional image path | optional image position.</p>
          </div>
          <div className="field">
            <label htmlFor="colors">Colours</label>
            <textarea
              id="colors"
              name="colors"
              defaultValue={serializeList(product?.colors)}
              placeholder={"Midnight Navy\nGraphite"}
            />
            <p className="admin-field-hint">Legacy fallback only. When swatches are provided, colour labels will be derived from them automatically.</p>
          </div>
          <div className="field">
            <label htmlFor="sizes">Sizes</label>
            <textarea
              id="sizes"
              name="sizes"
              defaultValue={serializeList(product?.sizes)}
              placeholder={"48\n50\n52"}
            />
          </div>
          <div className="field field--span-2">
            <label htmlFor="details">Details</label>
            <textarea
              id="details"
              name="details"
              defaultValue={serializeList(product?.details)}
              placeholder={"Wool blend\nHalf-canvas front\nDouble vent"}
            />
          </div>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <AdminFormSectionHeader
          eyebrow="Visuals"
          title="Product imagery"
          copy="Use paths inside `public/`. These fields feed the product card, product page, and any featured merchandising placements."
        />
        <div className="form-grid">
          <div className="field field--span-2">
            <label htmlFor="image_url">Product image path</label>
            <input
              id="image_url"
              name="image_url"
              defaultValue={product?.image?.src ?? ""}
              placeholder="/images/ixquisite/cocoa-double-breasted-suit.webp"
            />
          </div>
          <div className="field">
            <label htmlFor="image_alt">Image alt</label>
            <input
              id="image_alt"
              name="image_alt"
              defaultValue={product?.image?.alt ?? ""}
              placeholder="Model in a sharply tailored double-breasted suit."
            />
          </div>
          <div className="field">
            <label htmlFor="image_position">Image position</label>
            <input
              id="image_position"
              name="image_position"
              defaultValue={product?.image?.position ?? ""}
              placeholder="center 18%"
            />
          </div>
        </div>
      </section>
      <div className="hero__actions">
        <button type="submit" className="button">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function HomepageEditorForm({
  settings,
  collections,
  lookbookLooks,
  action,
}: {
  settings: HomePageSettings;
  collections: Collection[];
  lookbookLooks: Array<{ slug: string; title: string }>;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="cta-stack admin-form">
      <section className="surface-panel admin-form-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Hero</p>
            <h2 className="section-title">First screen</h2>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="hero_eyebrow">Eyebrow</label>
            <input id="hero_eyebrow" name="hero_eyebrow" defaultValue={settings.heroEyebrow} />
          </div>
          <div className="field">
            <label htmlFor="hero_title">Title</label>
            <input id="hero_title" name="hero_title" defaultValue={settings.heroTitle} />
          </div>
          <div className="field field--span-2">
            <label htmlFor="hero_copy">Copy</label>
            <textarea id="hero_copy" name="hero_copy" defaultValue={settings.heroCopy} />
          </div>
          <div className="field">
            <label htmlFor="hero_primary_label">Primary label</label>
            <input id="hero_primary_label" name="hero_primary_label" defaultValue={settings.heroPrimaryLabel} />
          </div>
          <div className="field">
            <label htmlFor="hero_primary_href">Primary link</label>
            <input id="hero_primary_href" name="hero_primary_href" defaultValue={settings.heroPrimaryHref} />
          </div>
          <div className="field">
            <label htmlFor="hero_secondary_label">Secondary label</label>
            <input id="hero_secondary_label" name="hero_secondary_label" defaultValue={settings.heroSecondaryLabel} />
          </div>
          <div className="field">
            <label htmlFor="hero_secondary_href">Secondary link</label>
            <input id="hero_secondary_href" name="hero_secondary_href" defaultValue={settings.heroSecondaryHref} />
          </div>
          <div className="field">
            <label htmlFor="hero_visual_title">Visual title</label>
            <input id="hero_visual_title" name="hero_visual_title" defaultValue={settings.heroVisualTitle} />
          </div>
          <div className="field field--span-2">
            <label htmlFor="hero_visual_src">Visual image path</label>
            <input id="hero_visual_src" name="hero_visual_src" defaultValue={settings.heroVisualSrc} />
          </div>
          <div className="field">
            <label htmlFor="hero_visual_alt">Visual alt</label>
            <input id="hero_visual_alt" name="hero_visual_alt" defaultValue={settings.heroVisualAlt} />
          </div>
          <div className="field">
            <label htmlFor="hero_visual_position">Visual position</label>
            <input id="hero_visual_position" name="hero_visual_position" defaultValue={settings.heroVisualPosition} />
          </div>
          <div className="field">
            <label htmlFor="hero_note_title">Note title</label>
            <input id="hero_note_title" name="hero_note_title" defaultValue={settings.heroNoteTitle} />
          </div>
          <div className="field field--span-2">
            <label htmlFor="hero_note_copy">Note copy</label>
            <textarea id="hero_note_copy" name="hero_note_copy" defaultValue={settings.heroNoteCopy} />
          </div>
          <div className="field field--span-2">
            <label htmlFor="hero_meta">Meta tags</label>
            <textarea id="hero_meta" name="hero_meta" defaultValue={serializeList(settings.heroMeta)} />
          </div>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Homepage feature</p>
            <h2 className="section-title">Groom package callout</h2>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="groom_feature_eyebrow">Eyebrow</label>
            <input id="groom_feature_eyebrow" name="groom_feature_eyebrow" defaultValue={settings.groomFeatureEyebrow} />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_title">Title</label>
            <input id="groom_feature_title" name="groom_feature_title" defaultValue={settings.groomFeatureTitle} />
          </div>
          <div className="field field--span-2">
            <label htmlFor="groom_feature_copy">Copy</label>
            <textarea id="groom_feature_copy" name="groom_feature_copy" defaultValue={settings.groomFeatureCopy} />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_primary_label">Primary label</label>
            <input
              id="groom_feature_primary_label"
              name="groom_feature_primary_label"
              defaultValue={settings.groomFeaturePrimaryLabel}
            />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_primary_href">Primary link</label>
            <input
              id="groom_feature_primary_href"
              name="groom_feature_primary_href"
              defaultValue={settings.groomFeaturePrimaryHref}
            />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_secondary_label">Secondary label</label>
            <input
              id="groom_feature_secondary_label"
              name="groom_feature_secondary_label"
              defaultValue={settings.groomFeatureSecondaryLabel}
            />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_secondary_href">Secondary link</label>
            <input
              id="groom_feature_secondary_href"
              name="groom_feature_secondary_href"
              defaultValue={settings.groomFeatureSecondaryHref}
            />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_image_title">Visual title</label>
            <input
              id="groom_feature_image_title"
              name="groom_feature_image_title"
              defaultValue={settings.groomFeatureImageTitle}
            />
          </div>
          <div className="field field--span-2">
            <label htmlFor="groom_feature_image_src">Visual image path</label>
            <input
              id="groom_feature_image_src"
              name="groom_feature_image_src"
              defaultValue={settings.groomFeatureImageSrc}
            />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_image_alt">Visual alt</label>
            <input
              id="groom_feature_image_alt"
              name="groom_feature_image_alt"
              defaultValue={settings.groomFeatureImageAlt}
            />
          </div>
          <div className="field">
            <label htmlFor="groom_feature_image_position">Visual position</label>
            <input
              id="groom_feature_image_position"
              name="groom_feature_image_position"
              defaultValue={settings.groomFeatureImagePosition}
            />
          </div>
          <div className="field field--span-2">
            <label htmlFor="groom_feature_pills">Pills</label>
            <textarea
              id="groom_feature_pills"
              name="groom_feature_pills"
              defaultValue={serializeList(settings.groomFeaturePills)}
            />
          </div>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Homepage merchandising</p>
            <h2 className="section-title">Featured collection and look</h2>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="featured_collection_slug">Featured collection</label>
            <select id="featured_collection_slug" name="featured_collection_slug" defaultValue={settings.featuredCollectionSlug}>
              {collections.map((collection) => (
                <option key={collection.slug} value={collection.slug}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="complete_look_slug">Complete look</label>
            <select id="complete_look_slug" name="complete_look_slug" defaultValue={settings.completeLookSlug}>
              {lookbookLooks.map((look) => (
                <option key={look.slug} value={look.slug}>
                  {look.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="surface-panel admin-form-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Final banner</p>
            <h2 className="section-title">Closing call to action</h2>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="final_cta_eyebrow">Eyebrow</label>
            <input id="final_cta_eyebrow" name="final_cta_eyebrow" defaultValue={settings.finalCtaEyebrow} />
          </div>
          <div className="field">
            <label htmlFor="final_cta_title">Title</label>
            <input id="final_cta_title" name="final_cta_title" defaultValue={settings.finalCtaTitle} />
          </div>
          <div className="field field--span-2">
            <label htmlFor="final_cta_copy">Copy</label>
            <textarea id="final_cta_copy" name="final_cta_copy" defaultValue={settings.finalCtaCopy} />
          </div>
          <div className="field">
            <label htmlFor="final_cta_primary_label">Primary label</label>
            <input
              id="final_cta_primary_label"
              name="final_cta_primary_label"
              defaultValue={settings.finalCtaPrimaryLabel}
            />
          </div>
          <div className="field">
            <label htmlFor="final_cta_primary_href">Primary link</label>
            <input id="final_cta_primary_href" name="final_cta_primary_href" defaultValue={settings.finalCtaPrimaryHref} />
          </div>
          <div className="field">
            <label htmlFor="final_cta_secondary_label">Secondary label</label>
            <input
              id="final_cta_secondary_label"
              name="final_cta_secondary_label"
              defaultValue={settings.finalCtaSecondaryLabel}
            />
          </div>
          <div className="field">
            <label htmlFor="final_cta_secondary_href">Secondary link</label>
            <input
              id="final_cta_secondary_href"
              name="final_cta_secondary_href"
              defaultValue={settings.finalCtaSecondaryHref}
            />
          </div>
        </div>
      </section>

      <div className="hero__actions">
        <button type="submit" className="button">
          Save homepage
        </button>
      </div>
    </form>
  );
}
