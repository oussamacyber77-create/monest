"use client"

import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "حدث خطأ",
  description = "تعذر تحميل البيانات. الرجاء المحاولة مرة أخرى.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle size={24} className="text-[#DC2626]" />
      </div>
      <h3 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">{title}</h3>
      <p className="text-sm text-[#666666] dark:text-[#999999] max-w-sm mb-4">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 h-10 px-5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={14} />
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}
