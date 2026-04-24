begin;

alter table public.products add column if not exists swatches jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists gallery_images jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists card_features text[] not null default '{}';
alter table public.products add column if not exists rating_value numeric(2,1) not null default 4.8;
alter table public.products add column if not exists review_count integer not null default 0;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists image_alt text;
alter table public.products add column if not exists image_position text;

insert into public.products (
  slug,
  title,
  category_slug,
  collection_slug,
  price,
  tone,
  blurb,
  description,
  delivery,
  fit,
  colors,
  swatches,
  sizes,
  availability,
  details,
  card_features,
  rating_value,
  review_count,
  complete_the_look,
  featured_rank,
  is_new,
  is_best_seller,
  image_url,
  image_alt,
  image_position,
  gallery_images
)
values (
  'signature-ceremony-tuxedo',
  'Signature Ceremony Tuxedo',
  'suits',
  'signature-neutrals',
  268000,
  'espresso',
  'A ceremony-first tuxedo offered in burgundy, midnight navy, and charcoal grey with a sharper evening finish.',
  'Built for black-tie rooms, wedding entrances, and reception dressing with black lapels, structured tailoring, and a controlled formal line.',
  'Delivered in 2-4 days',
  'Structured evening fit',
  array['Burgundy', 'Midnight Navy', 'Charcoal Grey'],
  '[
    {"label":"Burgundy","value":"#7b2438","imageSrc":"/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp","imagePosition":"center 14%"},
    {"label":"Midnight Navy","value":"#245179","imageSrc":"/images/ixquisite/tuxedo/ceremony-tuxedo-navy-front.webp","imagePosition":"center 14%"},
    {"label":"Charcoal Grey","value":"#5a616a","imageSrc":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp","imagePosition":"center 14%"}
  ]'::jsonb,
  array['48', '50', '52', '54', '56'],
  'In stock',
  array['Contrast satin lapel', 'Eveningwear structure', 'Formal waistcoat styling', 'Dry clean only'],
  array['Contrast lapel', 'Structured evening fit'],
  4.9,
  17,
  array['ivory-broadcloth-shirt', 'heirloom-accessory-set'],
  9,
  true,
  false,
  '/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp',
  'Signature Ceremony Tuxedo in burgundy with black lapels and formal finishing.',
  'center 14%',
  '[
    {"label":"Front view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp","alt":"Burgundy tuxedo front view with black lapels and evening waistcoat.","position":"center 14%","swatchLabel":"Burgundy"},
    {"label":"Profile view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-profile.webp","alt":"Burgundy tuxedo portrait with a clean side stance.","position":"center 14%","swatchLabel":"Burgundy"},
    {"label":"Detail view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-detail.webp","alt":"Burgundy tuxedo detail with lapel, boutonniere, and chain accent.","position":"center 16%","swatchLabel":"Burgundy"},
    {"label":"Full look","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-full.webp","alt":"Full-length burgundy tuxedo styling for ceremony dressing.","position":"center 14%","swatchLabel":"Burgundy"},
    {"label":"Front view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-navy-front.webp","alt":"Midnight navy tuxedo front view with a formal black bow tie.","position":"center 14%","swatchLabel":"Midnight Navy"},
    {"label":"Adjusting jacket","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-navy-adjusting.webp","alt":"Midnight navy tuxedo while adjusting the jacket front.","position":"center 14%","swatchLabel":"Midnight Navy"},
    {"label":"Detail view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-navy-detail.webp","alt":"Midnight navy tuxedo detail showing lapels and formal finishing.","position":"center 16%","swatchLabel":"Midnight Navy"},
    {"label":"Portrait view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-navy-portrait.webp","alt":"Midnight navy tuxedo portrait in a refined ceremony pose.","position":"center 14%","swatchLabel":"Midnight Navy"},
    {"label":"Front view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp","alt":"Charcoal grey tuxedo front view with black evening lapels.","position":"center 14%","swatchLabel":"Charcoal Grey"},
    {"label":"Detail view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-detail.webp","alt":"Charcoal grey tuxedo detail with boutonniere and jacket finish.","position":"center 16%","swatchLabel":"Charcoal Grey"},
    {"label":"Portrait view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-portrait.webp","alt":"Charcoal grey tuxedo portrait with a sharper black-tie stance.","position":"center 14%","swatchLabel":"Charcoal Grey"},
    {"label":"Full look","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-stance.webp","alt":"Charcoal grey tuxedo styled for a formal evening entrance.","position":"center 14%","swatchLabel":"Charcoal Grey"}
  ]'::jsonb
)
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
  swatches = excluded.swatches,
  sizes = excluded.sizes,
  availability = excluded.availability,
  details = excluded.details,
  card_features = excluded.card_features,
  rating_value = excluded.rating_value,
  review_count = excluded.review_count,
  complete_the_look = excluded.complete_the_look,
  featured_rank = excluded.featured_rank,
  is_new = excluded.is_new,
  is_best_seller = excluded.is_best_seller,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  image_position = excluded.image_position,
  gallery_images = excluded.gallery_images,
  updated_at = timezone('utc', now());

