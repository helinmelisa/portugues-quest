import { getLesson, isLessonAvailable, lessons } from '../../data/curriculum'
import type { PronunciationExercise, Exercise, LearningProgress, Lesson, ListeningExercise, MultipleChoiceExercise, SentenceBuildExercise, VocabularyItem } from '../../types'
import { dueWordIds } from '../vocabulary/srs'
import { shuffle } from '../../utils/shuffle'
import { getStory } from '../../data/stories'
import { destinations } from '../../data/destinations'
import { isDestinationUnlocked } from '../progress/destinationProgress'

const modes = {
  quick: { title: 'Quick Challenge', minutes: 2 },
  listening: { title: 'Listening Nook', minutes: 3 },
  sentences: { title: 'Build a Sentence', minutes: 3 },
  difficult: { title: 'Tricky words', minutes: 3 },
  review: { title: 'Daily review', minutes: 4 },
  speak: { title: 'Speak out loud', minutes: 3 },
  mistakes: { title: 'Mistake notebook', minutes: 3 },
}
export type PracticeMode = keyof typeof modes

const availableLessons = (progress?: LearningProgress) =>
  lessons.filter((l) => {
    const destination = destinations.find((d) => d.id === l.destinationId)
    return isLessonAvailable(l) && (!progress || (l.destinationId === 'vida' || (destination !== undefined && isDestinationUnlocked(destination, progress))))
  })
export const allVocabulary = () => availableLessons().flatMap((l) => l.vocabulary)
export const vocabularyFor = (progress: LearningProgress) => [...allVocabulary(), ...progress.customWords]
export const spoken = (v: VocabularyItem) => v.pt.split(' / ')[0]

function wordPool(progress: LearningProgress) {
  const learned = vocabularyFor(progress).filter((v) => progress.learnedWords.includes(v.id))
  return learned.length >= 4 ? learned : allVocabulary()
}

function listeningExercises(items: VocabularyItem[]): ListeningExercise[] {
  const all = allVocabulary()
  return items.map((v) => {
    const options = shuffle([v.en, ...shuffle(all.filter((o) => o.id !== v.id)).slice(0, 2).map((o) => o.en)])
    return {
      id: `listen-${v.id}`,
      wordId: v.id,
      type: 'listening',
      prompt: 'What did you hear?',
      audioText: spoken(v),
      options,
      answer: options.indexOf(v.en),
      explanation: `You heard “${spoken(v)}” — ${v.en}.`,
    }
  })
}

function meaningExercise(v: VocabularyItem): MultipleChoiceExercise {
  const options = shuffle([v.en, ...shuffle(allVocabulary().filter((o) => o.id !== v.id)).slice(0, 2).map((o) => o.en)])
  return { id: `meaning-${v.id}`, wordId: v.id, type: 'multiple-choice', prompt: `What does “${v.pt}” mean?`, options, answer: options.indexOf(v.en), explanation: `“${v.pt}” means “${v.en}”.` }
}

function speakingExercises(items: VocabularyItem[]): PronunciationExercise[] {
  return items
    .filter((v) => v.example || !v.pt.includes('…'))
    .map((v) => ({
      id: `speak-${v.id}`,
      type: 'pronunciation',
      prompt: 'Say it out loud',
      phrase: v.example?.pt ?? spoken(v),
      translation: v.example?.en ?? v.en,
      explanation: v.pronunciation ? `Pronunciation guide: /${v.pronunciation}/` : `“${spoken(v)}” — ${v.en}.`,
    }))
}

function sentenceExercises(progress: LearningProgress): SentenceBuildExercise[] {
  const fromLessons = availableLessons(progress)
    .flatMap((l) => l.exercises)
    .filter((e): e is SentenceBuildExercise => e.type === 'sentence-build')
  const fromExamples = allVocabulary().flatMap((v): SentenceBuildExercise[] => {
    if (!v.example) return []
    const words = v.example.pt.split(' ')
    const lower = words.map((w) => w.toLowerCase())
    return [{
      id: `build-${v.id}`,
      type: 'sentence-build',
      prompt: 'Build the sentence',
      translation: v.example.en,
      words,
      distractors: shuffle(['um', 'uma', 'bom', 'boa', 'sou'].filter((w) => !lower.includes(w))).slice(0, 2),
      explanation: `“${v.example.pt}” — ${v.example.en}`,
    }]
  })
  return [...fromLessons, ...fromExamples]
}

