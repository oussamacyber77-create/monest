"use client"

import { useSettingsStore } from "@/stores/settings-store"
import { marketingPlatforms, bestCampaigns, worstCampaigns } from "@/lib/mock-data/dashboard"
import { TrendingUp, TrendingDown, Megaphone } from "lucide-react"

export default function MarketingPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "مركز التسويق" : "Marketing Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "تحليل وإدارة الحملات التسويقية" : "Campaign analysis & management"}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        {marketingPlatforms.map((p) => (
          <div key={p.name} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center text-sm font-bold">{p.icon}</div>
              <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "تكلفة الاكتساب" : "CPA"}</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.costPerAcquisition} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666] dark:text-[#999999]">ROAS</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.roas}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "معدل التحويل" : "CVR"}</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.conversionRate}%</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D4D4D4] dark:border-[#333333]">
                <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الإنفاق" : "Spend"}</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.spend.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الإيرادات" : "Revenue"}</span>
                <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.revenue.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-600" />
            {lang === "ar" ? "أفضل الحملات" : "Best Campaigns"}
          </h2>
          <div className="space-y-3">
            {bestCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p>
                  <p className="text-xs text-[#999999]">{c.platform} • ROAS {c.roas}x</p>
                </div>
                <span className="text-xs text-green-600">{c.revenue.toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-[#DC2626]" />
            {lang === "ar" ? "أسوأ الحملات" : "Worst Campaigns"}
          </h2>
          <div className="space-y-3">
            {worstCampaigns.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p>
                  <p className="text-xs text-[#999999]">{c.platform} • ROAS {c.roas}x</p>
                </div>
                <div className="text-end">
                  <p className="text-xs text-[#DC2626]">{c.revenue.toLocaleString()} ر.س</p>
                  <p className="text-[10px] text-[#999999]">{lang === "ar" ? "يوصى بإيقافها" : "Recommend pause"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
