import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabaseClient'

type UserInfo = {
  id: string
  email: string | null
  name?: string | null
  avatar_url?: string | null
}

type AuthState = {
  user: UserInfo | null
  accessToken: string | null
  isAuthenticated: boolean
  setSession: (user: UserInfo, accessToken: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setSession: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      clearSession: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const u = data.user
  const token = data.session?.access_token || null
  if (u && token) {
    useAuthStore.getState().setSession(
      { id: u.id, email: u.email ?? null, name: u.user_metadata?.name ?? null, avatar_url: u.user_metadata?.avatar_url ?? null },
      token
    )
  }
  return data
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signInWithGoogle(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
  if (error) throw error
  return data
}

export async function signInWithGithub(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo },
  })
  if (error) throw error
  return data
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession()
  return data.session || null
}

export async function signOut() {
  await supabase.auth.signOut()
  useAuthStore.getState().clearSession()
}

export async function updateProfile(data: { name?: string | null; avatar_url?: string | null }) {
  const { data: res, error } = await supabase.auth.updateUser({ data })
  if (error) throw error
  const u = res.user
  if (u) {
    useAuthStore.getState().setSession(
      { id: u.id, email: u.email ?? null, name: u.user_metadata?.name ?? null, avatar_url: u.user_metadata?.avatar_url ?? null },
      (await supabase.auth.getSession()).data.session?.access_token || ''
    )
  }
  return res
}
