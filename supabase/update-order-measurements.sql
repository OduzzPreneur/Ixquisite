begin;

alter table public.orders add column if not exists measurement_status text not null default 'pending_measurements';
alter table public.orders add column if not exists measurement_notes text;
alter table public.orders add column if not exists measurements jsonb not null default '{}'::jsonb;

update public.orders
set
  measurement_status = coalesce(nullif(measurement_status, ''), 'pending_measurements'),
  measurements = coalesce(measurements, '{}'::jsonb)
where measurement_status is null
   or measurement_status = ''
   or measurements is null;

commit;

select
  id,
  reference,
  payment_status,
  measurement_status,
  measurement_notes,
  measurements
from public.orders
order by created_at desc
limit 10;
