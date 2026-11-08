import { AchievementIcon } from '../../components/gamification/AchievementIcon'
import { Check, CircleCheck, Plus, Sparkles, Trophy } from 'lucide-react'
import { Button, SpeakButton } from '../../components/common'
import type { LessonResult } from '../../features/progress/progressContext'
import { customWordId } from '../../features/progress/progress'
import type { ConversationSummary } from '../../features/tutor/types'
import { useProgress } from '../../hooks/useProgress'

interface Props {
  summary: ConversationSummary | null
  reward: LessonResult | null
  onBack: () => void
}

export function WrapUp({ summary, reward, onBack }: Props) {
  const { progress, addCustomWord } = useProgress()

  return (
    <section aria-label="Conversation feedback" className="mt-8 space-y-4 rounded-3xl bg-sun/20 p-5 md:p-6">
      <h2 className="flex items-center gap-3 font-display text-2xl"><CircleCheck className="size-7 shrink-0 text-terracotta-dark" aria-hidden />Conversa completa!</h2>
      {reward && (
        <p className="flex flex-wrap items-center gap-2 font-medium">
          <Sparkles className="size-4 text-terracotta" aria-hidden /> +{reward.xpEarned} XP
          {reward.achievements.map((a) => <span key={a.id} className="inline-flex items-center gap-1"><AchievementIcon name={a.icon} className="size-4 shrink-0" />{a.title}</span>)}
          {reward.newRank && <span> · New rank: {reward.newRank}</span>}
          {reward.weeklyBonus > 0 && <span className="inline-flex items-center gap-1"><Trophy className="size-4 shrink-0" aria-hidden />Weekly challenge complete!</span>}
        </p>
      )}

      {summary && (
        <>
          <p>{summary.wentWell}</p>
          {summary.speaking && (
            <div className="space-y-3 rounded-2xl bg-card p-4">
              <h3 className="font-display text-xl">Your speaking feedback</h3>
              <p className="text-xs opacity-70">Inês’s estimates from your transcript, out of 5. Fluency here means how clearly you link ideas; this does not measure pronunciation, pace or pauses.</p>
              <dl className="grid grid-cols-1 gap-3 text-center min-[360px]:grid-cols-3">
                {(['fluency', 'vocabulary', 'accuracy'] as const).map((key) => <div key={key}><dt className="text-sm capitalize opacity-75">{key}</dt><dd className="font-display text-2xl">{summary.speaking![key]}/5</dd></div>)}
              </dl>
              <p><strong>One thing to practise:</strong> {summary.speaking.practise}</p>
            </div>
          )}

          {summary.corrections.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Little fixes <span className="text-sm font-normal opacity-70">· saved to your Mistake notebook</span></h3>
              <ul className="space-y-2">
                {summary.corrections.map((c, i) => (
                  <li key={i} className="rounded-2xl bg-card p-3 text-sm">
                    <p><span className="line-through opacity-60">{c.said}</span> → <strong>{c.better}</strong></p>
                    <p className="mt-1 opacity-75">{c.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.newWords.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Words to keep</h3>
              <ul className="space-y-2">
                {summary.newWords.map((w) => {
                  const saved = progress.customWords.some((x) => x.id === customWordId(w.pt))
                  return (
                    <li key={w.pt} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-2xl bg-card p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                      <SpeakButton text={w.pt} className="size-8" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{w.pt}</p>
                        <p className="text-sm opacity-75">{w.en}</p>
                      </div>
                      <Button className="col-span-2 w-full sm:col-span-1 sm:w-auto" size="sm" variant={saved ? 'ghost' : 'secondary'} disabled={saved} onClick={() => addCustomWord(w)}>
                        {saved ? <><Check className="size-4" aria-hidden /> Saved</> : <><Plus className="size-4" aria-hidden /> Word Garden</>}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <Button onClick={onBack}>Try another scenario</Button>
    </section>
  )
}
