import { BookOpen, Headphones, Languages, Mic, Puzzle, Sprout, Zap, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'
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
  const { progress } = useProgress()

  const corners: Corner[] = [
    { to: '/lesson/practice-quick', icon: Zap, title: 'Quick Challenge', text: 'Five mixed questions from your lessons. Perfect for a coffee break.', badge: '1–3 min · +10 XP', tone: 'text-sun' },
    { to: '/app/practice/words', icon: Sprout, title: 'Word Garden', text: 'Every word you’ve learned, ready to review and listen to again.', badge: `${progress.learnedWords.length} words`, tone: 'text-sage' },
    { to: '/lesson/practice-listening', icon: Headphones, title: 'Listening Nook', text: 'Listen, replay slowly and pick what you heard.', badge: '3 min · +10 XP', tone: 'text-sky' },
    { to: '/app/practice/portugal-vs-brazil', icon: Languages, title: 'In Portugal, we say…', text: 'The words that tell Portuguese and Brazilian Portuguese apart.', badge: 'Cheat sheet', tone: 'text-terracotta' },
    { to: '/lesson/practice-speak', icon: Mic, title: 'Speak out loud', text: 'Listen, repeat and get feedback on your pronunciation.', badge: '3 min · +10 XP', tone: 'text-terracotta' },
    { to: '/app/practice/grammar', icon: BookOpen, title: 'Grammar bites', text: 'Short, friendly explanations: gender, ser vs estar, verbs and more.', badge: '4 bites', tone: 'text-sage' },
    { to: '/lesson/practice-sentences', icon: Puzzle, title: 'Build a Sentence', text: 'Put the words in the right order to make natural Portuguese.', badge: '3 min · +10 XP', tone: 'text-terracotta' },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl">Practice Corner</h1>
      <p className="mb-6 mt-2 opacity-80">Little exercises to keep your Portuguese warm.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {corners.map(({ to, icon: Icon, title, text, badge, tone }) => (
          <li key={to}>
            <Link to={to} className="block h-full rounded-3xl">
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-sage">
                <Icon className={`size-8 ${tone}`} aria-hidden />
                <h2 className="mt-3 font-display text-xl">{title}</h2>
                <p className="mt-1 opacity-80">{text}</p>
                <Badge className="mt-4">{badge}</Badge>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm opacity-70">
        {speech.supported
          ? 'Audio uses your device’s Portuguese voice for now. Recordings by native speakers are planned.'
          : 'Your browser doesn’t support speech audio, so listening exercises will show the text instead.'}
      </p>
    </div>
  )
}
