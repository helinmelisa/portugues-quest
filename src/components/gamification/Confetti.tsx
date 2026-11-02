import { motion } from 'framer-motion'

const COLORS = ['#D78362', '#A9B79A', '#A9C4C4', '#E8C477']

export function Confetti({ pieces = 28 }: { pieces?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: pieces }, (_, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block size-2.5 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % COLORS.length] }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: '100vh', rotate: 360 + i * 20, opacity: 0 }}
          transition={{ duration: 2.2 + (i % 5) * 0.3, delay: (i % 7) * 0.08, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
