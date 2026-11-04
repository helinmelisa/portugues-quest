import { defaultProfile, emptyProgress } from '../progress/progress'
import type { UserData } from '../../services/cloud'
import { applyActivities } from './changes'
import type { LearningStore } from './learningStore'

export interface Snapshot extends UserData { revision: number }
export interface SyncReply { accepted: boolean; applied: string[]; snapshot: Snapshot }
export interface SyncApi {
  pull: () => Promise<Snapshot>
  commit: (revision: number, ids: string[], next: UserData) => Promise<SyncReply>
}

// An ambiguous network failure leaves receipts in the outbox; the server acknowledges them on retry.
export async function synchronize(store: LearningStore, api: SyncApi, current: () => boolean) {
  const normalize = (s: Snapshot): Snapshot => ({ ...s, progress: { ...structuredClone(emptyProgress), ...s.progress }, profile: { ...defaultProfile, ...s.profile } })
  let snapshot = normalize(await api.pull())
  for (let attempt = 0; attempt < 12 && current(); attempt++) {
    const batch = store.pending().slice(0, 100)
    if (!batch.length) { store.accept(snapshot); return }
    const next = applyActivities(snapshot, batch)
    const reply = await api.commit(snapshot.revision, batch.map((e) => e.id), next)
    if (!current()) return
    snapshot = normalize(reply.snapshot)
    store.accept(snapshot, reply.applied)
  }
  if (current()) throw new Error('Sync is busy. Your work is saved for the next retry.')
}
