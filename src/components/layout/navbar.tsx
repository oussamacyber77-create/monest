"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, Languages, User, LogOut } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import { MonestLogo } from "@/components/ui/monest-logo"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { direction, theme, toggleDirection, toggleTheme } = useSettingsStore()
  const { isAdmin, logout, checkSession } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); checkSession() }, [checkSession])

  const links = [
    { href: "/meetings", label: { ar: "الاجتماعات", en: "Meetings" } },
    { href: "/crm", label: { ar: "CRM", en: "CRM" } },
    { href: "/monest", label: { ar: "AI Commerce", en: "AI Commerce" } },
  ]

  const lang = direction === "rtl" ? "ar" : "en"

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

      <nav className="flex items-center gap-1 mx-auto">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href)
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

      <div className="flex items-center gap-1">
        {mounted && (
          <>
            {isAdmin ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                >
                  <User size={14} />
                  {lang === "ar" ? "حسابي" : "My Account"}
                </Link>
                <button
                  onClick={() => { logout(); router.push("/auth/login") }}
                  className="px-3 py-1.5 text-xs font-medium bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  {lang === "ar" ? "تسجيل خروج" : "Logout"}
                </button>
              </>
            ) : (
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
                  {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
                </Link>
              </>
            )}
          </>
        )}
        {mounted && (
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
        )}

        {mounted && (
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
        )}
      </div>
    </header>
  )
}
