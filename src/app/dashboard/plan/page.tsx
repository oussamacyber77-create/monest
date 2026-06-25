"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { Crown, CalendarDays, Clock, Check, CreditCard, TrendingUp, Video, MessageCircle, ShoppingBag, Users, ArrowUp, ArrowDown, Download, RefreshCw } from "lucide-react"

export default function PlanPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [tab, setTab] = useState<"plan" | "benefits">("plan")

  const invoices = [
    { id: "INV-001", date: "2026-05-01", amount: 4999, status: "paid" },
    { id: "INV-002", date: "2026-06-01", amount: 4999, status: "paid" },
    { id: "INV-003", date: "2026-07-01", amount: 4999, status: "pending" },
  ]

  const benefits = [
    { icon: Video, label: { ar: "اجتماعات", en: "Meetings" }, before: 0, after: 24 },
    { icon: MessageCircle, label: { ar: "رسائل في الكومينتي", en: "Community Messages" }, before: 0, after: 187 },
    { icon: ShoppingBag, label: { ar: "منتجات محللة", en: "Products Analyzed" }, before: 0, after: 1247 },
    { icon: Users, label: { ar: "عملاء محللين", en: "Customers Analyzed" }, before: 0, after: 340 },
    { icon: TrendingUp, label: { ar: "توصيات AI", en: "AI Recommendations" }, before: 0, after: 89 },
    { icon: CreditCard, label: { ar: "إيرادات متوقعة", en: "Expected Revenue" }, before: "0 ر.س", after: "+28,500 ر.س" },
  ]

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "الباقة" : "Subscription"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إدارة باقتك والاستفادة من المنصة" : "Manage your plan and platform benefits"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1 max-w-sm">
        <button onClick={() => setTab("plan")} className={"flex-1 py-2.5 text-xs font-medium transition-colors " + (tab === "plan" ? "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}>
          {lang === "ar" ? "الباقة" : "Plan"}
        </button>
        <button onClick={() => setTab("benefits")} className={"flex-1 py-2.5 text-xs font-medium transition-colors " + (tab === "benefits" ? "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}>
          {lang === "ar" ? "الاستفادة من المنصة" : "Platform Benefits"}
        </button>
      </div>

      {tab === "plan" && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center">
                  <Crown size={22} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {lang === "ar" ? "الباقة الأساسية الدائمة" : "Lifetime Basic Plan"}
                  </p>
                  <p className="text-xs text-[#999999]">{lang === "ar" ? "مدى الحياة - دفع لمرة واحدة" : "Lifetime - One-time payment"}</p>
                </div>
              </div>
              <span className="px-3 py-1 text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                {lang === "ar" ? "نشط" : "Active"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "تاريخ البدء" : "Start Date"}</p>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">2026-05-01</p>
              </div>
              <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "تاريخ الانتهاء" : "End Date"}</p>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "غير محدد (مدى الحياة)" : "Unlimited (Lifetime)"}</p>
              </div>
              <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "المتبقي" : "Remaining"}</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{lang === "ar" ? "غير محدد" : "Unlimited"}</p>
              </div>
              <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "المبلغ المدفوع" : "Amount Paid"}</p>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">4,999 ر.س</p>
              </div>
            </div>

            {/* Community Membership */}
            <div className="p-4 bg-[#F2F2F2] dark:bg-[#1A1A1A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                <span className="text-sm text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar" ? "عضوية المجتمع" : "Community Membership"}
                </span>
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check size={12} /> {lang === "ar" ? "مفعلة" : "Active"}
              </span>
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
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
                    <p className="text-xs text-[#999999]">{inv.date} • {inv.amount.toLocaleString("en-US")} ر.س</p>
                  </div>
                  <span className={"px-2 py-0.5 text-[10px] font-bold " + (inv.status === "paid" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400")}>
                    {inv.status === "paid" ? (lang === "ar" ? "مدفوع" : "Paid") : (lang === "ar" ? "قيد الانتظار" : "Pending")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade */}
          <div className="p-5 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ترقية الباقة" : "Upgrade Plan"}
              </p>
              <p className="text-xs text-[#999999]">
                {lang === "ar" ? "اطلع على الباقات المتاحة للترقية" : "Check available plans for upgrade"}
              </p>
            </div>
            <button className="h-10 px-5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-80 transition-opacity">
              {lang === "ar" ? "عرض الباقات" : "View Plans"}
            </button>
          </div>
        </div>
      )}

      {tab === "benefits" && (
        <div className="space-y-6">
          {/* AI Summary */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
                  {lang === "ar" ? "قبل وبعد الاشتراك" : "Before vs After Subscription"}
                </p>
                <p className="text-xs text-[#666666] dark:text-[#999999]">
                  {lang === "ar"
                    ? "منذ انضمامك، حققت تقدماً ملحوظاً في إدارة متجرك. إليك ملخص إنجازاتك:"
                    : "Since joining, you've made remarkable progress managing your store. Here's your summary:"}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b.label.en} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center">
                    <b.icon size={20} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  </div>
                  <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{b.label[lang]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "قبل" : "Before"}</p>
                    <p className="text-sm font-bold text-[#999999]">{b.before}</p>
                  </div>
                  <ArrowUp size={16} className="text-green-500 mx-2" />
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-[#999999] mb-1">{lang === "ar" ? "بعد" : "After"}</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{b.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform activity summary */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
              {lang === "ar" ? "نشاطك على المنصة" : "Your Platform Activity"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Video, label: { ar: "اجتماعات حضرتها", en: "Meetings Attended" }, value: "24", color: "text-blue-500" },
                { icon: MessageCircle, label: { ar: "رسائل أرسلتها", en: "Messages Sent" }, value: "187", color: "text-violet-500" },
                { icon: ShoppingBag, label: { ar: "توصيات نفذتها", en: "Recommendations Applied" }, value: "43", color: "text-emerald-500" },
                { icon: TrendingUp, label: { ar: "نمو المبيعات", en: "Sales Growth" }, value: "+28%", color: "text-green-500" },
              ].map((item) => (
                <div key={item.label.en} className="p-4 bg-[#F2F2F2] dark:bg-[#1A1A1A] text-center">
                  <item.icon size={24} className={"mx-auto mb-2 " + item.color} />
                  <p className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{item.value}</p>
                  <p className="text-[10px] text-[#999999]">{item.label[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
