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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("email")
    setTimeout(() => {
      router.push("/dashboard")
    }, 600)
  }

  const handleLogin = (provider: string) => {
    setLoading(provider)
    setTimeout(() => {
<<<<<<< HEAD
      loginAsMember()
      const redirect = searchParams.get("redirect") || "/member/home"
      router.replace(redirect)
=======
      router.push("/dashboard")
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
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

<<<<<<< HEAD
      <div className="space-y-3">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => handleLogin(p.id)}
            disabled={loading !== ""}
            className="w-full h-13 flex items-center justify-center gap-3 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
=======
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email address"}
            required
            className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
            required
            className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors"
          />
          <button
            type="submit"
            disabled={loading !== ""}
            className="w-full h-12 flex items-center justify-center bg-[#0D0D0D] dark:bg-[#F2F2F2] text-sm font-medium text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading === "email" ? (
              <div className="w-4 h-4 border-2 border-[#D4D4D4] border-t-[#0D0D0D] dark:border-[#333333] dark:border-t-[#F2F2F2] animate-spin" />
            ) : (
              lang === "ar" ? "تسجيل الدخول" : "Login"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#D4D4D4] dark:bg-[#333333]" />
          <span className="text-xs text-[#999999]">{lang === "ar" ? "أو" : "or"}</span>
          <div className="flex-1 h-px bg-[#D4D4D4] dark:bg-[#333333]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                  {p.id === "google" && (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {p.id === "microsoft" && (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <rect x="2" y="2" width="9" height="9" fill="#F25022"/>
                      <rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
                      <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
                      <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
                    </svg>
                  )}
                  {p.id === "discord" && (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#5865F2">
                      <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  )}
                  {p.id === "salla" && (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#E9544B" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z"/>
                    </svg>
                  )}
                  {p.name}
                </>
              )}
            </button>
          ))}
        </div>

        <div className="text-center space-y-3">
          <Link
            href="/auth/forgot-password"
            className="block text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
          >
            {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>
          <Link
            href="/register"
            className="block text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
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
