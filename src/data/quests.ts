import type { DailyQuest } from '../types'
import { dayKey } from '../utils/date'

export const quests: DailyQuest[] = [
  { id: 'q-coffee', kind: 'lesson', lessonId: 'porto-coffee', title: 'One coffee, please!', description: 'Pop into a cozy café in Porto and learn how to order your favourite drink.', difficulty: 'easy', bonusXp: 15 },
  { id: 'q-hello', kind: 'lesson', lessonId: 'lisboa-hello', title: 'Good morning, neighbour!', description: 'Your new neighbour in Lisboa says hello on the stairs. Greet them like a local.', difficulty: 'easy', bonusXp: 15 },
  { id: 'q-chat', kind: 'conversation', scenarioId: 'coffee', title: 'Chat with Inês', description: 'Have a little conversation with Inês at her café in Porto — or pick any scenario you like.', difficulty: 'easy', bonusXp: 15 },
]

export function questForDay(day = dayKey()) {
  const n = [...day].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return quests[n % quests.length]
}
