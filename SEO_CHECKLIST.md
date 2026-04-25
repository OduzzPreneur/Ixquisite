# SEO Checklist

## Implemented
- Central SEO configuration in `src/lib/site.ts` using `NEXT_PUBLIC_SITE_URL`
- Shared metadata helpers in `src/lib/seo.ts`
- Global metadata, Open Graph, Twitter, `Organization`, and `WebSite` schema in `src/app/layout.tsx`
- Dynamic route metadata and canonical URLs for homepage, product, category, collection, occasion, groom package, Style Guide index, Style Guide articles, and key public support pages
- Dynamic `sitemap.xml` in `src/app/sitemap.ts`
- Dynamic `robots.txt` in `src/app/robots.ts`
- `Product`, `BreadcrumbList`, `Article`, and `FAQPage` schema where applicable
- Noindex metadata for private or low-value routes such as account, admin, cart, checkout, auth, wishlist, track-order, order-confirmation, and wedding inquiry
- Homepage SEO heading and support copy improvements without redesigning the hero
- Category intros and related internal links
- Product page internal links and richer visible content structure
- Groom package FAQ section, FAQ schema, and stronger internal linking
- Style Guide article content rewritten from placeholder/demo copy to real editorial copy
- Swatch accessibility labels and descriptive CTA aria labels improved on product cards and PDP
- Meaningful alt text improvements on key branded imagery and logo
- Placeholder products excluded from public merchandising routes and sitemap entries

## Manual Tasks After Deployment
1. Deploy the latest version to Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production domain.
3. Open `/sitemap.xml` and confirm all expected public pages are present.
4. Open `/robots.txt` and confirm the disallow rules and sitemap URL are correct.
5. Test homepage metadata in the rendered HTML.
6. Test a product page metadata block and canonical URL.
7. Test category, groom package, and Style Guide article metadata.
8. Test product schema in Google Rich Results Test.
9. Test groom package FAQ schema in Google Rich Results Test.
10. Add the site to Google Search Console.
11. Verify domain ownership.
12. Submit the sitemap.
13. Inspect the homepage URL in Search Console.
14. Request indexing for the homepage.
15. Request indexing for the main category pages.
16. Request indexing for product pages.
17. Request indexing for the groom package page.
18. Monitor the indexing report and search performance.

## Remaining Recommendations
- Connect the final custom domain and update `NEXT_PUBLIC_SITE_URL`.
- Add a dedicated final Open Graph image if a higher-quality branded crop becomes available.
- Add real customer reviews only when verified review data exists.
- Expand the Style Guide with additional polished editorial articles over time.
- Continue improving product photography coverage for every swatch and gallery view.
- Add a Google Business Profile when verified business details are ready.
- Publish definitive shipping, returns, and policy language if legal or operations teams provide stricter wording.

## Custom Domain Note
- When the final domain is connected, update `NEXT_PUBLIC_SITE_URL`.
- Resubmit the sitemap in Google Search Console after the domain switch.
