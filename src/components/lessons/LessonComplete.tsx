import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LessonResult } from '../../features/progress/progressContext'
import { Button } from '../common'
import { Confetti } from '../gamification/Confetti'

interface Props {
  result: LessonResult
  correctFirstTry: number
  total: number
  checkpoint?: boolean | null
  checkpointLevel?: string
  nextStop?: { name: string; title: string; to: string; destinationComplete: boolean }
  onDone: () => void
}

export function LessonComplete({ result, correctFirstTry, total, checkpoint = null, checkpointLevel = 'A1', nextStop, onDone }: Props) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
      <Confetti />
      <PartyPopper className="mx-auto size-16 text-terracotta" aria-hidden />
      <h1 className="mt-4 font-display text-4xl">Parabéns!</h1>
      <p className="mt-2 text-lg opacity-80">Lesson complete. You’re one step closer to feeling at home.</p>
      <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3">
        <div className="rounded-3xl bg-sun/30 p-4">
          <p className="font-display text-3xl">+{result.xpEarned}</p>
          <p className="text-sm">XP earned</p>
        </div>
        <div className="rounded-3xl bg-sage/25 p-4">
          <p className="font-display text-3xl">{correctFirstTry}/{total}</p>
          <p className="text-sm">right first try</p>
        </div>
      </div>

      {result.newRank && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 font-medium">
          New rank unlocked: <span className="text-terracotta-dark">{result.newRank}</span> 🎉
        </motion.p>
      )}

      {checkpoint !== null && (
        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-sky/30 p-4">
          {checkpoint ? (
            <>
              <p className="font-medium">🎓 You passed the {checkpointLevel} checkpoint!</p>
              <Link to={`/app/certificate/${checkpointLevel}`} className="mt-1 inline-block font-medium text-terracotta-dark underline">See your certificate →</Link>
            </>
          ) : (
            <p>Quase lá! You need {Math.ceil(total * 0.75)}/{total} right first try to pass. Review a little and try again anytime.</p>
          )}
        </div>
      )}

      {result.weeklyBonus > 0 && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mx-auto mt-6 max-w-sm rounded-2xl bg-sun/30 p-3 font-medium">
          🏆 Weekly challenge complete! +{result.weeklyBonus} bonus XP
        </motion.p>
      )}

      {result.unlockedDestinations.map((name) => (
        <motion.p key={name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mx-auto mt-6 max-w-sm rounded-2xl bg-sky/30 p-3 font-medium">
          🗺️ New destination unlocked: {name}!
        </motion.p>
      ))}

      {result.achievements.length > 0 && (
        <section aria-label="New achievements" className="mx-auto mt-6 max-w-sm space-y-2">
          {result.achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.2, type: 'spring' }}
              className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 text-left"
            >
              <span className="text-3xl" aria-hidden>{a.icon}</span>
              <div>
                <p className="font-medium">Achievement: {a.title}</p>
                <p className="text-sm opacity-75">{a.description}</p>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {nextStop && (
        <div className="mx-auto mt-6 max-w-sm rounded-3xl border border-sage bg-sage/15 p-5 text-left">
          <p className="text-sm font-medium">{nextStop.destinationComplete ? 'Destination complete · next stop' : 'Up next'}</p>
          <h2 className="mt-1 font-display text-2xl">{nextStop.name}</h2>
          <p className="mt-2 text-sm opacity-80">{nextStop.title}</p>
          <Link to={nextStop.to} className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-terracotta-dark px-5 py-3 text-center font-medium text-white">{nextStop.destinationComplete ? `Explore ${nextStop.name}` : 'Next lesson'} →</Link>
        </div>
      )}
      <Button size="lg" variant={nextStop ? 'secondary' : 'primary'} className="mt-6" onClick={onDone}>{nextStop ? 'Back to journey' : 'Continue'}</Button>
    </motion.div>
  )
}
