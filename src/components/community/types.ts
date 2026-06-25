export interface Member {
  id: string
  name: string
  status: "online" | "away" | "offline"
  role: "admin" | "mod" | "member"
}

export interface Channel {
  id: string
  name: string
  type: "text" | "voice"
  unread?: number
}

export interface Server {
  id: string
  name: string
  icon: string
  channels: Channel[]
  members: Member[]
}

export interface Contact {
  id: string
  name: string
  online: boolean
  lastSeen?: string
  unread: number
}

export interface Reaction {
  emoji: string
  count: number
  me: boolean
}

export interface ReplyTo {
  id: string
  text: string
  sender: string
}

export interface ChatMessage {
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

export interface Call {
  id: string
  name: string
  type: "incoming" | "outgoing" | "missed"
  time: string
  duration?: string
}

export type TabType = "chats" | "calls" | "video"
