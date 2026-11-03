import type { LearningProgress } from '../../types'
import { addDays, dayKey } from '../../utils/date'

type GoalKind = 'lessons' | 'conversations' | 'days'

export interface WeeklyChallenge {
  id: string
  title: string
  description: string
  goals: { kind: GoalKind; target: number; label: string }[]
}

export const WEEKLY_BONUS_XP = 50

const challenges: WeeklyChallenge[] = [
  { id: 'explorer', title: 'Little explorer', description: 'A bit of everything this week.', goals: [{ kind: 'lessons', target: 3, label: 'lessons or practice sessions' }, { kind: 'conversations', target: 1, label: 'chat with Inês' }] },
  { id: 'chatty', title: 'Chatty week', description: 'Let’s talk! Practise speaking with Inês.', goals: [{ kind: 'conversations', target: 3, label: 'chats with Inês' }] },
  { id: 'steady', title: 'Steady steps', description: 'Little and often: show up on different days.', goals: [{ kind: 'days', target: 4, label: 'days of practice' }] },
  { id: 'deep-dive', title: 'Deep dive', description: 'Explore new places and keep your words fresh.', goals: [{ kind: 'lessons', target: 5, label: 'lessons or practice sessions' }] },
]

export const weekKey = (date = new Date()) => dayKey(addDays(date, -((date.getDay() + 6) % 7)))

export function challengeForWeek(week = weekKey()) {
  const n = [...week].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return challenges[n % challenges.length]
}

function weekTotals(progress: LearningProgress, week: string) {
  const start = new Date(`${week}T12:00:00`)
  const days = Array.from({ length: 7 }, (_, i) => dayKey(addDays(start, i)))
  return {
    lessons: days.reduce((sum, d) => sum + (progress.activityByDay[d]?.lessons ?? 0), 0),
    conversations: days.reduce((sum, d) => sum + (progress.activityByDay[d]?.conversations ?? 0), 0),
    days: days.filter((d) => progress.activeDays.includes(d)).length,
  }
}

export function weeklyStatus(progress: LearningProgress, week = weekKey()) {
  const challenge = challengeForWeek(week)
  const totals = weekTotals(progress, week)
  const goals = challenge.goals.map((g) => ({ ...g, current: Math.min(totals[g.kind], g.target) }))
  return { challenge, goals, complete: goals.every((g) => g.current >= g.target), claimed: progress.weeklyClaimed.includes(week) }
}

// Adds the bonus the first time this week's challenge is completed.
export function claimWeekly(progress: LearningProgress) {
  const week = weekKey()
  const status = weeklyStatus(progress, week)
  if (!status.complete || status.claimed) return { progress, bonus: 0 }
  return { progress: { ...progress, xp: progress.xp + WEEKLY_BONUS_XP, weeklyClaimed: [...progress.weeklyClaimed, week] }, bonus: WEEKLY_BONUS_XP }
}

export function recordActivity(progress: LearningProgress, kind: 'lessons' | 'conversations') {
  const today = dayKey()
  const day = progress.activityByDay[today] ?? { lessons: 0, conversations: 0 }
  return { ...progress.activityByDay, [today]: { ...day, [kind]: day[kind] + 1 } }
}
