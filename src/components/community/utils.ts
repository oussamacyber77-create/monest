import type { ChatMessage, Member } from "./types"

const AVATAR_COLORS = [
  "#5865F2", "#ED4245", "#57F287", "#FEE75C", "#EB459E",
  "#FF73FA", "#00E5FF", "#FFC83F", "#25D366", "#7C3AED",
  "#F97316", "#06B6D4", "#8B5CF6", "#EC4899", "#14B8A6",
]

export function getColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getAvatarLetter(name: string): string {
  return name.trim().charAt(0)
}

export function formatTime(d: Date): string {
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0")
}

export function formatDateSeparator(d: Date, lang: string): string {
  const now = new Date()
  if (isSameDay(d, now)) return lang === "ar" ? "اليوم" : "Today"
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(d, yesterday)) return lang === "ar" ? "أمس" : "Yesterday"
  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function groupMessages(msgs: ChatMessage[]): { date: string; messages: ChatMessage[] }[] {
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

export const statusColors: Record<string, string> = {
  online: "bg-green-500",
  away: "bg-amber-500",
  offline: "bg-[#999999]",
}

export function groupMembersByRole(members: Member[]): Record<string, Member[]> {
  const groups: Record<string, Member[]> = { admin: [], mod: [], member: [] }
  for (const m of members) groups[m.role].push(m)
  return groups
}

const REPLY_TEXTS = [
  "تم الاستلام! شكراً لك",
  "تمام",
  "حلو كثير!",
  "نعم متفق معك",
  "رائع!",
]

export function getRandomReply(): string {
  return REPLY_TEXTS[Math.floor(Math.random() * REPLY_TEXTS.length)]
}
