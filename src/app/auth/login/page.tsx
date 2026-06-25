"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MonestLogo } from "@/components/ui/monest-logo"
import { GoogleIcon } from "@/components/ui/google-icon"
import { MicrosoftIcon } from "@/components/ui/microsoft-icon"
import { DiscordIcon } from "@/components/ui/discord-icon"
import { SallaIcon } from "@/components/ui/salla-icon"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"

const providers = [
  { id: "google", name: "Google" },
  { id: "microsoft", name: "Microsoft" },
  { id: "discord", name: "Discord" },
  { id: "salla", name: "Salla" },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { direction } = useSettingsStore()
  const { role, checkSession, loginAsMember } = useAuthStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [loading, setLoading] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminError, setAdminError] = useState("")
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (role === "member" || role === "admin") {
      router.replace("/member/home")
    }
  }, [role])

  const handleLogin = (provider: string) => {
    setLoading(provider)
    setTimeout(() => {
      loginAsMember()
      const redirect = searchParams.get("redirect") || "/member/home"
      router.replace(redirect)
    }, 600)
  }

  const handleAdminLogin = async () => {
    setAdminLoading(true)
    setAdminError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const { loginAsAdmin } = useAuthStore.getState()
        loginAsAdmin()
        const redirect = searchParams.get("redirect") || "/member/home"
        router.replace(redirect)
      } else {
        setAdminError(lang === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password")
      }
    } catch {
      setAdminError(lang === "ar" ? "حدث خطأ في الاتصال" : "Connection error")
    }
    setAdminLoading(false)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <MonestLogo width={48} height={48} className="mx-auto mb-4 fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
          {lang === "ar" ? "سجّل دخولك إلى مجتمع Monest" : "Login to Your Monest Account"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "للدخول إلى مساحة عضويتك" : "To access your membership space"}
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
                {p.id === "google" && <GoogleIcon size={20} />}
                {p.id === "microsoft" && <MicrosoftIcon size={20} />}
                {p.id === "discord" && <DiscordIcon size={20} />}
                {p.id === "salla" && <SallaIcon size={20} />}
                {p.name}
              </>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#D4D4D4] dark:border-[#333333]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#F2F2F2] dark:bg-[#0D0D0D] px-3 text-[#999999]">
            {lang === "ar" ? "أو" : "or"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#666666] dark:text-[#999999] mb-1.5">
            {lang === "ar" ? "البريد الإلكتروني" : "Email"}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@monest.com"
            className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#666666] dark:text-[#999999] mb-1.5">
            {lang === "ar" ? "كلمة المرور" : "Password"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
          />
        </div>
        {adminError && (
          <p className="text-xs text-[#DC2626]">{adminError}</p>
        )}
        <button
          onClick={handleAdminLogin}
          disabled={!email || !password || adminLoading}
          className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {adminLoading ? (
            <div className="w-4 h-4 border-2 border-[#F2F2F2] border-t-transparent dark:border-[#0D0D0D] dark:border-t-transparent animate-spin" />
          ) : (
            lang === "ar" ? "تسجيل الدخول" : "Login"
          )}
        </button>
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
  )
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
