"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { getColorFromName, getAvatarLetter, formatRelativeTime } from "@/lib/community-utils"
import {
  MessageCircle, Phone, Video, Search, Pin, Check, CheckCheck, Clock,
  MoreHorizontal, PhoneIncoming, PhoneOutgoing, PhoneMissed, ArrowLeft,
  Send, Paperclip, Mic, Hash, Volume2, Users, Crown, Shield, Plus,
  X, Smile, Reply, AtSign, MessageSquare, VolumeX, PinOff
} from "lucide-react"

// ── Types ──

interface Member {
  id: string
  name: string
  status: "online" | "away" | "offline"
  role: "admin" | "mod" | "member"
}

interface Channel {
  id: string
  name: string
  type: "text" | "voice"
  unread?: number
}

interface Server {
  id: string
  name: string
  icon: string
  channels: Channel[]
  members: Member[]
}

interface Contact {
  id: string
  name: string
  online: boolean
  lastSeen?: string
  unread: number
  server?: string
}

interface Reaction {
  emoji: string
  count: number
  me: boolean
}

interface ReplyTo {
  id: string
  text: string
  sender: string
}

interface ChatMessage {
  id: string
  text: string
  sender: string
  senderId: string
  time: Date
  me: boolean
  status: "sent" | "delivered" | "read"
  reactions?: Reaction[]
  replyTo?: ReplyTo
}

interface Call {
  id: string
  name: string
  type: "incoming" | "outgoing" | "missed"
  time: string
  duration?: string
}

// ── Mock Data ──

const SERVERS: Server[] = [
  {
    id: "server-1",
    name: "مجتمع متجرك",
    icon: "م",
    channels: [
      { id: "ch-general", name: "عام", type: "text" },
      { id: "ch-announce", name: "إعلانات", type: "text" },
      { id: "ch-marketing", name: "تسويق", type: "text" },
      { id: "ch-design", name: "تصميم", type: "text" },
      { id: "ch-voice", name: "الغرفة الصوتية", type: "voice" },
    ],
    members: [
      { id: "admin", name: "أحمد السالم", status: "online", role: "admin" },
      { id: "mod-1", name: "سارة الحربي", status: "online", role: "mod" },
      { id: "mod-2", name: "فهد العتيبي", status: "away", role: "mod" },
      { id: "mem-1", name: "نورة الدوسري", status: "online", role: "member" },
      { id: "mem-2", name: "خالد المطيري", status: "offline", role: "member" },
      { id: "mem-3", name: "منى الشمري", status: "online", role: "member" },
      { id: "mem-4", name: "سعود القحطاني", status: "offline", role: "member" },
      { id: "mem-5", name: "هند الزهراني", status: "away", role: "member" },
      { id: "mem-6", name: "محمد العبدالله", status: "online", role: "member" },
      { id: "mem-7", name: "ريم العتيق", status: "offline", role: "member" },
    ],
  },
  {
    id: "server-2",
    name: "تسويق Salla",
    icon: "ت",
    channels: [
      { id: "s2-general", name: "عام", type: "text" },
      { id: "s2-campaigns", name: "حملات", type: "text" },
    ],
    members: [
      { id: "s2-m1", name: "نواف العنزي", status: "online", role: "admin" },
      { id: "s2-m2", name: "لينا باحارث", status: "away", role: "mod" },
    ],
  },
]

const CONTACTS: Contact[] = [
  { id: "contact-1", name: "سارة الحربي", online: true, lastSeen: "الآن", unread: 0 },
  { id: "contact-2", name: "فهد العتيبي", online: false, lastSeen: "منذ 5 دقائق", unread: 1 },
  { id: "contact-3", name: "نورة الدوسري", online: true, lastSeen: "الآن", unread: 0 },
  { id: "contact-4", name: "خالد المطيري", online: false, lastSeen: "منذ ساعة", unread: 0 },
  { id: "contact-5", name: "منى الشمري", online: true, lastSeen: "الآن", unread: 2 },
  { id: "contact-6", name: "سعود القحطاني", online: false, lastSeen: "منذ 3 ساعات", unread: 0 },
  { id: "contact-7", name: "هند الزهراني", online: true, lastSeen: "الآن", unread: 0 },
]

const NOW = new Date()
function mt(h: number, m: number) { const d = new Date(NOW); d.setHours(h, m, 0, 0); return d }

