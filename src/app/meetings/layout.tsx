"use client"

import { usePathname } from "next/navigation"
import { MemberGuard } from "@/components/layout/member-guard"

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPath = pathname.startsWith("/meetings/admin")

  if (isAdminPath) return <>{children}</>

  return <MemberGuard>{children}</MemberGuard>
}
