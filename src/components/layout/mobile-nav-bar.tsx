"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Video, Users, MoreHorizontal, PenTool, Megaphone, Globe, Crown, Settings, MessageCircle } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { cn } from "@/lib/utils"

const primaryItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: { ar: "الرئيسية", en: "Home" } },
  { href: "/meetings", icon: Video, label: { ar: "الاجتماعات", en: "Meetings" } },
  { href: "/community", icon: Users, label: { ar: "المجتمع", en: "Community" } },
]

export function MobileNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {primaryItems.map((item) => {
          const active = isActive(item.href)
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                active
                  ? "text-[#0D0D0D] dark:text-[#F2F2F2]"
                  : "text-[#999999] dark:text-[#666666]"
              )}
            >
              <item.icon size={20} className={active ? "" : ""} />
              <span className="text-[9px] font-medium">{item.label[lang]}</span>
            </button>
          )
        })}
        <button
          onClick={() => router.push("/more")}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
            pathname === "/more" ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#999999] dark:text-[#666666]"
          )}
        >
          <MoreHorizontal size={20} />
          <span className="text-[9px] font-medium">{lang === "ar" ? "المزيد" : "More"}</span>
        </button>
      </div>
    </nav>
  )
}
