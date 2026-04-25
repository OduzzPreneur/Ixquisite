import type { Metadata } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteChrome } from "@/components/site-shell";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const displayFont = localFont({
  src: [
    {
      path: "./fonts/CormorantGaramond[wght].ttf",
      style: "normal",
      weight: "300 700",
    },
    {
      path: "./fonts/CormorantGaramond-Italic[wght].ttf",
      style: "italic",
      weight: "300 700",
    },
  ],
  variable: "--font-display",
  display: "swap",
  preload: false,
  fallback: ["Georgia"],
});

const bodyFont = localFont({
  src: "./fonts/Manrope[wght].ttf",
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
  preload: false,
  fallback: ["Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description:
    "Shop premium men's suits, shirts, trousers, ties, accessories, and groom packages from Ixquisite. Quiet luxury menswear for work, weddings, ceremonies, and executive presence.",
  keywords: [...siteConfig.keywords],
  openGraph: {
    title: siteConfig.defaultTitle,
    description:
      "Shop premium men's suits, shirts, trousers, ties, accessories, and groom packages from Ixquisite. Quiet luxury menswear for work, weddings, ceremonies, and executive presence.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage.src,
        alt: siteConfig.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description:
      "Shop premium men's suits, shirts, trousers, ties, accessories, and groom packages from Ixquisite. Quiet luxury menswear for work, weddings, ceremonies, and executive presence.",
    images: [siteConfig.ogImage.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebsiteSchema()} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
