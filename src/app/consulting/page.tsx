"use client"

import Link from "next/link"
import { useSettingsStore } from "@/stores/settings-store"
import { Target, TrendingUp, Package, BarChart3 } from "lucide-react"

const consultingFeatures = [
  {
    icon: <Target size={24} />,
    title: { ar: "استراتيجيات النمو", en: "Growth Strategies" },
    desc: {
      ar: "جلسات استشارية لتحليل وضع متجرك ووضع خطة نمو مخصصة تتناسب مع مجال منتجاتك وسوقك المستهدف.",
      en: "Consulting sessions to analyze your store's situation and create a customized growth plan for your product category and target market.",
    },
  },
  {
    icon: <TrendingUp size={24} />,
    title: { ar: "التسويق والمبيعات", en: "Marketing & Sales" },
    desc: {
      ar: "استشارات متخصصة في استراتيجيات التسويق الرقمي، الإعلانات الممولة، وتحسين مسار المبيعات لمتجرك.",
      en: "Specialized consulting in digital marketing strategies, paid advertising, and sales funnel optimization for your store.",
    },
  },
  {
    icon: <Package size={24} />,
    title: { ar: "إدارة المخزون والتسعير", en: "Inventory & Pricing" },
    desc: {
      ar: "مساعدتك في تحديد استراتيجية التسعير المثلى وإدارة المخزون بذكاء لتقليل التكاليف وزيادة الأرباح.",
      en: "Help with optimal pricing strategies and smart inventory management to reduce costs and increase profits.",
    },
  },
  {
    icon: <BarChart3 size={24} />,
    title: { ar: "تحليل البيانات والتقارير", en: "Data Analysis & Reports" },
    desc: {
      ar: "تحليل مؤشرات أداء متجرك وتقديم تقارير واضحة مع توصيات عملية لتحسين النتائج.",
      en: "Analysis of your store's performance indicators with clear reports and actionable recommendations.",
    },
  },
]

export default function ConsultingPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="flex items-center justify-center px-6 py-20 md:py-28">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0D0D0D] dark:text-[#F2F2F2] leading-[1.1] mb-4">
            {lang === "ar" ? "استشارات Monest" : "Monest Consulting"}
          </h1>
          <p className="text-lg md:text-xl text-[#666666] dark:text-[#999999] max-w-2xl mx-auto leading-relaxed">
            {lang === "ar"
              ? "فريق Monest يقدّم جلسات استشارية فردية لمساعدة التجار على تخطي تحديات متاجرهم — تسويق، مخزون، تسعير، واستراتيجية نمو — كل ذلك ضمن عضويتك في المجتمع أو بجلسة منفصلة."
              : "The Monest team offers one-on-one consulting sessions to help merchants overcome their store challenges — marketing, inventory, pricing, and growth strategy — all within your community membership or as a standalone session."}
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              href="/meetings"
              className="h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity inline-flex items-center"
            >
              {lang === "ar" ? "احجز استشارتك" : "Book Your Consultation"}
            </Link>
            <Link
              href="/register"
              className="h-12 px-8 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors inline-flex items-center"
            >
              {lang === "ar" ? "اشترك في المجتمع" : "Join the Community"}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
            {consultingFeatures.map((f) => (
              <div
                key={f.title[lang]}
                className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 md:p-10"
              >
                <div className="mb-5 w-12 h-12 border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  {f.title[lang]}
                </h3>
                <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed">
                  {f.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto text-center bg-[#E8E8E8] dark:bg-[#1A1A1A] p-12 md:p-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "جاهز لتطوير متجرك؟" : "Ready to Grow Your Store?"}
          </h2>
          <p className="text-sm text-[#666666] dark:text-[#999999] mb-8 max-w-lg mx-auto">
            {lang === "ar"
              ? "جلسات استشارية مخصصة مع خبراء Monest لمساعدتك على تحقيق أقصى إمكانات متجرك."
              : "Personalized consulting sessions with Monest experts to help you reach your store's full potential."}
          </p>
          <Link
            href="/meetings"
            className="inline-flex h-12 px-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity items-center"
          >
            {lang === "ar" ? "احجز استشارتك الآن" : "Book Now"}
          </Link>
        </div>
      </section>
    </div>
  )
}
