import { create } from "zustand"

export type UserRole = "guest" | "member" | "admin"

interface AuthState {
  role: UserRole
  isLoading: boolean
  loginAsAdmin: () => void
  loginAsMember: () => void
  logout: () => void
  checkSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "guest",
  isLoading: true,

  loginAsAdmin: () => {
    sessionStorage.setItem("monest-admin", "1")
    set({ role: "admin", isLoading: false })
  },

  loginAsMember: () => {
    sessionStorage.setItem("monest-member", "1")
    set({ role: "member", isLoading: false })
  },

  logout: () => {
    sessionStorage.removeItem("monest-admin")
    sessionStorage.removeItem("monest-member")
    set({ role: "guest", isLoading: false })
  },

  checkSession: () => {
    const isAdmin = sessionStorage.getItem("monest-admin") === "1"
    const isMember = sessionStorage.getItem("monest-member") === "1"
    const role: UserRole = isAdmin ? "admin" : isMember ? "member" : "guest"
    set({ role, isLoading: false })
  },
}))
