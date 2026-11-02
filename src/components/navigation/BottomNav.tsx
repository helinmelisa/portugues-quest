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
            cn('flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium', isActive ? 'text-terracotta-dark' : 'opacity-70')
          }
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
