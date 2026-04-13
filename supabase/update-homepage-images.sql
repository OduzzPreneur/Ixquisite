begin;

insert into public.homepage_settings (id, content)
values (
  'default',
  jsonb_build_object(
    'heroVisualTitle', 'Oxblood Dinner Jacket',
    'heroVisualSrc', '/images/ixquisite/burgundy-ceremony-jacket-portrait-02.webp',
    'heroVisualAlt', 'Model in a burgundy ceremony jacket with black lapels and a groom-ready finish.',
    'heroVisualPosition', 'center 12%',
    'groomFeatureImageTitle', 'Groomsmen Coordination',
    'groomFeatureImageSrc', '/images/ixquisite/groomsmen-suit-group.webp',
    'groomFeatureImageAlt', 'Coordinated groom and groomsmen tailoring in a ceremony lineup.',
    'groomFeatureImagePosition', 'center 24%'
  )
)
on conflict (id) do update
set
  content = coalesce(public.homepage_settings.content, '{}'::jsonb) || excluded.content,
  updated_at = timezone('utc', now());

commit;

select
  id,
  content ->> 'heroVisualTitle' as hero_visual_title,
  content ->> 'heroVisualSrc' as hero_visual_src,
  content ->> 'heroVisualAlt' as hero_visual_alt,
  content ->> 'heroVisualPosition' as hero_visual_position,
  content ->> 'groomFeatureImageTitle' as groom_feature_image_title,
  content ->> 'groomFeatureImageSrc' as groom_feature_image_src,
  content ->> 'groomFeatureImageAlt' as groom_feature_image_alt,
  content ->> 'groomFeatureImagePosition' as groom_feature_image_position
from public.homepage_settings
where id = 'default';
