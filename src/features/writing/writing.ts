import type { Lesson } from '../../types'
import type { WritingTask } from '../../data/writing'

export const wordCount = (text: string) => text.trim().match(/\p{L}[\p{L}\p{M}'’-]*/gu)?.length ?? 0
export const writingActivity = (task: WritingTask): Lesson => ({ id: `writing-${task.id}`, destinationId: 'writing', title: task.title, objective: task.situation, intro: '', minutes: 6, xp: 20, skills: ['grammar', 'reading'], vocabulary: [], exercises: [] })
