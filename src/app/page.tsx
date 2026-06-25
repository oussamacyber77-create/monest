"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Video, Users, BarChart3, ChevronLeft, Package, MessageCircle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useSettingsStore } from "@/stores/settings-store"
import { GuidedTour } from "@/components/tour/guided-tour"
import { HelpButton } from "@/components/tour/help-button"
import { landingTourSteps } from "@/components/tour/tour-steps"
import { MonestLogo } from "@/components/ui/monest-logo"
import { pricingPlans } from "@/lib/mock-data/pricing"

const features = [
  {
    key: "meetings",
    icon: <Video size={24} />,
    title: { ar: "اجتماعات فورية", en: "Instant Meetings" },
    desc: {
      ar: "اجتماعات فيديو فورية بدون تسجيل. أدخل رقم جوالك وانطلق خلال ثوانٍ مع تسجيل تلقائي وإدارة كاملة للغرفة.",
      en: "Instant video calls with no registration required. Enter your phone and go in seconds.",
    },
    href: "/meetings",
  },
  {
    key: "crm",
    icon: <Users size={24} />,
    title: { ar: "CRM متقدم", en: "Advanced CRM" },
    desc: {
      ar: "تتبع العملاء وإدارة التسجيلات الناقصة. نظام متكامل لمتابعة العملاء المحتملين وإغلاق الصفقات.",
      en: "Track incomplete signups and manage customer relationships with a complete sales pipeline.",
    },
    href: "/crm",
  },
  {
    key: "commerce",
    icon: <BarChart3 size={24} />,
    title: { ar: "AI Commerce Intelligence", en: "AI Commerce Intelligence" },
    desc: {
      ar: "تحليلات ذكية، توصيات AI، وأتمتة كاملة لمتاجر Salla. لوحة تحكم تنفيذية وتقارير أرباح متوقعة.",
      en: "AI-powered analytics, recommendations, and automation for Salla stores with executive dashboard.",
    },
    href: "/monest",
  },
]

