-- Per-device opt-in subscriptions. No tokens or keys are exposed to other learners.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique check (length(endpoint) <= 2048 and endpoint like 'https://%'),
  keys jsonb not null check (jsonb_typeof(keys) = 'object' and keys ? 'p256dh' and keys ? 'auth'),
  timezone text not null default 'Europe/Lisbon',
  remind_at time not null default '20:00',
  last_sent_date date,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "Learners manage their own reminders" on public.push_subscriptions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.push_subscriptions to authenticated;
revoke all on public.push_subscriptions from anon;

create or replace function public.validate_reminder_timezone() returns trigger
language plpgsql set search_path = '' as $$ begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.timezone) then raise exception 'Invalid reminder time zone'; end if;
  return new;
end $$;
create trigger validate_reminder_timezone before insert or update on public.push_subscriptions
for each row execute function public.validate_reminder_timezone();

-- Claim before delivery: one best-effort send attempt per local day, safe across concurrent cron runs.
create or replace function public.claim_due_reminders(batch_size integer default 100)
returns setof public.push_subscriptions language sql security definer set search_path = '' as $$
  with due as (
    select s.id, (now() at time zone s.timezone)::date as today
    from public.push_subscriptions s
    left join public.user_data u on u.user_id = s.user_id
    where s.last_sent_date is distinct from (now() at time zone s.timezone)::date
      and (now() at time zone s.timezone)::time >= s.remind_at
      and extract(epoch from (now() at time zone s.timezone)::time) - extract(epoch from s.remind_at) < 1800
      and not coalesce(u.progress->'activeDays', '[]'::jsonb) ? ((now() at time zone s.timezone)::date)::text
    order by s.created_at
    limit greatest(1, least(batch_size, 100))
    for update of s skip locked
  )
  update public.push_subscriptions s set last_sent_date = due.today from due where s.id = due.id returning s.*;
$$;
revoke all on function public.claim_due_reminders(integer) from public, anon, authenticated;
grant execute on function public.claim_due_reminders(integer) to service_role;
