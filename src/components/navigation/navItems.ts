import { Compass, Dumbbell, House, MessageCircle, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { to: '/app', label: 'Home', icon: House },
  { to: '/app/explore', label: 'Explore', icon: Compass },
  { to: '/app/practice', label: 'Practice', icon: Dumbbell },
  { to: '/app/tutor', label: 'Tutor', icon: MessageCircle },
]
