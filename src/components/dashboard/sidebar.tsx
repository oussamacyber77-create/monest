"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Video, Users, PenTool, Megaphone, Globe, Settings, Crown, LogOut } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import { MonestLogo } from "@/components/ui/monest-logo"
import { ConfirmModal } from "@/components/ui/confirm-modal"

const mainItems = (lang: string) => [
  { href: "/dashboard", label: lang === "ar" ? "الرئيسية" : "Home", icon: LayoutDashboard },
  { href: "/meetings", label: lang === "ar" ? "الاجتماعات و الأحداث" : "Meetings & Events", icon: Video },
  { href: "/community", label: lang === "ar" ? "الكومينتي" : "Community", icon: Users },
]

const commerceItems = (lang: string) => [
  { href: "/dashboard", label: lang === "ar" ? "الرئيسية" : "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/content", label: lang === "ar" ? "مركز المحتوى" : "Content Center", icon: PenTool },
  { href: "/dashboard/marketing", label: lang === "ar" ? "مركز التسويق" : "Marketing Center", icon: Megaphone },
  { href: "/dashboard/site", label: lang === "ar" ? "إدارة الموقع" : "Site Management", icon: Globe },
  { href: "/dashboard/plan", label: lang === "ar" ? "الباقة" : "Plan", icon: Crown },
  { href: "/dashboard/settings", label: lang === "ar" ? "الإعدادات" : "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { direction } = useSettingsStore()
  const { logout } = useAuthStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <aside className="w-60 border-e border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] flex flex-col shrink-0 overflow-y-auto hidden md:flex">
        <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
          <button onClick={() => router.push("/")} className="flex items-center gap-2" aria-label="Monest home">
            <MonestLogo width={26} height={26} className="fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
            <span className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">Monest</span>
          </button>
        </div>

        <div className="flex-1 py-3 space-y-5">
          <div>
            <p className="px-4 text-[10px] font-bold text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-1" aria-label={lang === "ar" ? "الرئيسية" : "Main"}>
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
            <p className="px-4 text-[10px] font-bold text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-1" aria-label={lang === "ar" ? "التجارة الخاصة بك" : "Your Commerce"}>
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

        <div className="p-3 border-t border-[#D4D4D4] dark:border-[#333333] space-y-1">
          <button
            onClick={() => router.push("/dashboard/chat")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors rounded-lg"
            aria-label="AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">AI</span>
            </div>
            {lang === "ar" ? "المساعد الذكي" : "AI Assistant"}
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#666666] hover:text-[#DC2626] hover:bg-red-50 dark:text-[#999999] dark:hover:text-[#F87171] dark:hover:bg-red-900/20 transition-colors rounded-lg"
            aria-label="Logout"
          >
            <LogOut size={18} />
            {lang === "ar" ? "تسجيل خروج" : "Logout"}
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title={lang === "ar" ? "تسجيل الخروج" : "Logout"}
        description={lang === "ar" ? "هل أنت متأكد من تسجيل الخروج؟" : "Are you sure you want to logout?"}
        confirmLabel={lang === "ar" ? "تسجيل خروج" : "Logout"}
        cancelLabel={lang === "ar" ? "إلغاء" : "Cancel"}
      />
    </>
  )
}
