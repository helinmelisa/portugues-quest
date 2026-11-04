import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import { useOnline } from '../../hooks/useOnline'
import { setUpdateBusy, updateApp, usePwa } from '../../features/pwa/pwa'
import { Button } from '../common'

export function AppStatus() {
  const { pathname } = useLocation()
  const { cloud } = useProgress()
  const online = useOnline()
  const pwa = usePwa()
  const busy = pathname.startsWith('/lesson/') || pathname.startsWith('/app/tutor') || pathname === '/login' || pathname === '/password'
  useEffect(() => { setUpdateBusy(busy || cloud.status === 'storage-error'); return () => setUpdateBusy(false) }, [busy, cloud.status])
  if (pwa.updating) return <div role="status" className="fixed inset-0 z-50 grid place-items-center bg-cream p-6 text-center">Preparing your update… Your saved progress stays on this device.</div>
  return (
    <>
      {!online && <p role="status" className="border-b border-line bg-sun/25 px-4 py-2 text-center text-sm">Offline · Lessons and reading stay available after download. Inês and recording transcription need a connection.</p>}
      {cloud.status === 'storage-error' && <p role="alert" className="bg-sun/30 p-3 text-center text-sm">Device storage is unavailable. Keep this page open and export your progress in Settings before leaving.</p>}
      {pwa.waiting && !busy && <div className="flex flex-wrap items-center justify-center gap-3 border-b border-line bg-sage/20 p-3 text-sm"><span>A new version is ready.</span><Button size="sm" variant="secondary" onClick={updateApp}>Update app</Button></div>}
      {pwa.error && <p role="status" className="p-3 text-center text-sm">{pwa.error}</p>}
    </>
  )
}
