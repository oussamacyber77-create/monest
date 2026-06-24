"use client"

import { Check, X, MicOff, VideoOff, LogOut, Circle } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useMeetingStore } from "@/stores/meeting-store"

interface AdminMeetingBarProps {
  handRaiseQueue: Array<{ identity: string; name: string }>
  onApproveHand: (identity: string) => void
  onDismissHand: (identity: string) => void
  onMuteParticipant: (identity: string) => void
  onDisableCamera: (identity: string) => void
  onRemoveParticipant: (identity: string) => void
  onStartRecording: () => void
  isRecording: boolean
}

export function AdminMeetingBar({
  handRaiseQueue,
  onApproveHand,
  onDismissHand,
  isRecording,
  onStartRecording,
}: AdminMeetingBarProps) {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  if (handRaiseQueue.length === 0 && !isRecording) return null

  return (
    <div className="px-4 py-2 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {handRaiseQueue.map((h) => (
            <div key={h.identity} className="flex items-center gap-2 text-sm">
              <span>{h.name} {lang === "ar" ? "يريد التحدث" : "wants to speak"}</span>
              <button
                onClick={() => onApproveHand(h.identity)}
                className="p-1 bg-green-600/30 text-green-400 hover:bg-green-600/50 transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => onDismissHand(h.identity)}
                className="p-1 bg-[#DC2626]/30 text-[#DC2626] hover:bg-[#DC2626]/50 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onStartRecording}
          className={"flex items-center gap-2 px-3 py-1 text-sm font-medium transition-colors " + (isRecording
            ? "bg-[#DC2626]/30 text-[#DC2626] animate-pulse"
            : "hover:bg-white/10")}
        >
          <Circle size={12} className={isRecording ? "fill-[#DC2626]" : ""} />
          {isRecording ? (lang === "ar" ? "تسجيل..." : "Recording...") : (lang === "ar" ? "تسجيل" : "Record")}
        </button>
      </div>
    </div>
  )
}
