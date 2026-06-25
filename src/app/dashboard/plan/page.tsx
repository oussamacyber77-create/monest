"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { Crown, Users, Star, Check, X, Clock, CalendarDays, CreditCard, Download, FileText, ChevronDown, ChevronUp, RefreshCw, AlertTriangle, Shield, QrCode, Printer, Sliders, Ban } from "lucide-react"
import { SARIcon } from "@/components/ui/sar-icon"
import { ConfirmModal } from "@/components/ui/confirm-modal"

const TAX_RATE = 0.15
const TAX_NUMBER = "310123456700003"

const platformPlans = [
  {
    id: "monthly",
    name: { ar: "اشتراك شهري", en: "Monthly" },
    price: 499,
    period: { ar: "شهرياً", en: "/month" },
    popular: false,
    features: [
      { ar: "تحليلات أساسية للمتجر", en: "Basic store analytics" },
      { ar: "تقرير أسبوعي بالأداء", en: "Weekly performance report" },
      { ar: "دعم عبر البريد الإلكتروني", en: "Email support" },
      { ar: "ربط متجر سلة واحد", en: "1 Salla store connection" },
      { ar: "اجتماعات فيديو غير محدودة", en: "Unlimited video meetings" },
      { ar: "مجتمع Monest", en: "Monest community access" },
    ],
  },
  {
    id: "yearly",
    name: { ar: "اشتراك سنوي", en: "Yearly" },
    price: 4999,
    period: { ar: "سنوياً", en: "/year" },
    popular: true,
    badge: { ar: "وفر 17%", en: "Save 17%" },
    features: [
      { ar: "كل ميزات الباقة الشهرية", en: "All monthly features" },
      { ar: "تقارير يومية مفصلة", en: "Detailed daily reports" },
      { ar: "دعم فوري عبر البريد والواتساب", en: "Priority email & WhatsApp" },
      { ar: "ربط حتى 5 متاجر", en: "Up to 5 store connections" },
      { ar: "تحليلات متقدمة مع AI", en: "Advanced AI analytics" },
      { ar: "مدير حساب مخصص", en: "Dedicated account manager" },
      { ar: "توصيات منتجات ذكية", en: "Smart product recommendations" },
      { ar: "API مفتوح للتكامل", en: "Open API for integrations" },
    ],
  },
]

const communityTiers = [
  {
    id: "silver",
    name: { ar: "الفضية", en: "Silver" },
    price: 999,
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
    popular: true,
    badge: { ar: "الأكثر طلباً", en: "Most Popular" },
    features: [
      { ar: "كل مزايا الفضة", en: "All Silver features" },
      { ar: "استشارات فردية خاصة", en: "One-on-one consultations" },
      { ar: "توصيات AI مخصصة لمتجرك", en: "Personalized AI recommendations" },
      { ar: "تحليل متقدم للمتجر", en: "Advanced store analytics" },
      { ar: "أولوية الدعم الفني", en: "Priority technical support" },
    ],
  },
]

const MOCK_INVOICES = [
  { id: "INV-2026-001", date: "2026-05-01", amount: 4999, vat: Math.round(4999 * TAX_RATE), status: "paid" as const },
]

