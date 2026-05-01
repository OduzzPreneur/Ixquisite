begin;

alter table public.wishlist_items add column if not exists selected_variant_slug text;
alter table public.cart_items add column if not exists product_id text;
alter table public.cart_items add column if not exists product_name text;
alter table public.cart_items add column if not exists variant_id text;
alter table public.cart_items add column if not exists variant_slug text;
alter table public.cart_items add column if not exists sku text;
alter table public.cart_items add column if not exists image text;

alter table public.wishlist_items drop constraint if exists wishlist_items_user_id_product_slug_key;
alter table public.wishlist_items drop constraint if exists wishlist_items_user_variant_key;
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'wishlist_items_user_variant_key'
  ) then
    alter table public.wishlist_items
      add constraint wishlist_items_user_variant_key
      unique (user_id, product_slug, selected_variant_slug);
  end if;
end $$;
drop index if exists wishlist_items_identity_idx;
create unique index if not exists wishlist_items_identity_idx
  on public.wishlist_items (user_id, product_slug, coalesce(selected_variant_slug, ''));

drop index if exists cart_items_identity_idx;
create unique index if not exists cart_items_identity_idx
  on public.cart_items (cart_id, coalesce(product_id, product_slug), coalesce(variant_id, selected_color, ''), coalesce(selected_size, ''));

with shirt_records as (
  select *
  from (
    values
      (
        'ivory-broadcloth-shirt',
        'Ivory Broadcloth Shirt',
        'shirts',
        'executive-essentials',
        42500,
        'stone',
        'A refined broadcloth shirt designed for clean tailoring and formal confidence.',
        'Cut for polished layering with a premium broadcloth finish that stays structured through long days.',
        ARRAY['Ivory','White','Champagne']::text[],
        '[{"label":"Ivory","value":"#F4EAD7","slug":"ivory","variantId":"ivory-broadcloth-ivory"},{"label":"White","value":"#F8F7F2","slug":"white","variantId":"ivory-broadcloth-white"},{"label":"Champagne","value":"#EAD8B8","slug":"champagne","variantId":"ivory-broadcloth-champagne"}]'::jsonb,
        '/products/shirts/ivory-broadcloth-shirt/ivory/main.webp',
        'Ivory Broadcloth Shirt in Ivory - main front view'
      ),
      (
        'executive-poplin-shirt',
        'Executive Poplin Shirt',
        'shirts',
        'executive-essentials',
        38500,
        'stone',
        'Crisp poplin shirting built for boardroom clarity and premium daily dressing.',
        'Designed for sharp formal layering with clean structure, breathable wear, and understated luxury styling.',
        ARRAY['White','Sky Blue','Black']::text[],
        '[{"label":"White","value":"#F8F7F2","slug":"white","variantId":"executive-poplin-white"},{"label":"Sky Blue","value":"#BFDDF8","slug":"sky-blue","variantId":"executive-poplin-sky-blue"},{"label":"Black","value":"#111111","slug":"black","variantId":"executive-poplin-black"}]'::jsonb,
        '/products/shirts/executive-poplin-shirt/white/main.webp',
        'Executive Poplin Shirt in White - main front view'
      ),
      (
        'slate-pinstripe-shirt',
        'Slate Pinstripe Shirt',
        'shirts',
        'boardroom-edit',
        45500,
        'slate',
        'A structured pinstripe shirt for understated authority and texture-rich tailoring.',
        'Designed for executive meetings and elevated formalwear, with refined pinstripes that stay subtle and premium.',
        ARRAY['Slate','Navy Stripe','Charcoal Stripe']::text[],
        '[{"label":"Slate","value":"#5F6468","slug":"slate","variantId":"slate-pinstripe-slate","swatchType":"image","swatchImage":"/products/shirts/slate-pinstripe-shirt/slate/swatch.webp"},{"label":"Navy Stripe","value":"#16213B","slug":"navy-stripe","variantId":"slate-pinstripe-navy-stripe","swatchType":"image","swatchImage":"/products/shirts/slate-pinstripe-shirt/navy-stripe/swatch.webp"},{"label":"Charcoal Stripe","value":"#2F3033","slug":"charcoal-stripe","variantId":"slate-pinstripe-charcoal-stripe","swatchType":"image","swatchImage":"/products/shirts/slate-pinstripe-shirt/charcoal-stripe/swatch.webp"}]'::jsonb,
        '/products/shirts/slate-pinstripe-shirt/slate/main.webp',
        'Slate Pinstripe Shirt in Slate - main front view'
      ),
      (
        'black-ceremony-shirt',
        'Black Ceremony Shirt',
        'shirts',
        'signature-neutrals',
        48500,
        'ink',
        'A ceremony-grade shirt with controlled drape for formal nights and statement tailoring.',
        'Built for black-tie and premium evening dressing with sharp collar lines and elevated finishing.',
        ARRAY['Black','Wine','Deep Navy']::text[],
        '[{"label":"Black","value":"#111111","slug":"black","variantId":"black-ceremony-black"},{"label":"Wine","value":"#5A1620","slug":"wine","variantId":"black-ceremony-wine"},{"label":"Deep Navy","value":"#101A33","slug":"deep-navy","variantId":"black-ceremony-deep-navy"}]'::jsonb,
        '/products/shirts/black-ceremony-shirt/black/main.webp',
        'Black Ceremony Shirt in Black - main front view'
      )
  ) as t(slug, title, category_slug, collection_slug, price, tone, blurb, description, colors, swatches, image_url, image_alt)
)
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
  image_alt
)
select
  slug,
  title,
  category_slug,
  collection_slug,
  price,
  tone,
  blurb,
  description,
  'Delivered in 2-4 days',
  'Contemporary tailored fit',
  colors,
  swatches,
  ARRAY['15','15.5','16','16.5','17']::text[],
  'In stock',
  ARRAY['Premium shirting fabric','Structured collar finish','Machine wash gentle']::text[],
  ARRAY['Premium shirting fabric','Contemporary tailored fit']::text[],
  4.8,
  20,
  ARRAY['regent-silk-tie','heirloom-accessory-set']::text[],
  40,
  true,
  false,
  image_url,
  image_alt
from shirt_records
on conflict (slug) do update
set
  title = excluded.title,
  category_slug = excluded.category_slug,
  collection_slug = excluded.collection_slug,
  price = excluded.price,
  tone = excluded.tone,
  blurb = excluded.blurb,
  description = excluded.description,
  colors = excluded.colors,
  swatches = excluded.swatches,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  updated_at = timezone('utc', now());

commit;
