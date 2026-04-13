"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { HomePageSettings, ProductGalleryImage, Tone } from "@/data/site";
import { normalizeProductGalleryImages, parseSerializedGalleryImages } from "@/lib/product-gallery";
import { requireAdminUser } from "@/lib/admin";
import { mergeHomePageSettings } from "@/lib/homepage";
import { ensureProductSwatches, parseSerializedSwatches } from "@/lib/product-swatches";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseUrl } from "@/lib/supabase/shared";

const tones: Tone[] = ["navy", "espresso", "stone", "slate", "ink", "gold"];

function normalizeField(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseList(value: FormDataEntryValue | null) {
  return normalizeField(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on";
}

function parseInteger(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseInt(normalizeField(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDecimal(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseFloat(normalizeField(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function assertInternalHref(value: string, label: string) {
  if (!value.startsWith("/")) {
    throw new Error(`${label} must start with /.`);
  }
}

function assertPublicImagePath(value: string, label: string) {
  if (!value) {
    return;
  }

  if (value.startsWith("/")) {
    return;
  }

  const supabaseUrl = getSupabaseUrl();
  if (supabaseUrl && value.startsWith(`${supabaseUrl}/storage/v1/object/public/`)) {
    return;
  }

  throw new Error(
    `${label} must be a public path like /images/ixquisite/cocoa-double-breasted-suit.webp or a Supabase Storage public URL.`,
  );
}

function assertTone(value: string): Tone {
  if (!tones.includes(value as Tone)) {
    throw new Error("Choose a valid tone.");
  }

  return value as Tone;
}

function redirectWithAdminMessage(path: string, key: "error" | "message", value: string) {
  redirect(`${path}?${key}=${encodeURIComponent(value)}`);
}

function getAdminClientOrRedirect(path: string): NonNullable<ReturnType<typeof createSupabaseAdminClient>> {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    redirectWithAdminMessage(path, "error", "Admin data access is not configured.");
  }

  return admin as NonNullable<ReturnType<typeof createSupabaseAdminClient>>;
}

function revalidateCatalogShell() {
  revalidatePath("/");
  revalidatePath("/new-in");
  revalidatePath("/best-sellers");
  revalidatePath("/collections");
  revalidatePath("/occasions");
  revalidatePath("/search");
  revalidatePath("/wishlist");
}

function slugifyUploadName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getFileExtension(file: File) {
  const byName = file.name.split(".").pop()?.trim().toLowerCase();
  if (byName) {
    return byName;
  }

  const byType = file.type.split("/").pop()?.trim().toLowerCase();
  return byType || "webp";
}

async function ensurePublicSiteAssetsBucket(admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>) {
  const bucketId = "site-assets";
  const { data: existing, error: lookupError } = await admin.storage.getBucket(bucketId);

  if (!lookupError && existing) {
    return bucketId;
  }

  const { error: createError } = await admin.storage.createBucket(bucketId, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  });

  if (createError && !/already exists/i.test(createError.message)) {
    throw createError;
  }

  return bucketId;
}

async function uploadAdminImage(
  admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  file: File,
  folder: string,
) {
  if (!(file instanceof File) || !file.size) {
    throw new Error("Choose an image file to upload.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image uploads must be 10 MB or smaller.");
  }

  const bucketId = await ensurePublicSiteAssetsBucket(admin);
  const extension = getFileExtension(file);
  const baseName = slugifyUploadName(file.name.replace(/\.[^.]+$/, "")) || "image";
  const objectPath = `${folder}/${Date.now()}-${baseName}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from(bucketId).upload(objectPath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = admin.storage.from(bucketId).getPublicUrl(objectPath);
  if (!data.publicUrl) {
    throw new Error("Unable to generate a public image URL.");
  }

  return data.publicUrl;
}

type ProductUploadContext = {
  slug: string;
  category_slug: string | null;
  collection_slug: string | null;
};

type ProductImageAdminRecord = ProductUploadContext & {
  swatches: Array<{
    label: string;
    value: string;
    imageSrc?: string;
    imagePosition?: string;
  }> | null;
  colors: string[] | null;
};

async function getProductUploadContext(
  admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  slug: string,
) {
  const { data, error } = await admin
    .from("products")
    .select("slug, category_slug, collection_slug")
    .eq("slug", slug)
    .maybeSingle<ProductUploadContext>();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Product not found.");
  }

  return data;
}

async function getProductImageAdminRecord(
  admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  slug: string,
) {
  const { data, error } = await admin
    .from("products")
    .select("slug, category_slug, collection_slug, swatches, colors")
    .eq("slug", slug)
    .maybeSingle<ProductImageAdminRecord>();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Product not found.");
  }

  return data;
}

function revalidateProductImageSurfaces(context: ProductUploadContext) {
  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${context.slug}`);
  revalidatePath(`/product/${context.slug}`);

  if (context.category_slug) {
    revalidatePath(`/category/${context.category_slug}`);
  }

  if (context.collection_slug) {
    revalidatePath(`/collection/${context.collection_slug}`);
  }
}

export async function upsertCategoryAction(formData: FormData) {
  await requireAdminUser("/admin/categories");

  const admin = getAdminClientOrRedirect("/admin/categories");
  const previousSlug = normalizeField(formData.get("previous_slug"));
  const previousCategorySlug = normalizeField(formData.get("previous_category_slug"));
  const previousCollectionSlug = normalizeField(formData.get("previous_collection_slug"));
  const previousOccasionSlugs = parseList(formData.get("previous_occasion_slugs"));
  const slug = normalizeField(formData.get("slug"));
  const title = normalizeField(formData.get("title"));
  const description = normalizeField(formData.get("description"));
  const caption = normalizeField(formData.get("caption"));
  const tone = normalizeField(formData.get("tone"));
  const sortOrder = parseInteger(formData.get("sort_order"));

  if (!slug || !title || !description || !caption) {
    redirectWithAdminMessage("/admin/categories", "error", "Slug, title, caption, and description are required.");
  }

  try {
    const payload = {
      slug,
      title,
      description,
      caption,
      tone: assertTone(tone),
      sort_order: sortOrder,
    };

    const { error } = previousSlug
      ? await admin.from("categories").update(payload).eq("slug", previousSlug)
      : await admin.from("categories").insert(payload);

    if (error) {
      throw error;
    }
  } catch (error) {
    redirectWithAdminMessage(
      previousSlug ? `/admin/categories/${previousSlug}` : "/admin/categories",
      "error",
      error instanceof Error ? error.message : "Unable to save category.",
    );
  }

  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  if (previousSlug) {
    revalidatePath(`/category/${previousSlug}`);
    revalidatePath(`/admin/categories/${previousSlug}`);
  }
  revalidatePath(`/category/${slug}`);
  revalidatePath(`/admin/categories/${slug}`);
  redirect(`/admin/categories/${slug}?message=${encodeURIComponent("Category saved.")}`);
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdminUser("/admin/categories");

  const admin = getAdminClientOrRedirect("/admin/categories");
  const slug = normalizeField(formData.get("slug"));

  if (!slug) {
    redirectWithAdminMessage("/admin/categories", "error", "Choose a category to delete.");
  }

  const { error } = await admin.from("categories").delete().eq("slug", slug);

  if (error) {
    redirectWithAdminMessage("/admin/categories", "error", error.message);
  }

  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath(`/category/${slug}`);
  redirect("/admin/categories?message=Category%20deleted.");
}

export async function upsertProductAction(formData: FormData) {
  await requireAdminUser("/admin/products");

  const admin = getAdminClientOrRedirect("/admin/products");
  const previousSlug = normalizeField(formData.get("previous_slug"));
  const previousCategorySlug = normalizeField(formData.get("previous_category_slug"));
  const previousCollectionSlug = normalizeField(formData.get("previous_collection_slug"));
  const previousOccasionSlugs = parseList(formData.get("previous_occasion_slugs"));
  const slug = normalizeField(formData.get("slug"));
  const title = normalizeField(formData.get("title"));
  const categorySlug = normalizeField(formData.get("category_slug"));
  const collectionSlug = normalizeField(formData.get("collection_slug"));
  const tone = normalizeField(formData.get("tone"));
  const blurb = normalizeField(formData.get("blurb"));
  const description = normalizeField(formData.get("description"));
  const delivery = normalizeField(formData.get("delivery"));
  const fit = normalizeField(formData.get("fit"));
  const availability = normalizeField(formData.get("availability"));
  const price = parseInteger(formData.get("price"));
  const featuredRank = parseInteger(formData.get("featured_rank"), 100);
  const colors = parseList(formData.get("colors"));
  const swatches = parseSerializedSwatches(normalizeField(formData.get("swatches")));
  const sizes = parseList(formData.get("sizes"));
  const details = parseList(formData.get("details"));
  const cardFeatures = parseList(formData.get("card_features"));
  const completeTheLook = parseList(formData.get("complete_the_look"));
  const occasionSlugs = parseList(formData.get("occasion_slugs"));
  const imageUrl = normalizeField(formData.get("image_url"));
  const imageAlt = normalizeField(formData.get("image_alt"));
  const imagePosition = normalizeField(formData.get("image_position"));
  const galleryImages = parseSerializedGalleryImages(normalizeField(formData.get("gallery_images")));
  const ratingValue = parseDecimal(formData.get("rating_value"), 4.8);
  const reviewCount = parseInteger(formData.get("review_count"));

  if (!slug || !title || !categorySlug || !collectionSlug || !blurb || !description || !delivery || !fit || !availability) {
    redirectWithAdminMessage("/admin/products", "error", "Complete all required product fields.");
  }

  if (price < 0) {
    redirectWithAdminMessage("/admin/products", "error", "Price must be zero or greater.");
  }

  if (ratingValue < 0 || ratingValue > 5) {
    redirectWithAdminMessage("/admin/products", "error", "Rating must be between 0 and 5.");
  }

  if (reviewCount < 0) {
    redirectWithAdminMessage("/admin/products", "error", "Review count must be zero or greater.");
  }

  try {
    assertPublicImagePath(imageUrl, "Product image");
    swatches.forEach((swatch, index) => {
      if (swatch.imageSrc) {
        assertPublicImagePath(swatch.imageSrc, `Swatch image ${index + 1}`);
      }
    });
    galleryImages.forEach((image, index) => {
      assertPublicImagePath(image.src, `Gallery image ${index + 1}`);
    });

    const normalizedColors = swatches.length ? swatches.map((swatch) => swatch.label) : colors;

    const payload = {
      slug,
      title,
      category_slug: categorySlug,
      collection_slug: collectionSlug,
      price,
      tone: assertTone(tone),
      blurb,
      description,
      delivery,
      fit,
      colors: normalizedColors,
      swatches,
      sizes,
      availability,
      details,
      card_features: cardFeatures,
      rating_value: Math.round(ratingValue * 10) / 10,
      review_count: reviewCount,
      complete_the_look: completeTheLook,
      featured_rank: featuredRank,
      is_new: parseBoolean(formData.get("is_new")),
      is_best_seller: parseBoolean(formData.get("is_best_seller")),
      image_url: imageUrl || null,
      image_alt: imageAlt || null,
      image_position: imagePosition || null,
      gallery_images: galleryImages,
    };

    const { error } = previousSlug
      ? await admin.from("products").update(payload).eq("slug", previousSlug)
      : await admin.from("products").insert(payload);

    if (error) {
      throw error;
    }

    await admin.from("product_occasions").delete().eq("product_slug", slug);

    if (occasionSlugs.length) {
      const { error: occasionError } = await admin.from("product_occasions").insert(
        occasionSlugs.map((occasionSlug) => ({
          product_slug: slug,
          occasion_slug: occasionSlug,
        })),
      );

      if (occasionError) {
        throw occasionError;
      }
    }
  } catch (error) {
    redirectWithAdminMessage(
      previousSlug ? `/admin/products/${previousSlug}` : "/admin/products",
      "error",
      error instanceof Error ? error.message : "Unable to save product.",
    );
  }

  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  if (previousSlug) {
    revalidatePath(`/product/${previousSlug}`);
    revalidatePath(`/admin/products/${previousSlug}`);
  }
  if (previousCategorySlug) {
    revalidatePath(`/category/${previousCategorySlug}`);
  }
  if (previousCollectionSlug) {
    revalidatePath(`/collection/${previousCollectionSlug}`);
  }
  for (const occasionSlug of previousOccasionSlugs) {
    revalidatePath(`/occasion/${occasionSlug}`);
  }
  revalidatePath(`/product/${slug}`);
  revalidatePath(`/category/${categorySlug}`);
  revalidatePath(`/collection/${collectionSlug}`);
  for (const occasionSlug of occasionSlugs) {
    revalidatePath(`/occasion/${occasionSlug}`);
  }
  redirect(`/admin/products/${slug}?message=${encodeURIComponent("Product saved.")}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminUser("/admin/products");

  const admin = getAdminClientOrRedirect("/admin/products");
  const slug = normalizeField(formData.get("slug"));
  const categorySlug = normalizeField(formData.get("category_slug"));
  const collectionSlug = normalizeField(formData.get("collection_slug"));
  const occasionSlugs = parseList(formData.get("occasion_slugs"));

  if (!slug) {
    redirectWithAdminMessage("/admin/products", "error", "Choose a product to delete.");
  }

  const { error } = await admin.from("products").delete().eq("slug", slug);

  if (error) {
    redirectWithAdminMessage("/admin/products", "error", error.message);
  }

  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  if (categorySlug) {
    revalidatePath(`/category/${categorySlug}`);
  }
  if (collectionSlug) {
    revalidatePath(`/collection/${collectionSlug}`);
  }
  for (const occasionSlug of occasionSlugs) {
    revalidatePath(`/occasion/${occasionSlug}`);
  }
  redirect("/admin/products?message=Product%20deleted.");
}

export async function updateHomepageSettingsAction(formData: FormData) {
  await requireAdminUser("/admin/homepage");

  const admin = getAdminClientOrRedirect("/admin/homepage");

  try {
    const settings = mergeHomePageSettings({
      heroEyebrow: normalizeField(formData.get("hero_eyebrow")),
      heroTitle: normalizeField(formData.get("hero_title")),
      heroCopy: normalizeField(formData.get("hero_copy")),
      heroPrimaryLabel: normalizeField(formData.get("hero_primary_label")),
      heroPrimaryHref: normalizeField(formData.get("hero_primary_href")),
      heroSecondaryLabel: normalizeField(formData.get("hero_secondary_label")),
      heroSecondaryHref: normalizeField(formData.get("hero_secondary_href")),
      heroVisualTitle: normalizeField(formData.get("hero_visual_title")),
      heroVisualSrc: normalizeField(formData.get("hero_visual_src")),
      heroVisualAlt: normalizeField(formData.get("hero_visual_alt")),
      heroVisualPosition: normalizeField(formData.get("hero_visual_position")),
      heroMeta: parseList(formData.get("hero_meta")),
      heroNoteTitle: normalizeField(formData.get("hero_note_title")),
      heroNoteCopy: normalizeField(formData.get("hero_note_copy")),
      groomFeatureEyebrow: normalizeField(formData.get("groom_feature_eyebrow")),
      groomFeatureTitle: normalizeField(formData.get("groom_feature_title")),
      groomFeatureCopy: normalizeField(formData.get("groom_feature_copy")),
      groomFeaturePrimaryLabel: normalizeField(formData.get("groom_feature_primary_label")),
      groomFeaturePrimaryHref: normalizeField(formData.get("groom_feature_primary_href")),
      groomFeatureSecondaryLabel: normalizeField(formData.get("groom_feature_secondary_label")),
      groomFeatureSecondaryHref: normalizeField(formData.get("groom_feature_secondary_href")),
      groomFeaturePills: parseList(formData.get("groom_feature_pills")),
      groomFeatureImageTitle: normalizeField(formData.get("groom_feature_image_title")),
      groomFeatureImageSrc: normalizeField(formData.get("groom_feature_image_src")),
      groomFeatureImageAlt: normalizeField(formData.get("groom_feature_image_alt")),
      groomFeatureImagePosition: normalizeField(formData.get("groom_feature_image_position")),
      featuredCollectionSlug: normalizeField(formData.get("featured_collection_slug")),
      completeLookSlug: normalizeField(formData.get("complete_look_slug")),
      finalCtaEyebrow: normalizeField(formData.get("final_cta_eyebrow")),
      finalCtaTitle: normalizeField(formData.get("final_cta_title")),
      finalCtaCopy: normalizeField(formData.get("final_cta_copy")),
      finalCtaPrimaryLabel: normalizeField(formData.get("final_cta_primary_label")),
      finalCtaPrimaryHref: normalizeField(formData.get("final_cta_primary_href")),
      finalCtaSecondaryLabel: normalizeField(formData.get("final_cta_secondary_label")),
      finalCtaSecondaryHref: normalizeField(formData.get("final_cta_secondary_href")),
    });

    assertInternalHref(settings.heroPrimaryHref, "Hero primary link");
    assertInternalHref(settings.heroSecondaryHref, "Hero secondary link");
    assertInternalHref(settings.groomFeaturePrimaryHref, "Groom primary link");
    assertInternalHref(settings.groomFeatureSecondaryHref, "Groom secondary link");
    assertInternalHref(settings.finalCtaPrimaryHref, "Final CTA primary link");
    assertInternalHref(settings.finalCtaSecondaryHref, "Final CTA secondary link");
    assertPublicImagePath(settings.heroVisualSrc, "Hero visual");
    assertPublicImagePath(settings.groomFeatureImageSrc, "Groom feature image");

    const { error } = await admin.from("homepage_settings").upsert({
      id: "default",
      content: settings,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    redirectWithAdminMessage(
      "/admin/homepage",
      "error",
      error instanceof Error ? error.message : "Unable to save homepage settings.",
    );
  }

  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?message=Homepage%20updated.");
}

export async function uploadHomepageImageAction(target: "hero" | "groom", formData: FormData) {
  await requireAdminUser("/admin/homepage");

  const admin = getAdminClientOrRedirect("/admin/homepage");

  try {
    const imageFile = formData.get(target === "hero" ? "hero_image_file" : "groom_image_file");
    if (!(imageFile instanceof File)) {
      throw new Error("Choose an image file to upload.");
    }

    const imageUrl = await uploadAdminImage(
      admin,
      imageFile,
      target === "hero" ? "homepage/hero" : "homepage/groom-feature",
    );

    const { data, error: currentError } = await admin
      .from("homepage_settings")
      .select("content")
      .eq("id", "default")
      .maybeSingle<{ content?: Record<string, unknown> | null }>();

    if (currentError) {
      throw currentError;
    }

    const currentSettings = mergeHomePageSettings((data?.content as Partial<HomePageSettings>) ?? null);
    const nextSettings =
      target === "hero"
        ? { ...currentSettings, heroVisualSrc: imageUrl }
        : { ...currentSettings, groomFeatureImageSrc: imageUrl };

    const { error: saveError } = await admin.from("homepage_settings").upsert({
      id: "default",
      content: nextSettings,
    });

    if (saveError) {
      throw saveError;
    }
  } catch (error) {
    redirectWithAdminMessage(
      "/admin/homepage",
      "error",
      error instanceof Error ? error.message : "Unable to upload homepage image.",
    );
  }

  revalidateCatalogShell();
  revalidatePath("/admin");
  revalidatePath("/admin/homepage");
  redirect(
    `/admin/homepage?message=${encodeURIComponent(
      target === "hero" ? "Hero image uploaded." : "Groom feature image uploaded.",
    )}`,
  );
}

export async function uploadProductImageAction(slug: string, formData: FormData) {
  await requireAdminUser("/admin/products");

  const admin = getAdminClientOrRedirect("/admin/products");

  try {
    const context = await getProductUploadContext(admin, slug);
    const imageFile = formData.get("product_image_file");
    const imageAlt = normalizeField(formData.get("product_image_alt"));
    const imagePosition = normalizeField(formData.get("product_image_position"));

    if (!imageAlt) {
      throw new Error("Product image alt text is required.");
    }

    if (!(imageFile instanceof File)) {
      throw new Error("Choose a product image file to upload.");
    }

    const imageUrl = await uploadAdminImage(admin, imageFile, `products/${slug}/primary`);
    const { error } = await admin
      .from("products")
      .update({
        image_url: imageUrl,
        image_alt: imageAlt,
        image_position: imagePosition || null,
      })
      .eq("slug", slug);

    if (error) {
      throw error;
    }

    revalidateProductImageSurfaces(context);
  } catch (error) {
    redirectWithAdminMessage(
      `/admin/products/${slug}`,
      "error",
      error instanceof Error ? error.message : "Unable to upload product image.",
    );
  }

  redirect(`/admin/products/${slug}?message=${encodeURIComponent("Product image uploaded.")}`);
}

export async function uploadProductGalleryImageAction(slug: string, formData: FormData) {
  await requireAdminUser("/admin/products");

  const admin = getAdminClientOrRedirect("/admin/products");

  try {
    const context = await getProductUploadContext(admin, slug);
    const imageFile = formData.get("gallery_image_file");
    const label = normalizeField(formData.get("gallery_image_label"));
    const alt = normalizeField(formData.get("gallery_image_alt"));
    const position = normalizeField(formData.get("gallery_image_position"));
    const swatchLabel = normalizeField(formData.get("gallery_image_swatch_label"));

    if (!label || !alt) {
      throw new Error("Gallery image label and alt text are required.");
    }

    if (!(imageFile instanceof File)) {
      throw new Error("Choose a gallery image file to upload.");
    }

    const imageUrl = await uploadAdminImage(admin, imageFile, `products/${slug}/gallery`);
    const { data, error: currentError } = await admin
      .from("products")
      .select("gallery_images")
      .eq("slug", slug)
      .maybeSingle<{ gallery_images?: ProductGalleryImage[] | null }>();

    if (currentError) {
      throw currentError;
    }

    const currentImages = normalizeProductGalleryImages(data?.gallery_images);
    const nextImage: ProductGalleryImage = {
      label,
      src: imageUrl,
      alt,
      position: position || undefined,
      swatchLabel: swatchLabel || undefined,
    };

    const { error } = await admin
      .from("products")
      .update({
        gallery_images: [...currentImages, nextImage],
      })
      .eq("slug", slug);

    if (error) {
      throw error;
    }

    revalidateProductImageSurfaces(context);
  } catch (error) {
    redirectWithAdminMessage(
      `/admin/products/${slug}`,
      "error",
      error instanceof Error ? error.message : "Unable to upload gallery image.",
    );
  }

  redirect(`/admin/products/${slug}?message=${encodeURIComponent("Gallery image uploaded.")}`);
}

export async function uploadProductSwatchImageAction(slug: string, formData: FormData) {
  await requireAdminUser("/admin/products");

  const admin = getAdminClientOrRedirect("/admin/products");

  try {
    const record = await getProductImageAdminRecord(admin, slug);
    const imageFile = formData.get("swatch_image_file");
    const swatchLabel = normalizeField(formData.get("swatch_image_label"));
    const imagePosition = normalizeField(formData.get("swatch_image_position"));

    if (!swatchLabel) {
      throw new Error("Choose a swatch to update.");
    }

    if (!(imageFile instanceof File)) {
      throw new Error("Choose a swatch image file to upload.");
    }

    const swatches = ensureProductSwatches(record.swatches, record.colors);
    const swatchIndex = swatches.findIndex((swatch) => swatch.label === swatchLabel);

    if (swatchIndex === -1) {
      throw new Error("The selected swatch could not be found on this product.");
    }

    const imageUrl = await uploadAdminImage(admin, imageFile, `products/${slug}/swatches`);
    const nextSwatches = swatches.map((swatch, index) =>
      index === swatchIndex
        ? {
            ...swatch,
            imageSrc: imageUrl,
            imagePosition: imagePosition || undefined,
          }
        : swatch,
    );

    const { error } = await admin
      .from("products")
      .update({
        swatches: nextSwatches,
      })
      .eq("slug", slug);

    if (error) {
      throw error;
    }

    revalidateProductImageSurfaces(record);
  } catch (error) {
    redirectWithAdminMessage(
      `/admin/products/${slug}`,
      "error",
      error instanceof Error ? error.message : "Unable to upload swatch image.",
    );
  }

  redirect(`/admin/products/${slug}?message=${encodeURIComponent("Swatch image uploaded.")}`);
}
