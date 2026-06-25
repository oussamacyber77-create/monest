"use client"

import { useState } from "react"
import Link from "next/link"
import { MonestLogo } from "@/components/ui/monest-logo"
import { useSettingsStore } from "@/stores/settings-store"

export default function ForgotPasswordPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <MonestLogo width={48} height={48} className="mx-auto mb-4 fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {lang === "ar" ? "نسيت كلمة المرور" : "Forgot Password"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar"
              ? "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 dark:text-green-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar"
                ? "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني"
                : "Reset link sent to your email"}
            </p>
            <Link
              href="/auth/login"
              className="block text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
            >
              {lang === "ar" ? "العودة إلى تسجيل الدخول" : "Back to login"}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email address"}
              required
              className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors"
            />
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center bg-[#0D0D0D] dark:bg-[#F2F2F2] text-sm font-medium text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-80 transition-opacity"
            >
              {lang === "ar" ? "إرسال رابط إعادة التعيين" : "Send Reset Link"}
            </button>
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                {lang === "ar" ? "تذكّرت كلمة المرور؟ سجّل دخول" : "Remember your password? Login"}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
