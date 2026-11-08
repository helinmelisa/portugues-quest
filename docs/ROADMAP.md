# Roadmap

Built in small sessions. Each step should be finishable in one sitting.

## Milestone 1 — MVP
- [x] **1. Setup** — repo, Vite + React + TS, Tailwind theme, folder structure
- [x] **2. Design system** — Button, Card, ProgressBar, Badge, XP/streak chips
- [x] **3. Layout + routing** — sidebar (desktop), bottom nav (mobile), page stubs
- [x] **4. Landing page** — hero, features, how it works, footer
- [x] **5. Types + data** — interfaces, Lisboa & Porto curriculum (pt-PT)
- [x] **6. Progress service** — localStorage persistence, XP, streak
- [x] **7. Lesson engine** — multiple choice + feedback + completion screen
- [x] **8. First full lesson** — "Saying hello" (Lisboa)
- [x] **9. Explore map** — clickable stylised Portugal, locked/unlocked destinations
- [x] **10. Dashboard** — stats, daily quest, continue learning, weekly streak
- [x] **11. Onboarding** — short skippable flow
- [x] **12. More exercises** — matching, sentence building, fill-in-the-blank
- [x] **13. Achievements + celebrations**
- [x] **14. Practice Corner + Word Garden**
- [x] **15. Tutor demo UI** (Inês, scripted, clearly labelled as demo)
- [x] **16. Polish** — responsive pass, accessibility, README

## Milestone 2 — Make it a real daily habit

Goal: enough content for ~2 weeks of daily use, usable on a phone, and words that stick.
Ordered by value per effort; everything except step 12 is free to run.

### A. Ship
- [x] **2. Deploy**: Vercel (free), SPA rewrites, so the app works on a phone

### B. Content (the biggest gap)
- [x] **4. Finish Lisboa**: introducing yourself, asking names, where you're from, polite expressions
- [x] **5. Finish Porto**: café menu, pastries, paying (numbers 1–20, prices)
- [x] **6. Unlock Coimbra**: numbers, days, times, daily routine. Unlock rule: finish 3 Porto lessons
- [x] **7. Pt-PT vs pt-BR notes**: short "In Portugal…" cards (você, autocarro, pequeno-almoço, …)

### C. Learning that sticks
- [x] **8. Spaced repetition**: a review schedule for each word (simple SM-2), and "Words to review today" on the dashboard
- [x] **9. Translation exercise**: type the answer, tolerant matching (accents, punctuation)
- [x] **10. Settings page**: daily goal, audio speed, reset, export/import progress (JSON)

### D. Accounts and AI (optional, only if time allows)
- [x] **11. Supabase**: auth (magic link), sync progress across devices, keep localStorage as an offline cache
- [x] **12. Inês with AI**: a Supabase Edge Function plus an LLM behind the `TutorSession` interface,
  with level-aware prompts and a daily message cap. **This costs money for each message.**

## Milestone 3 — Speak and explore

Goal: actually speaking out loud, more of Portugal to explore, and Inês as a real practice partner.
Everything runs on free tiers: Groq (Whisper and the chat model) and the browser's own speech features.

### A. Speaking (the biggest gap)
- [x] **1. Voice input for Inês**: a mic button in the chat. Speech is transcribed by Groq Whisper through the Edge Function, and Inês can read her replies aloud
- [x] **2. Pronunciation exercise**: listen, record yourself, see the transcript, and get a similarity score with friendly feedback
- [x] **3. Speaking in lessons**: add 1 pronunciation exercise to each lesson, plus a "Speak" mode in Practice Corner

### B. Inês as a practice partner
- [x] **4. Conversation wrap-up**: when you end a chat, Inês sums up what went well, 2–3 corrections and new words, which can be added to the Word Garden
- [x] **5. Rewards for talking**: XP for conversations, a "First Conversation" achievement and a "talk to Inês" daily quest

