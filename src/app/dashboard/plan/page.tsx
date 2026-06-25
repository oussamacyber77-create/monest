"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { Crown, Users, Star, Check, X, Clock, CreditCard, Download } from "lucide-react"
import { SARIcon } from "@/components/ui/sar-icon"

const platformPlan = {
  name: { ar: "الباقة الأساسية الدائمة", en: "Lifetime Basic Plan" },
  desc: { ar: "مدى الحياة - دفع لمرة واحدة", en: "Lifetime - One-time payment" },
  price: 4999,
  startDate: "2026-05-01",
  status: "active",
}

const communityTiers = [
  {
    id: "silver",
    name: { ar: "الفضية", en: "Silver" },
    price: 999,
    period: { ar: "شهرياً", en: "/month" },
    popular: false,
    features: [
      { ar: "دخول المجتمع الحصري", en: "Exclusive community access" },
      { ar: "اجتماعات أسبوعية", en: "Weekly meetings" },
      { ar: "استشارات جماعية", en: "Group consultations" },
      { ar: "مكتبة محتوى حصرية", en: "Exclusive content library" },
    ],
  },
  {
    id: "gold",
    name: { ar: "الذهبية", en: "Gold" },
    price: 2499,
    period: { ar: "شهرياً", en: "/month" },
    popular: true,
    features: [
      { ar: "كل مزايا الفضة", en: "All Silver features" },
      { ar: "استشارات فردية", en: "One-on-one consultations" },
      { ar: "توصيات AI مخصصة", en: "Personalized AI recommendations" },
      { ar: "تحليل متقدم للمتجر", en: "Advanced store analytics" },
      { ar: "أولوية الدعم الفني", en: "Priority support" },
    ],
  },
]

export default function PlanPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const invoices = [
    { id: "INV-001", date: "2026-05-01", amount: 4999, status: "paid" },
    { id: "INV-002", date: "2026-06-01", amount: 4999, status: "paid" },
    { id: "INV-003", date: "2026-07-01", amount: 4999, status: "pending" },
  ]

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "الباقة" : "Subscription"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
          {lang === "ar" ? "إدارة باقتك والاستفادة من المنصة" : "Manage your plan and platform benefits"}
        </p>
      </div>

      {/* Platform Subscription */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-5 border-b border-[#D4D4D4] dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={18} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
            <h2 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "اشتراك المنصة" : "Platform Subscription"}
            </h2>
          </div>
          <p className="text-xs text-[#666666] dark:text-[#B3B3B3]">
            {lang === "ar" ? "باقتك الحالية على منصة Monest" : "Your current Monest platform plan"}
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{platformPlan.name[lang]}</p>
              <p className="text-xs text-[#666666] dark:text-[#B3B3B3]">{platformPlan.desc[lang]}</p>
            </div>
            <span className="px-3 py-1 text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 shrink-0">
              {lang === "ar" ? "نشط" : "Active"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
              <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "تاريخ البدء" : "Start Date"}</p>
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{platformPlan.startDate}</p>
            </div>
            <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
              <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "تاريخ الانتهاء" : "End Date"}</p>
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "غير محدد (مدى الحياة)" : "Unlimited (Lifetime)"}
              </p>
            </div>
            <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
              <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "المتبقي" : "Remaining"}</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{lang === "ar" ? "غير محدد" : "Unlimited"}</p>
            </div>
            <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
              <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "المبلغ المدفوع" : "Amount Paid"}</p>
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-1">
                {platformPlan.price.toLocaleString("en-US")} <SARIcon className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Membership */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-5 border-b border-[#D4D4D4] dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
            <h2 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "باقة عضوية المجتمع" : "Community Membership"}
            </h2>
          </div>
          <p className="text-xs text-[#666666] dark:text-[#B3B3B3]">
            {lang === "ar"
              ? "اختر الرتبة المناسبة للانضمام إلى مجتمع Monest"
              : "Choose the right tier to join the Monest community"}
          </p>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-4">
          {communityTiers.map((tier) => (
            <div
              key={tier.id}
              className={"relative border p-5 transition-all " + (
                selectedTier === tier.id
                  ? "border-[#0D0D0D] dark:border-[#F2F2F2]"
                  : "border-[#D4D4D4] dark:border-[#333333] hover:border-[#999999] dark:hover:border-[#666666]"
              )}
            >
              {tier.popular && (
                <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-[9px] font-bold">
                  {lang === "ar" ? "الأكثر طلباً" : "Most Popular"}
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className={"shrink-0 " + (tier.id === "gold" ? "text-amber-500" : "text-[#999999]")} />
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{tier.name[lang]}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{tier.price.toLocaleString("en-US")}</span>
                <SARIcon className="w-4 h-4" />
                <span className="text-xs text-[#666666] dark:text-[#B3B3B3]">/{tier.period[lang]}</span>
              </div>

              <ul className="space-y-2 mb-5">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#666666] dark:text-[#B3B3B3]">
                    <Check size={12} className="text-green-500 shrink-0 mt-0.5" />
                    {f[lang]}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                className={"w-full h-10 text-xs font-bold transition-colors " + (
                  selectedTier === tier.id
                    ? "bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]"
                    : "border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]"
                )}
              >
                {selectedTier === tier.id
                  ? (lang === "ar" ? "محددة ✓" : "Selected ✓")
                  : (lang === "ar" ? "اختيار الرتبة" : "Choose Tier")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "الفواتير السابقة" : "Previous Invoices"}
          </h2>
          <button className="text-xs text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors flex items-center gap-1">
            <Download size={12} /> {lang === "ar" ? "تصدير" : "Export"}
          </button>
        </div>
        <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
              <div>
                <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{inv.id}</p>
                <p className="text-xs text-[#999999] flex items-center gap-1">
                  {inv.date} • {inv.amount.toLocaleString("en-US")} <SARIcon className="w-3 h-3" />
                </p>
              </div>
              <span className={"px-2 py-0.5 text-[10px] font-bold " + (inv.status === "paid" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400")}>
                {inv.status === "paid" ? (lang === "ar" ? "مدفوع" : "Paid") : (lang === "ar" ? "قيد الانتظار" : "Pending")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
