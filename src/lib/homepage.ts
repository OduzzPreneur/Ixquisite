import "server-only";

import { cache } from "react";
import { defaultHomePageSettings, type HomePageSettings } from "@/data/site";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

type HomePageSettingsRow = {
  content?: Partial<HomePageSettings> | null;
};

function coerceList(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : fallback;
}

function coerceString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function mergeHomePageSettings(input?: Partial<HomePageSettings> | null): HomePageSettings {
  const content = input ?? {};

  return {
    heroEyebrow: coerceString(content.heroEyebrow, defaultHomePageSettings.heroEyebrow),
    heroTitle: coerceString(content.heroTitle, defaultHomePageSettings.heroTitle),
    heroCopy: coerceString(content.heroCopy, defaultHomePageSettings.heroCopy),
    heroPrimaryLabel: coerceString(content.heroPrimaryLabel, defaultHomePageSettings.heroPrimaryLabel),
    heroPrimaryHref: coerceString(content.heroPrimaryHref, defaultHomePageSettings.heroPrimaryHref),
    heroSecondaryLabel: coerceString(content.heroSecondaryLabel, defaultHomePageSettings.heroSecondaryLabel),
    heroSecondaryHref: coerceString(content.heroSecondaryHref, defaultHomePageSettings.heroSecondaryHref),
    heroVisualTitle: coerceString(content.heroVisualTitle, defaultHomePageSettings.heroVisualTitle),
    heroVisualSrc: coerceString(content.heroVisualSrc, defaultHomePageSettings.heroVisualSrc),
    heroVisualAlt: coerceString(content.heroVisualAlt, defaultHomePageSettings.heroVisualAlt),
    heroVisualPosition: coerceString(content.heroVisualPosition, defaultHomePageSettings.heroVisualPosition),
    heroMeta: coerceList(content.heroMeta, defaultHomePageSettings.heroMeta),
    heroNoteTitle: coerceString(content.heroNoteTitle, defaultHomePageSettings.heroNoteTitle),
    heroNoteCopy: coerceString(content.heroNoteCopy, defaultHomePageSettings.heroNoteCopy),
    groomFeatureEyebrow: coerceString(content.groomFeatureEyebrow, defaultHomePageSettings.groomFeatureEyebrow),
    groomFeatureTitle: coerceString(content.groomFeatureTitle, defaultHomePageSettings.groomFeatureTitle),
    groomFeatureCopy: coerceString(content.groomFeatureCopy, defaultHomePageSettings.groomFeatureCopy),
    groomFeaturePrimaryLabel: coerceString(content.groomFeaturePrimaryLabel, defaultHomePageSettings.groomFeaturePrimaryLabel),
    groomFeaturePrimaryHref: coerceString(content.groomFeaturePrimaryHref, defaultHomePageSettings.groomFeaturePrimaryHref),
    groomFeatureSecondaryLabel: coerceString(
      content.groomFeatureSecondaryLabel,
      defaultHomePageSettings.groomFeatureSecondaryLabel,
    ),
    groomFeatureSecondaryHref: coerceString(
      content.groomFeatureSecondaryHref,
      defaultHomePageSettings.groomFeatureSecondaryHref,
    ),
    groomFeaturePills: coerceList(content.groomFeaturePills, defaultHomePageSettings.groomFeaturePills),
    groomFeatureImageTitle: coerceString(content.groomFeatureImageTitle, defaultHomePageSettings.groomFeatureImageTitle),
    groomFeatureImageSrc: coerceString(content.groomFeatureImageSrc, defaultHomePageSettings.groomFeatureImageSrc),
    groomFeatureImageAlt: coerceString(content.groomFeatureImageAlt, defaultHomePageSettings.groomFeatureImageAlt),
    groomFeatureImagePosition: coerceString(
      content.groomFeatureImagePosition,
      defaultHomePageSettings.groomFeatureImagePosition,
    ),
    featuredCollectionSlug: coerceString(content.featuredCollectionSlug, defaultHomePageSettings.featuredCollectionSlug),
    completeLookSlug: coerceString(content.completeLookSlug, defaultHomePageSettings.completeLookSlug),
    finalCtaEyebrow: coerceString(content.finalCtaEyebrow, defaultHomePageSettings.finalCtaEyebrow),
    finalCtaTitle: coerceString(content.finalCtaTitle, defaultHomePageSettings.finalCtaTitle),
    finalCtaCopy: coerceString(content.finalCtaCopy, defaultHomePageSettings.finalCtaCopy),
    finalCtaPrimaryLabel: coerceString(content.finalCtaPrimaryLabel, defaultHomePageSettings.finalCtaPrimaryLabel),
    finalCtaPrimaryHref: coerceString(content.finalCtaPrimaryHref, defaultHomePageSettings.finalCtaPrimaryHref),
    finalCtaSecondaryLabel: coerceString(
      content.finalCtaSecondaryLabel,
      defaultHomePageSettings.finalCtaSecondaryLabel,
    ),
    finalCtaSecondaryHref: coerceString(
      content.finalCtaSecondaryHref,
      defaultHomePageSettings.finalCtaSecondaryHref,
    ),
  };
}

export const getHomePageSettings = cache(async function getHomePageSettings() {
  if (!hasSupabaseConfig()) {
    return defaultHomePageSettings;
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return defaultHomePageSettings;
  }

  const { data, error } = await supabase
    .from("homepage_settings")
    .select("content")
    .eq("id", "default")
    .maybeSingle<HomePageSettingsRow>();

  if (error) {
    console.error("Supabase homepage settings query failed. Falling back to local defaults.", error);
    return defaultHomePageSettings;
  }

  return mergeHomePageSettings(data?.content);
});
