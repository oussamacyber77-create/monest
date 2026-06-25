"use client"

import { useRouter } from "next/navigation"
import { Construction } from "lucide-react"
import { MonestLogo } from "@/components/ui/monest-logo"

interface ComingSoonProps {
  title?: string
  description?: string
}

export function ComingSoon({
  title = "قريباً",
  description = "هذه الميزة قيد التطوير وستكون متاحة قريباً",
}: ComingSoonProps) {
  const router = useRouter()

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="w-full max-w-md text-center space-y-6">
        <MonestLogo width={64} height={64} className="mx-auto text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Construction size={32} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{title}</h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">{description}</p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
        >
          العودة إلى الرئيسية
        </button>
      </div>
    </div>
  )
}
