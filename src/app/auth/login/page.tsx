"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MonestLogo } from "@/components/ui/monest-logo"
import { useSettingsStore } from "@/stores/settings-store"

const providers = [
  { id: "google", name: "Google" },
  { id: "microsoft", name: "Microsoft" },
  { id: "discord", name: "Discord" },
  { id: "salla", name: "Salla" },
]

export default function LoginPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [loading, setLoading] = useState("")

  const handleLogin = (provider: string) => {
    setLoading(provider)
    setTimeout(() => {
      router.push("/auth/pricing")
    }, 600)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <MonestLogo width={48} height={48} className="mx-auto mb-4 fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {lang === "ar" ? "سجّل دخولك لمنصة Monest" : "Login to Monest Platform"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "لإدارة متجرك بالذكاء الاصطناعي" : "To manage your store with AI"}
          </p>
        </div>

        <div className="space-y-3">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => handleLogin(p.id)}
              disabled={loading !== ""}
              className="w-full h-13 flex items-center justify-center gap-3 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              {loading === p.id ? (
                <div className="w-4 h-4 border-2 border-[#D4D4D4] border-t-[#0D0D0D] dark:border-[#333333] dark:border-t-[#F2F2F2] animate-spin" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {p.id === "google" && <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></>}
                    {p.id === "microsoft" && <><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></>}
                    {p.id === "discord" && <><path d="M8 5h8M6 9h12M7 13h10M8 17h8M10 5v12M14 5v12"/><path d="M6 9l2 8M18 9l-2 8"/></>}
                    {p.id === "salla" && <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>}
                  </svg>
                  {p.name}
                </>
              )}
            </button>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
          >
            {lang === "ar" ? "ليس لديك حساب؟ سجّل الآن" : "Don't have an account? Register now"}
          </Link>
        </div>
      </div>
    </div>
  )
}
