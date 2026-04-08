import "server-only";

import {
  articles as fallbackArticles,
  categories as fallbackCategories,
  collections as fallbackCollections,
  defaultHomePageSettings,
  getArticle as fallbackGetArticle,
  getCategory as fallbackGetCategory,
  getCollection as fallbackGetCollection,
  getOccasion as fallbackGetOccasion,
  getProduct as fallbackGetProduct,
  getProductsByCategory as fallbackGetProductsByCategory,
  getProductsByCollection as fallbackGetProductsByCollection,
  getProductsByOccasion as fallbackGetProductsByOccasion,
  getProductsBySlugs as fallbackGetProductsBySlugs,
  lookbookLooks as fallbackLookbookLooks,
  newInPlaceholderProducts,
  occasions as fallbackOccasions,
  products as fallbackProducts,
  trustPoints,
  type Article,
  type Category,
  type Collection,
  type Occasion,
  type Product,
  type Tone,
} from "@/data/site";
import { getHomePageSettings } from "@/lib/homepage";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

type LookbookLook = {
  slug: string;
  title: string;
  description: string;
  tone: Tone;
  products: string[];
};

type StorefrontData = {
  categories: Category[];
  occasions: Occasion[];
  collections: Collection[];
  products: Product[];
  articles: Article[];
  lookbookLooks: LookbookLook[];
};

type ProductRow = {
  slug: string;
  title: string;
  category_slug: string;
  price: number;
  tone: Tone;
  blurb: string;
  description: string;
  delivery: string;
  fit: string;
  colors: string[] | null;
  sizes: string[] | null;
  availability: string;
  details: string[] | null;
  card_features: string[] | null;
  rating_value: number | null;
  review_count: number | null;
  collection_slug: string;
  featured_rank?: number | null;
  is_new: boolean;
  is_best_seller: boolean;
  complete_the_look: string[] | null;
  image_url?: string | null;
  image_alt?: string | null;
  image_position?: string | null;
  product_occasions?: Array<{ occasion_slug: string }> | null;
};

type CategoryRow = Category & {
  sort_order?: number | null;
  image_url?: string | null;
  image_alt?: string | null;
  image_position?: string | null;
};

type OccasionRow = Occasion & {
  sort_order?: number | null;
  image_url?: string | null;
  image_alt?: string | null;
  image_position?: string | null;
};

type CollectionRow = Collection & {
  sort_order?: number | null;
  image_url?: string | null;
  image_alt?: string | null;
  image_position?: string | null;
};

function mapCatalogImage(row: {
  image_url?: string | null;
  image_alt?: string | null;
  image_position?: string | null;
  title: string;
}) {
  return row.image_url
    ? {
        src: row.image_url,
        alt: row.image_alt ?? row.title,
        position: row.image_position ?? undefined,
      }
    : undefined;
}

type ArticleRow = {
  slug: string;
  title: string;
  description: string;
  tone: Tone;
  reading_time: string;
  category: string;
  body?: string | null;
  sort_order?: number | null;
};

type LookbookRow = {
  slug: string;
  title: string;
  description: string;
  tone: Tone;
  product_slugs: string[] | null;
  sort_order?: number | null;
};

const fallbackData: StorefrontData = {
  categories: fallbackCategories,
  occasions: fallbackOccasions,
  collections: fallbackCollections,
  products: fallbackProducts,
  articles: fallbackArticles,
  lookbookLooks: fallbackLookbookLooks.map((look, index) => ({
    slug: `look-${index + 1}`,
    title: look.title,
    description: look.description,
    tone: look.tone,
    products: look.products,
  })),
};

function mapProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category_slug,
    price: row.price,
    tone: row.tone,
    blurb: row.blurb,
    description: row.description,
    delivery: row.delivery,
    fit: row.fit,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    availability: row.availability,
    details: row.details ?? [],
    cardFeatures: row.card_features ?? [row.fit, ...(row.details ?? [])].filter(Boolean).slice(0, 2),
    ratingValue: row.rating_value ?? 4.8,
    reviewCount: row.review_count ?? 0,
    collection: row.collection_slug,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    featuredRank: row.featured_rank ?? 100,
    occasions: row.product_occasions?.map((entry) => entry.occasion_slug) ?? [],
    completeTheLook: row.complete_the_look ?? [],
    image: row.image_url
      ? {
          src: row.image_url,
          alt: row.image_alt ?? row.title,
          position: row.image_position ?? undefined,
        }
      : undefined,
  };
}

