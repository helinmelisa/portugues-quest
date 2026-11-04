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

## Milestone 5 — Life in Portugal

- **Vida em Portugal**: ten A2 lessons for papers, home, health, work, banking and a second visit
  to Lisboa and Porto. Open this chapter from Explore Portugal or Practice Corner.
- **Grammar bites**: the imperfect, reflexive verbs, object pronouns and comparisons, linked
  from the new lessons.
- **Real-life texts**: six authored examples (sign, notice, rental ad, appointment SMS, utility
  bill and interview email), with English support and three questions each.
- **A2 checkpoint**: complete all ten Vida lessons and two Madeira lessons to unlock sixteen
  mixed questions. Twelve correct on the first try earns the A2 Explorer certificate and achievement.
- **Call mode**: switch it on in Inês’s scenario picker, then choose a phone scenario or describe
  your own situation. Inês speaks, the mic listens, and a short silence submits your turn.
  Pause/resume and backgrounding release the microphone; failed requests pause the call.
- **Speaking feedback**: after at least two replies, end the call for vocabulary, accuracy and
  transcript-based fluency estimates (1–5), plus one concrete practice suggestion. These are
  language estimates, not an acoustic assessment of pronunciation or speaking speed.

The existing Supabase `tutor` Edge Function must be redeployed for the A2 prompts and call
feedback payload. Use the same project and existing `GROQ_API_KEY` / optional `GROQ_MODEL` secrets:

```bash
supabase functions deploy tutor --project-ref <your-project-ref>
npm run test:milestone5
```

No database migration or new paid service is needed. Calls use the existing Groq transcription
and chat integration, and browser text-to-speech. A secure context (HTTPS or localhost), microphone
permission, MediaRecorder, AudioContext and speech synthesis are required. Browser speech support
varies, especially on mobile; chat remains available. Live microphone playback and hosted AI calls
still need a device check after deployment.

Reading samples use fictional dates, amounts and payment details. The curriculum teaches language;
service requirements, banking products and treatment decisions are not supplied by these examples.
