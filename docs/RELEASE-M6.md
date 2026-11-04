# Milestone 6 release checks

## Recorded on 4 November 2026

- Hosted baseline: `https://portugues-quest.vercel.app/app` opened the onboarding flow in the desktop in-app browser; no manifest was present. This is not a physical iPhone baseline.
- Production build, TypeScript and both milestone regression suites passed. Lint retains the existing four warnings; the production bundle-size advisory remains.
- Temporary local PostgreSQL 14: the actual migration and rollback-only fixture passed revision, duplicate receipt, cross-account RLS and privilege checks.
- Sync regressions passed concurrent device activity, response loss after commit, reopen/retry, separate-account outboxes, multi-tab queues, unrelated profile edits, removals, storage quota failure and certificate dates.
- Worker regressions passed offline navigation, API/auth exclusions, unrelated-cache preservation, cache eviction recovery and cross-tab update consent.
- Production preview in the desktop in-app browser: first-run setup, installation instructions and offline-ready status verified. A waiting worker update activated through the UI. With the preview server stopped, a lesson reloaded and resumed the saved exercise at a 390 × 844 viewport.
- Identity race regression passed: an in-flight RPC keeps the originating account’s bearer token; an already switched or missing session refuses to submit.
- Vercel reported a successful initial deployment; manifest and worker served HTTP 200 with the correct types. The production bundle lacked Supabase environment configuration, so account sync must be enabled before hosted acceptance.
- The user reported applying `20261104000000_sync_revisions.sql` to hosted Supabase. Public endpoint checks confirmed the revision column responds successfully and anonymous sync/tutor calls remain denied (401). Authenticated hosted sync still needs the account/device check.

## Physical iPhone and account checks still required

Record the iPhone model, iOS version, desktop browser version and date beside the results.

- [ ] Safari: sign in, complete onboarding, finish a lesson and read a text.
- [ ] Add to Home Screen, launch standalone and finish sign-in inside that window. Exercise the copied-link fallback using a fresh link if needed.
- [ ] Open the same account on desktop. Complete different lessons on both clients; verify XP, streak, vocabulary, settings and certificate state converge after sync.
- [ ] After the offline-ready message, enable Airplane Mode, close/reopen the app and finish a lesson. Reconnect; verify the lesson and its XP reach the website once.
- [ ] Switch accounts while a sync is in flight. Verify no progress or pending work crosses accounts; return to the first account to recover its own queue.
- [ ] Test denied microphone permission, pt-PT voice availability, wired/Bluetooth headphones, silence detection, backgrounding and interruptions. Verify chat fallback.
- [ ] With a lesson open in one tab, publish an update and request it in another tab. The update must wait; finish the lesson and retry.
- [ ] Verify large text, reduced motion, keyboard visibility, landscape and safe-area spacing on the physical phone.

Do not mark the whole milestone complete until these device checks and hosted release verification are recorded.
