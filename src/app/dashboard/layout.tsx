"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AiChatBubble } from "@/components/dashboard/ai-chat-bubble"
<<<<<<< HEAD
import { MemberGuard } from "@/components/layout/member-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemberGuard>
      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#F2F2F2] dark:bg-[#0D0D0D]">
          {children}
        </main>
        <AiChatBubble />
      </div>
    </MemberGuard>
=======

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        {children}
      </main>
      <AiChatBubble />
    </div>
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
  )
}
