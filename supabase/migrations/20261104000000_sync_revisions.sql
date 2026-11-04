-- Serialize sync writes and deduplicate activity retries. Existing data is retained.
alter table public.user_data add column if not exists revision bigint not null default 0;
create table if not exists public.learning_activity_receipts (
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_id uuid not null,
  primary key (user_id, activity_id)
);
alter table public.learning_activity_receipts enable row level security;
-- Receipts are accessed only by the authenticated, account-bound RPC.

create or replace function public.sync_learning(
  expected_revision bigint,
  activity_ids uuid[],
  next_progress jsonb,
  next_profile jsonb
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  owner uuid := auth.uid();
  current_row public.user_data;
  duplicates uuid[];
begin
  if owner is null then raise exception 'Authentication required'; end if;
  if cardinality(activity_ids) > 100 or jsonb_typeof(next_progress) <> 'object' or jsonb_typeof(next_profile) <> 'object' then
    raise exception 'Invalid sync payload';
  end if;
  insert into public.user_data(user_id) values (owner) on conflict do nothing;
  select * into current_row from public.user_data where user_id = owner for update;
  select coalesce(array_agg(activity_id), '{}'::uuid[]) into duplicates
    from public.learning_activity_receipts where user_id = owner and activity_id = any(activity_ids);
  if current_row.revision <> expected_revision or cardinality(duplicates) > 0 then
    return jsonb_build_object('accepted', false, 'applied', duplicates, 'snapshot', to_jsonb(current_row));
  end if;
  if cardinality(activity_ids) > 0 then
    insert into public.learning_activity_receipts(user_id, activity_id)
      select owner, id from (select distinct unnest(activity_ids) as id) ids;
    update public.user_data set progress = next_progress, profile = next_profile,
      revision = revision + 1, updated_at = now() where user_id = owner returning * into current_row;
  end if;
  return jsonb_build_object('accepted', true, 'applied', activity_ids, 'snapshot', to_jsonb(current_row));
end;
$$;
revoke all on function public.sync_learning(bigint, uuid[], jsonb, jsonb) from public, anon;
grant execute on function public.sync_learning(bigint, uuid[], jsonb, jsonb) to authenticated;
-- Old app versions must refresh rather than bypass revision checks with whole-row upserts.
drop policy if exists "Users insert their own data" on public.user_data;
drop policy if exists "Users update their own data" on public.user_data;
revoke insert, update, delete on public.user_data from anon, authenticated;

-- Polling/focus refresh still works when Realtime is unavailable.
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') and not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_data'
  ) then alter publication supabase_realtime add table public.user_data; end if;
end $$;
