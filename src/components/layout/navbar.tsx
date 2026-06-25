"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, Languages, LogOut, User, ChevronDown } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import { MonestLogo } from "@/components/ui/monest-logo"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { direction, theme, toggleDirection, toggleTheme } = useSettingsStore()
  const { role, checkSession, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const lang = direction === "rtl" ? "ar" : "en"

  useEffect(() => {
    setMounted(true)
    checkSession()
  }, [])

  if (!mounted) return null

  const guestLinks = [
    { href: "/", label: { ar: "عن المجتمع", en: "About" } },
    { href: "/auth/pricing", label: { ar: "الباقات", en: "Pricing" } },
    { href: "/consulting", label: { ar: "استشارات", en: "Consulting" } },
    { href: "/refund-policy", label: { ar: "الاستبدال والاسترجاع", en: "Returns" } },
  ]

  const memberLinks = [
    { href: "/meetings", label: { ar: "اجتماعاتي", en: "My Meetings" } },
    { href: "/dashboard", label: { ar: "متجري", en: "My Store" } },
  ]

  const adminLinks = [
    { href: "/dashboard", label: { ar: "لوحة التحكم", en: "Dashboard" } },
    { href: "/meetings/admin/create", label: { ar: "الإدارة", en: "Admin" } },
    { href: "/crm", label: { ar: "CRM", en: "CRM" } },
  ]

  const links = role === "admin" ? adminLinks : role === "member" ? memberLinks : guestLinks

  return (
    <header
      dir={direction}
      className={cn(
        "h-14 border-b flex items-center px-4 md:px-8 sticky top-0 z-50 transition-colors",
        theme === "light"
          ? "bg-[#F2F2F2] border-[#D4D4D4]"
          : "bg-[#0D0D0D] border-[#333333]"
      )}
    >
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <MonestLogo width={28} height={28} className="fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
        <span className="text-lg font-bold tracking-tight text-[#0D0D0D] dark:text-[#F2F2F2]">
          Monest
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1 mx-auto">
        {links.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                theme === "light"
                  ? isActive ? "bg-[#0D0D0D] text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E0E0E0]"
                  : isActive ? "bg-[#F2F2F2] text-[#0D0D0D]" : "text-[#999999] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]"
              )}
            >
              {link.label[lang] || link.label.en}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-2">
        {role === "guest" ? (
          <>
            <Link
              href="/auth/login"
              className="px-3 py-1.5 text-xs font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
            >
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 text-xs font-medium bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-90 transition-opacity"
            >
              {lang === "ar" ? "انضم الآن" : "Join Now"}
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors border border-[#D4D4D4] dark:border-[#333333]",
                theme === "light"
                  ? "text-[#666666] hover:text-[#0D0D0D]"
                  : "text-[#999999] hover:text-[#F2F2F2]"
              )}
            >
              <User size={14} />
              <span className="hidden sm:inline">{lang === "ar" ? "حسابي" : "Account"}</span>
              <ChevronDown size={12} />
            </button>
            {showAccountMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                <div className={cn(
                  "absolute top-full mt-1 z-50 w-44 border border-[#D4D4D4] dark:border-[#333333] shadow-lg",
                  theme === "light" ? "bg-[#F2F2F2]" : "bg-[#0D0D0D]"
                )}>
                  <div className="p-3 border-b border-[#D4D4D4] dark:border-[#333333]">
                    <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
                      {role === "admin" ? "Admin" : lang === "ar" ? "عضو" : "Member"}
                    </p>
                  </div>
                  {role === "admin" && (
                    <Link
                      href="/meetings/admin/create"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-2 text-xs text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors"
                    >
                      {lang === "ar" ? "إدارة الاجتماعات" : "Meetings Admin"}
                    </Link>
                  )}
                  {role === "admin" && (
                    <Link
                      href="/crm"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-2 text-xs text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors"
                    >
                      CRM
                    </Link>
                  )}
                  <button
                    onClick={() => { setShowAccountMenu(false); logout(); router.push("/") }}
                    className="w-full text-start px-3 py-2 text-xs text-[#DC2626] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
                  >
                    <LogOut size={12} />
                    {lang === "ar" ? "تسجيل خروج" : "Logout"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <button
          onClick={toggleDirection}
          className={cn(
            "p-2 transition-colors",
            theme === "light"
              ? "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E0E0E0]"
              : "text-[#999999] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]"
          )}
          aria-label="Toggle language"
        >
          <Languages size={18} />
          <span className="text-xs font-bold ml-1">{lang === "ar" ? "EN" : "AR"}</span>
        </button>

        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 transition-colors",
            theme === "light"
              ? "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E0E0E0]"
              : "text-[#999999] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]"
          )}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  )
}
