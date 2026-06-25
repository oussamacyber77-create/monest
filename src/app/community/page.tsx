"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { Users, Phone, Video, Search, Pin, Check, CheckCheck, Clock, MoreHorizontal, MessageCircle, PhoneIncoming, PhoneOutgoing, PhoneMissed, Camera, User, ArrowLeft, Send, Image, Paperclip, Mic } from "lucide-react"

interface Contact {
  id: string
  name: string
  avatar: string
  online: boolean
  lastSeen?: string
  pinned?: boolean
  group?: boolean
  members?: number
  unread: number
}

interface ChatMessage {
  id: string
  text: string
  sender: string
  senderId: string
  time: string
  me: boolean
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "voice"
}

interface Call {
  id: string
  name: string
  avatar: string
  type: "incoming" | "outgoing" | "missed"
  time: string
  duration?: string
}

const CONTACTS: Contact[] = [
  { id: "group-main", name: "مجتمع متجرك", avatar: "م", online: true, pinned: true, group: true, members: 128, unread: 3 },
  { id: "contact-1", name: "سارة الحربي", avatar: "س", online: true, lastSeen: "الآن", unread: 0 },
  { id: "contact-2", name: "فهد العتيبي", avatar: "ف", online: false, lastSeen: "منذ 5 دقائق", unread: 1 },
  { id: "contact-3", name: "نورة الدوسري", avatar: "ن", online: true, lastSeen: "الآن", unread: 0 },
  { id: "contact-4", name: "خالد المطيري", avatar: "خ", online: false, lastSeen: "منذ ساعة", unread: 0 },
  { id: "contact-5", name: "منى الشمري", avatar: "م", online: true, lastSeen: "الآن", unread: 2 },
  { id: "contact-6", name: "سعود القحطاني", avatar: "س", online: false, lastSeen: "منذ 3 ساعات", unread: 0 },
  { id: "contact-7", name: "هند الزهراني", avatar: "ه", online: true, lastSeen: "الآن", unread: 0 },
]

const GROUP_CHAT: ChatMessage[] = [
  { id: "g1", text: "مرحباً بالجميع! 👋 اجتماعنا الأسبوعي بكرة الساعة 10", sender: "أحمد السالم", senderId: "admin", time: "09:30", me: false, status: "read", type: "text" },
  { id: "g2", text: "تمام 👍 هنكون في الموعد", sender: "سارة", senderId: "contact-1", time: "09:32", me: false, status: "read", type: "text" },
  { id: "g3", text: "فكرة رائعة المنصة هذي", sender: "فهد", senderId: "contact-2", time: "09:35", me: false, status: "read", type: "text" },
  { id: "g4", text: "شكراً يا شباب! أقدر تعاونكم", sender: "أنت", senderId: "me", time: "09:40", me: true, status: "read", type: "text" },
  { id: "g5", text: "باقي نحدد محور النقاش — وش رايكم نركز على استراتيجية التسويق للربع الثالث؟", sender: "أحمد السالم", senderId: "admin", time: "09:42", me: false, status: "read", type: "text" },
  { id: "g6", text: "اتفاق! عندي أفكار حلوة للمحتوى", sender: "نورة", senderId: "contact-3", time: "09:45", me: false, status: "read", type: "text" },
  { id: "g7", text: "تمام, خل نناقشها بكرة", sender: "أنت", senderId: "me", time: "09:50", me: true, status: "delivered", type: "text" },
]

const INDIVIDUAL_CHATS: Record<string, ChatMessage[]> = {
  "contact-2": [
    { id: "c1", text: "السلام عليكم، عندي استفسار عن المنتج الجديد", sender: "فهد", senderId: "contact-2", time: "14:20", me: false, status: "read", type: "text" },
    { id: "c2", text: "وعليكم السلام! تفضل اسأل", sender: "أنت", senderId: "me", time: "14:25", me: true, status: "read", type: "text" },
  ],
  "contact-5": [
    { id: "m1", text: "مرحباً، ممكن ترسل لي رابط الاجتماع؟", sender: "منى", senderId: "contact-5", time: "11:05", me: false, status: "read", type: "text" },
    { id: "m2", text: "أكيد! https://meet.monest.app/xyz", sender: "أنت", senderId: "me", time: "11:10", me: true, status: "delivered", type: "text" },
    { id: "m3", text: "شكراً جزيلاً 🙏", sender: "منى", senderId: "contact-5", time: "11:12", me: false, status: "read", type: "text" },
  ],
}

