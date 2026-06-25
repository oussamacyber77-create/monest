"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { Users, TrendingUp, ShoppingBag, BarChart3, Globe, MessageCircle } from "lucide-react"

const stats = [
  { icon: TrendingUp, label: { ar: "متوسط التحويل", en: "Avg. Conversion" }, value: "3.8%", change: "+0.6%", color: "text-green-500" },
  { icon: ShoppingBag, label: { ar: "متوسط قيمة الطلب", en: "Avg. Order Value" }, value: "347 ر.س", change: "+12%", color: "text-green-500" },
  { icon: BarChart3, label: { ar: "أكثر القطاعات نمواً", en: "Fastest Growing Sector" }, value: "الإلكترونيات", change: "+28%", color: "text-blue-500" },
  { icon: Globe, label: { ar: "اتجاهات السوق", en: "Market Trends" }, value: "الموسمية", change: "قادمة", color: "text-violet-500" },
]

export default function CommunityPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "الكومينتي" : "Community"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إحصائيات ورؤى مجمعة من جميع المتاجر" : "Aggregated insights from all stores"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label.en} className="p-5 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <s.icon size={24} className={s.color + " mb-3"} />
            <p className="text-xs text-[#999999] mb-1">{s.label[lang]}</p>
            <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: s.change.startsWith("+") ? "#16A34A" : "#DC2626" }}>{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "أفضل أوقات البيع" : "Best Selling Times"}
          </h2>
          <div className="space-y-3">
            {[
              { time: lang === "ar" ? "6 مساءً - 10 مساءً" : "6 PM - 10 PM", pct: 42 },
              { time: lang === "ar" ? "12 مساءً - 4 مساءً" : "12 PM - 4 PM", pct: 28 },
              { time: lang === "ar" ? "8 صباحاً - 12 مساءً" : "8 AM - 12 PM", pct: 18 },
            ].map((t) => (
              <div key={t.time} className="flex items-center gap-3">
                <span className="text-xs text-[#666666] dark:text-[#999999] w-28">{t.time}</span>
                <div className="flex-1 h-2 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
                  <div className="h-full bg-[#0D0D0D] dark:bg-[#F2F2F2]" style={{ width: t.pct + "%" }} />
                </div>
                <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "المناقشات" : "Discussions"}
          </h2>
          <div className="flex items-center justify-center h-32 text-sm text-[#999999]">
            <MessageCircle size={32} className="mb-2 opacity-30" />
            <p>{lang === "ar" ? "لا توجد مناقشات حالية" : "No ongoing discussions"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
