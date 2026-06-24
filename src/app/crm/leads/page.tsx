"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { LeadsTable } from "@/components/crm/leads-table"
import { mockLeads, stageDescriptions, type LeadStage, type LeadStatus, type LeadSource } from "@/lib/mock-data/crm"

const stageOptions = ["name", "phone", "otp", "package", "schedule", "payment"] as const
const statusOptions: LeadStatus[] = ["new", "contacted", "interested", "not_interested", "completed"]
const sourceOptions: LeadSource[] = ["direct", "whatsapp", "ad"]
const packageOptions = ["شهري", "3 أشهر", "6 أشهر", "سنوي"]

export default function CrmLeadsPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const [filters, setFilters] = useState({
    stage: "",
    status: "",
    package: "",
    source: "",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = <K extends keyof typeof filters>(key: K, value: string) => {
    setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }))
  }

  const clearFilters = () => {
    setFilters({ stage: "", status: "", package: "", source: "", search: "" })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "")

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "قائمة العملاء" : "Leads List"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "عرض وإدارة جميع العملاء والتسجيلات" : "View and manage all leads & registrations"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder={lang === "ar" ? "بحث بالاسم أو الجوال..." : "Search by name or phone..."}
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full h-10 ps-9 pe-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={"h-10 px-4 text-sm font-medium transition-colors flex items-center gap-2 " + (showFilters || hasActiveFilters
              ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
              : "border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
          >
            <Filter size={14} />
            {lang === "ar" ? "فلتر" : "Filter"}
            {hasActiveFilters && <span className="w-2 h-2 bg-[#DC2626]" />}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-3 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="p-5 border border-[#D4D4D4] dark:border-[#333333] space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  {lang === "ar" ? "المرحلة" : "Stage"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {stageOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter("stage", s)}
                      className={"px-3 py-1.5 text-xs font-medium border transition-colors " + (filters.stage === s
                        ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                        : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
                    >
                      {stageDescriptions[s][lang]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  {lang === "ar" ? "الحالة" : "Status"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter("status", s)}
                      className={"px-3 py-1.5 text-xs font-medium border transition-colors " + (filters.status === s
                        ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                        : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
                    >
                      {s === "new" ? (lang === "ar" ? "جديد" : "New") : s === "contacted" ? (lang === "ar" ? "تم التواصل" : "Contacted") : s === "interested" ? (lang === "ar" ? "مهتم" : "Interested") : s === "not_interested" ? (lang === "ar" ? "غير مهتم" : "Not Interested") : (lang === "ar" ? "مكتمل" : "Completed")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  {lang === "ar" ? "الباقة" : "Package"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {packageOptions.map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter("package", p)}
                      className={"px-3 py-1.5 text-xs font-medium border transition-colors " + (filters.package === p
                        ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                        : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  {lang === "ar" ? "المصدر" : "Source"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {sourceOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter("source", s)}
                      className={"px-3 py-1.5 text-xs font-medium border transition-colors " + (filters.source === s
                        ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                        : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
                    >
                      {s === "direct" ? (lang === "ar" ? "رابط مباشر" : "Direct") : s === "whatsapp" ? (lang === "ar" ? "واتساب" : "WhatsApp") : (lang === "ar" ? "إعلان" : "Ad")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <LeadsTable filters={filters} />
      </div>
    </div>
  )
}
