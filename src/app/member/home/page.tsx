"use client"

import Link from "next/link"
import { useSettingsStore } from "@/stores/settings-store"
import { MemberGuard } from "@/components/layout/member-guard"
import { MonestLogo } from "@/components/ui/monest-logo"
import { Video, Store, ChevronLeft } from "lucide-react"

export default function MemberHomePage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <MemberGuard>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="w-full max-w-lg text-center space-y-10">
          <div className="space-y-4">
            <MonestLogo width={56} height={56} className="mx-auto fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "مرحباً بك في مجتمع Monest" : "Welcome to Monest"}
            </h1>
            <p className="text-[#666666] dark:text-[#999999]">
              {lang === "ar"
                ? "مساحة عضويتك — من هنا تدير اجتماعاتك وتتابع متجرك."
                : "Your membership space — manage your meetings and monitor your store."}
            </p>
          </div>

          <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            <Link
              href="/meetings"
              className="group bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center text-[#0D0D0D] dark:text-[#F2F2F2]">
                  <Video size={24} />
                </div>
                <div className="text-start">
                  <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {lang === "ar" ? "حجز وعرض اجتماعاتي" : "My Meetings"}
                  </h2>
                  <p className="text-sm text-[#666666] dark:text-[#999999]">
                    {lang === "ar" ? "جدولة الاجتماعات الأسبوعية والفردية مع فريق Monest" : "Schedule weekly & individual meetings with the Monest team"}
                  </p>
                </div>
              </div>
              <ChevronLeft size={20} className="text-[#999999] group-hover:text-[#0D0D0D] dark:group-hover:text-[#F2F2F2] transition-colors" />
            </Link>
            <Link
              href="/dashboard"
              className="group bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center text-[#0D0D0D] dark:text-[#F2F2F2]">
                  <Store size={24} />
                </div>
                <div className="text-start">
                  <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {lang === "ar" ? "متابعة متجري" : "My Store"}
                  </h2>
                  <p className="text-sm text-[#666666] dark:text-[#999999]">
                    {lang === "ar" ? "ربط ومتابعة أداء المتجر بالذكاء الاصطناعي" : "Connect & monitor store performance with AI"}
                  </p>
                </div>
              </div>
              <ChevronLeft size={20} className="text-[#999999] group-hover:text-[#0D0D0D] dark:group-hover:text-[#F2F2F2] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </MemberGuard>
  )
}
