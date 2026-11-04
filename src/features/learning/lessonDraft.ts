import { learningStore } from '../sync/learningStore'
import type { Exercise, Lesson } from '../../types'

export interface LessonDraft {
  version: 1
  lesson: Lesson
  queue: Exercise[]
  missed: string[]
  stage: 'intro' | 'exercises'
}
export const draftKey = (id: string) => `pq:v2:${learningStore.getAccount() ?? 'guest'}:draft:${id}`
export function loadDraft(id: string): LessonDraft | null {
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey(id)) ?? 'null')
    return draft?.version === 1 && draft.lesson?.id === id && Array.isArray(draft.queue) && draft.queue.length > 0 && Array.isArray(draft.missed) && ['intro', 'exercises'].includes(draft.stage) ? draft : null
  } catch { return null }
}
