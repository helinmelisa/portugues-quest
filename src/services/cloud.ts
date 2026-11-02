import type { LearningProgress, UserProfile } from '../types'
import { supabase } from './supabase'

export interface UserData {
  progress: LearningProgress
  profile: UserProfile
}

export const cloud = {
  enabled: supabase !== null,

  async signIn(email: string) {
    if (!supabase) return 'Sync is not configured.'
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/app/settings` } })
    return error?.message ?? null
  },

  async signOut() {
    await supabase?.auth.signOut()
  },

  async pull(userId: string): Promise<Partial<UserData> | null> {
    if (!supabase) return null
    const { data, error } = await supabase.from('user_data').select('progress, profile').eq('user_id', userId).maybeSingle()
    if (error) throw error
    return data
  },

  async push(userId: string, data: UserData) {
    if (!supabase) return
    const { error } = await supabase.from('user_data').upsert({ user_id: userId, ...data, updated_at: new Date().toISOString() })
    if (error) throw error
  },
}
