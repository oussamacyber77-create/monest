"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Users, Package, MessageCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/stores/settings-store"
import { pricingPlans, pricingPlanTypes, type PricingPlanType } from "@/lib/mock-data/pricing"

interface PaymentMethod {
  id: string
  name: string
  svg: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "apple-pay", name: "Apple Pay",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#000"/><text x="25" y="16" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">Apple Pay</text></svg>
  },
  {
    id: "google-pay", name: "Google Pay",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#000"/><text x="25" y="16" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Arial">Google Pay</text></svg>
  },
  {
    id: "samsung-pay", name: "Samsung Pay",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#000"/><text x="25" y="16" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="Arial">Samsung Pay</text></svg>
  },
  {
    id: "visa", name: "Visa",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#1A1F71"/><text x="25" y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="Arial">VISA</text></svg>
  },
  {
    id: "mastercard", name: "Mastercard",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#fff"/><circle cx="18" cy="12" r="7" fill="#EB001B"/><circle cx="32" cy="12" r="7" fill="#F79E1B" opacity="0.8"/></svg>
  },
  {
    id: "tabby", name: "Tabby",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#00B5D6"/><text x="25" y="16" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">Tabby</text></svg>
  },
  {
    id: "tamara", name: "Tamara",
    svg: <svg viewBox="0 0 50 24" className="w-10 h-6"><rect width="50" height="24" rx="3" fill="#D92D3D"/><text x="25" y="16" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="Arial">Tamara</text></svg>
  },
]

const footerLinks = [
  { key: "community", label: { ar: "عن المجتمع", en: "About Community" }, icon: <Users size={18} />, color: "text-blue-500" },
  { key: "packages", label: { ar: "الباقات", en: "Packages" }, icon: <Package size={18} />, color: "text-emerald-500" },
  { key: "consulting", label: { ar: "استشارات", en: "Consulting" }, icon: <MessageCircle size={18} />, color: "text-violet-500" },
  { key: "returns", label: { ar: "الاستبدال والاسترجاع", en: "Returns & Exchanges" }, icon: <RefreshCw size={18} />, color: "text-amber-500" },
]

export default function PricingPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [tab, setTab] = useState<PricingPlanType>("lifetime")
  const [selected, setSelected] = useState(pricingPlans.lifetime[0].key)
  const [success, setSuccess] = useState(false)

  const plans = pricingPlans[tab]
  const currentPlan = [...pricingPlans.subscription, ...pricingPlans.lifetime].find((p) => p.key === selected)
  if (!currentPlan) return null

  const handlePay = () => {
    setSuccess(true)
    setTimeout(() => router.push("/member/home"), 1200)
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="text-center max-w-md space-y-6">
          <div className="w-20 h-20 mx-auto bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center">
            <Check size={36} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "تم تفعيل الباقة بنجاح!" : "Plan Activated Successfully!"}
          </h1>
          <p className="text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? selected + " — جاري تحويلك للوحة التحكم..." : selected + " — redirecting to dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#F2F2F2] dark:bg-[#0D0D0D] overflow-y-auto">
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
              {lang === "ar" ? "اختر باقتك" : "Choose Your Plan"}
            </h1>
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "أطلق العنان لذكاء Monest الاصطناعي لمتجرك" : "Unlock Monest AI Intelligence for your store"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1 max-w-md mx-auto">
            {pricingPlanTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSelected(pricingPlans[t.key][0].key) }}
                className={"flex-1 py-2.5 text-sm font-medium transition-colors " + (tab === t.key
                  ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                  : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
              >
                {t.label[lang]}
              </button>
            ))}
          </div>

          {/* Plans grid */}
          <div className={"grid gap-px bg-[#D4D4D4] dark:bg-[#333333] " + (tab === "subscription" ? "md:grid-cols-4" : "md:grid-cols-2 max-w-2xl mx-auto")}>
            {plans.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelected(p.key)}
                className={"p-6 text-start bg-[#F2F2F2] dark:bg-[#0D0D0D] transition-colors relative " + (selected === p.key ? "ring-2 ring-inset ring-[#0D0D0D] dark:ring-[#F2F2F2]" : "hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
              >
                {p.badge && (
                  <span className="absolute top-3 end-3 text-[10px] font-bold px-2 py-0.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]">
                    {p.badge[lang]}
                  </span>
                )}
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">{p.key}</p>
                <div className="mb-4">
                  {p.originalPrice && (
                    <span className="text-sm text-[#999999] line-through me-2">{p.originalPrice.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
                  )}
                  <span className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {p.price.toLocaleString("en-US")} <span className="text-sm font-normal text-[#666666] dark:text-[#999999]">{lang === "ar" ? "ر.س" : "SAR"}</span>
                  </span>
                </div>
                <ul className="space-y-2">
                  {p.features[lang].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#666666] dark:text-[#999999]">
                      <Check size={12} className="mt-0.5 shrink-0 text-[#0D0D0D] dark:text-[#F2F2F2]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Summary + Payment */}
          <div className="max-w-md mx-auto space-y-5">
            <div className="p-5 border border-[#D4D4D4] dark:border-[#333333] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الباقة" : "Plan"}</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{selected}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المبلغ" : "Total"}</span>
                <span className="font-bold text-lg text-[#0D0D0D] dark:text-[#F2F2F2]">{currentPlan.price.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "طريقة الدفع" : "Payment Method"}</p>
              <div className="grid grid-cols-4 gap-2">
                {paymentMethods.map((m) => (
                  <Link
                    key={m.id}
                    href={"/auth/pricing/payment/" + m.id + "?plan=" + encodeURIComponent(selected) + "&price=" + currentPlan.price}
                    className="h-14 flex items-center justify-center border border-[#D4D4D4] dark:border-[#333333] hover:border-[#0D0D0D] dark:hover:border-[#F2F2F2] bg-white dark:bg-[#1A1A1A] transition-colors"
                  >
                    {m.svg}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D4D4D4] dark:border-[#333333] bg-[#E8E8E8] dark:bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.key}
                href={"/" + link.key}
                className="flex items-center gap-3 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                <span className={link.color}>{link.icon}</span>
                {link.label[lang]}
              </Link>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-[#D4D4D4] dark:border-[#333333] text-center text-xs text-[#999999] dark:text-[#666666]">
            &copy; {new Date().getFullYear()} Monest. {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </div>
        </div>
      </footer>
    </div>
  )
}