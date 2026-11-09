# Português Quest

A cozy, gamified way to learn **European Portuguese (pt-PT)** through destinations, everyday
situations and conversations with Inês. The website and installable iPhone web app share the
same code, curriculum and Supabase account.

[Live website](https://portugues-quest.vercel.app) · [Roadmap](docs/ROADMAP.md) · [Vision](docs/VISION.md)

## Use it on iPhone

1. Open the website in **Safari**.
2. Tap **Share → Add to Home Screen**. Keep **Open as Web App** enabled if shown.
3. Open the new icon and sign in with the same email and password you use on the website.
4. Stay online for the first download. Settings confirms when lessons and reading are ready offline.

Safari and the home-screen app may have separate sessions. Sign in with email and password directly
inside each app window; the session is saved and refreshed on that device.

Already used email links? While signed in, open **Settings → Set or change password**. If signed out,
choose **Set a password or forgot password?** on the login screen and use the setup email once.
Use the same email to keep existing progress. New accounts can choose **Create an account** and may
need to confirm their email once. Passwords go directly to Supabase Auth; they are not stored in
learning progress, backups or the offline queue.

Email-link sign-in remains an optional fallback. If its link opens Safari, copy a fresh, unopened
sign-in link and paste it into **Signing in to the home-screen app?** on the link confirmation screen.
Never share sign-in or password recovery links.

Lessons, grammar, reading and saved vocabulary work offline after the initial download. Account
sign-in needs a connection the first time. Inês, transcription and call feedback need the network;
availability of device voices offline varies. This is a Home Screen web app; App Store distribution
is a separate future step.

## Learning

- Eight destinations, ten A2 Vida em Portugal lessons and second visits to Lisboa and Porto
- Vocabulary, listening, matching, translations, sentence building and optional speaking
- Spaced repetition, Word Garden, stories, real-life reading and a mistake notebook
- A1/A2 checkpoints and learning certificates, XP, achievements, quests and weekly challenges
- Focus review, six A2 writing tasks with synced drafts, four listening dialogues and a B1 starter chapter
- Inês: free chat, custom scenarios and hands-free phone role-plays with transcript-based feedback

## Progress and sync

Progress is stored per account on the device. Each edit is saved to a durable activity outbox before
updating the screen. Online sync runs after edits, on focus/reconnect, through account-filtered
Realtime updates and a 30-second foreground fallback. “Saved on this device” means upload is pending;
Settings provides a retry action. If storage is unavailable, keep the page open and export a backup.

The server serializes writes using a revision and acknowledges unique activity IDs. Retrying a
request after an uncertain network failure cannot award its XP again. Counters add across devices;
completed lessons and certificate dates keep their earliest date; collections merge by item ID;
settings, deletions and each word-review record use the last accepted edit. Explicit reset/import
replaces the relevant snapshot at its accepted position in the queue. Changes made later on another
offline device can still arrive afterwards. Replayed receipts are retained to preserve deduplication.

Signing out hides account data and keeps its unsynced work scoped to that account for the next
sign-in. Old unscoped v1 caches are preserved as a **Previous device backup** in Settings; they are
never automatically merged into a different account. Import only backups belonging to you.

The worker caches only public app assets and curriculum, never Supabase/auth/private API responses.
Updates wait between activities and check other open tabs before activation. Unfinished lesson drafts
and pending sync remain on the device. Browser storage may be evicted by the OS; export is still useful.

## Development

```bash
npm install
cp .env.example .env
npm run dev
npm run build             # type-check, bundle and generate versioned offline worker
npm run preview           # production PWA checks; dev mode does not register a worker
npm run lint
npm run test:milestone7
npm run test:journey
npm run test:auth
npm run test:milestone5
npm run test:milestone6    # run after build; includes offline worker and sync regressions
```

Node 20+; React, TypeScript, Vite, Tailwind, React Router, Framer Motion and Lucide.
Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` belong in the frontend environment.
Set them in Vercel as well as locally. Without them the app uses device-only guest progress.
Never put service-role keys or Groq secrets in Vite variables or Git.

## Supabase and deployment

1. Apply migrations in `supabase/migrations/` in order. For an existing installation, apply
   `20261104000000_sync_revisions.sql` before using the new sync client. It preserves existing data,
   adds an authenticated RPC and receipt table, and removes old unrestricted snapshot-write policies.
2. Keep the existing `tutor` Edge Function deployed with its Groq secrets; Milestone 6 needs no new tutor deployment.
3. Set the production site URL and allowed redirect URLs in Supabase Auth to the deployed origin plus `/app`.
4. Deploy to Vercel using the included SPA rewrites and non-cacheable worker headers. Older app tabs
   must refresh after the sync migration; their outdated snapshot writes are intentionally rejected.
5. Follow [the release checklist](docs/RELEASE-M6.md), including a physical iPhone and two-account test.

`supabase/tests/sync.sql` is a rollback-only fixture for an **empty local PostgreSQL database**. It
mocks Auth, then tests revisions, duplicate receipts, RLS and privileges. Do not run the fixture on
hosted Supabase; only the files in `supabase/migrations/` are deployment migrations.

## Optional daily reminders

Apply `20261108000000_reminders.sql` to the hosted database. From the project folder, run
`node scripts/prepare-reminders.mjs` once and follow the printed commands to set function secrets,
deploy the reminders function and run the private scheduler SQL in Supabase. Keep the generated
files in the ignored `.local-reminders/` directory. Verify delivery and the off switch in the
installed iPhone app before closing the roadmap item.
