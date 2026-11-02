import { Download, Play, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'
import { speech } from '../../services/speech'
import type { CefrLevel, UserProfile } from '../../types'
import { cn } from '../../utils/cn'
import { dayKey } from '../../utils/date'
import { AccountCard } from './AccountCard'
import { ResetProgress } from './ResetProgress'

const goals: UserProfile['dailyGoalMinutes'][] = [5, 10, 15, 20]
const levels: CefrLevel[] = ['A0', 'A1']
const speeds = [
  { rate: 0.7, label: 'Slow' },
  { rate: 0.9, label: 'Normal' },
  { rate: 1.05, label: 'Natural' },
]

function Choice<T>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn('rounded-full border-2 px-4 py-2 font-medium transition', o.value === value ? 'border-terracotta bg-terracotta/10' : 'border-line bg-card hover:border-sage')}
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
    const blob = new Blob([JSON.stringify({ app: 'portugues-quest', version: 1, progress, profile }, null, 2)], { type: 'application/json' })
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
      <h1 className="font-display text-3xl md:text-4xl">Settings</h1>

      <AccountCard />

      <Card className="space-y-5">
        <h2 className="font-display text-xl">Learning</h2>
        <div className="space-y-2">
          <p className="font-medium">Daily goal</p>
          <Choice label="Daily goal" value={profile.dailyGoalMinutes} onChange={(v) => updateProfile({ dailyGoalMinutes: v })} options={goals.map((g) => ({ value: g, label: `${g} min` }))} />
        </div>
        <div className="space-y-2">
          <p className="font-medium">Level</p>
          <Choice label="Level" value={profile.level} onChange={(v) => updateProfile({ level: v })} options={levels.map((l) => ({ value: l, label: l }))} />
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-display text-xl">Audio</h2>
        <p className="font-medium">Speaking speed</p>
        <div className="flex flex-wrap items-center gap-3">
          <Choice label="Speaking speed" value={rate} onChange={(v) => updateProfile({ audioRate: v })} options={speeds.map((s) => ({ value: s.rate, label: s.label }))} />
          {speech.supported && (
            <Button variant="ghost" size="sm" onClick={() => speech.speak('Bom dia! Tudo bem?', rate)}>
              <Play className="size-4" aria-hidden /> Test
            </Button>
          )}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-display text-xl">Your data</h2>
        <p className="text-sm opacity-75">Progress is always saved in this browser. You can also export a backup file.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}><Download className="size-4" aria-hidden /> Export progress</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="size-4" aria-hidden /> Import progress</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={importData} className="hidden" />
        </div>
        {message && <p role="status" className="text-sm font-medium">{message}</p>}
        <div className="border-t border-line pt-3">
          <ResetProgress />
        </div>
      </Card>
    </div>
  )
}
