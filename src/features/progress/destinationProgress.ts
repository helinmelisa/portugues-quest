import { getLesson } from '../../data/curriculum'
import type { Destination, LearningProgress } from '../../types'

export function destinationCompletion(destination: Destination, progress: LearningProgress) {
  if (destination.lessonIds.length === 0) return 0
  const done = destination.lessonIds.filter((id) => id in progress.completedLessons).length
  return Math.round((done / destination.lessonIds.length) * 100)
}

export const destinationLessons = (destination: Destination) =>
  destination.lessonIds.map(getLesson).filter((l) => l !== undefined)
