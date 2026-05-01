"use client";

import type { CSSProperties } from "react";
import type { ProductVariant } from "@/data/site";
import { isLightSwatch } from "@/lib/product-swatches";

function getImageSwatchFallback(color: string) {
  return `repeating-linear-gradient(135deg, ${color} 0 4px, rgba(255, 255, 255, 0.45) 4px 6px)`;
}

function buildSwatchStyle(variant: ProductVariant): CSSProperties {
  if (variant.swatchType === "image") {
    if (variant.swatchImage) {
      return {
        backgroundImage: `url(${variant.swatchImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    return {
      background: getImageSwatchFallback(variant.swatchValue),
    };
  }

  return {
    background: variant.swatchValue,
  };
}

export function ProductSwatches({
  variants,
  selectedVariant,
  onSelect,
  size,
  showLabel = true,
}: {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
  size: "sm" | "md";
  showLabel?: boolean;
}) {
  const visible = variants.slice(0, 5);
  const hiddenCount = Math.max(0, variants.length - visible.length);

  return (
    <div className="product-card__swatch-block">
      {showLabel ? (
        <div className="product-card__swatch-header">
          <span className="product-card__option-label">Colour</span>
          <span className="product-card__swatch-label">{selectedVariant?.colorName ?? `${variants.length} colours`}</span>
        </div>
      ) : null}
      <div className="product-card__swatch-row" role="group" aria-label="Product colour options">
        {visible.map((variant) => {
          const selected = selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              className={`product-card__swatch product-card__swatch--${size}${selected ? " product-card__swatch--active" : ""}${isLightSwatch(variant.swatchValue) ? " product-card__swatch--light" : ""}`}
              style={buildSwatchStyle(variant)}
              aria-label={`Select ${variant.colorName} color`}
              aria-pressed={selected}
              onClick={() => onSelect(variant)}
            />
          );
        })}
        {hiddenCount ? <span className="product-card__swatch-more">+{hiddenCount}</span> : null}
      </div>
    </div>
  );
}
