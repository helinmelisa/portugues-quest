# Roadmap

Product milestones and planned improvements.

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

## Milestone 6 — Portuguese in your pocket

Goal: keep the website and add an installable iPhone app experience, with the same account and reliable progress sync between both. Use a PWA built from the existing React app and Supabase backend, with one curriculum and one release to maintain.

Install from Safari onto the Home Screen and use the same account on the website and installed app. An App Store release is a separate future decision.

### A. Make it an iPhone app
- [x] **1. Core iPhone checks**: reopen the Home Screen app with a persistent session, complete a lesson offline, reconnect and see progress on the website, and make a call with pause/resume
- [x] **2. Installable app**: manifest, app icons, Apple touch icon, standalone display, theme and launch screen; add a short Safari installation guide in Settings. Keep normal browser URLs and desktop use working

### B. One account, one learning journey
- [x] **3. Sign-in and account isolation**: email/password sign-in, persistent sessions, optional email links, and account-scoped cached progress and pending changes. Safari and the installed app can have separate sessions
- [x] **4. Cross-device sync**: pull and merge on foreground/reconnect, and refresh while both clients are open through account-scoped realtime updates with a fallback refresh. Prevent stale whole-profile writes from erasing newer progress. Preserve lesson completion, XP, streaks, word reviews, settings, mistakes and certificates; define how edits and deletions resolve
- [x] **5. Durable offline progress**: persist pending learning activity per account and retry on reopening/reconnecting. Use stable activity IDs and server-side deduplication/merge so replayed events do not award XP twice and work completed on two devices is retained. Show “Saved on this device”, “Syncing”, “Synced” and a retry state

### C. Learn without a connection
- [x] **6. Offline lessons and reading**: cache the app shell and bundled curriculum after an online visit, then support lessons, grammar, Word Garden and reading offline for the last signed-in account. Keep AI chat, transcription and calls clearly online-only. Do not service-worker-cache auth responses, tokens or private API responses; treat device speech availability separately
- [x] **7. Safe app updates**: version caches and persisted data, offer an “Update available” action between activities, and preserve in-progress lessons and pending sync. Recover gracefully if cached assets are unavailable or removed; avoid forcing an update during a lesson or call

### D. Feel right on iPhone
- [x] **8. Mobile polish**: safe-area spacing, bottom navigation, on-screen keyboard, tap targets, text scaling, contrast and reduced motion. Verify narrow screens, landscape and desktop layouts with the existing cozy visual style
- [x] **9. Core voice and calls**: microphone conversations with Inês, spoken replies, pause/resume and a chat fallback. Prevent overlapping playback and recording
- [x] **10. Core release verification**: automated conflict/retry/account-isolation checks, deployed app and installation assets, installation instructions, and the main iPhone-to-website learning flow
- [ ] **11. Extended device checks**: expired sessions, account switching during pending sync, denied microphone permission, headphones, background interruptions, large text and updates while another tab has a lesson open

Done when: a learner can install the app, use the same account on iPhone and desktop, complete a lesson offline, reconnect and see that progress on the website, then continue on either surface without losing or duplicating learning activity. Certificates, saved words and settings must agree after sync. Call mode must work or provide a clear supported fallback on the tested iPhone. Record device/iOS/browser versions and evidence rather than assuming a desktop preview covers Safari.

## Milestone 7 — A clearer journey and deeper practice

Goal: make the next step obvious, strengthen everyday A2 Portuguese, and introduce B1 through a small first chapter. Keep the same progress on the website and installed app.

### A. Make the journey easy to follow
- [x] **1. Destination handoff**: recommend Porto after Lisboa and continue through all eight destinations. Keep completed lessons available for revisits
- [x] **2. Consistent UX**: shared layouts and line icons, clear primary actions, Practice filters, vocabulary and grammar search, organised Settings and chat/call selection

### B. Strengthen A2 skills
- [x] **3. Focus review**: a short session prioritising recent corrections, due words and saved tricky words. Fall back to suitable learned material when there is nothing due
- [x] **4. Writing desk**: six everyday messages with a clear prompt, useful phrases, word guidance, a model answer and a self-checklist. Save drafts offline and sync them across devices. Explain that self-checking is not automatic grammar grading
- [x] **5. Longer listening**: four eight-turn dialogues with normal/slow playback, optional transcripts, glossary and comprehension checks. Clearly label device-generated audio

### C. Introduce the next level
- [x] **6. B1 starter**: four lessons covering opinions, suggestions, future plans and hopes, with supporting grammar bites. Recommend this after A2 and clearly label it as the first chapter, without a full-course or proficiency claim

### D. Support a gentle daily habit
- [ ] **7. Optional reminders (pending hosted setup and iPhone delivery check)**: choose a time, enable notifications on each device and turn them off easily. Skip reminders when synced progress shows practice that day. Keep notification text free of account details and explain device/connection limits

### E. Release reliably
- [x] **8. Learning checks**: valid questions and answers, suitable review priorities, no duplicate rewards on reconnect, and durable writing drafts
- [ ] **9. Phone and website release**: verify new screens on iPhone and desktop, offline learning and draft sync, backend reminder setup and installed-app notification delivery

Delivery order: Focus review → Writing desk → Longer listening → B1 starter → Optional reminders. Verify each part before releasing it.

Done when: each new activity is easy to find, usable on the phone, and retains progress after reopening or reconnecting. Writing drafts agree across devices after sync. The B1 chapter has a clear starting point. Reminders are opt-in, can be disabled, and have been verified on the installed app.

## Later
- [ ] Recorded native audio
- [ ] Full B1 curriculum and checkpoint
- [ ] More interface languages