const GROUP_CHATS: Record<string, ChatMessage[]> = {
  "ch-general": [
    { id: "g1", text: "مرحباً بالجميع! 👋 اجتماعنا الأسبوعي بكرة الساعة 10", sender: "أحمد السالم", senderId: "admin", time: mt(9, 30), me: false, status: "read" },
    { id: "g2", text: "تمام 👍 هنكون في الموعد", sender: "سارة الحربي", senderId: "mod-1", time: mt(9, 32), me: false, status: "read" },
    { id: "g3", text: "فكرة رائعة المنصة هذي", sender: "فهد العتيبي", senderId: "mod-2", time: mt(9, 35), me: false, status: "read" },
    { id: "g4", text: "شكراً يا شباب! أقدر تعاونكم", sender: "أنت", senderId: "me", time: mt(9, 40), me: true, status: "read" },
    { id: "g5", text: "باقي نحدد محور النقاش — وش رايكم نركز على استراتيجية التسويق للربع الثالث؟", sender: "أحمد السالم", senderId: "admin", time: mt(9, 42), me: false, status: "read" },
    { id: "g6", text: "اتفاق! عندي أفكار حلوة للمحتوى", sender: "نورة الدوسري", senderId: "mem-1", time: mt(9, 45), me: false, status: "read", reactions: [{ emoji: "👍", count: 3, me: false }] },
    { id: "g7", text: "تمام, خل نناقشها بكرة", sender: "أنت", senderId: "me", time: mt(9, 50), me: true, status: "delivered" },
  ],
  "ch-announce": [
    { id: "a1", text: "📢 تحديث جديد: أضفنا دفع Apple Pay و Tabby!", sender: "أحمد السالم", senderId: "admin", time: mt(11, 0), me: false, status: "read" },
    { id: "a2", text: "جربوها ورجعوا لنا بالتغذية الراجعة", sender: "أحمد السالم", senderId: "admin", time: mt(11, 1), me: false, status: "read" },
  ],
  "ch-marketing": [
    { id: "m1", text: "عندي اقتراح حملة للعيد — خصم 20% على أول طلب", sender: "سارة الحربي", senderId: "mod-1", time: mt(14, 15), me: false, status: "read" },
  ],
}

const INDIVIDUAL_CHATS: Record<string, ChatMessage[]> = {
  "contact-2": [
    { id: "c1", text: "السلام عليكم، عندي استفسار عن المنتج الجديد", sender: "فهد العتيبي", senderId: "contact-2", time: mt(14, 20), me: false, status: "read" },
    { id: "c2", text: "وعليكم السلام! تفضل اسأل", sender: "أنت", senderId: "me", time: mt(14, 25), me: true, status: "read" },
  ],
  "contact-5": [
    { id: "m1", text: "مرحباً، ممكن ترسل لي رابط الاجتماع؟", sender: "منى", senderId: "contact-5", time: mt(11, 5), me: false, status: "read" },
    { id: "m2", text: "أكيد! https://meet.monest.app/xyz", sender: "أنت", senderId: "me", time: mt(11, 10), me: true, status: "delivered" },
    { id: "m3", text: "شكراً جزيلاً 🙏", sender: "منى", senderId: "contact-5", time: mt(11, 12), me: false, status: "read" },
  ],
}

const CALLS: Call[] = [
  { id: "cl1", name: "سارة الحربي", type: "outgoing", time: "اليوم 10:30", duration: "12:34" },
  { id: "cl2", name: "مجتمع متجرك", type: "incoming", time: "اليوم 09:15", duration: "45:20" },
  { id: "cl3", name: "فهد العتيبي", type: "missed", time: "أمس 16:45" },
  { id: "cl4", name: "منى الشمري", type: "outgoing", time: "أمس 14:00", duration: "08:15" },
  { id: "cl5", name: "نورة الدوسري", type: "incoming", time: "2026-06-22", duration: "22:10" },
  { id: "cl6", name: "خالد المطيري", type: "missed", time: "2026-06-21" },
]

const EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "🙏", "😍", "🤔", "👋", "💯", "⭐", "🚀", "✅", "💪"]

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  away: "bg-amber-500",
  offline: "bg-[#999999]",
}

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Crown size={12} />,
  mod: <Shield size={12} />,
  member: null,
}

const roleLabels: Record<string, { ar: string; en: string }> = {
  admin: { ar: "مدراء", en: "Admins" },
  mod: { ar: "مشرفون", en: "Moderators" },
  member: { ar: "أعضاء", en: "Members" },
}

function formatTime(d: Date): string {
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0")
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDateSeparator(d: Date, lang: string): string {
  const now = new Date()
  if (isSameDay(d, now)) return lang === "ar" ? "اليوم" : "Today"
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(d, yesterday)) return lang === "ar" ? "أمس" : "Yesterday"
  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "long", day: "numeric", month: "long" })
}

