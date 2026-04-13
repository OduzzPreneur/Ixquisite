begin;

alter table public.products add column if not exists gallery_images jsonb not null default '[]'::jsonb;

with gallery_updates (slug, gallery_images) as (
  values
    (
      'midnight-commander-suit',
      '[
        {"label":"Front view","src":"/images/ixquisite/midnight-commander-suit.webp","alt":"Royal blue double-breasted suit shown in a clean portrait crop.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/midnight-commander-suit-styled.webp","alt":"Styled blue tailoring shot for the Midnight Commander Suit.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/midnight-commander-suit-detail.webp","alt":"Close tailoring detail from the Midnight Commander Suit.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'cocoa-double-breasted-suit',
      '[
        {"label":"Front view","src":"/images/ixquisite/cocoa-double-breasted-suit.webp","alt":"Cocoa double-breasted suit in a strong editorial portrait.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/cocoa-double-breasted-suit-styled.webp","alt":"Full-length styling of the cocoa double-breasted suit.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/cocoa-double-breasted-suit-detail.webp","alt":"Close detail of the cocoa suit''s lapel, tie, and shirt pairing.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'ivory-broadcloth-shirt',
      '[
        {"label":"Front view","src":"/images/ixquisite/ivory-broadcloth-shirt.webp","alt":"Ivory broadcloth shirt layered into a clean tailored look.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/ivory-broadcloth-shirt-styled.webp","alt":"Styled ceremony look featuring the ivory broadcloth shirt.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/ivory-broadcloth-shirt-detail.webp","alt":"Detail crop of shirting and lapel textures for the ivory broadcloth shirt.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'slate-pinstripe-shirt',
      '[
        {"label":"Front view","src":"/images/ixquisite/slate-pinstripe-shirt.webp","alt":"Blue tailored styling used to represent the slate pinstripe shirt.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/slate-pinstripe-shirt-styled.webp","alt":"Styled product image for the slate pinstripe shirt.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/slate-pinstripe-shirt-detail.webp","alt":"Pinstripe-inspired tailoring detail for the slate shirt product view.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'tailored-ink-trouser',
      '[
        {"label":"Front view","src":"/images/ixquisite/tailored-ink-trouser.webp","alt":"Dark formal tailoring used to represent the tailored ink trouser.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/tailored-ink-trouser-styled.webp","alt":"Full-length styling for the tailored ink trouser.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/tailored-ink-trouser-detail.webp","alt":"Trouser and jacket detail for the tailored ink trouser styling.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'walnut-pleated-trouser',
      '[
        {"label":"Front view","src":"/images/ixquisite/walnut-pleated-trouser.webp","alt":"Warm-toned pleated trouser styling in a full-length tailored frame.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/walnut-pleated-trouser-styled.webp","alt":"Styled warm tailoring image for the walnut pleated trouser.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/walnut-pleated-trouser-detail.webp","alt":"Close detail of warm tailoring textures for the walnut pleated trouser.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'regent-silk-tie',
      '[
        {"label":"Front view","src":"/images/ixquisite/regent-silk-tie.webp","alt":"Close crop highlighting the Regent Silk Tie in a formal look.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/regent-silk-tie-styled.webp","alt":"Styled tailored composition used for the Regent Silk Tie.","position":"center 18%"},
        {"label":"Fabric detail","src":"/images/ixquisite/regent-silk-tie-detail.webp","alt":"Detailed tie and lapel texture for the Regent Silk Tie.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'heirloom-accessory-set',
      '[
        {"label":"Front view","src":"/images/ixquisite/heirloom-accessory-set.webp","alt":"Accessory-led black formalwear detail for the heirloom set.","position":"center 18%"},
        {"label":"Styled look","src":"/images/ixquisite/heirloom-accessory-set-styled.webp","alt":"Styled black formalwear image for the heirloom accessory set.","position":"center 18%"},
        {"label":"Detail","src":"/images/ixquisite/heirloom-accessory-set-detail.webp","alt":"Detailed black formalwear accessory textures for the heirloom set.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-charcoal-windowpane-suit',
      '[
        {"label":"Front view","src":"/images/ixquisite/charcoal-windowpane-suit.webp","alt":"Dark ceremony tailoring used to represent the charcoal windowpane suit.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-midnight-velvet-smoking-jacket',
      '[
        {"label":"Front view","src":"/images/ixquisite/midnight-velvet-smoking-jacket.webp","alt":"Dark formalwear detail used to represent the midnight velvet smoking jacket.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-oxblood-dinner-jacket',
      '[
        {"label":"Front view","src":"/images/ixquisite/oxblood-dinner-jacket.webp","alt":"Burgundy dinner jacket portrait with ceremony-ready polish.","position":"center 18%"}
      ]'::jsonb
    ),
    (
      'placeholder-forest-pinstripe-double-breasted-suit',
      '[
        {"label":"Front view","src":"/images/ixquisite/forest-pinstripe-double-breasted-suit.webp","alt":"Forest double-breasted tailoring with a rich, modern formal silhouette.","position":"center 18%"}
      ]'::jsonb
    )
)
update public.products as products
set
  gallery_images = gallery_updates.gallery_images,
  updated_at = timezone('utc', now())
from gallery_updates
where products.slug = gallery_updates.slug;

commit;

select slug, title, gallery_images
from public.products
where gallery_images <> '[]'::jsonb
order by slug;
