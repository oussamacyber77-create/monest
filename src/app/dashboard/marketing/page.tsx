"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { marketingPlatforms, bestCampaigns, worstCampaigns } from "@/lib/mock-data/dashboard"
import { TrendingUp, TrendingDown, Megaphone, Plus, BarChart3, Target, Lightbulb, Play, Pause, Eye, MousePointerClick, DollarSign } from "lucide-react"

export default function MarketingPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeCampaigns, setActiveCampaigns] = useState(4)

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "مركز التسويق" : "Marketing Center"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "تحليل وإدارة الحملات التسويقية" : "Campaign analysis & management"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-4 border border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors flex items-center gap-1.5">
            <BarChart3 size={14} />
            {lang === "ar" ? "تقارير" : "Reports"}
          </button>
          <button className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-80 transition-opacity flex items-center gap-1.5">
            <Plus size={14} />
            {lang === "ar" ? "إنشاء حملة" : "New Campaign"}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Megaphone, label: { ar: "الحملات النشطة", en: "Active Campaigns" }, value: activeCampaigns, change: "+2", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: DollarSign, label: { ar: "إجمالي الإنفاق", en: "Total Spend" }, value: "12,450 ر.س", change: "+8%", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { icon: Target, label: { ar: "معدل التحويل", en: "Conversion Rate" }, value: "3.8%", change: "+0.6%", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { icon: TrendingUp, label: { ar: "العائد على الإنفاق", en: "ROAS" }, value: "4.2x", change: "+12%", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
        ].map((s) => (
          <div key={s.label.en} className={"p-4 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]"}>
            <div className={"w-9 h-9 rounded-lg flex items-center justify-center mb-3 " + s.bg}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-[10px] text-[#999999] mb-1">{s.label[lang]}</p>
            <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.value}</p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
        <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-2">
            <Megaphone size={16} />
            {lang === "ar" ? "الحملات الحالية" : "Current Campaigns"}
          </h2>
          <div className="flex gap-1">
            <button className="px-2 py-1 text-[10px] font-medium bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الكل" : "All"}</button>
            <button className="px-2 py-1 text-[10px] font-medium text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">{lang === "ar" ? "النشط" : "Active"}</button>
            <button className="px-2 py-1 text-[10px] font-medium text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">{lang === "ar" ? "المتوقف" : "Paused"}</button>
          </div>
        </div>
        <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
          {[
            { name: lang === "ar" ? "حملة العيد" : "Eid Campaign", platform: "Google Ads", spend: 3200, revenue: 12800, roas: 4.0, status: "active" },
            { name: lang === "ar" ? "تخفيضات الصيف" : "Summer Sale", platform: "Meta Ads", spend: 2500, revenue: 8750, roas: 3.5, status: "active" },
            { name: lang === "ar" ? "إطلاق منتج جديد" : "New Product Launch", platform: "TikTok Ads", spend: 1800, revenue: 4500, roas: 2.5, status: "paused" },
            { name: lang === "ar" ? "استهداف العملاء" : "Customer Retarget", platform: "Meta Ads", spend: 1200, revenue: 5400, roas: 4.5, status: "active" },
          ].map((camp, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <button className={"w-8 h-8 rounded-full flex items-center justify-center " + (camp.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600")}>
                  {camp.status === "active" ? <Play size={12} /> : <Pause size={12} />}
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{camp.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#999999]">
                    <span>{camp.platform}</span>
                    <span>•</span>
                    <span>ROAS {camp.roas}x</span>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{camp.revenue.toLocaleString("en-US")} ر.س</p>
                <p className="text-[10px] text-[#999999]">{lang === "ar" ? "إنفاق" : "Spend"}: {camp.spend.toLocaleString("en-US")} ر.س</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Performance */}
      <div className="grid md:grid-cols-3 gap-4">
        {marketingPlatforms.map((p) => (
          <div key={p.name} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center text-sm font-bold">{p.icon}</div>
              <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#666666] dark:text-[#999999] flex items-center gap-1"><DollarSign size={12} /> CPA</span>
                <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.costPerAcquisition} ر.س</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#666666] dark:text-[#999999] flex items-center gap-1"><TrendingUp size={12} /> ROAS</span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400">{p.roas}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#666666] dark:text-[#999999] flex items-center gap-1"><Target size={12} /> CVR</span>
                <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.conversionRate}%</span>
              </div>
              <div className="pt-3 border-t border-[#D4D4D4] dark:border-[#333333]">
                <div className="flex justify-between">
                  <span className="text-xs text-[#999999]">{lang === "ar" ? "الإنفاق" : "Spend"}</span>
                  <span className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.spend.toLocaleString("en-US")} ر.س</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#999999]">{lang === "ar" ? "الإيرادات" : "Revenue"}</span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">{p.revenue.toLocaleString("en-US")} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Best & Worst Campaigns + AI Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-600" />
            {lang === "ar" ? "أفضل الحملات" : "Best Campaigns"}
          </h2>
          <div className="space-y-3">
            {bestCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-[#D4D4D4] dark:border-[#333333] last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p>
                  <p className="text-[10px] text-[#999999]">{c.platform} • ROAS {c.roas}x</p>
                </div>
                <span className="text-xs font-bold text-green-600">{c.revenue.toLocaleString("en-US")} ر.س</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-[#DC2626]" />
            {lang === "ar" ? "أسوأ الحملات" : "Worst Campaigns"}
          </h2>
          <div className="space-y-3">
            {worstCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-[#D4D4D4] dark:border-[#333333] last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p>
                  <p className="text-[10px] text-[#999999]">{c.platform} • ROAS {c.roas}x</p>
                </div>
                <div className="text-end">
                  <p className="text-xs font-bold text-[#DC2626]">{c.revenue.toLocaleString("en-US")} ر.س</p>
                  <p className="text-[9px] text-[#999999]">{lang === "ar" ? "يوصى بإيقافها" : "Recommend pause"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4 flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            {lang === "ar" ? "اقتراحات AI" : "AI Suggestions"}
          </h2>
          <div className="space-y-3">
            {[
              { text: lang === "ar" ? "زيادة ميزانية Google Ads بنسبة 20% لتحسين الأداء" : "Increase Google Ads budget by 20% to improve performance", type: "positive" },
              { text: lang === "ar" ? "إيقاف حملة TikTok مؤقتاً لانخفاض العائد" : "Pause TikTok campaign due to low ROAS", type: "negative" },
              { text: lang === "ar" ? "استهداف الجمهور في أوقات المساء لزيادة التحويل" : "Target evening hours for higher conversion", type: "suggestion" },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333]">
                <div className="flex items-start gap-2">
                  <span className={"text-[10px] font-bold px-1.5 py-0.5 mt-0.5 " + (s.type === "positive" ? "bg-green-100 dark:bg-green-900/30 text-green-700" : s.type === "negative" ? "bg-red-100 dark:bg-red-900/30 text-red-700" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700")}>
                    AI
                  </span>
                  <p className="text-xs text-[#666666] dark:text-[#999999]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 h-9 border border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors flex items-center justify-center gap-1">
            <Lightbulb size={14} />
            {lang === "ar" ? "طلب تحليل جديد" : "Request New Analysis"}
          </button>
        </div>
      </div>
    </div>
  )
}
