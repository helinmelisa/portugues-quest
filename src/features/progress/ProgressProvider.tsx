import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { storage } from '../../services/storage'
import type { Lesson } from '../../types'
import { completeLesson as applyLesson, emptyProgress, statsFor } from './progress'
import { ProgressContext } from './progressContext'

const KEY = 'progress'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => storage.load(KEY, emptyProgress))

  useEffect(() => storage.save(KEY, progress), [progress])

  const completeLesson = useCallback(
    (lesson: Lesson) => {
      const result = applyLesson(progress, lesson)
      setProgress(result.progress)
      return result.xpEarned
    },
    [progress],
  )

  const value = useMemo(
    () => ({ progress, stats: statsFor(progress), completeLesson, reset: () => setProgress(emptyProgress) }),
    [progress, completeLesson],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
