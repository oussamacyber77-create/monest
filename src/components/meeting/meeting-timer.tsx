"use client"

import { useState, useEffect } from "react"

export function MeetingTimer() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#666666] dark:text-[#999999] font-mono">
      {hours > 0 ? (pad(hours) + ":") : ""}
      {pad(minutes)}:{pad(seconds)}
    </div>
  )
}
