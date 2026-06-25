"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { MonestLogo } from "@/components/ui/monest-logo"
import { Check, ChevronRight, ChevronLeft, Clock, CalendarDays, Video } from "lucide-react"

const STEPS = 14

const experienceOptions = [
  { value: "A", label: { ar: "ما بديت متجر تجارة إلكترونية من قبل", en: "Never started an e-commerce store" } },
  { value: "B", label: { ar: "سويت متجر تجارة إلكترونية لكن ما حققت أي مبيعات", en: "Started a store but no sales" } },
  { value: "C", label: { ar: "سويت متجر تجارة إلكترونية وحققت أقل من 10 مبيعات", en: "Started a store with less than 10 sales" } },
  { value: "D", label: { ar: "عندي متجر تجارة إلكترونية وحققت أكثر من 10 مبيعات", en: "I have a store with more than 10 sales" } },
]

const incomeOptions = [
  { value: "A", label: { ar: "أنا ما عندي دخل", en: "No income" } },
  { value: "B", label: { ar: "1-2 ألف ريال سعودي", en: "1-2K SAR" } },
  { value: "C", label: { ar: "2-5 ألف ريال سعودي", en: "2-5K SAR" } },
  { value: "D", label: { ar: "5-10 ألف ريال سعودي", en: "5-10K SAR" } },
  { value: "E", label: { ar: "10-20 ألف ريال سعودي", en: "10-20K SAR" } },
  { value: "F", label: { ar: "أكثر من 20 ألف ريال سعودي", en: "More than 20K SAR" } },
]

const investOptions = [
  { value: "A", label: { ar: "0 - 1000 ريال", en: "0 - 1000 SAR" } },
  { value: "B", label: { ar: "1,000 - 2,000 ريال", en: "1,000 - 2,000 SAR" } },
  { value: "C", label: { ar: "2,000 - 5,000 ريال", en: "2,000 - 5,000 SAR" } },
  { value: "D", label: { ar: "5,000 - 10,000 ريال", en: "5,000 - 10,000 SAR" } },
  { value: "E", label: { ar: "10,000 ريال +", en: "10,000 SAR +" } },
]

