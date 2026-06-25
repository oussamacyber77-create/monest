"use client"

import { Users, Crown, Shield, X } from "lucide-react"
import { getColorFromName, getAvatarLetter, statusColors, groupMembersByRole } from "@/components/community/utils"
import type { Server, Member } from "@/components/community/types"

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Crown size={12} className="text-amber-500" />,
  mod: <Shield size={12} className="text-blue-500" />,
  member: null,
}

const roleLabels: Record<string, { ar: string; en: string }> = {
  admin: { ar: "المدراء", en: "Admins" },
  mod: { ar: "المشرفون", en: "Moderators" },
  member: { ar: "الأعضاء", en: "Members" },
}

interface MembersPanelProps {
  server: Server | undefined
  lang: string
  onClose?: () => void
  isMobile?: boolean
}

export default function MembersPanel({ server, lang, onClose, isMobile }: MembersPanelProps) {
  if (!server) return null

  const groups = groupMembersByRole(server.members)

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between">
        <p className="text-xs font-bold text-[#888] uppercase tracking-wider flex items-center gap-1.5">
          <Users size={12} />
          {server.members.length} {lang === "ar" ? "عضوا" : "members"}
        </p>
        {onClose && (
          <button onClick={onClose} className="p-1 text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] rounded transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Members by role */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {(["admin", "mod", "member"] as const).map((role) => {
          const members = groups[role] || []
          if (members.length === 0) return null
          return (
            <div key={role}>
              <p className="text-[10px] font-bold text-[#888] uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                {roleIcons[role]}
                {roleLabels[role][lang as "ar" | "en"]}
                <span className="text-[#aaa] font-normal">({members.length})</span>
              </p>
              <div className="space-y-0.5">
                {members.map((m: Member) => {
                  const color = getColorFromName(m.name)
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] cursor-pointer transition-all group"
                    >
                      <div className="relative shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {getAvatarLetter(m.name)}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0D0D0D] ${statusColors[m.status]}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium truncate ${
                            m.status === "online"
                              ? "text-[#0D0D0D] dark:text-[#F2F2F2]"
                              : "text-[#888]"
                          }`}
                        >
                          {m.name}
                        </p>
                        <p className="text-[9px] text-[#aaa]">
                          {m.status === "online"
                            ? lang === "ar" ? "متصل" : "Online"
                            : m.status === "away"
                              ? lang === "ar" ? "بعيد" : "Away"
                              : lang === "ar" ? "غير متصل" : "Offline"}
                        </p>
                      </div>
                      {roleIcons[role] && (
                        <span className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                          {roleIcons[role]}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <div
          className="absolute end-0 top-0 bottom-0 w-72 bg-white dark:bg-[#111] shadow-xl border-s border-[#E5E5E5] dark:border-[#2A2A2A]"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="hidden md:flex flex-col w-60 shrink-0 border-s border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
      {content}
    </div>
  )
}
