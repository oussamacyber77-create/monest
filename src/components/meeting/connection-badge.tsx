"use client"

import { useEffect, useState } from "react"
import { Room, ConnectionQuality } from "livekit-client"
import { Wifi, WifiOff } from "lucide-react"

interface ConnectionBadgeProps {
  room: Room | null
}

export function ConnectionBadge({ room }: ConnectionBadgeProps) {
  const [quality, setQuality] = useState<ConnectionQuality>(ConnectionQuality.Unknown)

  useEffect(() => {
    if (!room?.localParticipant) return

    const update = () => {
      setQuality(room.localParticipant.connectionQuality)
    }

    update()

    room.localParticipant.on("connectionQualityChanged", update)
    return () => {
      room.localParticipant.off("connectionQualityChanged", update)
    }
  }, [room])

  if (quality === ConnectionQuality.Unknown || quality === ConnectionQuality.Lost) return null

  const isGood = quality === ConnectionQuality.Excellent || quality === ConnectionQuality.Good

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-xs">
      {isGood ? (
        <Wifi size={12} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
      ) : (
        <WifiOff size={12} className="text-[#666666]" />
      )}
      <span className={isGood ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666]"}>
        {isGood ? "Stable" : "Weak"}
      </span>
    </div>
  )
}
