"use client"

import { useSettingsStore } from "@/stores/settings-store"
import { Globe, Palette, Search, Code } from "lucide-react"

const sections = [
  { icon: Palette, label: { ar: "المظهر", en: "Appearance" }, desc: { ar: "تخصيص ألوان وشكل المتجر", en: "Customize store colors and layout" } },
  { icon: Search, label: { ar: "تحسين محركات البحث SEO", en: "SEO" }, desc: { ar: "إعدادات تحسين الظهور في البحث", en: "Search engine optimization settings" } },
  { icon: Code, label: { ar: "الشيفرة المخصصة", en: "Custom Code" }, desc: { ar: "إضافة CSS و JS مخصص", en: "Add custom CSS and JS" } },
  { icon: Globe, label: { ar: "النطاق", en: "Domain" }, desc: { ar: "إدارة النطاق والروابط", en: "Manage domain and URLs" } },
]

export default function SiteManagementPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "إدارة الموقع" : "Site Management"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إعدادات وتحكم كامل في متجرك" : "Full control and settings for your store"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <button key={s.label.en} className="p-6 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors text-start flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <s.icon size={22} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">{s.label[lang]}</p>
              <p className="text-xs text-[#999999]">{s.desc[lang]}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