const nowOptions = [
  { value: "now", label: { ar: "نعم الآن", en: "Yes, now" } },
  { value: "later", label: { ar: "في وقت لاحق مستقبلاً", en: "Later in the future" } },
]

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 9; h <= 22; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`)
    slots.push(`${h.toString().padStart(2, "0")}:30`)
  }
  return slots
}

export default function OnboardingPage() {
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: "", phone: "", email: "", income: "", age: "", experience: "",
    problem: "", goal: "", invest: "", timing: "",
  })
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [chatMsg, setChatMsg] = useState("")
  const [chatMsgs, setChatMsgs] = useState<{ text: string; me: boolean }[]>([])

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const timeSlots = useMemo(() => generateTimeSlots(), [])
  const today = new Date()

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const next = () => { if (step < STEPS - 1) setStep((s) => s + 1) }
  const prev = () => { if (step > 0) setStep((s) => s - 1) }

  const canNext = () => {
    switch (step) {
      case 1: return form.name.trim().length > 0
      case 2: return form.phone.trim().length > 0
      case 3: return form.email.trim().length > 0
      case 4: return form.income !== ""
      case 5: return form.age !== ""
      case 6: return form.experience !== ""
      case 7: return form.problem.trim().length > 0
      case 8: return form.goal.trim().length > 0
      default: return true
    }
  }

  const handleSchedule = () => {
    setScheduled(true)
  }

  const sendChat = () => {
    if (!chatMsg.trim()) return
    setChatMsgs((prev) => [...prev, { text: chatMsg, me: true }])
    setChatMsg("")
    setTimeout(() => {
      setChatMsgs((prev) => [...prev, { text: lang === "ar" ? "شكراً لتواصلك! سنرد عليك قريباً 😊" : "Thanks for reaching out! We'll get back to you soon 😊", me: false }])
    }, 1000)
  }

  if (scheduled) {
    const meetingLink = `/meetings/join/ONBOARD-${Date.now().toString(36).toUpperCase()}`
    const dateStr = `${selectedDate}/${calMonth + 1}/${calYear}`
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
        <div className="w-full max-w-md space-y-5">
          {/* Status Steps */}
          <div className="space-y-3">
            {/* Step 1: Account created */}
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <Check size={14} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar" ? "تم إنشاء الحساب" : "Account Created"}
                </p>
                <p className="text-[10px] text-[#999999]">
                  {lang === "ar" ? "بإنتظار تفعيل الحساب من قبل الإدارة" : "Waiting for admin activation"}
                </p>
              </div>
            </div>

            {/* Step 2: Meeting scheduled */}
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <CalendarDays size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar" ? "تم حجز موعد المقابلة" : "Interview Scheduled"}
                </p>
                <p className="text-[10px] text-[#999999]">
                  {lang === "ar" ? `تاريخ الحضور: ${dateStr} الساعة ${selectedTime}` : `Date: ${dateStr} at ${selectedTime}`}
                </p>
              </div>
            </div>

            {/* Step 3: Meeting link (pending) */}
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <Video size={14} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar" ? "رابط الاجتماع" : "Meeting Link"}
                </p>
                <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 dark:text-blue-400 underline break-all block truncate">
                  {typeof window !== "undefined" ? window.location.origin + meetingLink : meetingLink}
                </a>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="p-4 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] space-y-2 text-xs text-[#666666] dark:text-[#999999]">
            <div className="flex items-center justify-between">
              <span>{lang === "ar" ? "المدة" : "Duration"}</span>
              <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">30 {lang === "ar" ? "دقيقة" : "min"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === "ar" ? "النوع" : "Type"}</span>
              <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "مقابلة تعريفية" : "Introductory Call"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === "ar" ? "رقم الطلب" : "Request #"}</span>
              <span className="font-bold text-[#0D0D0D] dark:text-[#F2F2F2] direction-ltr" dir="ltr">REQ-{Date.now().toString(36).toUpperCase()}</span>
            </div>
          </div>

          {/* CTA */}
          <button onClick={() => router.push("/dashboard")}
            className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-80 transition-opacity">
            {lang === "ar" ? "الذهاب إلى لوحة التحكم" : "Go to Dashboard"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <MonestLogo width={40} height={40} className="mx-auto mb-3 fill-current text-[#0D0D0D] dark:text-[#F2F2F2]" />
          <h1 className="text-xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "يلا نبدأ تقديمك إلى MONEST" : "Let's Start Your MONEST Introduction"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999] mt-1">
            {lang === "ar" ? "حياك الله" : "Welcome"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={"flex-1 h-1 transition-colors " + (i <= step ? "bg-[#0D0D0D] dark:bg-[#F2F2F2]" : "bg-[#D4D4D4] dark:bg-[#333333]")} />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#666666] dark:text-[#999999]">
                {lang === "ar"
                  ? "عبي الطلب بعناية - نراجع كل الطلبات بشكل دقيق عشان نتأكد إننا نقدر نساعدك بالشكل المناسب."
                  : "Fill out the form carefully - we review all requests thoroughly to ensure we can help you properly."}
              </p>
              <button onClick={next} className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                {lang === "ar" ? "ابدأ" : "Start"}
                <ChevronLeft size={18} />
              </button>
              <p className="text-xs text-[#999999]">
                {lang === "ar" ? "يستغرق 2 دقيقة" : "Takes 2 minutes"}
              </p>
            </div>
          )}

          {/* Step 1-2: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما اسمك؟*" : "What's your name?*"}
              </p>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={lang === "ar" ? "الاسم الكامل" : "Full name"} className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
            </div>
          )}

          {/* Step 2: WhatsApp */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما هو رقمك على الواتساب؟*" : "What's your WhatsApp number?*"}
              </p>
              <p className="text-xs text-[#999999]">{lang === "ar" ? "سنتواصل معك هناك بخصوص طلبك." : "We'll contact you there regarding your request."}</p>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+966 5x xxx xxxx" className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
            </div>
          )}

          {/* Step 3: Email */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما هو بريدك الإلكتروني؟*" : "What's your email?*"}
              </p>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
            </div>
          )}

          {/* Step 4: Income */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما هو دخلك الشهري الإجمالي؟*" : "What's your monthly income?*"}
              </p>
              <p className="text-xs text-[#999999]">{lang === "ar" ? "(أجب بصراحة، هذا راح يساعدنا نقدم لك الدعم المناسب. معلوماتك راح تظل سرية وآمنة)" : "(Answer honestly, this helps us provide the right support. Your info is confidential and secure)"}</p>
              {incomeOptions.map((o) => (
                <button key={o.value} onClick={() => { update("income", o.value); next() }} className={"w-full h-12 px-4 text-sm font-medium border transition-colors text-start " + (form.income === o.value ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}>
                  {o.label[lang]}
                </button>
              ))}
            </div>
          )}

          {/* Step 5: Age */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "كم عمرك؟*" : "How old are you?*"}
              </p>
              <input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} min="10" max="100" placeholder={lang === "ar" ? "العمر" : "Age"} className="w-full h-12 px-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
            </div>
          )}

          {/* Step 6: Experience */}
          {step === 6 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما هو مستوى خبرتك الحالي في التجارة الإلكترونية؟*" : "What's your current e-commerce experience level?*"}
              </p>
              {experienceOptions.map((o) => (
                <button key={o.value} onClick={() => { update("experience", o.value); next() }} className={"w-full text-start p-4 text-sm border transition-colors " + (form.experience === o.value ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}>
                  {o.label[lang]}
                </button>
              ))}
            </div>
          )}

          {/* Step 7: Problem */}
          {step === 7 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما هي أكبر مشكلة تواجهك حالياً وخلتك تدور على مساعدة؟ (اشرح في كم جملة على الأقل)*" : "What's the biggest problem you're facing that made you seek help? (Explain in at least a few sentences)*"}
              </p>
              <p className="text-xs text-[#999999]">{lang === "ar" ? "هذا السؤال أساسي لقبولك في برنامج مونست. يرجى الشرح بالتفصيل الوافي. الإجابات القصيرة أو غير المكتملة ستؤدي إلى رفض طلبك تلقائياً." : "This question is essential for acceptance. Please explain in detail. Short or incomplete answers will result in automatic rejection."}</p>
              <textarea value={form.problem} onChange={(e) => update("problem", e.target.value)} rows={4} className="w-full px-4 py-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors resize-none" />
            </div>
          )}

          {/* Step 8: Goal */}
          {step === 8 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "ما هو الهدف أو الرؤية التي تطمح لتحقيقها في رحلتك في التجارة الإلكترونية؟ (فصّل)*" : "What is the goal or vision you aspire to achieve in your e-commerce journey? (Detail)*"}
              </p>
              <textarea value={form.goal} onChange={(e) => update("goal", e.target.value)} rows={4} className="w-full px-4 py-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors resize-none" />
            </div>
          )}

          {/* Step 9: Investment */}
          {step === 9 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "كم المبلغ المتوفر للاستثمار الآن؟ (الأموال المتاحة اليوم، وليست المستقبلية أو المقترضة)*" : "How much investment do you have available now? (Funds available today)*"}
              </p>
              <p className="text-xs text-[#999999]">{lang === "ar" ? "هذا السؤال يساعدنا على تصميم الحل المناسب لوضعك" : "This helps us design the right solution for your situation"}</p>
              {investOptions.map((o) => (
                <button key={o.value} onClick={() => { update("invest", o.value) }} className={"w-full h-12 px-4 text-sm font-medium border transition-colors text-start " + (form.invest === o.value ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}>
                  {o.label[lang]}
                </button>
              ))}
            </div>
          )}

          {/* Step 10: Timing */}
          {step === 10 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "هل أنت مهتم بتطوير متجرك الإلكتروني الآن أم في وقت لاحق مستقبلاً؟*" : "Are you interested in developing your store now or later?*"}
              </p>
              {nowOptions.map((o) => (
                <button key={o.value} onClick={() => { update("timing", o.value); next() }} className={"w-full h-12 px-4 text-sm font-medium border transition-colors text-start " + (form.timing === o.value ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}>
                  {o.label[lang]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 11+: Calendar Booking */}
        {step >= 11 && step < 14 && (
          <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6 space-y-5">
            {step === 11 && (
              <>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] text-center">
                  {lang === "ar" ? "اختر التاريخ والوقت المناسب" : "Select a Date & Time"}
                </p>
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => { if (calMonth > 0) setCalMonth((m) => m - 1); else { setCalMonth(11); setCalYear((y) => y - 1) } }} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"><ChevronRight size={18} /></button>
                    <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{monthNames[calMonth]} {calYear}</span>
                    <button onClick={() => { if (calMonth < 11) setCalMonth((m) => m + 1); else { setCalMonth(0); setCalYear((y) => y + 1) } }} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"><ChevronLeft size={18} /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {weekdays.map((d) => <span key={d} className="text-[10px] font-bold text-[#999999] py-1">{lang === "ar" ? { Sun: "ح", Mon: "ن", Tue: "ث", Wed: "ر", Thu: "خ", Fri: "ج", Sat: "س" }[d] || d : d}</span>)}
                    {Array.from({ length: firstDay }).map((_, i) => <div key={"e" + i} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const isPast = calYear < today.getFullYear() || (calYear === today.getFullYear() && calMonth < today.getMonth()) || (calYear === today.getFullYear() && calMonth === today.getMonth() && day < today.getDate())
                      const isSelected = selectedDate === day
                      return (
                        <button key={day} disabled={isPast} onClick={() => { setSelectedDate(day); setSelectedTime("") }} className={"h-9 text-sm rounded transition-colors " + (isSelected ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : isPast ? "text-[#D4D4D4] dark:text-[#333333] cursor-not-allowed" : "text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}>
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Time slots */}
                {selectedDate && (
                  <div>
                    <p className="text-xs font-bold text-[#999999] mb-2">
                      {lang === "ar" ? "الأوقات المتاحة" : "Available Times"}
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                      {timeSlots.map((t) => (
                        <button key={t} onClick={() => setSelectedTime(t)} className={"py-2 text-xs font-medium border rounded transition-colors " + (selectedTime === t ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] border-[#0D0D0D] dark:border-[#F2F2F2]" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button disabled={!selectedDate || !selectedTime} onClick={next} className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
                  {lang === "ar" ? "التالي" : "Next"}
                </button>
              </>
            )}

            {step === 12 && (
              <>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] text-center">
                  {lang === "ar" ? "معلومات الحجز" : "Booking Details"}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "الاسم" : "Name"} *</label>
                    <input value={form.name} readOnly className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#666666] dark:text-[#999999]">Email *</label>
                    <input value={form.email} readOnly className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "رقم الواتساب" : "WhatsApp Number"}</label>
                    <input value={form.phone} readOnly className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#666666] dark:text-[#999999]">{lang === "ar" ? "إضافة ضيف" : "Add Guests"}</label>
                    <input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="guest@example.com" className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors mt-1" />
                  </div>
                  <div className="p-3 bg-[#E8E8E8] dark:bg-[#1A1A1A] text-xs text-[#666666] dark:text-[#999999] space-y-1">
                    <p><span className="font-bold">{lang === "ar" ? "الموعد:" : "Time:"}</span> {selectedTime} - {selectedDate}/{calMonth + 1}/{calYear}</p>
                    <p><span className="font-bold">{lang === "ar" ? "المدة:" : "Duration:"}</span> 30 min</p>
                    <p><span className="font-bold">{lang === "ar" ? "المنطقة:" : "Timezone:"}</span> Baghdad, East Africa Time</p>
                  </div>
                </div>
                <button disabled={!form.name || !form.email} onClick={next} className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
                  {lang === "ar" ? "التالي" : "Next"}
                </button>
              </>
            )}

            {step === 13 && (
              <>
                <div className="text-center space-y-3">
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                    {lang === "ar" ? "حرصًا على وقتي ووقتك" : "Out of respect for our time"}
                  </p>
                  <p className="text-xs text-[#666666] dark:text-[#999999]">
                    {lang === "ar"
                      ? "أرجو أن تحضر في الوقت المحجوز وتكون في مكان هادئ. إذا تأخرت أكثر من 5 دقائق أو كنت في مكان غير مناسب، سيتم إلغاء المكالمة تلقائيًا ولن تتمكن من إعادة الحجز"
                      : "Please arrive on time in a quiet place. If you're more than 5 minutes late or in an unsuitable place, the call will be automatically cancelled."}
                  </p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="w-4 h-4 accent-[#0D0D0D] dark:accent-[#F2F2F2]" />
                  <span className="text-xs text-[#666666] dark:text-[#999999]">
                    {lang === "ar" ? "نعم، أفهم وأوافق على الشروط" : "Yes, I understand and agree to the terms"}
                  </span>
                </label>
                <p className="text-[10px] text-[#999999] text-center">
                  By proceeding, you confirm that you have read and agree to Calendly's Invitee Terms and Privacy Notice.
                </p>
                <button disabled={!agreed} onClick={handleSchedule} className="w-full h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  <CalendarDays size={16} />
                  {lang === "ar" ? "تأكيد الحجز" : "Schedule Event"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        {step > 0 && step < 11 && (
          <div className="flex gap-3">
            <button onClick={prev} className="flex-1 h-12 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors">
              {lang === "ar" ? "رجوع" : "Back"}
            </button>
            {step !== 4 && step !== 6 && step !== 10 && (
              <button onClick={next} disabled={!canNext()} className="flex-1 h-12 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
                {lang === "ar" ? "التالي" : "Next"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
