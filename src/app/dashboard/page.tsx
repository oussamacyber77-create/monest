"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { dashboardStats, products, customerSegments, generateSalesDays } from "@/lib/mock-data/dashboard"
import { Store, TrendingUp, TrendingDown, AlertTriangle, Star, Link as LinkIcon, RefreshCw, Download, Calendar, Filter, X, DollarSign, ShoppingCart, Users, Percent, ChartPie, ArrowUpRight, ArrowDownRight, Clock, Package, UserCheck, UserX, Zap } from "lucide-react"
import { getSallaAuthUrl } from "@/lib/salla/config"
import { GuidedTour } from "@/components/tour/guided-tour"
import { HelpButton } from "@/components/tour/help-button"
import { dashboardTourSteps } from "@/components/tour/tour-steps"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts"

type Period = "today" | "7d" | "30d" | "custom"

interface DrillDownModal {
  open: boolean
  label: string
  data: any
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US") + " ر.س"
}

function formatShortCurrency(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M ر.س"
  if (value >= 1000) return (value / 1000).toFixed(value >= 10000 ? 0 : 1) + "K ر.س"
  return value.toLocaleString("en-US") + " ر.س"
}

function getPeriodLabel(period: Period, lang: string): string {
  const labels: Record<Period, { ar: string; en: string }> = {
    today: { ar: "اليوم", en: "Today" },
    "7d": { ar: "آخر 7 أيام", en: "Last 7 Days" },
    "30d": { ar: "آخر 30 يوم", en: "Last 30 Days" },
    custom: { ar: "مخصص", en: "Custom" },
  }
  return labels[period][lang as "ar" | "en"]
}

function getChangeColor(change: number): string {
  if (change > 0) return "text-green-600 dark:text-green-400"
  if (change < 0) return "text-[#DC2626]"
  return "text-[#999999]"
}

