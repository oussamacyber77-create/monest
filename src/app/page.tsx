"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
<<<<<<< HEAD
import { Users, Video, Target, Brain, Handshake, ChevronLeft } from "lucide-react"
=======
import { Video, Users, BarChart3, ChevronLeft, Package, MessageCircle, RefreshCw } from "lucide-react"
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
import { motion } from "framer-motion"
import { useSettingsStore } from "@/stores/settings-store"
import { MonestLogo } from "@/components/ui/monest-logo"
import { pricingPlans } from "@/lib/mock-data/pricing"

const features = [
  {
    key: "community",
    icon: <Users size={24} />,
    title: { ar: "مجتمع تجار حقيقي", en: "Real Merchant Community" },
    desc: {
      ar: "انضم إلى مجتمع حصري من رواد الأعمال والتجار في السعودية. تبادل الخبرات، احصل على دعم حقيقي، وابنِ علاقات تجارية قيّمة.",
      en: "Join an exclusive community of entrepreneurs and merchants in Saudi Arabia. Exchange expertise, get real support, and build valuable business relationships.",
    },
    href: "/auth/pricing",
  },
  {
    key: "meetings",
    icon: <Video size={24} />,
    title: { ar: "اجتماعات منظّمة", en: "Organized Meetings" },
    desc: {
      ar: "اجتماعات أسبوعية وفردية منظّمة مع فريق Monest عبر الموقع مباشرة. لا مزيد من التشتت بين ديسكورد وجوجل ميت وواتساب — كل شيء في مكان واحد.",
      en: "Weekly and individual organized meetings with the Monest team directly through the website. No more scattering across Discord, Google Meet, and WhatsApp — everything in one place.",
    },
    href: "/meetings",
  },
  {
    key: "coaching",
    icon: <Target size={24} />,
    title: { ar: "تدريب وتوجيه شخصي", en: "Personal Coaching" },
    desc: {
      ar: "تدريب فردي وجلسات توجيهية مخصصة لمساعدتك على تحقيق أهداف متجرك. التسويق، التخزين، التسعير، واستراتيجيات النمو.",
      en: "One-on-one coaching and guidance sessions to help you achieve your store's goals: marketing, inventory, pricing, and growth strategies.",
    },
    href: "/register",
  },
  {
    key: "ai-monitoring",
    icon: <Brain size={24} />,
    title: { ar: "متابعة بالذكاء الاصطناعي", en: "AI-Powered Monitoring" },
    desc: {
      ar: "اربط متجرك بـ Salla واحصل على متابعة ذكية لمؤشرات أدائك. تحليلات آنية، توصيات ذكية، وتقارير أرباح متوقعة — كل ذلك من نفس حساب العضوية.",
      en: "Connect your Salla store and get smart monitoring of your performance metrics. Real-time analytics, smart recommendations, and profit forecasts — all from the same membership account.",
    },
    href: "/monest",
  },
  {
    key: "in-person",
    icon: <Handshake size={24} />,
    title: { ar: "لقاءات حضورية", en: "In-Person Gatherings" },
    desc: {
      ar: "لقاءات وجهاً لوجه ولقاءات افتراضية تجمع أعضاء المجتمع. تواصل حقيقي وتبادل خبرات عملية في أجواء مهنية.",
      en: "Face-to-face and virtual gatherings for community members. Real connections and practical experience sharing in a professional atmosphere.",
    },
    href: "/register",
  },
]

export default function Home() {
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Disclaimer Banner */}
        <div className="bg-[#E8E8E8] dark:bg-[#1A1A1A] px-6 py-3">
          <p className="text-xs text-[#666666] dark:text-[#999999] max-w-4xl mx-auto text-center leading-relaxed">
            {lang === "ar"
              ? "تنويه: قد تختلف النتائج من شخص لآخر. نستخدم الأمثلة لأغراض التوضيح فقط. ستختلف نتائجك وتعتمد على عوامل عديدة. إذا لم تكن مستعداً لذلك، يُرجى عدم الاشتراك."
              : "Disclaimer: Results may vary from person to person. Examples are for illustration only. Your results will depend on various factors. If you are not prepared for this, please do not subscribe."}
          </p>
        </div>

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
  {lang === "ar" ? (
    <>
      مجتمع Monest
      <span className="block mt-6">
        دائرة رواد أعمال الحقيقية
      </span>
    </>
  ) : (
    <>
      Monest Community
      <span className="block mt-6">
        A Real Entrepreneur Network
      </span>
    </>
  )}
