import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { RoomState } from "@/types"

interface RoomActions {
  setPhone: (phone: string) => void
  setRoom: (roomId: string, token: string) => void
  setAdmin: (admin: boolean) => void
  clearRoom: () => void
  reset: () => void
}

const initialState: RoomState = {
  phone: "",
  roomId: null,
  liveKitToken: null,
  identity: "",
  displayName: "",
  isAdmin: false,
}

export const useRoomStore = create<RoomState & RoomActions>()(
  persist(
    (set) => ({
      ...initialState,
      setPhone: (phone) =>
        set({
          phone,
          identity: phone.replace(/\D/g, ""),
          displayName:
            phone.replace(/\D/g, "").length >= 4
              ? "User " + phone.replace(/\D/g, "").slice(-4)
              : "User",
        }),
      setRoom: (roomId, token) => set({ roomId, liveKitToken: token }),
      setAdmin: (admin) => set({ isAdmin: admin }),
      clearRoom: () => set({ roomId: null, liveKitToken: null }),
      reset: () => set(initialState),
    }),
    {
      name: "monest-room",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : undefined!
      ),
    }
  )
)
