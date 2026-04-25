export type Tone = "navy" | "espresso" | "stone" | "slate" | "ink" | "gold";

export type ProductImage = {
  src: string;
  alt: string;
  position?: string;
};

export type ProductSwatch = {
  label: string;
  value: string;
  imageSrc?: string;
  imagePosition?: string;
};

export type ProductGalleryImage = {
  label: string;
  src: string;
  alt: string;
  position?: string;
  swatchLabel?: string;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  caption: string;
  tone: Tone;
  sortOrder?: number;
  image?: ProductImage;
};

export type Occasion = {
  slug: string;
  title: string;
  description: string;
  tone: Tone;
  sortOrder?: number;
  image?: ProductImage;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  tone: Tone;
  cta: string;
  sortOrder?: number;
  image?: ProductImage;
};

export type Product = {
  slug: string;
  title: string;
  category: string;
  price: number;
  tone: Tone;
  blurb: string;
  description: string;
  delivery: string;
  fit: string;
  colors: string[];
  swatches: ProductSwatch[];
  sizes: string[];
  availability: string;
  details: string[];
  cardFeatures: string[];
  ratingValue: number;
  reviewCount: number;
  collection: string;
  isNew: boolean;
  isBestSeller: boolean;
  featuredRank?: number;
  isPlaceholder?: boolean;
  occasions: string[];
  completeTheLook: string[];
  image?: ProductImage;
  galleryImages?: ProductGalleryImage[];
};

function fallbackSwatchValue(label: string) {
  const normalized = label.trim().toLowerCase();

  if (normalized.includes("black")) return "#232323";
  if (normalized.includes("charcoal")) return "#3f434b";
  if (normalized.includes("graphite")) return "#5a616a";
  if (normalized.includes("grey") || normalized.includes("gray")) return "#8a8f98";
  if (normalized.includes("midnight")) return "#244669";
  if (normalized.includes("navy")) return "#245179";
  if (normalized.includes("blue")) return "#35648d";
  if (normalized.includes("cocoa") || normalized.includes("brown")) return "#8b5b43";
  if (normalized.includes("walnut")) return "#91684a";
  if (normalized.includes("espresso")) return "#5b3a2e";
  if (normalized.includes("wine")) return "#7b3348";
  if (normalized.includes("oxblood")) return "#6d2030";
  if (normalized.includes("burgundy")) return "#7b2438";
  if (normalized.includes("forest")) return "#5a7746";
  if (normalized.includes("olive")) return "#8ca15d";
  if (normalized.includes("green")) return "#6d9254";
  if (normalized.includes("ivory")) return "#ebe1cf";
  if (normalized.includes("white")) return "#f5f3ed";
  if (normalized.includes("gold")) return "#ba9a55";
  if (normalized.includes("stone")) return "#b8ab9a";
  if (normalized.includes("tan")) return "#b58b67";
  if (normalized.includes("beige")) return "#ccb69c";
  if (normalized.includes("slate")) return "#5f7282";
  if (normalized.includes("ink")) return "#2b3442";

  return "#8c7967";
}

function createSwatches(colors: string[]): ProductSwatch[] {
  return colors.map((color) => ({
    label: color,
    value: fallbackSwatchValue(color),
  }));
}

export type Article = {
  slug: string;
  title: string;
  description: string;
  tone: Tone;
  readingTime: string;
  category: string;
  body?: string;
};

export type GroomPackageTier = {
  slug: "basic" | "standard" | "premium";
  title: string;
  priceLabel: string;
  description: string;
  included: string[];
  benefits: string[];
  defaultSuit: string;
  defaultShirt: string;
  defaultTie: string;
  includesAccessory: boolean;
  recommended?: boolean;
};

export type HomePageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroCopy: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  heroVisualTitle: string;
  heroVisualSrc: string;
  heroVisualAlt: string;
  heroVisualPosition: string;
  heroMeta: string[];
  heroNoteTitle: string;
  heroNoteCopy: string;
  groomFeatureEyebrow: string;
  groomFeatureTitle: string;
  groomFeatureCopy: string;
  groomFeaturePrimaryLabel: string;
  groomFeaturePrimaryHref: string;
  groomFeatureSecondaryLabel: string;
  groomFeatureSecondaryHref: string;
  groomFeaturePills: string[];
  groomFeatureImageTitle: string;
  groomFeatureImageSrc: string;
  groomFeatureImageAlt: string;
  groomFeatureImagePosition: string;
  featuredCollectionSlug: string;
  completeLookSlug: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaCopy: string;
  finalCtaPrimaryLabel: string;
  finalCtaPrimaryHref: string;
  finalCtaSecondaryLabel: string;
  finalCtaSecondaryHref: string;
};

export const announcements = [
  "Delivery in a few days",
  "Fit guidance built in",
  "Premium corporate wear without the search",
] as const;

