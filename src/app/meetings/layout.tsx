"use client"

import { usePathname } from "next/navigation"
<<<<<<< HEAD
import { MemberGuard } from "@/components/layout/member-guard"

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPath = pathname.startsWith("/meetings/admin")

  if (isAdminPath) return <>{children}</>

  return <MemberGuard>{children}</MemberGuard>
=======
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AiChatBubble } from "@/components/dashboard/ai-chat-bubble"

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullScreen = pathname.startsWith("/meetings/room/")

  if (isFullScreen) {
    return <>{children}</>
  }

  return (
    <div className="flex-1 flex">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        {children}
      </main>
      <AiChatBubble />
    </div>
  )
>>>>>>> 2f176ad86f91d847d681aead14606dbc03c4707f
}
