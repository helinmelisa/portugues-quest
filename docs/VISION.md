# Vision

Português Quest is a cozy, gamified platform for learning **European Portuguese (pt-PT)** —
never Brazilian. Learn Portuguese by experiencing Portugal: explore an illustrated map,
complete small quests, and practise real-life conversations.

## Principles
Simplicity · consistency over intensity · practical language · gentle gamification ·
encouragement, not punishment · authentic pt-PT · a UI people want to return to.

## Audience
Students, expats, professionals moving to Portugal. A0–A1 first, English interface
(architecture ready for more interface languages).

## pt-PT reminders
autocarro, comboio, telemóvel, pequeno-almoço, casa de banho, gelado, sumo,
"se faz favor", "queria um café".

## Visual identity
Cozy illustrated adventure game × Portuguese travel journal. Not Duolingo, not an LMS.

| Token | Hex |
|---|---|
| cream (bg) | #F8F6EF |
| ink (text) | #34413A |
| terracotta (primary) | #D78362 |
| sage | #A9B79A |
| sky | #A9C4C4 |
| sun | #E8C477 |
| card | #FFFEFA |
| line (borders) | #EAE7DC |

Fonts: Fraunces (headings), DM Sans (body). Lucide icons. Rounded corners, soft shadows,
light micro-interactions.

## Main sections
- **Landing** — "Fall in love with Portuguese, one little adventure at a time."
- **Onboarding** — level, motivation, daily goal (5/10/15/20 min); skippable.
- **Dashboard** — greeting, stats, daily quest (most prominent), CEFR progress, streak.
- **Explore Portugal** — clickable illustrated map: Lisboa (greetings), Porto (café),
  Coimbra (student life), Braga (shopping), Aveiro (transport), Sintra, Algarve (leisure),
  Madeira. Lisboa + Porto unlocked first.
- **Lessons** — 3–7 min; intro → vocab → exercises → feedback that explains *why* → XP.
  Exercise types: multiple choice, translation, matching, sentence building, listening,
  fill-in-the-blank, conversation, pronunciation.
- **Gamification** — XP, gentle streaks, achievements, ranks (Newcomer → Portuguese Companion).
- **Practice Corner** — Quick Challenge, Word Garden (vocab + SRS later), Listening Nook,
  Build a Sentence.
- **Tutor "Inês"** — local demo UI only until an AI service is connected; never fake it.

## Tech
React + TS + Vite + Tailwind + React Router + Framer Motion + Lucide.
localStorage behind services/hooks now; Supabase later.
