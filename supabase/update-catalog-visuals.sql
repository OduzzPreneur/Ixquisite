begin;

alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists image_alt text;
alter table public.categories add column if not exists image_position text;

alter table public.occasions add column if not exists image_url text;
alter table public.occasions add column if not exists image_alt text;
alter table public.occasions add column if not exists image_position text;

alter table public.collections add column if not exists image_url text;
alter table public.collections add column if not exists image_alt text;
alter table public.collections add column if not exists image_position text;

with category_updates (slug, image_url, image_alt, image_position) as (
  values
    (
      'suits',
      '/images/ixquisite/tuxedo/ceremony-tuxedo-burgundy-front.webp',
      'Burgundy tuxedo with black lapels used as the suits category hero.',
      'center 14%'
    ),
    (
      'shirts',
      '/products/shirts/black-ceremony-shirt/black/main.webp',
      'Black Ceremony Shirt main view used as the shirts category spotlight.',
      'center 18%'
    ),
    (
      'trousers',
      '/images/ixquisite/walnut-pleated-trouser.webp',
      'Full-length tailoring shot showing clean trouser lines and soft structure.',
      'center 18%'
    ),
    (
      'ties',
      '/images/ixquisite/regent-silk-tie.webp',
      'Close crop of tie, lapel, and shirt textures in formalwear styling.',
      'center 18%'
    ),
    (
      'accessories',
      '/images/ixquisite/heirloom-accessory-set.webp',
      'Black formalwear detail with accessory-led styling and refined finishes.',
      'center 18%'
    )
)
update public.categories as categories
set
  image_url = category_updates.image_url,
  image_alt = category_updates.image_alt,
  image_position = category_updates.image_position,
  updated_at = timezone('utc', now())
from category_updates
where categories.slug = category_updates.slug;

with occasion_updates (slug, image_url, image_alt, image_position) as (
  values
    (
      'office',
      '/images/ixquisite/midnight-commander-suit-styled.webp',
      'Structured blue tailoring suited to office dressing and daily authority.',
      'center 24%'
    ),
    (
      'executive',
      '/images/ixquisite/midnight-commander-suit.webp',
      'Executive tailoring in a rich blue double-breasted silhouette.',
      'center 16%'
    ),
    (
      'wedding-guest',
      '/images/ixquisite/cocoa-double-breasted-suit-styled.webp',
      'Cocoa tailoring styled for polished wedding guest dressing.',
      'center 24%'
    ),
    (
      'black-tie',
      '/images/ixquisite/charcoal-windowpane-suit.webp',
      'Dark formal tailoring for black-tie and evening dressing.',
      'center 16%'
    ),
    (
      'business-travel',
      '/images/ixquisite/cocoa-double-breasted-suit-styled.webp',
      'Full-length tailoring with enough structure for polished travel days.',
      'center 24%'
    )
)
update public.occasions as occasions
set
  image_url = occasion_updates.image_url,
  image_alt = occasion_updates.image_alt,
  image_position = occasion_updates.image_position,
  updated_at = timezone('utc', now())
from occasion_updates
where occasions.slug = occasion_updates.slug;

with collection_updates (slug, image_url, image_alt, image_position) as (
  values
    (
      'boardroom-edit',
      '/images/ixquisite/midnight-commander-suit-styled.webp',
      'Boardroom collection image anchored by precise blue tailoring.',
      'center 18%'
    ),
    (
      'executive-essentials',
      '/images/ixquisite/ivory-broadcloth-shirt-styled.webp',
      'Executive wardrobe essentials centered on crisp shirting and tailoring.',
      'center 18%'
    ),
    (
      'signature-neutrals',
      '/images/ixquisite/cocoa-double-breasted-suit-detail.webp',
      'Warm neutral tailoring detail in cocoa and soft ceremony tones.',
      'center 18%'
    )
)
update public.collections as collections
set
  image_url = collection_updates.image_url,
  image_alt = collection_updates.image_alt,
  image_position = collection_updates.image_position,
  updated_at = timezone('utc', now())
from collection_updates
where collections.slug = collection_updates.slug;

commit;

select 'categories' as table_name, slug, title, image_url, image_alt, image_position
from public.categories
where slug in ('suits', 'shirts', 'trousers', 'ties', 'accessories')

union all

select 'occasions' as table_name, slug, title, image_url, image_alt, image_position
from public.occasions
where slug in ('office', 'executive', 'wedding-guest', 'black-tie', 'business-travel')

union all

select 'collections' as table_name, slug, title, image_url, image_alt, image_position
from public.collections
where slug in ('boardroom-edit', 'executive-essentials', 'signature-neutrals')

order by table_name, slug;
