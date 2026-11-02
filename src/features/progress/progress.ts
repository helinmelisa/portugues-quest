import type { LearningProgress, Lesson, UserStatistics } from '../../types'
import { addDays, dayKey } from '../../utils/date'

export const emptyProgress: LearningProgress = {
  xp: 0,
  completedLessons: {},
  learnedWords: [],
  difficultWords: [],
  activeDays: [],
  achievements: [],
}

export const XP = { repeatLessonFactor: 0.5 }

export const ranks = [
  { name: 'Newcomer', minXp: 0 },
  { name: 'Curious Explorer', minXp: 100 },
  { name: 'Little Adventurer', minXp: 300 },
  { name: 'Local Friend', minXp: 700 },
  { name: 'Portuguese Companion', minXp: 1500 },
]

export function rankFor(xp: number) {
  const index = ranks.findLastIndex((r) => xp >= r.minXp)
  return { current: ranks[index], next: ranks[index + 1] }
}

// Counts consecutive active days ending today — or yesterday, so the streak
// isn't "lost" before the learner has had a chance to practise today.
export function computeStreak(activeDays: string[], today = new Date()) {
  const days = new Set(activeDays)
  let cursor = days.has(dayKey(today)) ? today : addDays(today, -1)
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function completeLesson(progress: LearningProgress, lesson: Lesson): { progress: LearningProgress; xpEarned: number } {
  const repeat = lesson.id in progress.completedLessons
  const xpEarned = repeat ? Math.round(lesson.xp * XP.repeatLessonFactor) : lesson.xp
  const today = dayKey()

  return {
    xpEarned,
    progress: {
      ...progress,
      xp: progress.xp + xpEarned,
      completedLessons: { ...progress.completedLessons, [lesson.id]: progress.completedLessons[lesson.id] ?? today },
      learnedWords: [...new Set([...progress.learnedWords, ...lesson.vocabulary.map((v) => v.id)])],
      activeDays: progress.activeDays.includes(today) ? progress.activeDays : [...progress.activeDays, today],
    },
  }
}

export function statsFor(progress: LearningProgress): UserStatistics {
  return {
    totalXp: progress.xp,
    streak: computeStreak(progress.activeDays),
    lessonsCompleted: Object.keys(progress.completedLessons).length,
    wordsLearned: progress.learnedWords.length,
    rank: rankFor(progress.xp).current.name,
  }
}
