"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, CreditCard, Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Stepper } from "@/components/register/stepper"
import { useSettingsStore } from "@/stores/settings-store"
import { useRegistrationTrackingStore } from "@/stores/registration-tracking-store"
import { mockLeads, type LeadStage } from "@/lib/mock-data/crm"
import { pricingPlans, pricingPlanTypes, findPlan, type PricingPlanType } from "@/lib/mock-data/pricing"

const stageToStep: Record<LeadStage, number> = { name: 1, phone: 2, otp: 3, package: 4, schedule: 5, payment: 6 }
const stepToStage: Record<number, LeadStage> = { 1: "name", 2: "phone", 3: "otp", 4: "package", 5: "schedule", 6: "payment" }

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
]

const days = ["2026-06-25", "2026-06-26", "2026-06-27", "2026-06-28", "2026-06-29", "2026-06-30", "2026-07-01"]

function countryCodes() {
  return [
    { code: "+966", flag: "🇸🇦", name: "السعودية" },
    { code: "+971", flag: "🇦🇪", name: "الإمارات" },
    { code: "+974", flag: "🇶🇦", name: "قطر" },
    { code: "+973", flag: "🇧🇭", name: "البحرين" },
    { code: "+965", flag: "🇰🇼", name: "الكويت" },
    { code: "+968", flag: "🇴🇲", name: "عُمان" },
  ]
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { direction } = useSettingsStore()
  const { startSession, updateStep, completeSession, currentSessionId, sessions } = useRegistrationTrackingStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+966")
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [pricingTab, setPricingTab] = useState<PricingPlanType>("lifetime")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const continueFrom = searchParams.get("continueFrom")

  useEffect(() => {
    const sid = startSession()
    setSessionId(sid)

    if (continueFrom) {
      const lead = mockLeads.find((l) => l.id === continueFrom)
      if (lead) {
        const startStep = stageToStep[lead.lastStage]
        setStep(startStep)
        if (lead.name) setName(lead.name)
        if (lead.phone) setPhone(lead.phone)
        if (lead.selectedPackage) setSelectedPackage(lead.selectedPackage)
        updateStep(sid, lead.lastStage, { name: lead.name, phone: lead.phone, selectedPackage: lead.selectedPackage })
      }
    }
  }, [])

  const handleNext = () => {
    if (!sessionId) return
    if (step === 1 && name.trim()) {
      updateStep(sessionId, "name", { name })
      setStep(2)
    } else if (step === 2 && phone.replace(/\D/g, "").length >= 4) {
      updateStep(sessionId, "phone", { phone: countryCode + phone })
      setOtpSent(true)
      setStep(3)
    } else if (step === 3 && otpVerified) {
      updateStep(sessionId, "otp")
      setStep(4)
    } else if (step === 4 && selectedPackage) {
      updateStep(sessionId, "package", { selectedPackage })
      setStep(5)
    } else if (step === 5 && selectedDate && selectedTime) {
      updateStep(sessionId, "schedule", { scheduledDate: selectedDate + " " + selectedTime })
      setStep(6)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePay = () => {
    if (!sessionId) return
    setPaymentSuccess(true)
    completeSession(sessionId)
    setTimeout(() => router.push("/register/success"), 1500)
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (val && !/^\d$/.test(val)) return
    const newOtp = [...otp]
    newOtp[idx] = val
    setOtp(newOtp)
    if (val && idx < 3) {
      const next = document.getElementById("otp-" + (idx + 1))
      next?.focus()
    }
    if (newOtp.every((d) => d !== "") && !otpVerified) {
      setTimeout(() => setOtpVerified(true), 300)
    }
  }

  const selectedPlan = selectedPackage ? findPlan(selectedPackage) : undefined

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "ابدأ مع Monest" : "Get Started with Monest"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "خطوة " + step + " من 6" : "Step " + step + " of 6"}
          </p>
        </div>

        <Stepper currentStep={step} />

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "أهلاً بك! لنبدأ بمعرفة اسمك." : "Welcome! Let's start with your name."}
            </p>
            <Input
              label={lang === "ar" ? "الاسم الكامل" : "Full Name"}
              placeholder={lang === "ar" ? "مثال: أحمد السالم" : "e.g. Ahmed Al Salem"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Phone */}
        {step === 2 && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "أدخل رقم جوالك للتواصل." : "Enter your phone number."}
            </p>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="h-12 px-3 border border-[#D4D4D4] dark:border-[#333333] bg-transparent text-sm text-[#0D0D0D] dark:text-[#F2F2F2] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
                >
                  {countryCode}
                </button>
                {showCountryPicker && (
                  <div className="absolute top-full mt-1 bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] z-20 w-48 max-h-48 overflow-y-auto">
                    {countryCodes().map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCountryCode(c.code); setShowCountryPicker(false) }}
                        className="w-full px-3 py-2 text-sm text-start text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors"
                      >
                        {c.flag} {c.code} {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  placeholder="5xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  type="tel"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: OTP */}
        {step === 3 && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar"
                ? "أدخل رمز التحقق المرسل إلى جوالك."
                : "Enter the verification code sent to your phone."}
            </p>
            {!otpSent && (
              <p className="text-xs text-[#999999] dark:text-[#666666]">
                {lang === "ar" ? "جاري إرسال الرمز..." : "Sending code..."}
              </p>
            )}
            {otpSent && !otpVerified && (
              <p className="text-xs text-[#999999] dark:text-[#666666]">
                {lang === "ar" ? "الرمز التجريبي: 1234" : "Demo code: 1234"}
              </p>
            )}
            <div className="flex justify-center gap-3" dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={"otp-" + idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className={"w-14 h-14 text-center text-lg font-bold border bg-transparent text-[#0D0D0D] dark:text-[#F2F2F2] focus:outline-none focus-visible:ring-1 " + (otpVerified
                    ? "border-green-500 focus-visible:ring-green-500"
                    : "border-[#D4D4D4] dark:border-[#333333] focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]")}
                  autoFocus={idx === 0}
                  disabled={otpVerified}
                />
              ))}
            </div>
            {otpVerified && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                <Check size={16} />
                {lang === "ar" ? "تم التحقق بنجاح" : "Verified successfully"}
              </div>
            )}
            <div className="text-center">
              <button
                onClick={() => { setOtp(["", "", "", ""]); setOtpVerified(false) }}
                className="text-xs text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors"
              >
                {lang === "ar" ? "إعادة إرسال الرمز" : "Resend code"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Package with tabs */}
        {step === 4 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "اختر الباقة المناسبة لك." : "Choose the right plan for you."}
            </p>

            <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1">
              {pricingPlanTypes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setPricingTab(t.key); setSelectedPackage("") }}
                  className={"flex-1 py-2 text-sm font-medium transition-colors " + (pricingTab === t.key
                    ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                    : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
                >
                  {t.label[lang]}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {pricingPlans[pricingTab].map((pkg) => (
                <button
                  key={pkg.key}
                  onClick={() => setSelectedPackage(pkg.key)}
                  className={"w-full p-5 text-start border transition-colors relative " + (selectedPackage === pkg.key
                    ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A]"
                    : "border-[#D4D4D4] dark:border-[#333333] bg-transparent hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
                >
                  {pkg.badge && (
                    <span className="absolute top-3 end-3 text-[10px] font-bold px-2 py-0.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]">
                      {pkg.badge[lang]}
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                      {pkg.key}
                    </span>
                    <div>
                      {pkg.originalPrice && (
                        <span className="text-sm text-[#999999] line-through me-2">{pkg.originalPrice.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}</span>
                      )}
                      <span className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                        {pkg.price.toLocaleString("en-US")} {lang === "ar" ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#666666] dark:text-[#999999]">
                    {pkg.desc[lang]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Schedule */}
        {step === 5 && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm text-[#666666] dark:text-[#999999]">
              {lang === "ar" ? "اختر موعداً لجلسة المتابعة." : "Pick a time for your onboarding meeting."}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "اليوم" : "Date"}
              </p>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => {
                  const label = new Date(d).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "short", day: "numeric" })
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={"px-4 py-2 text-xs font-medium border transition-colors " + (selectedDate === d
                        ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                        : "border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            {selectedDate && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {lang === "ar" ? "الوقت" : "Time"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={"px-4 py-2 text-xs font-medium border transition-colors " + (selectedTime === t
                        ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
                        : "border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Payment */}
        {step === 6 && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div className="p-5 border border-[#D4D4D4] dark:border-[#333333] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666] dark:text-[#999999]">
                  {lang === "ar" ? "الباقة" : "Package"}
                </span>
                <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{selectedPackage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666] dark:text-[#999999]">
                  {lang === "ar" ? "المبلغ" : "Total"}
                </span>
                <span className="font-bold text-lg text-[#0D0D0D] dark:text-[#F2F2F2]">
                  {selectedPlan?.price.toLocaleString("en-US") || "—"} {lang === "ar" ? "ر.س" : "SAR"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "طريقة الدفع" : "Payment Method"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["Apple Pay", "Google Pay", "Samsung Pay", "Visa", "Mastercard"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={"flex items-center justify-center h-12 border text-xs font-medium transition-colors " + (paymentMethod === method
                      ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]"
                      : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("Tabby")}
                className={"flex-1 h-12 border text-xs font-medium transition-colors " + (paymentMethod === "Tabby"
                  ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]"
                  : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
              >
                {lang === "ar" ? "قسّط عبر Tabby" : "Pay via Tabby"}
              </button>
              <button
                onClick={() => setPaymentMethod("Tamara")}
                className={"flex-1 h-12 border text-xs font-medium transition-colors " + (paymentMethod === "Tamara"
                  ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#E8E8E8] dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-[#F2F2F2]"
                  : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] dark:text-[#999999] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A]")}
              >
                {lang === "ar" ? "قسّط عبر Tamara" : "Pay via Tamara"}
              </button>
            </div>

            <Button
              onClick={handlePay}
              disabled={!paymentMethod || paymentSuccess}
              className="w-full"
              size="lg"
            >
              {paymentSuccess ? (
                <span className="flex items-center gap-2">
                  <Check size={18} />
                  {lang === "ar" ? "تم بنجاح!" : "Success!"}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard size={18} />
                  {lang === "ar" ? "تأكيد الدفع" : "Confirm Payment"}
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Navigation */}
        {step < 6 && (
          <div className="flex justify-between gap-3">
            {step > 1 ? (
              <Button variant="secondary" onClick={handleBack} className="px-6">
                {direction === "rtl" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className="mx-1">{lang === "ar" ? "السابق" : "Back"}</span>
              </Button>
            ) : <div />}
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !name.trim()) ||
                (step === 2 && phone.replace(/\D/g, "").length < 4) ||
                (step === 3 && !otpVerified) ||
                (step === 4 && !selectedPackage) ||
                (step === 5 && (!selectedDate || !selectedTime))
              }
              className="px-6"
            >
              <span className="mx-1">{lang === "ar" ? "التالي" : "Next"}</span>
              {direction === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="w-8 h-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
