"use client"

import { useSettingsStore } from "@/stores/settings-store"

export default function ImportantNoticePage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-8">
          {lang === "ar" ? "تنويه مهم" : "Important Notice"}
        </h1>

        <div className="p-8 md:p-10 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
          <p className="text-base leading-relaxed text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar"
              ? "قد تختلف النتائج من شخص لآخر، نستخدم هذه الأمثلة لأغراض التوضيح فقط. ستختلف نتائجك وتعتمد على عوامل عديدة، إذا لم تكن مستعداً لذلك، يُرجى عدم الاشتراك."
              : "Results may vary from person to person. These examples are used for illustration purposes only. Your results will vary and depend on many factors. If you are not prepared for this, please do not subscribe."}
          </p>
        </div>
      </div>
    </div>
  )
}
