"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Room, RemoteParticipant, LocalParticipant, DataPacket_Kind } from "livekit-client"
import { useRoomStore } from "@/stores/room-store"
import { useMeetingStore } from "@/stores/meeting-store"
import { getLiveKitUrl } from "@/lib/livekit-client"
import { VideoGrid } from "@/components/meeting/video-grid"
import { MediaControls } from "@/components/meeting/media-controls"
import { ChatPanel } from "@/components/meeting/chat-panel"
import { MeetingTimer } from "@/components/meeting/meeting-timer"
import { ParticipantCount } from "@/components/meeting/participant-count"
import { ConnectionBadge } from "@/components/meeting/connection-badge"
import { MeetingId } from "@/components/meeting/meeting-id"
import { ParticipantsPanel } from "@/components/meeting/participants-panel"
import { AdminMeetingBar } from "@/components/meeting/admin-meeting-bar"
import { useChatStore } from "@/stores/chat-store"
import { useAudioHandler } from "@/lib/use-audio"
import { useSettingsStore } from "@/stores/settings-store"

interface MeetingRoomProps {
  roomCode: string
  isAdmin?: boolean
}

export function MeetingRoom({ roomCode, isAdmin = false }: MeetingRoomProps) {
  const roomRef = useRef<Room | null>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const [participants, setParticipants] = useState<Array<RemoteParticipant | LocalParticipant>>([])
  const [isConnected, setIsConnected] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [screenShare, setScreenShare] = useState(false)
  const { liveKitToken, displayName, phone, identity, clearRoom } = useRoomStore()
  const { theme } = useSettingsStore()
  const addMessage = useChatStore((s) => s.addMessage)

  const {
    handRaiseQueue, addHandRaise, removeHandRaise, clearHandRaiseQueue,
    setHandRaised, showReaction, reaction, isRecording, setIsRecording,
    pinnedSpeaker, setPinnedSpeaker,
  } = useMeetingStore()

  useAudioHandler(roomRef.current)

  const sendData = useCallback((data: object) => {
    if (!roomRef.current) return
    const encoder = new TextEncoder()
    roomRef.current.localParticipant.publishData(encoder.encode(JSON.stringify(data)), { reliable: true })
  }, [])

  const handleDataReceived = useCallback(
    (payload: Uint8Array, participant?: RemoteParticipant) => {
      try {
        const decoder = new TextDecoder()
        const text = decoder.decode(payload)
        const data = JSON.parse(text)
        if (data.type === "chat" && data.message && data.sender) {
          addMessage({
            id: crypto.randomUUID(),
            sender: data.sender,
            senderDisplayName: data.senderDisplayName || "User",
            message: data.message,
            timestamp: data.timestamp || Date.now(),
            isPrivate: data.isPrivate,
            attachment: data.attachment,
          })
        }
        if (data.type === "reaction" && data.emoji) {
          const name = data.senderName || "User"
          const showReaction = useMeetingStore.getState().showReaction
          showReaction(data.emoji)
        }
        if (data.type === "raise_hand" && data.raised && data.name) {
          addHandRaise(data.sender, data.name)
        }
        if (data.type === "raise_hand" && !data.raised) {
          removeHandRaise(data.sender)
        }
      } catch {}
    },
    [addMessage, addHandRaise, removeHandRaise]
  )

  const handleParticipantDisconnected = useCallback(
    (participant: RemoteParticipant) => {
      setParticipants((prev) => prev.filter((p) => p.sid !== participant.sid))
      removeHandRaise(participant.identity)
    },
    [removeHandRaise]
  )

  useEffect(() => {
    if (!liveKitToken) return

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: { resolution: { width: 1280, height: 720 } },
    })

    roomRef.current = room

    room.on("participantConnected", (participant: RemoteParticipant) => {
      setParticipants((prev) => [...prev, participant])
    })

    room.on("participantDisconnected", handleParticipantDisconnected)

    room.on("activeSpeakersChanged", () => {
      const allParticipants = [room.localParticipant, ...Array.from(room.remoteParticipants.values())]
      setParticipants(allParticipants.filter(Boolean))
    })

    room.on("dataReceived", handleDataReceived)

    room.on("connected", () => {
      setIsConnected(true)
      setParticipants([room.localParticipant])
      room.localParticipant.setMicrophoneEnabled(true).catch(() => {})
      room.localParticipant.setCameraEnabled(true).catch(() => {})
      room.startAudio().catch(() => {})
    })

    room.on("disconnected", () => {
      setIsConnected(false)
      setParticipants([])
    })

    const connect = async () => {
      try {
        const url = getLiveKitUrl()
        await room.connect(url, liveKitToken)
      } catch (err) {
        console.error("Failed to connect to LiveKit:", err)
      }
    }
    connect()

    return () => {
      room.disconnect()
      roomRef.current = null
    }
  }, [liveKitToken, handleDataReceived, handleParticipantDisconnected])

  const handleLeave = () => {
    if (roomRef.current) {
      roomRef.current.disconnect()
    }
    setHandRaised(false)
    clearHandRaiseQueue()
    clearRoom()
    window.location.href = "/meetings/feedback/" + roomCode
  }

  const toggleCamera = async () => {
    if (!roomRef.current) return
    if (cameraOn) {
      await roomRef.current.localParticipant.setCameraEnabled(false)
    } else {
      await roomRef.current.localParticipant.setCameraEnabled(true)
    }
    setCameraOn(!cameraOn)
  }

  const toggleMic = async () => {
    if (!roomRef.current) return
    if (micOn) {
      await roomRef.current.localParticipant.setMicrophoneEnabled(false)
    } else {
      await roomRef.current.localParticipant.setMicrophoneEnabled(true)
    }
    setMicOn(!micOn)
  }

  const toggleScreenShare = async () => {
    if (!roomRef.current) return
    if (screenShare) {
      await roomRef.current.localParticipant.setScreenShareEnabled(false)
    } else {
      await roomRef.current.localParticipant.setScreenShareEnabled(true)
    }
    setScreenShare(!screenShare)
  }

  const handleReact = (emoji: string) => {
    showReaction(emoji)
    sendData({ type: "reaction", emoji, sender: identity, senderName: displayName })
  }

  const handleRaiseHand = () => {
    const raised = !useMeetingStore.getState().handRaised
    setHandRaised(raised)
    sendData({ type: "raise_hand", raised, sender: identity, name: displayName })
  }

  const handleApproveHand = (targetIdentity: string) => {
    removeHandRaise(targetIdentity)
  }

  const handleDismissHand = (targetIdentity: string) => {
    removeHandRaise(targetIdentity)
  }

  const handleStartRecording = () => {
    setIsRecording(!isRecording)
  }

  const participantList = participants.map((p) => ({
    identity: p.identity,
    name: p.name || "User " + p.identity?.slice(-4),
    isMuted: p.isMicrophoneEnabled === false,
    role: (isAdmin && p.identity === identity ? "admin" : "attendee") as "admin" | "attendee",
  }))

  return (
    <div className="flex-1 flex bg-[#F2F2F2] dark:bg-[#0D0D0D] h-full">
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ParticipantCount count={participants.length} />
            <ConnectionBadge room={roomRef.current} />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <MeetingId roomCode={roomCode} />
          </div>
          <MeetingTimer />
        </div>

        {isAdmin && (
          <div className="absolute top-14 inset-x-3 z-10">
            <AdminMeetingBar
              handRaiseQueue={handRaiseQueue}
              onApproveHand={handleApproveHand}
              onDismissHand={handleDismissHand}
              onMuteParticipant={() => {}}
              onDisableCamera={() => {}}
              onRemoveParticipant={() => {}}
              onStartRecording={handleStartRecording}
              isRecording={isRecording}
            />
          </div>
        )}

        <div ref={videoRef} className="flex-1 flex items-center justify-center p-4 pt-16 pb-20">
          {isConnected ? (
            <VideoGrid
              participants={participants}
              localParticipant={roomRef.current?.localParticipant ?? null}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-[#666666] dark:text-[#999999]">
              <div className="w-8 h-8 border-2 border-[#CCCCCC] dark:border-[#666666] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
              <p className="text-sm">Connecting to meeting...</p>
            </div>
          )}
        </div>

        {reaction && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <span className="text-6xl" style={{ animation: "bounce 1s ease-out" }}>{reaction}</span>
          </div>
        )}

        <MediaControls
          cameraOn={cameraOn}
          micOn={micOn}
          screenShare={screenShare}
          onToggleCamera={toggleCamera}
          onToggleMic={toggleMic}
          onToggleScreenShare={toggleScreenShare}
          onToggleChat={() => setShowChat(!showChat)}
          onToggleParticipants={() => setShowParticipants(!showParticipants)}
          onLeave={handleLeave}
          onReact={handleReact}
          onRaiseHand={handleRaiseHand}
          roomCode={roomCode}
          chatUnread={useChatStore((s) => s.unreadCount)}
          showChat={showChat}
          showParticipants={showParticipants}
        />
      </div>

      {showChat && (
        <ChatPanel
          room={roomRef.current}
          onClose={() => setShowChat(false)}
        />
      )}

      {showParticipants && (
        <ParticipantsPanel
          participants={participantList}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </div>
  )
}
