"use client"

import { useRouter } from "next/navigation"
import { PenTool, Megaphone, Globe, Crown, Settings, MessageCircle, ArrowLeft } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

const items = [
  { href: "/dashboard/content", icon: PenTool, label: { ar: "مركز المحتوى", en: "Content Center" } },
  { href: "/dashboard/marketing", icon: Megaphone, label: { ar: "مركز التسويق", en: "Marketing Center" } },
  { href: "/dashboard/site", icon: Globe, label: { ar: "إدارة الموقع", en: "Site Management" } },
  { href: "/dashboard/plan", icon: Crown, label: { ar: "الباقة", en: "Plan" } },
  { href: "/dashboard/settings", icon: Settings, label: { ar: "الإعدادات", en: "Settings" } },
  { href: "/dashboard/chat", icon: MessageCircle, label: { ar: "المساعد الذكي", en: "AI Assistant" } },
]

export default function MorePage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="min-h-full bg-[#F2F2F2] dark:bg-[#0D0D0D] md:hidden">
      <div className="flex items-center gap-3 p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
        <button onClick={() => router.back()} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
          {lang === "ar" ? "المزيد" : "More"}
        </h1>
      </div>
      <div className="p-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors text-start"
          >
            <div className="w-9 h-9 bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center">
              <item.icon size={18} className="text-[#666666] dark:text-[#999999]" />
            </div>
            {item.label[lang]}
          </button>
        ))}
      </div>
    </div>
  )
}
