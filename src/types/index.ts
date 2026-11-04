export type CefrLevel = 'A0' | 'A1' | 'A2' | 'B1'
export type Skill = 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'grammar' | 'culture'

export interface VocabularyItem {
  id: string
  pt: string
  en: string
  example?: { pt: string; en: string }
  pronunciation?: string
  context?: string
  audioUrl?: string
}

interface BaseExercise {
  id: string
  wordId?: string // set on review exercises so results feed the word's schedule
  prompt: string
  explanation: string
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice'
  options: string[]
  answer: number
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank'
  sentence: string // use ___ for the gap
  translation: string
  options: string[]
  answer: number
}

export interface SentenceBuildExercise extends BaseExercise {
  type: 'sentence-build'
  translation: string
  words: string[] // correct order
  distractors: string[]
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching'
  pairs: [pt: string, en: string][]
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening'
  audioText: string
  options: string[]
  answer: number
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation'
  direction: 'en-pt' | 'pt-en'
  source: string
  answers: string[] // first one is shown as the model answer
}

export interface PronunciationExercise extends BaseExercise {
  type: 'pronunciation'
  phrase: string
  translation: string
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | SentenceBuildExercise
  | MatchingExercise
  | ListeningExercise
  | TranslationExercise
  | PronunciationExercise

export interface Lesson {
  id: string
  destinationId: string
  title: string
  objective: string
  intro: string
  minutes: number
  xp: number
  skills: Skill[]
  vocabulary: VocabularyItem[]
  exercises: Exercise[]
  level?: CefrLevel
  grammarId?: string // optional grammar bite shown in the intro
}

export interface Destination {
  id: string
  name: string
  theme: string
  description: string
  level: CefrLevel
  unlocked: boolean
  unlockRule?: { destinationId: string; lessonsCompleted: number }
  map: { x: number; y: number }
  lessonIds: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
}

export interface DailyQuest {
  id: string
  kind: 'lesson' | 'conversation'
  lessonId?: string
  scenarioId?: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  bonusXp: number
}

export interface UserProfile {
  name?: string
  interfaceLanguage: 'en'
  level: CefrLevel
  motivation?: string
  interests?: string
  experience?: string
  dailyGoalMinutes: 5 | 10 | 15 | 20
  audioRate?: number
  tutorVoice?: boolean // read Inês's replies aloud
  onboarded: boolean
}

export interface Mistake {
  id: string
  said: string
  better: string
  why: string
  date: string
}

export interface WordReview {
  due: string // YYYY-MM-DD
  interval: number // days
  ease: number
}

export interface LearningProgress {
  xp: number
  completedLessons: Record<string, string> // lessonId -> ISO date
  learnedWords: string[]
  difficultWords: string[]
  activeDays: string[] // YYYY-MM-DD
  minutesByDay: Record<string, number>
  questDays: string[] // days the daily quest bonus was claimed
  reviews: Record<string, WordReview>
  conversations: number
  activityByDay: Record<string, { lessons: number; conversations: number }>
  storiesRead: string[]
  certificates: Record<string, string> // level → date passed
  mistakes: Mistake[] // corrections collected from conversations with Inês
  weeklyClaimed: string[] // week keys (Monday dates) whose challenge bonus was claimed
  customWords: VocabularyItem[] // words saved from conversations
  achievements: string[]
}

export interface UserStatistics {
  totalXp: number
  streak: number
  lessonsCompleted: number
  wordsLearned: number
  rank: string
}
