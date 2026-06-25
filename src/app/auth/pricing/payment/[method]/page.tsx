"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Check, ArrowLeft } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

const methodLabels: Record<string, { ar: string; en: string }> = {
  "apple-pay": { ar: "أبل باي", en: "Apple Pay" },
  "google-pay": { ar: "جوجل باي", en: "Google Pay" },
  "samsung-pay": { ar: "سامسونج باي", en: "Samsung Pay" },
  visa: { ar: "فيزا", en: "Visa" },
  mastercard: { ar: "ماستركارد", en: "Mastercard" },
  tabby: { ar: "تابي", en: "Tabby" },
  tamara: { ar: "تمارا", en: "Tamara" },
}

export default function PaymentGatewayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const method = params.method as string
  const plan = searchParams.get("plan") || ""
  const price = searchParams.get("price") || "0"
  const label = methodLabels[method] || { ar: method, en: method }

  const handlePay = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-sm space-y-8">
        <Link
          href="/auth/pricing"
          className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
        >
          <ArrowLeft size={16} />
          {lang === "ar" ? "العودة للباقات" : "Back to plans"}
        </Link>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center">
            <span className="text-lg font-bold text-[#F2F2F2] dark:text-[#0D0D0D]">
              {label.ar.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {label[lang]}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "بوابة الدفع الآمنة" : "Secure Payment Gateway"}
          </p>
        </div>

        <div className="p-5 border border-[#D4D4D4] dark:border-[#333333] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الباقة" : "Plan"}</span>
            <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{plan}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "طريقة الدفع" : "Payment"}</span>
            <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{label[lang]}</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-[#D4D4D4] dark:border-[#333333]">
            <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المبلغ" : "Total"}</span>
            <span className="font-bold text-lg text-[#0D0D0D] dark:text-[#F2F2F2]">{Number(price).toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-sm font-medium text-[#F2F2F2] dark:text-[#0D0D0D] hover:opacity-80 transition-opacity"
        >
          <Check size={18} />
          {lang === "ar" ? "تأكيد الدفع عبر " + label.ar : "Pay with " + label.en}
        </button>

        <p className="text-center text-xs text-[#999999] dark:text-[#666666]">
          {lang === "ar"
            ? "بوابة دفع مشفرة وآمنة — معلوماتك محمية"
            : "Encrypted & secure payment — your info is protected"}
        </p>
      </div>
    </div>
  )
}
