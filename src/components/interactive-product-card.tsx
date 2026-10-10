"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCardCommerce } from "@/components/product-card-commerce";
import type { Product, ProductImage } from "@/data/site";
import { applySwatchImageFallbacks } from "@/lib/product-swatches";
import { getProductVariants } from "@/lib/product-variants";

import { addToWishlistAction } from "@/app/actions/wishlist";

export function InteractiveProductCard({
  product,
  wishlistState,
  wishlistNext,
  initialVariantSlug,
  defaultImage,
  detailImage,
  styledImage,
}: {
  product: Product;
  wishlistState: "idle" | "saved";
  wishlistNext: string;
  initialVariantSlug?: string;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
}) {
  const swatches = useMemo(
    () => applySwatchImageFallbacks(product.swatches, [defaultImage, styledImage, detailImage]),
    [defaultImage, detailImage, product.swatches, styledImage],
  );
  const variants = useMemo(() => getProductVariants({ ...product, swatches }), [product, swatches]);
  const [selectedVariantSlug, setSelectedVariantSlug] = useState(initialVariantSlug ?? variants[0]?.slug ?? "");
  const selectedVariant = variants.find((variant) => variant.slug === selectedVariantSlug) ?? variants[0];
  const cardImage = selectedVariant?.images.main
    ? {
        src: selectedVariant.images.main,
        alt: `${product.title} in ${selectedVariant.colorName} - main front view`,
        position: defaultImage?.position,
      }
    : defaultImage;
  const productHref = selectedVariant?.slug ? `/product/${product.slug}?variant=${encodeURIComponent(selectedVariant.slug)}` : `/product/${product.slug}`;

  return (
    <article className="product-card">
      <div className="product-card__media-wrapper">
        <Link href={productHref} aria-label={`View ${product.title}`}>
          <div className={`visual-panel tone-${product.tone} visual-panel--portrait${cardImage ? " visual-panel--with-image" : ""}`}>
            {cardImage ? (
              <>
                <Image
                  src={cardImage.src}
                  alt={cardImage.alt}
                  fill
                  sizes="(max-width: 1100px) 100vw, (max-width: 1440px) 33vw, 24vw"
                  className="visual-panel__image"
                  style={cardImage.position ? { objectPosition: cardImage.position } : undefined}
                />
                <span className="visual-panel__scrim" />
              </>
            ) : (
              <span className="visual-panel__line" />
            )}
            <div className="visual-panel__content">
              <span className="visual-panel__kicker">{product.category}</span>
              <h3 className="visual-panel__title">{product.title}</h3>
            </div>
          </div>
        </Link>
        <div className="product-card__wishlist-overlay">
          {wishlistState === "saved" ? (
            <span className="product-card__wishlist-btn product-card__wishlist-btn--saved" aria-label="Saved to wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#d7bf96" stroke="#d7bf96" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
          ) : (
            <form action={addToWishlistAction}>
              <input type="hidden" name="product_slug" value={product.slug} />
              <input type="hidden" name="selected_variant_slug" value={selectedVariant?.slug ?? ""} />
              <input type="hidden" name="next" value={wishlistNext} />
              <button type="submit" className="product-card__wishlist-btn" aria-label={`Save ${product.title} to wishlist`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
      <ProductCardCommerce
        product={product}
        wishlistState={wishlistState}
        wishlistNext={wishlistNext}
        variants={variants}
        selectedVariantSlug={selectedVariant?.slug}
        onSelectVariant={(variant) => setSelectedVariantSlug(variant.slug)}
      />
    </article>
  );
}
