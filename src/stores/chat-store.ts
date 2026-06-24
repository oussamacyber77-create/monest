import { create } from "zustand"
import type { ChatMessage } from "@/types"

interface ChatState {
  messages: ChatMessage[]
  unreadCount: number
  addMessage: (msg: ChatMessage) => void
  clearMessages: () => void
  resetUnread: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  unreadCount: 0,
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
      unreadCount: state.unreadCount + 1,
    })),
  clearMessages: () => set({ messages: [] }),
  resetUnread: () => set({ unreadCount: 0 }),
}))
