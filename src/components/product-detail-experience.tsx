"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart";
import { addToWishlistAction, removeFromWishlistAction } from "@/app/actions/wishlist";
import { ProductGallery } from "@/components/product-gallery";
import { ProductSwatches } from "@/components/product-swatches";
import type { Product, ProductImage } from "@/data/site";
import { formatPrice } from "@/data/site";
import { getProductVariants, resolveProductVariant } from "@/lib/product-variants";

export function ProductDetailExperience({
  product,
  defaultImage,
  detailImage,
  styledImage,
  initialVariantSlug,
  isSaved,
  error,
  message,
}: {
  product: Product;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
  initialVariantSlug: string;
  isSaved: boolean;
  error?: string;
  message?: string;
}) {
  const variants = useMemo(() => getProductVariants(product), [product]);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedVariantSlug, setSelectedVariantSlug] = useState(initialVariantSlug || variants[0]?.slug || "");
  const selectedVariant = resolveProductVariant({ ...product, variants }, selectedVariantSlug) ?? variants[0] ?? null;
  const selectedColor = selectedVariant?.colorName ?? "";
  const selectedMainImage = selectedVariant?.images.main ?? product.baseImage ?? defaultImage?.src ?? "";

  const params = new URLSearchParams();
  if (selectedVariant?.slug) {
    params.set("variant", selectedVariant.slug);
  }
  const query = params.toString();
  const currentUrl = query ? `${pathname}?${query}` : pathname;

  function syncSelection(nextVariantSlug: string) {
    const params = new URLSearchParams();
    if (nextVariantSlug) {
      params.set("variant", nextVariantSlug);
    }
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return (
    <div className="detail-layout">
      <div className="product-gallery-shell">
        <ProductGallery
          product={product}
          selectedVariant={selectedVariant}
          defaultImage={defaultImage}
          detailImage={detailImage}
          styledImage={styledImage}
        />
      </div>

      <div className="support-card product-detail-card">
        {error ? <p className="auth-notice auth-notice--error">{error}</p> : null}
        {message ? <p className="auth-notice auth-notice--success">{message}</p> : null}
        <div className="price-row">
          <h1 className="page-title" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>{product.title}</h1>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <p className="body-copy">{product.blurb}</p>
        <div className="pill-row">
          <span className="pill-link">{product.availability}</span>
          <span className="pill-link">{product.delivery}</span>
          <span className="pill-link">{product.fit}</span>
        </div>

        <form action={addToCartAction} className="cta-stack">
          <input type="hidden" name="product_slug" value={product.slug} />
          <input type="hidden" name="selected_variant_id" value={selectedVariant?.id ?? ""} />
          <input type="hidden" name="selected_variant_slug" value={selectedVariant?.slug ?? ""} />
          <input type="hidden" name="selected_variant_sku" value={selectedVariant?.sku ?? ""} />
          <input type="hidden" name="selected_color" value={selectedColor} />
          <input type="hidden" name="selected_image" value={selectedMainImage} />

          <div className="field">
            <label>Colour</label>
            <div className="product-detail__swatch-stack" aria-busy={isPending}>
              <div className="product-detail__option-head">
                <span className="product-detail__option-label">Selected colour</span>
                <span className="product-detail__swatch-label">{selectedColor || "Choose a colour"}</span>
              </div>
              <ProductSwatches
                variants={variants}
                selectedVariant={selectedVariant}
                onSelect={(variant) => {
                  setSelectedVariantSlug(variant.slug);
                  syncSelection(variant.slug);
                }}
                size="md"
                showLabel={false}
              />
              <span className="product-detail__swatch-note">
                Swatches choose the variant. The gallery updates to show this specific colour in all five views.
              </span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="quantity">Quantity</label>
            <select id="quantity" name="quantity" defaultValue="1">
              {[1, 2, 3, 4].map((quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="hero__actions">
            <button
              type="submit"
              className="button"
              aria-label={`Add ${product.title}${selectedColor ? ` in ${selectedColor}` : ""} to cart`}
            >
              Add to cart
            </button>
            <input type="hidden" name="next" value={currentUrl} />
            <button
              type="submit"
              formAction={isSaved ? removeFromWishlistAction : addToWishlistAction}
              className="pill-link"
              aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
            >
              {isSaved ? "Remove" : "Save"}
            </button>
            <Link href="/checkout" className="pill-link" aria-label={`Buy ${product.title} now`}>
              Buy now
            </Link>
          </div>
        </form>

        <div className="tab-list">
          <div className="tab-item">
            <h4>Measurements after payment</h4>
            <p className="body-copy">Choose the product and your preferred colour now. Measurements can be submitted or requested after checkout.</p>
          </div>
          <div className="tab-item">
            <h4>Fabric & care</h4>
            <p className="body-copy">{product.details.join(" · ")}</p>
          </div>
          <div className="tab-item">
            <h4>Best occasions</h4>
            <p className="body-copy">
              {product.occasions.length
                ? product.occasions.map((occasion) => occasion.replace(/-/g, " ")).join(" · ")
                : "Built for premium menswear dressing across work and formal events."}
            </p>
          </div>
          <div className="tab-item">
            <h4>Shipping & returns</h4>
            <p className="body-copy">Fast dispatch, visible tracking, and policy routes that stay close to the purchase action.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
