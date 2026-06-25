"use client"

import { useSettingsStore } from "@/stores/settings-store"
import { profitBreakdown } from "@/lib/mock-data/dashboard"

export default function ProfitsPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const items = [
    { label: { ar: "الإيرادات", en: "Revenue" }, value: profitBreakdown.revenue, color: "text-[#0D0D0D] dark:text-[#F2F2F2]" },
    { label: { ar: "تكلفة البضائع", en: "Cost of Goods" }, value: profitBreakdown.costOfGoods, color: "text-[#DC2626]" },
    { label: { ar: "إجمالي الربح", en: "Gross Profit" }, value: profitBreakdown.grossProfit, color: "text-green-600" },
    { label: { ar: "المصاريف", en: "Expenses" }, value: profitBreakdown.expenses, color: "text-[#DC2626]" },
    { label: { ar: "الضرائب", en: "Taxes" }, value: profitBreakdown.taxes, color: "text-[#DC2626]" },
    { label: { ar: "الرسوم", en: "Fees" }, value: profitBreakdown.fees, color: "text-[#DC2626]" },
    { label: { ar: "صافي الأرباح", en: "Net Profit" }, value: profitBreakdown.netProfit, color: "text-green-600 font-bold" },
  ]

  const forecastMonths = [
    { month: "Jul", actual: 142375, forecast: null },
    { month: "Aug", actual: null, forecast: 148000 },
    { month: "Sep", actual: null, forecast: 155000 },
    { month: "Oct", actual: null, forecast: 160000 },
    { month: "Nov", actual: null, forecast: 172000 },
    { month: "Dec", actual: null, forecast: 190000 },
  ]

  const maxForecast = Math.max(...forecastMonths.map((m) => m.forecast || m.actual || 0), 1)

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "مركز الأرباح" : "Profit Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "تحليل الإيرادات والأرباح مع توقعات AI" : "Revenue & profit analysis with AI forecasts"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        {items.slice(0, 4).map((item, i) => (
          <div key={i} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
            <p className="text-xs text-[#666666] dark:text-[#999999] mb-1">{item.label[lang]}</p>
            <p className={"text-xl " + item.color}>{item.value.toLocaleString("en-US")} ر.س</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "تفصيل الأرباح" : "Profit Breakdown"}
          </h2>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#D4D4D4] dark:border-[#333333] last:border-0">
                <span className="text-sm text-[#666666] dark:text-[#999999]">{item.label[lang]}</span>
                <span className={"text-sm " + item.color}>{item.value.toLocaleString("en-US")} ر.س</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "توقعات الأرباح (AI)" : "Profit Forecast (AI)"}
          </h2>
          <svg viewBox="0 0 300 140" className="w-full h-auto" style={{ direction: "ltr" }}>
            {forecastMonths.map((m, i) => {
              const x = 25 + i * 45
              const h = ((m.actual || m.forecast || 0) / maxForecast) * 100
              const y = 125 - h
              const isForecast = m.actual === null
              return (
                <g key={i}>
                  <rect x={x} y={y} width="20" height={h} fill="currentColor" className={isForecast ? "text-[#999999] dark:text-[#666666]" : "text-[#0D0D0D] dark:text-[#F2F2F2]"} opacity={isForecast ? 0.4 : 0.8} strokeDasharray={isForecast ? "3,3" : "none"} />
                  <text x={x + 10} y={y - 4} textAnchor="middle" fontSize="7" fill="#999999">{(m.actual || m.forecast || 0) >= 1000 ? Math.round((m.actual || m.forecast || 0) / 1000) + "k" : m.actual || m.forecast}</text>
                </g>
              )
            })}
            <line x1="20" y1="125" x2="290" y2="125" stroke="currentColor" className="text-[#D4D4D4] dark:text-[#333333]" strokeWidth="1" />
          </svg>
          <div className="flex justify-between text-[10px] text-[#999999] dark:text-[#666666] mt-1" style={{ direction: "ltr" }}>
            {forecastMonths.map((m, i) => <span key={i}>{m.month}</span>)}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-[#666666] dark:text-[#999999]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#0D0D0D] dark:bg-[#F2F2F2]" /> {lang === "ar" ? "فعلي" : "Actual"}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#999999] dark:bg-[#666666] opacity-40" /> {lang === "ar" ? "متوقع" : "Forecast"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
