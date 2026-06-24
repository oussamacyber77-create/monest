"use client"

import Link from "next/link"
import { AdminGuard } from "@/components/layout/admin-guard"
import { usePathname } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { cn } from "@/lib/utils"

const adminLinks = (lang: string) => [
  { href: "/meetings/admin/create", label: lang === "ar" ? "إنشاء اجتماع" : "Create Meeting" },
  { href: "/meetings/admin/history", label: lang === "ar" ? "السجل" : "History" },
  { href: "/meetings/admin/settings", label: lang === "ar" ? "الإعدادات" : "Settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { direction, theme } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <AdminGuard>
      <div className="flex-1 flex flex-col">
        <div className="border-b border-[#D4D4D4] dark:border-[#333333] bg-[#F2F2F2] dark:bg-[#0D0D0D]">
          <div className="flex gap-1 px-4 max-w-4xl mx-auto">
            {adminLinks(lang).map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                    isActive
                      ? "border-[#0D0D0D] dark:border-[#F2F2F2] text-[#0D0D0D] dark:text-[#F2F2F2]"
                      : "border-transparent text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
        {children}
      </div>
    </AdminGuard>
  )
}
