import { useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Languages,
  Library,
  Mic,
  NotebookPen,
  PenLine,
  Puzzle,
  Sprout,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'
import { grammarBites } from '../../data/grammar'
import { a2CheckpointAvailable } from '../../features/learning/practice'
import { speech } from '../../services/speech'

interface Corner {
  to: string
  icon: LucideIcon
  title: string
  text: string
  badge: string
  tone: string
}

export default function PracticePage() {
  const [category, setCategory] = useState('All')
  const { progress } = useProgress()

  const corners: Corner[] = [
    { to: '/app/practice/dialogues', icon: Headphones, title: 'Listening dialogues', text: 'Longer conversations, optional transcripts and comprehension questions.', badge: '4 dialogues · A2', tone: 'text-sky' },
    { to: '/lesson/practice-focus', icon: Zap, title: 'Focus review', text: 'Due words, tricky vocabulary and your own corrections in one gentle session.', badge: '5 min · +10 XP', tone: 'text-sage' },
    { to: '/app/practice/writing', icon: PenLine, title: 'Writing desk', text: 'Write everyday messages, keep drafts and compare with friendly models.', badge: '6 tasks · A2', tone: 'text-terracotta' },

    {
      to: '/app/explore/vida',
      icon: BookOpen,
      title: 'Vida em Portugal',
      text: 'A2 Portuguese for papers, home, health, work and a second visit.',
      badge: '10 lessons · A2',
      tone: 'text-terracotta',
    },
    {
      to: '/app/practice/texts',
      icon: Library,
      title: 'Real-life texts',
      text: 'Read signs, notices, a rental ad, a doctor’s SMS, a bill and an email.',
      badge: '6 texts · +15 XP',
      tone: 'text-sky',
    },
    {
      to: '/lesson/practice-quick',
      icon: Zap,
      title: 'Quick Challenge',
      text: 'Five mixed questions from your lessons. Perfect for a coffee break.',
      badge: '1–3 min · +10 XP',
      tone: 'text-sun',
    },
    {
      to: '/app/practice/words',
      icon: Sprout,
      title: 'Word Garden',
      text: 'Every word you’ve learned, ready to review and listen to again.',
      badge: `${progress.learnedWords.length} words`,
      tone: 'text-sage',
    },
    {
      to: '/lesson/practice-listening',
      icon: Headphones,
      title: 'Listening Nook',
      text: 'Listen, replay slowly and pick what you heard.',
      badge: '3 min · +10 XP',
      tone: 'text-sky',
    },
    {
      to: '/app/practice/portugal-vs-brazil',
      icon: Languages,
      title: 'In Portugal, we say…',
      text: 'The words that tell Portuguese and Brazilian Portuguese apart.',
      badge: 'Cheat sheet',
      tone: 'text-terracotta',
    },
    {
      to: '/lesson/practice-speak',
      icon: Mic,
      title: 'Speak out loud',
      text: 'Listen, repeat and get feedback on your pronunciation.',
      badge: '3 min · +10 XP',
      tone: 'text-terracotta',
    },
    {
      to: '/app/practice/stories',
      icon: Library,
      title: 'Histórias',
      text: 'Short stories from each destination. Tap words to translate, then answer questions.',
      badge: `${progress.storiesRead.length}/8 read · +15 XP`,
      tone: 'text-sky',
    },
    {
      to: '/app/practice/mistakes',
      icon: NotebookPen,
      title: 'Mistake notebook',
      text: 'Corrections from your chats with Inês, ready to practise.',
      badge: `${progress.mistakes.length} saved`,
      tone: 'text-terracotta',
    },
    {
      to: '/app/practice/grammar',
      icon: BookOpen,
      title: 'Grammar bites',
      text: 'Short, friendly explanations: gender, ser vs estar, verbs and more.',
      badge: `${grammarBites.length} bites`,
      tone: 'text-sage',
    },
    {
      to: '/lesson/practice-sentences',
      icon: Puzzle,
      title: 'Build a Sentence',
      text: 'Put the words in the right order to make natural Portuguese.',
      badge: '3 min · +10 XP',
      tone: 'text-terracotta',
    },
  ]

  const groups: Record<string, string[]> = {
    Review: ['Focus review', 'Quick Challenge', 'Word Garden', 'Mistake notebook', 'Build a Sentence'],
    'Listen & speak': ['Listening dialogues', 'Listening Nook', 'Speak out loud'],
    'Read & learn': ['Writing desk', 'Vida em Portugal', 'Real-life texts', 'Histórias', 'Grammar bites', 'In Portugal, we say…'],
  }
  const visible = category === 'All' ? corners : corners.filter((corner) => groups[category].includes(corner.title))

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="A little practice every day"
        title="Practice Corner"
        description={<>Little exercises to keep your Portuguese warm.</>}
      />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Practice activities">
        {['All', ...Object.keys(groups)].map((group) => (
          <button
            key={group}
            type="button"
            aria-pressed={category === group}
            onClick={() => setCategory(group)}
            className={`filter-chip ${category === group ? 'filter-chip-active' : ''}`}
          >
            {group}
          </button>
        ))}
      </div>
      <p className="mb-3 text-sm text-ink/70" aria-live="polite">
        {visible.length} activities · choose what feels useful today
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {visible.map(({ to, icon: Icon, title, text, badge, tone }) => (
          <li key={to}>
            <Link to={to} className="block h-full rounded-3xl">
              <Card className="activity-card h-full transition hover:-translate-y-0.5 hover:border-sage">
                <span className="grid size-12 place-items-center rounded-2xl bg-cream">
                  <Icon className={`size-6 ${tone}`} aria-hidden />
                </span>
                <h2 className="mt-3 font-display text-xl">{title}</h2>
                <p className="mt-1 opacity-80">{text}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                  <Badge>{badge}</Badge>
                  <span className="text-sm font-medium text-terracotta-dark" aria-hidden>
                    Explore →
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <Card className="mt-6 space-y-2 bg-sun/15">
        <h2 className="font-display text-xl">Your A2 goal</h2>
        <p className="text-sm opacity-75">
          Complete the 10 Vida em Portugal lessons and 2 Madeira lessons to unlock a mixed checkpoint. Pass with 12 of
          16 right first try.
        </p>
        {progress.certificates.A2 ? (
          <Link to="/app/certificate/A2" className="inline-block font-medium text-terracotta-dark underline">
            <GraduationCap className="mr-2 inline-block size-5" aria-hidden />View your A2 certificate
          </Link>
        ) : a2CheckpointAvailable(progress) ? (
          <Link to="/lesson/checkpoint-A2" className="inline-block font-medium text-terracotta-dark underline">
            Take the A2 checkpoint →
          </Link>
        ) : (
          <p className="text-sm opacity-70">Keep exploring — your checkpoint will be here when you’re ready.</p>
        )}
      </Card>
      <p className="mt-6 text-sm opacity-70">
        {speech.supported
          ? 'Audio uses your device’s Portuguese voice for now. Recordings by native speakers are planned.'
          : 'Your browser doesn’t support speech audio, so listening exercises will show the text instead.'}
      </p>
    </div>
  )
}
