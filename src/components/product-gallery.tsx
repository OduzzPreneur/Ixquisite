"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductGalleryImage, ProductImage, ProductVariant } from "@/data/site";
import { resolveProductGalleryImages } from "@/lib/product-gallery";

function dedupe(images: ProductGalleryImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    const key = `${image.label}::${image.src}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildVariantGallery(product: Product, variant: ProductVariant | null) {
  if (!variant) {
    return [];
  }

  const imageMap = variant.images;
  const main = imageMap.main ?? product.baseImage ?? product.image?.src;
  const ordered: Array<{ key: keyof ProductVariant["images"]; label: string; alt: string }> = [
    { key: "main", label: "main", alt: `${product.title} in ${variant.colorName} - main front view` },
    { key: "layered", label: "layered", alt: `${product.title} in ${variant.colorName} - layered suit styling` },
    { key: "detail", label: "detail", alt: `${product.title} in ${variant.colorName} - collar and cuff detail` },
    { key: "fit", label: "fit", alt: `${product.title} in ${variant.colorName} - side fit angle` },
    { key: "completeLook", label: "complete look", alt: `${product.title} in ${variant.colorName} - complete the look outfit` },
  ];

  const gallery = ordered
    .map((entry) => {
      const src = imageMap[entry.key] ?? main;
      if (!src) {
        return null;
      }

      return {
        label: entry.label,
        src,
        alt: entry.alt,
      } satisfies ProductGalleryImage;
    })
    .filter((image): image is ProductGalleryImage => Boolean(image));

  // If every slot resolves to the same file, this is a synthetic swatch variant
  // and we should fall back to product.galleryImages instead.
  const uniqueSources = new Set(gallery.map((image) => image.src));
  if (uniqueSources.size <= 1) {
    return [];
  }

  return gallery;
}

export function resolveProductVariantGalleryImages({
  product,
  selectedVariant,
  defaultImage,
  detailImage,
  styledImage,
}: {
  product: Product;
  selectedVariant: ProductVariant | null;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
}) {
  const variantGallery = buildVariantGallery(product, selectedVariant);
  if (variantGallery.length) {
    return dedupe(variantGallery);
  }

  return resolveProductGalleryImages(product.galleryImages, {
    defaultImage,
    detailImage,
    styledImage,
    selectedSwatchLabel: selectedVariant?.colorName,
    selectedSwatchImage: selectedVariant?.images.main
      ? {
          src: selectedVariant.images.main,
        }
      : null,
    productTitle: product.title,
  });
}

export function ProductGallery({
  product,
  selectedVariant,
  defaultImage,
  detailImage,
  styledImage,
}: {
  product: Product;
  selectedVariant: ProductVariant | null;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
}) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const images = useMemo(
    () =>
      resolveProductVariantGalleryImages({
        product,
        selectedVariant,
        defaultImage,
        detailImage,
        styledImage,
      }),
    [defaultImage, detailImage, product, selectedVariant, styledImage],
  );

  const safeIndex = Math.max(0, Math.min(selectedIndex, Math.max(0, images.length - 1)));
  const activeImage = images[safeIndex] ?? images[0];

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => Math.min(images.length - 1, current + 1));
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [images.length, isLightboxOpen]);

  function updateIndex(next: number) {
    if (!images.length) {
      return;
    }

    setSelectedIndex(Math.max(0, Math.min(next, images.length - 1)));
  }

  function scrollMobileTrackToIndex(next: number, behavior: ScrollBehavior = "smooth") {
    const track = mobileTrackRef.current;
    if (!track || !images.length) {
      return;
    }

    const slideWidth = track.clientWidth;
    if (!slideWidth) {
      return;
    }

    track.scrollTo({
      left: slideWidth * Math.max(0, Math.min(next, images.length - 1)),
      behavior,
    });
  }

  function handleMobileTrackScroll() {
    const track = mobileTrackRef.current;
    if (!track || !images.length) {
      return;
    }

    const slideWidth = track.clientWidth;
    if (!slideWidth) {
      return;
    }

    const nextIndex = Math.round(track.scrollLeft / slideWidth);
    if (nextIndex !== safeIndex) {
      setSelectedIndex(Math.max(0, Math.min(nextIndex, images.length - 1)));
    }
  }

  return (
    <>
      <div className="product-gallery">
        <div className="product-gallery__thumbs" aria-label={`${product.title} image gallery`}>
          {images.map((image, index) => {
            const isActive = index === safeIndex;

            return (
              <button
                key={`${image.label}-${image.src}`}
                type="button"
                className={`product-gallery__thumb${isActive ? " product-gallery__thumb--active" : ""}`}
                onMouseEnter={() => updateIndex(index)}
                onFocus={() => updateIndex(index)}
                onClick={() => updateIndex(index)}
                aria-label={`Show ${image.label}`}
                aria-pressed={isActive}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="96px"
                  className="product-gallery__thumb-image"
                  style={image.position ? { objectPosition: image.position } : undefined}
                />
              </button>
            );
          })}
        </div>

        <button type="button" className="product-gallery__main" onClick={() => setIsLightboxOpen(true)}>
          {activeImage ? (
            <>
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                preload
                loading="eager"
                sizes="(max-width: 1100px) 100vw, 48vw"
                className="product-gallery__main-image"
                style={activeImage.position ? { objectPosition: activeImage.position } : undefined}
              />
              <span className="product-gallery__main-scrim" />
            </>
          ) : null}
          <span className="product-gallery__view-pill">View gallery</span>
          <div className="product-gallery__main-copy">
            <span className="product-gallery__main-kicker">Image gallery</span>
            <strong className="product-gallery__main-label">{activeImage?.label ?? product.title}</strong>
          </div>
        </button>

        <div className="product-gallery__mobile">
          <div
            ref={mobileTrackRef}
            className="product-gallery__mobile-track"
            onScroll={handleMobileTrackScroll}
            aria-label={`${product.title} image carousel`}
          >
            {images.map((image, index) => (
              <button
                key={`${image.label}-${image.src}-mobile`}
                type="button"
                className="product-gallery__mobile-slide"
                onClick={() => {
                  updateIndex(index);
                  setIsLightboxOpen(true);
                }}
                aria-label={`Open ${image.label} image`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  className="product-gallery__main-image"
                  style={image.position ? { objectPosition: image.position } : undefined}
                />
                <span className="product-gallery__main-scrim" />
              </button>
            ))}
          </div>
          <div className="product-gallery__mobile-dots" aria-label="Slide navigation">
            {images.map((image, index) => (
              <button
                key={`${image.label}-${image.src}-dot`}
                type="button"
                className={`product-gallery__mobile-dot${index === safeIndex ? " product-gallery__mobile-dot--active" : ""}`}
                onClick={() => {
                  updateIndex(index);
                  scrollMobileTrackToIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === safeIndex}
              />
            ))}
          </div>
        </div>
      </div>

      {isLightboxOpen && activeImage ? (
        <div className="product-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Product gallery">
          <button
            type="button"
            className="product-gallery-lightbox__backdrop"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close gallery"
          />
          <div className="product-gallery-lightbox__panel">
            <button
              type="button"
              className="product-gallery-lightbox__close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close gallery"
            >
              Close
            </button>
            <div className="product-gallery-lightbox__layout">
              <div className="product-gallery-lightbox__main">
                <button
                  type="button"
                  className="product-gallery-lightbox__nav product-gallery-lightbox__nav--prev"
                  onClick={() => updateIndex(safeIndex - 1)}
                  aria-label="Previous image"
                  disabled={safeIndex === 0}
                >
                  ‹
                </button>
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="(max-width: 1100px) 100vw, 70vw"
                  className="product-gallery-lightbox__image"
                  style={activeImage.position ? { objectPosition: activeImage.position } : undefined}
                />
                <button
                  type="button"
                  className="product-gallery-lightbox__nav product-gallery-lightbox__nav--next"
                  onClick={() => updateIndex(safeIndex + 1)}
                  aria-label="Next image"
                  disabled={safeIndex === images.length - 1}
                >
                  ›
                </button>
              </div>
              <div className="product-gallery-lightbox__thumbs" aria-label="Gallery thumbnails">
                {images.map((image, index) => {
                  const isActive = index === safeIndex;

                  return (
                    <button
                      key={`${image.label}-${image.src}-lightbox`}
                      type="button"
                      className={`product-gallery__thumb${isActive ? " product-gallery__thumb--active" : ""}`}
                      onClick={() => updateIndex(index)}
                      aria-label={`Show ${image.label}`}
                      aria-pressed={isActive}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="88px"
                        className="product-gallery__thumb-image"
                        style={image.position ? { objectPosition: image.position } : undefined}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
