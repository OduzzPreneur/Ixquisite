import type { Product } from "@/data/site";
import { absoluteUrl, siteConfig } from "@/lib/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt?: string };
  section?: string;
};

const categoryNames: Record<string, string> = {
  suits: "Men's Suits",
  shirts: "Men's Shirts",
  trousers: "Men's Trousers",
  ties: "Men's Ties",
  accessories: "Men's Accessories",
};

function mapAvailability(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("in stock")) {
    return "https://schema.org/InStock";
  }

  if (normalized.includes("low stock") || normalized.includes("limited")) {
    return "https://schema.org/LimitedAvailability";
  }

  if (normalized.includes("pre") || normalized.includes("made to order")) {
    return "https://schema.org/PreOrder";
  }

  return "https://schema.org/OutOfStock";
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl(siteConfig.logo),
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProductSchema(product: Product) {
  const images = [
    product.image?.src,
    ...(product.galleryImages?.map((image) => image.src) ?? []),
  ]
    .filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index)
    .map((src) => absoluteUrl(src));

  const color = product.colors[0] ?? product.swatches[0]?.label;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.blurb || product.description,
    image: images,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    category: categoryNames[product.category] ?? product.category,
    ...(color ? { color } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "NGN",
      price: String(product.price),
      availability: mapAvailability(product.availability),
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logo),
      },
    },
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.image ? { image: absoluteUrl(input.image.src) } : {}),
  };
}

export function buildFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
