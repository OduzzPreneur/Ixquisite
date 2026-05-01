import type { Product, ProductGalleryImage, ProductSwatch, ProductVariant, ProductVariantImages } from "@/data/site";

type ShirtFamilyConfig = {
  id: string;
  name: string;
  slug: string;
  category: string;
  collection: string;
  description: string;
  price: number;
  variants: Array<Omit<ProductVariant, "images">>;
};

function buildVariantImages(productSlug: string, variantSlug: string): ProductVariantImages {
  const base = `/products/shirts/${productSlug}/${variantSlug}`;
  return {
    main: `${base}/main.webp`,
    layered: `${base}/layered.webp`,
    detail: `${base}/detail.webp`,
    fit: `${base}/fit.webp`,
    completeLook: `${base}/complete-look.webp`,
  };
}

function buildProductVariant(config: ShirtFamilyConfig, variant: Omit<ProductVariant, "images">): ProductVariant {
  return {
    ...variant,
    images: buildVariantImages(config.slug, variant.slug),
  };
}

const SHIRT_FAMILY_CONFIGS: ShirtFamilyConfig[] = [
  {
    id: "shirt-ivory-broadcloth",
    name: "Ivory Broadcloth Shirt",
    slug: "ivory-broadcloth-shirt",
    category: "shirts",
    collection: "executive-essentials",
    description: "A refined broadcloth shirt designed for clean tailoring, formal styling, and premium everyday elegance.",
    price: 42500,
    variants: [
      {
        id: "ivory-broadcloth-ivory",
        colorName: "Ivory",
        slug: "ivory",
        swatchType: "color",
        swatchValue: "#F4EAD7",
        sku: "IXQ-SH-IBS-IVORY",
      },
      {
        id: "ivory-broadcloth-white",
        colorName: "White",
        slug: "white",
        swatchType: "color",
        swatchValue: "#F8F7F2",
        sku: "IXQ-SH-IBS-WHITE",
      },
      {
        id: "ivory-broadcloth-champagne",
        colorName: "Champagne",
        slug: "champagne",
        swatchType: "color",
        swatchValue: "#EAD8B8",
        sku: "IXQ-SH-IBS-CHAMPAGNE",
      },
    ],
  },
  {
    id: "shirt-executive-poplin",
    name: "Executive Poplin Shirt",
    slug: "executive-poplin-shirt",
    category: "shirts",
    collection: "executive-essentials",
    description: "Crisp poplin shirting built for boardroom clarity, elegant layering, and polished daily wear.",
    price: 38500,
    variants: [
      {
        id: "executive-poplin-white",
        colorName: "White",
        slug: "white",
        swatchType: "color",
        swatchValue: "#F8F7F2",
        sku: "IXQ-SH-EPS-WHITE",
      },
      {
        id: "executive-poplin-sky-blue",
        colorName: "Sky Blue",
        slug: "sky-blue",
        swatchType: "color",
        swatchValue: "#BFDDF8",
        sku: "IXQ-SH-EPS-SKY-BLUE",
      },
      {
        id: "executive-poplin-black",
        colorName: "Black",
        slug: "black",
        swatchType: "color",
        swatchValue: "#111111",
        sku: "IXQ-SH-EPS-BLACK",
      },
    ],
  },
  {
    id: "shirt-slate-pinstripe",
    name: "Slate Pinstripe Shirt",
    slug: "slate-pinstripe-shirt",
    category: "shirts",
    collection: "boardroom-edit",
    description: "A structured pinstripe shirt for understated authority, texture-rich layering, and premium formal rhythm.",
    price: 45500,
    variants: [
      {
        id: "slate-pinstripe-slate",
        colorName: "Slate",
        slug: "slate",
        swatchType: "image",
        swatchValue: "#5F6468",
        swatchImage: "/products/shirts/slate-pinstripe-shirt/slate/swatch.webp",
        sku: "IXQ-SH-SPS-SLATE",
      },
      {
        id: "slate-pinstripe-navy-stripe",
        colorName: "Navy Stripe",
        slug: "navy-stripe",
        swatchType: "image",
        swatchValue: "#16213B",
        swatchImage: "/products/shirts/slate-pinstripe-shirt/navy-stripe/swatch.webp",
        sku: "IXQ-SH-SPS-NAVY-STRIPE",
      },
      {
        id: "slate-pinstripe-charcoal-stripe",
        colorName: "Charcoal Stripe",
        slug: "charcoal-stripe",
        swatchType: "image",
        swatchValue: "#2F3033",
        swatchImage: "/products/shirts/slate-pinstripe-shirt/charcoal-stripe/swatch.webp",
        sku: "IXQ-SH-SPS-CHARCOAL-STRIPE",
      },
    ],
  },
  {
    id: "shirt-black-ceremony",
    name: "Black Ceremony Shirt",
    slug: "black-ceremony-shirt",
    category: "shirts",
    collection: "signature-neutrals",
    description: "A ceremony-grade dress shirt with a cleaner drape for formal nights and elevated menswear styling.",
    price: 48500,
    variants: [
      {
        id: "black-ceremony-black",
        colorName: "Black",
        slug: "black",
        swatchType: "color",
        swatchValue: "#111111",
        sku: "IXQ-SH-BCS-BLACK",
      },
      {
        id: "black-ceremony-wine",
        colorName: "Wine",
        slug: "wine",
        swatchType: "color",
        swatchValue: "#5A1620",
        sku: "IXQ-SH-BCS-WINE",
      },
      {
        id: "black-ceremony-deep-navy",
        colorName: "Deep Navy",
        slug: "deep-navy",
        swatchType: "color",
        swatchValue: "#101A33",
        sku: "IXQ-SH-BCS-DEEP-NAVY",
      },
    ],
  },
];

