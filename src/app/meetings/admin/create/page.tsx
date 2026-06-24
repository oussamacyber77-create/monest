"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRoomStore } from "@/stores/room-store"
import { useSettingsStore } from "@/stores/settings-store"
import { generateRoomCode } from "@/lib/utils"

export default function CreateMeetingPage() {
  const router = useRouter()
  const { setPhone, setRoom, setAdmin } = useRoomStore()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const [mode, setMode] = useState<"instant" | "scheduled">("instant")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("30")
  const [phone, setPhoneValue] = useState("")
  const [allowGuest, setAllowGuest] = useState(true)
  const [requirePassword, setRequirePassword] = useState(false)
  const [waitingRoom, setWaitingRoom] = useState(true)
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCreate = async () => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 4) {
      setError(lang === "ar" ? "أدخل 4 أرقام على الأقل" : "Enter at least 4 digits")
      return
    }
    setError("")
    setLoading(true)
    try {
      const roomCode = generateRoomCode()
      setPhone(phone)
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: roomCode,
          identity: digits,
          name: title || "User " + digits.slice(-4),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(roomCode, data.token)
      setAdmin(true)

      if (mode === "instant") {
        router.push("/meetings/join/" + roomCode)
      } else {
        setGeneratedLink(window.location.origin + "/meetings/join/" + roomCode)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === "ar" ? "فشل إنشاء الاجتماع" : "Failed to create meeting")
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "إنشاء اجتماع جديد" : "Create New Meeting"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "اجتماع فوري أو مجدول" : "Instant or scheduled meeting"}
          </p>
        </div>

        <div className="flex border border-[#D4D4D4] dark:border-[#333333]">
          <button
            onClick={() => setMode("instant")}
            className={"flex-1 py-3 text-sm font-medium transition-colors " + (mode === "instant"
              ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
              : "bg-transparent text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
          >
            {lang === "ar" ? "فوري" : "Instant"}
          </button>
          <button
            onClick={() => setMode("scheduled")}
            className={"flex-1 py-3 text-sm font-medium transition-colors " + (mode === "scheduled"
              ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
              : "bg-transparent text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
          >
            {lang === "ar" ? "مجدول" : "Scheduled"}
          </button>
        </div>

        {mode === "scheduled" && (
          <>
            <Input
              label={lang === "ar" ? "عنوان الاجتماع" : "Meeting Title"}
              placeholder={lang === "ar" ? "مثال: مراجعة أداء الربع الثاني" : "e.g. Q2 Performance Review"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label={lang === "ar" ? "الوصف (اختياري)" : "Description (optional)"}
              placeholder={lang === "ar" ? "وصف الاجتماع..." : "Meeting description..."}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label={lang === "ar" ? "المدة (دقيقة)" : "Duration (minutes)"}
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </>
        )}

        <Input
          label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
          placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
          value={phone}
          onChange={(e) => { setPhoneValue(e.target.value); if (error) setError("") }}
          error={error}
          type="tel"
        />

        <div className="space-y-3">
          {[
            { key: "allowGuest", label: lang === "ar" ? "السماح للضيوف" : "Allow guests", value: allowGuest, set: setAllowGuest },
            { key: "requirePassword", label: lang === "ar" ? "كلمة مرور" : "Password required", value: requirePassword, set: setRequirePassword },
            { key: "waitingRoom", label: lang === "ar" ? "غرفة انتظار" : "Waiting room", value: waitingRoom, set: setWaitingRoom },
          ].map(({ key, label, value, set }) => (
            <label key={key} className="flex items-center justify-between py-3 border-b border-[#D4D4D4] dark:border-[#333333]">
              <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{label}</span>
              <button
                onClick={() => set(!value)}
                className={"w-10 h-6 relative transition-colors " + (value ? "bg-[#0D0D0D] dark:bg-[#F2F2F2]" : "bg-[#D4D4D4] dark:bg-[#333333]")}
              >
                <span className={"absolute top-0.5 w-5 h-5 bg-white transition-all " + (value ? "end-0.5" : "start-0.5")} />
              </button>
            </label>
          ))}
        </div>

        {generatedLink ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 h-12 px-4 bg-[#E8E8E8] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333] flex items-center text-sm text-[#0D0D0D] dark:text-[#F2F2F2] truncate">
                {generatedLink}
              </div>
              <button
                onClick={copyLink}
                className="p-3 bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 dark:text-green-400">
                {lang === "ar" ? "تم نسخ الرابط!" : "Link copied!"}
              </p>
            )}
            <Button onClick={() => router.push(generatedLink.replace(window.location.origin, ""))} className="w-full" size="lg">
              {lang === "ar" ? "دخول الاجتماع الآن" : "Join Meeting Now"}
            </Button>
          </div>
        ) : (
          <Button onClick={handleCreate} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
            ) : (
              <>
                <Plus size={18} />
                {lang === "ar" ? "إنشاء الاجتماع" : "Create Meeting"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
