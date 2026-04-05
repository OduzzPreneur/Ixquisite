insert into public.categories (slug, title, description, caption, tone, sort_order)
values
  ('suits', 'Suits', 'Sharp silhouettes for boardrooms, ceremonies, and polished evenings.', 'Signature tailoring', 'navy', 1),
  ('shirts', 'Shirts', 'Crisp shirting designed to sit cleanly under jackets or stand alone.', 'Refined layers', 'stone', 2),
  ('trousers', 'Trousers', 'Structured cuts with enough ease for long workdays and travel.', 'Everyday polish', 'ink', 3),
  ('ties', 'Ties', 'Silk accents that finish the uniform without noise.', 'Quiet details', 'gold', 4),
  ('accessories', 'Accessories', 'Pocket squares, cufflinks, belts, and finishing touches.', 'Final layer', 'espresso', 5)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  caption = excluded.caption,
  tone = excluded.tone,
  sort_order = excluded.sort_order;

insert into public.occasions (slug, title, description, tone, sort_order)
values
  ('office', 'Office', 'Measured tailoring for everyday authority and comfort.', 'navy', 1),
  ('executive', 'Executive', 'Boardroom-ready edits with stronger structure and finer finishing.', 'ink', 2),
  ('wedding-guest', 'Wedding Guest', 'Ceremony dressing with depth, warmth, and confident fit.', 'espresso', 3),
  ('black-tie', 'Black Tie', 'Evening pieces that stay formal without feeling generic.', 'slate', 4),
  ('business-travel', 'Business Travel', 'Low-maintenance essentials that still look executive on arrival.', 'stone', 5)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  tone = excluded.tone,
  sort_order = excluded.sort_order;

insert into public.collections (slug, title, description, tone, cta, sort_order)
values
  ('boardroom-edit', 'Boardroom Edit', 'A compact wardrobe of high-authority tailoring for meetings, pitches, and travel-heavy weeks.', 'navy', 'Explore the boardroom edit', 1),
  ('executive-essentials', 'Executive Essentials', 'White shirting, dependable suiting, and quiet accessories that remove guesswork from weekday dressing.', 'stone', 'Shop the essentials', 2),
  ('signature-neutrals', 'Signature Neutrals', 'Espresso, slate, and warm ivory tones for clients who prefer softer luxury over hard contrast.', 'espresso', 'View the neutrals', 3)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  tone = excluded.tone,
  cta = excluded.cta,
  sort_order = excluded.sort_order;

insert into public.products (
  slug, title, category_slug, collection_slug, price, tone, blurb, description, delivery, fit, colors, sizes, availability, details, complete_the_look, featured_rank, is_new, is_best_seller
)
values
  ('midnight-commander-suit', 'Midnight Commander Suit', 'suits', 'boardroom-edit', 189500, 'navy', 'A deep navy two-piece designed to hold structure from morning briefings to evening dinners.', 'Half-canvas tailoring, a clean shoulder, and subtle sheen make this the dependable hero of the wardrobe.', 'Delivered in 2-4 days', 'Structured slim fit', '{Midnight Navy,Graphite}', '{48,50,52,54,56}', 'In stock', '{Wool blend,Half-canvas front,Double vent,Dry clean only}', '{ivory-broadcloth-shirt,regent-silk-tie,heirloom-accessory-set}', 1, true, true),
  ('cocoa-double-breasted-suit', 'Cocoa Double-Breasted Suit', 'suits', 'signature-neutrals', 214000, 'espresso', 'Rich brown tailoring with ceremonial energy and a strong waistline.', 'Designed for weddings, celebrations, and standout entrances without losing elegance.', 'Delivered in 2-4 days', 'Tailored modern fit', '{Cocoa Brown}', '{48,50,52,54}', 'Low stock', '{Signature brown tone,Peak lapel,Fully lined,Dry clean only}', '{ivory-broadcloth-shirt,regent-silk-tie,heirloom-accessory-set}', 2, true, true),
  ('ivory-broadcloth-shirt', 'Ivory Broadcloth Shirt', 'shirts', 'executive-essentials', 36500, 'stone', 'A clean formal shirt with enough weight to stay sharp under tailored jackets.', 'Cut for polished layering, this shirt keeps its structure through full workdays.', 'Delivered in 2-4 days', 'Contemporary slim fit', '{Ivory,White}', '{15,15.5,16,16.5,17}', 'In stock', '{Broadcloth cotton,Semi-spread collar,Double-button cuff,Machine wash gentle}', '{midnight-commander-suit,regent-silk-tie}', 3, true, false),
  ('slate-pinstripe-shirt', 'Slate Pinstripe Shirt', 'shirts', 'boardroom-edit', 39900, 'slate', 'A subtle pinstripe shirt for professionals who want texture without flash.', 'Designed for client meetings, travel, and layered office dressing.', 'Delivered in 2-4 days', 'Regular tailored fit', '{Slate Stripe}', '{15,15.5,16,16.5}', 'In stock', '{Cotton stretch blend,Structured collar,French placket,Machine wash gentle}', '{midnight-commander-suit,regent-silk-tie}', 4, false, false),
  ('tailored-ink-trouser', 'Tailored Ink Trouser', 'trousers', 'executive-essentials', 48200, 'ink', 'Cleanly tapered trousers that balance comfort and sharp lines through long schedules.', 'Built to pair seamlessly with navy and charcoal suiting or polished shirting.', 'Delivered in 2-4 days', 'Tapered fit', '{Ink,Charcoal}', '{32,34,36,38,40}', 'In stock', '{Wool touch fabric,Side adjusters,Pressed crease,Dry clean only}', '{ivory-broadcloth-shirt,heirloom-accessory-set}', 5, false, false),
  ('walnut-pleated-trouser', 'Walnut Pleated Trouser', 'trousers', 'signature-neutrals', 51500, 'espresso', 'A softer formal trouser with extra ease for warmer days and dressy weekends.', 'Pleated front styling brings depth while keeping the line refined.', 'Delivered in 2-4 days', 'Relaxed tailored fit', '{Walnut}', '{32,34,36,38}', 'In stock', '{Pleated front,Extended waistband,Side pockets,Dry clean only}', '{ivory-broadcloth-shirt,regent-silk-tie}', 6, false, false),
  ('regent-silk-tie', 'Regent Silk Tie', 'ties', 'boardroom-edit', 18500, 'navy', 'A silk tie with restrained luster and the weight to knot cleanly every time.', 'Designed to pair with both formal suiting and lighter celebratory tailoring.', 'Delivered in 2-4 days', 'Standard width', '{Midnight,Wine,Black}', '{One size}', 'In stock', '{Pure silk,Self tipping,7.5 cm blade,Dry clean only}', '{midnight-commander-suit,ivory-broadcloth-shirt}', 7, false, true),
  ('heirloom-accessory-set', 'Heirloom Accessory Set', 'accessories', 'signature-neutrals', 26500, 'gold', 'A coordinated set of pocket square, cufflinks, and lapel pin for polished finishing.', 'Built to add formality without overstatement, especially for suits in navy and cocoa tones.', 'Delivered in 2-4 days', 'One set', '{Ivory & Gold}', '{One size}', 'In stock', '{Pocket square,Cufflinks,Lapel pin,Gift-ready case}', '{cocoa-double-breasted-suit,ivory-broadcloth-shirt}', 8, false, false)
