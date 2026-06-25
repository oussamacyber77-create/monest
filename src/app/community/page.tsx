"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { SERVERS, CONTACTS } from "@/components/community/data"
import WorkspaceBar from "@/components/community/workspace-bar"
import CommunitySidebar from "@/components/community/sidebar"
import ChatArea from "@/components/community/chat-area"
import MembersPanel from "@/components/community/members-panel"
import { getColorFromName } from "@/components/community/utils"
import type { TabType } from "@/components/community/types"

export default function CommunityPage() {
  const router = useRouter()
  const { direction, primaryColor } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const [activeTab, setActiveTab] = useState<TabType>("chats")
  const [selectedServer, setSelectedServer] = useState("server-1")
  const [activeChannel, setActiveChannel] = useState("ch-general")
  const [activeDm, setActiveDm] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [showMobileList, setShowMobileList] = useState(false)
  const [showMemberPanel, setShowMemberPanel] = useState(false)
  const [showMobileServers, setShowMobileServers] = useState(false)

  const server = useMemo(() => SERVERS.find((s) => s.id === selectedServer), [selectedServer])
  const channel = useMemo(() => server?.channels.find((c) => c.id === activeChannel), [server, activeChannel])
  const currentContact = useMemo(
    () => (activeDm ? CONTACTS.find((c) => c.id === activeDm) ?? null : null),
    [activeDm],
  )

  const isCommunityChat = !!server && !!channel

  const handleSelectServer = (id: string) => {
    setSelectedServer(id)
    const firstCh = SERVERS.find((s) => s.id === id)?.channels[0]
    if (firstCh) setActiveChannel(firstCh.id)
    setActiveDm(null)
    setShowMemberPanel(false)
    setActiveTab("chats")
    setShowMobileServers(false)
  }

  const handleJoinVoice = () => router.push("/meetings")

  // Mobile overlay for servers
  const serverOverlay = showMobileServers && (
    <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileServers(false)}>
      <div
        className="absolute start-0 top-0 bottom-0 w-20 bg-[#1A1A1A] dark:bg-black flex flex-col items-center py-4 gap-2 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {SERVERS.map((s) => {
          const color = getColorFromName(s.name)
          return (
            <button
              key={s.id}
              onClick={() => handleSelectServer(s.id)}
              className={`w-[46px] h-[46px] flex items-center justify-center text-white font-bold text-base transition-all rounded-2xl ${
                selectedServer === s.id ? "rounded-xl" : ""
              }`}
              style={{ backgroundColor: color }}
            >
              {s.icon}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] bg-[#F8F8F8] dark:bg-black">
      {/* Far right server bar */}
      <WorkspaceBar
        servers={SERVERS}
        selectedServer={selectedServer}
        onSelectServer={handleSelectServer}
        onMobileToggle={() => setShowMobileServers(!showMobileServers)}
      />

      {/* Server mobile overlay */}
      {serverOverlay}

      {/* Community sidebar */}
      <div
        className={`${
          (isCommunityChat || activeDm) && !showMobileList ? "hidden md:flex" : "flex"
        }`}
      >
        <CommunitySidebar
          lang={lang}
          direction={direction}
          primaryColor={primaryColor}
          activeTab={activeTab}
          selectedServer={server}
          activeChannel={activeChannel}
          activeDm={activeDm}
          search={search}
          onSetTab={setActiveTab}
          onSetChannel={(id) => {
            setActiveChannel(id)
            setActiveDm(null)
          }}
          onSetDm={(id) => {
            setActiveDm(id)
            setActiveChannel("")
          }}
          onSetSearch={setSearch}
          onJoinVoice={handleJoinVoice}
          onMobileClose={() => setShowMobileList(false)}
        />
      </div>

      {/* Main chat area */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          (!isCommunityChat && !activeDm) || (showMobileList && !activeDm) ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatArea
          lang={lang}
          direction={direction}
          primaryColor={primaryColor}
          server={server}
          channel={channel}
          activeDm={activeDm}
          currentContact={currentContact}
          onToggleMembers={() => setShowMemberPanel(!showMemberPanel)}
          onBackToList={() => {
            setShowMobileList(true)
            setActiveDm(null)
            setActiveChannel("ch-general")
          }}
          membersCount={server?.members.length || 0}
        />
      </div>

      {/* Members panel (desktop) */}
      {isCommunityChat && (
        <MembersPanel
          server={server}
          lang={lang}
          onClose={() => setShowMemberPanel(false)}
          isMobile={showMemberPanel}
        />
      )}
    </div>
  )
}
