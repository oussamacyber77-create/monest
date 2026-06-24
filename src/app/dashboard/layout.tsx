"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AiChatBubble } from "@/components/dashboard/ai-chat-bubble"
import { AdminGuard } from "@/components/layout/admin-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#F2F2F2] dark:bg-[#0D0D0D]">
          {children}
        </main>
        <AiChatBubble />
      </div>
    </AdminGuard>
  )
}
