"use client"

import { useEffect } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"

export function Providers() {
  const { direction, theme } = useSettingsStore()
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute("dir", direction)
    html.setAttribute("lang", direction === "rtl" ? "ar" : "en")
  }, [direction])

  useEffect(() => {
    const html = document.documentElement
    if (theme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    const stored = window.sessionStorage.getItem("monest-settings")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const state = parsed.state || parsed
        const html = document.documentElement
        if (state.direction) html.setAttribute("dir", state.direction)
        if (state.direction) html.setAttribute("lang", state.direction === "rtl" ? "ar" : "en")
        if (state.theme === "dark") html.classList.add("dark")
      } catch {}
    }
  }, [])

  return null
}
