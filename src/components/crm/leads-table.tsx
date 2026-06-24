"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, MessageCircle, Play, RotateCcw, StickyNote, X, Check } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { mockLeads, type MockLead, type LeadStage, type LeadStatus, type LeadSource, stageDescriptions } from "@/lib/mock-data/crm"
import { ActivityLogModal } from "@/components/crm/activity-log-modal"

interface LeadsTableProps {
  filters: {
    stage: string
    status: string
    package: string
    source: string
    search: string
  }
}

const heatStyles = (heat: string, theme: string) => {
  switch (heat) {
    case "hot": return "bg-[#DC2626]/10 text-[#DC2626]"
    case "warm": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "cold": return "bg-[#E8E8E8] text-[#666666] dark:bg-[#333333] dark:text-[#999999]"
    default: return ""
  }
}

const statusLabels = (s: LeadStatus, lang: string) => {
  const map: Record<LeadStatus, string> = {
    new: lang === "ar" ? "جديد" : "New",
    contacted: lang === "ar" ? "تم التواصل" : "Contacted",
    interested: lang === "ar" ? "مهتم" : "Interested",
    not_interested: lang === "ar" ? "غير مهتم" : "Not Interested",
    completed: lang === "ar" ? "مكتمل" : "Completed",
  }
  return map[s]
}

const sourceLabels = (s: LeadSource, lang: string) => {
  const map: Record<LeadSource, string> = {
    direct: lang === "ar" ? "رابط مباشر" : "Direct",
    whatsapp: lang === "ar" ? "واتساب" : "WhatsApp",
    ad: lang === "ar" ? "إعلان" : "Ad",
  }
  return map[s]
}

export function LeadsTable({ filters }: LeadsTableProps) {
  const { direction, theme } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeLog, setActiveLog] = useState<MockLead | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showNoteInput, setShowNoteInput] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  const filtered = mockLeads.filter((lead) => {
    if (filters.stage && lead.lastStage !== filters.stage) return false
    if (filters.status && lead.status !== filters.status) return false
    if (filters.package && lead.selectedPackage !== filters.package) return false
    if (filters.source && lead.source !== filters.source) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!lead.name.toLowerCase().includes(q) && !lead.phone.includes(q)) return false
    }
    return true
  })

  const heatLabels = (h: string, lang: string) => {
    const map: Record<string, string> = { hot: lang === "ar" ? "ساخن" : "Hot", warm: lang === "ar" ? "متوسط" : "Warm", cold: lang === "ar" ? "بارد" : "Cold" }
    return map[h] || h
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleResume = (lead: MockLead) => {
    router.push("/register?continueFrom=" + lead.id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#D4D4D4] dark:border-[#333333]">
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "الاسم" : "Name"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "الجوال" : "Phone"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "آخر مرحلة" : "Last Stage"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "الباقة" : "Package"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "المصدر" : "Source"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "الجدية" : "Heat"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "الحالة" : "Status"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "المسؤول" : "Assigned"}
            </th>
            <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "الإجراءات" : "Actions"}
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((lead) => (
            <tr key={lead.id} className="border-b border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
              <td className="py-3 px-3">
                <div>
                  <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {lead.name}
                  </span>
                  {notes[lead.id] && (
                    <p className="text-[10px] text-[#999999] mt-0.5 truncate max-w-[120px]">{notes[lead.id]}</p>
                  )}
                </div>
              </td>
              <td className="py-3 px-3 text-[#666666] dark:text-[#999999] text-xs">{lead.phone}</td>
              <td className="py-3 px-3">
                <span className="text-xs px-2 py-0.5 bg-[#E8E8E8] dark:bg-[#333333] text-[#666666] dark:text-[#999999]">
                  {stageDescriptions[lead.lastStage][lang]}
                </span>
              </td>
              <td className="py-3 px-3 text-xs text-[#666666] dark:text-[#999999]">
                {lead.selectedPackage || "—"}
              </td>
              <td className="py-3 px-3 text-xs text-[#666666] dark:text-[#999999]">
                {sourceLabels(lead.source, lang)}
              </td>
              <td className="py-3 px-3">
                <span className={"text-xs px-2 py-0.5 font-medium " + heatStyles(lead.heat, theme)}>
                  {heatLabels(lead.heat, lang)}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className="text-xs text-[#666666] dark:text-[#999999]">
                  {statusLabels(lead.status, lang)}
                </span>
              </td>
              <td className="py-3 px-3 text-xs text-[#666666] dark:text-[#999999]">{lead.assignedTo}</td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1 flex-wrap">
                  <a
                    href={"https://wa.me/" + lead.phone}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#666666] hover:text-green-600 dark:text-[#999999] dark:hover:text-green-400 transition-colors"
                    title={lang === "ar" ? "واتساب" : "WhatsApp"}
                  >
                    <MessageCircle size={14} />
                  </a>
                  <a
                    href={"tel:" + lead.phone}
                    className="p-1.5 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                    title={lang === "ar" ? "اتصال" : "Call"}
                  >
                    <Phone size={14} />
                  </a>
                  <button
                    onClick={() => showToast(lang === "ar" ? "تم إرسال رابط الإكمال!" : "Completion link sent!")}
                    className="p-1.5 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                    title={lang === "ar" ? "إرسال رابط إكمال" : "Send completion link"}
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => handleResume(lead)}
                    className="p-1.5 text-[#666666] hover:text-blue-600 dark:text-[#999999] dark:hover:text-blue-400 transition-colors"
                    title={lang === "ar" ? "أكمل من نفس المكان" : "Resume from here"}
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => setActiveLog(lead)}
                    className="p-1.5 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                    title={lang === "ar" ? "سجل النشاط" : "Activity Log"}
                  >
                    <StickyNote size={14} />
                  </button>
                  {showNoteInput === lead.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-24 h-7 px-2 text-[10px] bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] focus:outline-none"
                        placeholder={lang === "ar" ? "ملاحظة..." : "Note..."}
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (noteText.trim()) setNotes({ ...notes, [lead.id]: noteText.trim() })
                          setShowNoteInput(null)
                          setNoteText("")
                        }}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => setShowNoteInput(null)}
                        className="p-1 text-[#DC2626] hover:text-red-800"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNoteInput(lead.id)}
                      className="p-1.5 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                      title={lang === "ar" ? "إضافة ملاحظة" : "Add note"}
                    >
                      <StickyNote size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={9} className="py-12 text-center text-sm text-[#999999] dark:text-[#666666]">
                {lang === "ar" ? "لا توجد نتائج" : "No results found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {activeLog && <ActivityLogModal lead={activeLog} onClose={() => setActiveLog(null)} />}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] px-5 py-3 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
