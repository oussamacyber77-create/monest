"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, X, Send, Brain } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { aiChatResponses } from "@/lib/mock-data/dashboard"

export function AiChatBubble() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const q = input.trim()
    setMessages((m) => [...m, { role: "user", text: q }])
    setInput("")

    setTimeout(() => {
      const matched = Object.entries(aiChatResponses).find(([key]) =>
        q.includes(key) || key.includes(q)
      )
      const reply = matched ? matched[1][lang] : aiChatResponses["default"][lang]
      setMessages((m) => [...m, { role: "ai", text: reply }])
    }, 800 + Math.random() * 700)
  }

  return (
    <>
      <button
        id="tour-dashboard-ai-chat"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 end-6 z-50 w-14 h-14 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 end-6 z-50 w-80 sm:w-96 bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] shadow-xl flex flex-col max-h-[60vh]">
          <div className="flex items-center justify-between p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
              <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "المساعد AI" : "AI Assistant"}
              </h3>
            </div>
            <button
              onClick={() => router.push("/dashboard/chat")}
              className="text-[10px] text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
            >
              {lang === "ar" ? "شاشة كاملة" : "Full screen"}
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 && (
              <p className="text-sm text-[#999999] dark:text-[#666666] text-center mt-4">
                {lang === "ar" ? "اسأل AI عن متجرك..." : "Ask AI about your store..."}
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[85%] px-3 py-2 text-sm " + (m.role === "user"
                  ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                  : "bg-[#E8E8E8] dark:bg-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2]")}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#D4D4D4] dark:border-[#333333]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={lang === "ar" ? "اسأل سؤالاً..." : "Ask a question..."}
                className="flex-1 h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC] disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
