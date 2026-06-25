"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import {
  Users, ShoppingCart, FolderTree, GitBranch, Package, Webhook,
  CreditCard, Receipt, Truck, Megaphone, BarChart3, Activity,
  Tag, Star, ChevronRight, ArrowLeft, Search, Plus, MoreHorizontal,
  Check, X, Clock, Download, Filter, Mail, Phone, MapPin,
  Eye, Trash2, Edit3, ToggleLeft, ToggleRight, DollarSign, Percent
} from "lucide-react"

const sectionMeta: Record<string, {
  icon: React.ElementType; label: { ar: string; en: string };
  color: string; bgColor: string
}> = {
  customers: { icon: Users, label: { ar: "إدارة العملاء", en: "Customers" }, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  orders: { icon: ShoppingCart, label: { ar: "إدارة الطلبات", en: "Orders" }, color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
  carts: { icon: FolderTree, label: { ar: "إدارة السلات", en: "Carts" }, color: "text-violet-600", bgColor: "bg-violet-50 dark:bg-violet-900/20" },
  branches: { icon: GitBranch, label: { ar: "إدارة الفروع", en: "Branches" }, color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-900/20" },
  products: { icon: Package, label: { ar: "إدارة المنتجات", en: "Products" }, color: "text-rose-600", bgColor: "bg-rose-50 dark:bg-rose-900/20" },
  webhooks: { icon: Webhook, label: { ar: "Webhooks", en: "Webhooks" }, color: "text-cyan-600", bgColor: "bg-cyan-50 dark:bg-cyan-900/20" },
  payments: { icon: CreditCard, label: { ar: "إدارة المدفوعات", en: "Payments" }, color: "text-indigo-600", bgColor: "bg-indigo-50 dark:bg-indigo-900/20" },
  taxes: { icon: Receipt, label: { ar: "إدارة الضرائب", en: "Taxes" }, color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  shipping: { icon: Truck, label: { ar: "إدارة الشحن", en: "Shipping" }, color: "text-teal-600", bgColor: "bg-teal-50 dark:bg-teal-900/20" },
  marketing: { icon: Megaphone, label: { ar: "إدارة التسويق", en: "Marketing" }, color: "text-pink-600", bgColor: "bg-pink-50 dark:bg-pink-900/20" },
  reports: { icon: BarChart3, label: { ar: "التقارير", en: "Reports" }, color: "text-slate-600", bgColor: "bg-slate-50 dark:bg-slate-900/20" },
  analytics: { icon: Activity, label: { ar: "التحليلات", en: "Analytics" }, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
  coupons: { icon: Tag, label: { ar: "القسائم والخصومات", en: "Coupons & Discounts" }, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
  reviews: { icon: Star, label: { ar: "التقييمات", en: "Reviews" }, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
}

// --- Mock data per section ---
const mockData = {
  customers: [
    { id: 1, name: "محمد العبدالله", email: "mohammed@example.com", phone: "+966 55 123 4567", orders: 34, total: 28450, status: "vip", since: "2025-03-12" },
    { id: 2, name: "سارة الحربي", email: "sara@example.com", phone: "+966 55 234 5678", orders: 28, total: 24800, status: "vip", since: "2025-05-20" },
    { id: 3, name: "عبدالرحمن القحطاني", email: "abdul@example.com", phone: "+966 55 345 6789", orders: 25, total: 22150, status: "regular", since: "2025-07-01" },
    { id: 4, name: "نورة الشمري", email: "noura@example.com", phone: "+966 55 456 7890", orders: 22, total: 19600, status: "regular", since: "2025-08-15" },
    { id: 5, name: "فيصل الدوسري", email: "faisal@example.com", phone: "+966 55 567 8901", orders: 19, total: 17300, status: "inactive", since: "2026-01-10" },
    { id: 6, name: "أحمد الزهراني", email: "ahmed@example.com", phone: "+966 55 678 9012", orders: 12, total: 8900, status: "inactive", since: "2026-02-05" },
  ],
  orders: [
    { id: "#ORD-1001", customer: "محمد العبدالله", items: 4, total: 1250, status: "shipped", date: "2026-06-24", payment: "paid" },
    { id: "#ORD-1002", customer: "سارة الحربي", items: 2, total: 780, status: "processing", date: "2026-06-23", payment: "paid" },
    { id: "#ORD-1003", customer: "فيصل الدوسري", items: 1, total: 350, status: "pending", date: "2026-06-22", payment: "pending" },
    { id: "#ORD-1004", customer: "نورة الشمري", items: 3, total: 2100, status: "shipped", date: "2026-06-21", payment: "paid" },
    { id: "#ORD-1005", customer: "أحمد الزهراني", items: 5, total: 3200, status: "cancelled", date: "2026-06-20", payment: "refund" },
  ],
  carts: [
    { id: 1, customer: "خالد المطيري", items: 3, total: 890, created: "2026-06-25", status: "active", email: "khaled@example.com" },
    { id: 2, customer: "منى الغامدي", items: 1, total: 250, created: "2026-06-24", status: "active", email: "mona@example.com" },
    { id: 3, customer: "سامي العتيبي", items: 7, total: 3450, created: "2026-06-23", status: "abandoned", email: "sami@example.com" },
    { id: 4, customer: "هند الشهراني", items: 2, total: 520, created: "2026-06-22", status: "active", email: "hind@example.com" },
  ],
  branches: [
    { id: 1, name: "الفرع الرئيسي - الرياض", address: "حي العليا، شارع التخصصي", phone: "+966 11 234 5678", employees: 12, status: "active" },
    { id: 2, name: "فرع جدة", address: "شارع الملك عبدالعزيز، حي الشاطئ", phone: "+966 12 345 6789", employees: 8, status: "active" },
    { id: 3, name: "فرع الدمام", address: "شارع الأمير محمد بن فهد", phone: "+966 13 456 7890", employees: 5, status: "active" },
  ],
  products: [
    { id: 1, name: "منتج ألفا", price: 299, stock: 45, sales: 120, status: "active", revenue: 35880 },
    { id: 2, name: "منتج بيتا", price: 199, stock: 78, sales: 95, status: "active", revenue: 18905 },
    { id: 3, name: "منتج جاما", price: 499, stock: 12, sales: 60, status: "low", revenue: 29940 },
    { id: 4, name: "منتج دلتا", price: 149, stock: 0, sales: 30, status: "out", revenue: 4470 },
  ],
  webhooks: [
    { id: 1, name: "Webhook الطلبات الجديدة", url: "https://api.example.com/orders/new", events: "order.created", status: "active", last: "2026-06-25 14:30" },
    { id: 2, name: "Webhook المدفوعات", url: "https://api.example.com/payments", events: "payment.completed", status: "active", last: "2026-06-25 13:15" },
    { id: 3, name: "Webhook العملاء", url: "https://api.example.com/customers", events: "customer.created", status: "inactive", last: "2026-06-20" },
  ],
  payments: [
    { id: "#PAY-001", order: "#ORD-1001", method: "مدى", amount: 1250, status: "completed", date: "2026-06-24" },
    { id: "#PAY-002", order: "#ORD-1002", method: "Visa", amount: 780, status: "completed", date: "2026-06-23" },
    { id: "#PAY-003", order: "#ORD-1004", method: "Apple Pay", amount: 2100, status: "completed", date: "2026-06-21" },
    { id: "#PAY-004", order: "#ORD-1005", method: "Mastercard", amount: 3200, status: "refunded", date: "2026-06-20" },
  ],
  taxes: [
    { id: 1, name: "ضريبة القيمة المضافة", rate: "15%", type: "VAT", region: "السعودية", status: "active" },
    { id: 2, name: "ضريبة خاصة", rate: "0%", type: "Custom", region: "الخليج", status: "inactive" },
  ],
  shipping: [
    { id: 1, name: "الشحن السريع", cost: 35, minDays: 1, maxDays: 3, regions: "جميع المناطق", status: "active" },
    { id: 2, name: "الشحن العادي", cost: 15, minDays: 3, maxDays: 7, regions: "جميع المناطق", status: "active" },
    { id: 3, name: "الشحن المجاني", cost: 0, minDays: 5, maxDays: 10, regions: "للطلبات فوق 299 ر.س", status: "active" },
  ],
  marketing: [
    { name: "حملة العيد", platform: "Google Ads", spend: 3200, revenue: 12800, roas: 4.0, status: "active" },
    { name: "تخفيضات الصيف", platform: "Meta Ads", spend: 2500, revenue: 8750, roas: 3.5, status: "active" },
    { name: "إطلاق منتج جديد", platform: "TikTok Ads", spend: 1800, revenue: 4500, roas: 2.5, status: "paused" },
  ],
  reports: [
    { name: "تقرير المبيعات الشهري", type: "PDF", date: "2026-06-25", size: "2.4 MB", downloads: 12 },
    { name: "تقرير العملاء ربع السنوي", type: "PDF", date: "2026-06-20", size: "1.8 MB", downloads: 8 },
    { name: "تقرير المخزون", type: "XLSX", date: "2026-06-15", size: "3.1 MB", downloads: 5 },
  ],
  analytics: [
    { metric: "إجمالي الزوار", value: "12,847", change: "+12%", period: "30 يوم" },
    { metric: "معدل الارتداد", value: "34.2%", change: "-3%", period: "30 يوم" },
    { metric: "الصفحات لكل جلسة", value: "4.7", change: "+0.8", period: "30 يوم" },
    { metric: "معدل التحويل", value: "3.8%", change: "+0.6%", period: "30 يوم" },
  ],
  coupons: [
    { id: 1, code: "WELCOME20", discount: "20%", type: "percentage", min: 100, used: 45, max: 100, expires: "2026-12-31", status: "active" },
    { id: 2, code: "SUMMER50", discount: "50 ر.س", type: "fixed", min: 200, used: 23, max: 50, expires: "2026-08-31", status: "active" },
    { id: 3, code: "VIP15", discount: "15%", type: "percentage", min: 0, used: 12, max: 200, expires: "2026-07-15", status: "active" },
    { id: 4, code: "OLD10", discount: "10%", type: "percentage", min: 50, used: 89, max: 100, expires: "2026-05-01", status: "expired" },
  ],
  reviews: [
    { id: 1, customer: "محمد العبدالله", product: "منتج ألفا", rating: 5, text: "منتج رائع جداً، أنصح به", date: "2026-06-20", status: "approved" },
    { id: 2, customer: "سارة الحربي", product: "منتج بيتا", rating: 4, text: "جيد لكن يحتاج تحسين في التغليف", date: "2026-06-18", status: "approved" },
    { id: 3, customer: "فيصل الدوسري", product: "منتج جاما", rating: 1, text: "لم يعجبني المنتج، طلبت استرجاع", date: "2026-06-15", status: "pending" },
    { id: 4, customer: "نورة الشمري", product: "منتج دلتا", rating: 5, text: "أفضل منتج اشتريته!", date: "2026-06-12", status: "approved" },
  ],
}

export default function SiteSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params)
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [search, setSearch] = useState("")
  const meta = sectionMeta[section]

  if (!meta) return <div className="flex-1 p-8 text-center text-[#999999]">{lang === "ar" ? "الصفحة غير موجودة" : "Page not found"}</div>

  const data = (mockData as any)[section] || []

  const filterData = (items: any[]) => {
    if (!search) return items
    return items.filter((item: any) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    )
  }

  const renderStatus = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      inactive: "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400",
      paused: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      shipped: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      processing: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
      cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      refund: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
      refunded: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
      vip: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      regular: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      low: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      out: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      approved: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      expired: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      abandoned: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    }
    return <span className={"px-2 py-0.5 text-[10px] font-bold rounded " + (colors[status] || "bg-gray-100 text-gray-600")}>{status === "vip" ? "VIP" : status === "out" ? "نفذ" : status === "low" ? "مخزون منخفض" : status === "active" ? "نشط" : status === "inactive" ? "غير نشط" : status === "abandoned" ? "متروك" : status === "paid" ? "مدفوع" : status === "pending" ? "قيد الانتظار" : status === "completed" ? "مكتمل" : status === "shipped" ? "تم الشحن" : status === "processing" ? "قيد المعالجة" : status === "cancelled" ? "ملغي" : status === "refund" || status === "refunded" ? "مسترجع" : status === "approved" ? "مقبول" : status === "expired" ? "منتهي" : status === "paused" ? "متوقف" : status === "regular" ? "عادي" : status}</span>
  }

  const renderPage = () => {
    switch (section) {
      case "customers":
        return (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "جميع العملاء" : "All Customers"} ({filterData(data).length})</p>
              <button className="h-8 px-3 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-[10px] font-bold flex items-center gap-1"><Plus size={12} /> {lang === "ar" ? "إضافة" : "Add"}</button>
            </div>
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0"><Users size={15} className="text-[#666666]" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{c.name}</p>
                      <p className="text-[10px] text-[#999999]">{c.email} • {c.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-end">
                    <div>
                      <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{c.total.toLocaleString("en-US")} ر.س</p>
                      <p className="text-[10px] text-[#999999]">{c.orders} {lang === "ar" ? "طلبات" : "orders"}</p>
                    </div>
                    {renderStatus(c.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "orders":
        return (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "جميع الطلبات" : "All Orders"} ({filterData(data).length})</p>
              <button className="h-8 px-3 border border-[#D4D4D4] dark:border-[#333333] text-[10px] font-medium text-[#666666] flex items-center gap-1"><Filter size={12} /> {lang === "ar" ? "تصفية" : "Filter"}</button>
            </div>
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0"><ShoppingCart size={15} className="text-[#666666]" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{o.id}</p>
                      <p className="text-[10px] text-[#999999]">{o.customer} • {o.items} {lang === "ar" ? "أصناف" : "items"} • {o.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{o.total.toLocaleString("en-US")} ر.س</span>
                    {renderStatus(o.status)}
                    <button className="p-1 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"><Eye size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "carts":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {filterData(data).map((c: any) => (
              <div key={c.id} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{c.customer}</p>
                  {renderStatus(c.status)}
                </div>
                <div className="space-y-1 text-xs text-[#666666] dark:text-[#999999]">
                  <p>{c.items} {lang === "ar" ? "منتج" : "products"} • {c.total.toLocaleString("en-US")} ر.س</p>
                  <p>{c.email} • {c.created}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 h-8 text-[10px] font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">{lang === "ar" ? "عرض" : "View"}</button>
                  {c.status === "abandoned" && <button className="flex-1 h-8 text-[10px] font-medium bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]">{lang === "ar" ? "إرسال تذكير" : "Send Reminder"}</button>}
                </div>
              </div>
            ))}
          </div>
        )

      case "branches":
        return (
          <div className="grid md:grid-cols-3 gap-4">
            {filterData(data).map((b: any) => (
              <div key={b.id} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-amber-500" />
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{b.name}</p>
                </div>
                <div className="space-y-1 text-xs text-[#666666] dark:text-[#999999]">
                  <p>{b.address}</p>
                  <p className="flex items-center gap-1"><Phone size={11} /> {b.phone}</p>
                  <p>{b.employees} {lang === "ar" ? "موظف" : "employees"}</p>
                </div>
                <div className="mt-3">{renderStatus(b.status)}</div>
              </div>
            ))}
          </div>
        )

      case "products":
        return (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المنتجات" : "Products"} ({filterData(data).length})</p>
              <button className="h-8 px-3 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-[10px] font-bold flex items-center gap-1"><Plus size={12} /> {lang === "ar" ? "إضافة" : "Add"}</button>
            </div>
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Package size={20} className="text-[#666666] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</p>
                      <p className="text-[10px] text-[#999999]">{p.price} ر.س • {p.stock} {lang === "ar" ? "مخزون" : "in stock"} • {p.sales} {lang === "ar" ? "مبيعات" : "sales"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.revenue.toLocaleString("en-US")} ر.س</span>
                    {renderStatus(p.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "webhooks":
        return (
          <div className="space-y-4">
            <button className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold flex items-center gap-1.5"><Plus size={14} /> {lang === "ar" ? "إضافة Webhook" : "Add Webhook"}</button>
            <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((w: any) => (
                <div key={w.id} className="p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{w.name}</p>
                    {renderStatus(w.status)}
                  </div>
                  <p className="text-[10px] text-[#999999] font-mono break-all">{w.url}</p>
                  <p className="text-[10px] text-[#999999] mt-1">{w.events} • {lang === "ar" ? "آخر تحديث" : "Last"}: {w.last}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "payments":
        return (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المدفوعات" : "Payments"} ({filterData(data).length})</p>
            </div>
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-[#666666]" />
                    <div>
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.id}</p>
                      <p className="text-[10px] text-[#999999]">{p.order} • {p.method} • {p.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.amount.toLocaleString("en-US")} ر.س</span>
                    {renderStatus(p.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "taxes":
        return (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الضرائب" : "Taxes"}</p>
              <button className="h-8 px-3 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-[10px] font-bold"><Plus size={12} /> {lang === "ar" ? "إضافة" : "Add"}</button>
            </div>
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{t.name}</p>
                    <p className="text-[10px] text-[#999999]">{t.type} • {t.region}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{t.rate}</span>
                    {renderStatus(t.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "shipping":
        return (
          <div className="grid md:grid-cols-3 gap-4">
            {filterData(data).map((s: any) => (
              <div key={s.id} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Truck size={18} className="text-teal-500" />
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.name}</p>
                </div>
                <div className="space-y-1 text-xs text-[#666666] dark:text-[#999999]">
                  <p>{s.cost === 0 ? (lang === "ar" ? "مجاني" : "Free") : s.cost + " ر.س"}</p>
                  <p>{s.minDays}-{s.maxDays} {lang === "ar" ? "أيام" : "days"}</p>
                  <p>{s.regions}</p>
                </div>
                <div className="mt-3">{renderStatus(s.status)}</div>
              </div>
            ))}
          </div>
        )

      case "marketing":
        return (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]"><p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الحملات التسويقية" : "Marketing Campaigns"}</p></div>
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filterData(data).map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-3">
                    <Megaphone size={16} className="text-[#666666]" />
                    <div>
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{c.name}</p>
                      <p className="text-[10px] text-[#999999]">{c.platform} • ROAS {c.roas}x</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-end">
                      <p className="text-xs font-bold text-green-600">{c.revenue.toLocaleString("en-US")} ر.س</p>
                      <p className="text-[10px] text-[#999999]">{lang === "ar" ? "إنفاق" : "spend"}: {c.spend.toLocaleString("en-US")} ر.س</p>
                    </div>
                    {renderStatus(c.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "reports":
        return (
          <div className="grid md:grid-cols-3 gap-4">
            {filterData(data).map((r: any, i: number) => (
              <div key={i} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center"><BarChart3 size={18} className="text-[#666666]" /></div>
                  <div>
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{r.name}</p>
                    <p className="text-[10px] text-[#999999]">{r.type} • {r.size}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#999999] mb-3">
                  <span>{r.date}</span>
                  <span>{r.downloads} {lang === "ar" ? "تحميل" : "downloads"}</span>
                </div>
                <button className="w-full h-8 border border-[#D4D4D4] dark:border-[#333333] text-[10px] font-medium text-[#666666] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-1"><Download size={12} /> {lang === "ar" ? "تحميل" : "Download"}</button>
              </div>
            ))}
          </div>
        )

      case "analytics":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filterData(data).map((a: any, i: number) => (
              <div key={i} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <Activity size={22} className="text-purple-500 mb-3" />
                <p className="text-[10px] text-[#999999] mb-1">{a.metric}</p>
                <p className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{a.value}</p>
                <p className={"text-[10px] mt-1 " + (a.change.startsWith("+") ? "text-green-600" : "text-red-600")}>{a.change} ({a.period})</p>
              </div>
            ))}
          </div>
        )

      case "coupons":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {filterData(data).map((c: any) => (
              <div key={c.id} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] font-mono">{c.code}</p>
                  {renderStatus(c.status)}
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">{c.discount}</p>
                <div className="space-y-1 text-[10px] text-[#999999]">
                  <p>{lang === "ar" ? "أقل طلب" : "Min order"}: {c.min} ر.س • {lang === "ar" ? "استخدم" : "used"}: {c.used}/{c.max}</p>
                  <p>{lang === "ar" ? "ينتهي" : "Expires"}: {c.expires}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case "reviews":
        return (
          <div className="space-y-4">
            {filterData(data).map((r: any) => (
              <div key={r.id} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{r.customer}</p>
                    <p className="text-[10px] text-[#999999]">{r.product} • {r.date}</p>
                  </div>
                  <div className="flex items-center gap-2">{renderStatus(r.status)}<div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "text-yellow-500 fill-yellow-500" : "text-[#D4D4D4]"} />)}</div></div>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#999999]">"{r.text}"</p>
                <div className="flex gap-2 mt-3">
                  {r.status === "pending" && <><button className="h-7 px-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold flex items-center gap-1"><Check size={11} /> {lang === "ar" ? "قبول" : "Approve"}</button><button className="h-7 px-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold flex items-center gap-1"><X size={11} /> {lang === "ar" ? "رفض" : "Reject"}</button></>}
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return <p className="text-center text-[#999999] py-12">{lang === "ar" ? "قيد التطوير" : "Coming soon"}</p>
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/dashboard/site")} className="p-1.5 border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-3">
          <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + meta.bgColor}>
            <meta.icon size={20} className={meta.color} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{meta.label[lang]}</h1>
          </div>
        </div>
        <div className="relative ms-auto w-48">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#999999]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === "ar" ? "بحث..." : "Search..."} className="w-full h-9 ps-8 pe-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
        </div>
      </div>

      {/* Content */}
      {renderPage()}
    </div>
  )
}
