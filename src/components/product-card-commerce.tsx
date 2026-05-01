"use client";
import { useMemo } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { addToWishlistAction } from "@/app/actions/wishlist";
import { ProductSwatches } from "@/components/product-swatches";
import type { Product, ProductVariant } from "@/data/site";
import { formatPrice } from "@/data/site";
import { getProductVariants } from "@/lib/product-variants";

function getCardFeatures(product: Product) {
  const features = product.cardFeatures?.length ? product.cardFeatures : [product.fit, ...product.details].filter(Boolean);
  return features.slice(0, 2);
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
  variants: providedVariants,
  selectedVariantSlug,
  onSelectVariant,
}: {
  product: Product;
  wishlistState: "idle" | "saved";
  wishlistNext: string;
  variants?: ProductVariant[];
  selectedVariantSlug?: string;
  onSelectVariant?: (variant: ProductVariant) => void;
}) {
  const variants = useMemo(() => providedVariants?.length ? providedVariants : getProductVariants(product), [product, providedVariants]);
  const selectedVariant = variants.find((variant) => variant.slug === selectedVariantSlug) ?? variants[0] ?? null;
  const features = getCardFeatures(product);

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

      {variants.length ? (
        <ProductSwatches
          variants={variants}
          selectedVariant={selectedVariant}
          onSelect={onSelectVariant ?? (() => undefined)}
          size="sm"
        />
      ) : null}

      <div className="product-card__actions">
        <form action={addToCartAction}>
          <input type="hidden" name="product_slug" value={product.slug} />
          <input type="hidden" name="quantity" value="1" />
          <input type="hidden" name="selected_variant_id" value={selectedVariant?.id ?? ""} />
          <input type="hidden" name="selected_variant_slug" value={selectedVariant?.slug ?? ""} />
          <input type="hidden" name="selected_variant_sku" value={selectedVariant?.sku ?? ""} />
          <input type="hidden" name="selected_color" value={selectedVariant?.colorName ?? ""} />
          <input type="hidden" name="selected_image" value={selectedVariant?.images.main ?? ""} />
          <button
            type="submit"
            className="button product-card__button"
            aria-label={`Add ${product.title}${selectedVariant?.colorName ? ` in ${selectedVariant.colorName}` : ""} to cart`}
          >
            Add to Cart
          </button>
        </form>

        {wishlistState === "saved" ? (
          <span className="pill-link product-card__save" aria-label="Saved to wishlist">
            Saved
          </span>
        ) : (
          <form action={addToWishlistAction}>
            <input type="hidden" name="product_slug" value={product.slug} />
            <input type="hidden" name="selected_variant_slug" value={selectedVariant?.slug ?? ""} />
            <input type="hidden" name="next" value={wishlistNext} />
            <button type="submit" className="pill-link product-card__save" aria-label={`Save ${product.title} to wishlist`}>
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
