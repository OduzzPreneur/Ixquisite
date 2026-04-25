begin;

insert into public.homepage_settings (id, content)
values (
  'default',
  jsonb_build_object(
    'heroNoteTitle', '',
    'heroNoteCopy', ''
  )
)
on conflict (id) do update
set
  content = coalesce(public.homepage_settings.content, '{}'::jsonb) || excluded.content,
  updated_at = timezone('utc', now());

commit;

select
  id,
  content ->> 'heroNoteTitle' as hero_note_title,
  content ->> 'heroNoteCopy' as hero_note_copy
from public.homepage_settings
where id = 'default';
