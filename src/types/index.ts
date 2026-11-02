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

export type Exercise = MultipleChoiceExercise | FillBlankExercise | SentenceBuildExercise | MatchingExercise | ListeningExercise

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
  lessonId: string
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
  experience?: string
  dailyGoalMinutes: 5 | 10 | 15 | 20
  onboarded: boolean
}

export interface LearningProgress {
  xp: number
  completedLessons: Record<string, string> // lessonId -> ISO date
  learnedWords: string[]
  difficultWords: string[]
  activeDays: string[] // YYYY-MM-DD
  minutesByDay: Record<string, number>
  questDays: string[] // days the daily quest bonus was claimed
  achievements: string[]
}

export interface UserStatistics {
  totalXp: number
  streak: number
  lessonsCompleted: number
  wordsLearned: number
  rank: string
}
