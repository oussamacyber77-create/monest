"use client"

import { useState, useRef, useEffect } from "react"
import { Room } from "livekit-client"
import { X, Send, Lock, Paperclip, FileText, Download, User } from "lucide-react"
import { useChatStore } from "@/stores/chat-store"
import { useRoomStore } from "@/stores/room-store"
import { useSettingsStore } from "@/stores/settings-store"
import { mockFiles } from "@/lib/mock-data/meetings"

interface ChatPanelProps {
  room: Room | null
  onClose: () => void
}

export function ChatPanel({ room, onClose }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [showFilePicker, setShowFilePicker] = useState(false)
  const { messages, addMessage, resetUnread } = useChatStore()
  const { displayName, identity, isAdmin } = useRoomStore()
  const { direction } = useSettingsStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const lang = direction === "rtl" ? "ar" : "en"

  useEffect(() => { resetUnread() }, [resetUnread])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !room) return
    const msg = {
      type: "chat",
      sender: identity,
      senderDisplayName: displayName,
      message: input.trim(),
      timestamp: Date.now(),
      isPrivate,
    }
    const encoder = new TextEncoder()
    room.localParticipant.publishData(encoder.encode(JSON.stringify(msg)), {
      reliable: true,
    })
    addMessage({
      id: crypto.randomUUID(),
      sender: identity,
      senderDisplayName: displayName,
      message: input.trim(),
      timestamp: Date.now(),
      isPrivate,
    })
    setInput("")
    setIsPrivate(false)
  }

  const sendFile = (file: (typeof mockFiles)[0]) => {
    if (!room) return
    const msg = {
      type: "chat",
      sender: identity,
      senderDisplayName: displayName,
      message: lang === "ar" ? "أرسل ملفاً" : "Sent a file",
      timestamp: Date.now(),
      attachment: { name: file.name, size: file.size },
    }
    const encoder = new TextEncoder()
    room.localParticipant.publishData(encoder.encode(JSON.stringify(msg)), { reliable: true })
    addMessage({
      id: crypto.randomUUID(),
      sender: identity,
      senderDisplayName: displayName,
      message: lang === "ar" ? "أرسل ملفاً" : "Sent a file",
      timestamp: Date.now(),
      attachment: { name: file.name, size: file.size },
    })
    setShowFilePicker(false)
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (ts: number) => {
    const d = new Date(ts)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return lang === "ar" ? "اليوم" : "Today"
    if (d.toDateString() === yesterday.toDateString()) return lang === "ar" ? "أمس" : "Yesterday"
    return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short" })
  }

  return (
    <div className="w-80 border-s border-[#D4D4D4] dark:border-[#333333] bg-[#F2F2F2] dark:bg-[#0D0D0D] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
        <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
          {lang === "ar" ? "الدردشة" : "Chat"}
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-[#999999] dark:text-[#666666] text-center mt-8">
            {lang === "ar" ? "لا توجد رسائل بعد" : "No messages yet"}
          </p>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.sender === identity
          const prevMsg = idx > 0 ? messages[idx - 1] : null
          const prevSameSender = prevMsg?.sender === msg.sender
          const showHeader = !prevSameSender
          const msgDate = formatDate(msg.timestamp)
          const prevDate = prevMsg ? formatDate(prevMsg.timestamp) : ""
          const showDateDivider = prevMsg && msgDate !== prevDate

          return (
            <div key={msg.id}>
              {showDateDivider && (
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-[#D4D4D4] dark:bg-[#333333]" />
                  <span className="text-[10px] text-[#999999] dark:text-[#666666] shrink-0">{prevDate}</span>
                  <div className="flex-1 h-px bg-[#D4D4D4] dark:bg-[#333333]" />
                </div>
              )}
              <div className={"flex flex-col " + (isMe ? "items-end" : "items-start")}>
                {showHeader && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 bg-[#D4D4D4] dark:bg-[#333333] flex items-center justify-center shrink-0">
                      <User size={12} className="text-[#666666] dark:text-[#999999]" />
                    </div>
                    <span className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                      {msg.senderDisplayName}
                    </span>
                    {msg.isPrivate && <Lock size={10} className="text-[#DC2626]" />}
                  </div>
                )}
                {msg.attachment ? (
                  <div className={"flex items-center gap-2 px-3 py-2 text-sm max-w-[80%] " + (isMe
                    ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                    : "bg-[#E8E8E8] dark:bg-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2]")}>
                    <FileText size={14} />
                    <div className="min-w-0">
                      <p className="truncate text-xs">{msg.attachment.name}</p>
                      <p className="text-[10px] opacity-60">{msg.attachment.size}</p>
                    </div>
                    <button className="p-1 hover:opacity-60 transition-opacity">
                      <Download size={12} />
                    </button>
                  </div>
                ) : (
                  <div className={"max-w-[80%] px-3 py-2 text-sm " + (isMe
                    ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                    : "bg-[#E8E8E8] dark:bg-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2]")}>
                    {msg.message}
                  </div>
                )}
                <span className="text-[10px] text-[#999999] dark:text-[#666666] mt-0.5 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {showFilePicker && (
        <div className="px-4 py-3 border-t border-[#D4D4D4] dark:border-[#333333] space-y-2">
          <p className="text-xs text-[#999999] dark:text-[#666666]">
            {lang === "ar" ? "اختر ملفاً للرفع:" : "Choose a file to send:"}
          </p>
          {mockFiles.map((f) => (
            <button
              key={f.name}
              onClick={() => sendFile(f)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors"
            >
              <FileText size={14} />
              <span className="truncate">{f.name}</span>
              <span className="text-[10px] text-[#999999] shrink-0">{f.size}</span>
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-[#D4D4D4] dark:border-[#333333] space-y-2">
        {isAdmin && (
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={"flex items-center gap-1 text-xs font-medium transition-colors " + (isPrivate
              ? "text-[#DC2626]"
              : "text-[#999999] hover:text-[#666666]")}
          >
            <Lock size={12} />
            {isPrivate
              ? (lang === "ar" ? "إرسال خاص (للمشرف)" : "Private (to admin)")
              : (lang === "ar" ? "عام" : "Public")}
          </button>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
            className="flex-1 h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] text-sm placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
          />
          <button
            onClick={() => setShowFilePicker(!showFilePicker)}
            className="p-2 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
          >
            <Paperclip size={16} />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2 bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC] disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