### C. More of Portugal
- [x] **6. Aveiro (getting around)**: buses and trains, buying tickets, directions, timetables. Completes "Getting Around"
- [x] **7. Braga (shopping)**: prices, quantities, the mercado, clothes and sizes
- [x] **8. Grammar bites**: short optional cards (gender and articles, ser vs estar, regular -ar verbs) linked from lessons

### D. Habit and polish
- [x] **9. Weekly challenge**: one gentle goal each week (e.g. 3 lessons and 1 chat) with a bonus badge
- Step 10 (playtest and polish) moved to Later.

## Milestone 4 — Towards A2

Goal: finish the map of Portugal, take the first steps into A2 (past tense, plans), and make Inês feel personal.
Still free to run: Groq free tier + Supabase free tier.

### A. Finish the map
- [x] **1. Sintra (making plans)**: invitations, “ir + infinitive” (vou visitar), weekend plans, meeting times
- [x] **2. Algarve (leisure)**: weather, the beach, ordering a meal at a restaurant, small talk
- [x] **3. Madeira (first A2 steps)**: talking about past holidays with the pretérito perfeito (fui, comi, visitei)
- [x] **4. New grammar bites**: -er/-ir verbs, ir + infinitive, the past tense (pretérito perfeito)

### B. Listening stories
- [x] **5. Histórias**: short graded stories (one per destination) read aloud, with tap-to-translate words and 3 comprehension questions

### C. A more personal Inês
- [x] **6. Free chat and your own scenario**: chat about anything, or describe a situation you're about to face (“I have a meeting with my landlord tomorrow”)
- [x] **7. Inês remembers you**: a short learner profile (name, interests, frequent mistakes) saved in your account and used in her prompt
- [x] **8. Mistake notebook**: corrections from wrap-ups collected in one place and turned into review exercises

### D. Milestones that mean something
- [x] **9. A1 checkpoint**: a short mixed test after Braga and a shareable “A1 explorer” certificate page
- Step 10 (installable app) moved to Later.

## Milestone 5 — Life in Portugal (A2)

Goal: the practical Portuguese that expats actually need (paperwork, housing, health, work), real A2 grammar, and speaking with Inês like a phone call.
Still free to run: Groq free tier + Supabase free tier.

### A. "Vida em Portugal": a new world for everyday admin
- [x] **1. Papers**: getting a NIF at Finanças, Segurança Social, booking at the Loja do Cidadão
- [x] **2. Home**: renting a flat (renda, caução, contrato, T1/T2), talking to the senhorio, utilities
- [x] **3. Health**: the centro de saúde, número de utente, describing symptoms, the farmácia, 112
- [x] **4. Work and bank**: opening a bank account, a simple job interview, emails and formal register

### B. A2 grammar and a second visit
- [x] **5. New grammar bites**: the imperfect (eu costumava / era), reflexive verbs, object pronouns (o, a, lhe), comparisons
- [x] **6. Second visit to Lisboa and Porto**: A2 lessons using the past tense (what happened, how it was)

### C. Speaking like real life
- [x] **7. Call mode with Inês**: hands-free voice conversation (you speak, she answers aloud, repeat) for phone-call scenarios
- [x] **8. Speaking feedback**: after a call, Inês scores fluency, vocabulary and accuracy and suggests one thing to practise

### D. Real-world reading and the A2 goal
- [x] **9. Real-life texts**: signs, notices, a rental ad, an SMS from the doctor, a utility bill, each with questions
- [x] **10. A2 checkpoint and certificate**

