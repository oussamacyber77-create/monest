"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { LeadStage } from "@/lib/mock-data/crm"

interface RegistrationSession {
  id: string
  startTime: string
  lastStep: LeadStage
  name: string
  phone: string
  selectedPackage: string | null
  scheduledDate: string | null
  completed: boolean
}

interface RegistrationTrackingState {
  sessions: RegistrationSession[]
  currentSessionId: string | null
  startSession: () => string
  updateStep: (sessionId: string, step: LeadStage, data?: Partial<RegistrationSession>) => void
  completeSession: (sessionId: string) => void
  getSession: (id: string) => RegistrationSession | undefined
}

function generateId(): string {
  return "reg-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const useRegistrationTrackingStore = create<RegistrationTrackingState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      startSession: () => {
        const id = generateId()
        const session: RegistrationSession = {
          id,
          startTime: new Date().toISOString(),
          lastStep: "name",
          name: "",
          phone: "",
          selectedPackage: null,
          scheduledDate: null,
          completed: false,
        }
        set((s) => ({ sessions: [...s.sessions, session], currentSessionId: id }))
        return id
      },
      updateStep: (sessionId, step, data) => {
        set((s) => ({
          sessions: s.sessions.map((ses) =>
            ses.id === sessionId
              ? { ...ses, lastStep: step, ...data }
              : ses
          ),
        }))
      },
      completeSession: (sessionId) => {
        set((s) => ({
          sessions: s.sessions.map((ses) =>
            ses.id === sessionId ? { ...ses, completed: true, lastStep: "payment" } : ses
          ),
        }))
      },
      getSession: (id) => {
        return get().sessions.find((s) => s.id === id)
      },
    }),
    {
      name: "monest-registration-tracking",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : undefined!
      ),
    }
  )
)
