import { getLesson, isLessonAvailable, lessons } from '../../data/curriculum'
import type { PronunciationExercise, Exercise, LearningProgress, Lesson, ListeningExercise, MultipleChoiceExercise, SentenceBuildExercise, VocabularyItem } from '../../types'
import { dueWordIds } from '../vocabulary/srs'
import { shuffle } from '../../utils/shuffle'
import { dialogues, dialogueAudio, getDialogue } from '../../data/dialogues'
import { getRealText } from '../../data/realTexts'
import { vidaLessons } from '../../data/curriculum/vida'
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
  focus: { title: 'Focus review', minutes: 5 },
  mistakes: { title: 'Mistake notebook', minutes: 3 },
}
export type PracticeMode = keyof typeof modes

const availableLessons = (progress?: LearningProgress) =>
  lessons.filter((l) => {
    const destination = destinations.find((d) => d.id === l.destinationId)
    return isLessonAvailable(l) && (!progress || (l.destinationId === 'vida' || (destination !== undefined && isDestinationUnlocked(destination, progress))))
  })
export const allVocabulary = (): VocabularyItem[] => [...availableLessons().flatMap((l) => l.vocabulary), ...dialogues.flatMap((d) => d.vocabulary)]
export const vocabularyFor = (progress: LearningProgress) => [...allVocabulary(), ...progress.customWords]
export const spoken = (v: VocabularyItem) => v.pt.split(' / ')[0]

function wordPool(progress: LearningProgress) {
  const learned = vocabularyFor(progress).filter((v) => progress.learnedWords.includes(v.id))
  return learned.length >= 4 ? learned : availableLessons(progress).flatMap((l) => l.vocabulary)
}

function listeningExercises(items: VocabularyItem[]): ListeningExercise[] {
  const all = allVocabulary()
  return items.map((v) => {
    const options = shuffle([v.en, ...shuffle([...new Set(all.filter((o) => o.en !== v.en).map((o) => o.en))]).slice(0, 2)])
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
  const options = shuffle([v.en, ...shuffle([...new Set(allVocabulary().filter((o) => o.en !== v.en).map((o) => o.en))]).slice(0, 2)])
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
  const fromExamples = availableLessons(progress).flatMap((lesson) => lesson.vocabulary).flatMap((v): SentenceBuildExercise[] => {
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
    case 'focus': {
      const words = vocabularyFor(progress)
      const due = new Set(dueWordIds(progress))
      const priority = [
        ...words.filter((w) => due.has(w.id) && progress.difficultWords.includes(w.id)),
        ...words.filter((w) => due.has(w.id)),
        ...words.filter((w) => progress.difficultWords.includes(w.id)),
      ]
      const unique = [...new Map(priority.map((w) => [w.id, w])).values()]
      const corrections: Exercise[] = progress.mistakes.slice(-2).map((m) => ({ id: `focus-${m.id}`, type: 'sentence-build', prompt: 'Practise a correction from your notebook', translation: m.why, words: m.better.split(' '), distractors: [], explanation: `Instead of “${m.said}”, try “${m.better}”. ${m.why}` }))
      const candidates = unique.length ? unique : shuffle(wordPool(progress))
      exercises = [...corrections, ...candidates.slice(0, 8 - corrections.length).map((w, i) => i % 2 ? meaningExercise(w) : listeningExercises([w])[0])]
      break
    }
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
    .filter((l) => A1_DESTINATIONS.includes(l.destinationId) && l.level !== 'A2')
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

export const a2CheckpointAvailable = (progress: LearningProgress) =>
  vidaLessons.every((l) => l.id in progress.completedLessons) &&
  lessons.filter((l) => l.destinationId === 'madeira' && l.id in progress.completedLessons).length >= 2

function a2Checkpoint(): Lesson {
  // One question per topic, plus dedicated reading and past-tense questions.
  const exercises = vidaLessons.map((l) => shuffle(l.exercises.filter((e) => ['fill-blank', 'listening', 'sentence-build'].includes(e.type)))[0])
  const reading = ['rental', 'sms', 'bill'].map((id) => {
    const text = getRealText(id)!
    const question = text.questions[1]
    return { id: `a2-text-${id}`, type: 'multiple-choice' as const, ...question, prompt: `${text.text}\n\n${question.prompt}` }
  })
  const past = shuffle(lessons.filter((l) => l.destinationId === 'madeira').flatMap((l) => l.exercises).filter((e) => e.type === 'fill-blank')).slice(0, 3)
  return { id: 'checkpoint-A2', destinationId: 'practice', title: 'A2 checkpoint', objective: '', intro: '', minutes: 12, xp: 60, skills: ['grammar', 'reading', 'listening'], vocabulary: [], exercises: shuffle([...exercises, ...reading, ...past]) }
}

function textQuiz(id: string): Lesson | undefined {
  const text = getRealText(id)
  if (!text) return undefined
  return { id: `text-${id}`, destinationId: 'practice', title: text.title, objective: '', intro: '', minutes: 3, xp: 15, skills: ['reading'], vocabulary: [], exercises: text.questions.map((q, i) => ({ id: `text-${id}-${i}`, type: 'multiple-choice', ...q, prompt: `${text.text}\n\n${q.prompt}` })) }
}

function dialogueQuiz(id: string): Lesson | undefined {
  const dialogue = getDialogue(id)
  if (!dialogue) return undefined
  return { id: `dialogue-${id}`, destinationId: 'dialogues', title: dialogue.title, objective: dialogue.objective, intro: '', minutes: 6, xp: 20, skills: ['listening', 'reading'], vocabulary: dialogue.vocabulary, exercises: dialogue.questions.map((q, i) => ({ id: `dialogue-${id}-${i}`, type: 'listening', audioText: dialogueAudio(dialogue), ...q })) }
}

export function resolveLesson(id: string, progress: LearningProgress) {
  if (id === 'checkpoint-A1') return checkpointAvailable(progress) ? checkpoint() : undefined
  if (id === 'checkpoint-A2') return a2CheckpointAvailable(progress) ? a2Checkpoint() : undefined
  if (id.startsWith('dialogue-')) return dialogueQuiz(id.slice('dialogue-'.length))
  if (id.startsWith('text-')) return textQuiz(id.slice('text-'.length))
  if (id.startsWith('story-')) return storyQuiz(id.slice('story-'.length))
  const mode = id.replace(/^practice-/, '')
  if (id.startsWith('practice-')) return mode in modes ? buildPractice(mode as PracticeMode, progress) : undefined
  return getLesson(id)
}
