"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useRoomStore } from "@/stores/room-store"
import { useSettingsStore } from "@/stores/settings-store"

export default function WaitingPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { liveKitToken } = useRoomStore()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!liveKitToken) {
      router.replace("/")
      return
    }
  }, [liveKitToken, router])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/meetings/room/" + roomId)
    }, 3500 + Math.random() * 1500)

    return () => clearTimeout(timer)
  }, [roomId, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />

        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
          {lang === "ar" ? "جاري مراجعة طلبك من الإدارة" : "Your request is being reviewed"}
        </h1>

        <p className="text-lg text-[#666666] dark:text-[#999999] mb-2">
          {lang === "ar" ? "يرجى الانتظار" : "Please wait"}
          <span className="inline-block w-6 text-start">{dots}</span>
        </p>

        <p className="text-sm text-[#999999] dark:text-[#666666]">
          {lang === "ar"
            ? "سيتم نقلك إلى الاجتماع بمجرد الموافقة"
            : "You will be redirected to the meeting once approved"}
        </p>
      </div>
    </div>
  )
}
