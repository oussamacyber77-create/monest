"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin, isLoading, checkSession } = useAuthStore()
  const checked = useRef(false)

  useEffect(() => {
    if (!checked.current) {
      checkSession()
      checked.current = true
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/admin/login?redirect=" + encodeURIComponent(pathname))
    }
  }, [isLoading, isAdmin, pathname, router])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="w-8 h-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return null

  return <>{children}</>
}
