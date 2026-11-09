import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { destinations } from '../../data/destinations'
import { questForDay } from '../../data/quests'
import { speech } from '../../services/speech'
import { learningStore } from '../sync/learningStore'
import type { SetStateAction } from 'react'
import type { LearningProgress, Lesson, UserProfile } from '../../types'
import { dayKey } from '../../utils/date'
import { useCloudSync } from '../sync/useCloudSync'
import { applyReview, scheduleNew } from '../vocabulary/srs'
import { newlyUnlocked } from '../achievements/achievements'
import { isDestinationUnlocked } from './destinationProgress'
import { completeConversation as applyConversation, completeLesson as applyLesson, customWordId, defaultProfile, emptyProgress, rankFor, statsFor } from './progress'
import { ProgressContext, type LessonResult } from './progressContext'
import { claimWeekly } from './weekly'

function setProgress(value: SetStateAction<LearningProgress>) {
  const current = learningStore.getSnapshot()
  learningStore.update({ ...current, progress: typeof value === 'function' ? value(current.progress) : value })
}
function setProfile(value: SetStateAction<UserProfile>) {
  const current = learningStore.getSnapshot()
  learningStore.update({ ...current, profile: typeof value === 'function' ? value(current.profile) : value })
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { progress, profile } = useSyncExternalStore(learningStore.subscribe, learningStore.getSnapshot)
  useEffect(() => { speech.rate = profile.audioRate ?? 0.9 }, [profile.audioRate])

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

  const completeLesson = useCallback((lesson: Lesson) => finish(applyLesson(learningStore.getSnapshot().progress, lesson, questForDay())), [finish])
  const completeConversation = useCallback(() => finish(applyConversation(learningStore.getSnapshot().progress, questForDay())), [finish])

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
    learningStore.update({ progress: { ...emptyProgress, ...data.progress }, profile: { ...defaultProfile, ...data.profile } }, true)
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

  const saveWritingDraft = useCallback((id: string, text: string) => {
    setProgress((p) => ({ ...p, writingDrafts: { ...p.writingDrafts, [id]: { text: text.slice(0, 3000), updatedAt: new Date().toISOString() } } }))
  }, [])

  const removeMistake = useCallback((id: string) => setProgress((p) => ({ ...p, mistakes: p.mistakes.filter((m) => m.id !== id) })), [])

  const passCheckpoint = useCallback(
    (level: string) => setProgress((p) => {
      if (p.certificates[level]) return p
      const next = { ...p, certificates: { ...p.certificates, [level]: dayKey() } }
      return { ...next, achievements: [...next.achievements, ...newlyUnlocked(next).map((a) => a.id)] }
    }),
    [],
  )

  const cloud = useCloudSync()

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
      saveWritingDraft,
      passCheckpoint,
      updateProfile,
      toggleDifficult,
      reviewWord,
      replaceAll,
      cloud,
      reset: () => {
        learningStore.update({ progress: structuredClone(emptyProgress), profile: { ...defaultProfile } }, true)
      },
    }),
    [progress, profile, completeLesson, completeConversation, addCustomWord, addMistakes, removeMistake, saveWritingDraft, passCheckpoint, updateProfile, toggleDifficult, reviewWord, replaceAll, cloud],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
