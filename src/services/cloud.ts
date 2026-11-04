import type { LearningProgress, UserProfile } from '../types'
import type { Snapshot, SyncReply } from '../features/sync/synchronize'
import { supabase } from './supabase'

export interface UserData {
  progress: LearningProgress
  profile: UserProfile
}

export const cloud = {
  enabled: supabase !== null,
  async signIn(email: string) {
    if (!supabase) return 'Sync is not configured.'
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/app` } })
    return error?.message ?? null
  },
  async verifyCode(email: string, token: string) {
    if (!supabase) return 'Sync is not configured.'
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return error?.message ?? null
  },
  async redeemLink(link: string) {
    if (!supabase) return 'Sync is not configured.'
    try {
      const url = new URL(link.trim())
      const expected = new URL(import.meta.env.VITE_SUPABASE_URL)
      const type = url.searchParams.get('type')
      const token = url.searchParams.get('token') ?? url.searchParams.get('token_hash')
      if (url.origin !== expected.origin || url.pathname !== '/auth/v1/verify' || !token || !['magiclink', 'signup', 'email'].includes(type ?? '')) return 'Paste the original sign-in link from your Português Quest email.'
      const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: type as 'magiclink' | 'signup' | 'email' })
      return error?.message ?? null
    } catch { return 'That link could not be used. Request a fresh sign-in email and try again.' }
  },
  async signOut() {
    const { error } = await supabase!.auth.signOut({ scope: 'local' })
    if (error) throw error
  },
  async pull(userId: string): Promise<Snapshot> {
    const { data, error } = await supabase!.from('user_data').select('progress, profile, revision').eq('user_id', userId).maybeSingle()
    if (error) throw error
    return data ?? { progress: {}, profile: {}, revision: 0 }
  },
  async commit(revision: number, ids: string[], next: UserData): Promise<SyncReply> {
    const { data, error } = await supabase!.rpc('sync_learning', { expected_revision: revision, activity_ids: ids, next_progress: next.progress, next_profile: next.profile })
    if (error) throw error
    return data as SyncReply
  },
}
