"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCardCommerce } from "@/components/product-card-commerce";
import type { Product, ProductImage } from "@/data/site";
import { applySwatchImageFallbacks } from "@/lib/product-swatches";
import { getProductVariants } from "@/lib/product-variants";

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