function withFallback<T>(label: string, fallback: T, error: unknown) {
  console.error(`Supabase ${label} query failed. Falling back to local seed data.`, error);
  return fallback;
}

const loadStorefrontData = async (): Promise<StorefrontData> => {
  if (!hasSupabaseConfig()) {
    return fallbackData;
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return fallbackData;
  }

  const [categoriesResult, occasionsResult, collectionsResult, productsResult, articlesResult, lookbookResult] =
    await Promise.all([
      supabase
        .from("categories")
        .select("slug,title,description,caption,tone,sort_order,image_url,image_alt,image_position")
        .order("sort_order"),
      supabase
        .from("occasions")
        .select("slug,title,description,tone,sort_order,image_url,image_alt,image_position")
        .order("sort_order"),
      supabase
        .from("collections")
        .select("slug,title,description,tone,cta,sort_order,image_url,image_alt,image_position")
        .order("sort_order"),
      supabase
        .from("products")
        .select(
          "slug,title,category_slug,price,tone,blurb,description,delivery,fit,colors,sizes,availability,details,card_features,rating_value,review_count,collection_slug,featured_rank,is_new,is_best_seller,complete_the_look,image_url,image_alt,image_position,product_occasions(occasion_slug)",
        )
        .order("featured_rank", { ascending: true })
        .order("title", { ascending: true }),
      supabase.from("articles").select("slug,title,description,tone,reading_time,category,body,sort_order").order("sort_order"),
      supabase.from("lookbook_looks").select("slug,title,description,tone,product_slugs,sort_order").order("sort_order"),
    ]);

  if (categoriesResult.error) {
    return withFallback("categories", fallbackData, categoriesResult.error);
  }

  if (occasionsResult.error) {
    return withFallback("occasions", fallbackData, occasionsResult.error);
  }

  if (collectionsResult.error) {
    return withFallback("collections", fallbackData, collectionsResult.error);
  }

  if (productsResult.error) {
    return withFallback("products", fallbackData, productsResult.error);
  }

  if (articlesResult.error) {
    return withFallback("articles", fallbackData, articlesResult.error);
  }

  if (lookbookResult.error) {
    return withFallback("lookbook", fallbackData, lookbookResult.error);
  }

  return {
    categories:
      ((categoriesResult.data as CategoryRow[]) ?? []).map((category) => ({
        slug: category.slug,
        title: category.title,
        description: category.description,
        caption: category.caption,
        tone: category.tone,
        sortOrder: category.sort_order ?? 0,
        image: mapCatalogImage(category),
      })) || fallbackData.categories,
    occasions:
      ((occasionsResult.data as OccasionRow[]) ?? []).map((occasion) => ({
        slug: occasion.slug,
        title: occasion.title,
        description: occasion.description,
        tone: occasion.tone,
        sortOrder: occasion.sort_order ?? 0,
        image: mapCatalogImage(occasion),
      })) || fallbackData.occasions,
    collections:
      ((collectionsResult.data as CollectionRow[]) ?? []).map((collection) => ({
        slug: collection.slug,
        title: collection.title,
        description: collection.description,
        tone: collection.tone,
        cta: collection.cta,
        sortOrder: collection.sort_order ?? 0,
        image: mapCatalogImage(collection),
      })) || fallbackData.collections,
    products: ((productsResult.data as ProductRow[]) ?? []).map(mapProduct),
    articles: ((articlesResult.data as ArticleRow[]) ?? []).map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      tone: article.tone,
      readingTime: article.reading_time,
      category: article.category,
    })),
    lookbookLooks: ((lookbookResult.data as LookbookRow[]) ?? []).map((look) => ({
      slug: look.slug,
      title: look.title,
      description: look.description,
      tone: look.tone,
      products: look.product_slugs ?? [],
    })),
  };
};

