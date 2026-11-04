-- Run against an EMPTY LOCAL database only: this fixture mocks Supabase auth and rolls back.
\set ON_ERROR_STOP on
begin;
create role anon;
create role authenticated;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema public, auth to anon, authenticated;
\ir ../migrations/001_user_data.sql
\ir ../migrations/20261104000000_sync_revisions.sql
grant select on public.user_data to authenticated;
insert into auth.users values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$ declare result jsonb; begin
  result := public.sync_learning(0, array['11111111-1111-1111-1111-111111111111'::uuid], '{"xp":30}', '{"name":"Ana"}');
  assert (result->>'accepted')::boolean, 'first event accepted';
  assert (result->'snapshot'->>'revision')::int = 1;
  result := public.sync_learning(1, array['11111111-1111-1111-1111-111111111111'::uuid], '{"xp":60}', '{}');
  assert not (result->>'accepted')::boolean, 'duplicate event rejected';
  assert jsonb_array_length(result->'applied') = 1;
  assert (result->'snapshot'->'progress'->>'xp')::int = 30, 'retry cannot award XP twice';
  result := public.sync_learning(0, array['22222222-2222-2222-2222-222222222222'::uuid], '{"xp":100}', '{}');
  assert not (result->>'accepted')::boolean, 'stale revision rejected';
  result := public.sync_learning(1, array['22222222-2222-2222-2222-222222222222'::uuid], '{"xp":60}', '{"name":"Ana"}');
  assert (result->>'accepted')::boolean, 'fresh revision accepted';
  assert not has_table_privilege('authenticated', 'public.user_data', 'update'), 'old snapshot writes disabled';
  assert not has_table_privilege('authenticated', 'public.learning_activity_receipts', 'insert'), 'receipts cannot be forged directly';
  assert not has_function_privilege('anon', 'public.sync_learning(bigint,uuid[],jsonb,jsonb)', 'execute'), 'anonymous calls denied';
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$ declare result jsonb; begin
  assert (select count(*) from public.user_data) = 0, 'RLS hides the other learner';
  result := public.sync_learning(0, array['11111111-1111-1111-1111-111111111111'::uuid], '{"xp":15}', '{"name":"Bea"}');
  assert (result->>'accepted')::boolean, 'receipts are scoped to the authenticated account';
  assert result->'snapshot'->>'user_id' = '00000000-0000-0000-0000-000000000002';
  assert (select count(*) from public.user_data) = 1;
end $$;
reset role;
rollback;
\echo 'SQL sync: revisions, receipts, account isolation, RLS and privileges passed.'
