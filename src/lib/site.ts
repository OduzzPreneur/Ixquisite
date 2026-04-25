export const defaultKeywords = [
  "Ixquisite",
  "Ixquisite menswear",
  "premium men's suits",
  "men's corporate wear",
  "premium menswear Nigeria",
  "men's suits in Nigeria",
  "men's suits in Lagos",
  "men's formal wear",
  "executive menswear",
  "groom suits",
  "groom package",
  "wedding suits for men",
  "men's shirts and ties",
  "quiet luxury menswear",
  "business suits for men",
  "premium men's fashion",
];

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "https://ixquisite.vercel.app";
}

export const siteConfig = {
  name: "Ixquisite",
  url: resolveSiteUrl(),
  description:
    "Premium men's suits, shirts, trousers, ties, accessories, and groom packages designed for refined corporate style, ceremony, and quiet luxury.",
  defaultTitle: "Ixquisite | Premium Men's Suits, Shirts & Corporate Wear",
  titleTemplate: "%s | Ixquisite",
  locale: "en_NG",
  ogImage: {
    src: "/images/ixquisite/burgundy-ceremony-jacket-portrait-02.webp",
    alt: "Model in a burgundy ceremony jacket from Ixquisite.",
  },
  logo: "/images/ixquisite/brand-landscape.jpg",
  keywords: defaultKeywords,
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function pathWithLeadingSlash(path = "/") {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}
