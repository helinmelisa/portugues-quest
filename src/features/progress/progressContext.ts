import { createContext } from 'react'
import type { Achievement, LearningProgress, Lesson, UserProfile, UserStatistics } from '../../types'

export interface LessonResult {
  xpEarned: number
  achievements: Achievement[]
  newRank?: string
  unlockedDestinations: string[]
}

export interface ProgressContextValue {
  progress: LearningProgress
  stats: UserStatistics
  profile: UserProfile
  completeLesson: (lesson: Lesson) => LessonResult
  updateProfile: (changes: Partial<UserProfile>) => void
  toggleDifficult: (wordId: string) => void
  reset: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
