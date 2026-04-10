"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCardCommerce } from "@/components/product-card-commerce";
import type { Product, ProductImage } from "@/data/site";
import { applySwatchImageFallbacks } from "@/lib/product-swatches";

export function InteractiveProductCard({
  product,
  wishlistState,
  wishlistNext,
  defaultImage,
  detailImage,
  styledImage,
}: {
  product: Product;
  wishlistState: "idle" | "saved";
  wishlistNext: string;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
}) {
  const swatches = useMemo(
    () => applySwatchImageFallbacks(product.swatches, [defaultImage, styledImage, detailImage]),
    [defaultImage, detailImage, product.swatches, styledImage],
  );
  const [selectedColor, setSelectedColor] = useState(swatches[0]?.label ?? "");
  const selectedSwatch = swatches.find((swatch) => swatch.label === selectedColor) ?? swatches[0];
  const cardImage = selectedSwatch?.imageSrc
    ? {
        src: selectedSwatch.imageSrc,
        alt: `${product.title} in ${selectedSwatch.label}`,
        position: selectedSwatch.imagePosition ?? defaultImage?.position,
      }
    : defaultImage;
  const productHref = selectedColor ? `/product/${product.slug}?color=${encodeURIComponent(selectedColor)}` : `/product/${product.slug}`;

  return (
    <article className="product-card">
      <Link href={productHref}>
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
      <ProductCardCommerce
        product={product}
        wishlistState={wishlistState}
        wishlistNext={wishlistNext}
        swatches={swatches}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
    </article>
  );
}
