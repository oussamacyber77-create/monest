"use client"

import { useMemo } from "react"
import { LocalParticipant, RemoteParticipant, Track } from "livekit-client"
import { VideoTile } from "@/components/meeting/video-tile"

interface VideoGridProps {
  participants: Array<RemoteParticipant | LocalParticipant>
  localParticipant: LocalParticipant | null
}

export function VideoGrid({ participants, localParticipant }: VideoGridProps) {
  const count = participants.length

  const layout = useMemo(() => {
    if (count <= 1) return "single"
    if (count === 2) return "split"
    if (count <= 4) return "grid-2x2"
    return "gallery"
  }, [count])

  return (
    <div className={gridClasses(layout)}>
      {localParticipant && (
        <VideoTile
          key={localParticipant.sid}
          participant={localParticipant}
          isLocal
          source={Track.Source.Camera}
        />
      )}
      {participants
        .filter((p) => p.sid !== localParticipant?.sid)
        .map((participant) => (
          <VideoTile
            key={participant.sid}
            participant={participant}
            source={Track.Source.Camera}
          />
        ))}
    </div>
  )
}

function gridClasses(layout: string): string {
  const base = "w-full h-full gap-px"
  switch (layout) {
    case "single":
      return base + " flex items-center justify-center"
    case "split":
      return base + " grid grid-cols-2"
    case "grid-2x2":
      return base + " grid grid-cols-2 grid-rows-2"
    case "gallery":
      return base + " grid grid-cols-3 gap-px overflow-y-auto auto-rows-fr"
    default:
      return base + " flex items-center justify-center"
  }
}
