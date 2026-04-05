import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteChrome } from "@/components/site-shell";
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
  fallback: ["Georgia"],
});

const bodyFont = localFont({
  src: "./fonts/Manrope[wght].ttf",
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
  fallback: ["Arial"],
});

export const metadata: Metadata = {
  title: "Ixquisite Menswear",
  description:
    "Premium menswear for professionals who want sharp tailoring without the search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
