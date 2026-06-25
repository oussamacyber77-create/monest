"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Clock, User, Shield, LogOut, Video, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRoomStore } from "@/stores/room-store"
import { useAuthStore } from "@/stores/auth-store"
import { useSettingsStore } from "@/stores/settings-store"
import { mockMeetingInfoMap } from "@/lib/mock-data/meetings"

export default function WaitingPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { liveKitToken, displayName, phone, clearRoom } = useRoomStore()
  const { isAdmin } = useAuthStore()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [dots, setDots] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const [showCancel, setShowCancel] = useState(false)

  const meetingInfo = mockMeetingInfoMap[roomId]

  useEffect(() => {
    if (!liveKitToken) {
      router.replace("/")
    }
  }, [liveKitToken, router])

  // Simulate host admission after 3-5 seconds
  useEffect(() => {
    const delay = 3000 + Math.random() * 2000
    const timer = setTimeout(() => {
      router.push("/meetings/room/" + roomId)
    }, delay)
    return () => clearTimeout(timer)
  }, [roomId, router])

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."))
    }, 500)
    const elapsedInterval = setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)
    return () => {
      clearInterval(dotInterval)
      clearInterval(elapsedInterval)
    }
  }, [])

  const handleCancel = () => {
    clearRoom()
    router.push("/meetings")
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-sm text-center space-y-6">

        {/* Spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Video size={24} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {lang === "ar" ? "بانتظار موافقة المضيف" : "Waiting for Host"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "سيتم نقلك إلى الاجتماع بمجرد الموافقة" : "You'll be redirected once the host admits you"}
            <span className="inline-block w-6 text-start">{dots}</span>
          </p>
        </div>

        {/* Meeting info */}
        {meetingInfo && (
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4 text-start space-y-2">
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{meetingInfo.title[lang]}</p>
            <div className="flex items-center gap-2 text-xs text-[#666666] dark:text-[#999999]">
              <User size={12} />
              {meetingInfo.organizer}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#666666] dark:text-[#999999]">
              <Shield size={12} />
              <span className="font-mono tracking-wider text-[#0D0D0D] dark:text-[#F2F2F2]">{roomId}</span>
            </div>
          </div>
        )}

        {/* You are joining as */}
        <div className="text-xs text-[#999999] dark:text-[#666666] space-y-1">
          <p>{lang === "ar" ? "تنضم كـ" : "Joining as"}</p>
          <p className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{displayName || "User"}</p>
        </div>

        {/* Elapsed time */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#999999]">
          <Clock size={12} />
          {elapsed < 60
            ? (lang === "ar" ? elapsed + " ثانية" : elapsed + "s")
            : Math.floor(elapsed / 60) + ":" + String(elapsed % 60).padStart(2, "0")}
        </div>

        {/* Cancel button */}
        {!showCancel ? (
          <button
            onClick={() => setShowCancel(true)}
            className="text-xs text-[#999999] hover:text-[#DC2626] transition-colors underline underline-offset-2"
          >
            {lang === "ar" ? "إلغاء الانضمام" : "Cancel joining"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCancel(false)}
            >
              {lang === "ar" ? "رجوع" : "Back"}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
            >
              <LogOut size={14} />
              {lang === "ar" ? "مغادرة" : "Leave"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
