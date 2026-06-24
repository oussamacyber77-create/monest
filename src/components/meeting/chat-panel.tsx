"use client"

import { useState, useRef, useEffect } from "react"
import { Room } from "livekit-client"
import { X, Send, Lock, Paperclip, FileText, Download } from "lucide-react"
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-[#999999] dark:text-[#666666] text-center mt-8">
            {lang === "ar" ? "لا توجد رسائل بعد" : "No messages yet"}
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={"flex flex-col " + (msg.sender === identity ? "items-end" : "items-start")}
          >
            <div className="flex items-center gap-1 mb-1">
              {msg.isPrivate && <Lock size={10} className="text-[#999999]" />}
              <span className="text-xs text-[#999999] dark:text-[#666666]">{msg.senderDisplayName}</span>
            </div>
            {msg.attachment ? (
              <div className={"flex items-center gap-2 px-3 py-2 text-sm max-w-[80%] " + (msg.sender === identity
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
              <div
                className={"max-w-[80%] px-3 py-2 text-sm " + (msg.sender === identity
                  ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                  : "bg-[#E8E8E8] dark:bg-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2]")}
              >
                {msg.message}
              </div>
            )}
          </div>
        ))}
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
