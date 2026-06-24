"use client"

import { useState, useRef, useEffect } from "react"
import { Video, VideoOff, Mic, MicOff, Monitor, MessageCircle, LogOut, Copy, Hand, SmilePlus, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCopyLink } from "@/hooks/use-copy-link"
import { useSettingsStore } from "@/stores/settings-store"
import { QuickReactions } from "@/components/meeting/quick-reactions"
import { RaiseHand } from "@/components/meeting/raise-hand"

interface MediaControlsProps {
  cameraOn: boolean
  micOn: boolean
  screenShare: boolean
  onToggleCamera: () => void
  onToggleMic: () => void
  onToggleScreenShare: () => void
  onToggleChat: () => void
  onToggleParticipants: () => void
  onLeave: () => void
  onReact: (emoji: string) => void
  onRaiseHand: () => void
  roomCode: string
  chatUnread: number
  showChat: boolean
  showParticipants: boolean
}

export function MediaControls({
  cameraOn,
  micOn,
  screenShare,
  onToggleCamera,
  onToggleMic,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onLeave,
  onReact,
  onRaiseHand,
  roomCode,
  chatUnread,
  showChat,
  showParticipants,
}: MediaControlsProps) {
  const { copied, copyLink } = useCopyLink(roomCode)
  const [showReactions, setShowReactions] = useState(false)
  const reactionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(e.target as Node)) {
        setShowReactions(false)
      }
    }
    if (showReactions) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showReactions])

  const activeStyle = "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
  const inactiveStyle = "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#333333]"

  return (
    <div className="px-4 py-3 bg-[#F2F2F2] dark:bg-[#0D0D0D] border-t border-[#D4D4D4] dark:border-[#333333]">
      <div className="flex items-center justify-center gap-1 max-w-2xl mx-auto">
        <ControlButton
          icon={cameraOn ? Video : VideoOff}
          active={cameraOn}
          onClick={onToggleCamera}
          label={cameraOn ? "Camera On" : "Camera Off"}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />
        <ControlButton
          icon={micOn ? Mic : MicOff}
          active={micOn}
          onClick={onToggleMic}
          label={micOn ? "Mic On" : "Mic Off"}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />
        <ControlButton
          icon={Monitor}
          active={screenShare}
          onClick={onToggleScreenShare}
          label="Screen Share"
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />

        <div className="w-px h-8 bg-[#D4D4D4] dark:bg-[#333333] mx-1" />

        <div ref={reactionsRef} className="relative">
          <ControlButton
            icon={SmilePlus}
            active={showReactions}
            onClick={() => setShowReactions(!showReactions)}
            label="Reactions"
            activeStyle={activeStyle}
            inactiveStyle={inactiveStyle}
          />
          {showReactions && (
            <div className="absolute bottom-full start-1/2 -translate-x-1/2 mb-2">
              <QuickReactions onReact={(emoji) => { onReact(emoji); setShowReactions(false) }} />
            </div>
          )}
        </div>

        <RaiseHand />

        <ControlButton
          icon={Users}
          active={showParticipants}
          onClick={onToggleParticipants}
          label="Participants"
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />

        <div className="w-px h-8 bg-[#D4D4D4] dark:bg-[#333333] mx-1" />

        <ControlButton
          icon={MessageCircle}
          active={showChat}
          onClick={onToggleChat}
          label="Chat"
          badge={chatUnread > 0 ? chatUnread : undefined}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />
        <ControlButton
          icon={Copy}
          active={copied}
          onClick={copyLink}
          label={copied ? "Copied!" : "Copy Link"}
          activeStyle={activeStyle}
          inactiveStyle={inactiveStyle}
        />

        <div className="w-px h-8 bg-[#D4D4D4] dark:bg-[#333333] mx-1" />

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20 transition-colors"
          title="Leave Meeting"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  )
}

interface ControlButtonProps {
  icon: any
  active: boolean
  onClick: () => void
  label: string
  badge?: number
  activeStyle: string
  inactiveStyle: string
}

function ControlButton({ icon: Icon, active, onClick, label, badge, activeStyle, inactiveStyle }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("relative p-3 transition-colors", active ? activeStyle : inactiveStyle)}
      title={label}
    >
      <Icon size={20} />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -end-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-[#F2F2F2] bg-[#0D0D0D] dark:text-[#0D0D0D] dark:bg-[#F2F2F2]">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  )
}
