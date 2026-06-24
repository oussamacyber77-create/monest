"use client"

import { useState } from "react"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { useRoomStore } from "@/stores/room-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useRouter } from "next/navigation"

interface JoinModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [phone, setPhone] = useState("")
  const [meetingCode, setMeetingCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { setPhone: storePhone, setRoom } = useRoomStore()
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"

  const handleJoin = async () => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 4) {
      setError(lang === "ar" ? "أدخل 4 أرقام على الأقل" : "Enter at least 4 digits")
      return
    }
    if (!meetingCode.trim()) {
      setError(lang === "ar" ? "أدخل رمز الاجتماع" : "Enter a meeting ID")
      return
    }
    setError("")
    setLoading(true)
    try {
      storePhone(phone)
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: meetingCode.trim(),
          identity: digits,
          name: "User " + digits.slice(-4),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(meetingCode.trim(), data.token)
      onClose()
      router.push("/meetings/join/" + meetingCode.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === "ar" ? "فشل الانضمام" : "Failed to join")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === "ar" ? "انضمام إلى اجتماع" : "Join Meeting"}>
      <div className="space-y-4">
        <Input
          label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
          placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
        />
        <Input
          label={lang === "ar" ? "رمز الاجتماع" : "Meeting ID"}
          placeholder={lang === "ar" ? "أدخل رمز الاجتماع" : "Enter meeting code"}
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
        />
        {error && <p className="text-sm text-[#DC2626]">{error}</p>}
        <Button
          onClick={handleJoin}
          disabled={loading || !phone || !meetingCode}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
          ) : (
            <>
              <LogIn size={18} />
              {lang === "ar" ? "انضمام" : "Join Meeting"}
            </>
          )}
        </Button>
      </div>
    </Modal>
  )
}
