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

Implementation notes: call feedback and the A2 tutor prompts require redeploying the existing `tutor` Edge Function. Live microphone/audio and hosted AI calls still need a device check after deployment; the full phone playtest remains below. No new database migration is needed.

## Later
- [ ] Installable app (PWA): home-screen icon, offline lessons, splash screen
- [ ] Full playtest and polish pass on iPhone and desktop
- [ ] Daily reminder notifications (needs the PWA + web push)
- [ ] Recorded native audio
- [ ] B1 path
- [ ] More interface languages
