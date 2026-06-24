"use client"

import { useState } from "react"
import { Calendar, Clock, User, Play } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { mockMeetings } from "@/lib/mock-data/meetings"

export default function HistoryPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all")

  const filtered = filter === "all" ? mockMeetings : mockMeetings.filter((m) => m.status === filter)

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
              {lang === "ar" ? "سجل الاجتماعات" : "Meeting History"}
            </h1>
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "جميع الاجتماعات السابقة" : "All past meetings"}
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-6">
          {(["all", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={"px-4 py-2 text-sm font-medium transition-colors " + (filter === f
                ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#333333]")}
            >
              {f === "all" ? (lang === "ar" ? "الكل" : "All") : f === "completed" ? (lang === "ar" ? "مكتملة" : "Completed") : (lang === "ar" ? "ملغاة" : "Cancelled")}
            </button>
          ))}
        </div>

        <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          {filtered.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={"text-xs font-medium px-2 py-0.5 " + (meeting.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-[#DC2626]/10 text-[#DC2626]")}>
                      {meeting.status === "completed" ? (lang === "ar" ? "مكتمل" : "Completed") : (lang === "ar" ? "ملغي" : "Cancelled")}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
                    {meeting.title[lang]}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666] dark:text-[#999999]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {meeting.date}
                    </span>
                    {meeting.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {meeting.duration} {lang === "ar" ? "دقيقة" : "min"}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {meeting.attendees} {lang === "ar" ? "مشارك" : "participants"}
                    </span>
                    <span className="text-[#999999]">
                      {meeting.organizer}
                    </span>
                  </div>
                </div>
                {meeting.recording && (
                  <button className="p-2 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
                    <Play size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
