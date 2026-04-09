begin;

alter table public.products add column if not exists swatches jsonb not null default '[]'::jsonb;

with swatch_updates (slug, swatches) as (
  values
    (
      'midnight-commander-suit',
      '[
        {"label":"Midnight Navy","value":"#244669"},
        {"label":"Graphite","value":"#5a616a"}
      ]'::jsonb
    ),
    (
      'cocoa-double-breasted-suit',
      '[
        {"label":"Cocoa Brown","value":"#8b5b43"}
      ]'::jsonb
    ),
    (
      'ivory-broadcloth-shirt',
      '[
        {"label":"Ivory","value":"#ebe1cf"},
        {"label":"White","value":"#f5f3ed"}
      ]'::jsonb
    ),
    (
      'slate-pinstripe-shirt',
      '[
        {"label":"Slate Stripe","value":"#5f7282"}
      ]'::jsonb
    ),
    (
      'tailored-ink-trouser',
      '[
        {"label":"Ink","value":"#2b3442"},
        {"label":"Charcoal","value":"#3f434b"}
      ]'::jsonb
    ),
    (
      'walnut-pleated-trouser',
      '[
        {"label":"Walnut","value":"#91684a"}
      ]'::jsonb
    ),
    (
      'regent-silk-tie',
      '[
        {"label":"Midnight","value":"#244669"},
        {"label":"Wine","value":"#7b3348"},
        {"label":"Black","value":"#232323"}
      ]'::jsonb
    ),
    (
      'heirloom-accessory-set',
      '[
        {"label":"Ivory & Gold","value":"linear-gradient(135deg, #ebe1cf 0% 50%, #ba9a55 50% 100%)"}
      ]'::jsonb
    ),
    (
      'placeholder-charcoal-windowpane-suit',
      '[
        {"label":"Charcoal Windowpane","value":"#3f434b"}
      ]'::jsonb
    ),
    (
      'placeholder-midnight-velvet-smoking-jacket',
      '[
        {"label":"Midnight Velvet","value":"#244669"}
      ]'::jsonb
    ),
    (
      'placeholder-oxblood-dinner-jacket',
      '[
        {"label":"Oxblood","value":"#6d2030"}
      ]'::jsonb
    ),
    (
      'placeholder-forest-pinstripe-double-breasted-suit',
      '[
        {"label":"Forest Pinstripe","value":"#5a7746"}
      ]'::jsonb
    )
)
update public.products as products
set
  swatches = swatch_updates.swatches,
  updated_at = timezone('utc', now())
from swatch_updates
where products.slug = swatch_updates.slug;

commit;

select
  slug,
  title,
  swatches
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
