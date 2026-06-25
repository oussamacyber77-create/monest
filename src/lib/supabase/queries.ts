import { createClient } from "./client"
import type { DashboardStat, SaleDay, Product, InventoryItem, Campaign, CustomerSegment } from "@/lib/mock-data/dashboard"

// ── Dashboard ──

export async function fetchDashboardStats(): Promise<DashboardStat[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: invoices } = await supabase
    .from("invoices")
    .select("amount, total, paid_at")
    .eq("user_id", user.id)

  const totalSales = invoices?.reduce((s, i) => s + Number(i.amount), 0) || 0
  const totalOrders = invoices?.length || 0

  return [
    { label: { ar: "إجمالي المبيعات", en: "Total Sales" }, value: totalSales, prefix: "", suffix: "ر.س", change: 23 },
    { label: { ar: "إجمالي الطلبات", en: "Total Orders" }, value: totalOrders, change: 18 },
    { label: { ar: "متوسط قيمة الطلب", en: "Avg Order Value" }, value: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0, prefix: "", suffix: "ر.س", change: 4 },
  ]
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data } = await supabase.from("meetings").select("*").limit(10)
  return (data || []).map((m: any) => ({
    id: m.id,
    name: { ar: m.title_ar, en: m.title_en },
    price: 0,
    cost: 0,
    sales: m.attendees || 0,
    views: 0,
    stock: 0,
    category: "عام",
    aiSuggestion: { ar: "—", en: "—", type: "promote" as const },
  }))
}

export async function fetchMeetings() {
  const supabase = createClient()
  const { data } = await supabase
    .from("meetings")
    .select("*")
    .order("date", { ascending: false })
  return data || []
}

export async function fetchMeetingByRoomCode(roomCode: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from("meetings")
    .select("*")
    .eq("room_code", roomCode)
    .single()
  return data
}

export async function createMeeting(meeting: {
  title_ar: string
  title_en: string
  room_code: string
  organizer: string
  date: string
  start_time: string
  password?: string
  description_ar?: string
  description_en?: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("meetings")
    .insert({ ...meeting, created_by: user?.id })
    .select()
    .single()
  return { data, error }
}

// ── Chat ──

export async function fetchChatMessages(channel = "general") {
  const supabase = createClient()
  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("channel", channel)
    .order("timestamp", { ascending: true })
  return data || []
}

export async function sendMessage(message: string, channel = "general") {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.email || "User"
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      sender: user?.id || "anonymous",
      sender_name: name,
      message,
      channel,
      user_id: user?.id,
    })
    .select()
    .single()
  return { data, error }
}

// ── Invoices ──

export async function fetchInvoices() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  return data || []
}
