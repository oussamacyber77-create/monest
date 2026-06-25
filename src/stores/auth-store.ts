import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (email: string, password: string, name: string, phone?: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true,

  initialize: async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      set({
        user: session.user,
        isAdmin: session.user.app_metadata?.role === "admin" || false,
        isLoading: false,
      })
    } else {
      set({ isLoading: false })
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: session.user,
          isAdmin: session.user.app_metadata?.role === "admin" || false,
          isLoading: false,
        })
      } else {
        set({ user: null, isAdmin: false, isLoading: false })
      }
    })
  },

  login: async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  },

  signup: async (email: string, password: string, name: string, phone?: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone: phone || "" } },
    })
    if (error) return { error: error.message }
    return {}
  },

  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, isAdmin: false })
  },
}))
