import type { LearningProgress, WordReview } from '../../types'
import { addDays, dayKey } from '../../utils/date'

// A small SM-2 style scheduler: correct answers push a word further out, mistakes bring it back tomorrow.
export function scheduleNew(reviews: Record<string, WordReview>, wordIds: string[]) {
  const due = dayKey(addDays(new Date(), 1))
  const next = { ...reviews }
  for (const id of wordIds) next[id] ??= { due, interval: 1, ease: 2.5 }
  return next
}

export function applyReview(review: WordReview | undefined, correct: boolean): WordReview {
  const current = review ?? { due: dayKey(), interval: 0, ease: 2.5 }
  const ease = correct ? Math.min(3, current.ease + 0.1) : Math.max(1.3, current.ease - 0.2)
  const interval = correct ? Math.max(1, Math.round(current.interval * ease)) : 1
  return { due: dayKey(addDays(new Date(), interval)), interval, ease }
}

export function dueWordIds(progress: LearningProgress, today = dayKey()) {
  return progress.learnedWords.filter((id) => {
    const review = progress.reviews[id]
    return !review || review.due <= today
  })
}
