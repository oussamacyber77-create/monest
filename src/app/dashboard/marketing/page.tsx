"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { marketingPlatforms, bestCampaigns, worstCampaigns } from "@/lib/mock-data/dashboard"
import { TrendingUp, TrendingDown, Megaphone, Plus, BarChart3, Target, Lightbulb, Play, Pause, DollarSign, Eye, MousePointerClick, CalendarDays, ArrowUpRight, Download, X, Check } from "lucide-react"
import { SARIcon } from "@/components/ui/sar-icon"

const allCampaigns = [
  { name: { ar: "حملة العيد", en: "Eid Campaign" }, platform: "Google Ads", spend: 3200, revenue: 12800, roas: 4.0, status: "active", impressions: 45000, clicks: 2100, conversion: 3.8, start: "2026-06-01", end: "2026-07-15" },
  { name: { ar: "تخفيضات الصيف", en: "Summer Sale" }, platform: "Meta Ads", spend: 2500, revenue: 8750, roas: 3.5, status: "active", impressions: 38000, clicks: 1850, conversion: 4.2, start: "2026-06-10", end: "2026-08-01" },
  { name: { ar: "إطلاق منتج جديد", en: "New Product Launch" }, platform: "TikTok Ads", spend: 1800, revenue: 4500, roas: 2.5, status: "paused", impressions: 52000, clicks: 980, conversion: 1.9, start: "2026-05-15", end: "2026-06-30" },
  { name: { ar: "استهداف العملاء", en: "Customer Retarget" }, platform: "Meta Ads", spend: 1200, revenue: 5400, roas: 4.5, status: "active", impressions: 15000, clicks: 890, conversion: 5.1, start: "2026-06-15", end: "2026-07-30" },
  { name: { ar: "خصم الطلاب", en: "Student Discount" }, platform: "Google Ads", spend: 900, revenue: 2300, roas: 2.6, status: "ended", impressions: 12000, clicks: 540, conversion: 2.2, start: "2026-04-01", end: "2026-05-30" },
]

