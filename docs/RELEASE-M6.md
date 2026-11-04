# Milestone 6 release checks

## Recorded on 4 November 2026

- Hosted baseline: `https://portugues-quest.vercel.app/app` opened the onboarding flow in the desktop in-app browser; no manifest was present. This is not a physical iPhone baseline.
- Production build, TypeScript and both milestone regression suites passed. Lint retains the existing four warnings; the production bundle-size advisory remains.
- Temporary local PostgreSQL 14: the actual migration and rollback-only fixture passed revision, duplicate receipt, cross-account RLS and privilege checks.
- Sync regressions passed concurrent device activity, response loss after commit, reopen/retry, separate-account outboxes, multi-tab queues, unrelated profile edits, removals, storage quota failure and certificate dates.
- Worker regressions passed offline navigation, API/auth exclusions, unrelated-cache preservation, cache eviction recovery and cross-tab update consent.
- Production preview in the desktop in-app browser: first-run setup, installation instructions and offline-ready status verified. A waiting worker update activated through the UI. With the preview server stopped, a lesson reloaded and resumed the saved exercise at a 390 × 844 viewport.
- Identity race regression passed: an in-flight RPC keeps the originating account’s bearer token; an already switched or missing session refuses to submit.
- Vercel reported a successful initial deployment; manifest and worker served HTTP 200 with the correct types. The initial production bundle lacked Supabase environment configuration. Both public variables were subsequently saved in Vercel Production, the user completed the deployment identity check, and the rebuilt release was verified Ready at `https://vercel.com/helin4/portugues-quest/8VjPrzSGc2DcxX8ybu2MNiJn98h4`. The production bundle now contains the correct project configuration; the live account sign-in screen renders. The manifest reports standalone display with `/app` as its start URL, and both manifest and worker return HTTP 200 with the correct content types. This verifies deployment/configuration, not authenticated cross-device sync.
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

## Mobile overflow follow-up

The user identified their target device as an iPhone 15 Pro Max. At a 320px baseline, the header pushed Settings outside the page (368px scroll width), and feedback action buttons squeezed a saved phrase into a nearly vertical column. The header now wraps; saved-word and correction actions stack below their text; lesson badges and certificate stats have phone layouts; shared controls and grammar/form children can shrink and wrap.

The local fixture uses long Portuguese phrases and an eight-digit XP value. Dashboard, Vida, grammar, settings, tutor selection, conversation feedback, certificate, lesson intro and matching passed at 430 × 932 and 932 × 430 with scroll width equal to viewport width and no clipped button contents. Fourteen screens passed the same checks at 320px and 390px; desktop feedback retained its side-by-side layout. Build and lint passed, with the existing lint warnings and bundle-size advisory. These checks use browser viewports, not a physical iPhone.
