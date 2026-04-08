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

function resolveSwatchValue(label: string) {
  const normalized = normalizeColorLabel(label);
  const matched = colorKeywords.find((entry) => normalized.includes(entry.match));
  return matched?.value ?? "#8c7967";
}

export function getSwatchBackground(label: string) {
  const normalized = normalizeColorLabel(label);
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

  return resolveSwatchValue(label);
}

export function isLightSwatch(label: string) {
  const normalized = normalizeColorLabel(label);
  return normalized.includes("ivory") || normalized.includes("white") || normalized.includes("stone") || normalized.includes("beige");
}
