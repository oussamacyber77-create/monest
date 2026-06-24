"use client"

import { useMeetingStore } from "@/stores/meeting-store"

const reactions = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "😮", label: "Wow" },
  { emoji: "👏", label: "Clap" },
]

interface QuickReactionsProps {
  onReact: (emoji: string) => void
}

export function QuickReactions({ onReact }: QuickReactionsProps) {
  const { reaction } = useMeetingStore()

  return (
    <div className="relative">
      <div className="flex gap-1 p-2 bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] shadow-lg">
        {reactions.map((r) => (
          <button
            key={r.emoji}
            onClick={() => onReact(r.emoji)}
            className="w-10 h-10 flex items-center justify-center text-lg hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors"
            title={r.label}
          >
            {r.emoji}
          </button>
        ))}
      </div>

      {reaction && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <span
            key={reaction + Date.now()}
            className="text-6xl animate-[bounce_1s_ease-out]"
          >
            {reaction}
          </span>
        </div>
      )}
    </div>
  )
}
