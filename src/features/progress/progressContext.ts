import { createContext } from 'react'
import type { CloudSync } from '../sync/useCloudSync'
import type { Achievement, LearningProgress, Lesson, UserProfile, UserStatistics } from '../../types'

export interface LessonResult {
  xpEarned: number
  achievements: Achievement[]
  newRank?: string
  unlockedDestinations: string[]
  weeklyBonus: number
}

export interface ProgressContextValue {
  progress: LearningProgress
  stats: UserStatistics
  profile: UserProfile
  completeLesson: (lesson: Lesson) => LessonResult
  completeConversation: () => LessonResult
  addCustomWord: (word: { pt: string; en: string }) => void
  addMistakes: (corrections: { said: string; better: string; why: string }[]) => void
  removeMistake: (id: string) => void
  passCheckpoint: (level: string) => void
  updateProfile: (changes: Partial<UserProfile>) => void
  toggleDifficult: (wordId: string) => void
  reviewWord: (wordId: string, correct: boolean) => void
  replaceAll: (data: { progress: LearningProgress; profile: UserProfile }) => void
  reset: () => void
  cloud: CloudSync
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
