"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { ToggleSwitch } from "@/components/ui/toggle-switch"

const settingDefs = (lang: string) => [
  { key: "allowRecording", label: lang === "ar" ? "السماح بالتسجيل" : "Allow Recording", desc: lang === "ar" ? "تمكين المشاركين من تسجيل الاجتماع" : "Allow participants to record the meeting" },
  { key: "allowScreenShare", label: lang === "ar" ? "مشاركة الشاشة" : "Screen Sharing", desc: lang === "ar" ? "السماح للمشاركين بمشاركة شاشاتهم" : "Allow participants to share their screen" },
  { key: "allowChat", label: lang === "ar" ? "الدردشة" : "Chat", desc: lang === "ar" ? "تمكين الدردشة بين المشاركين" : "Enable chat between participants" },
  { key: "allowFileUpload", label: lang === "ar" ? "رفع الملفات" : "File Upload", desc: lang === "ar" ? "السماح برفع الملفات في الدردشة" : "Allow file uploads in chat" },
  { key: "videoQuality", label: lang === "ar" ? "جودة فيديو عالية" : "HD Video", desc: lang === "ar" ? "تشغيل الفيديو بجودة عالية (مزيد من البيانات)" : "Stream video in high quality (more bandwidth)" },
  { key: "muteOnJoin", label: lang === "ar" ? "كتم الصوت عند الانضمام" : "Mute on Join", desc: lang === "ar" ? "كتم صوت المشاركين الجدد تلقائياً" : "Automatically mute new participants" },
  { key: "allowParticipantAdd", label: lang === "ar" ? "إضافة مشاركين" : "Add Participants", desc: lang === "ar" ? "السماح بإضافة مشاركين جدد أثناء الاجتماع" : "Allow adding new participants during the meeting" },
]

export default function AdminSettingsPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [settings, setSettings] = useState<Record<string, boolean>>({
    allowRecording: true,
    allowScreenShare: true,
    allowChat: true,
    allowFileUpload: false,
    videoQuality: true,
    muteOnJoin: true,
    allowParticipantAdd: true,
  })

  const toggle = (key: string) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }))
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "إعدادات الاجتماع" : "Meeting Settings"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "الصلاحيات الافتراضية للاجتماعات" : "Default permissions for meetings"}
          </p>
        </div>

        <div className="space-y-1">
          {settingDefs(lang).map(({ key, label, desc }) => (
            <label
              key={key}
              className="flex items-center justify-between px-5 py-4 border-b border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            >
              <div>
                <span className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{label}</span>
                <p className="text-xs text-[#999999] dark:text-[#666666] mt-0.5">{desc}</p>
              </div>
              <ToggleSwitch checked={settings[key]} onChange={() => toggle(key)} />
            </label>
          ))}
        </div>

        <p className="text-xs text-[#999999] dark:text-[#666666] mt-6 text-center">
          {lang === "ar" ? "يتم تطبيق الإعدادات على الاجتماعات الجديدة فقط" : "Settings apply to new meetings only"}
        </p>
      </div>
    </div>
  )
}
