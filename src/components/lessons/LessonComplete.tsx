import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { Button } from '../common'

interface Props {
  xpEarned: number
  correctFirstTry: number
  total: number
  onDone: () => void
}

export function LessonComplete({ xpEarned, correctFirstTry, total, onDone }: Props) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
      <PartyPopper className="mx-auto size-16 text-terracotta" aria-hidden />
      <h1 className="mt-4 font-display text-4xl">Parabéns!</h1>
      <p className="mt-2 text-lg opacity-80">Lesson complete. You’re one step closer to feeling at home.</p>
      <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3">
        <div className="rounded-3xl bg-sun/30 p-4">
          <p className="font-display text-3xl">+{xpEarned}</p>
          <p className="text-sm">XP earned</p>
        </div>
        <div className="rounded-3xl bg-sage/25 p-4">
          <p className="font-display text-3xl">{correctFirstTry}/{total}</p>
          <p className="text-sm">right first try</p>
        </div>
      </div>
      <Button size="lg" className="mt-10" onClick={onDone}>Continue</Button>
    </motion.div>
  )
}
