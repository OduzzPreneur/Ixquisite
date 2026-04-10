"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { addToWishlistAction, removeFromWishlistAction } from "@/app/actions/wishlist";
import type { Product, ProductImage, ProductSwatch } from "@/data/site";
import { formatPrice } from "@/data/site";
import { getSwatchBackground, isLightSwatch } from "@/lib/product-swatches";

function DetailVisual({
  title,
  kicker,
  tone,
  size,
  image,
  preload = false,
}: {
  title: string;
  kicker: string;
  tone: Product["tone"];
  size: "portrait" | "wide";
  image?: ProductImage;
  preload?: boolean;
}) {
  return (
    <div className={`visual-panel tone-${tone} visual-panel--${size}${image ? " visual-panel--with-image" : ""}`}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload={preload}
            loading={preload ? "eager" : undefined}
            sizes={size === "portrait" ? "(max-width: 1100px) 100vw, (max-width: 1440px) 33vw, 24vw" : "(max-width: 1100px) 100vw, 28vw"}
            className="visual-panel__image"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
          <span className="visual-panel__scrim" />
        </>
      ) : (
        <span className="visual-panel__line" />
      )}
      <div className="visual-panel__content">
        <span className="visual-panel__kicker">{kicker}</span>
        <h3 className="visual-panel__title">{title}</h3>
      </div>
    </div>
  );
}

export function ProductDetailExperience({
  product,
  defaultImage,
  detailImage,
  styledImage,
  initialColor,
  initialSize,
  isSaved,
  error,
  message,
}: {
  product: Product;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
  initialColor: string;
  initialSize: string;
  isSaved: boolean;
  error?: string;
  message?: string;
}) {
  const swatches: ProductSwatch[] = product.swatches?.length
    ? product.swatches
    : product.colors.map((color) => ({ label: color, value: color }));
  const [selectedColor, setSelectedColor] = useState(initialColor || swatches[0]?.label || "");
  const [selectedSize, setSelectedSize] = useState(initialSize || product.sizes[0] || "");
  const selectedSwatch = swatches.find((swatch) => swatch.label === selectedColor) ?? swatches[0];
  const mainImage = selectedSwatch?.imageSrc
    ? {
        src: selectedSwatch.imageSrc,
        alt: `${product.title} in ${selectedSwatch.label}`,
        position: selectedSwatch.imagePosition ?? defaultImage?.position,
      }
    : defaultImage;
  const currentUrl = selectedColor ? `/product/${product.slug}?color=${encodeURIComponent(selectedColor)}` : `/product/${product.slug}`;

  return (
    <div className="detail-layout">
      <div className="gallery-grid">
        <DetailVisual
          title={product.title}
          kicker="Front view"
          tone={product.tone}
          size="portrait"
          image={mainImage}
          preload
        />
        <div className="gallery-stack">
          <DetailVisual title="Fabric detail" kicker="Close-up" tone={product.tone} size="wide" image={detailImage} />
          <DetailVisual title="Styled full look" kicker="Look pairing" tone={product.tone} size="wide" image={styledImage} />
        </div>
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
          <input type="hidden" name="selected_color" value={selectedColor} />
          <div className="field">
            <label>Colour</label>
            <div className="product-detail__swatch-stack">
              <div className="product-detail__swatch-row" role="group" aria-label={`${product.title} colours`}>
                {swatches.map((swatch) => (
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
              </div>
              <span className="product-detail__swatch-label">{selectedColor}</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="selected_size">Size</label>
            <select id="selected_size" name="selected_size" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
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
            <button type="submit" className="button">Add to cart</button>
            <input type="hidden" name="next" value={currentUrl} />
            <button
              type="submit"
              formAction={isSaved ? removeFromWishlistAction : addToWishlistAction}
              className="pill-link"
            >
              {isSaved ? "Remove" : "Save"}
            </button>
            <Link href="/checkout" className="pill-link">Buy now</Link>
          </div>
        </form>

        <div className="tab-list">
          <div className="tab-item">
            <h4>Fit and size confidence</h4>
            <p className="body-copy">Structured fit notes and a direct route to the size guide reduce hesitation before checkout.</p>
          </div>
          <div className="tab-item">
            <h4>Fabric & care</h4>
            <p className="body-copy">{product.details.join(" · ")}</p>
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
