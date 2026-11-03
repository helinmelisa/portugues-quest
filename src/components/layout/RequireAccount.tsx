import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'

// Routes behind this need a signed-in account (when sync is configured) and, by default, a finished onboarding.
export function RequireAccount({ children, onboarded = true }: { children: ReactNode; onboarded?: boolean }) {
  const { cloud, profile } = useProgress()

  if (!cloud.ready) {
    return (
      <div className="grid min-h-screen place-items-center" role="status">
        <Loader2 className="size-8 animate-spin text-terracotta" aria-label="Loading your progress" />
      </div>
    )
  }
  if (cloud.status !== 'off' && !cloud.email) return <Navigate to="/login" replace />
  if (onboarded && !profile.onboarded) return <Navigate to="/onboarding" replace />
  return children
}
