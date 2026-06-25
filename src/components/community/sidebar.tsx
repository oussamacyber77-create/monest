"use client"

import { useMemo } from "react"
import { MessageCircle, Phone, Video, Search, Hash, Volume2, Users, Crown, Shield, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react"
import { getColorFromName, getAvatarLetter } from "@/components/community/utils"
import { CONTACTS, CALLS, INDIVIDUAL_CHATS } from "@/components/community/data"
import type { Server, Contact, TabType, Channel } from "@/components/community/types"

interface SidebarProps {
  lang: string
  direction: string
  primaryColor: string
  activeTab: TabType
  selectedServer: Server | undefined
  activeChannel: string
  activeDm: string | null
  search: string
  onSetTab: (t: TabType) => void
  onSetChannel: (id: string) => void
  onSetDm: (id: string | null) => void
  onSetSearch: (s: string) => void
  onJoinVoice: () => void
  onMobileClose: () => void
}

export default function CommunitySidebar({
  lang, direction, primaryColor,
  activeTab, selectedServer, activeChannel, activeDm, search,
  onSetTab, onSetChannel, onSetDm, onSetSearch, onJoinVoice, onMobileClose,
}: SidebarProps) {
  const filteredContacts = useMemo(() => {
    if (!search) return CONTACTS
    return CONTACTS.filter((c) => c.name.includes(search))
  }, [search])

  const serverContacts = useMemo(() => {
    return selectedServer?.members.map((m) => ({
      id: m.id,
      name: m.name,
      online: m.status === "online",
      lastSeen: undefined,
      unread: 0,
    })) || []
  }, [selectedServer])

  const showContacts = activeTab === "calls" ? [] : activeDm ? CONTACTS : serverContacts

  const callIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming size={14} className="text-green-500" />
      case "outgoing":
        return <PhoneOutgoing size={14} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
      case "missed":
        return <PhoneMissed size={14} className="text-[#DC2626]" />
      default:
        return <Phone size={14} />
    }
  }

  return (
    <div className="w-full md:w-72 lg:w-80 border-e border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] flex flex-col shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {selectedServer?.name || (lang === "ar" ? "المجتمع" : "Community")}
          </h1>
          {selectedServer && (
            <span className="text-[10px] text-[#999] bg-[#F0F0F0] dark:bg-[#1A1A1A] px-2 py-0.5 rounded">
              {selectedServer.members.length} {lang === "ar" ? "عضوا" : "mbrs"}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F0F0F0] dark:bg-[#1A1A1A] p-0.5 rounded-lg">
          {(["chats", "calls", "video"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                onSetTab(t)
                if (t !== "chats") onSetDm(null)
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === t
                  ? "bg-white dark:bg-[#333] text-[#0D0D0D] dark:text-[#F2F2F2] shadow-sm"
                  : "text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"
              }`}
            >
              {t === "chats" ? <MessageCircle size={14} /> : t === "calls" ? <Phone size={14} /> : <Video size={14} />}
              <span>
                {t === "chats"
                  ? lang === "ar" ? "المحادثات" : "Chats"
                  : t === "calls"
                    ? lang === "ar" ? "المكالمات" : "Calls"
                    : lang === "ar" ? "فيديو" : "Video"}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input
            value={search}
            onChange={(e) => onSetSearch(e.target.value)}
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
            className="w-full h-9 ps-9 pe-3 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999] outline-none focus:ring-1 focus:ring-[#0D0D0D]/20 dark:focus:ring-white/20 rounded-lg transition-all"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Channels (only on chats tab when a server is active and no DM) */}
        {activeTab === "chats" && !activeDm && selectedServer && (
          <div className="py-2">
            <div className="px-4 py-1.5 text-[10px] font-bold text-[#888] uppercase tracking-wider flex items-center gap-1.5">
              <Hash size={10} />
              {lang === "ar" ? "القنوات" : "Channels"}
            </div>
            <div className="space-y-0.5 px-2">
              {selectedServer.channels.map((ch: Channel) => {
                const active = activeChannel === ch.id
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSetChannel(ch.id)
                      onMobileClose()
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-[#F0F0F0] dark:bg-[#2A2A2A] text-[#0D0D0D] dark:text-[#F2F2F2]"
                        : "text-[#888] hover:bg-[#F8F8F8] dark:hover:bg-[#1A1A1A] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"
                    }`}
                  >
                    {ch.type === "text" ? (
                      ch.id === activeChannel ? (
                        <Hash size={16} className="shrink-0" style={{ color: primaryColor }} />
                      ) : (
                        <Hash size={16} className="shrink-0 text-[#888]" />
                      )
                    ) : (
                      <Volume2 size={16} className="shrink-0 text-[#888]" />
                    )}
                    <span className={`truncate ${ch.unread ? "font-bold" : ""}`}>
                      {ch.name}
                    </span>
                    {ch.unread ? (
                      <span
                        className="w-5 h-5 text-[9px] font-bold flex items-center justify-center rounded-md text-white shrink-0 ms-auto"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {ch.unread}
                      </span>
                    ) : null}
                    {ch.type === "voice" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onJoinVoice()
                        }}
                        className="me-auto ms-auto px-2.5 py-1 text-[10px] font-medium rounded-md border border-[#E0E0E0] dark:border-[#333] text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] transition-all"
                      >
                        {lang === "ar" ? "دخول" : "Join"}
                      </button>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Direct Messages header */}
        {activeTab === "chats" && (
          <div className="px-4 py-2 border-t border-[#E5E5E5]/50 dark:border-[#2A2A2A]/50 mt-1">
            <p className="text-[10px] font-bold text-[#888] uppercase tracking-wider">
              {lang === "ar" ? "الرسائل المباشرة" : "Direct Messages"}
            </p>
          </div>
        )}

        {/* Contact list / DMs */}
        {activeTab === "chats" && (
          <div className="pb-2">
            {filteredContacts.map((contact) => {
              const lastMsg = INDIVIDUAL_CHATS[contact.id]?.slice(-1)[0]
              const color = getColorFromName(contact.name)
              const active = activeDm === contact.id
              return (
                <button
                  key={contact.id}
                  onClick={() => {
                    onSetDm(contact.id)
                    onMobileClose()
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all text-start ${
                    active
                      ? "bg-[#F5F5F5] dark:bg-[#1A1A1A]"
                      : "hover:bg-[#FAFAFA] dark:hover:bg-[#151515]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {getAvatarLetter(contact.name)}
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0 end-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#0D0D0D]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-sm truncate ${active ? "font-bold text-[#0D0D0D] dark:text-[#F2F2F2]" : "font-medium text-[#0D0D0D] dark:text-[#F2F2F2]"}`}>
                        {contact.name}
                      </p>
                      {lastMsg && (
                        <span className="text-[10px] text-[#999] shrink-0">
                          {lastMsg.time.getHours().toString().padStart(2, "0")}:
                          {lastMsg.time.getMinutes().toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#999] truncate mt-0.5">
                      {contact.online
                        ? lang === "ar" ? "متصل" : "Online"
                        : contact.lastSeen || ""}
                    </p>
                  </div>
                  {contact.unread > 0 && (
                    <span
                      className="w-5 h-5 text-[9px] font-bold flex items-center justify-center rounded-md text-white shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {contact.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Calls tab */}
        {activeTab === "calls" && (
          <div className="py-1">
            {CALLS.map((call) => (
              <div
                key={call.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAFAFA] dark:hover:bg-[#151515] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: getColorFromName(call.name) }}
                >
                  {getAvatarLetter(call.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{call.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {callIcon(call.type)}
                    <span className="text-xs text-[#999]">{call.time}</span>
                    {call.duration && <span className="text-xs text-[#999]">{call.duration}</span>}
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] rounded-lg transition-all">
                  {call.type === "missed" ? <Phone size={14} /> : <Video size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Video tab */}
        {activeTab === "video" && (
          <div className="p-4 space-y-4">
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "ابدأ اتصال فيديو" : "Start a Video Call"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONTACTS.map((contact) => (
                <button
                  key={contact.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] hover:bg-[#F8F8F8] dark:hover:bg-[#1A1A1A] transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white"
                    style={{ backgroundColor: getColorFromName(contact.name) }}
                  >
                    {getAvatarLetter(contact.name)}
                  </div>
                  <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{contact.name}</p>
                  {contact.online && (
                    <span className="text-[10px] text-green-500 font-medium">
                      {lang === "ar" ? "متصل" : "Online"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty contacts */}
        {activeTab === "chats" && filteredContacts.length === 0 && (
          <div className="p-8 text-center text-sm text-[#999]">
            {lang === "ar" ? "لا توجد نتائج" : "No results found"}
          </div>
        )}
      </div>
    </div>
  )
}