export const defaultHomePageSettings: HomePageSettings = {
  heroEyebrow: "Quiet luxury for professionals",
  heroTitle: "",
  heroCopy: "",
  heroPrimaryLabel: "Shop Suits",
  heroPrimaryHref: "/category/suits",
  heroSecondaryLabel: "Explore Collection",
  heroSecondaryHref: "/collection/boardroom-edit",
  heroVisualTitle: "Oxblood Dinner Jacket",
  heroVisualSrc: "/images/ixquisite/burgundy-ceremony-jacket-portrait-02.webp",
  heroVisualAlt: "Model in a burgundy ceremony jacket with black lapels and a groom-ready finish.",
  heroVisualPosition: "center 12%",
  heroMeta: ["Premium corporate wear", "Delivered in a few days", "Fit guidance available"],
  heroNoteTitle: "",
  heroNoteCopy: "",
  groomFeatureEyebrow: "Groom's Full Package",
  groomFeatureTitle: "Wedding dressing, handled as one premium decision.",
  groomFeatureCopy:
    "A ceremony-first bundle for grooms who want the suit, shirt, tie, and finishing details coordinated without restarting the search from scratch.",
  groomFeaturePrimaryLabel: "Explore groom package",
  groomFeaturePrimaryHref: "/groom-package",
  groomFeatureSecondaryLabel: "Wedding inquiry",
  groomFeatureSecondaryHref: "/wedding-inquiry",
  groomFeaturePills: ["Basic, Standard, Premium", "Direct buy + inquiry support", "Groomsmen coordination"],
  groomFeatureImageTitle: "Groomsmen Coordination",
  groomFeatureImageSrc: "/images/ixquisite/groomsmen-suit-group.webp",
  groomFeatureImageAlt: "Coordinated groom and groomsmen tailoring in a ceremony lineup.",
  groomFeatureImagePosition: "center 24%",
  featuredCollectionSlug: "boardroom-edit",
  completeLookSlug: "look-1",
  finalCtaEyebrow: "Final call",
  finalCtaTitle: "Shop the latest collection or join the private arrivals list.",
  finalCtaCopy: "New tailoring drops, ceremony edits, and quiet essentials for men who prefer less noise.",
  finalCtaPrimaryLabel: "View collections",
  finalCtaPrimaryHref: "/collections",
  finalCtaSecondaryLabel: "Join VIP",
  finalCtaSecondaryHref: "/create-account",
};

