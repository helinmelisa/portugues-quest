import { Settings } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import { StreakChip, XpChip } from '../gamification/StatChip'
import { BottomNav } from '../navigation/BottomNav'
import { Sidebar } from '../navigation/Sidebar'

export function AppLayout() {
  const { stats } = useProgress()

  return (
    <div className="flex min-h-screen">
      <a href="#content" className="sr-only z-20 rounded-full bg-card px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-3 md:justify-end md:px-8 md:py-5">
          <Link to="/" className="font-display text-xl md:hidden">
            Português <span className="text-terracotta">Quest</span>
          </Link>
          <div className="flex gap-2">
            <StreakChip days={stats.streak} />
            <XpChip xp={stats.totalXp} />
            <Link to="/app/settings" aria-label="Settings" className="grid size-9 place-items-center rounded-full border border-line bg-card hover:border-sage">
              <Settings className="size-4" aria-hidden />
            </Link>
          </div>
        </header>
        <main id="content" className="flex-1 px-4 pb-24 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
