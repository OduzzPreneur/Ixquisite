"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart";
import { addToWishlistAction, removeFromWishlistAction } from "@/app/actions/wishlist";
import type { Product, ProductGalleryImage, ProductImage, ProductSwatch } from "@/data/site";
import { formatPrice } from "@/data/site";
import { resolveProductGalleryImages } from "@/lib/product-gallery";
import { applySwatchImageFallbacks, getSwatchBackground, isLightSwatch } from "@/lib/product-swatches";

function ProductMediaGallery({
  images,
  product,
  activeImage,
  onSelectImage,
  onOpenLightbox,
}: {
  images: ProductGalleryImage[];
  product: Product;
  activeImage?: ProductGalleryImage;
  onSelectImage: (image: ProductGalleryImage) => void;
  onOpenLightbox: () => void;
}) {
  return (
    <div className="product-gallery">
      <div className="product-gallery__thumbs" aria-label={`${product.title} image gallery`}>
        {images.map((image) => {
          const isActive = activeImage?.src === image.src && activeImage?.label === image.label;

          return (
            <button
              key={`${image.label}-${image.src}`}
              type="button"
              className={`product-gallery__thumb${isActive ? " product-gallery__thumb--active" : ""}`}
              onMouseEnter={() => onSelectImage(image)}
              onFocus={() => onSelectImage(image)}
              onClick={() => onSelectImage(image)}
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

      <button type="button" className="product-gallery__main" onClick={onOpenLightbox}>
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
    </div>
  );
}

function ProductGalleryLightbox({
  open,
  images,
  activeImage,
  onClose,
  onSelectImage,
}: {
  open: boolean;
  images: ProductGalleryImage[];
  activeImage?: ProductGalleryImage;
  onClose: () => void;
  onSelectImage: (image: ProductGalleryImage) => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || !activeImage) {
    return null;
  }

  return (
    <div className="product-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Product gallery">
      <button type="button" className="product-gallery-lightbox__backdrop" onClick={onClose} aria-label="Close gallery" />
      <div className="product-gallery-lightbox__panel">
        <button type="button" className="product-gallery-lightbox__close" onClick={onClose} aria-label="Close gallery">
          Close
        </button>
        <div className="product-gallery-lightbox__layout">
          <div className="product-gallery-lightbox__thumbs" aria-label="Gallery thumbnails">
            {images.map((image) => {
              const isActive = activeImage.src === image.src && activeImage.label === image.label;

              return (
                <button
                  key={`${image.label}-${image.src}-lightbox`}
                  type="button"
                  className={`product-gallery__thumb${isActive ? " product-gallery__thumb--active" : ""}`}
                  onClick={() => onSelectImage(image)}
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
          <div className="product-gallery-lightbox__main">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(max-width: 1100px) 100vw, 70vw"
              className="product-gallery-lightbox__image"
              style={activeImage.position ? { objectPosition: activeImage.position } : undefined}
            />
          </div>
        </div>
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
  isSaved,
  error,
  message,
}: {
  product: Product;
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
  initialColor: string;
  isSaved: boolean;
  error?: string;
  message?: string;
}) {
  const swatches: ProductSwatch[] = applySwatchImageFallbacks(
    product.swatches?.length
      ? product.swatches
      : product.colors.map((color) => ({ label: color, value: color })),
    [defaultImage, styledImage, detailImage],
  );
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedColor, setSelectedColor] = useState(initialColor || swatches[0]?.label || "");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState("");
  const selectedSwatch = swatches.find((swatch) => swatch.label === selectedColor) ?? swatches[0];
  const hasSwatchPreview = swatches.some((swatch) => Boolean(swatch.imageSrc));
  const selectedSwatchPreviewSrc = selectedSwatch?.imageSrc ?? null;
  const selectedSwatchPreviewPosition = selectedSwatch?.imagePosition ?? defaultImage?.position;
  const currentUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (selectedColor) {
      params.set("color", selectedColor);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, selectedColor]);

  const galleryImages = resolveProductGalleryImages(product.galleryImages, {
    defaultImage,
    detailImage,
    styledImage,
    selectedSwatchLabel: selectedColor,
    selectedSwatchImage: selectedSwatchPreviewSrc
      ? {
          src: selectedSwatchPreviewSrc,
          position: selectedSwatchPreviewPosition,
        }
      : null,
    productTitle: product.title,
  });

  const resolvedSelectedImageKey =
    selectedImageKey && galleryImages.some((image) => `${image.label}::${image.src}` === selectedImageKey)
      ? selectedImageKey
      : galleryImages[0]
        ? `${galleryImages[0].label}::${galleryImages[0].src}`
        : "";

  const activeImage = galleryImages.find((image) => `${image.label}::${image.src}` === resolvedSelectedImageKey) ?? galleryImages[0];

  function syncSelection(nextColor: string) {
    const params = new URLSearchParams();

    if (nextColor) {
      params.set("color", nextColor);
    }

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function selectImage(image: ProductGalleryImage) {
    setSelectedImageKey(`${image.label}::${image.src}`);
  }

  return (
    <>
      <div className="detail-layout">
        <div className="product-gallery-shell">
          <ProductMediaGallery
            images={galleryImages}
            product={product}
            activeImage={activeImage}
            onSelectImage={selectImage}
            onOpenLightbox={() => setIsLightboxOpen(true)}
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
            <input type="hidden" name="selected_color" value={selectedColor} />
            <div className="field">
              <label>Colour</label>
              <div className="product-detail__swatch-stack" aria-busy={isPending}>
                <div className="product-detail__option-head">
                  <span className="product-detail__option-label">Selected colour</span>
                  <span className="product-detail__swatch-label">{selectedSwatch?.label ?? "Choose a colour"}</span>
                </div>
                <div className="product-detail__swatch-row" role="group" aria-label={`${product.title} colours`}>
                  {swatches.map((swatch) => (
                    <button
                      key={swatch.label}
                      type="button"
                      className={`product-card__swatch${selectedColor === swatch.label ? " product-card__swatch--active" : ""}${isLightSwatch(swatch.value) ? " product-card__swatch--light" : ""}`}
                      style={{ background: getSwatchBackground(swatch.value) }}
                      aria-label={`Select ${swatch.label} colour`}
                      aria-pressed={selectedColor === swatch.label}
                      onClick={() => {
                        setSelectedColor(swatch.label);
                        syncSelection(swatch.label);
                      }}
                    />
                  ))}
                </div>
                <span className="product-detail__swatch-note">
                  {hasSwatchPreview
                    ? "Swatches choose the colour. The thumbnail gallery lets you inspect different views of that selection."
                    : "Swatches choose the colour. The thumbnail gallery lets you inspect the product from multiple angles."}
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

      <ProductGalleryLightbox
        open={isLightboxOpen}
        images={galleryImages}
        activeImage={activeImage}
        onClose={() => setIsLightboxOpen(false)}
        onSelectImage={selectImage}
      />
    </>
  );
}
