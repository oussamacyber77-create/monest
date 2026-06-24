"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"

interface MeetingIdProps {
  roomCode: string
}

export function MeetingId({ roomCode }: MeetingIdProps) {
  const [copied, setCopied] = useState(false)
  const { direction } = useSettingsStore()

  const copy = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#666666] dark:text-[#999999] font-mono hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors"
    >
      <span>{roomCode}</span>
      {copied ? <Check size={14} className="text-[#0D0D0D] dark:text-[#F2F2F2]" /> : <Copy size={14} />}
    </button>
  )
}
