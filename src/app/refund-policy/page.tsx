"use client"

import { useSettingsStore } from "@/stores/settings-store"

export default function RefundPolicyPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-8">
          {lang === "ar" ? "سياسة الاستبدال" : "Exchange Policy"}
        </h1>

        <div className="space-y-6 text-[#0D0D0D] dark:text-[#F2F2F2] leading-relaxed">
          <p className="text-base">
            {lang === "ar"
              ? "١. مع عدم الإخلال بأحكام الضمان الاتفاقية والنظامية، لا يحق للمستهلك إرجاع المنتج المقدّم إليه من المتجر، ويحق له استبدال الباقة في حال عدم الاستفادة منها."
              : "1. Without prejudice to the contractual and regulatory warranty provisions, the consumer does not have the right to return the product provided to them by the store, and they have the right to exchange the package if they have not benefited from it."}
          </p>

          <p className="text-base">
            {lang === "ar"
              ? "٢. يُشترط للاستبدال ألا يكون المستهلك قد استخدم المنتج أو حصل على منفعته."
              : "2. Exchange requires that the consumer has not used the product or obtained its benefit."}
          </p>
        </div>
      </div>
    </div>
  )
}
