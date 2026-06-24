"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Brain, Users, Package, Megaphone, Archive, TrendingUp, MessageCircle, Settings, LogOut, Store } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import { MonestLogo } from "@/components/ui/monest-logo"

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

  return (
    <aside className="w-56 border-e border-[#D4D4D4] dark:border-[#333333] bg-[#F2F2F2] dark:bg-[#0D0D0D] flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
        <button onClick={() => router.push("/")} className="flex items-center gap-2">
          <MonestLogo width={24} height={24} className="fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <span className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">Monest</span>
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items(lang).map((item) => {
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                  : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#D4D4D4] dark:border-[#333333] space-y-1">
        <button
          onClick={() => router.push("/dashboard/chat")}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors"
        >
          <MessageCircle size={18} />
          {lang === "ar" ? "المساعد AI" : "AI Assistant"}
        </button>
        <button
          onClick={() => { logout(); router.push("/admin/login") }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors"
        >
          <LogOut size={18} />
          {lang === "ar" ? "تسجيل خروج" : "Logout"}
        </button>
      </div>
    </aside>
  )
}