function buildPractice(mode: PracticeMode, progress: LearningProgress): Lesson {
  let exercises: Exercise[]
  switch (mode) {
    case 'quick':
      exercises = shuffle(availableLessons(progress).flatMap((l) => l.exercises).filter((e) => e.type !== 'matching')).slice(0, 5)
      break
    case 'listening':
      exercises = listeningExercises(shuffle(wordPool(progress)).slice(0, 5))
      break
    case 'sentences':
      exercises = shuffle(sentenceExercises(progress)).slice(0, 5)
      break
    case 'difficult': {
      const hard = vocabularyFor(progress).filter((v) => progress.difficultWords.includes(v.id))
      exercises = listeningExercises(shuffle(hard.length ? hard : wordPool(progress)).slice(0, 5))
      break
    }
    case 'speak':
      exercises = speakingExercises(shuffle(wordPool(progress))).slice(0, 5)
      break
    case 'mistakes':
      exercises = shuffle(progress.mistakes)
        .slice(0, 6)
        .map((m, i): Exercise => {
          const said = m.said.split(' ')
          return i % 2
            ? { id: `mistake-build-${m.id}`, type: 'sentence-build', prompt: 'Build the natural version', translation: `Not “${m.said}”…`, words: m.better.split(' '), distractors: said.filter((w) => !m.better.split(' ').includes(w)).slice(0, 2), explanation: m.why }
            : (() => {
                const options = shuffle([m.better, m.said])
                return { id: `mistake-mc-${m.id}`, type: 'multiple-choice', prompt: 'Which one sounds like European Portuguese?', options, answer: options.indexOf(m.better), explanation: m.why }
              })()
        })
      break
    case 'review': {
      const due = new Set(dueWordIds(progress))
      const words = vocabularyFor(progress).filter((v) => due.has(v.id))
      exercises = shuffle(words.length ? words : wordPool(progress))
        .slice(0, 8)
        .map((v, i) => (i % 2 ? meaningExercise(v) : listeningExercises([v])[0]))
    }
  }
  return { id: `practice-${mode}`, destinationId: 'practice', title: modes[mode].title, objective: '', intro: '', minutes: modes[mode].minutes, xp: 10, skills: [], vocabulary: [], exercises }
}

function storyQuiz(id: string): Lesson | undefined {
  const story = getStory(id)
  if (!story) return undefined
  return {
    id: `story-${story.id}`,
    destinationId: 'practice',
    title: story.title,
    objective: '',
    intro: '',
    minutes: 3,
    xp: 15,
    skills: ['listening', 'reading'],
    vocabulary: [],
    exercises: story.questions.map((q, i) => ({ id: `${story.id}-q${i}`, type: 'multiple-choice', ...q })),
  }
}

export const CHECKPOINT_PASS = 0.75
const A1_DESTINATIONS = ['lisboa', 'porto', 'coimbra', 'aveiro', 'braga']

// The A1 checkpoint is open once three Braga lessons are done.
export const checkpointAvailable = (progress: LearningProgress) =>
  lessons.filter((l) => l.destinationId === 'braga' && l.id in progress.completedLessons).length >= 3

function checkpoint(): Lesson {
  const pool = lessons
    .filter((l) => A1_DESTINATIONS.includes(l.destinationId))
    .flatMap((l) => l.exercises)
    .filter((e) => e.type !== 'pronunciation' && e.type !== 'matching')
  return {
    id: 'checkpoint-A1',
    destinationId: 'practice',
    title: 'A1 checkpoint',
    objective: '',
    intro: '',
    minutes: 10,
    xp: 50,
    skills: ['vocabulary', 'grammar', 'listening'],
    vocabulary: [],
    exercises: shuffle(pool).slice(0, 12),
  }
}

export function resolveLesson(id: string, progress: LearningProgress) {
  if (id === 'checkpoint-A1') return checkpoint()
  if (id.startsWith('story-')) return storyQuiz(id.slice('story-'.length))
  const mode = id.replace(/^practice-/, '')
  if (id.startsWith('practice-')) return mode in modes ? buildPractice(mode as PracticeMode, progress) : undefined
  return getLesson(id)
}
