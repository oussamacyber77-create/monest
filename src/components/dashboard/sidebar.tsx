"use client"

import { useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
<<<<<<< HEAD
<<<<<<< HEAD
import { LayoutDashboard, Brain, Users, Package, Megaphone, Archive, TrendingUp, MessageCircle, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
=======
import { LayoutDashboard, Video, Users, PenTool, Megaphone, Globe, Settings, LogOut } from "lucide-react"
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
=======
import { LayoutDashboard, Video, Users, PenTool, Megaphone, Globe, Settings, Crown, LogOut } from "lucide-react"
>>>>>>> 2f176ad86f91d847d681aead14606dbc03c4707f
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

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
  const { direction } = useSettingsStore()
  const { logout } = useAuthStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [collapsed, setCollapsed] = useState(() => sessionStorage.getItem("sidebar-collapsed") === "true")

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      sessionStorage.setItem("sidebar-collapsed", String(next))
      return next
    })
  }, [])

  const buttonClass = (isActive: boolean) =>
    cn(
      "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
        : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]"
    )

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
<<<<<<< HEAD
    <aside
      className={cn(
        "sticky top-0 h-screen border-e border-[#D4D4D4] dark:border-[#333333] bg-[#F2F2F2] dark:bg-[#0D0D0D] flex flex-col shrink-0 overflow-y-auto transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className={cn("flex items-center border-b border-[#D4D4D4] dark:border-[#333333]", collapsed ? "justify-center p-2" : "justify-between p-3")}>
        {!collapsed && (
          <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "القائمة" : "Menu"}
          </span>
        )}
        <button
          onClick={toggle}
          className="text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
          aria-label={collapsed ? (lang === "ar" ? "توسيع القائمة" : "Expand menu") : (lang === "ar" ? "طي القائمة" : "Collapse menu")}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items(lang).map((item) => (
          <div key={item.href} className="relative group">
=======
    <aside className="w-60 border-e border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
        <button onClick={() => router.push("/")} className="flex items-center gap-2">
          <MonestLogo width={26} height={26} className="fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <span className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">Monest</span>
        </button>
      </div>

      <div className="flex-1 py-3 space-y-5">
        <div>
          <p className="px-4 text-[10px] font-bold text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-1">
            {lang === "ar" ? "الرئيسية" : "Main"}
          </p>
          {mainItems(lang).map((item) => (
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
            <button
              onClick={() => router.push(item.href)}
              className={cn(
<<<<<<< HEAD
                buttonClass(isActive(item.href)),
                collapsed ? "justify-center px-0" : ""
              )}
            >
              <item.icon size={18} />
              {!collapsed && item.label}
            </button>
            {collapsed && (
              <div className="absolute start-full top-1/2 -translate-y-1/2 ms-2 px-2 py-1 text-xs whitespace-nowrap bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className={cn("border-t border-[#D4D4D4] dark:border-[#333333] space-y-1", collapsed ? "p-2" : "p-3")}>
        <div className="relative group">
          <button
            onClick={() => router.push("/dashboard/chat")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]",
              collapsed ? "justify-center px-0" : ""
            )}
          >
            <MessageCircle size={18} />
            {!collapsed && (lang === "ar" ? "المساعد AI" : "AI Assistant")}
          </button>
          {collapsed && (
            <div className="absolute end-full top-1/2 -translate-y-1/2 me-2 px-2 py-1 text-xs whitespace-nowrap bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none">
              {lang === "ar" ? "المساعد AI" : "AI Assistant"}
            </div>
          )}
        </div>
        <div className="relative group">
          <button
            onClick={() => { logout(); router.push("/") }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]",
              collapsed ? "justify-center px-0" : ""
            )}
          >
            <LogOut size={18} />
            {!collapsed && (lang === "ar" ? "تسجيل خروج" : "Logout")}
          </button>
          {collapsed && (
            <div className="absolute end-full top-1/2 -translate-y-1/2 me-2 px-2 py-1 text-xs whitespace-nowrap bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none">
              {lang === "ar" ? "تسجيل خروج" : "Logout"}
            </div>
          )}
        </div>
=======
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all border-e-2",
                isActive(item.href)
                  ? "bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10 text-[#0D0D0D] dark:text-[#F2F2F2] border-e-[#0D0D0D] dark:border-e-[#F2F2F2]"
                  : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] border-e-transparent"
              )}
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
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          {lang === "ar" ? "المساعد الذكي" : "AI Assistant"}
        </button>
        <button
          onClick={() => { logout(); router.push("/auth/login") }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#666666] hover:text-[#DC2626] hover:bg-red-50 dark:text-[#999999] dark:hover:text-[#F87171] dark:hover:bg-red-900/20 transition-colors rounded-lg"
        >
          <LogOut size={18} />
          {lang === "ar" ? "تسجيل خروج" : "Logout"}
        </button>
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
      </div>
    </aside>
  )
}
