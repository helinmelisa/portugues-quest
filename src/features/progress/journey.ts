import { destinations } from '../../data/destinations'
import type { LearningProgress } from '../../types'
import { destinationLessons, isDestinationUnlocked } from './destinationProgress'

// Learning order follows the unlock rules rather than north-to-south map order.
export const journeyIds = ['lisboa', 'porto', 'coimbra', 'aveiro', 'braga', 'sintra', 'algarve', 'madeira']
export const journey = journeyIds.flatMap((id) => destinations.filter((destination) => destination.id === id))

export function nextJourneyStop(progress: LearningProgress) {
  return journey.find((destination) => isDestinationUnlocked(destination, progress) &&
    destination.lessonIds.some((id) => !(id in progress.completedLessons)))
}

export function nextJourneyLesson(progress: LearningProgress) {
  const destination = nextJourneyStop(progress)
  const lesson = destination && destinationLessons(destination).find((item) => !(item.id in progress.completedLessons))
  return destination && lesson ? { destination, lesson } : undefined
}

export function followingDestination(id: string) {
  const index = journey.findIndex((destination) => destination.id === id)
  return index >= 0 ? journey[index + 1] : undefined
}