export async function getCategories() {
  return (await loadStorefrontData()).categories;
}

export async function getOccasions() {
  return (await loadStorefrontData()).occasions;
}

export async function getCollections() {
  return (await loadStorefrontData()).collections;
}

export async function getProducts() {
  return (await loadStorefrontData()).products;
}

export async function getNewInProducts() {
  const products = await getProducts();
  const matches = products.filter((item) => item.isNew);

  return matches.length ? matches : fallbackProducts.filter((item) => item.isNew);
}

export async function getBestSellerProducts() {
  const products = await getProducts();
  const matches = products.filter((item) => item.isBestSeller);

  return matches.length ? matches : fallbackProducts.filter((item) => item.isBestSeller);
}

export async function getArticles() {
  return (await loadStorefrontData()).articles;
}

export async function getLookbookLooks() {
  return (await loadStorefrontData()).lookbookLooks;
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((item) => item.slug === slug) ?? fallbackGetCategory(slug);
}

export async function getOccasion(slug: string) {
  return (await getOccasions()).find((item) => item.slug === slug) ?? fallbackGetOccasion(slug);
}

export async function getCollection(slug: string) {
  return (await getCollections()).find((item) => item.slug === slug) ?? fallbackGetCollection(slug);
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((item) => item.slug === slug) ?? fallbackGetArticle(slug);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((item) => item.slug === slug) ?? fallbackGetProduct(slug);
}

export async function getProductsByCategory(slug: string) {
  const matches = (await getProducts()).filter((item) => item.category === slug);
  return matches.length ? matches : fallbackGetProductsByCategory(slug);
}

export async function getProductsByCollection(slug: string) {
  const matches = (await getProducts()).filter((item) => item.collection === slug);
  return matches.length ? matches : fallbackGetProductsByCollection(slug);
}

export async function getProductsByOccasion(slug: string) {
  const matches = (await getProducts()).filter((item) => item.occasions.includes(slug));
  return matches.length ? matches : fallbackGetProductsByOccasion(slug);
}

export async function getProductsBySlugs(slugs: readonly string[]) {
  const products = await getProducts();
  const mapped = slugs
    .map((slug) => products.find((item) => item.slug === slug))
    .filter((item): item is Product => Boolean(item));

  return mapped.length ? mapped : fallbackGetProductsBySlugs([...slugs]);
}

export async function getHomePageData() {
  const [categories, occasions, collections, products, articles, lookbookLooks, newInProducts, bestSellerProducts, settings] = await Promise.all([
    getCategories(),
    getOccasions(),
    getCollections(),
    getProducts(),
    getArticles(),
    getLookbookLooks(),
    getNewInProducts(),
    getBestSellerProducts(),
    getHomePageSettings(),
  ]);

  const featuredCollection =
    collections.find((collection) => collection.slug === settings.featuredCollectionSlug) ??
    collections[0] ??
    fallbackCollections[0];
  const latestProducts = [...newInProducts, ...newInPlaceholderProducts].slice(0, 6);
  const featuredProducts = products.filter((product) => product.collection === featuredCollection.slug).slice(0, 3);
  const completeLook =
    lookbookLooks.find((look) => look.slug === settings.completeLookSlug) ??
    lookbookLooks[0] ??
    fallbackData.lookbookLooks[0];
  const completeLookProducts = await getProductsBySlugs(completeLook.products);

  return {
    settings: settings ?? defaultHomePageSettings,
    categories,
    occasions,
    articles,
    trustPoints,
    featuredCollection,
    featuredProducts: featuredProducts.length ? featuredProducts : fallbackGetProductsByCollection(featuredCollection.slug).slice(0, 3),
    bestSellerProducts: bestSellerProducts.slice(0, 3),
    latestProducts: latestProducts.length ? latestProducts : fallbackProducts.filter((product) => product.isNew).slice(0, 6),
    completeLook,
    completeLookProducts,
  };
}
