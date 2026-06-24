"use client"

import { create } from "zustand"

interface HandRaise {
  identity: string
  name: string
  timestamp: number
}

interface MeetingState {
  handRaised: boolean
  handRaiseQueue: HandRaise[]
  pinnedSpeaker: string | null
  reaction: string | null
  reactionTimeout: ReturnType<typeof setTimeout> | null
  isRecording: boolean
  setHandRaised: (raised: boolean) => void
  addHandRaise: (identity: string, name: string) => void
  removeHandRaise: (identity: string) => void
  clearHandRaiseQueue: () => void
  setPinnedSpeaker: (identity: string | null) => void
  showReaction: (reaction: string) => void
  clearReaction: () => void
  setIsRecording: (recording: boolean) => void
}

export const useMeetingStore = create<MeetingState>((set) => ({
  handRaised: false,
  handRaiseQueue: [],
  pinnedSpeaker: null,
  reaction: null,
  reactionTimeout: null,
  isRecording: false,
  setHandRaised: (raised) => set({ handRaised: raised }),
  addHandRaise: (identity, name) =>
    set((s) => {
      if (s.handRaiseQueue.some((h) => h.identity === identity)) return s
      return { handRaiseQueue: [...s.handRaiseQueue, { identity, name, timestamp: Date.now() }] }
    }),
  removeHandRaise: (identity) =>
    set((s) => ({
      handRaiseQueue: s.handRaiseQueue.filter((h) => h.identity !== identity),
    })),
  clearHandRaiseQueue: () => set({ handRaiseQueue: [] }),
  setPinnedSpeaker: (identity) => set({ pinnedSpeaker: identity }),
  showReaction: (reaction) =>
    set((s) => {
      if (s.reactionTimeout) clearTimeout(s.reactionTimeout)
      return {
        reaction,
        reactionTimeout: setTimeout(() => set({ reaction: null }), 2000),
      }
    }),
  clearReaction: () => set({ reaction: null }),
  setIsRecording: (recording) => set({ isRecording: recording }),
}))
