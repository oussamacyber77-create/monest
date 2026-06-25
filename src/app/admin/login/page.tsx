"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { useAuthStore } from "@/stores/auth-store"
import { MonestLogo } from "@/components/ui/monest-logo"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { direction } = useSettingsStore()
  const { role, checkSession, loginAsAdmin } = useAuthStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (role === "admin") {
      router.replace("/dashboard")
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError(lang === "ar" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      loginAsAdmin()
      const redirect = searchParams.get("redirect") || "/dashboard"
      router.replace(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === "ar" ? "فشل تسجيل الدخول" : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <MonestLogo width={48} height={48} className="text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
        </div>
        <h1 className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "دخول الأدمن" : "Admin Login"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "لوحة التحكم والإدارة" : "Dashboard & Management"}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]">
          <p className="text-sm text-[#DC2626] font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5">
            {lang === "ar" ? "البريد الإلكتروني" : "Email"}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
            placeholder="admin@monest.com"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5">
            {lang === "ar" ? "كلمة المرور" : "Password"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 dark:border-[#0D0D0D]/30 border-t-[#F2F2F2] dark:border-t-[#0D0D0D] animate-spin" />
        ) : lang === "ar" ? (
          "دخول"
        ) : (
          "Login"
        )}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
          </div>
        }>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
