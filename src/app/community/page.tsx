"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { Users, TrendingUp, ShoppingBag, BarChart3, Globe, MessageCircle, Send, Hash, Video, Plus, UserPlus, ChevronRight } from "lucide-react"

interface ChatMsg {
  text: string
  me: boolean
  sender: string
  time: string
}

interface Group {
  id: string
  name: string
  members: number
  active: boolean
  unread: number
}

export default function CommunityPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [tab, setTab] = useState<"stats" | "chat" | "groups">("stats")
  const [activeGroup, setActiveGroup] = useState("general")
  const [chatMsg, setChatMsg] = useState("")
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { text: lang === "ar" ? "مرحباً بالجميع! 👋" : "Hello everyone! 👋", me: false, sender: "أحمد", time: "10:30" },
    { text: lang === "ar" ? "فكرة رائعة المنصة هذي" : "Great platform idea", me: false, sender: "سارة", time: "10:32" },
  ])

  const groups: Group[] = [
    { id: "general", name: lang === "ar" ? "عام" : "General", members: 128, active: true, unread: 3 },
    { id: "marketing", name: lang === "ar" ? "التسويق" : "Marketing", members: 67, active: true, unread: 0 },
    { id: "products", name: lang === "ar" ? "المنتجات" : "Products", members: 54, active: true, unread: 1 },
    { id: "consulting", name: lang === "ar" ? "استشارات" : "Consulting", members: 42, active: true, unread: 0 },
  ]

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    const now = new Date()
    setChatMsgs((prev) => [...prev, { text: chatMsg, me: true, sender: "أنت", time: now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0") }])
    setChatMsg("")
    setTimeout(() => {
      const now2 = new Date()
      setChatMsgs((prev) => [...prev, {
        text: lang === "ar" ? "تم استلام رسالتك! أحد المشرفين سيرد عليك قريباً" : "Message received! A moderator will respond shortly",
        me: false, sender: lang === "ar" ? "مشرف" : "Moderator",
        time: now2.getHours().toString().padStart(2, "0") + ":" + now2.getMinutes().toString().padStart(2, "0"),
      }])
    }, 2000)
  }

  const startVideoCall = () => {
    router.push("/meetings")
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
              {lang === "ar" ? "الكومينتي" : "Community"}
            </h1>
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "مجتمع متجرك - تواصل، مجموعة، ونمو" : "Your store community - Connect, Group, and Grow"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={startVideoCall} className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-80 transition-opacity flex items-center gap-2">
              <Video size={14} />
              {lang === "ar" ? "اجتماع فيديو" : "Video Call"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1 max-w-sm">
          {(["stats", "chat", "groups"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={"flex-1 py-2 text-xs font-medium transition-colors " + (tab === t ? "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}>
              {t === "stats" ? (lang === "ar" ? "الإحصائيات" : "Stats") : t === "chat" ? (lang === "ar" ? "المحادثة" : "Chat") : (lang === "ar" ? "المجموعات" : "Groups")}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: TrendingUp, label: { ar: "متوسط التحويل", en: "Avg. Conversion" }, value: "3.8%", change: "+0.6%", color: "text-green-500" },
                { icon: ShoppingBag, label: { ar: "متوسط قيمة الطلب", en: "Avg. Order Value" }, value: "347 ر.س", change: "+12%", color: "text-green-500" },
                { icon: BarChart3, label: { ar: "أكثر القطاعات نمواً", en: "Fastest Growing Sector" }, value: "الإلكترونيات", change: "+28%", color: "text-blue-500" },
                { icon: Globe, label: { ar: "اتجاهات السوق", en: "Market Trends" }, value: "موسمية", change: "قادمة", color: "text-violet-500" },
              ].map((s) => (
                <div key={s.label.en} className="p-5 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
                  <s.icon size={24} className={s.color + " mb-3"} />
                  <p className="text-xs text-[#999999] mb-1">{s.label[lang]}</p>
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: s.change.startsWith("+") ? "#16A34A" : "#DC2626" }}>{s.change}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6">
                <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">{lang === "ar" ? "أفضل أوقات البيع" : "Best Selling Times"}</h2>
                <div className="space-y-3">
                  {[
                    { time: lang === "ar" ? "6 مساءً - 10 مساءً" : "6 PM - 10 PM", pct: 42 },
                    { time: lang === "ar" ? "12 مساءً - 4 مساءً" : "12 PM - 4 PM", pct: 28 },
                    { time: lang === "ar" ? "8 صباحاً - 12 مساءً" : "8 AM - 12 PM", pct: 18 },
                  ].map((t) => (
                    <div key={t.time} className="flex items-center gap-3">
                      <span className="text-xs text-[#666666] dark:text-[#999999] w-28">{t.time}</span>
                      <div className="flex-1 h-2 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
                        <div className="h-full bg-[#0D0D0D] dark:bg-[#F2F2F2]" style={{ width: t.pct + "%" }} />
                      </div>
                      <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6">
                <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">{lang === "ar" ? "أعضاء المجتمع" : "Community Members"}</h2>
                <div className="flex items-center gap-4">
                  <Users size={32} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  <div>
                    <p className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">128</p>
                    <p className="text-xs text-[#999999]">{lang === "ar" ? "عضو نشط" : "Active Members"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {tab === "chat" && (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] flex flex-col h-[500px]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{groups.find((g) => g.id === activeGroup)?.name}</span>
              </div>
              <button onClick={startVideoCall} className="flex items-center gap-1 text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2] hover:opacity-70 transition-opacity">
                <Video size={14} />
                {lang === "ar" ? "اتصال فيديو" : "Video"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMsgs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-[#999999]">
                  {lang === "ar" ? "لا توجد رسائل بعد، كن أول من يرسل!" : "No messages yet, be the first!"}
                </div>
              ) : (
                chatMsgs.map((msg, i) => (
                  <div key={i} className={"flex " + (msg.me ? "justify-end" : "justify-start")}>
                    <div className={"max-w-[70%] p-3 " + (msg.me ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : "bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]")}>
                      {!msg.me && <p className="text-[10px] font-bold mb-1 opacity-60">{msg.sender}</p>}
                      <p className="text-sm">{msg.text}</p>
                      <p className={"text-[10px] mt-1 " + (msg.me ? "text-[#F2F2F2]/50 dark:text-[#0D0D0D]/50" : "text-[#666666] dark:text-[#999999]")}>{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-[#D4D4D4] dark:border-[#333333]">
              <div className="flex gap-2">
                <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()} placeholder={lang === "ar" ? "اكتب رسالتك..." : "Type your message..."} className="flex-1 h-11 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                <button onClick={sendMsg} className="w-11 h-11 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center hover:opacity-80 transition-opacity"><Send size={16} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {tab === "groups" && (
          <div className="grid md:grid-cols-2 gap-4">
            {groups.map((g) => (
              <button key={g.id} onClick={() => { setActiveGroup(g.id); setTab("chat") }} className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors text-start flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center">
                    <Users size={20} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{g.name}</p>
                    <p className="text-xs text-[#999999]">{g.members} {lang === "ar" ? "عضو" : "members"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {g.unread > 0 && <span className="w-5 h-5 bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">{g.unread}</span>}
                  <ChevronRight size={16} className="text-[#999999]" />
                </div>
              </button>
            ))}
            <button className="bg-white dark:bg-[#0D0D0D] border border-dashed border-[#D4D4D4] dark:border-[#333333] p-5 hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2 text-sm text-[#999999]">
              <Plus size={16} />
              {lang === "ar" ? "إنشاء مجموعة جديدة" : "Create New Group"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
