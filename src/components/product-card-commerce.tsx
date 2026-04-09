"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { addToWishlistAction } from "@/app/actions/wishlist";
import type { Product } from "@/data/site";
import { formatPrice } from "@/data/site";
import { getSwatchBackground, isLightSwatch } from "@/lib/product-swatches";

function getCardFeatures(product: Product) {
  const features = product.cardFeatures?.length ? product.cardFeatures : [product.fit, ...product.details].filter(Boolean);
  return features.slice(0, 2);
}

function getVisibleSizes(product: Product) {
  return product.sizes.slice(0, 4);
}

function renderRatingStars(value: number) {
  const normalized = Math.max(0, Math.min(5, value));
  const filledCount = Math.round(normalized);
  return Array.from({ length: 5 }, (_, index) => (index < filledCount ? "★" : "☆")).join("");
}

export function ProductCardCommerce({
  product,
  wishlistState,
  wishlistNext,
}: {
  product: Product;
  wishlistState: "idle" | "saved";
  wishlistNext: string;
}) {
  const swatches = product.swatches?.length ? product.swatches : product.colors.map((color) => ({ label: color, value: color }));
  const initialSwatch = swatches[0] ?? null;
  const [selectedColor, setSelectedColor] = useState(initialSwatch?.label ?? "");
  const features = getCardFeatures(product);
  const visibleSizes = getVisibleSizes(product);
  const hiddenSizeCount = Math.max(product.sizes.length - visibleSizes.length, 0);
  const hasSingleSize = product.sizes.length <= 1;
  const quickAddSize = hasSingleSize ? (product.sizes[0] ?? "") : "";
  const productHref = selectedColor ? `/product/${product.slug}?color=${encodeURIComponent(selectedColor)}` : `/product/${product.slug}`;

  return (
    <div className="product-card__meta">
      <div className="product-card__topline">
        <strong className="product-card__price">{formatPrice(product.price)}</strong>
        <div className="product-card__rating" aria-label={`Rated ${product.ratingValue} out of 5 from ${product.reviewCount} reviews`}>
          <span className="product-card__stars">{renderRatingStars(product.ratingValue)}</span>
          <span className="product-card__reviews">({product.reviewCount})</span>
        </div>
      </div>

      {features.length ? (
        <ul className="product-card__features" aria-label={`${product.title} highlights`}>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      ) : null}

      {swatches.length ? (
        <div className="product-card__swatch-block">
          <div className="product-card__swatch-row" role="group" aria-label={`${product.title} colours`}>
            {swatches.slice(0, 4).map((swatch) => (
              <button
                key={swatch.label}
                type="button"
                className={`product-card__swatch${selectedColor === swatch.label ? " product-card__swatch--active" : ""}${isLightSwatch(swatch.value) ? " product-card__swatch--light" : ""}`}
                style={{ background: getSwatchBackground(swatch.value) }}
                aria-label={`Select ${swatch.label}`}
                aria-pressed={selectedColor === swatch.label}
                onClick={() => setSelectedColor(swatch.label)}
              />
            ))}
            {swatches.length > 4 ? <span className="product-card__swatch-more">+{swatches.length - 4}</span> : null}
          </div>
          <span className="product-card__swatch-label">{selectedColor || `${swatches.length} colours`}</span>
        </div>
      ) : null}

      {product.sizes.length ? (
        <div className="product-card__sizes" aria-label={`${product.title} sizes`}>
          {visibleSizes.map((size) => (
            <span key={size} className="product-card__size-chip">
              {size}
            </span>
          ))}
          {hiddenSizeCount ? <span className="product-card__size-chip product-card__size-chip--more">+{hiddenSizeCount}</span> : null}
        </div>
      ) : null}

      <div className="product-card__actions">
        {hasSingleSize ? (
          <form action={addToCartAction}>
            <input type="hidden" name="product_slug" value={product.slug} />
            <input type="hidden" name="quantity" value="1" />
            <input type="hidden" name="selected_size" value={quickAddSize} />
            <input type="hidden" name="selected_color" value={selectedColor} />
            <button type="submit" className="button product-card__button">
              Add to Cart
            </button>
          </form>
        ) : (
          <Link href={productHref} className="button product-card__button">
            Choose Size
          </Link>
        )}

        {wishlistState === "saved" ? (
          <span className="pill-link product-card__save" aria-label="Saved to wishlist">
            Saved
          </span>
        ) : (
          <form action={addToWishlistAction}>
            <input type="hidden" name="product_slug" value={product.slug} />
            <input type="hidden" name="next" value={wishlistNext} />
            <button type="submit" className="pill-link product-card__save">
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
