"use client"

import { X, Pin, MicOff, Mic, Crown } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useMeetingStore } from "@/stores/meeting-store"
import { useRoomStore } from "@/stores/room-store"

interface Participant {
  identity: string
  name: string
  isMuted: boolean
  role: "admin" | "attendee"
}

interface ParticipantsPanelProps {
  participants: Participant[]
  onClose: () => void
}

export function ParticipantsPanel({ participants, onClose }: ParticipantsPanelProps) {
  const { direction } = useSettingsStore()
  const { pinnedSpeaker, setPinnedSpeaker } = useMeetingStore()
  const { identity } = useRoomStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="w-72 border-s border-[#D4D4D4] dark:border-[#333333] bg-[#F2F2F2] dark:bg-[#0D0D0D] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
        <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
          {lang === "ar" ? "المشاركون" : "Participants"} ({participants.length})
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {participants.map((p) => {
          const isMe = p.identity === identity
          const isPinned = p.identity === pinnedSpeaker
          return (
            <div
              key={p.identity}
              className="flex items-center justify-between px-3 py-2 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 bg-[#D4D4D4] dark:bg-[#333333] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#666666] dark:text-[#999999]">
                    {p.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">
                      {p.name}{isMe ? ` (${lang === "ar" ? "أنت" : "You"})` : ""}
                    </span>
                    {p.role === "admin" && <Crown size={12} className="text-[#0D0D0D] dark:text-[#F2F2F2] shrink-0" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {p.isMuted ? (
                  <MicOff size={14} className="text-[#999999]" />
                ) : (
                  <Mic size={14} className="text-[#666666]" />
                )}
                {p.role === "admin" && (
                  <button
                    onClick={() => setPinnedSpeaker(isPinned ? null : p.identity)}
                    className={"p-1 transition-colors " + (isPinned
                      ? "text-[#0D0D0D] dark:text-[#F2F2F2]"
                      : "text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}
                    title={lang === "ar" ? "تثبيت المتحدث" : "Pin speaker"}
                  >
                    <Pin size={14} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
