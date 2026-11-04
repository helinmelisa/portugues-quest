import { Button, Card } from '../../components/common'
import { storage } from '../../services/storage'
import { defaultProfile, emptyProgress } from '../../features/progress/progress'

// Unscoped caches from v1 cannot safely be assigned to the next signed-in account.
export function LegacyBackup() {
  let available = false
  try { available = !!localStorage.getItem('pq:v1:progress') } catch { /* Storage may be unavailable. */ }
  if (!available) return null
  const download = () => {
    const data = { app: 'portugues-quest', version: 1, progress: storage.load('progress', emptyProgress), profile: storage.load('profile', defaultProfile) }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    Object.assign(document.createElement('a'), { href: url, download: 'portugues-quest-previous-device-backup.json' }).click()
    URL.revokeObjectURL(url)
  }
  return <Card className="space-y-3"><h2 className="font-display text-xl">Previous device backup</h2><p className="text-sm opacity-80">An earlier version saved progress without an account label. We kept it here, separate from account sync. Download it and import it only if it belongs to your current account.</p><Button variant="secondary" onClick={download}>Download previous backup</Button></Card>
}
