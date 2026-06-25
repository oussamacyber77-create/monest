"use client"

import { useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Brain, Users, Package, Megaphone, Archive, TrendingUp, MessageCircle, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

const items = (lang: string) => [
  { href: "/dashboard", label: lang === "ar" ? "لوحة المعلومات" : "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/executive", label: lang === "ar" ? "التقارير التنفيذية" : "Executive", icon: Brain },
  { href: "/dashboard/customers", label: lang === "ar" ? "مركز العملاء" : "Customers", icon: Users },
  { href: "/dashboard/products", label: lang === "ar" ? "مركز المنتجات" : "Products", icon: Package },
  { href: "/dashboard/marketing", label: lang === "ar" ? "مركز التسويق" : "Marketing", icon: Megaphone },
  { href: "/dashboard/inventory", label: lang === "ar" ? "مركز المخزون" : "Inventory", icon: Archive },
  { href: "/dashboard/profits", label: lang === "ar" ? "مركز الأرباح" : "Profits", icon: TrendingUp },
  { href: "/dashboard/settings/permissions", label: lang === "ar" ? "الصلاحيات" : "Permissions", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { direction, theme } = useSettingsStore()
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

  return (
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
            <button
              onClick={() => router.push(item.href)}
              className={cn(
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
      </div>
    </aside>
  )
}
