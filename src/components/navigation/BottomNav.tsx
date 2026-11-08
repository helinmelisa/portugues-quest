import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { navItems } from './navItems'

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app'}
          className={({ isActive }) =>
            cn('flex flex-col items-center justify-center gap-1 border-t-2 border-transparent px-1 py-3 text-xs font-medium transition', isActive ? 'border-terracotta-dark bg-terracotta/10 text-terracotta-dark' : 'text-ink/75 hover:bg-line/40')
          }
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
