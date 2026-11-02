import { createContext } from 'react'
import type { LearningProgress, Lesson, UserStatistics } from '../../types'

export interface ProgressContextValue {
  progress: LearningProgress
  stats: UserStatistics
  completeLesson: (lesson: Lesson) => number
  reset: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
