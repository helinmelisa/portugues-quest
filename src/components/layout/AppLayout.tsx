import { Settings } from 'lucide-react'
import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import { StreakChip, XpChip } from '../gamification/StatChip'
import { BottomNav } from '../navigation/BottomNav'
import { Sidebar } from '../navigation/Sidebar'

export function AppLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  const { stats } = useProgress()

  return (
    <div className="flex min-h-dvh">
      <a href="#content" className="sr-only z-20 rounded-full bg-card px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 px-4 py-3 mb-5 md:justify-end md:px-8 md:py-5">
          <Link to="/" className="font-display text-lg md:hidden">
            Português <span className="text-terracotta">Quest</span>
          </Link>
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 sm:justify-end">
            <StreakChip days={stats.streak} />
            <XpChip xp={stats.totalXp} />
            <Link to="/app/settings" aria-label="Settings" className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-card hover:border-sage">
              <Settings className="size-4" aria-hidden />
            </Link>
          </div>
        </header>
        <main id="content" className="flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
