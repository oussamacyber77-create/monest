"use client"

import { X, MessageSquare, Bell } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { mockLeads, type MockLead } from "@/lib/mock-data/crm"

interface ActivityLogModalProps {
  lead: MockLead
  onClose: () => void
}

export function ActivityLogModal({ lead, onClose }: ActivityLogModalProps) {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "سجل التواصل" : "Activity Log"}
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#999999] mt-0.5">{lead.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {lead.activityLog.length === 0 ? (
            <p className="text-sm text-[#999999] dark:text-[#666666] text-center py-8">
              {lang === "ar" ? "لا توجد نشاطات مسجلة" : "No activity recorded"}
            </p>
          ) : (
            lead.activityLog.map((log, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5">
                  {log.type === "system" ? (
                    <Bell size={14} className="text-[#999999]" />
                  ) : (
                    <MessageSquare size={14} className="text-[#666666]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{log.message}</p>
                  <p className="text-xs text-[#999999] dark:text-[#666666] mt-0.5">{log.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
