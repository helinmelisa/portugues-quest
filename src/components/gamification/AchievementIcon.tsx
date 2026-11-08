import { Award, Coffee, Compass, Flame, Footprints, GraduationCap, Leaf, MessageCircle, TrainFront, TramFront, Trophy, type LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  footprints: Footprints,
  tram: TramFront,
  coffee: Coffee,
  compass: Compass,
  conversation: MessageCircle,
  trophy: Trophy,
  graduation: GraduationCap,
  flame: Flame,
  leaf: Leaf,
  train: TrainFront,
}

export function AchievementIcon({ name, className = 'size-6' }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Award
  return <Icon className={className} strokeWidth={1.75} aria-hidden />
}
