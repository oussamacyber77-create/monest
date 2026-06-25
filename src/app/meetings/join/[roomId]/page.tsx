"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { LogIn, CalendarDays, Clock, User, Phone, Shield, Monitor, Video, Users, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PreJoinCameraTest } from "@/components/meeting/pre-join-camera-test"
import { useRoomStore } from "@/stores/room-store"
import { useSettingsStore } from "@/stores/settings-store"
import { mockMeetingInfoMap } from "@/lib/mock-data/meetings"

export default function JoinPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { phone, identity, setPhone, setRoom } = useRoomStore()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const [localPhone, setLocalPhone] = useState(phone || "")
  const [name, setName] = useState(identity ? "User " + identity.slice(-4) : "")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const meetingInfo = mockMeetingInfoMap[roomId]

  const handleJoin = async () => {
    const finalPhone = localPhone || phone
    if (!finalPhone) {
      setError(lang === "ar" ? "أدخل رقم الهاتف" : "Enter your phone number")
      return
    }
    const digits = finalPhone.replace(/\D/g, "")
    if (digits.length < 4) {
      setError(lang === "ar" ? "أدخل 4 أرقام على الأقل" : "Enter at least 4 digits")
      return
    }
    setError("")
    setLoading(true)
    try {
      setPhone(finalPhone)
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: roomId,
          identity: digits,
          name: name || "User " + digits.slice(-4),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(roomId, data.token)
      router.push("/meetings/waiting/" + roomId)
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === "ar" ? "فشل الانضمام" : "Failed to join")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center mx-auto mb-4">
            <Video size={28} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "الانضمام إلى الاجتماع" : "Join Meeting"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "أدخل معلوماتك للانضمام إلى غرفة الاجتماع" : "Enter your details to join the meeting room"}
          </p>
        </div>

        {/* Meeting Details Card */}
        {meetingInfo && (
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5 space-y-3">
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{meetingInfo.title[lang]}</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-[#666666] dark:text-[#999999]">
              <span className="flex items-center gap-1.5"><User size={13} /> {meetingInfo.organizer}</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {meetingInfo.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} /> {meetingInfo.duration} min</span>
              <span className="flex items-center gap-1.5"><Users size={13} /> {meetingInfo.attendees} {lang === "ar" ? "مشارك" : "attendees"}</span>
            </div>
            {meetingInfo.description && (
              <p className="text-xs text-[#666666] dark:text-[#999999] pt-2 border-t border-[#D4D4D4] dark:border-[#333333]">
                {meetingInfo.description[lang]}
              </p>
            )}
          </div>
        )}

        {/* Meeting ID */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-xs text-[#666666] dark:text-[#999999]">
          <span className="flex items-center gap-1.5"><Shield size={13} /> {lang === "ar" ? "رمز الاجتماع" : "Meeting ID"}</span>
          <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2] font-mono tracking-wider">{roomId}</span>
        </div>

        {/* Camera Test */}
        <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
          <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5">
            <Monitor size={14} /> {lang === "ar" ? "اختبار الكاميرا والمايك" : "Camera & Mic Test"}
          </p>
          <PreJoinCameraTest onReady={setStream} />
        </div>

        {/* Name Input */}
        <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-1.5 mb-1.5">
              <User size={13} /> {lang === "ar" ? "الاسم (اختياري)" : "Name (optional)"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "ar" ? "اسمك للعرض" : "Your display name"}
              className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-1.5 mb-1.5">
              <Phone size={13} /> {lang === "ar" ? "رقم الهاتف *" : "Phone Number *"}
            </label>
            <input
              value={localPhone}
              onChange={(e) => setLocalPhone(e.target.value)}
              placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
              type="tel"
              className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors"
            />
          </div>

          {error && <p className="text-xs text-[#DC2626]">{error}</p>}
        </div>

        {/* Join Button */}
        <Button onClick={handleJoin} disabled={loading} className="w-full h-13" size="lg">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
          ) : (
            <>
              <LogIn size={18} />
              {lang === "ar" ? "انضمام إلى الاجتماع" : "Join Meeting"}
            </>
          )}
        </Button>

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#999999] dark:text-[#666666] flex items-center justify-center gap-1">
          <Headphones size={12} />
          {lang === "ar"
            ? "تأكد من أن المايك والكاميرا يعملان قبل الانضمام"
            : "Make sure your mic and camera work before joining"}
        </p>
      </div>
    </div>
  )
}
