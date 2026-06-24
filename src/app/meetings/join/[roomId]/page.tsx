"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
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

  const [name, setName] = useState(identity ? "User " + identity.slice(-4) : "")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const meetingInfo = mockMeetingInfoMap[roomId]

  const handleJoin = async () => {
    if (!phone) {
      setError(lang === "ar" ? "أدخل رقم الهاتف" : "Enter your phone number")
      return
    }
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 4) {
      setError(lang === "ar" ? "أدخل 4 أرقام على الأقل" : "Enter at least 4 digits")
      return
    }
    setError("")
    setLoading(true)
    try {
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
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "الانضمام إلى الاجتماع" : "Join Meeting"}
          </h1>
          {meetingInfo && (
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {meetingInfo.title[lang]} • {meetingInfo.organizer}
            </p>
          )}
        </div>

        <PreJoinCameraTest onReady={setStream} />

        <Input
          label={lang === "ar" ? "الاسم (اختياري)" : "Name (optional)"}
          placeholder={lang === "ar" ? "اسمك للعرض" : "Your display name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {!phone && (
          <Input
            label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
            placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
          />
        )}

        {error && <p className="text-sm text-[#DC2626]">{error}</p>}

        <Button onClick={handleJoin} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
          ) : (
            <>
              <LogIn size={18} />
              {lang === "ar" ? "انضمام" : "Join"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
