import type { DailyQuest, LearningProgress, Lesson, UserProfile, UserStatistics } from '../../types'
import { addDays, dayKey } from '../../utils/date'
import { scheduleNew } from '../vocabulary/srs'
import { recordActivity } from './weekly'

export const emptyProgress: LearningProgress = {
  xp: 0,
  completedLessons: {},
  learnedWords: [],
  difficultWords: [],
  activeDays: [],
  minutesByDay: {},
  questDays: [],
  reviews: {},
  conversations: 0,
  activityByDay: {},
  weeklyClaimed: [],
  storiesRead: [],
  certificates: {},
  writingDrafts: {},
  mistakes: [],
  customWords: [],
  achievements: [],
}

export const defaultProfile: UserProfile = {
  interfaceLanguage: 'en',
  level: 'A0',
  dailyGoalMinutes: 10,
  onboarded: false,
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

export function completeLesson(
  progress: LearningProgress,
  lesson: Lesson,
  quest?: DailyQuest,
): { progress: LearningProgress; xpEarned: number } {
  const today = dayKey()
  const isPractice = lesson.destinationId === 'practice'
  const repeat = lesson.id in progress.completedLessons
  const questBonus = quest?.kind === 'lesson' && quest.lessonId === lesson.id && !progress.questDays.includes(today) ? quest.bonusXp : 0
  const xpEarned = (repeat ? Math.round(lesson.xp * XP.repeatLessonFactor) : lesson.xp) + questBonus

  return {
    xpEarned,
    progress: {
      ...progress,
      xp: progress.xp + xpEarned,
      completedLessons: isPractice ? progress.completedLessons : { ...progress.completedLessons, [lesson.id]: progress.completedLessons[lesson.id] ?? today },
      learnedWords: [...new Set([...progress.learnedWords, ...lesson.vocabulary.map((v) => v.id)])],
      activeDays: progress.activeDays.includes(today) ? progress.activeDays : [...progress.activeDays, today],
      minutesByDay: { ...progress.minutesByDay, [today]: (progress.minutesByDay[today] ?? 0) + lesson.minutes },
      activityByDay: recordActivity(progress, 'lessons'),
      storiesRead: lesson.id.startsWith('story-') && !progress.storiesRead.includes(lesson.id) ? [...progress.storiesRead, lesson.id] : progress.storiesRead,
      reviews: isPractice ? progress.reviews : scheduleNew(progress.reviews, lesson.vocabulary.map((v) => v.id)),
      questDays: questBonus ? [...progress.questDays, today] : progress.questDays,
    },
  }
}

export const CONVERSATION_XP = 15

export function completeConversation(progress: LearningProgress, quest?: DailyQuest) {
  const today = dayKey()
  const questBonus = quest?.kind === 'conversation' && !progress.questDays.includes(today) ? quest.bonusXp : 0
  const xpEarned = CONVERSATION_XP + questBonus
  return {
    xpEarned,
    progress: {
      ...progress,
      xp: progress.xp + xpEarned,
      conversations: progress.conversations + 1,
      activityByDay: recordActivity(progress, 'conversations'),
      activeDays: progress.activeDays.includes(today) ? progress.activeDays : [...progress.activeDays, today],
      minutesByDay: { ...progress.minutesByDay, [today]: (progress.minutesByDay[today] ?? 0) + 5 },
      questDays: questBonus ? [...progress.questDays, today] : progress.questDays,
    },
  }
}

export const customWordId = (pt: string) =>
  'custom-' + pt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function statsFor(progress: LearningProgress): UserStatistics {
  return {
    totalXp: progress.xp,
    streak: computeStreak(progress.activeDays),
    lessonsCompleted: Object.keys(progress.completedLessons).length,
    wordsLearned: progress.learnedWords.length,
    rank: rankFor(progress.xp).current.name,
  }
}
