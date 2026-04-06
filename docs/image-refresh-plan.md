# Ixquisite Image Refresh Plan (Preview First)

## Why this refresh
- Current system maps **45 visual slots to 11 photos**, so multiple pages feel repetitive.
- Goal: give each high-visibility slot a distinct premium image while preserving the current UX and layout.

## Visual thesis
- Premium menswear editorial: calm confidence, tailored precision, soft luxury lighting.
- Real-life context (boardroom, ceremony, travel) but uncluttered compositions.
- Strong single subject with room for overlaid UI copy.

## Rollout phases

### Phase 1: High-impact replacements (Preview set)
- Hero: Cocoa Ceremony Suit.
- Homepage category shortcuts: Suits, Shirts, Trousers, Ties, Accessories.
- Occasion row: Office, Executive, Wedding Guest.
- Collections: Boardroom Edit, Executive Essentials, Signature Neutrals.
- Product PDP hero anchors: Midnight Commander Suit, Ivory Broadcloth Shirt.
- Editorial cards: Brown Suit Guide, Shirt and Tie Guide.

### Phase 2: Product depth system
- For each core product, generate:
- `main` image (portrait)
- `detail` image (fabric/texture close-up)
- `styled` image (full outfit pairing)
- Total expected additions: 16 images.

### Phase 3: Lookbook + brand atmosphere
- Refresh lookbook trio with distinct narrative scenes.
- Replace repeated brand fallback with two atmosphere plates:
- `brand-atmosphere-boardroom.jpg`
- `brand-atmosphere-ceremony.jpg`

## Preview artifacts delivered
- Slot manifest with prompts and proposed filenames:
- `docs/image-refresh-manifest.preview.json`
- Visual preview board (current image + proposed replacement intent):
- `public/previews/image-refresh-preview.html`

## Approval checklist
- Composition fit for desktop and mobile crops.
- No awkward clipping under text overlays.
- No repeated faces in adjacent tiles.
- Premium tone consistency across hero, category, and product pages.

## After approval
- Generate selected Phase 1 assets.
- Integrate into `src/lib/visual-assets.ts` with versioned filenames.
- Ship and QA mobile + desktop render.
