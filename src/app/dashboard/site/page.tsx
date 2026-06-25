"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import {
  Users, ShoppingCart, FolderTree, GitBranch, Package, Webhook,
  CreditCard, Receipt, Truck, Megaphone, BarChart3, Activity,
  Tag, Star, ChevronRight, Search
} from "lucide-react"

interface Section {
  key: string
  icon: React.ElementType
  label: { ar: string; en: string }
  desc: { ar: string; en: string }
  count?: string
  color: string
  bgColor: string
}

const sections: Section[] = [
  { key: "customers", icon: Users, label: { ar: "إدارة العملاء", en: "Customers" }, desc: { ar: "عرض وإدارة جميع العملاء المسجلين", en: "View and manage all registered customers" }, count: "128", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  { key: "orders", icon: ShoppingCart, label: { ar: "إدارة الطلبات", en: "Orders" }, desc: { ar: "متابعة وإدارة جميع الطلبات", en: "Track and manage all orders" }, count: "342", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
  { key: "carts", icon: FolderTree, label: { ar: "إدارة السلات", en: "Carts" }, desc: { ar: "متابعة سلات التسوق النشطة", en: "Track active shopping carts" }, count: "56", color: "text-violet-600", bgColor: "bg-violet-50 dark:bg-violet-900/20" },
  { key: "branches", icon: GitBranch, label: { ar: "إدارة الفروع", en: "Branches" }, desc: { ar: "إدارة فروع متجرك", en: "Manage your store branches" }, count: "3", color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-900/20" },
  { key: "products", icon: Package, label: { ar: "إدارة المنتجات", en: "Products" }, desc: { ar: "إدارة المخزون والمنتجات", en: "Manage inventory and products" }, count: "1,247", color: "text-rose-600", bgColor: "bg-rose-50 dark:bg-rose-900/20" },
  { key: "webhooks", icon: Webhook, label: { ar: "Webhooks", en: "Webhooks" }, desc: { ar: "إدارة التنبيهات والاتصالات الخارجية", en: "Manage webhooks and external connections" }, count: "8", color: "text-cyan-600", bgColor: "bg-cyan-50 dark:bg-cyan-900/20" },
  { key: "payments", icon: CreditCard, label: { ar: "إدارة المدفوعات", en: "Payments" }, desc: { ar: "عرض المدفوعات والمعاملات المالية", en: "View payments and transactions" }, count: "318", color: "text-indigo-600", bgColor: "bg-indigo-50 dark:bg-indigo-900/20" },
  { key: "taxes", icon: Receipt, label: { ar: "إدارة الضرائب", en: "Taxes" }, desc: { ar: "إعدادات الضرائب ونسبها", en: "Tax settings and rates" }, color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  { key: "shipping", icon: Truck, label: { ar: "إدارة الشحن", en: "Shipping" }, desc: { ar: "إعدادات الشحن والتوصيل", en: "Shipping and delivery settings" }, color: "text-teal-600", bgColor: "bg-teal-50 dark:bg-teal-900/20" },
  { key: "marketing", icon: Megaphone, label: { ar: "إدارة التسويق", en: "Marketing" }, desc: { ar: "الحملات التسويقية والإعلانات", en: "Marketing campaigns and ads" }, color: "text-pink-600", bgColor: "bg-pink-50 dark:bg-pink-900/20" },
  { key: "reports", icon: BarChart3, label: { ar: "التقارير", en: "Reports" }, desc: { ar: "تقارير شاملة لأداء المتجر", en: "Comprehensive store reports" }, color: "text-slate-600", bgColor: "bg-slate-50 dark:bg-slate-900/20" },
  { key: "analytics", icon: Activity, label: { ar: "التحليلات", en: "Analytics" }, desc: { ar: "تحليلات متقدمة للبيانات", en: "Advanced data analytics" }, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
  { key: "coupons", icon: Tag, label: { ar: "القسائم والخصومات", en: "Coupons & Discounts" }, desc: { ar: "إدارة القسائم والعروض", en: "Manage coupons and offers" }, count: "15", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
  { key: "reviews", icon: Star, label: { ar: "التقييمات", en: "Reviews" }, desc: { ar: "عرض وإدارة تقييمات العملاء", en: "View and manage customer reviews" }, count: "89", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
]

export default function SiteManagementPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [search, setSearch] = useState("")

  const filtered = sections.filter((s) =>
    s.label[lang].includes(search) || s.label.en.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "إدارة الموقع" : "Site Management"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "تحكم كامل بجميع جوانب متجرك" : "Full control over all aspects of your store"}
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#999999]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
            className="w-full h-11 ps-9 pe-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((s) => (
          <button
            key={s.key}
            className="group p-5 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:border-[#0D0D0D] dark:hover:border-[#F2F2F2] transition-all text-start relative overflow-hidden"
          >
            <div className={"w-11 h-11 rounded-lg flex items-center justify-center mb-3 " + s.bgColor}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">{s.label[lang]}</p>
            <p className="text-xs text-[#999999] leading-relaxed">{s.desc[lang]}</p>
            <div className="flex items-center justify-between mt-3">
              {s.count && (
                <span className="text-xs font-bold text-[#666666] dark:text-[#999999]">{s.count}</span>
              )}
              <ChevronRight size={14} className="text-[#D4D4D4] dark:text-[#333333] group-hover:text-[#0D0D0D] dark:group-hover:text-[#F2F2F2] transition-colors ms-auto" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