export default function MarketingPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "reports">("overview")
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "مركز التسويق" : "Marketing Center"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
            {lang === "ar" ? "تحليل وإدارة الحملات التسويقية" : "Campaign analysis & management"}
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab !== "reports" && (
            <button onClick={() => setActiveTab("reports")} className="h-10 px-4 border border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors flex items-center gap-1.5">
              <BarChart3 size={14} />
              {lang === "ar" ? "تقارير" : "Reports"}
            </button>
          )}
          <button onClick={() => setShowNewCampaign(true)} className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Plus size={14} />
            {lang === "ar" ? "إنشاء حملة" : "New Campaign"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1 max-w-sm">
        {(["overview", "campaigns", "reports"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={"flex-1 py-2 text-xs font-medium transition-colors " + (activeTab === tab ? "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}>
            {tab === "overview" ? (lang === "ar" ? "نظرة عامة" : "Overview") : tab === "campaigns" ? (lang === "ar" ? "الحملات" : "Campaigns") : (lang === "ar" ? "التقارير" : "Reports")}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Megaphone, label: { ar: "الحملات النشطة", en: "Active Campaigns" }, value: "3", change: "+2", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { icon: DollarSign, label: { ar: "إجمالي الإنفاق", en: "Total Spend" }, value: "9,600", change: "+8%", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { icon: Target, label: { ar: "معدل التحويل", en: "Conversion Rate" }, value: "3.8%", change: "+0.6%", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { icon: TrendingUp, label: { ar: "متوسط ROAS", en: "Avg ROAS" }, value: "3.6x", change: "+12%", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
            ].map((s) => (
              <div key={s.label.en} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
                <div className={"w-8 h-8 rounded-lg flex items-center justify-center mb-2 " + s.bg}>
                  <s.icon size={16} className={s.color} />
                </div>
                <p className="text-[10px] text-[#999999] mb-1">{s.label[lang]}</p>
                <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.value} <SARIcon className="w-3.5 h-3.5 inline" /></p>
                <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">{s.change}</p>
              </div>
            ))}
          </div>

          {/* Platform Performance */}
          <div className="grid md:grid-cols-3 gap-3">
            {marketingPlatforms.map((p) => (
              <div key={p.name} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center text-xs font-bold">{p.icon}</div>
                  <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-[#999999]">CPA</span><p className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.costPerAcquisition} <SARIcon className="w-2.5 h-2.5 inline" /></p></div>
                  <div><span className="text-[#999999]">ROAS</span><p className="font-bold text-green-600">{p.roas}x</p></div>
                  <div><span className="text-[#999999]">CVR</span><p className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.conversionRate}%</p></div>
                  <div><span className="text-[#999999]">{lang === "ar" ? "إنفاق" : "Spend"}</span><p className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.spend.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></p></div>
                </div>
              </div>
            ))}
          </div>

          {/* Best & Worst */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
              <h3 className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5"><TrendingUp size={14} className="text-green-600" />{lang === "ar" ? "أفضل الحملات" : "Best Campaigns"}</h3>
              <div className="space-y-2">
                {bestCampaigns.map((c, i) => (
                  <div key={i} className="flex justify-between items-center pb-2 border-b border-[#D4D4D4] dark:border-[#333333] last:border-0 last:pb-0">
                    <div><p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p><p className="text-[9px] text-[#999999]">{c.platform} · ROAS {c.roas}x</p></div>
                    <span className="text-xs font-bold text-green-600">{c.revenue.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
              <h3 className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5"><TrendingDown size={14} className="text-[#DC2626]" />{lang === "ar" ? "أسوأ الحملات" : "Worst Campaigns"}</h3>
              <div className="space-y-2">
                {worstCampaigns.map((c, i) => (
                  <div key={i} className="flex justify-between items-center pb-2 border-b border-[#D4D4D4] dark:border-[#333333] last:border-0 last:pb-0">
                    <div><p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p><p className="text-[9px] text-[#999999]">{c.platform} · ROAS {c.roas}x</p></div>
                    <span className="text-xs font-bold text-[#DC2626]">{c.revenue.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 h-8 border border-[#D4D4D4] dark:border-[#333333] text-[10px] font-medium text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">{lang === "ar" ? "مراجعة وتحسين" : "Review & Optimize"}</button>
            </div>
          </div>

          {/* AI Insight */}
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4 flex items-start gap-3">
            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-[#666666] dark:text-[#B3B3B3] flex-1">
              {lang === "ar"
                ? "حسب تحليل AI: زيادة ميزانية Google Ads بنسبة 20% قد تحسن ROAS إلى 4.5x. يُوصى أيضاً بإيقاف حملة TikTok مؤقتاً."
                : "AI analysis: Increasing Google Ads budget by 20% could improve ROAS to 4.5x. Also recommend pausing TikTok campaign temporarily."}
            </p>
            <button className="text-[10px] font-bold text-[#0D0D0D] dark:text-[#F2F2F2] border border-[#D4D4D4] dark:border-[#333333] px-3 py-1 shrink-0">{lang === "ar" ? "تطبيق" : "Apply"}</button>
          </div>
        </>
      )}

      {activeTab === "campaigns" && (
        <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
          <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "جميع الحملات" : "All Campaigns"}</h2>
            <div className="flex gap-1">
              {["all", "active", "paused", "ended"].map((f) => (
                <button key={f} className="px-2 py-1 text-[10px] font-medium bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? { all: "الكل", active: "نشط", paused: "متوقف", ended: "منتهي" }[f] : f}</button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
            {allCampaigns.map((camp, i) => (
              <div key={i} className="p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button className={"w-7 h-7 rounded-full flex items-center justify-center shrink-0 " + (camp.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : camp.status === "paused" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-[#E8E8E8] dark:bg-[#333333] text-[#999999]")}>
                      {camp.status === "active" ? <Play size={10} /> : camp.status === "paused" ? <Pause size={10} /> : <Check size={10} />}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{camp.name[lang]}</p>
                      <p className="text-[10px] text-[#999999]">{camp.platform}</p>
                    </div>
                  </div>
                  <span className={"px-2 py-0.5 text-[9px] font-bold " + (camp.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : camp.status === "paused" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-[#E8E8E8] dark:bg-[#333333] text-[#999999]")}>
                    {lang === "ar" ? { active: "نشط", paused: "متوقف", ended: "منتهي" }[camp.status] : camp.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div><span className="text-[#999999]">{lang === "ar" ? "إنفاق" : "Spend"}</span><p className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{camp.spend.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></p></div>
                  <div><span className="text-[#999999]">{lang === "ar" ? "إيرادات" : "Revenue"}</span><p className="font-medium text-green-600">{camp.revenue.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></p></div>
                  <div><span className="text-[#999999]">ROAS</span><p className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{camp.roas}x</p></div>
                  <div><span className="text-[#999999]">CVR</span><p className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{camp.conversion}%</p></div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[#999999]">
                  <span className="flex items-center gap-0.5"><Eye size={10} />{camp.impressions.toLocaleString("en-US")}</span>
                  <span className="flex items-center gap-0.5"><MousePointerClick size={10} />{camp.clicks.toLocaleString("en-US")}</span>
                  <span className="flex items-center gap-0.5"><CalendarDays size={10} />{camp.start} → {camp.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { label: { ar: "إجمالي الإيرادات", en: "Total Revenue" }, value: "33,750", change: "+18%", color: "text-green-600" },
              { label: { ar: "إجمالي الإنفاق", en: "Total Spend" }, value: "9,600", change: "+8%", color: "text-amber-600" },
              { label: { ar: "صافي الربح", en: "Net Profit" }, value: "24,150", change: "+22%", color: "text-green-600" },
            ].map((r) => (
              <div key={r.label.en} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
                <p className="text-[10px] text-[#999999] mb-1">{r.label[lang]}</p>
                <p className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{r.value} <SARIcon className="w-4 h-4 inline" /></p>
                <p className={"text-[10px] font-medium " + r.color}>{r.change}</p>
              </div>
            ))}
          </div>

          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "تقرير شهري" : "Monthly Report"}</h3>
              <button className="flex items-center gap-1 text-[10px] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"><Download size={12} /> {lang === "ar" ? "تصدير" : "Export"}</button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#999999] border-b border-[#D4D4D4] dark:border-[#333333]">
                  <th className="py-2 text-start font-medium">{lang === "ar" ? "الشهر" : "Month"}</th>
                  <th className="py-2 text-start font-medium">{lang === "ar" ? "إنفاق" : "Spend"}</th>
                  <th className="py-2 text-start font-medium">{lang === "ar" ? "إيرادات" : "Revenue"}</th>
                  <th className="py-2 text-start font-medium">ROAS</th>
                  <th className="py-2 text-start font-medium">{lang === "ar" ? "تحويل" : "CVR"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
                {[
                  { month: "يونيو", spend: 12600, revenue: 45200, roas: 3.6, cvr: 3.8 },
                  { month: "مايو", spend: 10800, revenue: 38800, roas: 3.6, cvr: 3.5 },
                  { month: "إبريل", spend: 9500, revenue: 31200, roas: 3.3, cvr: 3.1 },
                  { month: "مارس", spend: 8200, revenue: 28400, roas: 3.5, cvr: 3.4 },
                  { month: "فبراير", spend: 7800, revenue: 24600, roas: 3.2, cvr: 3.0 },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]">
                    <td className="py-2.5 font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{r.month}</td>
                    <td className="py-2.5 text-[#666666]">{r.spend.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></td>
                    <td className="py-2.5 text-green-600 font-medium">{r.revenue.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5 inline" /></td>
                    <td className="py-2.5 text-[#0D0D0D] dark:text-[#F2F2F2]">{r.roas}x</td>
                    <td className="py-2.5 text-[#666666]">{r.cvr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewCampaign(false)} />
          <div className="relative w-full max-w-lg bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "إنشاء حملة جديدة" : "New Campaign"}</h3>
              <button onClick={() => setShowNewCampaign(false)} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "اسم الحملة" : "Campaign Name"}</label>
                <input placeholder={lang === "ar" ? "مثال: تخفيضات الصيف" : "e.g. Summer Sale"} className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "المنصة" : "Platform"}</label>
                <select className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none">
                  <option>Google Ads</option>
                  <option>Meta Ads</option>
                  <option>TikTok Ads</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "الميزانية" : "Budget"} (<SARIcon className="w-3 h-3 inline" />)</label>
                  <input type="number" placeholder="5000" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "المدة (أيام)" : "Duration (days)"}</label>
                  <input type="number" placeholder="30" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "الجمهور المستهدف" : "Target Audience"}</label>
                <select className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none">
                  <option>{lang === "ar" ? "الكل" : "All"}</option>
                  <option>{lang === "ar" ? "عملاء جدد" : "New Customers"}</option>
                  <option>{lang === "ar" ? "عملاء حاليون" : "Existing Customers"}</option>
                  <option>{lang === "ar" ? "خاملون" : "Inactive"}</option>
                </select>
              </div>
              <button className="w-full h-11 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity">
                {lang === "ar" ? "إنشاء الحملة" : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
