import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { destinations } from '../../data/destinations'
import { questForDay } from '../../data/quests'
import { speech } from '../../services/speech'
import { storage } from '../../services/storage'
import type { LearningProgress, Lesson, UserProfile } from '../../types'
import { dayKey } from '../../utils/date'
import { useCloudSync } from '../sync/useCloudSync'
import { applyReview, scheduleNew } from '../vocabulary/srs'
import { newlyUnlocked } from '../achievements/achievements'
import { isDestinationUnlocked } from './destinationProgress'
import { completeConversation as applyConversation, completeLesson as applyLesson, customWordId, defaultProfile, emptyProgress, rankFor, statsFor } from './progress'
import { ProgressContext, type LessonResult } from './progressContext'
import { claimWeekly } from './weekly'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => storage.load('progress', emptyProgress))
  const [profile, setProfile] = useState(() => storage.load('profile', defaultProfile))

  useEffect(() => {
    storage.save('progress', progress)
  }, [progress])
  useEffect(() => {
    storage.save('profile', profile)
    speech.rate = profile.audioRate ?? speech.rate
  }, [profile])

  // Applies a finished activity: unlocks achievements and reports rank-ups and new destinations.
  const finish = useCallback(
    (result: { progress: LearningProgress; xpEarned: number }): LessonResult => {
      const weekly = claimWeekly(result.progress)
      const unlocked = newlyUnlocked(weekly.progress)
      const next = { ...weekly.progress, achievements: [...weekly.progress.achievements, ...unlocked.map((a) => a.id)] }
      setProgress(next)

      const before = rankFor(progress.xp).current.name
      const after = rankFor(next.xp).current.name
      const unlockedDestinations = destinations
        .filter((d) => !isDestinationUnlocked(d, progress) && isDestinationUnlocked(d, next))
        .map((d) => d.name)
      return { xpEarned: result.xpEarned + weekly.bonus, weeklyBonus: weekly.bonus, achievements: unlocked, newRank: after !== before ? after : undefined, unlockedDestinations }
    },
    [progress],
  )

  const completeLesson = useCallback((lesson: Lesson) => finish(applyLesson(progress, lesson, questForDay())), [progress, finish])
  const completeConversation = useCallback(() => finish(applyConversation(progress, questForDay())), [progress, finish])

  const addCustomWord = useCallback(
    (word: { pt: string; en: string }) =>
      setProgress((p) => {
        const id = customWordId(word.pt)
        if (p.customWords.some((w) => w.id === id)) return p
        return {
          ...p,
          customWords: [...p.customWords, { id, pt: word.pt, en: word.en, context: 'Saved from a conversation with Inês.' }],
          learnedWords: p.learnedWords.includes(id) ? p.learnedWords : [...p.learnedWords, id],
          reviews: scheduleNew(p.reviews, [id]),
        }
      }),
    [],
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

  const addMistakes = useCallback(
    (corrections: { said: string; better: string; why: string }[]) =>
      setProgress((p) => {
        const fresh = corrections
          .filter((c) => c.said && c.better)
          .map((c) => ({ ...c, id: customWordId(c.better).replace('custom-', 'm-'), date: dayKey() }))
          .filter((m) => !p.mistakes.some((x) => x.id === m.id))
        return fresh.length ? { ...p, mistakes: [...p.mistakes, ...fresh].slice(-50) } : p
      }),
    [],
  )

  const removeMistake = useCallback((id: string) => setProgress((p) => ({ ...p, mistakes: p.mistakes.filter((m) => m.id !== id) })), [])

  const syncData = useMemo(() => ({ progress, profile }), [progress, profile])
  const cloud = useCloudSync(syncData, replaceAll)

  const value = useMemo(
    () => ({
      progress,
      profile,
      stats: statsFor(progress),
      completeLesson,
      completeConversation,
      addCustomWord,
      addMistakes,
      removeMistake,
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
    [progress, profile, completeLesson, completeConversation, addCustomWord, addMistakes, removeMistake, updateProfile, toggleDifficult, reviewWord, replaceAll, cloud],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
