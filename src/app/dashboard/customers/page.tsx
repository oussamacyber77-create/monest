"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { customerSegments, type CustomerSegment } from "@/lib/mock-data/dashboard"

const campaignMessages = [
  { title: { ar: "حملة استعادة العملاء الخاملين", en: "Inactive Customer Reactivation" }, message: { ar: "عزيزنا العميل، نشتاق لك! 🎉 خصم 20% على أول طلب لك بعد غياب. استخدم الكود: MONEST20", en: "Dear customer, we miss you! 🎉 Get 20% off your next order. Use code: MONEST20" }, channel: "WhatsApp" },
  { title: { ar: "حملة ترحيب العملاء الجدد", en: "New Customer Welcome" }, message: { ar: "أهلاً بك في Monest! 🚀 أول طلب لك معنا بخاصية التوصيل المجاني. تسوّق الآن!", en: "Welcome to Monest! 🚀 Your first order ships free. Shop now!" }, channel: "Email" },
  { title: { ar: "حملة VIP للعملاء الدائمين", en: "VIP Loyal Customer" }, message: { ar: "شكراً لولائك! 🌟 خصم 15% حصري لك على جميع المنتجات. عرض ينتهي قريباً.", en: "Thank you for your loyalty! 🌟 Exclusive 15% off all products. Limited time offer." }, channel: "SMS" },
  { title: { ar: "حملة استعادة العملاء المهددين بالمغادرة", en: "At-Risk Customer Recovery" }, message: { ar: "نلاحظ أنك لم تزرنا منذ فترة. نقدم لك عرض خاص: خصم 25% على طلبك القادم. لا تفوّت الفرصة!", en: "We noticed you haven't visited lately. Here's a special offer: 25% off your next order. Don't miss out!" }, channel: "WhatsApp" },
]

export default function CustomersPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [selectedSegment, setSelectedSegment] = useState<string>("all")
  const [campaignSent, setCampaignSent] = useState<number | null>(null)

  const filteredSegments = selectedSegment === "all" ? customerSegments : customerSegments.filter((s) => s.label.en.toLowerCase() === selectedSegment)

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "مركز العملاء" : "Customer Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "تصنيف وتحليل العملاء بالذكاء الاصطناعي" : "AI-powered customer classification & analysis"}
        </p>
      </div>

      <div className="flex gap-1">
        <button onClick={() => setSelectedSegment("all")} className={"px-4 py-2 text-sm font-medium transition-colors " + (selectedSegment === "all" ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]")}>
          {lang === "ar" ? "الكل" : "All"}
        </button>
        {customerSegments.map((s) => (
          <button key={s.label.en} onClick={() => setSelectedSegment(s.label.en.toLowerCase())} className={"px-4 py-2 text-sm font-medium transition-colors " + (selectedSegment === s.label.en.toLowerCase() ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]")}>
            {s.label[lang]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        {filteredSegments.map((s) => (
          <div key={s.label.en} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
            <p className="text-xs text-[#666666] dark:text-[#999999] mb-1">{s.label[lang]}</p>
            <p className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.count}</p>
            <p className="text-xs text-[#666666] dark:text-[#999999] mt-1">{s.percentage}%</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
          {lang === "ar" ? "حملات AI تلقائية" : "AI Auto Campaigns"}
        </h2>
        <div className="grid gap-px bg-[#D4D4D4] dark:bg-[#333333]">
          {campaignMessages.map((c, i) => (
            <div key={i} className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#E8E8E8] dark:bg-[#333333] text-[#666666] dark:text-[#999999]">{c.channel}</span>
                    <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{c.title[lang]}</h3>
                  </div>
                  <p className="text-sm text-[#666666] dark:text-[#999999]">{c.message[lang]}</p>
                </div>
                <button
                  onClick={() => { setCampaignSent(i); setTimeout(() => setCampaignSent(null), 2000) }}
                  className="px-4 py-2 text-sm font-medium bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC] transition-colors shrink-0"
                >
                  {campaignSent === i ? (lang === "ar" ? "أُرسلت!" : "Sent!") : (lang === "ar" ? "إرسال الحملة" : "Send Campaign")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
