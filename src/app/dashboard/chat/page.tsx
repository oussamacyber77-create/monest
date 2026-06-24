"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Brain } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { aiChatResponses } from "@/lib/mock-data/dashboard"

const suggestedQuestions = (lang: string) => [
  lang === "ar" ? "لماذا انخفضت مبيعاتي؟" : "Why did my sales drop?",
  lang === "ar" ? "ما هو أفضل وقت للإعلانات؟" : "What's the best ad time?",
  lang === "ar" ? "كيف أحسن معدل التحويل؟" : "How to improve conversion rate?",
  lang === "ar" ? "أي المنتجات يجب أن أوقف؟" : "Which products should I stop?",
  lang === "ar" ? "من هم أفضل 5 عملاء؟" : "Who are my top 5 customers?",
]

export default function ChatPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = (text?: string) => {
    const q = (text || input).trim()
    if (!q) return
    setMessages((m) => [...m, { role: "user", text: q }])
    setInput("")

    setTimeout(() => {
      const matched = Object.entries(aiChatResponses).find(([key]) => q.includes(key) || key.includes(q))
      const reply = matched ? matched[1][lang] : aiChatResponses["default"][lang]
      setMessages((m) => [...m, { role: "ai", text: reply }])
    }, 800 + Math.random() * 700)
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "المساعد AI" : "AI Assistant"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "اسأل AI عن أي شيء يتعلق بمتجرك" : "Ask AI anything about your store"}
        </p>
      </div>

      <div className="flex-1 flex flex-col bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center shrink-0">
                  <Brain size={20} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
                </div>
                <div className="bg-[#E8E8E8] dark:bg-[#333333] px-4 py-3 text-sm text-[#0D0D0D] dark:text-[#F2F2F2] max-w-[80%]">
                  {lang === "ar" ? "مرحباً! أنا مساعد Monest الذكي. يمكنني مساعدتك في تحليل مبيعاتك، اقتراح تحسينات، والإجابة عن أي استفسار عن متجرك. جرب الأسئلة المقترحة أدناه!" : "Hello! I'm Monest AI Assistant. I can help analyze your sales, suggest improvements, and answer any questions about your store. Try the suggested questions below!"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions(lang).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="px-4 py-2 text-xs font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "ai" && (
                <div className="w-10 h-10 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center shrink-0 mr-2">
                  <Brain size={20} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
                </div>
              )}
              <div className={"max-w-[70%] px-4 py-3 text-sm " + (m.role === "user"
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
              placeholder={lang === "ar" ? "اكتب سؤالك هنا..." : "Type your question here..."}
              className="flex-1 h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="px-6 bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC] disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Send size={16} />
              {lang === "ar" ? "إرسال" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
