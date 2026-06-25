"use client"

import { useEffect, useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { dashboardStats, products, customerSegments, generateSalesDays } from "@/lib/mock-data/dashboard"
import { Store, TrendingUp, TrendingDown, AlertTriangle, Star, Link as LinkIcon } from "lucide-react"
import { getSallaAuthUrl } from "@/lib/salla/config"
import { GuidedTour } from "@/components/tour/guided-tour"
import { HelpButton } from "@/components/tour/help-button"
import { dashboardTourSteps } from "@/components/tour/tour-steps"

const salesDays = generateSalesDays()

export default function DashboardPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("tour-dashboard")) setShowTour(true)
  }, [])

  const topProducts = products.sort((a, b) => b.sales - a.sales).slice(0, 5)
  const bestCustomers = [
    { name: "محمد العبدالله", total: 28450, orders: 34 },
    { name: "سارة الحربي", total: 24800, orders: 28 },
    { name: "عبدالرحمن القحطاني", total: 22150, orders: 25 },
    { name: "نورة الشمري", total: 19600, orders: 22 },
    { name: "فيصل الدوسري", total: 17300, orders: 19 },
  ]
  const stagnantProducts = products.filter((p) => p.aiSuggestion.type === "discontinue" || p.aiSuggestion.type === "lower")
  const atRiskCustomers = customerSegments.find((s) => s.label.en === "At Risk")!

  const maxSales = Math.max(...salesDays.map((d) => d.sales), 1)
  const maxOrders = Math.max(...salesDays.map((d) => d.orders), 1)

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "لوحة المعلومات" : "Dashboard"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "مرحباً بك في مساحة عضويتك" : "Welcome to Your Membership Space"}
          </p>
        </div>
        <a
          href={getSallaAuthUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-[#D4D4D4] dark:border-[#333333] hover:border-[#0D0D0D] dark:hover:border-[#F2F2F2] transition-colors"
        >
          <LinkIcon size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <span className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "ربط متجر سلة" : "Connect Salla Store"}
          </span>
        </a>
      </div>

      <div id="tour-dashboard-stats" className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        {dashboardStats.slice(0, 8).map((s, i) => (
          <div key={i} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
            <p className="text-xs text-[#666666] dark:text-[#999999] mb-1">{s.label[lang]}</p>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {s.value.toLocaleString("en-US")}{s.suffix || ""}
              </span>
              <span className={"flex items-center gap-0.5 text-[10px] font-medium mb-0.5 " + (s.change >= 0 ? "text-green-600 dark:text-green-400" : "text-[#DC2626]")}>
                {s.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(s.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div id="tour-dashboard-chart" className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "المبيعات آخر 30 يوم" : "Sales Last 30 Days"}
          </h2>
          <svg viewBox="0 0 310 140" className="w-full h-auto" style={{ direction: "ltr" }}>
            {salesDays.map((d, i) => {
              const x = 10 + i * 10
              const h = (d.sales / maxSales) * 100
              return <rect key={i} x={x} y={130 - h} width="6" height={h} fill="currentColor" className="text-[#0D0D0D] dark:text-[#F2F2F2]" opacity="0.6" />
            })}
            <line x1="10" y1="130" x2="300" y2="130" stroke="currentColor" className="text-[#D4D4D4] dark:text-[#333333]" strokeWidth="1" />
          </svg>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "المنتجات الأعلى مبيعاً" : "Top Products"}
          </h2>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#999999]">{i + 1}</span>
                  <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{p.name[lang]}</span>
                </div>
                <span className="text-xs text-[#666666] dark:text-[#999999] shrink-0">{p.sales}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="tour-dashboard-insights" className="grid md:grid-cols-3 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
            {lang === "ar" ? "المنتجات الراكدة" : "Stagnant Products"}
          </h2>
          <div className="space-y-2">
            {stagnantProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{p.name[lang]}</span>
                <AlertTriangle size={14} className="text-[#DC2626] shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
            {lang === "ar" ? "أفضل العملاء" : "Best Customers"}
          </h2>
          <div className="space-y-2">
            {bestCustomers.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</span>
                </div>
                <span className="text-xs text-[#666666] dark:text-[#999999]">{c.total.toLocaleString("en-US")} ر.س</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
            {lang === "ar" ? "العملاء المهددين بالمغادرة" : "At-Risk Customers"}
          </h2>
          <p className="text-3xl font-bold text-[#DC2626] mb-1">{atRiskCustomers.count}</p>
          <p className="text-xs text-[#666666] dark:text-[#999999] mb-3">
            {atRiskCustomers.percentage}% {lang === "ar" ? "من إجمالي العملاء" : "of total customers"}
          </p>
          <div className="text-xs text-[#666666] dark:text-[#999999]">
            {lang === "ar"
              ? "يُوصى بإطلاق حملة استعادة العملاء"
              : "Customer reactivation campaign recommended"}
          </div>
        </div>
      </div>
      <HelpButton onClick={() => setShowTour(true)} />
      {showTour && (
        <GuidedTour
          steps={dashboardTourSteps}
          onComplete={() => { sessionStorage.setItem("tour-dashboard", "1"); setShowTour(false) }}
          onSkip={() => { sessionStorage.setItem("tour-dashboard", "1"); setShowTour(false) }}
        />
      )}
    </div>
  )
}
