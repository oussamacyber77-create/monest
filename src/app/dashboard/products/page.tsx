"use client"

import { useSettingsStore } from "@/stores/settings-store"
import { products } from "@/lib/mock-data/dashboard"
import { TrendingUp, TrendingDown, AlertTriangle, Tag, ArrowUp, ArrowDown, XCircle, Layers } from "lucide-react"

const suggestionIcons: Record<string, any> = { raise: ArrowUp, lower: ArrowDown, bundle: Layers, promote: Tag, discontinue: XCircle }
const suggestionColors: Record<string, string> = { raise: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", lower: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", bundle: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", promote: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", discontinue: "bg-[#DC2626]/10 text-[#DC2626]" }

export default function ProductsPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const sortedBySales = [...products].sort((a, b) => b.sales - a.sales)
  const sortedByProfit = [...products].sort((a, b) => (b.price - b.cost) * b.sales - (a.price - a.cost) * a.sales)
  const sortedByViews = [...products].sort((a, b) => b.views - a.views)
  const sortedByLow = [...products].sort((a, b) => a.sales - b.sales)

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "مركز المنتجات" : "Product Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "تحليل واقتراحات ذكية لمنتجاتك" : "AI analysis & suggestions for your products"}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-px bg-[#D4D4D4] dark:bg-[#333333]">
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
          <p className="text-xs text-[#666666] dark:text-[#999999] mb-2">{lang === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}</p>
          <div className="space-y-1.5">
            {sortedBySales.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-[#0D0D0D] dark:text-[#F2F2F2]">{i + 1}. {p.name[lang]}</span>
                <TrendingUp size={12} className="text-green-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
          <p className="text-xs text-[#666666] dark:text-[#999999] mb-2">{lang === "ar" ? "الأقل مبيعاً" : "Lowest Sales"}</p>
          <div className="space-y-1.5">
            {sortedByLow.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-[#0D0D0D] dark:text-[#F2F2F2]">{i + 1}. {p.name[lang]}</span>
                <TrendingDown size={12} className="text-[#DC2626] shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
          <p className="text-xs text-[#666666] dark:text-[#999999] mb-2">{lang === "ar" ? "الأعلى ربحاً" : "Highest Profit"}</p>
          <div className="space-y-1.5">
            {sortedByProfit.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-[#0D0D0D] dark:text-[#F2F2F2]">{i + 1}. {p.name[lang]}</span>
                <span className="text-xs text-[#666666] dark:text-[#999999]">+{((p.price - p.cost) * p.sales).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F2F2F2] dark:bg-[#0D0D0D] p-4">
          <p className="text-xs text-[#666666] dark:text-[#999999] mb-2">{lang === "ar" ? "الأكثر زيارة" : "Most Viewed"}</p>
          <div className="space-y-1.5">
            {sortedByViews.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-[#0D0D0D] dark:text-[#F2F2F2]">{i + 1}. {p.name[lang]}</span>
                <span className="text-xs text-[#666666] dark:text-[#999999]">{p.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#D4D4D4] dark:border-[#333333]">
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المنتج" : "Product"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "السعر" : "Price"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المبيعات" : "Sales"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "المشاهدات" : "Views"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الربح" : "Profit"}</th>
              <th className="text-start py-3 px-3 text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "اقتراح AI" : "AI Suggestion"}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const Icon = suggestionIcons[p.aiSuggestion.type]
              return (
                <tr key={p.id} className="border-b border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                  <td className="py-3 px-3 font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name[lang]}</td>
                  <td className="py-3 px-3 text-[#666666] dark:text-[#999999]">{p.price} ر.س</td>
                  <td className="py-3 px-3 text-[#666666] dark:text-[#999999]">{p.sales}</td>
                  <td className="py-3 px-3 text-[#666666] dark:text-[#999999]">{p.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[#666666] dark:text-[#999999]">{(p.price - p.cost) * p.sales} ر.س</td>
                  <td className="py-3 px-3">
                    <span className={"inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium " + suggestionColors[p.aiSuggestion.type]}>
                      <Icon size={10} />
                      {p.aiSuggestion[lang]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
