import { RemindersCard } from './RemindersCard'
import { PageHeader } from '../../components/common/PageHeader'
import { Download, Play, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'
import { speech } from '../../services/speech'
import type { CefrLevel, UserProfile } from '../../types'
import { cn } from '../../utils/cn'
import { dayKey } from '../../utils/date'
import { LegacyBackup } from './LegacyBackup'
import { InstallCard } from './InstallCard'
import { AccountCard } from './AccountCard'
import { ResetProgress } from './ResetProgress'

const goals: UserProfile['dailyGoalMinutes'][] = [5, 10, 15, 20]
const levels: CefrLevel[] = ['A0', 'A1', 'A2', 'B1']
const speeds = [
  { rate: 0.7, label: 'Slow' },
  { rate: 0.9, label: 'Normal' },
  { rate: 1.05, label: 'Natural' },
]

function Choice<T>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full border-2 px-4 py-2 font-medium transition',
            o.value === value ? 'border-terracotta bg-terracotta/10' : 'border-line bg-card hover:border-sage',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function SettingsPage() {
  const { profile, progress, updateProfile, replaceAll } = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const rate = profile.audioRate ?? 0.9

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ app: 'portugues-quest', version: 1, progress, profile }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `portugues-quest-${dayKey()}.json` })
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (data?.app !== 'portugues-quest' || !data.progress || !data.profile) throw new Error()
      replaceAll(data)
      setMessage('Progress restored — bem-vindo de volta!')
    } catch {
      setMessage('That file doesn’t look like a Português Quest backup.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        eyebrow="Make it yours"
        title="Settings"
        description="Your account, your learning pace, your space."
      />
      <nav aria-label="Settings sections" className="section-links">
        <a href="#account">Account</a>
        <a href="#learning">Learning</a>
        <a href="#audio">Audio</a>
        <a href="#device">App & data</a>
      </nav>

      <section id="account" className="scroll-mt-5" aria-label="Account">
        <AccountCard />
      </section>

      <Card id="learning" className="scroll-mt-5 space-y-5">
        <h2 className="font-display text-xl">Learning</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="font-medium">Your name</span>
            <input
              value={profile.name ?? ''}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="What should Inês call you?"
              className="w-full rounded-full border border-line bg-cream px-4 py-2.5"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium">Your interests</span>
            <input
              value={profile.interests ?? ''}
              onChange={(e) => updateProfile({ interests: e.target.value })}
              placeholder="e.g. football, cooking, hiking"
              className="w-full rounded-full border border-line bg-cream px-4 py-2.5"
            />
          </label>
        </div>
        <p className="text-sm opacity-70">
          Inês uses these, plus your recent mistakes, to make conversations more personal.
        </p>
        <div className="space-y-2">
          <p className="font-medium">Daily goal</p>
          <Choice
            label="Daily goal"
            value={profile.dailyGoalMinutes}
            onChange={(v) => updateProfile({ dailyGoalMinutes: v })}
            options={goals.map((g) => ({ value: g, label: `${g} min` }))}
          />
        </div>
        <div className="space-y-2">
          <p className="font-medium">Level</p>
          <Choice
            label="Level"
            value={profile.level}
            onChange={(v) => updateProfile({ level: v })}
            options={levels.map((l) => ({ value: l, label: l }))}
          />
        </div>
      </Card>

      <Card id="audio" className="scroll-mt-5 space-y-3">
        <h2 className="font-display text-xl">Audio</h2>
        <p className="font-medium">Speaking speed</p>
        <div className="flex flex-wrap items-center gap-3">
          <Choice
            label="Speaking speed"
            value={rate}
            onChange={(v) => updateProfile({ audioRate: v })}
            options={speeds.map((s) => ({ value: s.rate, label: s.label }))}
          />
          {speech.supported && (
            <Button variant="ghost" size="sm" onClick={() => speech.speak('Bom dia! Tudo bem?', rate)}>
              <Play className="size-4" aria-hidden /> Test
            </Button>
          )}
        </div>
      </Card>

      <section id="device" className="scroll-mt-5 space-y-5" aria-label="App and device">
        <InstallCard />
        <RemindersCard />
        <LegacyBackup />
      </section>

      <Card className="space-y-3">
        <h2 className="font-display text-xl">Your data</h2>
        <p className="text-sm opacity-75">
          Progress is always saved in this browser. You can also export a backup file.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}>
            <Download className="size-4" aria-hidden /> Export progress
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" aria-hidden /> Import progress
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={importData} className="hidden" />
        </div>
        {message && (
          <p role="status" className="text-sm font-medium">
            {message}
          </p>
        )}
        <div className="border-t border-line pt-3">
          <ResetProgress />
        </div>
      </Card>
    </div>
  )
}
