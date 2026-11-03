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
- [ ] **4. Conversation wrap-up**: when you end a chat, Inês sums up what went well, 2–3 corrections and new words, which can be added to the Word Garden
- [ ] **5. Rewards for talking**: XP for conversations, a "First Conversation" achievement and a "talk to Inês" daily quest

### C. More of Portugal
- [ ] **6. Aveiro (getting around)**: buses and trains, buying tickets, directions, timetables. Completes "Getting Around"
- [ ] **7. Braga (shopping)**: prices, quantities, the mercado, clothes and sizes
- [ ] **8. Grammar bites**: short optional cards (gender and articles, ser vs estar, regular -ar verbs) linked from lessons

### D. Habit and polish
- [ ] **9. Weekly challenge**: one gentle goal each week (e.g. 3 lessons and 1 chat) with a bonus badge
- [ ] **10. Playtest and polish**: a full pass on iPhone and desktop, fixing whatever you've noticed

## Later
- [ ] Installable app (PWA): manifest, icon, offline cache
- [ ] Sintra, Algarve and Madeira
- [ ] Recorded native audio
- [ ] A2/B1 paths
- [ ] More interface languages
