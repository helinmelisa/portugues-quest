import type { Achievement, LearningProgress } from '../../types'
import { computeStreak } from '../progress/progress'

interface AchievementRule extends Achievement {
  unlocked: (p: LearningProgress) => boolean
}

const done = (p: LearningProgress, id: string) => id in p.completedLessons

export const achievements: AchievementRule[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first lesson.', icon: '👣', unlocked: (p) => Object.keys(p.completedLessons).length > 0 },
  { id: 'ola-lisboa', title: 'Olá, Lisboa!', description: 'Learn to say hello in Lisboa.', icon: '🚋', unlocked: (p) => done(p, 'lisboa-hello') },
  { id: 'cafe-explorer', title: 'Café Explorer', description: 'Complete your first café quest.', icon: '☕', unlocked: (p) => done(p, 'porto-coffee') },
  { id: 'quest-seeker', title: 'Quest Seeker', description: 'Finish a daily quest.', icon: '🧭', unlocked: (p) => p.questDays.length > 0 },
  { id: 'first-conversation', title: 'First Conversation', description: 'Finish a conversation with Inês.', icon: '💬', unlocked: (p) => p.conversations > 0 },
  { id: 'weekly-champion', title: 'Weekly Champion', description: 'Complete a weekly challenge.', icon: '🏆', unlocked: (p) => p.weeklyClaimed.length > 0 },
  { id: 'a1-explorer', title: 'A1 Explorer', description: 'Pass the A1 checkpoint.', icon: '🎓', unlocked: (p) => 'A1' in p.certificates },
  { id: 'consistent-explorer', title: 'Consistent Explorer', description: 'Learn five days in a row.', icon: '🔥', unlocked: (p) => computeStreak(p.activeDays) >= 5 },
  { id: 'palavra-collector', title: 'Palavra Collector', description: 'Learn 50 words.', icon: '🌿', unlocked: (p) => p.learnedWords.length >= 50 },
  { id: 'getting-around', title: 'Getting Around', description: 'Complete every lesson in Aveiro.', icon: '🚆', unlocked: (p) => ['aveiro-transport', 'aveiro-tickets', 'aveiro-directions', 'aveiro-travel'].every((id) => done(p, id)) },
]

export function newlyUnlocked(progress: LearningProgress) {
  return achievements.filter((a) => !progress.achievements.includes(a.id) && a.unlocked(progress))
}
