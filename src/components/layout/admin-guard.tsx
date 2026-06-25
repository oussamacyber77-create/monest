"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/admin/login?redirect=" + encodeURIComponent(pathname))
    }
  }, [isLoading, user, pathname, router])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="w-8 h-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