const SHIRT_VARIANTS_BY_SLUG = new Map(
  SHIRT_FAMILY_CONFIGS.map((config) => [
    config.slug,
    {
      ...config,
      variants: config.variants.map((variant) => buildProductVariant(config, variant)),
    },
  ]),
);

function buildVariantGalleryImages(productTitle: string, variant: ProductVariant): ProductGalleryImage[] {
  const color = variant.colorName;
  const images = variant.images;
  const ordered: Array<{ key: keyof ProductVariantImages; label: string; alt: string }> = [
    { key: "main", label: "main", alt: `${productTitle} in ${color} - main front view` },
    { key: "layered", label: "layered", alt: `${productTitle} in ${color} - layered suit styling` },
    { key: "detail", label: "detail", alt: `${productTitle} in ${color} - collar and cuff detail` },
    { key: "fit", label: "fit", alt: `${productTitle} in ${color} - side fit angle` },
    { key: "completeLook", label: "complete look", alt: `${productTitle} in ${color} - complete the look outfit` },
  ];

  return ordered.reduce<ProductGalleryImage[]>((acc, item) => {
    const src = images[item.key];
    if (!src) {
      return acc;
    }

    acc.push({
      label: item.label,
      src,
      alt: item.alt,
      swatchLabel: color,
    });

    return acc;
  }, []);
}

export function getShirtFamilyProduct(slug: string) {
  return SHIRT_VARIANTS_BY_SLUG.get(slug);
}

export function withShirtVariants(product: Product): Product {
  const shirt = getShirtFamilyProduct(product.slug);
  if (!shirt) {
    return product;
  }

  const firstVariant = shirt.variants[0];
  const swatches: ProductSwatch[] = shirt.variants.map((variant) => ({
    label: variant.colorName,
    value: variant.swatchValue,
    slug: variant.slug,
    variantId: variant.id,
    swatchType: variant.swatchType,
    swatchImage: variant.swatchImage,
    imageSrc: variant.images.main,
  }));

  const variantGallery = shirt.variants.flatMap((variant) => buildVariantGalleryImages(shirt.name, variant));
  const firstImage = firstVariant?.images.main;

  return {
    ...product,
    id: shirt.id,
    title: shirt.name,
    name: shirt.name,
    category: shirt.category,
    collection: shirt.collection,
    description: shirt.description,
    price: shirt.price,
    baseImage: firstImage,
    image: firstImage
      ? {
          src: firstImage,
          alt: `${shirt.name} in ${firstVariant.colorName} - main front view`,
        }
      : product.image,
    colors: shirt.variants.map((variant) => variant.colorName),
    swatches,
    variants: shirt.variants,
    galleryImages: variantGallery.length ? variantGallery : product.galleryImages,
  };
}

export function resolveProductVariant(product: Product, variantSlug: string | null | undefined) {
  const variants = product.variants ?? [];
  const normalizedSlug = variantSlug?.trim().toLowerCase();

  if (!variants.length) {
    return null;
  }

  if (!normalizedSlug) {
    return variants[0];
  }

  return variants.find((variant) => variant.slug.toLowerCase() === normalizedSlug) ?? variants[0];
}

export function resolveVariantByColor(product: Product, colorName: string | null | undefined) {
  const variants = product.variants ?? [];
  const normalized = colorName?.trim().toLowerCase();

  if (!variants.length || !normalized) {
    return null;
  }

  return variants.find((variant) => variant.colorName.toLowerCase() === normalized) ?? null;
}

function slugifyVariant(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductVariants(product: Product): ProductVariant[] {
  if (product.variants?.length) {
    return product.variants;
  }

  const swatches = product.swatches ?? [];
  if (swatches.length) {
    return swatches.map((swatch, index) => {
      const slug = swatch.slug ?? slugifyVariant(swatch.label || `variant-${index + 1}`);
      const mainImage = swatch.imageSrc ?? product.image?.src ?? product.baseImage;
      return {
        id: swatch.variantId ?? `${product.slug}-${slug}`,
        colorName: swatch.label,
        slug,
        swatchType: swatch.swatchType ?? (swatch.swatchImage ? "image" : "color"),
        swatchValue: swatch.value,
        swatchImage: swatch.swatchImage,
        sku: swatch.sku ?? `${product.slug.toUpperCase()}-${slug.toUpperCase()}`,
        images: {
          main: mainImage,
          layered: mainImage,
          detail: mainImage,
          fit: mainImage,
          completeLook: mainImage,
        },
      } satisfies ProductVariant;
    });
  }

  return product.colors.map((color, index) => {
    const slug = slugifyVariant(color || `variant-${index + 1}`);
    const mainImage = product.image?.src ?? product.baseImage;
    return {
      id: `${product.slug}-${slug}`,
      colorName: color,
      slug,
      swatchType: "color",
      swatchValue: "#8c7967",
      sku: `${product.slug.toUpperCase()}-${slug.toUpperCase()}`,
      images: {
        main: mainImage,
        layered: mainImage,
        detail: mainImage,
        fit: mainImage,
        completeLook: mainImage,
      },
    } satisfies ProductVariant;
  });
}
