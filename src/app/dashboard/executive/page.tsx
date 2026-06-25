"use client"

import { useState, useMemo } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { dashboardStats, executiveSummaries } from "@/lib/mock-data/dashboard"

const periods = ["daily", "weekly", "monthly", "yearly"] as const

export default function ExecutivePage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")

  const mode = useMemo(() => {
    const v = dashboardStats[4].value
    if (v >= 4) return "high"
    if (v >= 2.5) return "low"
    return "low"
  }, [])

  const summaries = executiveSummaries[mode] || executiveSummaries["general"]
  const summary = summaries[period]

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "التقارير التنفيذية" : "Executive Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "تحليلات ذكية مولّدة بالذكاء الاصطناعي" : "AI-generated intelligent analytics"}
        </p>
      </div>

      <div className="flex gap-1 border-b border-[#D4D4D4] dark:border-[#333333]">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={"px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors " + (period === p
              ? "border-[#0D0D0D] dark:border-[#F2F2F2] text-[#0D0D0D] dark:text-[#F2F2F2]"
              : "border-transparent text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
          >
            {p === "daily" ? (lang === "ar" ? "يومي" : "Daily") : p === "weekly" ? (lang === "ar" ? "أسبوعي" : "Weekly") : p === "monthly" ? (lang === "ar" ? "شهري" : "Monthly") : (lang === "ar" ? "سنوي" : "Yearly")}
          </button>
        ))}
      </div>

      <div className="p-6 border border-[#D4D4D4] dark:border-[#333333]">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-[#F2F2F2] dark:text-[#0D0D0D]">AI</span>
          </div>
          <p className="text-base leading-relaxed text-[#0D0D0D] dark:text-[#F2F2F2]">
            {summary[lang]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        {dashboardStats.slice(0, 4).map((s, i) => (
          <div key={i} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
            <p className="text-xs text-[#666666] dark:text-[#999999] mb-1">{s.label[lang]}</p>
            <p className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {s.value.toLocaleString("en-US")}{s.suffix || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
