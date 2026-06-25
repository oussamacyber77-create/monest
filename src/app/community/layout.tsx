"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { MobileNavBar } from "@/components/layout/mobile-nav-bar"

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex pb-14 md:pb-0">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        {children}
      </main>
      <MobileNavBar />
    </div>
  )
}