function groupMessages(msgs: ChatMessage[]): { date: string; messages: ChatMessage[] }[] {
  const groups: { date: string; messages: ChatMessage[] }[] = []
  let currentDate = ""
  for (const msg of msgs) {
    const dateStr = msg.time.toLocaleDateString("en-CA")
    if (dateStr !== currentDate) {
      currentDate = dateStr
      groups.push({ date: dateStr, messages: [] })
    }
    groups[groups.length - 1].messages.push(msg)
  }
  return groups
}

// ── Component ──

export default function CommunityPage() {
  const router = useRouter()
  const { direction, primaryColor } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeTab, setActiveTab] = useState<"chats" | "calls" | "video">("chats")
  const [selectedServer, setSelectedServer] = useState<string>("server-1")
  const [activeChannel, setActiveChannel] = useState<string>("ch-general")
  const [activeDm, setActiveDm] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [search, setSearch] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const [showMemberPanel, setShowMemberPanel] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyTo, setReplyTo] = useState<ReplyTo | null>(null)
  const [typing, setTyping] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showMobileServers, setShowMobileServers] = useState(false)

  const server = SERVERS.find(s => s.id === selectedServer)
  const channel = server?.channels.find(c => c.id === activeChannel)
  const currentContact = activeDm ? CONTACTS.find(c => c.id === activeDm) : null

  const isCommunityChat = !!server && !!channel

  // Get messages for current view
  const getChatMessages = useCallback((): ChatMessage[] => {
    if (activeDm) return INDIVIDUAL_CHATS[activeDm] || []
    if (channel) return GROUP_CHATS[channel.id] || []
    return []
  }, [activeDm, channel])

  const messages = useMemo(() => getChatMessages(), [getChatMessages])
  const messageGroups = useMemo(() => groupMessages(messages), [messages])

  // Typing indicator simulation
  useEffect(() => {
    if (chatInput.length > 0 && isCommunityChat) {
      const t = setTimeout(() => setTyping("أحمد السالم"), 2000)
      return () => { clearTimeout(t); setTyping(null) }
    }
  }, [chatInput, isCommunityChat])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter contacts
  const filteredContacts = useMemo(() => {
    if (!search) return CONTACTS
    return CONTACTS.filter(c => c.name.includes(search))
  }, [search])

  const serverMembersByRole = useMemo(() => {
    if (!server) return {}
    const groups: Record<string, Member[]> = { admin: [], mod: [], member: [] }
    for (const m of server.members) groups[m.role].push(m)
    return groups
  }, [server])

  const serverContacts = useMemo(() => {
    return server?.members.map(m => ({
      id: m.id,
      name: m.name,
      online: m.status === "online",
      lastSeen: undefined,
      unread: 0,
    })) || []
  }, [server])

  // All servers for contact list
  const showContacts = activeTab === "calls" ? [] : activeDm ? CONTACTS : serverContacts

  const handleJoinVoice = () => {
    router.push("/meetings")
  }

  const sendMessage = useCallback(() => {
    if (!chatInput.trim()) return
    if (!activeDm && !channel) return

    const now = new Date()
    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      text: chatInput,
      sender: "أنت",
      senderId: "me",
      time: now,
      me: true,
      status: "sent",
      replyTo: replyTo || undefined,
    }

    if (activeDm) {
      if (!INDIVIDUAL_CHATS[activeDm]) INDIVIDUAL_CHATS[activeDm] = []
      INDIVIDUAL_CHATS[activeDm].push(newMsg)
    } else if (channel) {
      if (!GROUP_CHATS[channel.id]) GROUP_CHATS[channel.id] = []
      GROUP_CHATS[channel.id].push(newMsg)
    }

    setChatInput("")
    setReplyTo(null)
    setShowEmojiPicker(false)

    // Simulate reply
    setTimeout(() => {
      const replyTexts = [
        "تم الاستلام! شكراً لك 🙏",
        "تمام 👍",
        "حلو كثير!",
        "نعم متفق معك",
        "رائع! 🚀",
      ]
      const reply: ChatMessage = {
        id: "reply-" + Date.now(),
        text: replyTexts[Math.floor(Math.random() * replyTexts.length)],
        sender: server?.members[Math.floor(Math.random() * server.members.length)]?.name || "المستخدم",
        senderId: "reply-" + Math.random().toString(36).slice(2, 6),
        time: new Date(),
        me: false,
        status: "read",
      }
      if (activeDm && INDIVIDUAL_CHATS[activeDm]) {
        INDIVIDUAL_CHATS[activeDm].push(reply)
      } else if (channel) {
        GROUP_CHATS[channel.id]?.push(reply)
      }
    }, 1500 + Math.random() * 2000)
  }, [chatInput, activeDm, channel, replyTo, server])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const insertEmoji = (emoji: string) => {
    setChatInput(prev => prev + emoji)
    inputRef.current?.focus()
    setShowEmojiPicker(false)
  }

  const statusIcon = (status: string) => {
    if (status === "sent") return <Check size={12} />
    if (status === "delivered") return <CheckCheck size={12} />
    return <CheckCheck size={12} className="text-blue-500" />
  }

  const callIcon = (type: string) => {
    switch (type) {
      case "incoming": return <PhoneIncoming size={14} className="text-green-500" />
      case "outgoing": return <PhoneOutgoing size={14} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
      case "missed": return <PhoneMissed size={14} className="text-[#DC2626]" />
      default: return <Phone size={14} />
    }
  }

  // ── Render ──

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      {/* ── Server Column (Discord) ── */}
      <div className="hidden md:flex flex-col w-[68px] shrink-0 bg-[#1A1A1A] dark:bg-black border-e border-[#333333] items-center py-3 gap-2 overflow-y-auto">
        {SERVERS.map(s => {
          const color = getColorFromName(s.name)
          return (
            <button key={s.id} onClick={() => { setSelectedServer(s.id); setActiveChannel(s.channels[0]?.id || ""); setActiveDm(null); setShowMemberPanel(false); setActiveTab("chats") }}
              className="relative group">
              <div className={"w-[48px] h-[48px] rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all duration-200 hover:rounded-xl " + (selectedServer === s.id ? "rounded-xl" : "")}
                style={{ backgroundColor: color }}>
                {s.icon}
              </div>
              {selectedServer === s.id && (
                <div className="absolute -start-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-e-full" />
              )}
              <div className="absolute start-full ms-2 top-1/2 -translate-y-1/2 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {s.name}
              </div>
            </button>
          )
        })}
        <div className="w-8 h-px bg-[#333333] my-1" />
        <button className="w-[48px] h-[48px] rounded-2xl border-2 border-dashed border-[#555555] text-[#999999] hover:text-white hover:border-white hover:bg-white/5 flex items-center justify-center transition-all"
          title={lang === "ar" ? "إضافة مجتمع" : "Add Server"}>
          <Plus size={20} />
        </button>
      </div>

      {/* ── Mobile server selector ── */}
      {showMobileServers && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileServers(false)}>
          <div className="absolute start-0 top-0 bottom-0 w-20 bg-[#1A1A1A] dark:bg-black flex flex-col items-center py-4 gap-2 overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {SERVERS.map(s => {
              const color = getColorFromName(s.name)
              return (
                <button key={s.id} onClick={() => { setSelectedServer(s.id); setActiveChannel(s.channels[0]?.id || ""); setActiveDm(null); setShowMobileServers(false) }}
                  className={"w-[44px] h-[44px] rounded-2xl flex items-center justify-center text-white font-bold text-base transition-all " + (selectedServer === s.id ? "rounded-xl" : "")}
                  style={{ backgroundColor: color }}>
                  {s.icon}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Left Sidebar (Contact/Server List) ── */}
      <div className={"w-full md:w-72 lg:w-80 border-e border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] flex flex-col shrink-0 " + ((isCommunityChat || activeDm) && !showMobileList ? "hidden md:flex" : "flex")}>

        {/* Header */}
        <div className="p-3 border-b border-[#D4D4D4] dark:border-[#333333]">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "المجتمع" : "Community"}
            </h1>
            <button onClick={() => setShowMobileServers(true)} className="md:hidden w-8 h-8 flex items-center justify-center text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
              <Hash size={16} />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mb-2">
            {(["chats", "calls", "video"] as const).map((t) => (
              <button key={t} onClick={() => { setActiveTab(t); if (t !== "chats") { setActiveDm(null) } }}
                className={"flex-1 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 " + (activeTab === t ? "text-white" : "bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#666666] dark:text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}
                style={activeTab === t ? { backgroundColor: primaryColor } : {}}>
                {t === "chats" ? <MessageCircle size={12} /> : t === "calls" ? <Phone size={12} /> : <Video size={12} />}
                {t === "chats" ? (lang === "ar" ? "المحادثات" : "Chats") : t === "calls" ? (lang === "ar" ? "المكالمات" : "Calls") : (lang === "ar" ? "فيديو" : "Video")}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث في المجتمع..." : "Search community..."}
              className="w-full h-8 ps-8 pe-3 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
          </div>
        </div>

        {/* Contact/Server list */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" && (
            <>
              {/* Server Contacts (Discord-style - show all server members) */}
              {isCommunityChat && !activeDm && (
                <>
                  <div className="px-3 py-2">
                    <button onClick={() => setShowMemberPanel(!showMemberPanel)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#666666] dark:text-[#999999] uppercase tracking-wide hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                      <Users size={12} />
                      {server?.name || lang === "ar" ? "المجتمع" : "Community"} · {server?.members.length || 0}
                      {showMemberPanel ? "" : ""}
                    </button>
                    <p className="text-[9px] text-[#999999] mt-0.5">
                      {server?.channels.length} {lang === "ar" ? "قناة" : "channels"}
                    </p>
                  </div>
                  <div className="space-y-0.5 px-2 mb-2">
                    {server?.channels.map(ch => (
                      <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setActiveDm(null); setShowMobileList(false) }}
                        className={"w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors " + (activeChannel === ch.id ? "bg-[#E8E8E8] dark:bg-[#333333]" : "hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]")}>
                        {ch.type === "text"
                          ? <Hash size={12} className="text-[#666666] dark:text-[#999999]" />
                          : <Volume2 size={12} className="text-[#666666] dark:text-[#999999]" />
                        }
                        <span className={"truncate " + (ch.unread ? "text-[#0D0D0D] dark:text-[#F2F2F2] font-bold" : "text-[#666666] dark:text-[#999999]")}>
                          {ch.type === "voice" ? "🔊 " : "# "}{ch.name}
                        </span>
                        {ch.unread && (
                          <span className="w-4 h-4 text-[8px] font-bold flex items-center justify-center rounded-full text-white shrink-0"
                            style={{ backgroundColor: primaryColor }}>{ch.unread}</span>
                        )}
                        {ch.type === "voice" && (
                          <button onClick={(e) => { e.stopPropagation(); handleJoinVoice() }} className="me-auto px-2 py-0.5 border border-[#D4D4D4] dark:border-[#333333] text-[9px] font-medium text-[#666666] dark:text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] rounded transition-colors">
                            {lang === "ar" ? "دخول" : "Join"}
                          </button>
                        )}
                        {activeChannel === ch.id && (
                          <div className="w-0.5 h-4 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-[#D4D4D4]/50 dark:bg-[#333333]/50 mx-3 mb-1" />
                </>
              )}

              {/* Direct Messages section */}
              <div className="px-3 py-2">
                <p className="text-[10px] font-bold text-[#666666] dark:text-[#999999] uppercase tracking-wide">
                  {lang === "ar" ? "الرسائل المباشرة" : "Direct Messages"}
                </p>
              </div>
              {filteredContacts.map((contact) => {
                const lastMsg = INDIVIDUAL_CHATS[contact.id]?.[INDIVIDUAL_CHATS[contact.id]?.length - 1]
                const color = getColorFromName(contact.name)
                return (
                  <button key={contact.id} onClick={() => { setActiveDm(contact.id); setActiveChannel(""); setShowMobileList(false); setShowMemberPanel(false) }}
                    className={"w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-start " + (activeDm === contact.id ? "bg-[#F2F2F2] dark:bg-[#1A1A1A]" : "hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]")}>
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: color }}>
                        {getAvatarLetter(contact.name)}
                      </div>
                      {contact.online && (
                        <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0D0D0D]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{contact.name}</p>
                        {lastMsg && <span className="text-[9px] text-[#999999] shrink-0">{formatTime(lastMsg.time)}</span>}
                      </div>
                      <p className="text-[10px] text-[#999999] truncate mt-0.5">
                        {contact.online
                          ? (lang === "ar" ? "متصل" : "Online")
                          : (lang === "ar" ? "آخر ظهور " : "Last seen ") + contact.lastSeen}
                      </p>
                      {contact.unread > 0 && (
                        <span className="inline-flex w-4 h-4 text-[8px] font-bold items-center justify-center rounded-full text-white mt-0.5"
                          style={{ backgroundColor: primaryColor }}>{contact.unread}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </>
          )}

          {/* Calls tab */}
          {activeTab === "calls" && (
            <div>
              {CALLS.map((call) => (
                <div key={call.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#D4D4D4]/50 dark:border-[#333333]/50">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: getColorFromName(call.name) }}>
                    {getAvatarLetter(call.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{call.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {callIcon(call.type)}
                      <span className="text-xs text-[#999999]">{call.time}</span>
                      {call.duration && <span className="text-xs text-[#999999]">· {call.duration}</span>}
                    </div>
                  </div>
                  <button
                    className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                    {call.type === "missed" ? <Phone size={14} /> : <Video size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Video tab */}
          {activeTab === "video" && (
            <div className="p-4 space-y-3">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ابدأ اتصال فيديو" : "Start a Video Call"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CONTACTS.map((contact) => (
                  <button key={contact.id}
                    className="flex flex-col items-center gap-2 p-3 border border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white"
                      style={{ backgroundColor: getColorFromName(contact.name) }}>
                      {getAvatarLetter(contact.name)}
                    </div>
                    <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{contact.name}</p>
                    {contact.online && <span className="text-[9px] text-green-500">{lang === "ar" ? "متصل" : "Online"}</span>}
                  </button>
                ))}
              </div>
              <button onClick={() => router.push("/meetings")}
                className="w-full h-10 flex items-center justify-center gap-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}>
                <Video size={16} />
                {lang === "ar" ? "إنشاء غرفة اجتماعات" : "Create Meeting Room"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className={"flex-1 flex flex-col bg-white dark:bg-[#0D0D0D] " + ((!isCommunityChat && !activeDm) || (showMobileList && !activeDm) ? "hidden md:flex" : "flex")}>
        {(isCommunityChat || activeDm) ? (
          <>
            {/* ── Channel Bar (for communities) ── */}
            {isCommunityChat && (
              <div className="hidden md:flex items-center gap-1 px-4 py-1.5 border-b border-[#D4D4D4] dark:border-[#333333] bg-[#F9F9F9] dark:bg-[#111111]">
                <button onClick={() => setShowMemberPanel(!showMemberPanel)}
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-[#666666] dark:text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  <Hash size={12} />
                  {server?.channels.find(c => c.id === activeChannel)?.name || ""}
                </button>
                <span className="text-[#999999]">·</span>
                <span className="text-[10px] text-[#999999]">
                  {server?.members.length} {lang === "ar" ? "عضواً" : "members"}
                </span>
                <div className="flex-1" />
                <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  <PinOff size={10} />
                  {lang === "ar" ? "مثبّتة" : "Pinned"}
                </button>
                <button onClick={() => setShowMemberPanel(!showMemberPanel)}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                  <Users size={10} />
                  {lang === "ar" ? "الأعضاء" : "Members"}
                </button>
              </div>
            )}

            {/* Chat header (DM) */}
            {activeDm && currentContact && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#D4D4D4] dark:border-[#333333]">
                <button onClick={() => setShowMobileList(true)} className="md:hidden p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                  <ArrowLeft size={18} />
                </button>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: getColorFromName(currentContact.name) }}>
                    {getAvatarLetter(currentContact.name)}
                  </div>
                  {currentContact.online && (
                    <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0D0D0D]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{currentContact.name}</p>
                  <p className="text-[10px] text-[#999999]">
                    {currentContact.online
                      ? (lang === "ar" ? "متصل" : "Online")
                      : (lang === "ar" ? "آخر ظهور " : "Last seen ") + currentContact.lastSeen}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                    <Phone size={15} />
                  </button>
                  <button onClick={() => router.push("/meetings")}
                    className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                    <Video size={15} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Community channel header */}
            {isCommunityChat && (
              <div className="md:hidden flex items-center gap-2.5 px-4 py-2.5 border-b border-[#D4D4D4] dark:border-[#333333]">
                <button onClick={() => setShowMobileList(true)} className="p-1 text-[#666666]">
                  <ArrowLeft size={18} />
                </button>
                <Hash size={16} className="text-[#666666]" />
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">#{channel?.name}</p>
                <div className="flex-1" />
                <button onClick={() => setShowMemberPanel(!showMemberPanel)} className="flex items-center gap-1 text-[10px] text-[#666666]">
                  <Users size={14} />
                </button>
              </div>
            )}

            {/* ── Messages ── */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]" dir="ltr">
                <div dir={direction}>
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-xs text-[#999999] px-8 text-center">
                      <div className="space-y-2">
                        <MessageCircle size={40} className="mx-auto opacity-30" />
                        <p>{lang === "ar" ? "لا توجد رسائل بعد... ابدأ المحادثة!" : "No messages yet... Start the conversation!"}</p>
                      </div>
                    </div>
                  ) : (
                    messageGroups.map((group) => (
                      <div key={group.date}>
                        {/* Date separator */}
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-[#D4D4D4]/50 dark:bg-[#333333]/50" />
                          <span className="text-[10px] text-[#999999] font-medium whitespace-nowrap">
                            {formatDateSeparator(group.messages[0].time, lang)}
                          </span>
                          <div className="flex-1 h-px bg-[#D4D4D4]/50 dark:bg-[#333333]/50" />
                        </div>

                        {group.messages.map((msg, idx, arr) => {
                          const prev = idx > 0 ? arr[idx - 1] : null
                          const sameSender = prev && prev.senderId === msg.senderId && !prev.me && !msg.me
                          const sameMinute = prev && Math.abs(msg.time.getTime() - prev.time.getTime()) < 60000
                          const grouped = sameSender && sameMinute

                          // Discord-style for community chats
                          if (isCommunityChat && !msg.me) {
                            const color = getColorFromName(msg.sender)
                            return (
                              <div key={msg.id} className={"flex gap-2.5 mt-1 " + (grouped ? "mt-0.5" : "mt-3")}>
                                {!grouped ? (
                                  <div className="w-9 h-9 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold text-white"
                                    style={{ backgroundColor: color }}>
                                    {getAvatarLetter(msg.sender)}
                                  </div>
                                ) : <div className="w-9 shrink-0" />}
                                <div className="flex-1 min-w-0">
                                  {!grouped && (
                                    <div className="flex items-baseline gap-2 mb-0.5">
                                      <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] hover:underline cursor-pointer"
                                        style={{ color }}>
                                        {msg.sender}
                                      </span>
                                      <span className="text-[9px] text-[#999999]">{formatTime(msg.time)}</span>
                                    </div>
                                  )}
                                  <p className="text-sm leading-relaxed text-[#0D0D0D] dark:text-[#F2F2F2]">{msg.text}</p>
                                  {/* Reactions */}
                                  {msg.reactions && msg.reactions.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {msg.reactions.map((r, ri) => (
                                        <span key={ri}
                                          className={"inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border " + (r.me ? "border-blue-500 bg-blue-500/10" : "border-[#D4D4D4] dark:border-[#333333]")}>
                                          {r.emoji} {r.count}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          }

                          // WhatsApp-style for DM / own messages
                          return (
                            <div key={msg.id} className={"flex mt-2 " + (msg.me ? "justify-end" : "justify-start")}>
                              <div className={"max-w-[75%] md:max-w-[60%] px-3 py-2 " + (msg.me
                                ? "text-white rounded-[18px_18px_4px_18px]"
                                : "text-[#0D0D0D] dark:text-[#F2F2F2] bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4]/50 dark:border-[#333333]/50 rounded-[18px_18px_18px_4px]"
                              )}
                                style={msg.me ? { backgroundColor: primaryColor } : {}}>
                                {/* Reply indicator */}
                                {msg.replyTo && (
                                  <div className={"flex items-center gap-1 mb-1 p-1 rounded text-[10px] " + (msg.me ? "bg-white/10" : "bg-[#E8E8E8] dark:bg-[#333333]")}>
                                    <Reply size={10} className="shrink-0" />
                                    <span className="truncate font-medium">{msg.replyTo.sender}: {msg.replyTo.text.slice(0, 30)}</span>
                                  </div>
                                )}
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <div className={"flex items-center justify-end gap-1 mt-0.5 " + (msg.me ? "text-white/70" : "text-[#999999]")}>
                                  <span className="text-[9px]">{formatTime(msg.time)}</span>
                                  {msg.me && statusIcon(msg.status)}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))
                  )}

                  {/* Typing indicator */}
                  {typing && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-[#999999]">
                      <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-[#999999] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-[#999999] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-[#999999] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span>{typing} {lang === "ar" ? "يكتب..." : "is typing..."}</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* ── Member Panel (Discord) ── */}
              {isCommunityChat && showMemberPanel && (
                <div className="hidden md:flex flex-col w-56 shrink-0 border-s border-[#D4D4D4] dark:border-[#333333] bg-[#F9F9F9] dark:bg-[#111111] overflow-y-auto">
                  <div className="p-3 border-b border-[#D4D4D4] dark:border-[#333333]">
                    <p className="text-[10px] font-bold text-[#666666] dark:text-[#999999] uppercase tracking-wide flex items-center gap-1">
                      <Users size={12} />
                      {server?.members.length} {lang === "ar" ? "عضواً" : "members"}
                    </p>
                  </div>
                  <div className="p-2 space-y-3">
                    {(["admin", "mod", "member"] as const).map(role => {
                      const members = serverMembersByRole[role] || []
                      if (members.length === 0) return null
                      return (
                        <div key={role}>
                          <p className="text-[9px] font-bold text-[#666666] dark:text-[#999999] uppercase tracking-wide mb-1 px-2 flex items-center gap-1">
                            {roleIcons[role]}
                            {roleLabels[role][lang]} — {members.length}
                          </p>
                          {members.map(m => {
                            const color = getColorFromName(m.name)
                            return (
                              <div key={m.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#E8E8E8] dark:hover:bg-[#333333] cursor-pointer transition-colors">
                                <div className="relative">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                    style={{ backgroundColor: color }}>
                                    {getAvatarLetter(m.name)}
                                  </div>
                                  <span className={"absolute -bottom-0.5 -end-0.5 w-2 h-2 rounded-full border border-white dark:border-[#111111] " + statusColors[m.status]} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={"text-xs truncate " + (m.status === "online" ? "text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] dark:text-[#999999]")}>
                                    {m.name}
                                  </p>
                                </div>
                                {m.role === "admin" && <Crown size={10} className="text-amber-500 shrink-0" />}
                                {m.role === "mod" && <Shield size={10} className="text-blue-500 shrink-0" />}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Reply indicator ── */}
            {replyTo && (
              <div className="flex items-center gap-2 px-4 py-1.5 border-t border-[#D4D4D4] dark:border-[#333333] bg-[#F9F9F9] dark:bg-[#111111] text-xs">
                <Reply size={12} className="text-[#666666]" />
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{replyTo.sender}</span>
                <span className="text-[#999999] truncate">{replyTo.text}</span>
                <button onClick={() => setReplyTo(null)} className="me-auto p-0.5 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                  <X size={12} />
                </button>
              </div>
            )}

            {/* ── Input ── */}
            <div className="px-3 py-2.5 border-t border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
              <div className="flex items-center gap-1.5">
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors shrink-0">
                  <Paperclip size={16} />
                </button>
                <input ref={fileInputRef} type="file" className="hidden" />
                <div className="flex-1 relative">
                  <input ref={inputRef} value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
                    className="w-full h-9 px-3 pe-9 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors">
                    <Smile size={16} />
                  </button>
                  {/* Emoji picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full end-0 mb-1 p-2 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] shadow-lg z-50">
                      <div className="grid grid-cols-5 gap-1">
                        {EMOJIS.map(emoji => (
                          <button key={emoji} onClick={() => insertEmoji(emoji)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#E8E8E8] dark:hover:bg-[#333333] rounded text-base transition-colors">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors shrink-0">
                  <AtSign size={16} />
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors shrink-0">
                  <Mic size={16} />
                </button>
                <button onClick={sendMessage} disabled={!chatInput.trim()}
                  className="w-9 h-9 text-white flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30 shrink-0"
                  style={{ backgroundColor: primaryColor }}>
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-[#999999] p-8 text-center">
            <div className="space-y-3">
              <MessageCircle size={48} className="mx-auto opacity-30" />
              <p>{lang === "ar" ? "اختر محادثة أو قناة للبدء" : "Select a chat or channel to start messaging"}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Member Overlay ── */}
      {isCommunityChat && showMemberPanel && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMemberPanel(false)}>
          <div className="absolute end-0 top-0 bottom-0 w-64 bg-[#F9F9F9] dark:bg-[#111111] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <p className="text-xs font-bold text-[#666666] uppercase tracking-wide flex items-center gap-1">
                <Users size={12} /> {server?.members.length} {lang === "ar" ? "عضواً" : "members"}
              </p>
              <button onClick={() => setShowMemberPanel(false)} className="text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                <X size={16} />
              </button>
            </div>
            <div className="p-2 space-y-3">
              {(["admin", "mod", "member"] as const).map(role => {
                const members = serverMembersByRole[role] || []
                if (members.length === 0) return null
                return (
                  <div key={role}>
                    <p className="text-[9px] font-bold text-[#666666] uppercase tracking-wide mb-1 px-2">{roleLabels[role][lang]} — {members.length}</p>
                    {members.map(m => (
                      <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#E8E8E8] dark:hover:bg-[#333333] cursor-pointer transition-colors">
                        <div className="relative">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ backgroundColor: getColorFromName(m.name) }}>
                            {getAvatarLetter(m.name)}
                          </div>
                          <span className={"absolute -bottom-0.5 -end-0.5 w-2 h-2 rounded-full border border-white dark:border-[#111111] " + statusColors[m.status]} />
                        </div>
                        <p className={"text-xs truncate " + (m.status === "online" ? "text-[#0D0D0D]" : "text-[#666666]")}>{m.name}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