Implementation notes: the user reported redeploying the `tutor` Edge Function on 4 November 2026 at [the existing tutor endpoint](https://embwiettleplfacmudzj.supabase.co/functions/v1/tutor). Live microphone/audio and hosted AI calls still need a device check; this is included in Milestone 6. Milestone 5 needs no new database migration.

## Milestone 6 — Portuguese in your pocket

Goal: keep the website and add an installable iPhone app experience, with the same account and reliable progress sync between both. Use a PWA built from the existing React app and Supabase backend, with one curriculum and one release to maintain.

The first release is installed from Safari onto the Home Screen. An App Store release is a separate future decision. Existing Supabase sync is the starting point: it currently pulls at sign-in and pushes local edits, so foreground refresh, conflict handling and reconnect recovery need work.

### A. Make it an iPhone app
- [ ] **1. Phone baseline**: test the current deployed website in iPhone Safari and Home Screen mode; record login, navigation, lesson, reading and call issues before changing behaviour
- [x] **2. Installable app**: manifest, app icons, Apple touch icon, standalone display, theme and launch screen; add a short Safari installation guide in Settings. Keep normal browser URLs and desktop use working

### B. One account, one learning journey
- [ ] **3. Sign-in and account isolation**: test magic-link login in Safari and the installed app, persistent sessions, expired sessions and sign-out. Scope cached progress and pending changes to the account; never merge another account’s local data. Explain that the installed app may need its own sign-in
- [x] **4. Cross-device sync**: pull and merge on foreground/reconnect, and refresh while both clients are open through account-scoped realtime updates with a fallback refresh. Prevent stale whole-profile writes from erasing newer progress. Preserve lesson completion, XP, streaks, word reviews, settings, mistakes and certificates; define how edits and deletions resolve
- [x] **5. Durable offline progress**: persist pending learning activity per account and retry on reopening/reconnecting. Use stable activity IDs and server-side deduplication/merge so replayed events do not award XP twice and work completed on two devices is retained. Show “Saved on this device”, “Syncing”, “Synced” and a retry state

### C. Learn without a connection
- [x] **6. Offline lessons and reading**: cache the app shell and bundled curriculum after an online visit, then support lessons, grammar, Word Garden and reading offline for the last signed-in account. Keep AI chat, transcription and calls clearly online-only. Do not service-worker-cache auth responses, tokens or private API responses; treat device speech availability separately
- [x] **7. Safe app updates**: version caches and persisted data, offer an “Update available” action between activities, and preserve in-progress lessons and pending sync. Recover gracefully if cached assets are unavailable or removed; avoid forcing an update during a lesson or call

### D. Feel right on iPhone
- [x] **8. Mobile polish**: safe-area spacing, bottom navigation, on-screen keyboard, tap targets, text scaling, contrast and reduced motion. Verify narrow screens, landscape and desktop layouts with the existing cozy visual style
- [ ] **9. Safari voice and calls**: validate the redeployed tutor, pt-PT playback, microphone permission, silence detection, pause/resume, headphones, backgrounding and interruptions in Safari and the installed app. Prevent overlapping playback/recording and provide a clear recovery path to chat
- [ ] **10. Release verification**: automate sync conflict/retry/account-switch regression checks; finish a physical iPhone plus desktop smoke test; refresh the README and installation instructions. Deploy the web release and verify installation, updates and sync against the hosted app

Done when: a learner can install the app, use the same account on iPhone and desktop, complete a lesson offline, reconnect and see that progress on the website, then continue on either surface without losing or duplicating learning activity. Certificates, saved words and settings must agree after sync. Call mode must work or provide a clear supported fallback on the tested iPhone. Record device/iOS/browser versions and evidence rather than assuming a desktop preview covers Safari.

Suggested commits: (1) installable shell and installation guide; (2) account-safe sync and durable offline activity; (3) offline curriculum and safe updates; (4) iPhone layout and voice fixes; (5) release checks and docs. Update this checklist in each implementation commit. If activity deduplication requires a schema change, include the Supabase migration with the sync commit.

Installation reference: [Apple’s guide to opening a website as an iPhone web app](https://support.apple.com/en-lamr/guide/iphone/iphea86e5236/ios).

Implementation progress: installable shell and assets are implemented. Account isolation, copied-link sign-in, durable activity queues and revision/receipt sync are implemented; the user reported running the hosted migration. Concurrent-device, retry and local PostgreSQL RLS checks passed. Public-asset offline caching, saved lesson drafts and explicit cross-tab-safe updates are implemented and tested in the production preview. Mobile layout and voice recovery are implemented. Production Supabase settings are now configured in Vercel. After the user completed Vercel identity verification, the rebuilt release was confirmed Ready, the live bundle contained the project URL/public key, the account sign-in screen rendered, and manifest/worker requests returned HTTP 200. An additional identity-race test verifies that in-flight sync requests keep their original account token. Steps 1, 3, 9 and 10 remain open for physical iPhone, authenticated hosted sync and final release checks; see [release evidence](RELEASE-M6.md).

Mobile overflow follow-up: the header now wraps its status chips and keeps Settings visible, shared buttons/badges wrap long labels, and grid/form children can shrink inside cards. Target device: the user’s iPhone 15 Pro Max. Lesson metadata, saved-word and correction actions now stack on phones; grammar/example text, speaking cards and certificate stats retain readable widths. Nine representative screens passed viewport checks at 430 × 932 and 932 × 430, with no page overflow or clipped buttons. Fourteen screens also passed at 320px and 390px. These are browser layout checks; physical iPhone validation remains open.

Password sign-in follow-up: email/password is now the default, with new-account signup, one-time password setup/recovery for existing email-link accounts, and Set or change password in Settings. Sessions explicitly persist and refresh on-device. Passwords go only to Supabase Auth; existing progress and account IDs are retained. Optional email-link sign-in remains available. The browser forms were checked at the iPhone 15 Pro Max viewport; credential-service regression checks use mocks, not real user passwords.

Question-screen follow-up (8 November 2026): the user clarified the issue was vertical visibility of the title and Check button on iPhone 15 Pro Max. The lesson fills the dynamic viewport; its question body scrolls while Check/Continue stays visible, including safe-area spacing. Long feedback scrolls independently of Continue, and each new exercise returns to the top. Shared question headings replace fieldset/legend sizing, reading passages use body text below the question, and answer labels/tiles wrap. Seventy-eight browser checks across seven exercise types and six reading texts passed unchecked/feedback states at 430 × 932, 430 × 740 and 932 × 430: title and action were in the viewport with no horizontal overflow.

## Milestone 7 — A clearer journey and deeper practice

Goal: make the next learning step obvious, strengthen A2 skills, and introduce a small B1 chapter while keeping progress synced across phone and website.

- [x] **1. Destination handoff**: after Lisboa, recommend Porto on the lesson result, dashboard and map. Follow the learning route through all eight destinations, retain completed lessons for revisits, and reset lesson state when continuing directly to another lesson.
- [ ] **2. Shared UX polish**: clearer navigation, accessible primary actions, readable spacing, consistent mobile layouts and a route list alongside the map.
- [ ] **3. Focus review and writing**: prioritise corrections, due and saved words; add six short writing tasks with self-checks and synced drafts.
- [ ] **4. Longer A2 listening**: four eight-turn dialogues with transcripts, glossary, slow device playback and comprehension checks. Recorded native audio remains separate.
- [ ] **5. B1 starter chapter**: four introductory lessons and grammar bites; label this as a starter rather than a complete B1 course or certificate.
- [ ] **6. Optional daily reminders**: per-device opt-in Web Push, secure scheduled delivery and an off switch. Verify hosted backend and installed iPhone delivery before marking complete.
- [ ] **7. Release checks**: build, regression tests, mobile UI checks and deployment; keep physical device results separate from browser simulations.

Suggested separate commits: journey handoff; shared UX; review and writing; dialogues; B1 starter; reminders and backend setup. Update this checklist with each delivered change.

Journey verification (8 November 2026): automated progression checks passed through all eight stops, including Lisboa → Porto and a completed route. Browser fixtures confirmed the completed Lisboa page links to Porto, and Explore selects Porto after Lisboa is complete. No account progress was changed during these checks. Device reported by the user: iPhone 15 Pro Max, iOS 27.2. Sign-in/offline sync/call outcomes still await the user's physical checks.

## Later
- Installable app (PWA), offline lessons and app updates moved to Milestone 6.
- iPhone and desktop playtest/polish moved to Milestone 6.
- [ ] Daily reminder notifications (needs the PWA + web push)
- [ ] Recorded native audio
- [ ] More A2 practice: targeted review, short writing tasks and longer listening dialogues
- [ ] B1 path
- [ ] More interface languages
