"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, LogIn, Calendar, Clock, Monitor, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettingsStore } from "@/stores/settings-store"
import { useRoomStore } from "@/stores/room-store"
import { generateRoomCode } from "@/lib/utils"
import { mockMeetings } from "@/lib/mock-data/meetings"
import { GuidedTour } from "@/components/tour/guided-tour"
import { HelpButton } from "@/components/tour/help-button"
import { meetingsTourSteps } from "@/components/tour/tour-steps"

export default function MeetingsPage() {
  const { direction } = useSettingsStore()
  const { setPhone, setRoom, setAdmin } = useRoomStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"

  const [joinCode, setJoinCode] = useState("")
  const [joinPhone, setJoinPhone] = useState("")
  const [joinError, setJoinError] = useState("")
  const [joinLoading, setJoinLoading] = useState(false)
  const [showJoinInput, setShowJoinInput] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("tour-meetings")) setShowTour(true)
  }, [])

  const handleCreate = async () => {
    const digits = joinPhone.replace(/\D/g, "")
    if (digits.length < 4) { setJoinError(lang === "ar" ? "أدخل 4 أرقام على الأقل" : "Enter at least 4 digits"); return }
    setJoinError("")
    setJoinLoading(true)
    try {
      const roomCode = generateRoomCode()
      setPhone(joinPhone)
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: roomCode, identity: digits, name: "User " + digits.slice(-4) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(roomCode, data.token)
      setAdmin(true)
      router.push("/meetings/join/" + roomCode)
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : lang === "ar" ? "فشل إنشاء الاجتماع" : "Failed to create meeting")
    } finally {
      setJoinLoading(false)
    }
  }

  const handleJoinByCode = async () => {
    const trimmedCode = joinCode.trim()
    if (trimmedCode.length !== 8) { setJoinError(lang === "ar" ? "رمز الاجتماع يجب أن يكون 8 أحرف" : "Meeting code must be 8 characters"); return }
    const digits = joinPhone.replace(/\D/g, "")
    if (digits.length < 4) { setJoinError(lang === "ar" ? "أدخل رقم الهاتف (4 أرقام على الأقل)" : "Enter your phone number (at least 4 digits)"); return }
    setJoinError("")
    setJoinLoading(true)
    try {
      setPhone(joinPhone)
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: joinCode.trim(), identity: digits, name: "User " + digits.slice(-4) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(joinCode.trim(), data.token)
      router.push("/meetings/join/" + joinCode.trim())
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : lang === "ar" ? "فشل الانضمام" : "Failed to join")
    } finally {
      setJoinLoading(false)
    }
  }

  const recentMeetings = mockMeetings.filter((m) => m.status === "completed").slice(0, 4)

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "الاجتماعات" : "Meetings"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "أنشئ اجتماعاً فورياً أو انضم لاجتماع موجود" : "Create an instant meeting or join an existing one"}
          </p>
        </div>

        <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333] md:grid-cols-2">
          <div id="tour-meetings-create" className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6 md:p-8">
            <div className="w-12 h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center mb-4">
              <Plus size={24} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
            </div>
            <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
              {lang === "ar" ? "اجتماع فوري" : "Instant Meeting"}
            </h2>
            <p className="text-sm text-[#666666] dark:text-[#999999] mb-5">
              {lang === "ar" ? "أنشئ غرفة فوراً وشارك الرابط مع الآخرين" : "Create a room instantly and share the link"}
            </p>
            <Input
              label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
              placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
              value={joinPhone}
              onChange={(e) => { setJoinPhone(e.target.value); if (joinError) setJoinError("") }}
              type="tel"
            />
            <Button onClick={handleCreate} disabled={joinLoading || !joinPhone} className="w-full mt-4" size="lg">
              {joinLoading ? (
                <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
              ) : (
                <>{lang === "ar" ? "إنشاء اجتماع" : "Create Meeting"}</>
              )}
            </Button>
          </div>

          <div id="tour-meetings-join" className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6 md:p-8">
            <div className="w-12 h-12 border border-[#0D0D0D] dark:border-[#F2F2F2] flex items-center justify-center mb-4">
              <LogIn size={24} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
            </div>
            <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
              {lang === "ar" ? "الانضمام برابط" : "Join by Link"}
            </h2>
            <p className="text-sm text-[#666666] dark:text-[#999999] mb-5">
              {lang === "ar" ? "أدخل رمز الاجتماع المكون من 8 أحرف" : "Enter the 8-character meeting code"}
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                  placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
                  value={joinPhone}
                  onChange={(e) => { setJoinPhone(e.target.value); if (joinError) setJoinError("") }}
                  type="tel"
                />
              </div>
              <div className="flex-1">
                <Input
                  label={lang === "ar" ? "رمز الاجتماع" : "Meeting Code"}
                  placeholder={lang === "ar" ? "أدخل الرمز" : "Enter code"}
                  value={joinCode}
                  onChange={(e) => { setJoinCode(e.target.value); if (joinError) setJoinError("") }}
                />
              </div>
            </div>
            {joinError && <p className="text-sm text-[#DC2626] mt-2">{joinError}</p>}
            <Button
              onClick={handleJoinByCode}
              disabled={joinLoading || joinCode.trim().length !== 8}
              className="w-full mt-4"
              size="lg"
            >
              {joinLoading ? (
                <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
              ) : (
                <>{lang === "ar" ? "انضمام" : "Join"}</>
              )}
            </Button>
          </div>
        </div>

        <div id="tour-meetings-recent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "آخر الاجتماعات" : "Recent Meetings"}
            </h2>
            <a href="/meetings/admin/history" className="text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
              {lang === "ar" ? "عرض الكل" : "View all"}
            </a>
          </div>
          <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {recentMeetings.length === 0 ? (
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 text-center text-sm text-[#999999] dark:text-[#666666]">
                {lang === "ar" ? "لا توجد اجتماعات سابقة" : "No recent meetings"}
              </div>
            ) : (
              recentMeetings.map((mtg) => (
                <div key={mtg.id} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 flex items-center gap-4 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="w-10 h-10 bg-[#E8E8E8] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center shrink-0">
                    <Monitor size={18} className="text-[#666666] dark:text-[#999999]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{mtg.title[lang]}</p>
                    <div className="flex items-center gap-3 text-xs text-[#666666] dark:text-[#999999] mt-0.5">
                      <span className="flex items-center gap-1"><Calendar size={11} />{mtg.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{mtg.duration} min</span>
                      <span className="flex items-center gap-1"><Headphones size={11} />{mtg.organizer}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <HelpButton onClick={() => setShowTour(true)} />
      {showTour && (
        <GuidedTour
          steps={meetingsTourSteps}
          onComplete={() => { sessionStorage.setItem("tour-meetings", "1"); setShowTour(false) }}
          onSkip={() => { sessionStorage.setItem("tour-meetings", "1"); setShowTour(false) }}
        />
      )}
    </div>
  )
}
