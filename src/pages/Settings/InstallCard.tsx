import { Share, Smartphone } from 'lucide-react'
import { Card } from '../../components/common'
import { usePwa } from '../../features/pwa/pwa'

export function InstallCard() {
  const pwa = usePwa()
  const installed = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone
  return (
    <Card className="space-y-3 bg-sun/15">
      <h2 className="flex items-center gap-2 font-display text-xl"><Smartphone className="size-5 text-terracotta" aria-hidden /> Português Quest on your iPhone</h2>
      {installed ? <p>You’re using the home-screen app. Bem-vindo!</p> : <ol className="list-inside list-decimal space-y-2 text-sm"><li>Open this website in Safari.</li><li>Tap <Share className="inline size-4" aria-label="Share" /> Share, then Add to Home Screen.</li><li>Keep Open as Web App enabled if shown, then tap Add.</li></ol>}
      <p className="text-sm opacity-80">The website and app use the same account. Sign in with the same email and password directly in the installed app. Your session stays saved on this device. If you previously used email links, set a password in Account & sync.</p>
      <p role="status" className="text-sm opacity-75">{pwa.ready ? 'Lessons and reading are downloaded for offline use. Device voices may still need a connection.' : 'Stay online for the first visit to download lessons and reading. Reopen the app online if offline preparation is interrupted.'}</p>
    </Card>
  )
}
