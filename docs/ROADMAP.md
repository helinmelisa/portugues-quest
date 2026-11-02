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
- [ ] **4. Finish Lisboa**: introducing yourself, asking names, where you're from, polite expressions
- [ ] **5. Finish Porto**: café menu, pastries, paying (numbers 1–20, prices)
- [ ] **6. Unlock Coimbra**: numbers, days, times, daily routine. Unlock rule: finish 3 Porto lessons
- [ ] **7. Pt-PT vs pt-BR notes**: short "In Portugal…" cards (você, autocarro, pequeno-almoço, …)

### C. Learning that sticks
- [ ] **8. Spaced repetition**: a review schedule for each word (simple SM-2), and "Words to review today" on the dashboard
- [ ] **9. Translation exercise**: type the answer, tolerant matching (accents, punctuation)
- [ ] **10. Settings page**: daily goal, audio speed, reset, export/import progress (JSON)

### D. Accounts and AI (optional, only if time allows)
- [ ] **11. Supabase**: auth (magic link), sync progress across devices, keep localStorage as an offline cache
- [ ] **12. Inês with AI**: a Supabase Edge Function plus an LLM behind the `TutorSession` interface,
  with level-aware prompts and a daily message cap. **This costs money for each message.**

### Later
- [ ] Full playtest and bug-fix pass on desktop and mobile
- [ ] Installable app (PWA): manifest, icon, offline cache

Speaking practice with voice recording and pronunciation feedback · recorded native audio · A2/B1 paths ·
Braga, Aveiro, Sintra, Algarve and Madeira · weekly challenges · more interface languages.
