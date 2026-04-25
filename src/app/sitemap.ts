import type { MetadataRoute } from "next";
import { getArticles, getCategories, getCollections, getOccasions, getProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections, occasions, articles] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections(),
    getOccasions(),
    getArticles(),
  ]);

  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/new-in"), lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/best-sellers"), lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/collections"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/occasions"), lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/groom-package"), lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteUrl("/style-guide"), lastModified, changeFrequency: "weekly", priority: 0.75 },
    { url: absoluteUrl("/lookbook"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/help"), lastModified, changeFrequency: "monthly", priority: 0.55 },
    { url: absoluteUrl("/faq"), lastModified, changeFrequency: "monthly", priority: 0.55 },
    { url: absoluteUrl("/size-guide"), lastModified, changeFrequency: "monthly", priority: 0.55 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.55 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "monthly", priority: 0.55 },
  ];

  const categoryRoutes = categories.map((category) => ({
    url: absoluteUrl(`/category/${category.slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const collectionRoutes = collections.map((collection) => ({
    url: absoluteUrl(`/collection/${collection.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const occasionRoutes = occasions.map((occasion) => ({
    url: absoluteUrl(`/occasion/${occasion.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const productRoutes = products
    .filter((product) => !product.isPlaceholder)
    .map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  const articleRoutes = articles.map((article) => ({
    url: absoluteUrl(`/style-guide/${article.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...occasionRoutes,
    ...productRoutes,
    ...articleRoutes,
  ];
}
