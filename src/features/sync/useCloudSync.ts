import type { User } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'
import { cloud, type UserData } from '../../services/cloud'
import { supabase } from '../../services/supabase'
import { defaultProfile, emptyProgress } from '../progress/progress'
import { mergeProfile, mergeProgress } from './merge'

export type SyncStatus = 'off' | 'signed-out' | 'syncing' | 'synced' | 'error'

export interface CloudSync {
  email: string | null
  status: SyncStatus
  signIn: (email: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export function useCloudSync(data: UserData, apply: (data: UserData) => void): CloudSync {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<SyncStatus>(cloud.enabled ? 'signed-out' : 'off')
  const ready = useRef(false)
  const latest = useRef(data)
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

  // On sign-in: pull the cloud copy, merge it with this device, then push the result back.
  useEffect(() => {
    ready.current = false
    if (!userId) {
      if (cloud.enabled) setStatus('signed-out')
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
    return () => {
      cancelled = true
    }
  }, [userId, apply])

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

  return { email: user?.email ?? null, status, signIn: cloud.signIn, signOut: cloud.signOut }
}
