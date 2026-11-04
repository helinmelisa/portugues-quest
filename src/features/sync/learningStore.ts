import type { UserData } from '../../services/cloud'
import { defaultProfile, emptyProgress } from '../progress/progress'
import { applyActivities, changesBetween, type Change, type PendingActivity } from './changes'

export const freshData = (): UserData => ({ progress: structuredClone(emptyProgress), profile: { ...defaultProfile } })
const PREFIX = 'pq:v2:'

// Every activity gets its own storage key: two tabs cannot overwrite each other's outbox.
export class LearningStore {
  private account: string | null = null
  private data = freshData()
  private listeners = new Set<() => void>()
  persistenceError = false
  private disk: Storage | null
  private memory = new Map<string, PendingActivity>()
  private lastTime = 0
  constructor(disk: Storage | null) { this.disk = disk }
  subscribe = (fn: () => void) => { this.listeners.add(fn); return () => { this.listeners.delete(fn) } }
  getSnapshot = () => this.data
  getAccount = () => this.account
  private key = (suffix: string) => `${PREFIX}${this.account ?? 'guest'}:${suffix}`
  private read<T>(key: string, fallback: T): T {
    try { return JSON.parse(this.disk?.getItem(key) ?? 'null') ?? fallback } catch { return fallback }
  }
  private write(key: string, value: unknown) {
    try {
      if (!this.disk) throw new Error('Storage unavailable')
      this.disk.setItem(key, JSON.stringify(value))
      return true
    } catch { this.persistenceError = true; return false }
  }
  private notify() { for (const fn of this.listeners) fn() }
  private normalize(data: UserData): UserData {
    return { progress: { ...structuredClone(emptyProgress), ...data.progress }, profile: { ...defaultProfile, ...data.profile } }
  }
  select(account: string | null) {
    this.account = account
    this.persistenceError = false
    this.data = this.normalize(applyActivities(this.normalize(this.read(this.key('base'), freshData())), this.pending()))
    this.notify()
  }
  reload() { this.select(this.account) }
  pending(): PendingActivity[] {
    const prefix = this.key('event:')
    const out: PendingActivity[] = []
    try {
      for (let i = 0; i < (this.disk?.length ?? 0); i++) {
        const key = this.disk!.key(i)!
        if (key.startsWith(prefix)) {
          const item = this.read<PendingActivity | null>(key, null)
          if (item) out.push(item)
        }
      }
    } catch { this.persistenceError = true }
    for (const [key, item] of this.memory) if (key.startsWith(prefix) && !out.some((e) => e.id === item.id)) out.push(item)
    return out.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
  }
  update(next: UserData, replace = false) {
    const changes: Change[] = replace
      ? [{ kind: 'set' as const, path: ['progress'], value: next.progress as unknown as Change['value'] }, { kind: 'set' as const, path: ['profile'], value: next.profile as unknown as Change['value'] }]
      : changesBetween(this.data, next)
    if (!changes.length) return
    this.lastTime = Math.max(Date.now(), this.lastTime + 1)
    const event = { id: crypto.randomUUID(), createdAt: new Date(this.lastTime).toISOString(), changes }
    if (!this.write(this.key(`event:${event.id}`), event)) this.memory.set(this.key(`event:${event.id}`), event)
    this.data = next
    this.write(this.key('data'), next)
    this.notify()
  }
  accept(remote: UserData, acknowledged: string[] = []) {
    for (const id of acknowledged) {
      this.memory.delete(this.key(`event:${id}`))
      try { this.disk?.removeItem(this.key(`event:${id}`)) } catch { this.persistenceError = true }
    }
    const previous = this.read<UserData & { revision?: number }>(this.key('base'), freshData())
    if ((previous.revision ?? -1) > ((remote as UserData & { revision?: number }).revision ?? -1)) remote = previous
    this.write(this.key('base'), remote)
    this.data = this.normalize(applyActivities(this.normalize(remote), this.pending()))
    this.write(this.key('data'), this.data)
    this.notify()
  }
}

export const learningStore = new LearningStore(typeof localStorage === 'undefined' ? null : localStorage)
