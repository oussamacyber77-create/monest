import { create } from "zustand"

interface AuthState {
  isAdmin: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  checkSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  isLoading: true,

  login: () => {
    sessionStorage.setItem("monest-admin", "1")
    set({ isAdmin: true, isLoading: false })
  },

  logout: () => {
    sessionStorage.removeItem("monest-admin")
    set({ isAdmin: false, isLoading: false })
  },

  checkSession: () => {
    const session = sessionStorage.getItem("monest-admin")
    set({ isAdmin: session === "1", isLoading: false })
  },
}))
