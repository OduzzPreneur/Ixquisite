import type { ProductGalleryImage, ProductImage } from "@/data/site";

type GalleryFallbackInput = {
  defaultImage?: ProductImage;
  detailImage?: ProductImage;
  styledImage?: ProductImage;
  selectedSwatchLabel?: string;
  selectedSwatchImage?: {
    src: string;
    position?: string;
  } | null;
  productTitle: string;
};

function dedupeGalleryImages(images: ProductGalleryImage[]) {
  const seen = new Set<string>();

  return images.filter((image) => {
    const key = [image.label, image.src, image.swatchLabel ?? ""].join("::");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function normalizeProductGalleryImages(images: ProductGalleryImage[] | null | undefined) {
  return (images ?? [])
    .map((image) => ({
      label: image.label.trim(),
      src: image.src.trim(),
      alt: image.alt.trim(),
      position: image.position?.trim() || undefined,
      swatchLabel: image.swatchLabel?.trim() || undefined,
    }))
    .filter((image) => image.label && image.src && image.alt);
}

export function serializeGalleryImages(images: ProductGalleryImage[] | undefined) {
  return images
    ?.map((image) => [image.label, image.src, image.alt, image.position ?? "", image.swatchLabel ?? ""].join(" | "))
    .join("\n") ?? "";
}

export function parseSerializedGalleryImages(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, src, alt, position, swatchLabel] = line.split("|").map((part) => part.trim());

      if (!label || !src || !alt) {
        throw new Error(`Gallery row ${index + 1} must include label, image path, and alt text.`);
      }

      return {
        label,
        src,
        alt,
        position: position || undefined,
        swatchLabel: swatchLabel || undefined,
      } satisfies ProductGalleryImage;
    });
}

export function resolveProductGalleryImages(
  images: ProductGalleryImage[] | null | undefined,
  fallback: GalleryFallbackInput,
) {
  const normalized = normalizeProductGalleryImages(images);
  const selectedSwatchLabel = fallback.selectedSwatchLabel?.trim();
  const matchingGallery = selectedSwatchLabel
    ? normalized.filter((image) => image.swatchLabel === selectedSwatchLabel)
    : [];
  const genericGallery = normalized.filter((image) => !image.swatchLabel);

  if (matchingGallery.length || genericGallery.length) {
    return dedupeGalleryImages([...matchingGallery, ...genericGallery]);
  }

  const fallbackImages: ProductGalleryImage[] = [];

  if (fallback.selectedSwatchImage?.src) {
    fallbackImages.push({
      label: selectedSwatchLabel ? `${selectedSwatchLabel} view` : "Front view",
      src: fallback.selectedSwatchImage.src,
      alt: selectedSwatchLabel
        ? `${fallback.productTitle} in ${selectedSwatchLabel}`
        : `${fallback.productTitle} front view`,
      position: fallback.selectedSwatchImage.position,
      swatchLabel: selectedSwatchLabel,
    });
  } else if (fallback.defaultImage?.src) {
    fallbackImages.push({
      label: "Front view",
      src: fallback.defaultImage.src,
      alt: fallback.defaultImage.alt,
      position: fallback.defaultImage.position,
    });
  }

  if (fallback.styledImage?.src) {
    fallbackImages.push({
      label: "Styled look",
      src: fallback.styledImage.src,
      alt: fallback.styledImage.alt,
      position: fallback.styledImage.position,
    });
  }

  if (fallback.detailImage?.src) {
    fallbackImages.push({
      label: "Fabric detail",
      src: fallback.detailImage.src,
      alt: fallback.detailImage.alt,
      position: fallback.detailImage.position,
    });
  }

  return dedupeGalleryImages(fallbackImages);
}
