"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Users, Video, MapPin, Plus, Play, List } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useRoomStore } from "@/stores/room-store"
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

const eventColors: Record<string, { bg: string; dot: string; label: string }> = {
  workshop: { bg: "bg-violet-50 dark:bg-violet-900/20", dot: "bg-violet-500", label: "text-violet-600 dark:text-violet-400" },
  qa: { bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500", label: "text-emerald-600 dark:text-emerald-400" },
  lecture: { bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500", label: "text-amber-600 dark:text-amber-400" },
}

export default function MeetingsPage() {
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [showTour, setShowTour] = useState(false)

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const today = new Date()

  const monthEvents: Record<number, { title: string; time: string; type: string }[]> = useMemo(() => {
    const events: Record<number, { title: string; time: string; type: string }[]> = {}
    const evts = [
      { day: 5, title: lang === "ar" ? "ورشة التجارة" : "E-commerce Workshop", time: "20:00", type: "workshop" },
      { day: 10, title: lang === "ar" ? "جلسة أسئلة" : "Q&A Session", time: "21:00", type: "qa" },
      { day: 15, title: lang === "ar" ? "محاضرة AI" : "AI Lecture", time: "20:30", type: "lecture" },
      { day: 22, title: lang === "ar" ? "اجتماع الفريق" : "Team Meeting", time: "19:00", type: "workshop" },
    ]
    evts.forEach((e) => {
      if (!events[e.day]) events[e.day] = []
      events[e.day].push({ title: e.title, time: e.time, type: e.type })
    })
    return events
  }, [lang])

  const handleJoinMeeting = (roomCode: string) => router.push("/meetings/join/" + roomCode)

  const recentMeetings = mockMeetings.filter((m) => m.status === "completed").slice(0, 4)

  return (
    <div className="flex-1 p-3 md:p-6 bg-[#F2F2F2] dark:bg-[#0D0D0D] overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-0.5">
              {lang === "ar" ? "الاجتماعات و الأحداث" : "Meetings & Events"}
            </h1>
            <p className="text-xs md:text-sm text-[#666666] dark:text-[#B3B3B3]">
              {lang === "ar" ? "تصفح الأحداث القادمة و التقويم الشهري" : "Browse upcoming events and monthly calendar"}
            </p>
          </div>
          <button
            onClick={() => router.push("/meetings/admin/create")}
            className="flex items-center gap-1.5 h-9 md:h-10 px-3 md:px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{lang === "ar" ? "اجتماع جديد" : "New Meeting"}</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => router.push("/meetings/admin/create")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            <Video size={14} />
            {lang === "ar" ? "إنشاء اجتماع" : "Create Meeting"}
          </button>
          <button
            onClick={() => handleJoinMeeting("demo-001")}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] text-xs font-bold hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors shrink-0"
          >
            <Play size={14} />
            {lang === "ar" ? "انضمام سريع" : "Quick Join"}
          </button>
          <button
            onClick={() => router.push("/meetings/admin/history")}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] text-xs font-bold hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors shrink-0"
          >
            <List size={14} />
            {lang === "ar" ? "السجل" : "History"}
          </button>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-5 bg-violet-500" />
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "الأحداث القادمة" : "Upcoming Events"}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {upcomingEvents.map((ev) => {
              const colors = eventColors[ev.type] || eventColors.workshop
              return (
                <button
                  key={ev.id}
                  onClick={() => handleJoinMeeting("EVENT-" + ev.id.toUpperCase())}
                  className={"text-start border border-[#D4D4D4] dark:border-[#333333] p-4 md:p-5 hover:shadow-md transition-all " + colors.bg}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={"w-9 h-9 md:w-10 md:h-10 flex items-center justify-center " + colors.bg.replace("50", "100").replace("/20", "/10")}>
                      <Video size={16} className={colors.label} />
                    </div>
                    <span className={"text-[9px] md:text-[10px] font-bold px-2 py-0.5 " + colors.bg.replace("/20", "/30") + " " + colors.label}>{ev.type}</span>
                  </div>
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2 line-clamp-2">{ev.title[lang]}</p>
                  <div className="space-y-1 text-xs text-[#666666] dark:text-[#B3B3B3]">
                    <p className="flex items-center gap-1.5"><CalendarDays size={12} className="shrink-0" /> {ev.date}</p>
                    <p className="flex items-center gap-1.5"><Clock size={12} className="shrink-0" /> {ev.time}</p>
                    <p className="flex items-center gap-1.5"><Users size={12} className="shrink-0" /> {ev.attendees} {lang === "ar" ? "مشارك" : "attendees"}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-emerald-500" />
              <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "التقويم الشهري" : "Monthly Calendar"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (calMonth > 0) setCalMonth((m) => m - 1); else { setCalMonth(11); setCalYear((y) => y - 1) } }}
                className="w-7 h-7 flex items-center justify-center border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
              <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] min-w-[120px] text-center">{monthNames[calMonth]} {calYear}</span>
              <button
                onClick={() => { if (calMonth < 11) setCalMonth((m) => m + 1); else { setCalMonth(0); setCalYear((y) => y + 1) } }}
                className="w-7 h-7 flex items-center justify-center border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {weekdays.map((d) => (
              <div key={d} className="bg-[#E8E8E8] dark:bg-[#1A1A1A] py-2 text-center">
                <span className="text-[10px] font-bold text-[#999999]">{lang === "ar" ? { Sun: "ح", Mon: "ن", Tue: "ث", Wed: "ر", Thu: "خ", Fri: "ج", Sat: "س" }[d] || d : d}</span>
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={"e" + i} className="bg-white dark:bg-[#0D0D0D] min-h-[60px] md:min-h-[80px]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate()
              const dayEvents = monthEvents[day] || []
              return (
                <div key={day} className={"bg-white dark:bg-[#0D0D0D] p-1 md:p-1.5 min-h-[60px] md:min-h-[80px] " + (isToday ? "ring-2 ring-inset ring-[#0D0D0D] dark:ring-[#F2F2F2]" : "")}>
                  <span className={"text-[11px] md:text-xs font-bold " + (isToday ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] dark:text-[#999999]")}>{day}</span>
                  <div className="mt-0.5 md:mt-1 space-y-0.5">
                    {dayEvents.map((ev, ei) => {
                      const col = eventColors[ev.type] || eventColors.workshop
                      const hour = Number(ev.time.split(":")[0])
                      const displayHour = hour === 20 ? "٨" : hour === 21 ? "٩" : "٧"
                      return (
                        <button
                          key={ei}
                          onClick={() => handleJoinMeeting("EVENT-D" + day)}
                          className={"w-full text-[8px] md:text-[9px] text-start px-1 py-0.5 truncate " + col.dot.replace("bg-", "text-").replace("-500", "-600 dark:text-opacity-80") + " " + col.bg.replace("/20", "/10") + " hover:opacity-80 transition-opacity flex items-center gap-0.5"}
                        >
                          <span className={"inline-block w-1 h-1 rounded-full shrink-0 " + col.dot} />
                          <span>{displayHour + ev.time.slice(2)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Meetings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-amber-500" />
              <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "آخر الاجتماعات" : "Recent Meetings"}
              </h2>
            </div>
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
                <div key={mtg.id} className="bg-white dark:bg-[#0D0D0D] p-3 md:p-4 flex items-center gap-3 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center shrink-0">
                    <Video size={16} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{mtg.title[lang]}</p>
                    <div className="flex items-center gap-3 text-xs text-[#666666] dark:text-[#B3B3B3] mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1"><CalendarDays size={11} />{mtg.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{mtg.duration} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinMeeting(mtg.id)}
                    className="text-xs font-bold text-white px-3 py-1.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-90 transition-opacity shrink-0"
                  >
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
        <GuidedTour
          steps={meetingsTourSteps}
          onComplete={() => { sessionStorage.setItem("tour-meetings", "1"); setShowTour(false) }}
          onSkip={() => { sessionStorage.setItem("tour-meetings", "1"); setShowTour(false) }}
        />
      )}
    </div>
  )
}
