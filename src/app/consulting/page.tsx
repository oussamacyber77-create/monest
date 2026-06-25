"use client"

import { useRouter } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { MonestLogo } from "@/components/ui/monest-logo"
import { useSettingsStore } from "@/stores/settings-store"

export default function ConsultingPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="w-full max-w-md text-center space-y-6">
        <MonestLogo width={64} height={64} className="mx-auto text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
        <div className="mx-auto w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <MessageCircle size={32} className="text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
          {lang === "ar" ? "قريباً — الاستشارات" : "Coming Soon — Consulting"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar"
            ? "خدمة الاستشارات المتخصصة في التجارة الإلكترونية قادمة قريباً"
            : "Specialized e-commerce consulting service coming soon"}
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {lang === "ar" ? "العودة إلى الرئيسية" : "Back to Home"}
        </button>
      </div>
    </div>
  )
}
