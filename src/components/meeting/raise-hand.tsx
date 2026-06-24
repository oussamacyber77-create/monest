"use client"

import { Hand } from "lucide-react"
import { useMeetingStore } from "@/stores/meeting-store"
import { useSettingsStore } from "@/stores/settings-store"
import { cn } from "@/lib/utils"

export function RaiseHand() {
  const { handRaised, setHandRaised } = useMeetingStore()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <button
      onClick={() => setHandRaised(!handRaised)}
      className={cn(
        "relative p-3 transition-colors",
        handRaised
          ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
          : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#333333]"
      )}
      title={lang === "ar" ? "رفع اليد" : "Raise Hand"}
    >
      <Hand size={20} />
      {handRaised && (
        <span className="absolute -top-1 -end-1 w-3 h-3 bg-[#DC2626]" />
      )}
    </button>
  )
}
