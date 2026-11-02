-- Daily message counter for the AI tutor. No policies on purpose:
-- only the tutor Edge Function (service role) can read or write it.
create table if not exists public.tutor_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);

alter table public.tutor_usage enable row level security;
