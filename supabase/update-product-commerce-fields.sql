begin;

alter table public.products add column if not exists card_features text[] not null default '{}';
alter table public.products add column if not exists rating_value numeric(2,1) not null default 4.8;
alter table public.products add column if not exists review_count integer not null default 0;

with commerce_updates (slug, card_features, rating_value, review_count) as (
  values
    ('midnight-commander-suit', array['Structured slim fit', 'Half-canvas front'], 4.9, 48),
    ('cocoa-double-breasted-suit', array['Tailored modern fit', 'Fully lined'], 4.8, 31),
    ('ivory-broadcloth-shirt', array['Broadcloth cotton', 'Semi-spread collar'], 4.7, 26),
    ('slate-pinstripe-shirt', array['Regular tailored fit', 'Cotton stretch blend'], 4.6, 18),
    ('tailored-ink-trouser', array['Tapered fit', 'Side adjusters'], 4.7, 22),
    ('walnut-pleated-trouser', array['Pleated front', 'Relaxed tailored fit'], 4.6, 16),
    ('regent-silk-tie', array['Pure silk', 'Standard width'], 4.9, 64),
    ('heirloom-accessory-set', array['Gift-ready case', 'Formal finishing set'], 4.8, 19),
    ('placeholder-charcoal-windowpane-suit', array['Windowpane pattern', 'Tailored modern fit'], 4.7, 12),
    ('placeholder-midnight-velvet-smoking-jacket', array['Velvet cloth', 'Satin lapel'], 4.8, 9),
    ('placeholder-oxblood-dinner-jacket', array['Contrast lapel', 'Structured evening fit'], 4.7, 11),
    ('placeholder-forest-pinstripe-double-breasted-suit', array['Pinstripe finish', 'Structured slim fit'], 4.8, 14)
)
update public.products as products
set
  card_features = commerce_updates.card_features,
  rating_value = commerce_updates.rating_value,
  review_count = commerce_updates.review_count,
  updated_at = timezone('utc', now())
from commerce_updates
where products.slug = commerce_updates.slug;

commit;

select
  slug,
  title,
  card_features,
  rating_value,
  review_count
from public.products
where slug in (
  'midnight-commander-suit',
  'cocoa-double-breasted-suit',
  'ivory-broadcloth-shirt',
  'slate-pinstripe-shirt',
  'tailored-ink-trouser',
  'walnut-pleated-trouser',
  'regent-silk-tie',
  'heirloom-accessory-set',
  'placeholder-charcoal-windowpane-suit',
  'placeholder-midnight-velvet-smoking-jacket',
  'placeholder-oxblood-dinner-jacket',
  'placeholder-forest-pinstripe-double-breasted-suit'
)
order by slug;
