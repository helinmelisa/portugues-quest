import { ArrowLeft, GraduationCap, Printer, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

export default function CertificatePage() {
  const { level = 'A1' } = useParams()
  const { progress, profile, stats, cloud } = useProgress()
  const [copied, setCopied] = useState(false)
  const date = progress.certificates[level]

  if (!date) return <Navigate to="/app" replace />

  const name = profile.name || cloud.email?.split('@')[0] || 'Explorer'
  const when = new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const text = `I passed the ${level} checkpoint in European Portuguese on Português Quest! ${stats.lessonsCompleted} lessons, ${stats.wordsLearned} words. ${window.location.origin}`

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: `${level} explorer`, text }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/app" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 print:hidden">
        <ArrowLeft className="size-4" aria-hidden /> Dashboard
      </Link>

      <article className="relative overflow-hidden rounded-[2rem] border-4 border-double border-terracotta bg-card p-5 text-center sm:p-8 shadow-soft md:p-12">
        <div aria-hidden className="absolute -left-10 -top-10 size-32 rounded-full bg-sky/30" />
        <div aria-hidden className="absolute -bottom-12 -right-8 size-36 rounded-full bg-sun/30" />
        <div className="relative">
          <GraduationCap className="mx-auto size-16 text-terracotta-dark" strokeWidth={1.5} aria-hidden />
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] opacity-70">Português Quest · Certificado</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{level} Explorer</h1>
          <p className="mt-6 opacity-80">This certifies that</p>
          <p className="mt-1 font-display text-3xl text-terracotta-dark">{name}</p>
          <p className="mx-auto mt-4 max-w-md opacity-80">
            {level === 'A2'
              ? 'passed the A2 checkpoint in European Portuguese, practising everyday services, housing, health, work, past events and real-life reading.'
              : 'passed the A1 checkpoint in European Portuguese and can greet people, order at a café, get around, shop and talk about daily life in Portugal.'}
          </p>
          <p className="mt-3 text-xs opacity-60">A learning milestone from Português Quest · Not an official language qualification</p>
          <dl className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-2">
            <div><dt className="text-xs opacity-70">Lessons</dt><dd className="font-display text-xl [overflow-wrap:anywhere] sm:text-2xl">{stats.lessonsCompleted}</dd></div>
            <div><dt className="text-xs opacity-70">Words</dt><dd className="font-display text-xl [overflow-wrap:anywhere] sm:text-2xl">{stats.wordsLearned}</dd></div>
            <div><dt className="text-xs opacity-70">XP</dt><dd className="font-display text-xl [overflow-wrap:anywhere] sm:text-2xl">{stats.totalXp}</dd></div>
          </dl>
          <p className="mt-8 text-sm opacity-70">{when}</p>
          <p className="mt-1 font-display italic">Parabéns!</p>
        </div>
      </article>

      <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
        <Button onClick={share}><Share2 className="size-4" aria-hidden /> {copied ? 'Copied!' : 'Share'}</Button>
        <Button variant="secondary" onClick={() => window.print()}><Printer className="size-4" aria-hidden /> Print / save as PDF</Button>
      </div>
    </div>
  )
}
