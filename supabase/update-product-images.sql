begin;

with image_updates (slug, image_url, image_alt, image_position) as (
  values
    (
      'midnight-commander-suit',
      '/images/ixquisite/midnight-commander-suit.webp',
      'Royal blue double-breasted suit shown in a clean portrait crop.',
      'center 18%'
    ),
    (
      'cocoa-double-breasted-suit',
      '/images/ixquisite/cocoa-double-breasted-suit.webp',
      'Cocoa double-breasted suit in a strong editorial portrait.',
      'center 18%'
    ),
    (
      'ivory-broadcloth-shirt',
      '/images/ixquisite/ivory-broadcloth-shirt.webp',
      'Ivory broadcloth shirt layered into a clean tailored look.',
      'center 18%'
    ),
    (
      'slate-pinstripe-shirt',
      '/images/ixquisite/slate-pinstripe-shirt.webp',
      'Blue tailored styling used to represent the slate pinstripe shirt.',
      'center 18%'
    ),
    (
      'tailored-ink-trouser',
      '/images/ixquisite/tailored-ink-trouser.webp',
      'Dark formal tailoring used to represent the tailored ink trouser.',
      'center 18%'
    ),
    (
      'walnut-pleated-trouser',
      '/images/ixquisite/walnut-pleated-trouser.webp',
      'Warm-toned pleated trouser styling in a full-length tailored frame.',
      'center 18%'
    ),
    (
      'regent-silk-tie',
      '/images/ixquisite/regent-silk-tie.webp',
      'Close crop highlighting the regent silk tie in a formal look.',
      'center 18%'
    ),
    (
      'heirloom-accessory-set',
      '/images/ixquisite/heirloom-accessory-set.webp',
      'Accessory-led black formalwear detail for the heirloom set.',
      'center 18%'
    ),
    (
      'placeholder-charcoal-windowpane-suit',
      '/images/ixquisite/charcoal-windowpane-suit.webp',
      'Dark ceremony tailoring used to represent the charcoal windowpane suit.',
      'center 18%'
    ),
    (
      'placeholder-midnight-velvet-smoking-jacket',
      '/images/ixquisite/midnight-velvet-smoking-jacket.webp',
      'Dark formalwear detail used to represent the midnight velvet smoking jacket.',
      'center 18%'
    ),
    (
      'placeholder-oxblood-dinner-jacket',
      '/images/ixquisite/oxblood-dinner-jacket.webp',
      'Burgundy dinner jacket portrait with ceremony-ready polish.',
      'center 18%'
    ),
    (
      'placeholder-forest-pinstripe-double-breasted-suit',
      '/images/ixquisite/forest-pinstripe-double-breasted-suit.webp',
      'Forest double-breasted tailoring with a rich, modern formal silhouette.',
      'center 18%'
    )
)
update public.products as products
set
  image_url = image_updates.image_url,
  image_alt = image_updates.image_alt,
  image_position = image_updates.image_position,
  updated_at = timezone('utc', now())
from image_updates
where products.slug = image_updates.slug;

commit;

select
  slug,
  title,
  image_url,
  image_alt,
  image_position
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
