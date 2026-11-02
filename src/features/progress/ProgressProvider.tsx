import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { questForDay } from '../../data/quests'
import { storage } from '../../services/storage'
import type { Lesson, UserProfile } from '../../types'
import { newlyUnlocked } from '../achievements/achievements'
import { completeLesson as applyLesson, defaultProfile, emptyProgress, rankFor, statsFor } from './progress'
import { ProgressContext } from './progressContext'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => storage.load('progress', emptyProgress))
  const [profile, setProfile] = useState(() => storage.load('profile', defaultProfile))

  useEffect(() => storage.save('progress', progress), [progress])
  useEffect(() => storage.save('profile', profile), [profile])

  const completeLesson = useCallback(
    (lesson: Lesson) => {
      const result = applyLesson(progress, lesson, questForDay())
      const unlocked = newlyUnlocked(result.progress)
      const next = { ...result.progress, achievements: [...result.progress.achievements, ...unlocked.map((a) => a.id)] }
      setProgress(next)

      const before = rankFor(progress.xp).current.name
      const after = rankFor(next.xp).current.name
      return { xpEarned: result.xpEarned, achievements: unlocked, newRank: after !== before ? after : undefined }
    },
    [progress],
  )

  const updateProfile = useCallback((changes: Partial<UserProfile>) => setProfile((p) => ({ ...p, ...changes })), [])

  const value = useMemo(
    () => ({
      progress,
      profile,
      stats: statsFor(progress),
      completeLesson,
      updateProfile,
      reset: () => {
        setProgress(emptyProgress)
        setProfile(defaultProfile)
      },
    }),
    [progress, profile, completeLesson, updateProfile],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
