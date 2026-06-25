"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Users, Video, Plus, ExternalLink } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
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
  { id: "e4", title: { ar: "اجتماع الفريق الشهري", en: "Monthly Team Meeting" }, date: "2026-07-22", time: "19:00", host: "Management", attendees: 12, type: "workshop" },
]

const eventColors: Record<string, { bg: string; dot: string; label: string; icon: string }> = {
  workshop: { bg: "bg-violet-50 dark:bg-violet-900/20", dot: "bg-violet-500", label: "text-violet-600 dark:text-violet-400", icon: "bg-violet-100 dark:bg-violet-900/30" },
  qa: { bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500", label: "text-emerald-600 dark:text-emerald-400", icon: "bg-emerald-100 dark:bg-emerald-900/30" },
  lecture: { bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500", label: "text-amber-600 dark:text-amber-400", icon: "bg-amber-100 dark:bg-amber-900/30" },
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

  const recentMeetings = mockMeetings.filter((m) => m.status === "completed").slice(0, 6)

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
            className="h-9 md:h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{lang === "ar" ? "اجتماع جديد" : "New Meeting"}</span>
          </button>
        </div>

        {/* Main two-column layout: Events (left) + Calendar (right) */}
        <div className="grid md:grid-cols-5 gap-4 md:gap-6">
          {/* Left: Upcoming Events */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-violet-500" />
                <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar" ? "الأحداث القادمة" : "Upcoming Events"}
                </h2>
              </div>
              <span className="text-[10px] text-[#999999]">{upcomingEvents.length} {lang === "ar" ? "حدث" : "events"}</span>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((ev, idx) => {
                const colors = eventColors[ev.type] || eventColors.workshop
                return (
                  <button
                    key={ev.id}
                    onClick={() => handleJoinMeeting("EVENT-" + ev.id.toUpperCase())}
                    className={"w-full text-start border border-[#D4D4D4] dark:border-[#333333] p-4 hover:shadow-md transition-all " + colors.bg}
                  >
                    {/* Date badge */}
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-12 text-center">
                        <div className="text-[18px] font-bold text-[#0D0D0D] dark:text-[#F2F2F2] leading-none">{ev.date.slice(8)}</div>
                        <div className="text-[9px] text-[#999999] mt-0.5">
                          {lang === "ar"
                            ? { "07": "يوليو" }[ev.date.slice(5, 7)] || "يوليو"
                            : monthNames[Number(ev.date.slice(5, 7)) - 1].slice(0, 3)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={"text-[9px] font-bold px-1.5 py-0.5 " + colors.bg.replace("/20", "/30") + " " + colors.label}>{ev.type}</span>
                          <span className="text-[9px] text-[#999999]">{ev.host}</span>
                        </div>
                        <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] line-clamp-2 leading-snug">{ev.title[lang]}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#666666] dark:text-[#B3B3B3]">
                          <span className="flex items-center gap-1"><Clock size={11} />{ev.time}</span>
                          <span className="flex items-center gap-1"><Users size={11} />{ev.attendees}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
              {/* Calendar Header */}
              <div className="p-4 md:p-5 border-b border-[#D4D4D4] dark:border-[#333333]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                    <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                      {lang === "ar" ? "التقويم الشهري" : "Monthly Calendar"}
                    </h2>
                  </div>
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-[10px] font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                  >
                    <ExternalLink size={12} />
                    {lang === "ar" ? "Google Calendar" : "Google Calendar"}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { if (calMonth > 0) setCalMonth((m) => m - 1); else { setCalMonth(11); setCalYear((y) => y - 1) } }}
                    className="w-7 h-7 flex items-center justify-center border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <span className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{monthNames[calMonth]} {calYear}</span>
                  <button
                    onClick={() => { if (calMonth < 11) setCalMonth((m) => m + 1); else { setCalMonth(0); setCalYear((y) => y + 1) } }}
                    className="w-7 h-7 flex items-center justify-center border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-7 gap-1">
                  {weekdays.map((d) => (
                    <div key={d} className="text-center py-1.5">
                      <span className="text-[10px] font-bold text-[#999999]">
                        {lang === "ar" ? { Sun: "ح", Mon: "ن", Tue: "ث", Wed: "ر", Thu: "خ", Fri: "ج", Sat: "س" }[d] || d : d}
                      </span>
                    </div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => <div key={"e" + i} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate()
                    const dayEvents = monthEvents[day] || []
                    const hasEvents = dayEvents.length > 0
                    return (
                      <button
                        key={day}
                        onClick={() => hasEvents && handleJoinMeeting("EVENT-D" + day)}
                        className={"relative flex flex-col items-center justify-start pt-1.5 pb-1 min-h-[44px] md:min-h-[56px] rounded-sm transition-colors " + (
                          isToday
                            ? "bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]"
                            : hasEvents
                              ? "bg-violet-50 dark:bg-violet-900/20 text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-violet-100 dark:hover:bg-violet-900/30"
                              : "hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]"
                        )}
                      >
                        <span className={"text-xs md:text-sm font-bold " + (isToday ? "text-[#F2F2F2] dark:text-[#0D0D0D]" : "")}>
                          {day}
                        </span>
                        {hasEvents && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvents.map((ev, ei) => {
                              const col = eventColors[ev.type] || eventColors.workshop
                              return <span key={ei} className={"w-1 h-1 rounded-full " + col.dot} />
                            })}
                          </div>
                        )}
                        {!hasEvents && !isToday && (
                          <span className="text-[8px] text-[#D4D4D4] dark:text-[#333333] mt-0.5">&bull;</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="px-4 pb-4 md:px-5 md:pb-5 flex items-center gap-4 text-[10px] text-[#666666] dark:text-[#B3B3B3] flex-wrap">
                {Object.entries(eventColors).map(([key, val]) => (
                  <span key={key} className="flex items-center gap-1">
                    <span className={"w-2 h-2 rounded-full " + val.dot} />
                    {key === "workshop" ? (lang === "ar" ? "ورشة" : "Workshop") : key === "qa" ? (lang === "ar" ? "أسئلة" : "Q&A") : (lang === "ar" ? "محاضرة" : "Lecture")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Meetings - Horizontal Scroll Strip */}
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

          {recentMeetings.length === 0 ? (
            <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-8 text-center text-sm text-[#999999]">
              {lang === "ar" ? "لا توجد اجتماعات سابقة" : "No recent meetings"}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
              {recentMeetings.map((mtg) => (
                <div
                  key={mtg.id}
                  className="flex-none w-[200px] md:w-[220px] bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-4 snap-start hover:shadow-md transition-all"
                >
                  <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center mb-3">
                    <Video size={16} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate mb-2">{mtg.title[lang]}</p>
                  <div className="flex items-center gap-2 text-[11px] text-[#666666] dark:text-[#B3B3B3] mb-3 flex-wrap">
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{mtg.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{mtg.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#999999] mb-3">
                    <Users size={11} />{mtg.attendees} {lang === "ar" ? "مشارك" : "attendees"}
                  </div>
                  <button
                    onClick={() => handleJoinMeeting(mtg.id)}
                    className="w-full h-8 text-xs font-bold bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-90 transition-opacity"
                  >
                    {lang === "ar" ? "انضمام" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          )}
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
