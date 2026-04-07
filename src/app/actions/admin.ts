"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Tone } from "@/data/site";
import { requireAdminUser } from "@/lib/admin";
import { mergeHomePageSettings } from "@/lib/homepage";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

function assertInternalHref(value: string, label: string) {
  if (!value.startsWith("/")) {
    throw new Error(`${label} must start with /.`);
  }
}

function assertPublicImagePath(value: string, label: string) {
  if (value && !value.startsWith("/")) {
    throw new Error(`${label} must be a public path like /images/ixquisite/file.jpg.`);
  }
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

  return admin;
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
  const sizes = parseList(formData.get("sizes"));
  const details = parseList(formData.get("details"));
  const completeTheLook = parseList(formData.get("complete_the_look"));
  const occasionSlugs = parseList(formData.get("occasion_slugs"));
  const imageUrl = normalizeField(formData.get("image_url"));
  const imageAlt = normalizeField(formData.get("image_alt"));
  const imagePosition = normalizeField(formData.get("image_position"));

  if (!slug || !title || !categorySlug || !collectionSlug || !blurb || !description || !delivery || !fit || !availability) {
    redirectWithAdminMessage("/admin/products", "error", "Complete all required product fields.");
  }

  if (price < 0) {
    redirectWithAdminMessage("/admin/products", "error", "Price must be zero or greater.");
  }

  try {
    assertPublicImagePath(imageUrl, "Product image");

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
      colors,
      sizes,
      availability,
      details,
      complete_the_look: completeTheLook,
      featured_rank: featuredRank,
      is_new: parseBoolean(formData.get("is_new")),
      is_best_seller: parseBoolean(formData.get("is_best_seller")),
      image_url: imageUrl || null,
      image_alt: imageAlt || null,
      image_position: imagePosition || null,
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