insert into public.products (
  slug,
  title,
  category_slug,
  collection_slug,
  price,
  tone,
  blurb,
  description,
  delivery,
  fit,
  colors,
  swatches,
  sizes,
  availability,
  details,
  card_features,
  rating_value,
  review_count,
  complete_the_look,
  featured_rank,
  is_new,
  is_best_seller,
  image_url,
  image_alt,
  image_position,
  gallery_images
)
values (
  'black-tie-reserve-tuxedo',
  'Black-Tie Reserve Tuxedo',
  'suits',
  'signature-neutrals',
  259000,
  'slate',
  'A darker charcoal tuxedo built for formal rooms, evening ceremonies, and quieter black-tie dressing.',
  'Cut with a controlled formal silhouette, black satin lapels, and a cleaner grey base for clients who want black-tie authority without a louder colour statement.',
  'Delivered in 2-4 days',
  'Structured evening fit',
  array['Charcoal Grey'],
  '[
    {"label":"Charcoal Grey","value":"#5a616a","imageSrc":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp","imagePosition":"center 14%"}
  ]'::jsonb,
  array['48', '50', '52', '54', '56'],
  'In stock',
  array['Contrast satin lapel', 'Formal evening structure', 'Black-tie trouser finish', 'Dry clean only'],
  array['Black-tie authority', 'Structured evening fit'],
  4.8,
  11,
  array['ivory-broadcloth-shirt', 'heirloom-accessory-set'],
  10,
  true,
  false,
  '/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp',
  'Black-Tie Reserve Tuxedo in charcoal grey with black evening lapels.',
  'center 14%',
  '[
    {"label":"Front view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-front.webp","alt":"Charcoal grey tuxedo front view with black evening lapels.","position":"center 14%","swatchLabel":"Charcoal Grey"},
    {"label":"Detail view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-detail.webp","alt":"Charcoal grey tuxedo detail with boutonniere and jacket finish.","position":"center 16%","swatchLabel":"Charcoal Grey"},
    {"label":"Portrait view","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-portrait.webp","alt":"Charcoal grey tuxedo portrait with a sharper black-tie stance.","position":"center 14%","swatchLabel":"Charcoal Grey"},
    {"label":"Full look","src":"/images/ixquisite/tuxedo/ceremony-tuxedo-charcoal-stance.webp","alt":"Charcoal grey tuxedo styled for a formal evening entrance.","position":"center 14%","swatchLabel":"Charcoal Grey"}
  ]'::jsonb
)
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
  swatches = excluded.swatches,
  sizes = excluded.sizes,
  availability = excluded.availability,
  details = excluded.details,
  card_features = excluded.card_features,
  rating_value = excluded.rating_value,
  review_count = excluded.review_count,
  complete_the_look = excluded.complete_the_look,
  featured_rank = excluded.featured_rank,
  is_new = excluded.is_new,
  is_best_seller = excluded.is_best_seller,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  image_position = excluded.image_position,
  gallery_images = excluded.gallery_images,
  updated_at = timezone('utc', now());

insert into public.product_occasions (product_slug, occasion_slug)
values
  ('signature-ceremony-tuxedo', 'black-tie'),
  ('signature-ceremony-tuxedo', 'wedding-guest'),
  ('black-tie-reserve-tuxedo', 'black-tie'),
  ('black-tie-reserve-tuxedo', 'wedding-guest')
on conflict (product_slug, occasion_slug) do nothing;

commit;

select
  slug,
  title,
  category_slug,
  colors,
  swatches,
  gallery_images
from public.products
where slug in ('signature-ceremony-tuxedo', 'black-tie-reserve-tuxedo')
order by slug;
