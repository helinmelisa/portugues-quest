import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { navItems } from './navItems'

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-card px-4 py-6 md:flex">
      <NavLink to="/" className="mb-8 px-3 font-display text-2xl">
        Português <span className="text-terracotta">Quest</span>
      </NavLink>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 font-medium transition',
                isActive ? 'bg-terracotta/15 text-terracotta-dark' : 'hover:bg-line/60',
              )
            }
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
