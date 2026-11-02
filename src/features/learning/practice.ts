import { getLesson, isLessonAvailable, lessons } from '../../data/curriculum'
import type { Exercise, LearningProgress, Lesson, ListeningExercise, SentenceBuildExercise, VocabularyItem } from '../../types'
import { shuffle } from '../../utils/shuffle'

const modes = {
  quick: { title: 'Quick Challenge', minutes: 2 },
  listening: { title: 'Listening Nook', minutes: 3 },
  sentences: { title: 'Build a Sentence', minutes: 3 },
  difficult: { title: 'Tricky words', minutes: 3 },
}
export type PracticeMode = keyof typeof modes

const availableLessons = () => lessons.filter(isLessonAvailable)
export const allVocabulary = () => availableLessons().flatMap((l) => l.vocabulary)
export const spoken = (v: VocabularyItem) => v.pt.split(' / ')[0]

function wordPool(progress: LearningProgress) {
  const learned = allVocabulary().filter((v) => progress.learnedWords.includes(v.id))
  return learned.length >= 4 ? learned : allVocabulary()
}

function listeningExercises(items: VocabularyItem[]): ListeningExercise[] {
  const all = allVocabulary()
  return items.map((v) => {
    const options = shuffle([v.en, ...shuffle(all.filter((o) => o.id !== v.id)).slice(0, 2).map((o) => o.en)])
    return {
      id: `listen-${v.id}`,
      type: 'listening',
      prompt: 'What did you hear?',
      audioText: spoken(v),
      options,
      answer: options.indexOf(v.en),
      explanation: `You heard “${spoken(v)}” — ${v.en}.`,
    }
  })
}

function sentenceExercises(): SentenceBuildExercise[] {
  const fromLessons = availableLessons()
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
      exercises = shuffle(availableLessons().flatMap((l) => l.exercises).filter((e) => e.type !== 'matching')).slice(0, 5)
      break
    case 'listening':
      exercises = listeningExercises(shuffle(wordPool(progress)).slice(0, 5))
      break
    case 'sentences':
      exercises = shuffle(sentenceExercises()).slice(0, 5)
      break
    case 'difficult': {
      const hard = allVocabulary().filter((v) => progress.difficultWords.includes(v.id))
      exercises = listeningExercises(shuffle(hard.length ? hard : wordPool(progress)).slice(0, 5))
    }
  }
  return { id: `practice-${mode}`, destinationId: 'practice', title: modes[mode].title, objective: '', intro: '', minutes: modes[mode].minutes, xp: 10, skills: [], vocabulary: [], exercises }
}

export function resolveLesson(id: string, progress: LearningProgress) {
  const mode = id.replace(/^practice-/, '')
  if (id.startsWith('practice-')) return mode in modes ? buildPractice(mode as PracticeMode, progress) : undefined
  return getLesson(id)
}
