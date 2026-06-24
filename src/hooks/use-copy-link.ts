"use client"

import { useState } from "react"

export function useCopyLink(roomCode: string) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  return { copied, copyLink }
}
