"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Direction = "ltr" | "rtl"
type Theme = "light" | "dark"

interface SettingsState {
  direction: Direction
  theme: Theme
  setDirection: (d: Direction) => void
  toggleDirection: () => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      direction: "rtl",
      theme: "light",
      setDirection: (direction) => set({ direction }),
      toggleDirection: () =>
        set((s) => ({ direction: s.direction === "ltr" ? "rtl" : "ltr" })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "monest-settings",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : undefined!
      ),
    }
  )
)
