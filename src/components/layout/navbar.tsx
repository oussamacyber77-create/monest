"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, Languages, User, LogOut, Menu, X } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import { MonestLogo } from "@/components/ui/monest-logo"
import { ConfirmModal } from "@/components/ui/confirm-modal"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { direction, theme, toggleDirection, toggleTheme } = useSettingsStore()
  const { user, isAdmin, isLoading, logout, initialize } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => { setMounted(true); initialize() }, [initialize])

  // Hide navbar on meeting join/waiting/room pages
  if (pathname.startsWith("/meetings/join/") || pathname.startsWith("/meetings/waiting/") || pathname.startsWith("/meetings/room/")) {
    return null
  }

  const links = [
    { href: "/meetings", label: { ar: "الاجتماعات", en: "Meetings" } },
    { href: "/crm", label: { ar: "CRM", en: "CRM" } },
    { href: "/monest", label: { ar: "AI Commerce", en: "AI Commerce" } },
  ]

  const lang = direction === "rtl" ? "ar" : "en"

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <header
        dir={direction}
        className={cn(
          "h-14 border-b flex items-center px-4 md:px-8 sticky top-0 z-50 transition-colors",
          theme === "light"
            ? "bg-[#F2F2F2] border-[#D4D4D4]"
            : "bg-[#0D0D0D] border-[#333333]"
        )}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Monest home">
          <MonestLogo width={28} height={28} className="fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <span className="text-lg font-bold tracking-tight text-[#0D0D0D] dark:text-[#F2F2F2]">
            Monest
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 mx-auto" aria-label="Main navigation">
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
          {mounted && !isLoading && (
            <>
              {isAdmin ? (
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
                    aria-label="My account dashboard"
                  >
                    <User size={14} />
                    {lang === "ar" ? "حسابي" : "My Account"}
                  </Link>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="px-3 py-1.5 text-xs font-medium bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-90 transition-opacity flex items-center gap-1.5"
                    aria-label="Logout"
                  >
                    <LogOut size={14} />
                    {lang === "ar" ? "تسجيل خروج" : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1">
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
                </div>
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
              <span className="text-xs font-bold mr-1">{lang === "ar" ? "EN" : "AR"}</span>
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

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 transition-colors",
              theme === "light"
                ? "text-[#666666] hover:text-[#0D0D0D]"
                : "text-[#999999] hover:text-[#F2F2F2]"
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden border-b z-40",
            theme === "light"
              ? "bg-[#F2F2F2] border-[#D4D4D4]"
              : "bg-[#0D0D0D] border-[#333333]"
          )}
        >
          <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors",
                    theme === "light"
                      ? isActive ? "bg-[#0D0D0D] text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E0E0E0]"
                      : isActive ? "bg-[#F2F2F2] text-[#0D0D0D]" : "text-[#999999] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]"
                  )}
                >
                  {link.label[lang] || link.label.en}
                </Link>
              )
            })}
            <hr className={cn("my-2", theme === "light" ? "border-[#D4D4D4]" : "border-[#333333]")} />
            {isAdmin ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]"
                >
                  <User size={16} />
                  {lang === "ar" ? "حسابي" : "My Account"}
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true) }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-900/20 text-start"
                >
                  <LogOut size={16} />
                  {lang === "ar" ? "تسجيل خروج" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]"
                >
                  {lang === "ar" ? "تسجيل الدخول" : "Login"}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-center"
                >
                  {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

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