export default function PlanPage() {
  const { direction, primaryColor } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const brandColor = primaryColor

  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">("yearly")
  const [communityTier, setCommunityTier] = useState<string | null>("gold")
  const [autoRenew, setAutoRenew] = useState(true)
  const [showPlans, setShowPlans] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const currentPlan = platformPlans.find(p => p.id === "yearly")!
  const vatAmount = Math.round(currentPlan.price * TAX_RATE)
  const totalAmount = currentPlan.price + vatAmount

  const currentPlanStart = new Date("2026-05-01")
  const currentPlanEnd = new Date("2027-05-01")
  const today = new Date()
  const totalDays = (currentPlanEnd.getTime() - currentPlanStart.getTime()) / (1000 * 60 * 60 * 24)
  const elapsedDays = (today.getTime() - currentPlanStart.getTime()) / (1000 * 60 * 60 * 24)
  const progressPct = Math.min(Math.max(Math.round((elapsedDays / totalDays) * 100), 0), 100)
  const remainingMonths = Math.max(12 - Math.ceil(elapsedDays / 30), 1)

  const isCurrentTier = (id: string) => communityTier === id
  const isUpgrade = (id: string) => {
    if (!communityTier) return true
    const order = ["silver", "gold"]
    return order.indexOf(id) > order.indexOf(communityTier)
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "الباقة" : "Subscription"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
          {lang === "ar" ? "فوترة متوافقة، شفافية كاملة، وتحكم كامل باشتراكك" : "Compliant billing, full transparency, complete subscription control"}
        </p>
      </div>

      {/* ===== HERO: Current Plan (Annual) ===== */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-5 md:p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 hidden md:flex items-center justify-center shrink-0" style={{ backgroundColor: brandColor }}>
                <Crown size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{currentPlan.name[lang]}</p>
                  <span className="px-2 py-0.5 text-[9px] font-bold flex items-center gap-1" style={{ backgroundColor: brandColor + "15", color: brandColor }}>
                    <Check size={10} /> {lang === "ar" ? "نشط" : "Active"}
                  </span>
                </div>
                <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
                  <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{currentPlan.price.toLocaleString("en-US")}</span>{" "}
                  <SARIcon className="w-3.5 h-3.5" /> {lang === "ar" ? "سنوياً" : "/year"}
                  <span className="text-[#999999]"> · </span>
                  {lang === "ar" ? "شامل ضريبة القيمة المضافة" : "VAT inclusive"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#999999] mb-1.5">
              <span className="flex items-center gap-1"><CalendarDays size={10} /> {currentPlanStart.toLocaleDateString("en-CA")}</span>
              <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{remainingMonths} {lang === "ar" ? "شهر متبقي" : "months remaining"}</span>
              <span className="flex items-center gap-1">{currentPlanEnd.toLocaleDateString("en-CA")} <CalendarDays size={10} /></span>
            </div>
            <div className="h-2 bg-[#E8E8E8] dark:bg-[#333333] relative overflow-hidden">
              <div className="absolute inset-y-0 start-0 transition-all duration-500" style={{ width: progressPct + "%", backgroundColor: brandColor }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[#999999]">0%</span>
              <span className="text-[9px] font-bold" style={{ color: brandColor }}>{progressPct}%</span>
              <span className="text-[9px] text-[#999999]">100%</span>
            </div>
          </div>

          {/* Management row */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {/* Auto-renew + cancel */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3" style={{ backgroundColor: brandColor + "08" }}>
                <span className="text-xs text-[#666666] dark:text-[#B3B3B3] flex items-center gap-1.5">
                  <RefreshCw size={12} /> {lang === "ar" ? "التجديد التلقائي" : "Auto-renew"}
                </span>
                <button onClick={() => setAutoRenew(!autoRenew)}
                  className={"w-10 h-5 rounded-full transition-colors relative " + (autoRenew ? "bg-[#0D0D0D] dark:bg-[#F2F2F2]" : "bg-[#D4D4D4] dark:bg-[#333333]")}>
                  <span className={"absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all " + (autoRenew ? "start-[22px]" : "start-0.5")} />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowChangeModal(true)}
                  className="flex-1 h-10 text-xs font-bold border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-1">
                  <Sliders size={13} /> {lang === "ar" ? "تغيير الباقة" : "Change Plan"}
                </button>
                <button onClick={() => setShowCancelModal(true)}
                  className="flex-1 h-10 text-xs font-bold border border-[#D4D4D4] dark:border-[#333333] text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1">
                  <Ban size={13} /> {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>

            {/* Payment method */}
            <div className="p-3 border border-[#D4D4D4] dark:border-[#333333]">
              <p className="text-[10px] font-medium text-[#999999] mb-2 flex items-center gap-1">
                <CreditCard size={11} /> {lang === "ar" ? "طريقة الدفع" : "Payment Method"}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center text-[6px] font-bold text-white dark:text-[#0D0D0D]">VISA</div>
                  <div>
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">•••• 4242</p>
                    <p className="text-[9px] text-[#999999]">{lang === "ar" ? "تنتهي 12/27" : "Expires 12/27"}</p>
                  </div>
                </div>
                <button className="text-[10px] font-medium text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] underline underline-offset-2">
                  {lang === "ar" ? "تحديث" : "Update"}
                </button>
              </div>
            </div>
          </div>

          {/* Price breakdown with VAT */}
          <div className="p-3" style={{ backgroundColor: brandColor + "06" }}>
            <p className="text-[10px] font-medium text-[#999999] mb-2">{lang === "ar" ? "تفصيل الدفعة الحالية" : "Current payment breakdown"}</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#666666]">{lang === "ar" ? "سعر الباقة السنوية" : "Annual plan price"}</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{currentPlan.price.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5" /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">ضريبة القيمة المضافة 15% / VAT 15%</span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{vatAmount.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5" /></span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#D4D4D4] dark:border-[#333333] font-bold">
                <span className="text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الإجمالي شامل الضريبة" : "Total incl. VAT"}</span>
                <span className="text-[#0D0D0D] dark:text-[#F2F2F2]">{totalAmount.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Available Plans (collapsible) ===== */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <button onClick={() => setShowPlans(!showPlans)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
          <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-2">
            <Crown size={16} /> {lang === "ar" ? "الباقات المتاحة" : "Available Plans"}
          </span>
          {showPlans ? <ChevronUp size={16} className="text-[#999999]" /> : <ChevronDown size={16} className="text-[#999999]" />}
        </button>

        {showPlans && (
          <div className="p-5 pt-0 space-y-4">
            {/* Monthly/Yearly toggle */}
            <div className="flex gap-1 max-w-xs" style={{ backgroundColor: brandColor + "10" }}>
              {(["monthly", "yearly"] as const).map((b) => (
                <button key={b} onClick={() => setSelectedBilling(b)}
                  className={"flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 " + (selectedBilling === b ? "text-white" : "text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}
                  style={selectedBilling === b ? { backgroundColor: brandColor } : {}}>
                  {b === "monthly" ? (lang === "ar" ? "شهري" : "Monthly") : (lang === "ar" ? "سنوي" : "Yearly")}
                  {b === "yearly" && (
                    <span className="text-[8px] opacity-80">{lang === "ar" ? "وفر 17%" : "Save 17%"}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Plan card */}
            {(() => {
              const plan = platformPlans.find(p => p.id === selectedBilling)!
              const isCurrent = plan.id === "yearly"
              const planVat = Math.round(plan.price * TAX_RATE)
              return (
                <div className={"border p-5 transition-all " + (isCurrent ? "border-[#0D0D0D] dark:border-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333]")}>
                  {/* Badge */}
                  {plan.badge && (
                    <span className="inline-flex px-3 py-0.5 text-[9px] font-bold mb-3 text-white" style={{ backgroundColor: brandColor }}>
                      {plan.badge[lang]}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex px-3 py-0.5 text-[9px] font-bold mb-3 text-white me-2" style={{ backgroundColor: brandColor }}>
                      {lang === "ar" ? "باقتك الحالية" : "Your Current Plan"}
                    </span>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{plan.price.toLocaleString("en-US")}</span>
                    <SARIcon className="w-4 h-4" />
                    <span className="text-xs text-[#666666] dark:text-[#B3B3B3]">/{plan.period[lang]}</span>
                    <span className="text-[9px] text-[#999999] me-auto">
                      ({lang === "ar" ? "ضريبة 15%" : "VAT 15%"})
                    </span>
                  </div>

                  {/* Price with VAT */}
                  <p className="text-xs text-[#999999] mb-4">
                    {lang === "ar" ? "السعر شامل الضريبة" : "Price incl. VAT"}: <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{plan.price.toLocaleString("en-US")}</span>{" "}
                    <SARIcon className="w-2.5 h-2.5" /> +{" "}
                    {lang === "ar" ? "ضريبة" : "VAT"} <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{planVat.toLocaleString("en-US")}</span>{" "}
                    <SARIcon className="w-2.5 h-2.5" /> ={" "}
                    <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{(plan.price + planVat).toLocaleString("en-US")}</span>{" "}
                    <SARIcon className="w-2.5 h-2.5" />
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#666666] dark:text-[#B3B3B3]">
                        <Check size={12} className="text-green-500 shrink-0 mt-0.5" />
                        {f[lang]}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <button disabled
                      className="w-full h-11 text-xs font-bold bg-[#E8E8E8] dark:bg-[#333333] text-[#999999] cursor-not-allowed flex items-center justify-center gap-1">
                      <Check size={14} /> {lang === "ar" ? "باقتك الحالية" : "Current Plan"}
                    </button>
                  ) : (
                    <button onClick={() => setShowChangeModal(true)}
                      className="w-full h-11 text-xs font-bold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-1"
                      style={{ backgroundColor: brandColor }}>
                      {lang === "ar" ? "تغيير إلى الباقة الشهرية" : "Switch to Monthly"}
                    </button>
                  )}
                </div>
              )
            })()}

            {/* Proration note */}
            {selectedBilling === "monthly" && (
              <div className="flex items-start gap-2 p-3 text-xs text-[#666666] dark:text-[#B3B3B3] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertTriangle size={12} className="shrink-0 mt-0.5 text-amber-500" />
                {lang === "ar"
                  ? "عند التبديل من الباقة السنوية إلى الشهرية، سيتم احتساب الفرق (proration) بناءً على المدة المتبقية من باقتك الحالية."
                  : "When switching from annual to monthly, the difference will be prorated based on your remaining plan period."}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== Community Membership ===== */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-5 border-b border-[#D4D4D4] dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
            <h2 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "عضوية المجتمع" : "Community Membership"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#666666] dark:text-[#B3B3B3]">
              {lang === "ar" ? "عضوية دائمة — تدفع مرة واحدة" : "Lifetime membership — pay once"}
            </p>
            <span className="px-2 py-0.5 text-[9px] font-bold flex items-center gap-1" style={{ backgroundColor: brandColor + "15", color: brandColor }}>
              <Clock size={9} /> {lang === "ar" ? "مدى الحياة" : "Lifetime"}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="grid md:grid-cols-2 gap-4">
            {communityTiers.map((tier) => {
              const owned = isCurrentTier(tier.id)
              const upgrade = isUpgrade(tier.id)
              const canSelect = !owned && upgrade
              return (
                <div key={tier.id}
                  className={"relative border p-5 flex flex-col transition-all " + (owned ? "border-[#0D0D0D] dark:border-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333]")}
                  style={{ minHeight: "320px" }}>
                  {/* Badge */}
                  {tier.popular && !owned && (
                    <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 px-3 py-0.5 text-[9px] font-bold text-white whitespace-nowrap" style={{ backgroundColor: brandColor }}>
                      {tier.badge![lang]}
                    </span>
                  )}
                  {owned && (
                    <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 px-3 py-0.5 text-[9px] font-bold text-white whitespace-nowrap" style={{ backgroundColor: brandColor }}>
                      {lang === "ar" ? "رتبتك الحالية" : "Your Rank"}
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Star size={16} className={"shrink-0 " + (tier.id === "gold" ? "text-amber-500" : "text-[#999999]")} />
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{tier.name[lang]}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{tier.price.toLocaleString("en-US")}</span>
                    <SARIcon className="w-3.5 h-3.5" />
                    <span className="text-xs text-[#666666] dark:text-[#B3B3B3]">{lang === "ar" ? "مرة واحدة" : "one-time"}</span>
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#666666] dark:text-[#B3B3B3]">
                        <Check size={12} className="text-green-500 shrink-0 mt-0.5" />
                        {f[lang]}
                      </li>
                    ))}
                  </ul>

                  {owned ? (
                    <button disabled
                      className="w-full h-10 text-xs font-bold bg-[#E8E8E8] dark:bg-[#333333] text-[#999999] cursor-not-allowed flex items-center justify-center gap-1">
                      <Check size={14} /> {lang === "ar" ? "رتبتك الحالية" : "Your Rank"}
                    </button>
                  ) : canSelect ? (
                    <button onClick={() => setShowUpgradeModal(true)}
                      className="w-full h-10 text-xs font-bold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-1"
                      style={{ backgroundColor: brandColor }}>
                      {lang === "ar" ? "ترقية إلى " + tier.name[lang] : "Upgrade to " + tier.name[lang]}
                    </button>
                  ) : (
                    <button disabled
                      className="w-full h-10 text-xs font-bold border border-[#D4D4D4] dark:border-[#333333] text-[#999999] cursor-not-allowed">
                      {lang === "ar" ? "غير متاح" : "Unavailable"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-[#999999] mt-3 text-center">
            {lang === "ar"
              ? "عضوية المجتمع مدى الحياة — تدفع مرة واحدة فقط. لا توجد رسوم متكررة."
              : "Community membership is lifetime — pay once. No recurring fees."}
          </p>
        </div>
      </div>

      {/* ===== Invoice History ===== */}
      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "سجل الفواتير" : "Invoice History"}
            </h2>
            <p className="text-[10px] text-[#666666] dark:text-[#B3B3B3]">{lang === "ar" ? "الرقم الضريبي" : "Tax Number"}: {TAX_NUMBER}</p>
          </div>
          <button className="text-xs text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors flex items-center gap-1">
            <Download size={12} /> {lang === "ar" ? "تصدير الكل" : "Export All"}
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#D4D4D4] dark:border-[#333333] text-[10px]">
                <th className="text-start pb-3 pt-3 px-4 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الفاتورة" : "Invoice"}</th>
                <th className="text-start pb-3 pt-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "التاريخ" : "Date"}</th>
                <th className="text-end pb-3 pt-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المبلغ" : "Amount"}</th>
                <th className="text-end pb-3 pt-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">ضريبة 15%</th>
                <th className="text-end pb-3 pt-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الإجمالي" : "Total"}</th>
                <th className="text-center pb-3 pt-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="text-center pb-3 pt-3 px-4 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">PDF</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv) => {
                const total = inv.amount + inv.vat
                return (
                  <tr key={inv.id} className="border-b border-[#D4D4D4]/50 dark:border-[#333333]/50 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{inv.id}</span>
                    </td>
                    <td className="py-3 text-[#666666]">{inv.date}</td>
                    <td className="text-end py-3 text-[#666666]">
                      {inv.amount.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5" />
                    </td>
                    <td className="text-end py-3 text-[#666666]">
                      {inv.vat.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5" />
                    </td>
                    <td className="text-end py-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                      {total.toLocaleString("en-US")} <SARIcon className="w-2.5 h-2.5" />
                    </td>
                    <td className="text-center py-3">
                      <span className={"px-2 py-0.5 text-[9px] font-bold " + (inv.status === "paid" ? "text-green-600 bg-green-50 dark:bg-green-900/20" : "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20")}>
                        {inv.status === "paid" ? (lang === "ar" ? "مدفوع" : "Paid") : (lang === "ar" ? "قيد الانتظار" : "Pending")}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <button className="p-1.5 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors" title={lang === "ar" ? "تحميل PDF" : "Download PDF"}>
                        <FileText size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#D4D4D4] dark:divide-[#333333]">
          {MOCK_INVOICES.map((inv) => {
            const total = inv.amount + inv.vat
            return (
              <div key={inv.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{inv.id}</span>
                  <span className={"px-2 py-0.5 text-[9px] font-bold " + (inv.status === "paid" ? "text-green-600 bg-green-50 dark:bg-green-900/20" : "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20")}>
                    {inv.status === "paid" ? (lang === "ar" ? "مدفوع" : "Paid") : (lang === "ar" ? "قيد الانتظار" : "Pending")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <span className="text-[#999999]">{lang === "ar" ? "التاريخ" : "Date"}: {inv.date}</span>
                  <span className="text-[#999999]">{lang === "ar" ? "المبلغ" : "Amount"}: {inv.amount.toLocaleString("en-US")} <SARIcon className="w-2 h-2" /></span>
                  <span className="text-[#999999]">ضريبة: {inv.vat.toLocaleString("en-US")} <SARIcon className="w-2 h-2" /></span>
                  <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الإجمالي" : "Total"}: {total.toLocaleString("en-US")} <SARIcon className="w-2 h-2" /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#999999]">{lang === "ar" ? "الرقم الضريبي" : "Tax# "}: {TAX_NUMBER}</span>
                  <div className="flex gap-2">
                    <button className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]" title={lang === "ar" ? "تحميل PDF" : "Download PDF"}>
                      <FileText size={14} />
                    </button>
                    <button className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]" title={lang === "ar" ? "QR Code" : "QR Code"}>
                      <QrCode size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {MOCK_INVOICES.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText size={32} className="text-[#D4D4D4] dark:text-[#333333] mb-2" />
            <p className="text-xs text-[#999999]">{lang === "ar" ? "لا توجد فواتير بعد" : "No invoices yet"}</p>
          </div>
        )}
      </div>

      {/* ===== Modals ===== */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => setShowCancelModal(false)}
        title={lang === "ar" ? "إلغاء الاشتراك" : "Cancel Subscription"}
        description={lang === "ar"
          ? "سيتم إلغاء باقتك السنوية في نهاية دورة الفوترة الحالية (2027-05-01). لن تفقد الوصول للميزات حتى ذلك التاريخ. أنت متأكد؟"
          : "Your annual plan will be cancelled at the end of the current billing cycle (2027-05-01). You won't lose access until then. Are you sure?"}
        confirmLabel={lang === "ar" ? "تأكيد الإلغاء" : "Confirm Cancellation"}
        cancelLabel={lang === "ar" ? "رجوع" : "Back"}
        variant="danger"
      />

      <ConfirmModal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        onConfirm={() => setShowChangeModal(false)}
        title={lang === "ar" ? "تغيير الباقة" : "Change Plan"}
        description={lang === "ar"
          ? "سيتم تبديل باقتك من سنوي إلى شهري. سيتم احتساب الفرق (proration) بناءً على المدة المتبقية. هل تريد المتابعة؟"
          : "Your plan will switch from annual to monthly. The difference will be prorated. Continue?"}
        confirmLabel={lang === "ar" ? "تأكيد التغيير" : "Confirm Change"}
        cancelLabel={lang === "ar" ? "رجوع" : "Back"}
        variant="warning"
      />

      <ConfirmModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onConfirm={() => setShowUpgradeModal(false)}
        title={lang === "ar" ? "ترقية العضوية" : "Upgrade Membership"}
        description={lang === "ar"
          ? "سيتم ترقية عضويتك من الفضة إلى الذهبية (دفعة واحدة 2,499 ر.س شامل الضريبة). هل تريد المتابعة؟"
          : "Your membership will upgrade from Silver to Gold (one-time 2,499 SAR incl. VAT). Continue?"}
        confirmLabel={lang === "ar" ? "تأكيد الترقية" : "Confirm Upgrade"}
        cancelLabel={lang === "ar" ? "رجوع" : "Back"}
        variant="info"
      />
    </div>
  )
}
