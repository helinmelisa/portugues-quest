import type { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { disableReminder } from '../reminders/client'
import { cloud } from '../../services/cloud'
import { initialPasswordRecovery, supabase } from '../../services/supabase'
import { learningStore } from './learningStore'
import { synchronize } from './synchronize'

export type SyncStatus = 'off' | 'loading' | 'signed-out' | 'saved' | 'storage-error' | 'syncing' | 'synced' | 'error'
export interface CloudSync {
  email: string | null
  status: SyncStatus
  ready: boolean
  retry: () => void
  passwordRecovery: boolean
  finishPasswordRecovery: () => void
  signInPassword: typeof cloud.signInPassword
  signUp: typeof cloud.signUp
  resetPassword: typeof cloud.resetPassword
  setPassword: typeof cloud.setPassword
  signIn: (email: string) => Promise<string | null>
  redeemLink: (link: string) => Promise<string | null>
  verifyCode: (email: string, token: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const cachedUser = () => {
  try { return JSON.parse(localStorage.getItem('pq:v2:last-user') ?? 'null') as Pick<User, 'id' | 'email'> | null } catch { return null }
}

export function useCloudSync(): CloudSync {
  const [user, setUser] = useState<Pick<User, 'id' | 'email'> | null | undefined>(() => cloud.enabled ? (navigator.onLine ? undefined : cachedUser()) : null)
  const [passwordRecovery, setPasswordRecovery] = useState(initialPasswordRecovery)
  const [status, setStatus] = useState<SyncStatus>(cloud.enabled ? 'loading' : 'off')
  const [accountReady, setAccountReady] = useState(!cloud.enabled)
  const retryRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!supabase) return
    let alive = true
    let observed = false
    const remember = (user: Pick<User, 'id' | 'email'> | null) => {
      try {
        if (user) localStorage.setItem('pq:v2:last-user', JSON.stringify({ id: user.id, email: user.email }))
        else localStorage.removeItem('pq:v2:last-user')
      } catch { /* Account cache failure is reported by the learning store. */ }
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      observed = true
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
      if (event === 'SIGNED_OUT') setPasswordRecovery(false)
      const identity = session?.user ?? (event !== 'SIGNED_OUT' && !navigator.onLine ? cachedUser() : null)
      remember(identity)
      if (alive) setUser(identity)
    })
    supabase.auth.getSession().then(({ data }) => {
      if (alive && !observed) {
        const identity = data.session?.user ?? (!navigator.onLine ? cachedUser() : null)
        remember(identity)
        setUser(identity)
      }
    }).catch(() => { if (alive && !observed) setUser(!navigator.onLine ? cachedUser() : null) })
    return () => { alive = false; listener.subscription.unsubscribe() }
  }, [])

  const userId = user?.id
  const known = user !== undefined
  useEffect(() => {
    if (!known || !cloud.enabled) return
    let cancelled = false
    learningStore.select(userId ?? null)
    setAccountReady(true)
    if (!userId) { setStatus('signed-out'); return }
    let busy = false
    let rerun = false
    let timer: ReturnType<typeof setTimeout>
    const current = () => !cancelled && learningStore.getAccount() === userId
    const sync = async () => {
      if (!current()) return
      if (busy) { rerun = true; return }
      if (!navigator.onLine) { setStatus('saved'); return }
      busy = true
      setStatus('syncing')
      try {
        await synchronize(learningStore, { pull: () => cloud.pull(userId), commit: (revision, ids, next) => cloud.commit(userId, revision, ids, next) }, current)
        if (current()) setStatus(learningStore.persistenceError ? 'error' : learningStore.pending().length ? 'saved' : 'synced')
      } catch {
        if (current()) setStatus(navigator.onLine ? 'error' : 'saved')
      } finally {
        busy = false
        if (rerun && current()) { rerun = false; timer = setTimeout(sync, 1500) }
      }
    }
    retryRef.current = () => { void sync() }
    const changed = () => {
      if (!current() || !learningStore.pending().length) return
      setStatus('saved')
      clearTimeout(timer)
      timer = setTimeout(sync, 1200)
    }
    const unsubscribe = learningStore.subscribe(changed)
    const foreground = () => { if (!document.hidden) void sync() }
    const offline = () => setStatus('saved')
    const storageChanged = (event: StorageEvent) => {
      if (event.key?.startsWith(`pq:v2:${userId}:`)) { learningStore.reload(); changed() }
    }
    window.addEventListener('online', foreground)
    window.addEventListener('offline', offline)
    window.addEventListener('focus', foreground)
    window.addEventListener('storage', storageChanged)
    document.addEventListener('visibilitychange', foreground)
    const poll = setInterval(foreground, 30000)
    const channel = supabase!.channel(`learning:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'user_data', filter: `user_id=eq.${userId}` }, foreground).subscribe()
    void sync()
    return () => {
      cancelled = true
      clearTimeout(timer)
      clearInterval(poll)
      unsubscribe()
      window.removeEventListener('online', foreground)
      window.removeEventListener('offline', offline)
      window.removeEventListener('focus', foreground)
      window.removeEventListener('storage', storageChanged)
      document.removeEventListener('visibilitychange', foreground)
      void supabase!.removeChannel(channel)
    }
  }, [userId, known])

  const signOut = useCallback(async () => {
    await disableReminder().catch(() => {})
    try { localStorage.removeItem('pq:v2:last-user') } catch { /* Still clear the active account. */ }
    learningStore.select(null)
    setUser(null)
    await cloud.signOut()
  }, [])

  return {
    passwordRecovery: passwordRecovery && !!user?.id, finishPasswordRecovery: () => setPasswordRecovery(false),
    signInPassword: cloud.signInPassword, signUp: cloud.signUp, resetPassword: cloud.resetPassword, setPassword: cloud.setPassword,
    email: user?.email ?? null, status: learningStore.persistenceError ? 'storage-error' : status,
    ready: cloud.enabled ? user !== undefined && (!userId || (accountReady && learningStore.getAccount() === userId)) : accountReady,
    retry: () => retryRef.current(), signIn: cloud.signIn, verifyCode: cloud.verifyCode, redeemLink: cloud.redeemLink, signOut,
  }
}
