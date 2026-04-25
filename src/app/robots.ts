import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/category/", "/collection/", "/collections", "/occasion/", "/occasions", "/product/", "/groom-package", "/style-guide", "/about", "/contact", "/best-sellers", "/new-in", "/lookbook"],
        disallow: [
          "/admin",
          "/api",
          "/account",
          "/checkout",
          "/cart",
          "/wishlist",
          "/search",
          "/sign-in",
          "/create-account",
          "/forgot-password",
          "/update-password",
          "/order-confirmation",
          "/track-order",
          "/private",
          "/draft",
          "/test",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
