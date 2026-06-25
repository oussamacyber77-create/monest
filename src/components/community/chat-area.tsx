"use client"

import { useState, useRef, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Hash, ArrowLeft, Users, Pin, Phone, Video, MoreHorizontal,
  MessageCircle, Send, Smile, Paperclip, AtSign,
  Reply, Check, CheckCheck, X,
} from "lucide-react"
import { getColorFromName, getAvatarLetter, formatTime, formatDateSeparator, groupMessages, getRandomReply } from "@/components/community/utils"
import { GROUP_CHATS, INDIVIDUAL_CHATS, EMOJIS } from "@/components/community/data"
import type { Server, Contact, Channel, ChatMessage, ReplyTo } from "@/components/community/types"

interface ChatAreaProps {
  lang: string
  direction: string
  primaryColor: string
  server: Server | undefined
  channel: Channel | undefined
  activeDm: string | null
  currentContact: Contact | null
  onToggleMembers: () => void
  onBackToList: () => void
  membersCount: number
}

export default function ChatArea({
  lang, direction, primaryColor,
  server, channel, activeDm, currentContact,
  onToggleMembers, onBackToList, membersCount,
}: ChatAreaProps) {
  const router = useRouter()
  const [chatInput, setChatInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyTo, setReplyTo] = useState<ReplyTo | null>(null)
  const [typing, setTyping] = useState<string | null>(null)
  const [messagesState, setMessagesState] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  const isCommunityChat = !!server && !!channel

  // Load messages
  useEffect(() => {
    if (activeDm) {
      setMessagesState(INDIVIDUAL_CHATS[activeDm] || [])
    } else if (channel) {
      setMessagesState(GROUP_CHATS[channel.id] || [])
    } else {
      setMessagesState([])
    }
  }, [activeDm, channel])

  const messageGroups = useMemo(() => groupMessages(messagesState), [messagesState])

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesState])

  // Typing simulation
  useEffect(() => {
    if (chatInput.length > 0 && isCommunityChat) {
      const t = setTimeout(() => setTyping("أحمد السالم"), 2000)
      return () => {
        clearTimeout(t)
        setTyping(null)
      }
    }
  }, [chatInput, isCommunityChat])

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return
    const handleClick = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showEmojiPicker])

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
      setMessagesState([...INDIVIDUAL_CHATS[activeDm]])
    } else if (channel) {
      if (!GROUP_CHATS[channel.id]) GROUP_CHATS[channel.id] = []
      GROUP_CHATS[channel.id].push(newMsg)
      setMessagesState([...GROUP_CHATS[channel.id]])
    }

    setChatInput("")
    setReplyTo(null)
    setShowEmojiPicker(false)

    // Simulate reply
    setTimeout(() => {
      const senderName = server?.members
        ? server.members[Math.floor(Math.random() * server.members.length)]?.name
        : "المستخدم"
      const reply: ChatMessage = {
        id: "reply-" + Date.now(),
        text: getRandomReply(),
        sender: senderName,
        senderId: "reply-" + Math.random().toString(36).slice(2, 6),
        time: new Date(),
        me: false,
        status: "read",
      }
      if (activeDm && INDIVIDUAL_CHATS[activeDm]) {
        INDIVIDUAL_CHATS[activeDm].push(reply)
        setMessagesState([...INDIVIDUAL_CHATS[activeDm]])
      } else if (channel) {
        if (GROUP_CHATS[channel.id]) {
          GROUP_CHATS[channel.id].push(reply)
          setMessagesState([...GROUP_CHATS[channel.id]])
        }
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
    setChatInput((prev) => prev + emoji)
    inputRef.current?.focus()
    setShowEmojiPicker(false)
  }

  const statusIcon = (status: string) => {
    if (status === "sent") return <Check size={12} />
    if (status === "delivered") return <CheckCheck size={12} />
    return <CheckCheck size={12} className="text-blue-500" />
  }

  // ── Empty state ──
  if (!isCommunityChat && !activeDm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0D0D0D]">
        <div className="text-center space-y-3 max-w-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0F0F0] dark:bg-[#1A1A1A] flex items-center justify-center">
            <MessageCircle size={28} className="text-[#999]" />
          </div>
          <p className="text-sm text-[#999]">
            {lang === "ar" ? "اختر محادثة أو قناة لبدء المراسلة" : "Select a chat or channel to start messaging"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0D0D0D]">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] shrink-0">
        {/* Back button (mobile) */}
        <button
          onClick={onBackToList}
          className="md:hidden p-1.5 -ms-1 text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] rounded-lg hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] transition-all"
        >
          <ArrowLeft size={18} />
        </button>

        {isCommunityChat && (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: getColorFromName(server?.name || "") }}
              >
                {getAvatarLetter(server?.name || "")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate flex items-center gap-1.5">
                  <Hash size={14} className="text-[#888] shrink-0" />
                  {channel?.name || ""}
                </p>
                <p className="text-[10px] text-[#999]">
                  {membersCount} {lang === "ar" ? "عضوا" : "members"}
                </p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-0.5">
              <button className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-lg transition-all">
                <Pin size={14} />
                <span className="hidden lg:inline">{lang === "ar" ? "مثبتة" : "Pinned"}</span>
              </button>
              <button
                onClick={onToggleMembers}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-lg transition-all"
              >
                <Users size={14} />
                <span className="hidden lg:inline">{lang === "ar" ? "الأعضاء" : "Members"}</span>
              </button>
            </div>
          </>
        )}

        {currentContact && (
          <>
            <div className="relative shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: getColorFromName(currentContact.name) }}
              >
                {getAvatarLetter(currentContact.name)}
              </div>
              {currentContact.online && (
                <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0D0D0D]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{currentContact.name}</p>
              <p className="text-[10px] text-[#999]">
                {currentContact.online
                  ? lang === "ar" ? "متصل" : "Online"
                  : currentContact.lastSeen || ""}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-lg transition-all">
                <Phone size={16} />
              </button>
              <button
                onClick={() => router.push("/meetings")}
                className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-lg transition-all"
              >
                <Video size={16} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-lg transition-all">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8F8F8] dark:bg-[#111]" dir="ltr">
        <div dir={direction} className="max-w-3xl mx-auto">
          {messagesState.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-[#999]">
              <div className="text-center space-y-3">
                <MessageCircle size={40} className="mx-auto opacity-30" />
                <p>{lang === "ar" ? "لا توجد رسائل بعد... ابدأ المحادثة!" : "No messages yet... Start the conversation!"}</p>
              </div>
            </div>
          ) : (
            messageGroups.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#E0E0E0] dark:bg-[#2A2A2A]" />
                  <span className="text-[11px] text-[#999] font-medium whitespace-nowrap bg-[#F8F8F8] dark:bg-[#111] px-3">
                    {formatDateSeparator(group.messages[0].time, lang)}
                  </span>
                  <div className="flex-1 h-px bg-[#E0E0E0] dark:bg-[#2A2A2A]" />
                </div>

                {group.messages.map((msg, idx, arr) => {
                  const prev = idx > 0 ? arr[idx - 1] : null
                  const sameSender = prev && prev.senderId === msg.senderId && !prev.me && !msg.me
                  const sameMinute = prev && Math.abs(msg.time.getTime() - prev.time.getTime()) < 60000
                  const grouped = sameSender && sameMinute

                  // Community chat - Discord style
                  if (isCommunityChat && !msg.me) {
                    const color = getColorFromName(msg.sender)
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${grouped ? "mt-0.5" : "mt-4"}`}
                      >
                        {!grouped ? (
                          <div
                            className="w-9 h-9 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {getAvatarLetter(msg.sender)}
                          </div>
                        ) : (
                          <div className="w-9 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          {!grouped && (
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span
                                className="text-xs font-bold hover:underline cursor-pointer"
                                style={{ color }}
                              >
                                {msg.sender}
                              </span>
                              <span className="text-[10px] text-[#999]">{formatTime(msg.time)}</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed text-[#0D0D0D] dark:text-[#F2F2F2]">
                            {msg.text}
                          </p>
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex gap-1 mt-1.5">
                              {msg.reactions.map((r, ri) => (
                                <span
                                  key={ri}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                                    r.me
                                      ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                      : "border-[#E0E0E0] dark:border-[#333] text-[#888] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A]"
                                  }`}
                                >
                                  {r.emoji} {r.count}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }

                  // DM / own message - WhatsApp style
                  return (
                    <div
                      key={msg.id}
                      className={`flex mt-2 ${msg.me ? "justify-start flex-row-reverse" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] md:max-w-[65%] lg:max-w-[55%] px-3.5 py-2.5 ${
                          msg.me
                            ? "text-white rounded-2xl rounded-ee-sm"
                            : "text-[#0D0D0D] dark:text-[#F2F2F2] bg-white dark:bg-[#0D0D0D] border border-[#E0E0E0] dark:border-[#333] rounded-2xl rounded-es-sm"
                        }`}
                        style={msg.me ? { backgroundColor: primaryColor } : {}}
                      >
                        {msg.replyTo && (
                          <div
                            className={`flex items-center gap-1.5 mb-1.5 p-1.5 rounded-lg text-[11px] ${
                              msg.me ? "bg-white/15" : "bg-[#F0F0F0] dark:bg-[#1A1A1A]"
                            }`}
                          >
                            <Reply size={10} className="shrink-0" />
                            <span className="truncate font-medium">
                              {msg.replyTo.sender}: {msg.replyTo.text.slice(0, 30)}
                            </span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            msg.me ? "text-white/70" : "text-[#aaa]"
                          }`}
                        >
                          <span className="text-[10px]">{formatTime(msg.time)}</span>
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
            <div className="flex items-center gap-2 mt-3 text-xs text-[#999]">
              <div className="flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span>
                {typing} {lang === "ar" ? "يكتب..." : "is typing..."}
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* ── Reply indicator ── */}
      {replyTo && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D] text-xs">
          <Reply size={12} className="text-[#888]" />
          <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{replyTo.sender}</span>
          <span className="text-[#999] truncate">{replyTo.text}</span>
          <button
            onClick={() => setReplyTo(null)}
            className="me-auto p-0.5 text-[#999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] rounded transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Message Composer ── */}
      <div className="px-4 py-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D]">
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-xl transition-all shrink-0"
          >
            <Paperclip size={18} />
          </button>
          <input ref={fileInputRef} type="file" className="hidden" />

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
              className="w-full h-10 px-4 pe-11 bg-[#F5F5F5] dark:bg-[#1A1A1A] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999] outline-none focus:ring-1 focus:ring-[#0D0D0D]/20 dark:focus:ring-white/20 rounded-xl transition-all"
            />
            <div className="absolute end-2 bottom-1/2 translate-y-1/2" ref={emojiRef}>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-[#999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] rounded-lg hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] transition-all"
              >
                <Smile size={18} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full end-0 mb-2 p-2 bg-white dark:bg-[#0D0D0D] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xl rounded-xl z-50">
                  <div className="grid grid-cols-5 gap-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] rounded-lg text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] rounded-xl transition-all shrink-0">
            <AtSign size={18} />
          </button>

          <button
            onClick={sendMessage}
            disabled={!chatInput.trim()}
            className="w-10 h-10 text-white flex items-center justify-center rounded-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
