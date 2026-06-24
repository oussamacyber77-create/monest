"use client"

import { Users } from "lucide-react"

interface ParticipantCountProps {
  count: number
}

export function ParticipantCount({ count }: ParticipantCountProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#666666] dark:text-[#999999]">
      <Users size={14} />
      <span>{count}</span>
    </div>
  )
}
