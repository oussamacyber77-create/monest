"use client"

import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/stores/settings-store"

export default function RegisterSuccessPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center">
          <Check size={36} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
        </div>

        <h1 className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
          {lang === "ar" ? "تم التسجيل بنجاح!" : "Registration Complete!"}
        </h1>

        <p className="text-[#666666] dark:text-[#999999] text-lg">
          {lang === "ar"
            ? "شكراً لانضمامك إلى Monest. سيتم التواصل معك في أقرب وقت لتأكيد موعد جلسة المتابعة."
            : "Thank you for joining Monest. We'll contact you soon to confirm your onboarding meeting."}
        </p>

        <div className="w-12 h-0.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] mx-auto" />

        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar"
            ? "تم إرسال تأكيد الحجز إلى جوالك"
            : "A confirmation has been sent to your phone"}
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/")} size="lg">
            {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/meetings")} size="lg">
            {lang === "ar" ? "الذهاب للاجتماعات" : "Go to Meetings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
