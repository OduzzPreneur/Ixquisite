begin;

insert into public.homepage_settings (id, content)
values (
  'default',
  jsonb_build_object(
    'heroTitle', ''
  )
)
on conflict (id) do update
set
  content = coalesce(public.homepage_settings.content, '{}'::jsonb) || excluded.content,
  updated_at = timezone('utc', now());

commit;

select
  id,
  content ->> 'heroTitle' as hero_title
from public.homepage_settings
where id = 'default';
