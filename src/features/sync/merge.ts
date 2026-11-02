import type { LearningProgress, UserProfile } from '../../types'

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])]

// Combine progress from two devices without losing anything either one learned.
export function mergeProgress(a: LearningProgress, b: LearningProgress): LearningProgress {
  const completedLessons = { ...a.completedLessons }
  for (const [id, date] of Object.entries(b.completedLessons)) {
    if (!completedLessons[id] || date < completedLessons[id]) completedLessons[id] = date
  }
  const minutesByDay = { ...a.minutesByDay }
  for (const [day, minutes] of Object.entries(b.minutesByDay)) minutesByDay[day] = Math.max(minutesByDay[day] ?? 0, minutes)
  const reviews = { ...a.reviews }
  for (const [id, review] of Object.entries(b.reviews)) {
    if (!reviews[id] || review.due > reviews[id].due) reviews[id] = review
  }

  return {
    xp: Math.max(a.xp, b.xp),
    completedLessons,
    learnedWords: union(a.learnedWords, b.learnedWords),
    difficultWords: union(a.difficultWords, b.difficultWords),
    activeDays: union(a.activeDays, b.activeDays).sort(),
    minutesByDay,
    questDays: union(a.questDays, b.questDays),
    reviews,
    achievements: union(a.achievements, b.achievements),
  }
}

export const mergeProfile = (local: UserProfile, remote: UserProfile) => (remote.onboarded ? { ...local, ...remote } : local)
