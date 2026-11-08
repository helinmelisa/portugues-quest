# Milestone 6 release checks

Release: [Português Quest](https://portugues-quest.vercel.app/app)

Target device: iPhone 15 Pro Max, iOS 27.2.

## Core acceptance checks

| Check | Status | Verification |
| --- | --- | --- |
| Stay signed in after reopening the Home Screen app | Passed | Device report |
| Complete a lesson offline, reconnect and see it on the website | Passed | Device report |
| Call Inês and pause/resume | Passed | Device report |
| Public app, manifest and service worker | Passed | Hosted HTTP checks |
| Standalone installation configuration | Passed | Manifest: `/app` start URL, standalone display |
| Tutor rejects unauthenticated requests | Passed | Hosted HTTP 401 |
| Sync conflicts, ambiguous retries and account isolation | Passed | Automated regression suite |
| Offline routes, private-response exclusions and safe updates | Passed | Automated worker suite |
| Password sign-in, recovery and account setup | Passed | Automated auth fixture |
| Phone-sized layouts and visible lesson actions | Passed | Browser viewport checks |

The device report covers the three main phone checks above. Automated fixtures and browser viewport checks do not establish the remaining physical-device cases.

## Extended device checks

- [ ] Test expired sessions and recovery in Safari and the Home Screen app.
- [ ] Switch accounts while sync is pending; return to the first account and verify its pending activity remains isolated.
- [ ] Deny microphone permission and confirm the recovery message and chat fallback.
- [ ] Test headphones, backgrounding and call interruptions.
- [ ] Test large text, reduced motion, keyboard visibility, landscape and safe-area spacing on the physical phone.
- [ ] Keep a lesson open in one tab and request an update from another. Confirm the update waits until the lesson ends.
- [ ] Compare vocabulary, settings and certificate state across phone and desktop.

## Repeatable local checks

```bash
npm run build
npm run lint
npm run test:auth
npm run test:journey
npm run test:milestone5
npm run test:milestone6
```

`supabase/tests/sync.sql` checks revisions, receipts, RLS and privileges in an empty local PostgreSQL database and rolls back its fixture. Do not run it against hosted Supabase.