</h1>
            <p className="text-lg md:text-xl text-[#666666] dark:text-[#999999] max-w-2xl mx-auto mb-8 leading-relaxed">
              {lang === "ar"
                ? "متابعة منظّمة، اجتماعات أسبوعية وفردية، وتدريب شخصي لمساعدتك على النجاح في تجارتك الإلكترونية. كل ذلك في مجتمع واحد."
                : "Organized follow-up, weekly and individual meetings, and personal coaching to help you succeed in your e-commerce business. All in one community."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => router.push("/register")}
                className="h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {lang === "ar" ? "انضم إلى المجتمع" : "Join the Community"}
              </button>
              <button
                onClick={() => router.push("/auth/pricing")}
                className="h-12 px-8 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                {lang === "ar" ? "عرض الباقات" : "View Plans"}
              </button>
            </div>
          </motion.div>
        </section>

        {/* لماذا Monest */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 md:p-12">
                <h2 className="text-sm font-bold text-[#666666] dark:text-[#999999] mb-3 tracking-widest uppercase">
                  {lang === "ar" ? "لماذا Monest" : "Why Monest"}
                </h2>
                <p className="text-lg leading-relaxed text-[#0D0D0D] dark:text-[#F2F2F2] whitespace-pre-line">
                  {lang === "ar"
                    ? "كانت اجتماعات المتابعة مع فريق Monest ومدرّبيه تحدث بشكل عشوائي ومبعثر — عبر ديسكورد، جوجل ميت، وواتساب. لم يكن هناك مكان واحد منظّم لحجز الاجتماعات وحضورها ومتابعة نتائجها.\n\nلهذا أنشأنا Monest: مجتمع ومنصة متكاملة تجمع كل شيء في مكان واحد — جدولة الاجتماعات، الحضور المباشر، متابعة التقدّم، وتحليلات متجرك بالذكاء الاصطناعي."
                    : "Follow-up meetings with the Monest team and coaches used to happen randomly — scattered across Discord, Google Meet, and WhatsApp. There was no single organized place to book, attend, and track progress.\n\nThat's why we built Monest: a complete community and platform that brings everything together — meeting scheduling, live attendance, progress tracking, and AI-powered store analytics."}
                </p>
              </div>
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-8 md:p-12 flex flex-col justify-center gap-6">
                {[
                  { label: { ar: "عضو في المجتمع", en: "Community Members" }, value: "340+" },
                  { label: { ar: "اجتماع شهري", en: "Monthly Meetings" }, value: "1,200+" },
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
                {lang === "ar" ? "مزايا عضوية Monest" : "Monest Membership Benefits"}
              </h2>
              <p className="text-sm text-[#666666] dark:text-[#999999]">
                {lang === "ar" ? "كل ما تحتاجه لتنمية متجرك في مكان واحد" : "Everything you need to grow your store in one place"}
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
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6">
                <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
                  {lang === "ar" ? "الاشتراك المتكرر" : "Subscription"}
                </h3>
                <div className="space-y-2">
                  {pricingPlans.subscription.map((p) => (
                    <div key={p.key} className="flex items-center justify-between py-1">
                      <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{p.key}</span>
<<<<<<< HEAD
                      <span className="text-sm font-bold text-[#666666] dark:text-[#999999]">{p.price.toLocaleString()} $</span>
=======
                      <span className="text-sm font-bold text-[#666666] dark:text-[#999999]">{p.price.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-6">
                <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">
                  {lang === "ar" ? "الباقات الدائمة" : "Lifetime (Best)"}
                </h3>
                <div className="space-y-2">
                  {pricingPlans.lifetime.map((p) => (
                    <div key={p.key} className="flex items-center justify-between py-1">
                      <div>
                        <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">{p.key}</span>
<<<<<<< HEAD
                        {p.originalPrice && <span className="text-xs text-[#999999] line-through me-1">{p.originalPrice.toLocaleString()} $</span>}
                      </div>
                      <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.price.toLocaleString()} $</span>
=======
                        {p.originalPrice && <span className="text-xs text-[#999999] line-through me-1">{p.originalPrice.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>}
                      </div>
                      <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.price.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
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
              {lang === "ar" ? "انضم إلى مجتمع Monest اليوم" : "Join the Monest Community Today"}
            </h2>
            <p className="text-sm text-[#666666] dark:text-[#999999] mb-8 max-w-lg mx-auto">
              {lang === "ar"
                ? "أكثر من 340 تاجراً يثقون في Monest لمتابعة وتنمية متاجرهم. احجز مقعدك الآن."
                : "Over 340 merchants trust Monest to follow up and grow their stores. Book your spot now."}
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
<<<<<<< HEAD
        <footer className="border-t border-[#D4D4D4] dark:border-[#333333] px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MonestLogo width={20} height={20} className="text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
              <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">Monest</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#999999]">
              <Link href="/auth/pricing" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                {lang === "ar" ? "الباقات" : "Pricing"}
=======
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
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
              </Link>
              <Link href="/consulting" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                {lang === "ar" ? "استشارات" : "Consulting"}
              </Link>
              <Link href="/refund-policy" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                {lang === "ar" ? "الاستبدال والاسترجاع" : "Returns"}
              </Link>
              <Link href="/important-notice" className="hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                {lang === "ar" ? "تنويه" : "Notice"}
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
    </>
  )
}
