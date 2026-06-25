import type { Server, Contact, ChatMessage, Call } from "./types"

export const SERVERS: Server[] = [
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

export const CONTACTS: Contact[] = [
  { id: "contact-1", name: "سارة الحربي", online: true, lastSeen: "الآن", unread: 0 },
  { id: "contact-2", name: "فهد العتيبي", online: false, lastSeen: "منذ 5 دقائق", unread: 1 },
  { id: "contact-3", name: "نورة الدوسري", online: true, lastSeen: "الآن", unread: 0 },
  { id: "contact-4", name: "خالد المطيري", online: false, lastSeen: "منذ ساعة", unread: 0 },
  { id: "contact-5", name: "منى الشمري", online: true, lastSeen: "الآن", unread: 2 },
  { id: "contact-6", name: "سعود القحطاني", online: false, lastSeen: "منذ 3 ساعات", unread: 0 },
  { id: "contact-7", name: "هند الزهراني", online: true, lastSeen: "الآن", unread: 0 },
]

const NOW = new Date()
function mt(h: number, m: number) {
  const d = new Date(NOW)
  d.setHours(h, m, 0, 0)
  return d
}

export const GROUP_CHATS: Record<string, ChatMessage[]> = {
  "ch-general": [
    { id: "g1", text: "مرحباً بالجميع! اجتماعنا الأسبوعي بكرة الساعة 10", sender: "أحمد السالم", senderId: "admin", time: mt(9, 30), me: false, status: "read" },
    { id: "g2", text: "تمام هنكون في الموعد", sender: "سارة الحربي", senderId: "mod-1", time: mt(9, 32), me: false, status: "read" },
    { id: "g3", text: "فكرة رائعة المنصة هذي", sender: "فهد العتيبي", senderId: "mod-2", time: mt(9, 35), me: false, status: "read" },
    { id: "g4", text: "شكراً يا شباب! أقدر تعاونكم", sender: "أنت", senderId: "me", time: mt(9, 40), me: true, status: "read" },
    { id: "g5", text: "باقي نحدد محور النقاش نركز على استراتيجية التسويق للربع الثالث؟", sender: "أحمد السالم", senderId: "admin", time: mt(9, 42), me: false, status: "read" },
    { id: "g6", text: "اتفاق! عندي أفكار حلوة للمحتوى", sender: "نورة الدوسري", senderId: "mem-1", time: mt(9, 45), me: false, status: "read", reactions: [{ emoji: "👍", count: 3, me: false }] },
    { id: "g7", text: "تمام, خل نناقشها بكرة", sender: "أنت", senderId: "me", time: mt(9, 50), me: true, status: "delivered" },
  ],
  "ch-announce": [
    { id: "a1", text: "تحديث جديد: أضفنا دفع Apple Pay و Tabby!", sender: "أحمد السالم", senderId: "admin", time: mt(11, 0), me: false, status: "read" },
    { id: "a2", text: "جربوها ورجعوا لنا بالتغذية الراجعة", sender: "أحمد السالم", senderId: "admin", time: mt(11, 1), me: false, status: "read" },
  ],
  "ch-marketing": [
    { id: "m1", text: "عندي اقتراح حملة للعيد خصم 20% على أول طلب", sender: "سارة الحربي", senderId: "mod-1", time: mt(14, 15), me: false, status: "read" },
  ],
  "ch-design": [],
  "s2-general": [],
  "s2-campaigns": [],
}

export const INDIVIDUAL_CHATS: Record<string, ChatMessage[]> = {
  "contact-2": [
    { id: "c1", text: "السلام عليكم، عندي استفسار عن المنتج الجديد", sender: "فهد العتيبي", senderId: "contact-2", time: mt(14, 20), me: false, status: "read" },
    { id: "c2", text: "وعليكم السلام! تفضل اسأل", sender: "أنت", senderId: "me", time: mt(14, 25), me: true, status: "read" },
  ],
  "contact-5": [
    { id: "m1", text: "مرحباً، ممكن ترسل لي رابط الاجتماع؟", sender: "منى", senderId: "contact-5", time: mt(11, 5), me: false, status: "read" },
    { id: "m2", text: "أكيد! https://meet.monest.app/xyz", sender: "أنت", senderId: "me", time: mt(11, 10), me: true, status: "delivered" },
    { id: "m3", text: "شكراً جزيلاً", sender: "منى", senderId: "contact-5", time: mt(11, 12), me: false, status: "read" },
  ],
}

export const CALLS: Call[] = [
  { id: "cl1", name: "سارة الحربي", type: "outgoing", time: "اليوم 10:30", duration: "12:34" },
  { id: "cl2", name: "مجتمع متجرك", type: "incoming", time: "اليوم 09:15", duration: "45:20" },
  { id: "cl3", name: "فهد العتيبي", type: "missed", time: "أمس 16:45" },
  { id: "cl4", name: "منى الشمري", type: "outgoing", time: "أمس 14:00", duration: "08:15" },
  { id: "cl5", name: "نورة الدوسري", type: "incoming", time: "2026-06-22", duration: "22:10" },
  { id: "cl6", name: "خالد المطيري", type: "missed", time: "2026-06-21" },
]

export const EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "🙏", "😍", "🤔", "👋", "💯", "⭐", "🚀", "✅", "💪"]
