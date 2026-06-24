"use client"

import { useEffect, useRef } from "react"
import { Room, Track } from "livekit-client"

export function useAudioHandler(room: Room | null) {
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  useEffect(() => {
    if (!room) return

    const handleTrackSubscribed = (track: any, publication: any, participant: any) => {
      if (publication.kind !== "audio") return
      const audio = new Audio()
      audio.srcObject = new MediaStream([track.mediaStreamTrack])
      audio.play().catch(() => {})
      audioElementsRef.current.set(publication.trackSid, audio)
    }

    const handleTrackUnsubscribed = (track: any, publication: any, participant: any) => {
      if (publication.kind !== "audio") return
      const audio = audioElementsRef.current.get(publication.trackSid)
      if (audio) {
        audio.pause()
        audio.srcObject = null
        audioElementsRef.current.delete(publication.trackSid)
      }
    }

    room.on("trackSubscribed", handleTrackSubscribed)
    room.on("trackUnsubscribed", handleTrackUnsubscribed)

    return () => {
      room.off("trackSubscribed", handleTrackSubscribed)
      room.off("trackUnsubscribed", handleTrackUnsubscribed)
      audioElementsRef.current.forEach((audio) => {
        audio.pause()
        audio.srcObject = null
      })
      audioElementsRef.current.clear()
    }
  }, [room])
}
