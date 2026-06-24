"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Eye } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { StatsCards } from "@/components/crm/stats-cards"
import { mockStats, mockLeads, stageDescriptions, type LeadStage } from "@/lib/mock-data/crm"
import { GuidedTour } from "@/components/tour/guided-tour"
import { HelpButton } from "@/components/tour/help-button"
import { crmTourSteps } from "@/components/tour/tour-steps"

const stageOrder: LeadStage[] = ["name", "phone", "otp", "package", "schedule", "payment"]

export default function CrmPage() {
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("tour-crm")) setShowTour(true)
  }, [])

  const stageCounts = stageOrder.map((s) => {
    const count = mockLeads.filter((l) => l.lastStage === s).length
    return { stage: s, label: stageDescriptions[s][lang], count }
  })

  const maxCount = Math.max(...stageCounts.map((s) => s.count), 1)
  const recentLeads = mockLeads.sort((a, b) => b.lastActivity.localeCompare(a.lastActivity)).slice(0, 5)

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
              {lang === "ar" ? "لوحة CRM" : "CRM Dashboard"}
            </h1>
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "تتبع العملاء والتسجيل الناقص" : "Track customers & incomplete registrations"}
            </p>
          </div>

        </div>

        <div id="tour-crm-stats"><StatsCards stats={mockStats} /></div>

        <div id="tour-crm-stage-chart" className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
              {lang === "ar" ? "توزيع العملاء حسب المرحلة" : "Customers by Stage"}
            </h2>
            <div className="space-y-3" dir="ltr">
              {stageCounts.map((s) => (
                <div key={s.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#0D0D0D] dark:text-[#F2F2F2]">{s.label}</span>
                    <span className="text-[#666666] dark:text-[#999999]">{s.count}</span>
                  </div>
                  <div className="h-2 bg-[#E8E8E8] dark:bg-[#333333] relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 start-0 bg-[#0D0D0D] dark:bg-[#F2F2F2] transition-all"
                      style={{ width: (s.count / maxCount) * 100 + "%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
              {lang === "ar" ? "التسجيلات اليومية (آخر 7 أيام)" : "Daily Registrations (Last 7 Days)"}
            </h2>
            <svg viewBox="0 0 280 140" className="w-full h-auto" style={{ direction: "ltr" }}>
              {[6, 4, 3, 5, 2, 4, 3].map((val, i) => {
                const x = 20 + i * 37
                const barH = (val / 6) * 100
                const y = 120 - barH
                return (
                  <g key={i}>
                    <rect x={x} y={y} width="22" height={barH} fill="currentColor" className="text-[#0D0D0D] dark:text-[#F2F2F2]" opacity="0.8" />
                    <text x={x + 11} y={y - 5} textAnchor="middle" fontSize="8" fill="#999999">{val}</text>
                  </g>
                )
              })}
            </svg>
            <div className="flex justify-between text-[10px] text-[#999999] dark:text-[#666666] mt-1" dir="ltr">
              <span>18/6</span><span>19/6</span><span>20/6</span><span>21/6</span><span>22/6</span><span>23/6</span><span>24/6</span>
            </div>
          </div>
        </div>

        <div id="tour-crm-recent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "آخر العملاء" : "Recent Leads"}
            </h2>
            <button
              onClick={() => router.push("/crm/leads")}
              className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
            >
              <Eye size={14} />
              {lang === "ar" ? "عرض الكل" : "View All"}
            </button>
          </div>
          <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4 flex items-center gap-4 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                <div className="w-10 h-10 bg-[#E8E8E8] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center shrink-0">
                  <Users size={16} className="text-[#666666] dark:text-[#999999]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{lead.name}</p>
                  <div className="flex items-center gap-3 text-xs text-[#666666] dark:text-[#999999] mt-0.5">
                    <span>{stageDescriptions[lead.lastStage][lang]}</span>
                    {lead.selectedPackage && <span>{lead.selectedPackage}</span>}
                    <span>{lead.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HelpButton onClick={() => setShowTour(true)} />
      {showTour && (
        <GuidedTour
          steps={crmTourSteps}
          onComplete={() => { sessionStorage.setItem("tour-crm", "1"); setShowTour(false) }}
          onSkip={() => { sessionStorage.setItem("tour-crm", "1"); setShowTour(false) }}
        />
      )}
    </div>
  )
}
