import type { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloud, type UserData } from '../../services/cloud'
import { supabase } from '../../services/supabase'
import { defaultProfile, emptyProgress } from '../progress/progress'
import { mergeProfile, mergeProgress } from './merge'

export type SyncStatus = 'off' | 'loading' | 'signed-out' | 'syncing' | 'synced' | 'error'

export interface CloudSync {
  email: string | null
  status: SyncStatus
  ready: boolean // session known and the account's data loaded
  signIn: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export function useCloudSync(data: UserData, apply: (data: UserData) => void): CloudSync {
  // undefined = still checking for a saved session
  const [user, setUser] = useState<User | null | undefined>(cloud.enabled ? undefined : null)
  const [status, setStatus] = useState<SyncStatus>(cloud.enabled ? 'loading' : 'off')
  const [pulled, setPulled] = useState(false)
  const ready = useRef(false)
  const latest = useRef(data)
  const known = user !== undefined
  const userId = user?.id

  useEffect(() => {
    latest.current = data
  }, [data])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  // On sign-in: pull the account's data, merge in anything learned on this device, push the result back.
  useEffect(() => {
    ready.current = false
    setPulled(false)
    if (!known || !cloud.enabled) return
    if (!userId) {
      setStatus('signed-out')
      return
    }
    let cancelled = false
    setStatus('syncing')
    cloud
      .pull(userId)
      .then(async (remote) => {
        if (cancelled) return
        const local = latest.current
        const merged = remote
          ? {
              progress: mergeProgress(local.progress, { ...emptyProgress, ...remote.progress }),
              profile: mergeProfile(local.profile, { ...defaultProfile, ...remote.profile }),
            }
          : local
        apply(merged)
        await cloud.push(userId, merged)
        ready.current = true
        if (!cancelled) setStatus('synced')
      })
      .catch(() => !cancelled && setStatus('error'))
      .finally(() => !cancelled && setPulled(true))
    return () => {
      cancelled = true
    }
  }, [userId, known, apply])

  // Afterwards: push changes a moment after they happen.
  useEffect(() => {
    if (!userId || !ready.current) return
    const timer = setTimeout(() => {
      setStatus('syncing')
      cloud
        .push(userId, data)
        .then(() => setStatus('synced'))
        .catch(() => setStatus('error'))
    }, 1500)
    return () => clearTimeout(timer)
  }, [data, userId])

  // Signing out clears this device, so the next account starts clean.
  const signOut = useCallback(async () => {
    await cloud.signOut()
    apply({ progress: emptyProgress, profile: defaultProfile })
  }, [apply])

  return {
    email: user?.email ?? null,
    status,
    ready: status === 'off' || (known && (!userId || pulled)),
    signIn: cloud.signIn,
    signOut,
  }
}
