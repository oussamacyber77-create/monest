"use client"

import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { MonestLogo } from "@/components/ui/monest-logo"
import { Calendar, Users, Target, Award } from "lucide-react"

export default function ConsultationsPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const features = [
    {
      icon: <Calendar size={24} />,
      title: { ar: "جلسات استشارية أسبوعية", en: "Weekly Consultation Sessions" },
      desc: { ar: "جلسات مباشرة مع خبراء Monest لمساعدتك في تطوير متجرك وزيادة مبيعاتك.", en: "Direct sessions with Monest experts to help develop your store and increase sales." },
    },
    {
      icon: <Users size={24} />,
      title: { ar: "توجيه مخصص لفريقك", en: "Dedicated Team Coaching" },
      desc: { ar: "تدريب مخصص لموظفيك على استخدام أدوات الذكاء الاصطناعي وتحليل البيانات.", en: "Custom training for your staff on using AI tools and data analysis." },
    },
    {
      icon: <Target size={24} />,
      title: { ar: "تخطيط استراتيجي", en: "Strategic Planning" },
      desc: { ar: "نساعدك في وضع خطة نمو لمتجرك بناءً على تحليلات دقيقة وبيانات حقيقية.", en: "We help you create a growth plan for your store based on accurate analytics and real data." },
    },
    {
      icon: <Award size={24} />,
      title: { ar: "دعم فوري ومتابعة", en: "Instant Support & Follow-up" },
      desc: { ar: "فريق دعم مخصص يجيب على استفساراتك ويساعدك في أي تحديات تواجهها.", en: "A dedicated support team answers your inquiries and helps with any challenges." },
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="flex items-center justify-center px-6 py-20 md:py-28">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
            {lang === "ar" ? "استشارات Monest" : "Monest Consultations"}
          </h1>
          <p className="text-lg text-[#666666] dark:text-[#999999] max-w-2xl mx-auto mb-8">
            {lang === "ar"
              ? "جلسات استشارية مخصصة مع فريق Monest لمساعدتك على تحقيق أقصى استفادة من عضويتك وخبراء المجتمع."
              : "Personalized consultation sessions with the Monest team to help you maximize your membership and community expertise."}
          </p>
          <button
            onClick={() => router.push("/register")}
            className="h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
          >
            {lang === "ar" ? "احجز استشارتك الآن" : "Book Your Consultation"}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          {features.map((f) => (
            <div key={f.title.en} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8">
              <div className="mb-4 text-[#0D0D0D] dark:text-[#F2F2F2]">{f.icon}</div>
              <h3 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">{f.title[lang]}</h3>
              <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed">{f.desc[lang]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
