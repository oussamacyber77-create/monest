export type LeadStage = "name" | "phone" | "otp" | "package" | "schedule" | "payment"
export type LeadStatus = "new" | "contacted" | "interested" | "not_interested" | "completed"
export type LeadSource = "direct" | "whatsapp" | "ad"
export type LeadHeat = "hot" | "warm" | "cold"

export interface MockLead {
  id: string
  name: string
  phone: string
  lastStage: LeadStage
  selectedPackage: string | null
  lastActivity: string
  source: LeadSource
  heat: LeadHeat
  status: LeadStatus
  assignedTo: string
  notes: string
  activityLog: Array<{ time: string; type: string; message: string }>
}

export interface MockStat {
  label: { ar: string; en: string }
  value: number
  change: number
  suffix?: string
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const names = [
  "أحمد السالم", "سارة الحربي", "فهد العتيبي", "نورة الدوسري",
  "خالد المطيري", "منى الشمري", "سعود القحطاني", "هند الزهراني",
  "عبدالله الغامدي", "ريم العتيق", "مشعل العنزي", "لينا باحارث",
  "تركي المالكي", "حصة السديري", "نواف الشمري", "دلال العبدالله",
  "بدر الحارثي", "شهد المهنا", "سلطان الجعيد", "مها التركي",
]

const phones = [
  "966501234567", "966551234567", "966531234567", "966541234567",
  "966561234567", "966571234567", "966581234567", "966591234567",
  "966502345678", "966552345678", "966532345678", "966542345678",
  "966562345678", "966572345678", "966582345678", "966592345678",
  "966503456789", "966553456789", "966533456789", "966543456789",
]

const stages: LeadStage[] = ["name", "phone", "otp", "package", "schedule", "payment"]
const sources: LeadSource[] = ["direct", "whatsapp", "ad"]
const statuses: LeadStatus[] = ["new", "contacted", "interested", "not_interested", "completed"]
const employees = ["نورة القحطاني", "عبدالرحمن الشمري", "سارة المطيري", "فهد العتيبي"]
const packages = ["شهري", "3 أشهر", "6 أشهر", "سنوي"]

const logMessages: Record<string, string[]> = {
  name: [
    "بدأ التسجيل — خطوة الاسم",
    "تم إرسال تذكير عبر واتساب",
    "تحديث من المندوب: تم التواصل",
  ],
  phone: [
    "أكمل خطوة رقم الجوال",
    "تم إرسال رابط التسجيل عبر واتساب",
    "مكالمة واردة — استفسار عن الخدمات",
  ],
  otp: [
    "وصل لخطوة التحقق (OTP)",
    "تم إرسال كود التحقق",
    "تذكير بعد 10 دقائق — واتساب",
  ],
  package: [
    "اختار الباقة المطلوبة",
    "تم عرض خيارات الدفع",
    "طلب استشارة قبل الاشتراك",
  ],
  schedule: [
    "اختار موعد اجتماع المتابعة",
    "تأكيد الاجتماع عبر البريد",
    "أعاد جدولة الاجتماع",
  ],
  payment: [
    "وصل لصفحة الدفع",
    "حاول الدفع — بطاقة مرفوضة",
    "طلب تحويل بنكي بديل",
  ],
}

const stageDescriptions: Record<LeadStage, { ar: string; en: string }> = {
  name: { ar: "الاسم", en: "Name" },
  phone: { ar: "الجوال", en: "Phone" },
  otp: { ar: "التحقق", en: "OTP" },
  package: { ar: "الباقة", en: "Package" },
  schedule: { ar: "الموعد", en: "Schedule" },
  payment: { ar: "الدفع", en: "Payment" },
}

function generateLeads(count: number): MockLead[] {
  const leads: MockLead[] = []
  const now = new Date("2026-06-24T15:00:00")
  for (let i = 0; i < count; i++) {
    const lastStageIdx = Math.floor(Math.random() * 6)
    const lastStage = stages[lastStageIdx]
    const hasPackage = lastStageIdx >= 3
    const selectedPackage = hasPackage ? pick(packages) : null
    const heat: LeadHeat = lastStageIdx >= 5 ? "hot" : lastStageIdx >= 3 ? "warm" : "cold"
    const daysAgo = Math.floor(Math.random() * 14)
    const activityDate = new Date(now.getTime() - daysAgo * 86400000 - Math.random() * 86400000)
    const formattedDate = activityDate.toLocaleDateString("en-CA") + " " + activityDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    const logCount = lastStageIdx > 0 ? Math.min(lastStageIdx, 3) : 1
    const log = []
    for (let j = 0; j < logCount; j++) {
      const stageKey = stages[Math.min(j, lastStageIdx)]
      const msgs = logMessages[stageKey]
      log.push({
        time: new Date(activityDate.getTime() - (logCount - j) * 3600000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        type: j === 0 ? "system" : "manual",
        message: msgs[j % msgs.length],
      })
    }
    leads.push({
      id: `crm-lead-${String(i + 1).padStart(3, "0")}`,
      name: names[i],
      phone: phones[i],
      lastStage,
      selectedPackage,
      lastActivity: formattedDate,
      source: pick(sources),
      heat,
      status: lastStageIdx >= 5 && Math.random() > 0.5 ? "completed" : pick(statuses.filter((s) => s !== "completed")),
      assignedTo: pick(employees),
      notes: "",
      activityLog: log,
    })
  }
  return leads
}

export const mockLeads = generateLeads(20)

export const mockStats: MockStat[] = [
  { label: { ar: "نسبة إكمال التسجيل", en: "Registration Completion" }, value: 68, change: 12, suffix: "%" },
  { label: { ar: "عملاء ضائعون", en: "Lost Customers" }, value: 7, change: -3 },
  { label: { ar: "عملاء عادوا وأكملوا", en: "Returned & Completed" }, value: 14, change: 8, suffix: "%" },
  { label: { ar: "معدل التحويل", en: "Conversion Rate" }, value: 32, change: 5, suffix: "%" },
]

export const packagePrices: Record<string, number> = {
  "شهري": 299,
  "3 أشهر": 799,
  "6 أشهر": 1499,
  "سنوي": 2499,
}

export { stageDescriptions }
