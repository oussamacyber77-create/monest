"use client"

import { useEffect, useRef, useState } from "react"
import { Participant, Track, TrackPublication } from "livekit-client"
import { cn } from "@/lib/utils"
import { Mic, MicOff, User } from "lucide-react"

interface VideoTileProps {
  participant: Participant
  isLocal?: boolean
  source?: Track.Source
}

export function VideoTile({ participant, isLocal, source = Track.Source.Camera }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [trackPub, setTrackPub] = useState<TrackPublication | null>(null)

  useEffect(() => {
    const pub = participant.getTrackPublication(Track.Source.Camera)
    setTrackPub(pub ?? null)

    const handleSub = (track: any, publication: any) => {
      if (publication.source === source) setTrackPub(publication)
    }
    const handleUnsub = (track: any, publication: any) => {
      if (publication.source === source) setTrackPub(null)
    }

    participant.on("trackSubscribed", handleSub)
    participant.on("trackUnsubscribed", handleUnsub)
    return () => {
      participant.off("trackSubscribed", handleSub)
      participant.off("trackUnsubscribed", handleUnsub)
    }
  }, [participant, source])

  useEffect(() => {
    if (!trackPub?.track || !videoRef.current) return
    trackPub.track.attach(videoRef.current)
    return () => {
      trackPub.track?.detach(videoRef.current!)
    }
  }, [trackPub])

  useEffect(() => {
    const updateMuted = () => {
      const pub = participant.getTrackPublication(Track.Source.Microphone)
      setIsMuted(pub?.isMuted ?? true)
    }
    updateMuted()
    participant.on("trackMuted", updateMuted)
    participant.on("trackUnmuted", updateMuted)
    return () => {
      participant.off("trackMuted", updateMuted)
      participant.off("trackUnmuted", updateMuted)
    }
  }, [participant])

  const displayName = isLocal
    ? "You"
    : participant.name || "User " + participant.identity?.slice(-4)

  const showVideo = trackPub?.track && !trackPub.track.isMuted

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#E8E8E8] dark:bg-[#1A1A1A] group",
        "flex items-center justify-center"
      )}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-16 h-16 bg-[#D4D4D4] dark:bg-[#333333] flex items-center justify-center">
            <User size={28} className="text-[#666666] dark:text-[#999999]" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{displayName}</span>
          {isMuted ? (
            <MicOff size={14} className="text-[#999999]" />
          ) : (
            <Mic size={14} className="text-white" />
          )}
        </div>
      </div>
    </div>
  )
}
