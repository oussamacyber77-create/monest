"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Video, Users, PenTool, Megaphone, Globe, Settings, Crown } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { cn } from "@/lib/utils"

const mainItems = (lang: string) => [
  { href: "/dashboard", label: lang === "ar" ? "الرئيسية" : "Home", icon: LayoutDashboard },
  { href: "/meetings", label: lang === "ar" ? "الاجتماعات و الأحداث" : "Meetings & Events", icon: Video },
  { href: "/community", label: lang === "ar" ? "المجتمع" : "Community", icon: Users },
]

const commerceItems = (lang: string) => [
  { href: "/dashboard/content", label: lang === "ar" ? "مركز المحتوى" : "Content Center", icon: PenTool },
  { href: "/dashboard/marketing", label: lang === "ar" ? "مركز التسويق" : "Marketing Center", icon: Megaphone },
  { href: "/dashboard/site", label: lang === "ar" ? "إدارة الموقع" : "Site Management", icon: Globe },
  { href: "/dashboard/plan", label: lang === "ar" ? "الباقة" : "Plan", icon: Crown },
  { href: "/dashboard/settings", label: lang === "ar" ? "الإعدادات" : "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-48 border-e border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] flex flex-col shrink-0 overflow-y-auto hidden md:flex">
      <div className="flex-1 py-3 space-y-5">
        <div>
          <p className="px-4 text-[10px] font-bold text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-1">
            {lang === "ar" ? "الرئيسية" : "Main"}
          </p>
          {mainItems(lang).map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all border-e-2",
                isActive(item.href)
                  ? "bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10 text-[#0D0D0D] dark:text-[#F2F2F2] border-e-[#0D0D0D] dark:border-e-[#F2F2F2]"
                  : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] border-e-transparent"
              )}
              aria-label={item.label}
            >
              <item.icon size={18} className={isActive(item.href) ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : ""} />
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-1">
            {lang === "ar" ? "التجارة الخاصة بك" : "Your Commerce"}
          </p>
          {commerceItems(lang).map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all border-e-2",
                isActive(item.href)
                  ? "bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10 text-[#0D0D0D] dark:text-[#F2F2F2] border-e-[#0D0D0D] dark:border-e-[#F2F2F2]"
                  : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] border-e-transparent"
              )}
              aria-label={item.label}
            >
              <item.icon size={18} className={isActive(item.href) ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : ""} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
