"use client"

import { AdminGuard } from "@/components/layout/admin-guard"

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
