"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import type { MockStat } from "@/lib/mock-data/crm"

interface StatsCardsProps {
  stats: MockStat[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
          <p className="text-xs text-[#666666] dark:text-[#999999] mb-2">
            {stat.label[lang]}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {stat.value}{stat.suffix || ""}
            </span>
            <span className={"flex items-center gap-0.5 text-xs font-medium mb-1 " + (stat.change >= 0 ? "text-green-600 dark:text-green-400" : "text-[#DC2626]")}>
              {stat.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(stat.change)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
