-- EMPTY LOCAL database only. Mock Auth and roll back all fixture data.
\set ON_ERROR_STOP on
begin;
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema public, auth to anon, authenticated, service_role;
\ir ../migrations/001_user_data.sql
\ir ../migrations/20261104000000_sync_revisions.sql
\ir ../migrations/20261108000000_reminders.sql
insert into auth.users values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
insert into public.user_data(user_id,progress,profile) values ('00000000-0000-0000-0000-000000000002', jsonb_build_object('activeDays',jsonb_build_array((now() at time zone 'UTC')::date::text)), '{}');
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
insert into public.push_subscriptions(user_id,endpoint,keys,timezone,remind_at) values ('00000000-0000-0000-0000-000000000001','https://web.push.apple.com/due','{"p256dh":"test","auth":"test"}','UTC',(now() at time zone 'UTC')::time);
do $$ begin
 assert not has_function_privilege('authenticated','public.claim_due_reminders(integer)','execute');
 assert not has_table_privilege('anon','public.push_subscriptions','select');
 begin
  insert into public.push_subscriptions(user_id,endpoint,keys) values ('00000000-0000-0000-0000-000000000002','https://web.push.apple.com/other','{"p256dh":"test","auth":"test"}');
  raise exception 'Cross-account insert unexpectedly succeeded';
 exception when insufficient_privilege then null; end;
 begin
  update public.push_subscriptions set timezone='Invalid/Timezone';
  raise exception 'Invalid time zone unexpectedly accepted';
 exception when raise_exception then assert sqlerrm='Invalid reminder time zone'; end;
end $$;
reset role;
insert into public.push_subscriptions(user_id,endpoint,keys,timezone,remind_at) values ('00000000-0000-0000-0000-000000000002','https://web.push.apple.com/practised','{"p256dh":"test","auth":"test"}','UTC',(now() at time zone 'UTC')::time);
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin assert (select count(*) from public.push_subscriptions)=1,'Other accounts remain hidden'; end $$;
reset role;
set local role service_role;
do $$ begin
 assert (select count(*) from public.claim_due_reminders(10))=1,'Only the inactive learner is due';
 assert (select count(*) from public.claim_due_reminders(10))=0,'A second claim cannot send twice today';
end $$;
reset role;
rollback;
\echo 'Reminder SQL: account isolation, privileges, time zones, practice suppression and duplicate claims passed.'
