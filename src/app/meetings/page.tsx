"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Users, Video, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettingsStore } from "@/stores/settings-store"
import { useRoomStore } from "@/stores/room-store"
import { generateRoomCode } from "@/lib/utils"
import { mockMeetings } from "@/lib/mock-data/meetings"
import { GuidedTour } from "@/components/tour/guided-tour"
import { HelpButton } from "@/components/tour/help-button"
import { meetingsTourSteps } from "@/components/tour/tour-steps"

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const upcomingEvents = [
  { id: "e1", title: { ar: "ورشة: أساسيات التجارة الإلكترونية", en: "Workshop: E-commerce Basics" }, date: "2026-07-05", time: "20:00", host: "Monest Team", attendees: 34, type: "workshop" },
  { id: "e2", title: { ar: "لقاء مفتوح: أسئلة وأجوبة", en: "Open Meeting: Q&A Session" }, date: "2026-07-10", time: "21:00", host: "Monest Team", attendees: 18, type: "qa" },
  { id: "e3", title: { ar: "محاضرة: تحسين المبيعات بالذكاء الاصطناعي", en: "Lecture: Boost Sales with AI" }, date: "2026-07-15", time: "20:30", host: "AI Expert", attendees: 52, type: "lecture" },
]

export default function MeetingsPage() {
  const { direction } = useSettingsStore()
  const { setPhone, setRoom, setAdmin } = useRoomStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [showTour, setShowTour] = useState(false)

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const today = new Date()

  // Generate mock calendar events
  const monthEvents: Record<number, { title: string; time: string }[]> = useMemo(() => {
    const events: Record<number, { title: string; time: string }[]> = {}
    const evts = [
      { day: 5, title: lang === "ar" ? "ورشة التجارة" : "E-commerce Workshop", time: "20:00" },
      { day: 10, title: lang === "ar" ? "جلسة أسئلة" : "Q&A Session", time: "21:00" },
      { day: 15, title: lang === "ar" ? "محاضرة AI" : "AI Lecture", time: "20:30" },
      { day: 22, title: lang === "ar" ? "اجتماع الفريق" : "Team Meeting", time: "19:00" },
    ]
    evts.forEach((e) => {
      if (!events[e.day]) events[e.day] = []
      events[e.day].push({ title: e.title, time: e.time })
    })
    return events
  }, [lang])

<<<<<<< HEAD
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
=======
  const handleJoinMeeting = (roomCode: string) => {
    router.push("/meetings/join/" + roomCode)
>>>>>>> 2f176ad86f91d847d681aead14606dbc03c4707f
  }

  const recentMeetings = mockMeetings.filter((m) => m.status === "completed").slice(0, 4)

  return (
    <div className="flex-1 p-4 md:p-6 bg-[#F2F2F2] dark:bg-[#0D0D0D] overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "الاجتماعات و الأحداث" : "Meetings & Events"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "تصفح الأحداث القادمة و التقويم الشهري" : "Browse upcoming events and monthly calendar"}
          </p>
        </div>

<<<<<<< HEAD
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
=======
        {/* Upcoming Events */}
        <div>
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
            {lang === "ar" ? "الأحداث القادمة" : "Upcoming Events"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingEvents.map((ev) => (
              <button key={ev.id} onClick={() => handleJoinMeeting("EVENT-" + ev.id.toUpperCase())} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors text-start">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center">
                    <Video size={18} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#666666] dark:text-[#999999] uppercase">{ev.type}</span>
                </div>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">{ev.title[lang]}</p>
                <div className="space-y-1 text-xs text-[#666666] dark:text-[#999999]">
                  <p className="flex items-center gap-1"><CalendarDays size={12} /> {ev.date}</p>
                  <p className="flex items-center gap-1"><Clock size={12} /> {ev.time}</p>
                  <p className="flex items-center gap-1"><Users size={12} /> {ev.attendees} {lang === "ar" ? "مشارك" : "attendees"}</p>
                </div>
              </button>
            ))}
>>>>>>> 2f176ad86f91d847d681aead14606dbc03c4707f
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "التقويم الشهري" : "Monthly Calendar"}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => { if (calMonth > 0) setCalMonth((m) => m - 1); else { setCalMonth(11); setCalYear((y) => y - 1) } }} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"><ChevronRight size={18} /></button>
              <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{monthNames[calMonth]} {calYear}</span>
              <button onClick={() => { if (calMonth < 11) setCalMonth((m) => m + 1); else { setCalMonth(0); setCalYear((y) => y + 1) } }} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"><ChevronLeft size={18} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {weekdays.map((d) => (
              <div key={d} className="bg-[#E8E8E8] dark:bg-[#1A1A1A] py-2 text-center">
                <span className="text-[10px] font-bold text-[#999999]">{lang === "ar" ? { Sun: "ح", Mon: "ن", Tue: "ث", Wed: "ر", Thu: "خ", Fri: "ج", Sat: "س" }[d] || d : d}</span>
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={"e" + i} className="bg-white dark:bg-[#0D0D0D] min-h-[80px]" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate()
              const dayEvents = monthEvents[day] || []
              return (
                <div key={day} className={"bg-white dark:bg-[#0D0D0D] p-1.5 min-h-[80px] " + (isToday ? "ring-2 ring-inset ring-[#0D0D0D] dark:ring-[#F2F2F2]" : "")}>
                  <span className={"text-xs font-bold " + (isToday ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] dark:text-[#999999]")}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.map((ev, ei) => (
                      <button key={ei} onClick={() => handleJoinMeeting("EVENT-D" + day)} className="w-full text-[9px] text-start px-1 py-0.5 bg-[#0D0D0D]/10 dark:bg-[#F2F2F2]/10 text-[#0D0D0D] dark:text-[#F2F2F2] truncate hover:bg-[#0D0D0D]/20 dark:hover:bg-[#F2F2F2]/20 transition-colors">
                        {ev.time} {ev.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Meetings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "آخر الاجتماعات" : "Recent Meetings"}
            </h2>
            <a href="/meetings/admin/history" className="text-xs text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
              {lang === "ar" ? "عرض الكل" : "View all"}
            </a>
          </div>
          <div className="grid gap-px bg-[#D4D4D4] dark:border-[#333333]">
            {recentMeetings.length === 0 ? (
              <div className="bg-white dark:bg-[#0D0D0D] p-8 text-center text-sm text-[#999999]">
                {lang === "ar" ? "لا توجد اجتماعات سابقة" : "No recent meetings"}
              </div>
            ) : (
              recentMeetings.map((mtg) => (
                <div key={mtg.id} className="bg-white dark:bg-[#0D0D0D] p-4 flex items-center gap-4 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="w-10 h-10 bg-[#E8E8E8] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center shrink-0">
                    <Video size={18} className="text-[#666666] dark:text-[#999999]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{mtg.title[lang]}</p>
                    <div className="flex items-center gap-3 text-xs text-[#666666] dark:text-[#999999] mt-0.5">
                      <span className="flex items-center gap-1"><CalendarDays size={11} />{mtg.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{mtg.duration} min</span>
                    </div>
                  </div>
                  <button onClick={() => handleJoinMeeting(mtg.id)} className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] border border-[#D4D4D4] dark:border-[#333333] px-3 py-1.5 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                    {lang === "ar" ? "انضمام" : "Join"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <HelpButton onClick={() => setShowTour(true)} />
      {showTour && (
        <GuidedTour steps={meetingsTourSteps} onComplete={() => { sessionStorage.setItem("tour-meetings", "1"); setShowTour(false) }} onSkip={() => { sessionStorage.setItem("tour-meetings", "1"); setShowTour(false) }} />
      )}
    </div>
  )
}
