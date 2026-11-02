import { getLesson } from '../../data/curriculum'
import { destinations } from '../../data/destinations'
import type { Destination, LearningProgress } from '../../types'

export function destinationCompletion(destination: Destination, progress: LearningProgress) {
  if (destination.lessonIds.length === 0) return 0
  const done = destination.lessonIds.filter((id) => id in progress.completedLessons).length
  return Math.round((done / destination.lessonIds.length) * 100)
}

export function isDestinationUnlocked(destination: Destination, progress: LearningProgress) {
  if (destination.unlocked) return true
  const rule = destination.unlockRule
  const source = rule && destinations.find((d) => d.id === rule.destinationId)
  if (!rule || !source) return false
  return source.lessonIds.filter((id) => id in progress.completedLessons).length >= rule.lessonsCompleted
}

export function unlockHint(destination: Destination) {
  const rule = destination.unlockRule
  const source = rule && destinations.find((d) => d.id === rule.destinationId)
  return rule && source
    ? `Complete ${rule.lessonsCompleted} lessons in ${source.name} to unlock it.`
    : 'This destination is still being prepared. Keep exploring!'
}

export const destinationLessons = (destination: Destination) =>
  destination.lessonIds.map(getLesson).filter((l) => l !== undefined)
