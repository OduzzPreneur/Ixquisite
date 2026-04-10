import type { ProductSwatch } from "@/data/site";

type SwatchImageCandidate = {
  src: string;
  position?: string;
} | null | undefined;

const colorKeywords = [
  { match: "black", value: "#232323" },
  { match: "charcoal", value: "#3f434b" },
  { match: "graphite", value: "#5a616a" },
  { match: "grey", value: "#8a8f98" },
  { match: "gray", value: "#8a8f98" },
  { match: "midnight", value: "#244669" },
  { match: "navy", value: "#245179" },
  { match: "blue", value: "#35648d" },
  { match: "cocoa", value: "#8b5b43" },
  { match: "brown", value: "#8b5b43" },
  { match: "walnut", value: "#91684a" },
  { match: "espresso", value: "#5b3a2e" },
  { match: "wine", value: "#7b3348" },
  { match: "oxblood", value: "#6d2030" },
  { match: "burgundy", value: "#7b2438" },
  { match: "forest", value: "#5a7746" },
  { match: "olive", value: "#8ca15d" },
  { match: "green", value: "#6d9254" },
  { match: "ivory", value: "#ebe1cf" },
  { match: "white", value: "#f5f3ed" },
  { match: "gold", value: "#ba9a55" },
  { match: "stone", value: "#b8ab9a" },
  { match: "tan", value: "#b58b67" },
  { match: "beige", value: "#ccb69c" },
  { match: "slate", value: "#5f7282" },
  { match: "ink", value: "#2b3442" },
] as const;

function normalizeColorLabel(value: string) {
  return value.trim().toLowerCase();
}

export function resolveSwatchValue(label: string) {
  const normalized = normalizeColorLabel(label);
  const matched = colorKeywords.find((entry) => normalized.includes(entry.match));
  return matched?.value ?? "#8c7967";
}

export function getSwatchBackground(labelOrValue: string) {
  if (labelOrValue.includes("gradient(") || labelOrValue.startsWith("#") || labelOrValue.startsWith("rgb") || labelOrValue.startsWith("hsl")) {
    return labelOrValue;
  }

  const normalized = normalizeColorLabel(labelOrValue);
  const parts = normalized
    .split(/\s*(?:&|and|\/|,)\s*/g)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    const stops = parts.map((part, index) => {
      const value = resolveSwatchValue(part);
      const start = Math.round((index / parts.length) * 100);
      const end = Math.round(((index + 1) / parts.length) * 100);
      return `${value} ${start}% ${end}%`;
    });

    return `linear-gradient(135deg, ${stops.join(", ")})`;
  }

  return resolveSwatchValue(labelOrValue);
}

export function buildFallbackSwatch(label: string): ProductSwatch {
  return {
    label,
    value: getSwatchBackground(label),
  };
}

export function ensureProductSwatches(swatches: ProductSwatch[] | null | undefined, colors: string[] | null | undefined) {
  if (swatches?.length) {
    return swatches.map((swatch) => ({
      label: swatch.label,
      value: getSwatchBackground(swatch.value || swatch.label),
      imageSrc: swatch.imageSrc || undefined,
      imagePosition: swatch.imagePosition || undefined,
    }));
  }

  return (colors ?? []).map(buildFallbackSwatch);
}

export function applySwatchImageFallbacks(swatches: ProductSwatch[], images: SwatchImageCandidate[]) {
  const fallbackImages = images.filter((image): image is NonNullable<SwatchImageCandidate> => Boolean(image?.src));

  if (!swatches.length || !fallbackImages.length) {
    return swatches;
  }

  return swatches.map((swatch, index) => {
    if (swatch.imageSrc) {
      return swatch;
    }

    const fallbackImage = fallbackImages[index % fallbackImages.length];

    return {
      ...swatch,
      imageSrc: fallbackImage.src,
      imagePosition: swatch.imagePosition ?? fallbackImage.position,
    };
  });
}

export function isLightSwatch(valueOrLabel: string) {
  const normalized = normalizeColorLabel(valueOrLabel);
  if (normalized.startsWith("#")) {
    return normalized === "#ebe1cf" || normalized === "#f5f3ed" || normalized === "#b8ab9a" || normalized === "#ccb69c";
  }

  return normalized.includes("ivory") || normalized.includes("white") || normalized.includes("stone") || normalized.includes("beige");
}

export function serializeSwatches(swatches: ProductSwatch[] | undefined) {
  return swatches
    ?.map((swatch) => [swatch.label, swatch.value, swatch.imageSrc ?? "", swatch.imagePosition ?? ""].join(" | "))
    .join("\n") ?? "";
}

export function parseSerializedSwatches(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, rawValue, imageSrc, imagePosition] = line.split("|").map((part) => part.trim());

      if (!label) {
        throw new Error(`Swatch row ${index + 1} is missing a label.`);
      }

      return {
        label,
        value: getSwatchBackground(rawValue || label),
        imageSrc: imageSrc || undefined,
        imagePosition: imagePosition || undefined,
      } satisfies ProductSwatch;
    });
}
