# Português Quest 🇵🇹

A cozy, gamified way to learn **European Portuguese (pt-PT)** — by exploring Portugal one little
adventure at a time. Start in Lisboa with your first “Olá”, travel to Porto and order your first
coffee, and build a gentle daily habit along the way.

See [docs/VISION.md](docs/VISION.md) for the product direction and [docs/ROADMAP.md](docs/ROADMAP.md) for progress.

## Features (MVP)

- **Landing page and onboarding**: goals, level and daily target; the optional questions can be skipped
- **Dashboard**: daily quest, XP, streak, daily goal, road to A1, weekly activity and achievements
- **Explore Portugal**: clickable illustrated map; Lisboa and Porto are playable, the other places are locked
- **Lessons**: vocabulary intro with audio, then multiple choice, fill-in-the-blank, matching, sentence
  building and listening, with feedback that explains each answer. Missed questions come back at the end of the lesson
- **Gamification**: XP, a gentle streak, ranks (Newcomer → Portuguese Companion), achievements, celebrations
- **Practice Corner**: Quick Challenge, Listening Nook, Build a Sentence and Word Garden (a word list where you can mark tricky words)
- **Inês tutor (demo)**: scripted roleplay conversations with tips specific to European Portuguese

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Requires Node 20+.

## Stack

React · TypeScript · Vite · Tailwind CSS v4 · React Router · Framer Motion · Lucide

## Project structure

```
src/
  components/   common UI, layout, navigation, lessons, map, gamification
  data/         curriculum (lessons per destination), destinations, quests
  features/     progress, achievements, practice generation, tutor
  hooks/        useProgress
  pages/        Landing, Onboarding, Dashboard, Explore, Lesson, Practice, Tutor
  services/     storage (localStorage), speech (text-to-speech)
  types/        shared domain types
```

Lessons live in `src/data/curriculum/`. A new exercise type only needs a type in `src/types`,
a component in `src/components/lessons/` and a case in `ExerciseView`.

## Current limitations and future integrations

| Area | Now | Planned |
|---|---|---|
| Accounts and sync | Progress is saved in the browser's `localStorage` (`src/services/storage.ts`) | Supabase Auth + Postgres. Replace the storage service; components stay the same |
| Audio | Browser text-to-speech (`src/services/speech.ts`), which prefers a pt-PT voice | Native European Portuguese recordings in Supabase Storage via `VocabularyItem.audioUrl` |
| Tutor | `createScriptedTutor` with simple matching rules on replies | An AI-backed `TutorSession` behind a Supabase Edge Function. The API key stays on the server |
| Pronunciation | Listen only | Voice recording and pronunciation feedback |
| Review | Word Garden lets you mark tricky words | Spaced repetition |

No external services or API keys are needed to run the app.
