"use client"

import { useSettingsStore } from "@/stores/settings-store"

const refundPolicies = [
  {
    title: { ar: "فترة الإلغاء والاستبدال", en: "Cancellation & Exchange Period" },
    content: {
      ar: "يحق للعميل إلغاء الاشتراك خلال أول 14 يوماً من تاريخ الاشتراك واسترداد المبلغ كاملاً. بعد 14 يوماً، يتم احتساب المتبقي من الفترة بنسبة تناسبية.",
      en: "Customers may cancel their subscription within the first 14 days of purchase for a full refund. After 14 days, a prorated refund is calculated for the remaining period.",
    },
  },
  {
    title: { ar: "الاشتراك مدى الحياة", en: "Lifetime Subscription" },
    content: {
      ar: "بما أن الاشتراك مدى الحياة هو منتج رقمي يُفعّل لمرة واحدة، فلا يمكن استرجاع قيمته بعد التفعيل. يمكن التواصل معنا خلال 7 أيام من تاريخ الشراء إن لم يتم تفعيل الخدمة بعد.",
      en: "Lifetime subscriptions are one-time digital products. Refunds are not available after activation. Contact us within 7 days of purchase if the service hasn't been activated yet.",
    },
  },
  {
    title: { ar: "الباقات الشهرية والسنوية", en: "Monthly & Annual Plans" },
    content: {
      ar: "يمكن إلغاء الباقة الشهرية في أي وقت، ويتوقف التجديد التلقائي دون رسوم إضافية. الباقات السنوية غير قابلة للاسترداد بعد أول 30 يوماً.",
      en: "Monthly plans can be cancelled anytime with no further charges. Annual plans are non-refundable after the first 30 days.",
    },
  },
  {
    title: { ar: "كيفية تقديم طلب الاسترداد", en: "How to Request a Refund" },
    content: {
      ar: "تواصل مع فريق الدعم عبر البريد الإلكتروني support@monest.com مع ذكر سبب الإلغاء ورقم الاشتراك. سيتم الرد على طلبك خلال 5 أيام عمل.",
      en: "Contact our support team at support@monest.com with your cancellation reason and subscription ID. You will receive a response within 5 business days.",
    },
  },
]

export default function RefundPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
          {lang === "ar" ? "سياسة الاستبدال والاسترجاع" : "Returns & Refund Policy"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999] mb-10">
          {lang === "ar" ? "آخر تحديث: 24 يونيو 2026" : "Last updated: June 24, 2026"}
        </p>

        <div className="space-y-8">
          {refundPolicies.map((policy) => (
            <div key={policy.title.en}>
              <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                {policy.title[lang]}
              </h2>
              <p className="text-sm text-[#666666] dark:text-[#999999] leading-relaxed">
                {policy.content[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