export default function DashboardPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [showTour, setShowTour] = useState(false)
  const [salesDays, setSalesDays] = useState<{ day: string; sales: number; orders: number }[]>([])
  const [period, setPeriod] = useState<Period>("30d")
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [drillDown, setDrillDown] = useState<DrillDownModal>({ open: false, label: "", data: null })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionStorage.getItem("tour-dashboard")) setShowTour(true)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const timer = setTimeout(() => {
      try {
        setSalesDays(generateSalesDays())
        setLastUpdated(new Date())
        setLoading(false)
      } catch {
        setError(lang === "ar" ? "فشل تحميل البيانات" : "Failed to load data")
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [period]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = useCallback(() => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setSalesDays(generateSalesDays())
      setLastUpdated(new Date())
      setLoading(false)
    }, 300)
  }, [lang])

  const handleExport = useCallback(() => {
    const rows = [["المؤشر", "القيمة", "التغيير"]]
    filteredStats.forEach((s) => rows.push([s.label[lang], String(s.value), s.change + "%"]))
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "dashboard-export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }, [lang])

  const openDrillDown = (label: string, data: any) => setDrillDown({ open: true, label, data })
  const closeDrillDown = () => setDrillDown({ open: false, label: "", data: null })

  const filteredStats = useMemo(() => {
    const multipliers: Record<Period, number> = { today: 0.03, "7d": 0.25, "30d": 1, custom: 1 }
    const m = multipliers[period] || 1
    return dashboardStats.slice(0, 8).map((s) => {
      const periodLabel = getPeriodLabel(period, lang)
      return {
        ...s,
        value: Math.round(s.value * m),
        periodLabel,
        changeLabel: s.changeLabel || periodLabel,
        change: period === "today" ? Math.round(s.change * 0.3) : s.change,
      }
    })
  }, [period, lang])

  const topProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5)
    const m: Record<Period, number> = { today: 0.03, "7d": 0.25, "30d": 1, custom: 1 }
    return sorted.map((p) => ({ ...p, sales: Math.round(p.sales * m[period]) }))
  }, [period])

  const bestCustomers = useMemo(() => {
    const m: Record<Period, number> = { today: 0.03, "7d": 0.25, "30d": 1, custom: 1 }
    const factor = m[period]
    return [
      { name: "محمد العبدالله", total: Math.round(28450 * factor), orders: Math.round(34 * factor) },
      { name: "سارة الحربي", total: Math.round(24800 * factor), orders: Math.round(28 * factor) },
      { name: "عبدالرحمن القحطاني", total: Math.round(22150 * factor), orders: Math.round(25 * factor) },
      { name: "نورة الشمري", total: Math.round(19600 * factor), orders: Math.round(22 * factor) },
      { name: "فيصل الدوسري", total: Math.round(17300 * factor), orders: Math.round(19 * factor) },
    ]
  }, [period])

  const stagnantProducts = useMemo(
    () => products.filter((p) => p.aiSuggestion.type === "discontinue" || p.aiSuggestion.type === "lower"),
    []
  )

  const atRiskCustomers = useMemo(
    () => customerSegments.find((s) => s.label.en === "At Risk")!,
    []
  )

  const KPI_ICONS = [DollarSign, ShoppingCart, Users, ChartPie, Percent, TrendingUp, TrendingDown, Zap]

  const mainKpiIndices = [0, 1] // Total Sales, Total Orders as main KPIs

  const chartData = useMemo(() => {
    return salesDays.map((d) => ({
      day: d.day.slice(5),
      sales: d.sales,
      orders: d.orders,
    }))
  }, [salesDays])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") closeDrillDown()
  }, [])

  useEffect(() => {
    if (drillDown.open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [drillDown.open, handleKeyDown])

  return (
    <div className="flex-1 p-3 md:p-6 overflow-y-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "لوحة المعلومات" : "Dashboard"}
          </h1>
          <p className="text-xs md:text-sm text-[#666666] dark:text-[#B3B3B3]">
            {lang === "ar" ? "مرحباً بك في منصة Monest" : "Welcome to Monest Platform"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#999999] dark:text-[#666666] flex items-center gap-1">
            <Clock size={12} />
            {lastUpdated.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button onClick={handleRefresh} disabled={loading} className="p-2 border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors disabled:opacity-50" aria-label="Refresh">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={handleExport} className="p-2 border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors" aria-label="Export">
            <Download size={14} />
          </button>
          <a
            href={getSallaAuthUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 border border-[#D4D4D4] dark:border-[#333333] hover:border-[#0D0D0D] dark:hover:border-[#F2F2F2] transition-colors text-xs"
          >
            <LinkIcon size={14} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
            <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "ربط متجر سلة" : "Connect Salla"}
            </span>
          </a>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-[#666666] dark:text-[#999999]" />
        {(["today", "7d", "30d"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={"px-3 py-1.5 text-xs font-medium transition-colors " + (period === p
              ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
              : "border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
          >
            {p === "today" ? (lang === "ar" ? "اليوم" : "Today") : p === "7d" ? (lang === "ar" ? "٧ أيام" : "7 Days") : (lang === "ar" ? "٣٠ يوم" : "30 Days")}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-[#DC2626] flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
          <button onClick={handleRefresh} className="ms-auto text-xs font-medium underline">{lang === "ar" ? "إعادة المحاولة" : "Retry"}</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 animate-pulse">
                <div className="h-3 bg-[#D4D4D4] dark:bg-[#333333] w-20 mb-3" />
                <div className="h-6 bg-[#D4D4D4] dark:bg-[#333333] w-24 mb-2" />
                <div className="h-3 bg-[#D4D4D4] dark:bg-[#333333] w-16" />
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5 animate-pulse">
              <div className="h-4 bg-[#D4D4D4] dark:bg-[#333333] w-40 mb-4" />
              <div className="h-32 bg-[#D4D4D4] dark:bg-[#333333]" />
            </div>
            <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5 animate-pulse">
              <div className="h-4 bg-[#D4D4D4] dark:bg-[#333333] w-40 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-5 bg-[#D4D4D4] dark:bg-[#333333]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {!loading && !error && (
        <div id="tour-dashboard-stats" className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          {filteredStats.map((s, i) => {
            const Icon = KPI_ICONS[i] || DollarSign
            const isMain = mainKpiIndices.includes(i)
            return (
              <button
                key={i}
                onClick={() => openDrillDown(s.label[lang], { type: "kpi", stat: s })}
                className={"bg-[#F2F2F2] dark:bg-[#0D0D0D] p-3 md:p-4 text-start hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors relative " + (isMain ? "md:bg-[#F9F9F9] dark:md:bg-[#111111]" : "")}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] md:text-xs text-[#666666] dark:text-[#B3B3B3] font-medium">{s.label[lang]}</p>
                  <Icon size={isMain ? 16 : 12} className={isMain ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#999999] dark:text-[#666666]"} />
                </div>
                <div className="flex items-end gap-1.5 flex-wrap">
                  <span className={"font-bold text-[#0D0D0D] dark:text-[#F2F2F2] " + (isMain ? "text-xl md:text-2xl" : "text-base md:text-lg")}>
                    {formatShortCurrency(s.value)}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={"flex items-center gap-0.5 text-[10px] font-medium " + getChangeColor(s.change)}>
                    {s.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(s.change)}%
                  </span>
                  <span className="text-[9px] text-[#999999] dark:text-[#666666]">{s.periodLabel}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Charts + Top Products */}
      {!loading && !error && (
        <div id="tour-dashboard-chart" className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "المبيعات آخر 30 يوم" : "Sales Last 30 Days"}
              </h2>
              <button
                onClick={() => openDrillDown(lang === "ar" ? "المبيعات" : "Sales", { type: "chart", data: chartData })}
                className="text-[10px] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                <ArrowUpRight size={14} />
              </button>
            </div>
            {salesDays.length > 0 ? (
              <div style={{ direction: "ltr" }} className="w-full">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D4D4" className="dark:opacity-30" />
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#999" }} interval={4} />
                    <YAxis tick={{ fontSize: 9, fill: "#999" }} />
                    <Tooltip
                      contentStyle={{
                        background: "#F2F2F2",
                        border: "1px solid #D4D4D4",
                        borderRadius: 0,
                        fontSize: 12,
                        color: "#0D0D0D",
                      }}
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 10, color: "#666" }}
                      formatter={(value: string) => (lang === "ar" && value === "sales" ? "المبيعات" : value === "sales" ? "Sales" : value === "orders" ? "الطلبات" : "Orders")}
                    />
                    <Bar dataKey="sales" fill="#0D0D0D" className="dark:fill-[#F2F2F2]" radius={[2, 2, 0, 0]} maxBarSize={8} />
                    <Bar dataKey="orders" fill="#999999" className="dark:fill-[#666666]" radius={[2, 2, 0, 0]} maxBarSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-xs text-[#999999] dark:text-[#666666]">
                {lang === "ar" ? "لا توجد بيانات" : "No data available"}
              </div>
            )}
          </div>
          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "المنتجات الأعلى مبيعاً" : "Top Products"}
              </h2>
              <button
                onClick={() => openDrillDown(lang === "ar" ? "المنتجات الأعلى مبيعاً" : "Top Products", { type: "top-products", data: topProducts })}
                className="text-[10px] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {topProducts.length === 0 && (
                <p className="text-xs text-[#999999] dark:text-[#666666] text-center py-8">
                  {lang === "ar" ? "لا توجد منتجات" : "No products"}
                </p>
              )}
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#999999] w-4 shrink-0 text-center">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs md:text-sm text-[#0D0D0D] dark:text-[#F2F2F2] truncate block">{p.name[lang]}</span>
                      <span className="text-[9px] text-[#999999] dark:text-[#666666]">
                        {p.price.toLocaleString("en-US")} ر.س · {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <span className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.sales.toLocaleString("en-US")}</span>
                    <span className="text-[9px] text-[#999999] dark:text-[#666666] block">{lang === "ar" ? "وحدة" : "units"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Widgets */}
      {!loading && !error && (
        <div id="tour-dashboard-insights" className="grid md:grid-cols-3 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          {/* Stagnant Products */}
          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 md:p-5">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
              {lang === "ar" ? "المنتجات الراكدة" : "Stagnant Products"}
            </h2>
            {stagnantProducts.length === 0 ? (
              <p className="text-xs text-[#999999] dark:text-[#666666] text-center py-8">
                {lang === "ar" ? "لا توجد منتجات راكدة" : "No stagnant products"}
              </p>
            ) : (
              <div className="space-y-2">
                {stagnantProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs md:text-sm text-[#0D0D0D] dark:text-[#F2F2F2] truncate block">{p.name[lang]}</span>
                      <span className="text-[9px] text-[#999999] dark:text-[#666666]">
                        {lang === "ar" ? "مخزون" : "Stock"}: {p.stock} · {lang === "ar" ? "آخر بيع" : "Last sale"}: {p.sales > 50 ? "٢٠٢٦/٠٦" : "٢٠٢٦/٠٤"}
                      </span>
                    </div>
                    <span title={p.aiSuggestion[lang as "ar" | "en"]}><AlertTriangle size={14} className="text-[#DC2626] shrink-0" /></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Best Customers */}
          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 md:p-5">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
              {lang === "ar" ? "أفضل العملاء" : "Best Customers"}
            </h2>
            {bestCustomers.length === 0 ? (
              <p className="text-xs text-[#999999] dark:text-[#666666] text-center py-8">
                {lang === "ar" ? "لا يوجد عملاء" : "No customers"}
              </p>
            ) : (
              <div className="space-y-2">
                {bestCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-[#F2F2F2] dark:text-[#0D0D0D]">{c.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs md:text-sm text-[#0D0D0D] dark:text-[#F2F2F2] truncate block">{c.name}</span>
                        <span className="text-[9px] text-[#999999] dark:text-[#666666]">{c.orders} {lang === "ar" ? "طلبات" : "orders"}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] shrink-0">{formatShortCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* At-Risk Customers */}
          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 md:p-5">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
              {lang === "ar" ? "العملاء المهددين بالمغادرة" : "At-Risk Customers"}
            </h2>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-bold text-[#DC2626]">{atRiskCustomers.count}</span>
              <span className="text-sm font-medium text-[#DC2626] mb-1">{atRiskCustomers.percentage}%</span>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-3">
              {lang === "ar" ? "من إجمالي العملاء" : "of total customers"}
            </p>
            <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-3">
              {lang === "ar"
                ? "يُوصى بإطلاق حملة استعادة العملاء"
                : "Customer reactivation campaign recommended"}
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-medium hover:opacity-90 transition-opacity">
              <UserCheck size={14} />
              {lang === "ar" ? "إطلاق حملة استعادة" : "Launch Reactivation"}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && salesDays.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Store size={48} className="text-[#D4D4D4] dark:text-[#333333] mb-4" />
          <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "لا توجد بيانات" : "No Data Yet"}
          </h2>
          <p className="text-sm text-[#666666] dark:text-[#999999] mb-4">
            {lang === "ar" ? "اربط متجر سلة لبدء عرض البيانات" : "Connect your Salla store to start viewing data"}
          </p>
          <a
            href={getSallaAuthUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-medium"
          >
            <LinkIcon size={16} />
            {lang === "ar" ? "ربط متجر سلة" : "Connect Salla Store"}
          </a>
        </div>
      )}

      <HelpButton onClick={() => setShowTour(true)} />
      {showTour && (
        <GuidedTour
          steps={dashboardTourSteps}
          onComplete={() => { sessionStorage.setItem("tour-dashboard", "1"); setShowTour(false) }}
          onSkip={() => { sessionStorage.setItem("tour-dashboard", "1"); setShowTour(false) }}
        />
      )}

      {/* Drill-Down Modal */}
      {drillDown.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeDrillDown} />
          <div className="relative w-full max-w-lg bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{drillDown.label}</h3>
              <button onClick={closeDrillDown} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]">
                <X size={16} />
              </button>
            </div>

            {drillDown.data?.type === "kpi" && (
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{formatShortCurrency(drillDown.data.stat.value)}</span>
                  <span className={"flex items-center gap-1 text-sm font-medium mb-1 " + getChangeColor(drillDown.data.stat.change)}>
                    {drillDown.data.stat.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(drillDown.data.stat.change)}%
                  </span>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#B3B3B3]">
                  {lang === "ar" ? "الفترة" : "Period"}: {drillDown.data.stat.periodLabel}
                </p>
                {drillDown.data.stat.change >= 10 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300">
                    {lang === "ar" ? "مؤشر إيجابي — أداء قوي مقارنة بالفترة السابقة" : "Positive indicator — strong performance vs previous period"}
                  </div>
                )}
                {drillDown.data.stat.change < 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-[#DC2626]">
                    {lang === "ar" ? "تنبيه — انخفاض عن الفترة السابقة. يُوصى بمراجعة الاستراتيجية" : "Alert — decline from previous period. Strategy review recommended"}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D4D4D4] dark:border-[#333333]">
                  <div>
                    <p className="text-[10px] text-[#999999] dark:text-[#666666]">{lang === "ar" ? "القيمة الحالية" : "Current Value"}</p>
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{formatShortCurrency(drillDown.data.stat.value)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999999] dark:text-[#666666]">{lang === "ar" ? "التغيير" : "Change"}</p>
                    <p className={"text-sm font-bold " + getChangeColor(drillDown.data.stat.change)}>
                      {drillDown.data.stat.change >= 0 ? "+" : ""}{drillDown.data.stat.change}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {drillDown.data?.type === "chart" && (
              <div style={{ direction: "ltr" }}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D4D4" className="dark:opacity-30" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#999" }} interval={3} />
                    <YAxis tick={{ fontSize: 10, fill: "#999" }} />
                    <Tooltip
                      contentStyle={{ background: "#F2F2F2", border: "1px solid #D4D4D4", borderRadius: 0, fontSize: 12, color: "#0D0D0D" }}
                      formatter={(value: any) => formatCurrency(Number(value) || 0)}
                    />
                    <Bar dataKey="sales" fill="#0D0D0D" className="dark:fill-[#F2F2F2]" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="orders" fill="#999999" className="dark:fill-[#666666]" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {drillDown.data?.type === "top-products" && (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{p.name[lang]}</p>
                      <p className="text-[10px] text-[#999999] dark:text-[#666666]">{p.price.toLocaleString("en-US")} ر.س · {p.category} · {lang === "ar" ? "مخزون" : "Stock"}: {p.stock}</p>
                    </div>
                    <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] shrink-0">{p.sales.toLocaleString("en-US")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
