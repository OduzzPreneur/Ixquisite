import type { Metadata } from "next";
import { absoluteUrl, pathWithLeadingSlash, siteConfig } from "@/lib/site";

type MetadataImage = {
  src: string;
  alt?: string;
};

type BuildMetadataInput = {
  title?: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: MetadataImage;
  type?: "website" | "article";
  noIndex?: boolean;
};

function buildTitle(title?: string) {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
}

function buildImages(image?: MetadataImage) {
  const resolved = image ?? siteConfig.ogImage;

  return [
    {
      url: absoluteUrl(resolved.src),
      alt: resolved.alt ?? siteConfig.ogImage.alt,
    },
  ];
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [...siteConfig.keywords],
  image,
  type = "website",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const canonical = path ? pathWithLeadingSlash(path) : undefined;
  const fullTitle = buildTitle(title);
  const images = buildImages(image);

  return {
    title,
    description,
    keywords,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(canonical ?? "/"),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((item) => item.url),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  };
}

export function buildNoIndexMetadata(title: string, description: string, path?: string): Metadata {
  return buildMetadata({
    title,
    description,
    path,
    noIndex: true,
  });
}