export default function Home() {
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("tour-landing")) setShowTour(true)
  }, [])

  const allPlans = [...pricingPlans.subscription, ...pricingPlans.lifetime]

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="flex items-center justify-center px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl"
          >
            <div className="flex justify-center mb-6">
              <MonestLogo width={64} height={64} className="text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0D0D0D] dark:text-[#F2F2F2] leading-[1.1] mb-4">
              {lang === "ar" ? "منصة AI Commerce Intelligence" : "AI Commerce Intelligence"}
            </h1>
            <p className="text-lg md:text-xl text-[#666666] dark:text-[#999999] max-w-2xl mx-auto mb-8 leading-relaxed">
              {lang === "ar"
                ? "منصة متكاملة تجمع الاجتماعات الفورية، نظام CRM متقدم، وتحليلات ذكاء اصطناعي لمتاجر Salla — كل ذلك في مكان واحد."
                : "A complete platform combining instant meetings, advanced CRM, and AI-powered analytics for Salla stores — all in one place."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => router.push("/register")}
                className="h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {lang === "ar" ? "ابدأ الآن" : "Get Started"}
              </button>
              <button
                onClick={() => router.push("/meetings")}
                className="h-12 px-8 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                {lang === "ar" ? "جرب الاجتماعات" : "Try Meetings"}
              </button>
            </div>
          </motion.div>
        </section>

        {/* ما هو Monest */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 md:p-12">
                <h2 className="text-sm font-bold text-[#666666] dark:text-[#999999] mb-3 tracking-widest uppercase">
                  {lang === "ar" ? "ما هو Monest" : "What is Monest"}
                </h2>
                <p className="text-lg leading-relaxed text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar"
                    ? "Monest هي منصة ذكاء تجاري متكاملة مصممة خصيصاً لمتاجر Salla. تجمع المنصة بين ثلاث ركائز أساسية: الاجتماعات التفاعلية لإدارة المبيعات، نظام CRM لتتبع العملاء، ولوحة تحكم ذكية تعمل بالذكاء الاصطناعي لتحليل الأداء وتوقع الأرباح."
                    : "Monest is a complete commerce intelligence platform built specifically for Salla stores. It combines three core pillars: interactive meetings for sales, CRM for customer tracking, and an AI-powered dashboard for performance analytics and profit forecasting."}
                </p>
              </div>
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 md:p-12 flex flex-col justify-center gap-6">
                {[
                  { label: { ar: "اجتماع شهري", en: "Monthly Meetings" }, value: "1,200+" },
                  { label: { ar: "عميل نشط", en: "Active Customers" }, value: "340+" },
                  { label: { ar: "متجر متصل", en: "Connected Stores" }, value: "520+" },
                  { label: { ar: "نسبة رضا", en: "Satisfaction" }, value: "97%" },
                ].map((stat) => (
                  <div key={stat.value} className="flex items-center justify-between border-b border-[#D4D4D4] dark:border-[#333333] pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-[#666666] dark:text-[#999999]">{stat.label[lang]}</span>
                    <span className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                {lang === "ar" ? "كل ما تحتاجه في منصة واحدة" : "Everything You Need in One Platform"}
              </h2>
              <p className="text-sm text-[#666666] dark:text-[#999999]">
                {lang === "ar" ? "ثلاث أدوات متكاملة لإدارة وتنمية متجرك" : "Three integrated tools to manage and grow your store"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
              {features.map((f) => (
                <Link
                  key={f.key}
                  id={"tour-feature-" + f.key}
                  href={f.href}
                  className="group bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex flex-col"
                >
                  <div className="mb-5 w-12 h-12 border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                    {f.title[lang]}
                  </h3>
                  <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed flex-1">
                    {f.desc[lang]}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === "ar" ? "استكشف" : "Explore"}
                    <ChevronLeft size={14} className={direction === "rtl" ? "" : "rotate-180"} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Mini */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                {lang === "ar" ? "خطط مرنة تناسب احتياجك" : "Flexible Plans for Your Needs"}
              </h2>
              <p className="text-sm text-[#666666] dark:text-[#999999]">
                {lang === "ar" ? "اختر بين الاشتراك المتكرر أو الاشتراك مدى الحياة" : "Choose between subscription or lifetime access"}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333] max-w-3xl mx-auto">
              {/* Subscription mini */}
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6">
                <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
                  {lang === "ar" ? "الاشتراك المتكرر" : "Subscription"}
                </h3>
                <div className="space-y-2">
                  {pricingPlans.subscription.map((p) => (
                    <div key={p.key} className="flex items-center justify-between py-1">
                      <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{p.key}</span>
                      <span className="text-sm font-bold text-[#666666] dark:text-[#999999]">{p.price.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Lifetime mini */}
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6">
                <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
                  {lang === "ar" ? "الباقات الدائمة" : "Lifetime (Best)"}
                </h3>
                <div className="space-y-2">
                  {pricingPlans.lifetime.map((p) => (
                    <div key={p.key} className="flex items-center justify-between py-1">
                      <div>
                        <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{p.key}</span>
                        {p.originalPrice && <span className="text-xs text-[#999999] line-through me-1">{p.originalPrice.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>}
                      </div>
                      <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.price.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/auth/pricing"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] border-b border-[#0D0D0D] dark:border-[#F2F2F2] pb-0.5 hover:opacity-70 transition-opacity"
              >
                {lang === "ar" ? "عرض جميع الباقات والميزات" : "View all plans & features"}
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="max-w-3xl mx-auto text-center bg-[#E8E8E8] dark:bg-[#1A1A1A] p-12 md:p-16">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
              {lang === "ar" ? "انطلق مع Monest اليوم" : "Launch with Monest Today"}
            </h2>
            <p className="text-sm text-[#666666] dark:text-[#999999] mb-8 max-w-lg mx-auto">
              {lang === "ar"
                ? "انضم إلى أكثر من 340 عميلاً يستخدمون Monest لتنمية متاجرهم في Salla."
                : "Join 340+ customers using Monest to grow their Salla stores."}
            </p>
            <button
              onClick={() => router.push("/register")}
              className="h-12 px-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {lang === "ar" ? "سجل الآن" : "Register Now"}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#D4D4D4] dark:border-[#333333] px-6 py-10 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Link href="/community" className="flex items-center gap-3 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
                <Users size={18} className="text-blue-500" />
                {lang === "ar" ? "عن المجتمع" : "About Community"}
              </Link>
              <Link href="/auth/pricing" className="flex items-center gap-3 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
                <Package size={18} className="text-emerald-500" />
                {lang === "ar" ? "الباقات" : "Packages"}
              </Link>
              <Link href="/consulting" className="flex items-center gap-3 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
                <MessageCircle size={18} className="text-violet-500" />
                {lang === "ar" ? "استشارات" : "Consulting"}
              </Link>
              <Link href="/returns" className="flex items-center gap-3 text-sm text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
                <RefreshCw size={18} className="text-amber-500" />
                {lang === "ar" ? "الاستبدال والاسترجاع" : "Returns & Exchanges"}
              </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#D4D4D4] dark:border-[#333333]">
              <div className="flex items-center gap-2">
                <MonestLogo width={20} height={20} className="text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
                <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">Monest</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#999999]">
                <Link href="/meetings" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  {lang === "ar" ? "الاجتماعات" : "Meetings"}
                </Link>
                <Link href="/crm" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  CRM
                </Link>
                <Link href="/monest" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  AI Commerce
                </Link>
                <Link href="/auth/pricing" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  {lang === "ar" ? "الباقات" : "Pricing"}
                </Link>
              </div>
              <p className="text-xs text-[#999999]">© 2026 Monest</p>
            </div>
          </div>
        </footer>
      </div>

      <HelpButton onClick={() => setShowTour(true)} />
      {showTour && (
        <GuidedTour
          steps={landingTourSteps}
          onComplete={() => { sessionStorage.setItem("tour-landing", "1"); setShowTour(false) }}
          onSkip={() => { sessionStorage.setItem("tour-landing", "1"); setShowTour(false) }}
        />
      )}
    </>
  )
}
