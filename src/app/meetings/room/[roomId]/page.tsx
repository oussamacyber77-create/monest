"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MeetingRoom } from "@/components/meeting/meeting-room"
import { useRoomStore } from "@/stores/room-store"

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { phone, liveKitToken, isAdmin } = useRoomStore()
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMounted(true)
    useRoomStore.persist.rehydrate()
    setReady(true)
  }, [])

  useEffect(() => {
    if (mounted && ready && (!phone || !liveKitToken)) {
      router.replace("/")
    }
  }, [mounted, ready, phone, liveKitToken, router])

  if (!mounted || !ready || !phone || !liveKitToken) {
    return (
      <div className="flex items-center justify-center flex-1 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-3 text-[#666666] dark:text-[#999999]">
          <div className="w-8 h-8 border-2 border-[#CCCCCC] dark:border-[#666666] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
          <p className="text-sm">Joining meeting...</p>
        </div>
      </div>
    )
  }

  return <MeetingRoom roomCode={roomId} isAdmin={isAdmin} />
}
