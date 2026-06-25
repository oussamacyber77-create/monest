export interface MockMeeting {
  id: string
  title: { ar: string; en: string }
  date: string
  duration: number
  attendees: number
  status: "completed" | "cancelled" | "live"
  organizer: string
  recording: boolean
}

export interface MockRecording {
  id: string
  meetingId: string
  title: { ar: string; en: string }
  date: string
  duration: string
  size: string
}

export interface MockParticipant {
  name: string
  role: "admin" | "attendee"
  joinedAt: string
  duration: string
}

export interface MockMeetingInfo {
  id: string
  title: { ar: string; en: string }
  organizer: string
  startTime: string
  password: string
  date: string
  duration: number
  attendees: number
  description?: { ar: string; en: string }
}

export const mockMeetings: MockMeeting[] = [
  {
    id: "mtg-001",
    title: { ar: "مراجعة أداء الربع الثاني", en: "Q2 Performance Review" },
    date: "2026-06-20",
    duration: 47,
    attendees: 8,
    status: "completed",
    organizer: "أحمد السالم",
    recording: true,
  },
  {
    id: "mtg-002",
    title: { ar: "تخطيط استراتيجية المنتج", en: "Product Strategy Planning" },
    date: "2026-06-18",
    duration: 62,
    attendees: 5,
    status: "completed",
    organizer: "سارة الحربي",
    recording: true,
  },
  {
    id: "mtg-003",
    title: { ar: "عرض تقدم المشروع", en: "Project Progress Demo" },
    date: "2026-06-15",
    duration: 35,
    attendees: 12,
    status: "completed",
    organizer: "فهد العتيبي",
    recording: false,
  },
  {
    id: "mtg-004",
    title: { ar: "مقابلة عميل محتمل", en: "Prospective Client Call" },
    date: "2026-06-22",
    duration: 0,
    attendees: 0,
    status: "live",
    organizer: "أحمد السالم",
    recording: false,
  },
  {
    id: "mtg-005",
    title: { ar: "ورشة عمل التصميم", en: "Design Workshop" },
    date: "2026-06-25",
    duration: 90,
    attendees: 0,
    status: "live",
    organizer: "نورة الدوسري",
    recording: false,
  },
  {
    id: "mtg-006",
    title: { ar: "اجتماع الفريق الأسبوعي", en: "Weekly Team Sync" },
    date: "2026-06-12",
    duration: 28,
    attendees: 6,
    status: "completed",
    organizer: "أحمد السالم",
    recording: true,
  },
  {
    id: "mtg-007",
    title: { ar: "مراجعة الميزانية", en: "Budget Review" },
    date: "2026-06-10",
    duration: 55,
    attendees: 4,
    status: "completed",
    organizer: "خالد المطيري",
    recording: false,
  },
]

export const mockRecordings: MockRecording[] = [
  {
    id: "rec-001",
    meetingId: "mtg-001",
    title: { ar: "مراجعة أداء الربع الثاني", en: "Q2 Performance Review" },
    date: "2026-06-20",
    duration: "47:12",
    size: "128 MB",
  },
  {
    id: "rec-002",
    meetingId: "mtg-002",
    title: { ar: "تخطيط استراتيجية المنتج", en: "Product Strategy Planning" },
    date: "2026-06-18",
    duration: "62:05",
    size: "185 MB",
  },
  {
    id: "rec-003",
    meetingId: "mtg-006",
    title: { ar: "اجتماع الفريق الأسبوعي", en: "Weekly Team Sync" },
    date: "2026-06-12",
    duration: "28:44",
    size: "92 MB",
  },
  {
    id: "rec-004",
    meetingId: "mtg-001",
    title: { ar: "مناقشة الميزانية (تابع)", en: "Budget Discussion (Follow-up)" },
    date: "2026-06-08",
    duration: "33:20",
    size: "76 MB",
  },
  {
    id: "rec-005",
    meetingId: "mtg-004",
    title: { ar: "إطلاق الميزة الجديدة", en: "New Feature Launch" },
    date: "2026-06-05",
    duration: "51:38",
    size: "156 MB",
  },
]

export const mockParticipants: MockParticipant[] = [
  { name: "أحمد السالم", role: "admin", joinedAt: "10:00", duration: "47m" },
  { name: "سارة الحربي", role: "attendee", joinedAt: "10:01", duration: "46m" },
  { name: "فهد العتيبي", role: "attendee", joinedAt: "10:03", duration: "44m" },
  { name: "نورة الدوسري", role: "attendee", joinedAt: "10:05", duration: "42m" },
  { name: "خالد المطيري", role: "attendee", joinedAt: "10:02", duration: "45m" },
  { name: "منى الشمري", role: "attendee", joinedAt: "10:04", duration: "43m" },
  { name: "سعود القحطاني", role: "attendee", joinedAt: "10:06", duration: "41m" },
  { name: "هند الزهراني", role: "attendee", joinedAt: "10:07", duration: "40m" },
]

export const mockMeetingInfoMap: Record<string, MockMeetingInfo> = {
  "demo-001": {
    id: "demo-001",
    title: { ar: "مراجعة أداء الربع الثاني", en: "Q2 Performance Review" },
    organizer: "أحمد السالم",
    startTime: "10:00",
    password: "",
    date: "2026-06-20",
    duration: 47,
    attendees: 8,
    description: { ar: "مناقشة أداء الفريق للربع الثاني", en: "Team Q2 performance discussion" },
  },
}

export const mockFiles = [
  { name: "تقرير-الربع-الثاني.pdf", size: "2.4 MB" },
  { name: "عرض-تقديمي.pptx", size: "8.1 MB" },
  { name: "صورة-مخطط-المشروع.png", size: "1.2 MB" },
  { name: "ملاحظات-الاجتماع.docx", size: "156 KB" },
]
