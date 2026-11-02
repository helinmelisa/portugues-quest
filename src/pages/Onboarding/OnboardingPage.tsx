import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ProgressBar } from '../../components/common'
import { OptionButton } from '../../components/lessons/OptionButton'
import { useProgress } from '../../hooks/useProgress'
import type { UserProfile } from '../../types'
import { onboardingSteps } from './steps'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProgress()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<UserProfile>>({ interfaceLanguage: 'en', dailyGoalMinutes: profile.dailyGoalMinutes })

  const step = onboardingSteps[index]
  const value = answers[step.key]
  const last = index === onboardingSteps.length - 1

  const next = () => {
    if (!last) return setIndex(index + 1)
    updateProfile({ ...answers, onboarded: true })
    navigate('/app')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-6">
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => (index ? setIndex(index - 1) : navigate('/'))}
          aria-label="Back"
          className="rounded-full p-1 hover:bg-line/60"
        >
          <ArrowLeft className="size-6" />
        </button>
        <ProgressBar value={index + 1} max={onboardingSteps.length} label="Onboarding progress" color="sage" />
      </header>

      <AnimatePresence mode="wait">
        <motion.fieldset
          key={step.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 py-10"
        >
          <legend className="font-display text-3xl">{step.title}</legend>
          {step.subtitle && <p className="mt-2 opacity-75">{step.subtitle}</p>}
          <div className="mt-8 grid gap-3">
            {step.options.map((o) => (
              <OptionButton
                key={o.value}
                state={value === o.value ? 'selected' : 'idle'}
                onClick={() => setAnswers({ ...answers, [step.key]: o.value })}
              >
                <span>
                  {o.label}
                  {o.hint && <span className="block text-sm opacity-70">{o.hint}</span>}
                </span>
              </OptionButton>
            ))}
          </div>
        </motion.fieldset>
      </AnimatePresence>

      <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {step.optional && <Button variant="ghost" onClick={next}>Skip</Button>}
        <Button size="lg" onClick={next} disabled={value === undefined}>{last ? 'Start learning' : 'Continue'}</Button>
      </footer>
    </div>
  )
}
