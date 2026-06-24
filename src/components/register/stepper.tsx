"use client"

import { useSettingsStore } from "@/stores/settings-store"

const steps = (lang: string) => [
  { label: lang === "ar" ? "الاسم" : "Name", step: 1 },
  { label: lang === "ar" ? "الجوال" : "Phone", step: 2 },
  { label: lang === "ar" ? "التحقق" : "Verify", step: 3 },
  { label: lang === "ar" ? "الباقة" : "Package", step: 4 },
  { label: lang === "ar" ? "الموعد" : "Schedule", step: 5 },
  { label: lang === "ar" ? "الدفع" : "Payment", step: 6 },
]

interface StepperProps {
  currentStep: number
}

export function Stepper({ currentStep }: StepperProps) {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const items = steps(lang)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-3 end-0 start-0 h-px bg-[#D4D4D4] dark:bg-[#333333]" />
        <div
          className="absolute top-3 end-0 h-px bg-[#0D0D0D] dark:bg-[#F2F2F2] transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (items.length - 1)) * 100}%`, right: 0 }}
        />
        {items.map((s) => (
          <div key={s.step} className="relative flex flex-col items-center z-10">
            <div
              className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${
                s.step <= currentStep
                  ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                  : "bg-[#E8E8E8] text-[#999999] dark:bg-[#333333] dark:text-[#666666]"
              }`}
            >
              {s.step}
            </div>
            <span
              className={`text-[10px] mt-1.5 font-medium transition-colors ${
                s.step <= currentStep
                  ? "text-[#0D0D0D] dark:text-[#F2F2F2]"
                  : "text-[#999999] dark:text-[#666666]"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
