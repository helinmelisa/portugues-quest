import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { destinations } from '../../data/destinations'
import { questForDay } from '../../data/quests'
import { speech } from '../../services/speech'
import { storage } from '../../services/storage'
import type { LearningProgress, Lesson, UserProfile } from '../../types'
import { useCloudSync } from '../sync/useCloudSync'
import { applyReview } from '../vocabulary/srs'
import { newlyUnlocked } from '../achievements/achievements'
import { isDestinationUnlocked } from './destinationProgress'
import { completeLesson as applyLesson, defaultProfile, emptyProgress, rankFor, statsFor } from './progress'
import { ProgressContext } from './progressContext'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => storage.load('progress', emptyProgress))
  const [profile, setProfile] = useState(() => storage.load('profile', defaultProfile))

  useEffect(() => storage.save('progress', progress), [progress])
  useEffect(() => {
    storage.save('profile', profile)
    speech.rate = profile.audioRate ?? speech.rate
  }, [profile])

  const completeLesson = useCallback(
    (lesson: Lesson) => {
      const result = applyLesson(progress, lesson, questForDay())
      const unlocked = newlyUnlocked(result.progress)
      const next = { ...result.progress, achievements: [...result.progress.achievements, ...unlocked.map((a) => a.id)] }
      setProgress(next)

      const before = rankFor(progress.xp).current.name
      const after = rankFor(next.xp).current.name
      const unlockedDestinations = destinations
        .filter((d) => !isDestinationUnlocked(d, progress) && isDestinationUnlocked(d, next))
        .map((d) => d.name)
      return { xpEarned: result.xpEarned, achievements: unlocked, newRank: after !== before ? after : undefined, unlockedDestinations }
    },
    [progress],
  )

  const updateProfile = useCallback((changes: Partial<UserProfile>) => setProfile((p) => ({ ...p, ...changes })), [])

  const toggleDifficult = useCallback(
    (id: string) =>
      setProgress((p) => ({
        ...p,
        difficultWords: p.difficultWords.includes(id) ? p.difficultWords.filter((w) => w !== id) : [...p.difficultWords, id],
      })),
    [],
  )

  const reviewWord = useCallback(
    (id: string, correct: boolean) =>
      setProgress((p) => ({ ...p, reviews: { ...p.reviews, [id]: applyReview(p.reviews[id], correct) } })),
    [],
  )

  const replaceAll = useCallback((data: { progress: LearningProgress; profile: UserProfile }) => {
    setProgress({ ...emptyProgress, ...data.progress })
    setProfile({ ...defaultProfile, ...data.profile })
  }, [])

  const syncData = useMemo(() => ({ progress, profile }), [progress, profile])
  const cloud = useCloudSync(syncData, replaceAll)

  const value = useMemo(
    () => ({
      progress,
      profile,
      stats: statsFor(progress),
      completeLesson,
      updateProfile,
      toggleDifficult,
      reviewWord,
      replaceAll,
      cloud,
      reset: () => {
        setProgress(emptyProgress)
        setProfile(defaultProfile)
      },
    }),
    [progress, profile, completeLesson, updateProfile, toggleDifficult, reviewWord, replaceAll, cloud],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
