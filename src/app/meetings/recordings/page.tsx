"use client"

import { Play, Download, Clock, Calendar } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { mockRecordings } from "@/lib/mock-data/meetings"

export default function RecordingsPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "التسجيلات" : "Recordings"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "جميع تسجيلات الاجتماعات السابقة" : "All past meeting recordings"}
          </p>
        </div>

        {mockRecordings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#999999] dark:text-[#666666]">
              {lang === "ar" ? "لا توجد تسجيلات متاحة" : "No recordings available"}
            </p>
          </div>
        ) : (
          <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {mockRecordings.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5 flex items-center gap-5 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="w-14 h-14 bg-[#E8E8E8] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center shrink-0">
                  <Play size={20} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate mb-1">
                    {rec.title[lang]}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[#666666] dark:text-[#999999]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {rec.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {rec.duration}
                    </span>
                    <span>{rec.size}</span>
                  </div>
                </div>

                <button
                  className="p-3 bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC] transition-colors"
                  title={lang === "ar" ? "تحميل" : "Download"}
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
