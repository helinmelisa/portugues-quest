import type { Achievement, LearningProgress } from '../../types'
import { computeStreak } from '../progress/progress'

interface AchievementRule extends Achievement {
  unlocked: (p: LearningProgress) => boolean
}

const done = (p: LearningProgress, id: string) => id in p.completedLessons

export const achievements: AchievementRule[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first lesson.', icon: 'footprints', unlocked: (p) => Object.keys(p.completedLessons).length > 0 },
  { id: 'ola-lisboa', title: 'Olá, Lisboa!', description: 'Learn to say hello in Lisboa.', icon: 'tram', unlocked: (p) => done(p, 'lisboa-hello') },
  { id: 'cafe-explorer', title: 'Café Explorer', description: 'Complete your first café quest.', icon: 'coffee', unlocked: (p) => done(p, 'porto-coffee') },
  { id: 'quest-seeker', title: 'Quest Seeker', description: 'Finish a daily quest.', icon: 'compass', unlocked: (p) => p.questDays.length > 0 },
  { id: 'first-conversation', title: 'First Conversation', description: 'Finish a conversation with Inês.', icon: 'conversation', unlocked: (p) => p.conversations > 0 },
  { id: 'weekly-champion', title: 'Weekly Champion', description: 'Complete a weekly challenge.', icon: 'trophy', unlocked: (p) => p.weeklyClaimed.length > 0 },
  { id: 'a2-explorer', title: 'A2 Explorer', description: 'Pass the A2 checkpoint.', icon: 'graduation', unlocked: (p) => 'A2' in p.certificates },
  { id: 'a1-explorer', title: 'A1 Explorer', description: 'Pass the A1 checkpoint.', icon: 'graduation', unlocked: (p) => 'A1' in p.certificates },
  { id: 'consistent-explorer', title: 'Consistent Explorer', description: 'Learn five days in a row.', icon: 'flame', unlocked: (p) => computeStreak(p.activeDays) >= 5 },
  { id: 'palavra-collector', title: 'Palavra Collector', description: 'Learn 50 words.', icon: 'leaf', unlocked: (p) => p.learnedWords.length >= 50 },
  { id: 'getting-around', title: 'Getting Around', description: 'Complete every lesson in Aveiro.', icon: 'train', unlocked: (p) => ['aveiro-transport', 'aveiro-tickets', 'aveiro-directions', 'aveiro-travel'].every((id) => done(p, id)) },
]

export function newlyUnlocked(progress: LearningProgress) {
  return achievements.filter((a) => !progress.achievements.includes(a.id) && a.unlocked(progress))
}