on conflict (slug) do update set
  title = excluded.title,
  category_slug = excluded.category_slug,
  collection_slug = excluded.collection_slug,
  price = excluded.price,
  tone = excluded.tone,
  blurb = excluded.blurb,
  description = excluded.description,
  delivery = excluded.delivery,
  fit = excluded.fit,
  colors = excluded.colors,
  sizes = excluded.sizes,
  availability = excluded.availability,
  details = excluded.details,
  complete_the_look = excluded.complete_the_look,
  featured_rank = excluded.featured_rank,
  is_new = excluded.is_new,
  is_best_seller = excluded.is_best_seller;

insert into public.product_occasions (product_slug, occasion_slug)
values
  ('midnight-commander-suit', 'office'),
  ('midnight-commander-suit', 'executive'),
  ('midnight-commander-suit', 'business-travel'),
  ('cocoa-double-breasted-suit', 'wedding-guest'),
  ('cocoa-double-breasted-suit', 'black-tie'),
  ('ivory-broadcloth-shirt', 'office'),
  ('ivory-broadcloth-shirt', 'executive'),
  ('ivory-broadcloth-shirt', 'wedding-guest'),
  ('slate-pinstripe-shirt', 'office'),
  ('slate-pinstripe-shirt', 'business-travel'),
  ('tailored-ink-trouser', 'office'),
  ('tailored-ink-trouser', 'business-travel'),
  ('walnut-pleated-trouser', 'wedding-guest'),
  ('walnut-pleated-trouser', 'business-travel'),
  ('regent-silk-tie', 'office'),
  ('regent-silk-tie', 'executive'),
  ('regent-silk-tie', 'wedding-guest'),
  ('regent-silk-tie', 'black-tie'),
  ('heirloom-accessory-set', 'executive'),
  ('heirloom-accessory-set', 'wedding-guest'),
  ('heirloom-accessory-set', 'black-tie')
on conflict (product_slug, occasion_slug) do nothing;

insert into public.articles (slug, title, description, tone, reading_time, category, body, sort_order)
values
  ('how-to-style-a-brown-suit', 'How to Style a Brown Suit Without Losing Formality', 'A sharper approach to brown tailoring for weddings, dinners, and executive events.', 'espresso', '5 min read', 'Styling', 'Use warm neutrals, a clean ivory shirt, and one controlled accessory accent to keep brown tailoring formal.', 1),
  ('shirt-and-tie-combinations', 'Shirt and Tie Combinations That Always Look Expensive', 'Three dependable pairings that remove the usual guesswork from weekday dressing.', 'navy', '4 min read', 'Guides', 'The safest pairings are high contrast, controlled texture, and one anchor colour that does not fight the suit.', 2),
  ('professional-wardrobe-essentials', 'The Professional Wardrobe Essentials Worth Buying First', 'A compact formula for building a polished corporate wardrobe without overbuying.', 'stone', '6 min read', 'Wardrobe Planning', 'Start with one navy suit, two formal shirts, one reliable trouser, and restrained finishing pieces.', 3)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  tone = excluded.tone,
  reading_time = excluded.reading_time,
  category = excluded.category,
  body = excluded.body,
  sort_order = excluded.sort_order;

insert into public.lookbook_looks (slug, title, description, tone, product_slugs, sort_order)
values
  ('boardroom-quiet-luxury', 'Boardroom Quiet Luxury', 'Midnight tailoring, ivory shirting, and one gold accent.', 'navy', '{midnight-commander-suit,ivory-broadcloth-shirt,regent-silk-tie}', 1),
  ('ceremony-in-cocoa', 'Ceremony in Cocoa', 'Double-breasted suiting styled for warm-weather celebrations.', 'espresso', '{cocoa-double-breasted-suit,ivory-broadcloth-shirt,heirloom-accessory-set}', 2),
  ('travel-day-precision', 'Travel Day Precision', 'Layered neutrals designed to stay sharp from airport to meeting.', 'slate', '{slate-pinstripe-shirt,tailored-ink-trouser,regent-silk-tie}', 3)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  tone = excluded.tone,
  product_slugs = excluded.product_slugs,
  sort_order = excluded.sort_order;
