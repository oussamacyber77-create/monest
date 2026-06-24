"use client"

import { useSettingsStore } from "@/stores/settings-store"
import { inventoryItems } from "@/lib/mock-data/dashboard"
import { AlertTriangle, Clock, XCircle } from "lucide-react"

const statusBadge = (status: string, lang: string) => {
  switch (status) {
    case "critical": return "bg-[#DC2626]/20 text-[#DC2626] font-medium"
    case "warning": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-medium"
    case "stagnant": return "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] font-medium"
    default: return "bg-[#E8E8E8] text-[#666666] dark:bg-[#333333] dark:text-[#999999]"
  }
}

export default function InventoryPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "مركز المخزون" : "Inventory Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إدارة المخزون وتنبيهات ذكية" : "Inventory management & smart alerts"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#D4D4D4] dark:border-[#333333]">
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المنتج" : "Product"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المخزون" : "Stock"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "معدل البيع/يوم" : "Daily Sales"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "التنبيه" : "Alert"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item) => (
              <tr key={item.id} className="border-b border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                <td className="py-3 px-3 font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{item.name[lang]}</td>
                <td className="py-3 px-3">
                  <span className={"font-bold " + (item.stock < 50 ? "text-[#DC2626]" : "text-[#0D0D0D] dark:text-[#F2F2F2]")}>{item.stock}</span>
                </td>
                <td className="py-3 px-3 text-[#666666] dark:text-[#999999]">{item.dailySales}</td>
                <td className="py-3 px-3">
                  {item.daysUntilOut && item.daysUntilOut <= 20 ? (
                    <span className="flex items-center gap-1 text-xs text-[#DC2626]">
                      <AlertTriangle size={12} />
                      {lang === "ar" ? `سينتهي خلال ${item.daysUntilOut} يوم` : `Ends in ${item.daysUntilOut} days`}
                    </span>
                  ) : item.daysStagnant ? (
                    <span className="flex items-center gap-1 text-xs text-[#999999] dark:text-[#666666]">
                      <Clock size={12} />
                      {lang === "ar" ? `راكد منذ ${item.daysStagnant} يوم` : `Stagnant ${item.daysStagnant} days`}
                    </span>
                  ) : (
                    <span className="text-xs text-[#999999]">—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span className={"inline-flex items-center gap-1 px-2 py-0.5 text-xs " + statusBadge(item.status, lang)}>
                    {item.status === "critical" ? <XCircle size={10} /> : item.status === "stagnant" ? <Clock size={10} /> : item.status === "warning" ? <AlertTriangle size={10} /> : null}
                    {item.status === "critical" ? (lang === "ar" ? "خطير" : "Critical") : item.status === "warning" ? (lang === "ar" ? "تنبيه" : "Warning") : item.status === "stagnant" ? (lang === "ar" ? "راكد" : "Stagnant") : (lang === "ar" ? "طبيعي" : "Normal")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