const CALLS: Call[] = [
  { id: "cl1", name: "سارة الحربي", avatar: "س", type: "outgoing", time: "اليوم 10:30", duration: "12:34" },
  { id: "cl2", name: "مجتمع متجرك", avatar: "م", type: "incoming", time: "اليوم 09:15", duration: "45:20" },
  { id: "cl3", name: "فهد العتيبي", avatar: "ف", type: "missed", time: "أمس 16:45" },
  { id: "cl4", name: "منى الشمري", avatar: "م", type: "outgoing", time: "أمس 14:00", duration: "08:15" },
  { id: "cl5", name: "نورة الدوسري", avatar: "ن", type: "incoming", time: "2026-06-22", duration: "22:10" },
  { id: "cl6", name: "خالد المطيري", avatar: "خ", type: "missed", time: "2026-06-21" },
]

export default function CommunityPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeTab, setActiveTab] = useState<"chats" | "calls" | "video">("chats")
  const [activeChat, setActiveChat] = useState<string | null>("group-main")
  const [chatInput, setChatInput] = useState("")
  const [search, setSearch] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentContact = CONTACTS.find(c => c.id === activeChat)
  const isGroup = currentContact?.group

  const getChatMessages = (): ChatMessage[] => {
    if (!activeChat) return []
    if (activeChat === "group-main") return GROUP_CHAT
    return INDIVIDUAL_CHATS[activeChat] || []
  }

  const messages = getChatMessages()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeChat])

  const filteredContacts = CONTACTS.filter(c => {
    if (search) return c.name.includes(search)
    return true
  })

  // Sort: pinned first, then by unread
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.unread - a.unread
  })

  const sendMessage = () => {
    if (!chatInput.trim() || !activeChat) return
    const now = new Date()
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")
    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      text: chatInput,
      sender: "أنت",
      senderId: "me",
      time,
      me: true,
      status: "sent",
      type: "text",
    }
    if (activeChat === "group-main") {
      GROUP_CHAT.push(newMsg)
    } else {
      if (!INDIVIDUAL_CHATS[activeChat]) INDIVIDUAL_CHATS[activeChat] = []
      INDIVIDUAL_CHATS[activeChat].push(newMsg)
    }
    setChatInput("")
    // Simulate reply
    setTimeout(() => {
      const replyTime = new Date()
      const rt = replyTime.getHours().toString().padStart(2, "0") + ":" + replyTime.getMinutes().toString().padStart(2, "0")
      const reply: ChatMessage = {
        id: "reply-" + Date.now(),
        text: lang === "ar" ? "تم الاستلام! شكراً لك 🙏" : "Got it! Thank you 🙏",
        sender: isGroup ? "المشرف" : currentContact?.name || "المستخدم",
        senderId: "reply",
        time: rt,
        me: false,
        status: "read",
        type: "text",
      }
      if (activeChat === "group-main") {
        GROUP_CHAT.push(reply)
      } else {
        if (INDIVIDUAL_CHATS[activeChat]) INDIVIDUAL_CHATS[activeChat].push(reply)
      }
    }, 1500 + Math.random() * 2000)
  }

  const startVideoCall = () => {
    router.push("/meetings")
  }

  const startDirectCall = (contact: Contact) => {
    router.push("/meetings")
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

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F2F2F2] dark:bg-[#0D0D0D] h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Left sidebar - contact/chat list */}
        <div className={"w-full md:w-80 lg:w-96 border-e border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] flex flex-col " + (activeChat && !showMobileList ? "hidden md:flex" : "flex")}>
          {/* Header */}
          <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "المجتمع" : "Community"}
              </h1>
            </div>
            {/* Tabs */}
            <div className="flex gap-2 mb-3">
              {(["chats", "calls", "video"] as const).map((t) => (
                <button key={t} onClick={() => { setActiveTab(t); setActiveChat(t === "video" ? null : activeChat) }}
                  className={"flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 " + (activeTab === t ? "bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]" : "bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#666666] dark:text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}>
                  {t === "chats" ? <MessageCircle size={14} /> : t === "calls" ? <Phone size={14} /> : <Video size={14} />}
                  {t === "chats" ? (lang === "ar" ? "المحادثات" : "Chats") : t === "calls" ? (lang === "ar" ? "المكالمات" : "Calls") : (lang === "ar" ? "فيديو" : "Video")}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "ar" ? "بحث في المجتمع..." : "Search community..."}
                className="w-full h-9 ps-9 pe-3 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "chats" && (
              <>
                {sortedContacts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-xs text-[#999999] p-4 text-center">
                    {lang === "ar" ? "لا توجد نتائج للبحث" : "No search results"}
                  </div>
                ) : (
                  sortedContacts.map((contact) => {
                    const lastMsg = contact.id === "group-main"
                      ? GROUP_CHAT[GROUP_CHAT.length - 1]
                      : INDIVIDUAL_CHATS[contact.id]?.[INDIVIDUAL_CHATS[contact.id]?.length - 1]
                    return (
                      <button key={contact.id} onClick={() => { setActiveChat(contact.id); setShowMobileList(false) }}
                        className={"w-full flex items-center gap-3 px-4 py-3 transition-colors text-start border-b border-[#D4D4D4]/50 dark:border-[#333333]/50 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] " + (activeChat === contact.id ? "bg-[#F2F2F2] dark:bg-[#1A1A1A]" : "")}>
                        {/* Avatar */}
                        <div className={"w-12 h-12 shrink-0 flex items-center justify-center text-sm font-bold relative " + (contact.group ? "rounded-lg bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]" : "rounded-full bg-[#E8E8E8] dark:bg-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2]")}>
                          {contact.avatar}
                          {contact.pinned && contact.group && (
                            <span className="absolute -top-1 -end-1 w-4 h-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] rounded flex items-center justify-center">
                              <Pin size={8} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
                            </span>
                          )}
                          {contact.online && !contact.group && (
                            <span className="absolute bottom-0 end-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#0D0D0D]" />
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate flex items-center gap-1">
                              {contact.name}
                              {contact.pinned && <Pin size={10} className="text-[#999999]" />}
                            </p>
                            {lastMsg && <span className="text-[10px] text-[#999999] shrink-0">{lastMsg.time}</span>}
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            {contact.group ? (
                              <p className="text-xs text-[#999999] truncate">
                                {contact.members} {lang === "ar" ? "عضواً" : "members"}
                              </p>
                            ) : (
                              <p className="text-xs text-[#999999] truncate">
                                {contact.online
                                  ? (lang === "ar" ? "متصل" : "Online")
                                  : (lang === "ar" ? "آخر ظهور" : "Last seen") + " " + contact.lastSeen}
                              </p>
                            )}
                            {contact.unread > 0 && (
                              <span className="w-5 h-5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-[9px] font-bold flex items-center justify-center shrink-0">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                          {lastMsg && contact.id !== "group-main" && (
                            <p className="text-[10px] text-[#999999] mt-0.5 truncate">{lastMsg.text}</p>
                          )}
                        </div>
                      </button>
                    )
                  })
                )}
              </>
            )}

            {activeTab === "calls" && (
              <div>
                {CALLS.map((call) => (
                  <div key={call.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#D4D4D4]/50 dark:border-[#333333]/50">
                    <div className="w-12 h-12 rounded-full bg-[#E8E8E8] dark:bg-[#333333] flex items-center justify-center text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] shrink-0">
                      {call.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{call.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {callIcon(call.type)}
                        <span className="text-xs text-[#999999]">{call.time}</span>
                        {call.duration && <span className="text-xs text-[#999999]">· {call.duration}</span>}
                      </div>
                    </div>
                    <button onClick={() => startDirectCall(CONTACTS.find(c => c.name === call.name) || CONTACTS[0])}
                      className="w-8 h-8 flex items-center justify-center text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                      {call.type === "missed" ? <Phone size={14} /> : <Video size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "video" && (
              <div className="p-6 space-y-4">
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">
                  {lang === "ar" ? "ابدأ اتصال فيديو" : "Start a Video Call"}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {CONTACTS.filter(c => !c.group).map((contact) => (
                    <button key={contact.id} onClick={() => startDirectCall(contact)}
                      className="flex flex-col items-center gap-2 p-4 border border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors">
                      <div className="w-14 h-14 rounded-full bg-[#E8E8E8] dark:bg-[#333333] flex items-center justify-center text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                        {contact.avatar}
                      </div>
                      <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{contact.name}</p>
                      {contact.online && <span className="text-[9px] text-green-500">{lang === "ar" ? "متصل" : "Online"}</span>}
                    </button>
                  ))}
                </div>
                <button onClick={startVideoCall}
                  className="w-full h-11 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Video size={16} />
                  {lang === "ar" ? "إنشاء غرفة اجتماعات" : "Create Meeting Room"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - chat view */}
        <div className={"flex-1 flex flex-col bg-white dark:bg-[#0D0D0D] " + (!activeChat || (activeChat && showMobileList) ? "hidden md:flex" : "flex")}>
          {activeChat && currentContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#D4D4D4] dark:border-[#333333]">
                <button onClick={() => setShowMobileList(true)} className="md:hidden p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                  <ArrowLeft size={18} />
                </button>
                <div className={"w-10 h-10 shrink-0 flex items-center justify-center text-sm font-bold " + (currentContact.group ? "rounded-lg bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]" : "rounded-full bg-[#E8E8E8] dark:bg-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2]")}>
                  {currentContact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{currentContact.name}</p>
                  <p className="text-[10px] text-[#999999]">
                    {currentContact.group
                      ? (lang === "ar" ? currentContact.members + " عضواً" : currentContact.members + " members")
                      : currentContact.online
                        ? (lang === "ar" ? "متصل" : "Online")
                        : (lang === "ar" ? "آخر ظهور " : "Last seen ") + currentContact.lastSeen}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!currentContact.group && (
                    <button onClick={() => startDirectCall(currentContact)}
                      className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                      <Phone size={16} />
                    </button>
                  )}
                  <button onClick={startVideoCall}
                    className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                    <Video size={16} />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-xs text-[#999999]">
                    {lang === "ar" ? "لا توجد رسائل بعد... ابدأ المحادثة!" : "No messages yet... Start the conversation!"}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={"flex " + (msg.me ? "justify-end" : "justify-start")}>
                      <div className={"max-w-[75%] md:max-w-[60%] px-3 py-2 " + (msg.me ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] rounded-[18px_18px_4px_18px]" : "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2] border border-[#D4D4D4]/50 dark:border-[#333333]/50 rounded-[18px_18px_18px_4px]")}>
                        {!msg.me && isGroup && (
                          <p className="text-[10px] font-bold mb-0.5 text-[#0D0D0D]/60 dark:text-[#F2F2F2]/60">{msg.sender}</p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={"flex items-center justify-end gap-1 mt-0.5 " + (msg.me ? "text-[#F2F2F2]/60 dark:text-[#0D0D0D]/60" : "text-[#999999]")}>
                          <span className="text-[9px]">{msg.time}</span>
                          {msg.me && statusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
                <div className="flex items-center gap-2">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors shrink-0">
                    <Paperclip size={18} className="-scale-x-100" />
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" />
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
                    className="flex-1 h-10 px-4 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" />
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors shrink-0">
                    <Mic size={18} />
                  </button>
                  <button onClick={sendMessage} disabled={!chatInput.trim()}
                    className="w-10 h-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30 shrink-0">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : activeTab === "video" ? null : (
            <div className="flex-1 flex items-center justify-center text-sm text-[#999999] p-8 text-center">
              <div className="space-y-3">
                <MessageCircle size={48} className="mx-auto opacity-30" />
                <p>{lang === "ar" ? "اختر محادثة للبدء" : "Select a chat to start messaging"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
