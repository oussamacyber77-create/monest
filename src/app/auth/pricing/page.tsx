"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/stores/settings-store"
import { pricingPlans, pricingPlanTypes, type PricingPlanType } from "@/lib/mock-data/pricing"

const paymentMethods = ["Apple Pay", "Google Pay", "Samsung Pay", "Visa", "Mastercard"]

export default function PricingPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [tab, setTab] = useState<PricingPlanType>("lifetime")
  const [selected, setSelected] = useState("دوام أساسي")
  const [paymentMethod, setPaymentMethod] = useState("")
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
            {lang === "ar" ? "تم تفعيل باقتك بنجاح!" : "Plan Activated Successfully!"}
          </h1>
          <p className="text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "باقة " + selected + " — جاري تحويلك للوحة التحكم..." : selected + " plan — redirecting to dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {lang === "ar" ? "اختر باقتك" : "Choose Your Plan"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "اختر باقتك وانضم لمجتمع Monest" : "Choose your plan and join Monest community"}
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
                  <span className="text-sm text-[#999999] line-through me-2">{p.originalPrice.toLocaleString()} $</span>
                )}
                <span className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {p.price.toLocaleString()} <span className="text-sm font-normal text-[#666666] dark:text-[#999999]">$</span>
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
              <span className="font-bold text-lg text-[#0D0D0D] dark:text-[#F2F2F2]">{currentPlan.price.toLocaleString()} $</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "طريقة الدفع" : "Payment Method"}</p>
            <div className="grid grid-cols-5 gap-2">
              {paymentMethods.map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={"h-12 text-[10px] font-medium border transition-colors " + (paymentMethod === m ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 h-12 border border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
              {lang === "ar" ? "Tabby" : "Tabby"}
            </button>
            <button className="flex-1 h-12 border border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
              {lang === "ar" ? "Tamara" : "Tamara"}
            </button>
          </div>

          <Button onClick={handlePay} disabled={!paymentMethod} className="w-full" size="lg">
            <CreditCard size={18} />
            <span className="mr-1">{lang === "ar" ? "تأكيد الدفع" : "Confirm Payment"}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
