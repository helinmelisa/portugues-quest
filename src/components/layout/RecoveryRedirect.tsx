import { Navigate, useLocation } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'

export function RecoveryRedirect() {
  const { cloud } = useProgress()
  const { pathname } = useLocation()
  return cloud.passwordRecovery && pathname !== '/password' ? <Navigate to="/password" replace /> : null
}
