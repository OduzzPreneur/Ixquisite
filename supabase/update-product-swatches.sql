begin;

alter table public.products add column if not exists swatches jsonb not null default '[]'::jsonb;

with swatch_updates (slug, swatches) as (
  values
    (
      'midnight-commander-suit',
      '[
        {"label":"Midnight Navy","value":"#244669","imageSrc":"/images/ixquisite/midnight-commander-suit.webp","imagePosition":"center 18%"},
        {"label":"Graphite","value":"#5a616a","imageSrc":"/images/ixquisite/midnight-commander-suit-styled.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'cocoa-double-breasted-suit',
      '[
        {"label":"Cocoa Brown","value":"#8b5b43","imageSrc":"/images/ixquisite/cocoa-double-breasted-suit.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'ivory-broadcloth-shirt',
      '[
        {"label":"Ivory","value":"#ebe1cf","imageSrc":"/images/ixquisite/ivory-broadcloth-shirt.webp","imagePosition":"center 18%"},
        {"label":"White","value":"#f5f3ed","imageSrc":"/images/ixquisite/ivory-broadcloth-shirt-styled.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'slate-pinstripe-shirt',
      '[
        {"label":"Slate Stripe","value":"#5f7282","imageSrc":"/images/ixquisite/slate-pinstripe-shirt.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'tailored-ink-trouser',
      '[
        {"label":"Ink","value":"#2b3442","imageSrc":"/images/ixquisite/tailored-ink-trouser.webp","imagePosition":"center 18%"},
        {"label":"Charcoal","value":"#3f434b","imageSrc":"/images/ixquisite/tailored-ink-trouser-styled.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'walnut-pleated-trouser',
      '[
        {"label":"Walnut","value":"#91684a","imageSrc":"/images/ixquisite/walnut-pleated-trouser.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'regent-silk-tie',
      '[
        {"label":"Midnight","value":"#244669","imageSrc":"/images/ixquisite/regent-silk-tie.webp","imagePosition":"center 18%"},
        {"label":"Wine","value":"#7b3348","imageSrc":"/images/ixquisite/regent-silk-tie-styled.webp","imagePosition":"center 18%"},
        {"label":"Black","value":"#232323","imageSrc":"/images/ixquisite/regent-silk-tie-detail.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'heirloom-accessory-set',
      '[
        {"label":"Ivory & Gold","value":"linear-gradient(135deg, #ebe1cf 0% 50%, #ba9a55 50% 100%)","imageSrc":"/images/ixquisite/heirloom-accessory-set.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-charcoal-windowpane-suit',
      '[
        {"label":"Charcoal Windowpane","value":"#3f434b","imageSrc":"/images/ixquisite/charcoal-windowpane-suit.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-midnight-velvet-smoking-jacket',
      '[
        {"label":"Midnight Velvet","value":"#244669","imageSrc":"/images/ixquisite/midnight-velvet-smoking-jacket.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-oxblood-dinner-jacket',
      '[
        {"label":"Oxblood","value":"#6d2030","imageSrc":"/images/ixquisite/oxblood-dinner-jacket.webp","imagePosition":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-forest-pinstripe-double-breasted-suit',
      '[
        {"label":"Forest Pinstripe","value":"#5a7746","imageSrc":"/images/ixquisite/forest-pinstripe-double-breasted-suit.webp","imagePosition":"center 18%"}
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
