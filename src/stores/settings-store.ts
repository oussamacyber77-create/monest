"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Direction = "ltr" | "rtl"
type Theme = "light" | "dark"

interface SettingsState {
  direction: Direction
  theme: Theme
  primaryColor: string
  setDirection: (d: Direction) => void
  toggleDirection: () => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setPrimaryColor: (color: string) => void
}

const storage = typeof window !== "undefined" ? window.sessionStorage : undefined

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      direction: "rtl",
      theme: "light",
      primaryColor: "#0D0D0D",
      setDirection: (direction) => set({ direction }),
      toggleDirection: () =>
        set((s) => ({ direction: s.direction === "ltr" ? "rtl" : "ltr" })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setPrimaryColor: (color) => set({ primaryColor: color }),
    }),
    {
      name: "monest-settings",
      storage: createJSONStorage(() => storage!),
      skipHydration: true,
    }
  )
)
