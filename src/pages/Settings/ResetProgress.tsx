import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

export function ResetProgress() {
  const { reset } = useProgress()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>Start over</Button>
      </div>
    )
  }

  return (
    <div role="alert" className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <span>This clears all XP, progress and settings — on this device and in your synced account.</span>
      <Button size="sm" onClick={() => { reset(); navigate('/') }}>Yes, start over</Button>
      <Button size="sm" variant="secondary" onClick={() => setConfirming(false)}>Cancel</Button>
    </div>
  )
}