export const navItems = [
  { href: "/new-in", label: "New In" },
  { href: "/category/suits", label: "Suits" },
  { href: "/category/shirts", label: "Shirts" },
  { href: "/category/trousers", label: "Trousers" },
  { href: "/category/ties", label: "Ties" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/collections", label: "Collections" },
  { href: "/occasions", label: "Occasions" },
  { href: "/style-guide", label: "Style Guide" },
  { href: "/track-order", label: "Track Order" },
];

export const footerGroups = [
  {
    title: "Shop",
    links: [
      { href: "/new-in", label: "New In" },
      { href: "/category/suits", label: "Suits" },
      { href: "/collections", label: "Collections" },
      { href: "/groom-package", label: "Groom's Package" },
      { href: "/lookbook", label: "Lookbook" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns & Exchanges" },
      { href: "/size-guide", label: "Size Guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Ixquisite" },
      { href: "/contact", label: "Contact" },
      { href: "/style-guide", label: "Style Guide" },
      { href: "/occasions", label: "Occasion Shop" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/faq", label: "FAQs" },
      { href: "/delivery-policy", label: "Delivery Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms & Conditions" },
      { href: "/track-order", label: "Order Tracking" },
    ],
  },
] as const;

export const categories: Category[] = [
  {
    slug: "suits",
    title: "Suits",
    description: "Sharp silhouettes for boardrooms, ceremonies, and polished evenings.",
    caption: "Signature tailoring",
    tone: "navy",
    image: {
      src: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp",
      alt: "Burgundy tuxedo with black lapels used as the suits category hero.",
      position: "center 14%",
    },
  },
  {
    slug: "shirts",
    title: "Shirts",
    description: "Crisp shirting designed to sit cleanly under jackets or stand alone.",
    caption: "Refined layers",
    tone: "stone",
  },
  {
    slug: "trousers",
    title: "Trousers",
    description: "Structured cuts with enough ease for long workdays and travel.",
    caption: "Everyday polish",
    tone: "ink",
  },
  {
    slug: "ties",
    title: "Ties",
    description: "Silk accents that finish the uniform without noise.",
    caption: "Quiet details",
    tone: "gold",
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Pocket squares, cufflinks, belts, and finishing touches.",
    caption: "Final layer",
    tone: "espresso",
  },
];

export const occasions: Occasion[] = [
  {
    slug: "office",
    title: "Office",
    description: "Measured tailoring for everyday authority and comfort.",
    tone: "navy",
  },
  {
    slug: "executive",
    title: "Executive",
    description: "Boardroom-ready edits with stronger structure and finer finishing.",
    tone: "ink",
  },
  {
    slug: "wedding-guest",
    title: "Wedding Guest",
    description: "Ceremony dressing with depth, warmth, and confident fit.",
    tone: "espresso",
  },
  {
    slug: "black-tie",
    title: "Black Tie",
    description: "Evening pieces that stay formal without feeling generic.",
    tone: "slate",
  },
  {
    slug: "business-travel",
    title: "Business Travel",
    description: "Low-maintenance essentials that still look executive on arrival.",
    tone: "stone",
  },
];

export const collections: Collection[] = [
  {
    slug: "boardroom-edit",
    title: "Boardroom Edit",
    description: "A compact wardrobe of high-authority tailoring for meetings, pitches, and travel-heavy weeks.",
    tone: "navy",
    cta: "Explore the boardroom edit",
  },
  {
    slug: "executive-essentials",
    title: "Executive Essentials",
    description: "White shirting, dependable suiting, and quiet accessories that remove guesswork from weekday dressing.",
    tone: "stone",
    cta: "Shop the essentials",
  },
  {
    slug: "signature-neutrals",
    title: "Signature Neutrals",
    description: "Espresso, slate, and warm ivory tones for clients who prefer softer luxury over hard contrast.",
    tone: "espresso",
    cta: "View the neutrals",
  },
];

const ceremonyTuxedoSwatches: ProductSwatch[] = [
  {
    label: "Burgundy",
    value: "#7b2438",
    imageSrc: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp",
    imagePosition: "center 14%",
  },
  {
    label: "Midnight Navy",
    value: "#245179",
    imageSrc: "/images/ixquisite/tuxedo/ceremony-tuxedo-navy-front.webp",
    imagePosition: "center 14%",
  },
  {
    label: "Charcoal Grey",
    value: "#5a616a",
    imageSrc: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp",
    imagePosition: "center 14%",
  },
];

const reserveTuxedoSwatches: ProductSwatch[] = [
  {
    label: "Charcoal Grey",
    value: "#5a616a",
    imageSrc: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp",
    imagePosition: "center 14%",
  },
];

const ceremonyTuxedoGalleryImages: ProductGalleryImage[] = [
  {
    label: "Front view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp",
    alt: "Burgundy tuxedo front view with black lapels and evening waistcoat.",
    position: "center 14%",
    swatchLabel: "Burgundy",
  },
  {
    label: "Profile view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-profile.webp",
    alt: "Burgundy tuxedo portrait with a clean side stance.",
    position: "center 14%",
    swatchLabel: "Burgundy",
  },
  {
    label: "Detail view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-detail.webp",
    alt: "Burgundy tuxedo detail with lapel, boutonniere, and chain accent.",
    position: "center 16%",
    swatchLabel: "Burgundy",
  },
  {
    label: "Full look",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-full.webp",
    alt: "Full-length burgundy tuxedo styling for ceremony dressing.",
    position: "center 14%",
    swatchLabel: "Burgundy",
  },
  {
    label: "Front view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-navy-front.webp",
    alt: "Midnight navy tuxedo front view with a formal black bow tie.",
    position: "center 14%",
    swatchLabel: "Midnight Navy",
  },
  {
    label: "Adjusting jacket",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-navy-adjusting.webp",
    alt: "Midnight navy tuxedo while adjusting the jacket front.",
    position: "center 14%",
    swatchLabel: "Midnight Navy",
  },
  {
    label: "Detail view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-navy-detail.webp",
    alt: "Midnight navy tuxedo detail showing lapels and formal finishing.",
    position: "center 16%",
    swatchLabel: "Midnight Navy",
  },
  {
    label: "Portrait view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-navy-portrait.webp",
    alt: "Midnight navy tuxedo portrait in a refined ceremony pose.",
    position: "center 14%",
    swatchLabel: "Midnight Navy",
  },
  {
    label: "Front view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp",
    alt: "Charcoal grey tuxedo front view with black evening lapels.",
    position: "center 14%",
    swatchLabel: "Charcoal Grey",
  },
  {
    label: "Detail view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-detail.webp",
    alt: "Charcoal grey tuxedo detail with boutonniere and jacket finish.",
    position: "center 16%",
    swatchLabel: "Charcoal Grey",
  },
  {
    label: "Portrait view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-portrait.webp",
    alt: "Charcoal grey tuxedo portrait with a sharper black-tie stance.",
    position: "center 14%",
    swatchLabel: "Charcoal Grey",
  },
  {
    label: "Full look",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-stance.webp",
    alt: "Charcoal grey tuxedo styled for a formal evening entrance.",
    position: "center 14%",
    swatchLabel: "Charcoal Grey",
  },
];

const reserveTuxedoGalleryImages: ProductGalleryImage[] = [
  {
    label: "Front view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp",
    alt: "Charcoal grey tuxedo front view with black evening lapels.",
    position: "center 14%",
    swatchLabel: "Charcoal Grey",
  },
  {
    label: "Detail view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-detail.webp",
    alt: "Charcoal grey tuxedo detail with boutonniere and jacket finish.",
    position: "center 16%",
    swatchLabel: "Charcoal Grey",
  },
  {
    label: "Portrait view",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-portrait.webp",
    alt: "Charcoal grey tuxedo portrait with a sharper black-tie stance.",
    position: "center 14%",
    swatchLabel: "Charcoal Grey",
  },
  {
    label: "Full look",
    src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-stance.webp",
    alt: "Charcoal grey tuxedo styled for a formal evening entrance.",
    position: "center 14%",
    swatchLabel: "Charcoal Grey",
  },
];

export const products: Product[] = [
  {
    slug: "signature-ceremony-tuxedo",
    title: "Signature Ceremony Tuxedo",
    category: "suits",
    price: 268000,
    tone: "espresso",
    blurb: "A ceremony-first tuxedo offered in burgundy, midnight navy, and charcoal grey with a sharper evening finish.",
    description: "Built for black-tie rooms, wedding entrances, and reception dressing with black lapels, structured tailoring, and a controlled formal line.",
    delivery: "Delivered in 2-4 days",
    fit: "Structured evening fit",
    colors: ceremonyTuxedoSwatches.map((swatch) => swatch.label),
    swatches: ceremonyTuxedoSwatches,
    sizes: ["48", "50", "52", "54", "56"],
    availability: "In stock",
    details: ["Contrast satin lapel", "Eveningwear structure", "Formal waistcoat styling", "Dry clean only"],
    cardFeatures: ["Contrast lapel", "Structured evening fit"],
    ratingValue: 4.9,
    reviewCount: 17,
    collection: "signature-neutrals",
    isNew: true,
    isBestSeller: false,
    occasions: ["black-tie", "wedding-guest"],
    completeTheLook: ["ivory-broadcloth-shirt", "heirloom-accessory-set"],
    image: {
      src: "/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp",
      alt: "Signature Ceremony Tuxedo in burgundy with black lapels and formal finishing.",
      position: "center 14%",
    },
    galleryImages: ceremonyTuxedoGalleryImages,
  },
  {
    slug: "black-tie-reserve-tuxedo",
    title: "Black-Tie Reserve Tuxedo",
    category: "suits",
    price: 259000,
    tone: "slate",
    blurb: "A darker charcoal tuxedo built for formal rooms, evening ceremonies, and quieter black-tie dressing.",
    description: "Cut with a controlled formal silhouette, black satin lapels, and a cleaner grey base for clients who want black-tie authority without a louder colour statement.",
    delivery: "Delivered in 2-4 days",
    fit: "Structured evening fit",
    colors: reserveTuxedoSwatches.map((swatch) => swatch.label),
    swatches: reserveTuxedoSwatches,
    sizes: ["48", "50", "52", "54", "56"],
    availability: "In stock",
    details: ["Contrast satin lapel", "Formal evening structure", "Black-tie trouser finish", "Dry clean only"],
    cardFeatures: ["Black-tie authority", "Structured evening fit"],
    ratingValue: 4.8,
    reviewCount: 11,
    collection: "signature-neutrals",
    isNew: true,
    isBestSeller: false,
    occasions: ["black-tie", "wedding-guest"],
    completeTheLook: ["ivory-broadcloth-shirt", "heirloom-accessory-set"],
    image: {
      src: "/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp",
      alt: "Black-Tie Reserve Tuxedo in charcoal grey with black evening lapels.",
      position: "center 14%",
    },
    galleryImages: reserveTuxedoGalleryImages,
  },
  {
    slug: "midnight-commander-suit",
    title: "Midnight Commander Suit",
    category: "suits",
    price: 189500,
    tone: "navy",
    blurb: "A deep navy two-piece designed to hold structure from morning briefings to evening dinners.",
    description: "Half-canvas tailoring, a clean shoulder, and subtle sheen make this the dependable hero of the wardrobe.",
    delivery: "Delivered in 2-4 days",
    fit: "Structured slim fit",
    colors: ["Midnight Navy", "Graphite"],
    swatches: createSwatches(["Midnight Navy", "Graphite"]),
    sizes: ["48", "50", "52", "54", "56"],
    availability: "In stock",
    details: ["Wool blend", "Half-canvas front", "Double vent", "Dry clean only"],
    cardFeatures: ["Structured slim fit", "Half-canvas front"],
    ratingValue: 4.9,
    reviewCount: 48,
    collection: "boardroom-edit",
    isNew: true,
    isBestSeller: true,
    occasions: ["office", "executive", "business-travel"],
    completeTheLook: ["ivory-broadcloth-shirt", "regent-silk-tie", "heirloom-accessory-set"],
  },
  {
    slug: "cocoa-double-breasted-suit",
    title: "Cocoa Double-Breasted Suit",
    category: "suits",
    price: 214000,
    tone: "espresso",
    blurb: "Rich brown tailoring with ceremonial energy and a strong waistline.",
    description: "Designed for weddings, celebrations, and standout entrances without losing elegance.",
    delivery: "Delivered in 2-4 days",
    fit: "Tailored modern fit",
    colors: ["Cocoa Brown"],
    swatches: createSwatches(["Cocoa Brown"]),
    sizes: ["48", "50", "52", "54"],
    availability: "Low stock",
    details: ["Signature brown tone", "Peak lapel", "Fully lined", "Dry clean only"],
    cardFeatures: ["Tailored modern fit", "Fully lined"],
    ratingValue: 4.8,
    reviewCount: 31,
    collection: "signature-neutrals",
    isNew: true,
    isBestSeller: true,
    occasions: ["wedding-guest", "black-tie"],
    completeTheLook: ["ivory-broadcloth-shirt", "regent-silk-tie", "heirloom-accessory-set"],
  },
  {
    slug: "ivory-broadcloth-shirt",
    title: "Ivory Broadcloth Shirt",
    category: "shirts",
    price: 36500,
    tone: "stone",
    blurb: "A clean formal shirt with enough weight to stay sharp under tailored jackets.",
    description: "Cut for polished layering, this shirt keeps its structure through full workdays.",
    delivery: "Delivered in 2-4 days",
    fit: "Contemporary slim fit",
    colors: ["Ivory", "White"],
    swatches: createSwatches(["Ivory", "White"]),
    sizes: ["15", "15.5", "16", "16.5", "17"],
    availability: "In stock",
    details: ["Broadcloth cotton", "Semi-spread collar", "Double-button cuff", "Machine wash gentle"],
    cardFeatures: ["Broadcloth cotton", "Semi-spread collar"],
    ratingValue: 4.7,
    reviewCount: 26,
    collection: "executive-essentials",
    isNew: true,
    isBestSeller: false,
    occasions: ["office", "executive", "wedding-guest"],
    completeTheLook: ["midnight-commander-suit", "regent-silk-tie"],
  },
  {
    slug: "slate-pinstripe-shirt",
    title: "Slate Pinstripe Shirt",
    category: "shirts",
    price: 39900,
    tone: "slate",
    blurb: "A subtle pinstripe shirt for professionals who want texture without flash.",
    description: "Designed for client meetings, travel, and layered office dressing.",
    delivery: "Delivered in 2-4 days",
    fit: "Regular tailored fit",
    colors: ["Slate Stripe"],
    swatches: createSwatches(["Slate Stripe"]),
    sizes: ["15", "15.5", "16", "16.5"],
    availability: "In stock",
    details: ["Cotton stretch blend", "Structured collar", "French placket", "Machine wash gentle"],
    cardFeatures: ["Regular tailored fit", "Cotton stretch blend"],
    ratingValue: 4.6,
    reviewCount: 18,
    collection: "boardroom-edit",
    isNew: false,
    isBestSeller: false,
    occasions: ["office", "business-travel"],
    completeTheLook: ["midnight-commander-suit", "regent-silk-tie"],
  },
  {
    slug: "tailored-ink-trouser",
    title: "Tailored Ink Trouser",
    category: "trousers",
    price: 48200,
    tone: "ink",
    blurb: "Cleanly tapered trousers that balance comfort and sharp lines through long schedules.",
    description: "Built to pair seamlessly with navy and charcoal suiting or polished shirting.",
    delivery: "Delivered in 2-4 days",
    fit: "Tapered fit",
    colors: ["Ink", "Charcoal"],
    swatches: createSwatches(["Ink", "Charcoal"]),
    sizes: ["32", "34", "36", "38", "40"],
    availability: "In stock",
    details: ["Wool touch fabric", "Side adjusters", "Pressed crease", "Dry clean only"],
    cardFeatures: ["Tapered fit", "Side adjusters"],
    ratingValue: 4.7,
    reviewCount: 22,
    collection: "executive-essentials",
    isNew: false,
    isBestSeller: false,
    occasions: ["office", "business-travel"],
    completeTheLook: ["ivory-broadcloth-shirt", "heirloom-accessory-set"],
  },
  {
    slug: "walnut-pleated-trouser",
    title: "Walnut Pleated Trouser",
    category: "trousers",
    price: 51500,
    tone: "espresso",
    blurb: "A softer formal trouser with extra ease for warmer days and dressy weekends.",
    description: "Pleated front styling brings depth while keeping the line refined.",
    delivery: "Delivered in 2-4 days",
    fit: "Relaxed tailored fit",
    colors: ["Walnut"],
    swatches: createSwatches(["Walnut"]),
    sizes: ["32", "34", "36", "38"],
    availability: "In stock",
    details: ["Pleated front", "Extended waistband", "Side pockets", "Dry clean only"],
    cardFeatures: ["Pleated front", "Relaxed tailored fit"],
    ratingValue: 4.6,
    reviewCount: 16,
    collection: "signature-neutrals",
    isNew: false,
    isBestSeller: false,
    occasions: ["wedding-guest", "business-travel"],
    completeTheLook: ["ivory-broadcloth-shirt", "regent-silk-tie"],
  },
  {
    slug: "regent-silk-tie",
    title: "Regent Silk Tie",
    category: "ties",
    price: 18500,
    tone: "navy",
    blurb: "A silk tie with restrained luster and the weight to knot cleanly every time.",
    description: "Designed to pair with both formal suiting and lighter celebratory tailoring.",
    delivery: "Delivered in 2-4 days",
    fit: "Standard width",
    colors: ["Midnight", "Wine", "Black"],
    swatches: createSwatches(["Midnight", "Wine", "Black"]),
    sizes: ["One size"],
    availability: "In stock",
    details: ["Pure silk", "Self tipping", "7.5 cm blade", "Dry clean only"],
    cardFeatures: ["Pure silk", "Standard width"],
    ratingValue: 4.9,
    reviewCount: 64,
    collection: "boardroom-edit",
    isNew: false,
    isBestSeller: true,
    occasions: ["office", "executive", "wedding-guest", "black-tie"],
    completeTheLook: ["midnight-commander-suit", "ivory-broadcloth-shirt"],
  },
  {
    slug: "heirloom-accessory-set",
    title: "Heirloom Accessory Set",
    category: "accessories",
    price: 26500,
    tone: "gold",
    blurb: "A coordinated set of pocket square, cufflinks, and lapel pin for polished finishing.",
    description: "Built to add formality without overstatement, especially for suits in navy and cocoa tones.",
    delivery: "Delivered in 2-4 days",
    fit: "One set",
    colors: ["Ivory & Gold"],
    swatches: createSwatches(["Ivory & Gold"]),
    sizes: ["One size"],
    availability: "In stock",
    details: ["Pocket square", "Cufflinks", "Lapel pin", "Gift-ready case"],
    cardFeatures: ["Gift-ready case", "Formal finishing set"],
    ratingValue: 4.8,
    reviewCount: 19,
    collection: "signature-neutrals",
    isNew: false,
    isBestSeller: false,
    occasions: ["executive", "wedding-guest", "black-tie"],
    completeTheLook: ["cocoa-double-breasted-suit", "ivory-broadcloth-shirt"],
  },
];

export const newInPlaceholderProducts: Product[] = [
  {
    slug: "placeholder-charcoal-windowpane-suit",
    title: "Charcoal Windowpane Suit",
    category: "suits",
    price: 228000,
    tone: "slate",
    blurb: "A sharp charcoal double-breasted option held in the arrivals queue while the final product record is prepared.",
    description: "Windowpane structure, polished metal-button detailing, and a boardroom-weight fabric direction for a quiet statement.",
    delivery: "Arriving soon",
    fit: "Tailored modern fit",
    colors: ["Charcoal Windowpane"],
    swatches: createSwatches(["Charcoal Windowpane"]),
    sizes: ["48", "50", "52", "54"],
    availability: "Arriving soon",
    details: ["Double-breasted front", "Windowpane pattern", "Peak lapel", "Editorial placeholder"],
    cardFeatures: ["Windowpane pattern", "Tailored modern fit"],
    ratingValue: 4.7,
    reviewCount: 12,
    collection: "boardroom-edit",
    isNew: true,
    isBestSeller: false,
    isPlaceholder: true,
    occasions: ["office", "executive"],
    completeTheLook: [],
  },
  {
    slug: "placeholder-midnight-velvet-smoking-jacket",
    title: "Midnight Velvet Smoking Jacket",
    category: "suits",
    price: 246000,
    tone: "navy",
    blurb: "A formal evening jacket placeholder added to keep the arrivals edit visually complete while the live SKU is prepared.",
    description: "Deep midnight velvet, satin lapels, and ceremony-first styling for after-dark events and black-tie moments.",
    delivery: "Arriving soon",
    fit: "Tailored evening fit",
    colors: ["Midnight Velvet"],
    swatches: createSwatches(["Midnight Velvet"]),
    sizes: ["48", "50", "52", "54"],
    availability: "Arriving soon",
    details: ["Velvet cloth", "Satin lapel", "Eveningwear finish", "Editorial placeholder"],
    cardFeatures: ["Velvet cloth", "Satin lapel"],
    ratingValue: 4.8,
    reviewCount: 9,
    collection: "signature-neutrals",
    isNew: true,
    isBestSeller: false,
    isPlaceholder: true,
    occasions: ["black-tie", "wedding-guest"],
    completeTheLook: [],
  },
  {
    slug: "placeholder-oxblood-dinner-jacket",
    title: "Oxblood Dinner Jacket",
    category: "suits",
    price: 239000,
    tone: "espresso",
    blurb: "A rich eveningwear placeholder used to round out the new arrivals story until the real product entry lands in Supabase.",
    description: "A controlled oxblood tone with formal black lapels and a clean dinner-jacket line for ceremony and reception dressing.",
    delivery: "Arriving soon",
    fit: "Structured evening fit",
    colors: ["Oxblood"],
    swatches: createSwatches(["Oxblood"]),
    sizes: ["48", "50", "52", "54"],
    availability: "Arriving soon",
    details: ["Dinner jacket silhouette", "Contrast lapel", "Formal eveningwear", "Editorial placeholder"],
    cardFeatures: ["Contrast lapel", "Structured evening fit"],
    ratingValue: 4.7,
    reviewCount: 11,
    collection: "signature-neutrals",
    isNew: true,
    isBestSeller: false,
    isPlaceholder: true,
    occasions: ["black-tie", "wedding-guest"],
    completeTheLook: [],
  },
  {
    slug: "placeholder-forest-pinstripe-double-breasted-suit",
    title: "Forest Pinstripe Double-Breasted Suit",
    category: "suits",
    price: 219500,
    tone: "ink",
    blurb: "A deep green tailoring placeholder reserved for future arrivals and already matched to the current image direction.",
    description: "Tonal pinstripes, warm brass buttons, and a strong formal silhouette designed for executive dressing with character.",
    delivery: "Arriving soon",
    fit: "Structured slim fit",
    colors: ["Forest Pinstripe"],
    swatches: createSwatches(["Forest Pinstripe"]),
    sizes: ["48", "50", "52", "54"],
    availability: "Arriving soon",
    details: ["Double-breasted front", "Pinstripe finish", "Brass buttons", "Editorial placeholder"],
    cardFeatures: ["Pinstripe finish", "Structured slim fit"],
    ratingValue: 4.8,
    reviewCount: 14,
    collection: "boardroom-edit",
    isNew: true,
    isBestSeller: false,
    isPlaceholder: true,
    occasions: ["executive", "office"],
    completeTheLook: [],
  },
];

export const articles: Article[] = [
  {
    slug: "how-to-style-a-brown-suit",
    title: "How to Style a Brown Suit Without Losing Formality",
    description: "A sharper approach to brown tailoring for weddings, dinners, and executive events.",
    tone: "espresso",
    readingTime: "5 min read",
    category: "Styling",
  },
  {
    slug: "shirt-and-tie-combinations",
    title: "Shirt and Tie Combinations That Always Look Expensive",
    description: "Three dependable pairings that remove the usual guesswork from weekday dressing.",
    tone: "navy",
    readingTime: "4 min read",
    category: "Guides",
  },
  {
    slug: "professional-wardrobe-essentials",
    title: "The Professional Wardrobe Essentials Worth Buying First",
    description: "A compact formula for building a polished corporate wardrobe without overbuying.",
    tone: "stone",
    readingTime: "6 min read",
    category: "Wardrobe Planning",
  },
];

export const lookbookLooks = [
  {
    title: "Boardroom Quiet Luxury",
    description: "Midnight tailoring, ivory shirting, and one gold accent.",
    tone: "navy" as Tone,
    products: ["midnight-commander-suit", "ivory-broadcloth-shirt", "regent-silk-tie"],
  },
  {
    title: "Ceremony in Cocoa",
    description: "Double-breasted suiting styled for warm-weather celebrations.",
    tone: "espresso" as Tone,
    products: ["cocoa-double-breasted-suit", "ivory-broadcloth-shirt", "heirloom-accessory-set"],
  },
  {
    title: "Travel Day Precision",
    description: "Layered neutrals designed to stay sharp from airport to meeting.",
    tone: "slate" as Tone,
    products: ["slate-pinstripe-shirt", "tailored-ink-trouser", "regent-silk-tie"],
  },
];

export const trustPoints = [
  {
    title: "Premium fabrics",
    copy: "Focused fabric selections that hold shape and wear cleanly through repeat use.",
  },
  {
    title: "Polished fit",
    copy: "Size guidance and product-level fit notes remove uncertainty before checkout.",
  },
  {
    title: "Easy ordering",
    copy: "Curated collections, occasion filters, and outfit pairing help reduce search fatigue.",
  },
  {
    title: "Delivery in a few days",
    copy: "Fast dispatch windows supported by visible order tracking and support routes.",
  },
];

export const helpTopics = [
  {
    title: "Ordering and payment",
    copy: "Checkout steps, secure payment, and support for order changes before dispatch.",
    href: "/help",
  },
  {
    title: "Shipping and delivery",
    copy: "Processing times, delivery regions, dispatch windows, and express options.",
    href: "/shipping",
  },
  {
    title: "Returns and exchanges",
    copy: "Eligibility rules, exchange requests, and timeline expectations.",
    href: "/returns",
  },
  {
    title: "Fit and size guidance",
    copy: "Measurement prompts, fit notes, and category-level size charts.",
    href: "/size-guide",
  },
];

export const searchSuggestions = [
  "Brown double-breasted suit",
  "White formal shirt",
  "Executive accessories",
  "Wedding guest suit",
  "Groom package",
];

export const faqItems = [
  {
    question: "How quickly are orders delivered?",
    answer: "Most ready-to-wear orders are dispatched within 24 hours and arrive in 2 to 4 days depending on destination.",
  },
  {
    question: "Can I get help selecting the right size?",
    answer: "Yes. Every product page includes fit notes and our size guide, and support can help with measurements before checkout.",
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Eligible unworn items can be returned or exchanged within the published returns window, subject to category rules.",
  },
  {
    question: "Do you support wedding and team orders?",
    answer: "Yes. Corporate outfitting and wedding party requests can be submitted through the contact and bulk-order pathways.",
  },
];

export const groomPackageFaqs = [
  {
    question: "What is included in an Ixquisite groom package?",
    answer:
      "Ixquisite groom packages can include suits, shirts, ties, accessories, styling coordination, and groomsmen support depending on the selected package.",
  },
  {
    question: "Can Ixquisite coordinate outfits for groomsmen?",
    answer:
      "Yes. Ixquisite can help coordinate groomsmen looks so the wedding party appears polished, consistent, and ceremony-ready.",
  },
  {
    question: "Can I choose suit colours for my wedding?",
    answer:
      "Yes. Available colours depend on current product availability and the package or product option selected.",
  },
  {
    question: "Do groom packages include accessories?",
    answer:
      "Some packages include accessories, while others allow accessories to be added based on the groom's preferred look.",
  },
];

export const accountLinks = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/payment-methods", label: "Payment methods" },
  { href: "/wishlist", label: "Wishlist" },
];

export const accountOrders = [
  {
    id: "IXQ-24018",
    status: "In transit",
    total: 244500,
    items: ["Midnight Commander Suit", "Regent Silk Tie"],
    eta: "Expected Apr 8",
  },
  {
    id: "IXQ-23972",
    status: "Delivered",
    total: 58000,
    items: ["Ivory Broadcloth Shirt", "Tailored Ink Trouser"],
    eta: "Delivered Mar 28",
  },
];

export const groomPackageIntro = {
  eyebrow: "Wedding hub",
  title: "Your Wedding Look. Perfectly Handled.",
  description:
    "Groom dressing should feel decisive, coordinated, and elevated. Ixquisite packages the suit, shirt, tie, and finishing details into one calm premium flow, with direct purchase for standard bundles and support for everything custom.",
};

export const groomPackageReasons = [
  {
    title: "No store-hopping",
    copy: "The full ceremony look is curated in one place so the groom does not need to piece the outfit together across multiple stores.",
  },
  {
    title: "Coordinated formalwear",
    copy: "Suit, shirt, tie, and finishing pieces are matched to read as one look rather than separate purchases.",
  },
  {
    title: "Groom-first support",
    copy: "Sizing help, wedding color guidance, and escalation into inquiry keep pressure low when timing matters most.",
  },
];

export const groomPackageTiers: GroomPackageTier[] = [
  {
    slug: "basic",
    title: "Basic Groom Package",
    priceLabel: "From NGN 244,500",
    description: "A clean entry into ceremony dressing built around the essential tailored uniform.",
    included: ["Suit", "Shirt", "Tie"],
    benefits: ["Ready-to-buy", "Measured formal styling", "Delivered in a few days"],
    defaultSuit: "midnight-commander-suit",
    defaultShirt: "ivory-broadcloth-shirt",
    defaultTie: "regent-silk-tie",
    includesAccessory: false,
  },
  {
    slug: "standard",
    title: "Standard Groom Package",
    priceLabel: "From NGN 271,000",
    description: "The default ceremony package with finishing accessories and built-in styling support.",
    included: ["Suit", "Shirt", "Tie", "Pocket square and finishing set"],
    benefits: ["Recommended package", "Styling support", "Balanced value and polish"],
    defaultSuit: "cocoa-double-breasted-suit",
    defaultShirt: "ivory-broadcloth-shirt",
    defaultTie: "regent-silk-tie",
    includesAccessory: true,
    recommended: true,
  },
  {
    slug: "premium",
    title: "Premium Groom Package",
    priceLabel: "From NGN 271,000 + premium support",
    description: "The full outfit with finishing pieces, priority handling, and stylist-led reassurance around the final look.",
    included: ["Suit", "Shirt", "Tie", "Accessory bundle", "Priority delivery", "Styling consultation"],
    benefits: ["High-touch support", "Priority handling", "Ceremony-ready finishing"],
    defaultSuit: "cocoa-double-breasted-suit",
    defaultShirt: "ivory-broadcloth-shirt",
    defaultTie: "regent-silk-tie",
    includesAccessory: true,
  },
];

export const groomPackageIncluded = [
  "Suit",
  "Shirt",
  "Tie or ceremony neckwear",
  "Pocket square and finishing accessory",
  "Fit support before checkout",
];

export const groomPackageAddOns = [
  "Accessory bundle",
  "Extra shirt",
  "Lapel pin",
  "Personalized packaging",
  "Priority delivery",
];

export const groomBuilderOptions = {
  suits: ["midnight-commander-suit", "cocoa-double-breasted-suit"],
  shirts: ["ivory-broadcloth-shirt"],
  ties: ["regent-silk-tie"],
  accessories: ["heirloom-accessory-set"],
} as const;

export const groomPackageBundleNotes = [
  "Standard and Premium include the accessory set by default because it carries the pocket square and finishing details together.",
  "Custom ceremony colours, multiple groomsmen, or non-standard sizing should go through the wedding inquiry flow.",
];

export const groomAccessoryBundle = {
  title: "Accessories Bundle",
  description:
    "Use one finishing bundle instead of sourcing ceremony details separately. The current edit stays focused on cufflinks, lapel finishing, and a coordinated pocket square.",
  items: ["Heirloom accessory set", "Belt support through inquiry", "Watch recommendation only as a premium add-on"],
};

export const groomSupportTopics = [
  "Unsure fit or size guidance",
  "Wedding theme and colour matching",
  "Consultation for premium package clients",
  "Urgent delivery or wedding-party coordination",
];

export const groomCoordinationPoints = [
  "Coordinated outfits for groom and groomsmen",
  "Bulk pricing for wedding parties",
  "Colour matching support for theme alignment",
  "Inquiry-led team dressing support",
];

export const weddingDeliveryPoints = [
  {
    title: "Delivery timeline clarity",
    copy: "Standard packages remain ready-to-buy and inherit the same few-days delivery promise where stock is available.",
  },
  {
    title: "What happens after order",
    copy: "Premium package clients receive confirmation, styling follow-up, and clearer support around the final ceremony look.",
  },
  {
    title: "Fit and exchange support",
    copy: "Sizing routes, product fit notes, and direct inquiry paths reduce ceremony-risk before purchase.",
  },
];

export const groomTrustStory = [
  {
    title: "Ceremony-ready, not costume-like",
    copy: "The groom hub keeps the same Ixquisite restraint so wedding dressing feels elevated rather than theatrical.",
  },
  {
    title: "Built from real catalog pieces",
    copy: "The packages are grounded in the same premium suiting, shirting, and accessories already trusted across the store.",
  },
  {
    title: "Hybrid purchase model",
    copy: "Direct-buy works for standard bundles, while custom coordination stays routed through inquiry where the team can actually support it well.",
  },
];

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCategory(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getOccasion(slug: string) {
  return occasions.find((item) => item.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((item) => item.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((item) => item.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((item) => item.category === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((item) => item.collection === slug);
}

export function getProductsByOccasion(slug: string) {
  return products.filter((item) => item.occasions.includes(slug));
}

export function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProduct(slug))
    .filter((item): item is Product => Boolean(item));
}
