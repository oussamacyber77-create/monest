"use client"

import { useState, use, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { LogIn, CalendarDays, Clock, User, Phone, Shield, Copy, Check, Users, Headphones, Video, VideoOff, WifiOff, AlertTriangle, XCircle, DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PreJoinCameraTest } from "@/components/meeting/pre-join-camera-test"
import { useRoomStore } from "@/stores/room-store"
import { useAuthStore } from "@/stores/auth-store"
import { useSettingsStore } from "@/stores/settings-store"
import { mockMeetingInfoMap } from "@/lib/mock-data/meetings"

type JoinError =
  | "network"
  | "meeting-ended"
  | "room-full"
  | "validation"
  | "auth"
  | "unknown"

const ERROR_MESSAGES: Record<JoinError, { ar: string; en: string }> = {
  network: {
    ar: "انقطاع الشبكة. تحقق من اتصالك وحاول مرة أخرى",
    en: "Network error. Check your connection and try again",
  },
  "meeting-ended": {
    ar: "هذا الاجتماع قد انتهى",
    en: "This meeting has ended",
  },
  "room-full": {
    ar: "الغرفة ممتلئة. حاول مرة أخرى لاحقاً",
    en: "The room is full. Please try again later",
  },
  validation: {
    ar: "يرجى تصحيح الأخطاء في الحقول",
    en: "Please correct the errors in the fields",
  },
  auth: {
    ar: "فشل التحقق. حاول مرة أخرى",
    en: "Authentication failed. Please try again",
  },
  unknown: {
    ar: "حدث خطأ غير متوقع",
    en: "An unexpected error occurred",
  },
}

export default function JoinPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { phone, identity, displayName, consentGiven, setPhone, setRoom, setConsent } = useRoomStore()
  const { isAdmin } = useAuthStore()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  const meetingInfo = mockMeetingInfoMap[roomId]
  const isValidMeeting = !!meetingInfo
  const isHostPresent = meetingInfo?.hostJoined
  const isEnded = meetingInfo?.ended
  const hasPassword = meetingInfo?.password && meetingInfo.password.length > 0

  const [localPhone, setLocalPhone] = useState(phone || "")
  const [name, setName] = useState(displayName || "")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [joinError, setJoinError] = useState<JoinError | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [audioOnly, setAudioOnly] = useState(false)
  const [consentChecked, setConsentChecked] = useState(consentGiven)
  const [phoneError, setPhoneError] = useState("")

  const validatePhone = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, "")
    if (!digits) return ""
    // Saudi mobiles: 05xxxxxxxx (12 digits with +966)
    if (val.startsWith("+966") && digits.length !== 12) {
      return lang === "ar" ? "الصيغة الصحيحة: +966 5x xxx xxxx" : "Expected format: +966 5x xxx xxxx"
    }
    if (val.startsWith("0") && digits.length !== 10 && digits.length < 10) {
      return lang === "ar" ? "رقم الجوال يجب أن يكون 10 أرقام (05xxxxxxxx)" : "Phone must be 10 digits (05xxxxxxxx)"
    }
    if (!val.startsWith("+966") && !val.startsWith("0") && digits.length > 3) {
      return lang === "ar" ? "أدخل الرقم بصيغة 05xxxxxxxx أو +966xxxxxxxxx" : "Enter as 05xxxxxxxx or +966xxxxxxxxx"
    }
    return ""
  }, [lang])

  const handlePhoneChange = useCallback((val: string) => {
    setLocalPhone(val)
    setPhoneError(validatePhone(val))
    setJoinError(null)
  }, [validatePhone])

  const formattedPhone = useMemo(() => {
    const d = localPhone.replace(/\D/g, "")
    if (d.length === 0) return ""
    if (d.length <= 9) return "0" + d.slice(0, 9)
    // If already has +966-like digits
    if (localPhone.startsWith("+966")) return localPhone
    return "+966 " + d.slice(0, 1) + " " + d.slice(1, 4) + " " + d.slice(4, 7) + " " + d.slice(7, 10)
  }, [localPhone])

  const joinLink = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href
    }
    return ""
  }, [])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(joinLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [joinLink])

  const isFormValid = useMemo(() => {
    const digits = localPhone.replace(/\D/g, "")
    if (!digits) return false
    if (!phoneError && digits.length >= 9 && name.trim().length > 0 && consentChecked) return true
    if (!phoneError && digits.length >= 9 && consentChecked) return true
    return false
  }, [localPhone, phoneError, name, consentChecked])

  const handleJoin = async () => {
    setError("")
    setJoinError(null)
    const digits = localPhone.replace(/\D/g, "")

    // Final validation
    if (digits.length < 9) {
      setPhoneError(lang === "ar" ? "أدخل رقم جوال صحيح" : "Enter a valid phone number")
      return
    }

    if (!consentChecked) {
      setError(lang === "ar" ? "الموافقة على جمع البيانات مطلوبة" : "Consent is required to join")
      return
    }

    // Check for edge cases
    if (isEnded) {
      setJoinError("meeting-ended")
      return
    }

    setLoading(true)
    try {
      setPhone(localPhone)
      setConsent(true)

      const displayNameVal = name.trim() || "User " + digits.slice(-4)
      setName(displayNameVal)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: roomId,
          identity: digits,
          name: displayNameVal,
        }),
        signal: controller.signal,
      }).catch((err) => {
        if (err.name === "AbortError") {
          throw new Error("timeout")
        }
        throw new Error("network")
      })

      clearTimeout(timeout)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "auth")

      setRoom(roomId, data.token)
      router.push("/meetings/waiting/" + roomId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown"
      if (msg === "timeout" || msg === "network") {
        setJoinError("network")
      } else if (msg === "auth") {
        setJoinError("auth")
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-3 md:p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D] min-h-screen">
      <div className="w-full max-w-lg space-y-4 md:space-y-5">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Video size={24} className="text-[#F2F2F2] dark:text-[#0D0D0D]" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "الانضمام إلى الاجتماع" : "Join Meeting"}
          </h1>
          <p className="text-xs md:text-sm text-[#666666] dark:text-[#999999]">
            {isValidMeeting
              ? (lang === "ar" ? "جهّز الكاميرا والمايك للانضمام" : "Set up your camera and mic to join")
              : (lang === "ar" ? "أدخل رمز الاجتماع للانضمام" : "Enter the meeting code to join")}
          </p>
          {!meetingInfo && (
            <p className="text-[10px] text-[#999999] mt-2 flex items-center justify-center gap-1">
              <Shield size={10} />
              {lang === "ar" ? "رمز الاجتماع" : "Meeting ID"}: <span className="font-mono font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{roomId}</span>
            </p>
          )}
        </div>

        {/* Unknown room notice */}
        {!meetingInfo && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-[#D97706]">
            <AlertTriangle size={14} className="shrink-0" />
            {lang === "ar"
              ? "لم نتمكن من تحميل تفاصيل الاجتماع. يمكنك المحاولة على أي حال."
              : "Could not load meeting details. You can still try to join."}
          </div>
        )}

        {/* Meeting Info Bar */}
        {meetingInfo && (
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] line-clamp-1">{meetingInfo.title[lang]}</p>
              {/* Room status */}
              <span className={"shrink-0 text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 " + (isEnded ? "bg-red-100 dark:bg-red-900/20 text-[#DC2626]" : isHostPresent ? "bg-green-100 dark:bg-green-900/20 text-[#16A34A]" : "bg-amber-100 dark:bg-amber-900/20 text-[#D97706]")}>
                {isEnded ? <XCircle size={10} /> : isHostPresent ? <Video size={10} /> : <Clock size={10} />}
                {isEnded ? (lang === "ar" ? "انتهى" : "Ended") : isHostPresent ? (lang === "ar" ? "المضيف موجود" : "Host present") : (lang === "ar" ? "بانتظار المضيف" : "Awaiting host")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs text-[#666666] dark:text-[#999999]">
              <span className="flex items-center gap-1.5"><User size={12} /> {meetingInfo.organizer}</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {meetingInfo.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} /> {meetingInfo.startTime} · {meetingInfo.duration}{lang === "ar" ? "د" : "min"}</span>
              <span className="flex items-center gap-1.5"><Users size={12} /> {meetingInfo.attendees > 0 ? meetingInfo.attendees + (lang === "ar" ? " مشارك" : " attendees") : (lang === "ar" ? "لا مشاركين بعد" : "No attendees yet")}</span>
            </div>
            {/* Meeting ID + copy */}
            <div className="flex items-center justify-between pt-1.5 border-t border-[#D4D4D4] dark:border-[#333333]">
              <span className="flex items-center gap-1.5 text-[10px] text-[#666666] dark:text-[#999999]">
                <Shield size={11} /> {lang === "ar" ? "رمز الاجتماع" : "Meeting ID"}:
                <span className="font-mono font-bold text-[#0D0D0D] dark:text-[#F2F2F2] tracking-wider text-xs">{roomId}</span>
              </span>
              <button
                onClick={copyLink}
                className="text-[10px] font-medium flex items-center gap-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
                aria-label={lang === "ar" ? "نسخ رابط الاجتماع" : "Copy meeting link"}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? (lang === "ar" ? "تم النسخ" : "Copied") : (lang === "ar" ? "نسخ الرابط" : "Copy link")}
              </button>
            </div>
          </div>
        )}

        {/* Password notice */}
        {hasPassword && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
            <Shield size={14} className="shrink-0" />
            {lang === "ar" ? "هذا الاجتماع محمي بكلمة مرور. ستحتاج إلى إدخالها بعد الانضمام." : "This meeting is password-protected. You will need to enter it after joining."}
          </div>
        )}

        {/* Edge case alerts */}
        {isEnded && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-[#DC2626]">
            <DoorOpen size={14} className="shrink-0" />
            {lang === "ar" ? "هذا الاجتماع قد انتهى ولا يمكن الانضمام إليه" : "This meeting has ended and cannot be joined"}
          </div>
        )}
        {joinError === "network" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-[#DC2626]">
            <WifiOff size={14} className="shrink-0" />
            {ERROR_MESSAGES.network[lang]}
          </div>
        )}
        {joinError === "room-full" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-[#DC2626]">
            <Users size={14} className="shrink-0" />
            {ERROR_MESSAGES["room-full"][lang]}
          </div>
        )}

        {/* Camera & Mic Test */}
        {!isEnded && (
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
            <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5">
              <Video size={14} /> {lang === "ar" ? "الكاميرا والمايك" : "Camera & Mic"}
            </p>
            <PreJoinCameraTest onReady={setStream} />
          </div>
        )}

        {/* Name + Phone Form */}
        {!isEnded && (
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4 space-y-3.5">
            {/* Name - pre-filled for logged-in users */}
            <div>
              <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-1.5 mb-1.5">
                <User size={13} /> {lang === "ar" ? "الاسم" : "Name"} {isAdmin ? "" : "*"}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAdmin ? (lang === "ar" ? "أحمد السالم" : "Ahmed Al-Salem") : (lang === "ar" ? "اسمك للعرض" : "Your display name")}
                className="w-full h-11 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
                autoComplete="name"
              />
              {isAdmin && (
                <p className="text-[10px] text-[#999999] mt-1">
                  {lang === "ar" ? "تم تعبئة الاسم تلقائياً من حسابك" : "Auto-filled from your account"}
                </p>
              )}
            </div>

            {/* Phone with +966 prefix */}
            <div>
              <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-1.5 mb-1.5">
                <Phone size={13} /> {lang === "ar" ? "رقم الجوال" : "Phone Number"} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-[#666666] dark:text-[#999999] font-medium pointer-events-none border-e border-[#D4D4D4] dark:border-[#333333] pe-2">
                  +966
                </span>
                <input
                  value={localPhone.replace(/^(\+966)?\s?/, "")}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "")
                    const full = "+966" + raw
                    handlePhoneChange(full)
                  }}
                  placeholder="5x xxx xxxx"
                  type="tel"
                  inputMode="numeric"
                  className="w-full h-11 ps-[4.2rem] pe-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
                  autoComplete="tel"
                />
              </div>
              <p className="text-[10px] text-[#999999] mt-1 flex items-center gap-1">
                <AlertTriangle size={10} />
                {lang === "ar" ? "يُستخدم للتحقق ولإشعارات الاجتماع. مثال: 05x xxx xxxx" : "Used for verification & meeting notifications. E.g. 05x xxx xxxx"}
              </p>
              {phoneError && (
                <p className="text-[10px] text-[#DC2626] mt-1">{phoneError}</p>
              )}
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 accent-[#0D0D0D] dark:accent-[#F2F2F2]"
              />
              <span className="text-[10px] text-[#666666] dark:text-[#999999] leading-relaxed group-hover:text-[#0D0D0D] dark:group-hover:text-[#F2F2F2] transition-colors">
                {lang === "ar"
                  ? "أوافق على جمع رقم جوال واستخدامه للتحقق والتواصل بخصوص هذا الاجتماع."
                  : "I consent to the collection of my phone number for verification and meeting-related communication."}
              </span>
            </label>
          </div>
        )}

        {/* Options row */}
        {!isEnded && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={audioOnly}
                onChange={(e) => setAudioOnly(e.target.checked)}
                className="accent-[#0D0D0D] dark:accent-[#F2F2F2]"
              />
              <span className="text-xs text-[#666666] dark:text-[#999999] group-hover:text-[#0D0D0D] dark:group-hover:text-[#F2F2F2] transition-colors flex items-center gap-1.5">
                <Headphones size={13} />
                {lang === "ar" ? "انضمام بالصوت فقط" : "Audio only"}
              </span>
            </label>
            <span className="text-[10px] text-[#999999]">
              {audioOnly ? (lang === "ar" ? "لن يتم تشغيل الكاميرا" : "Camera will stay off") : ""}
            </span>
          </div>
        )}

        {/* Join Button */}
        {!isEnded && (
          <>
            <Button
              onClick={handleJoin}
              disabled={loading || !isFormValid || !!joinError}
              className="w-full h-13"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
                  {lang === "ar" ? "جاري الاتصال..." : "Connecting..."}
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  {lang === "ar" ? "انضمام إلى الاجتماع" : "Join Meeting"}
                </>
              )}
            </Button>

            {!isFormValid && !phoneError && (
              <p className="text-[10px] text-[#999999] text-center">
                {!name.trim() && localPhone.replace(/\D/g, "").length < 9
                  ? (lang === "ar" ? "أدخل الاسم ورقم الجوال للمتابعة" : "Enter your name and phone to continue")
                  : localPhone.replace(/\D/g, "").length < 9
                  ? (lang === "ar" ? "أدخل رقم جوال صحيح للمتابعة" : "Enter a valid phone number to continue")
                  : !consentChecked
                  ? (lang === "ar" ? "وافق على جمع البيانات للمتابعة" : "Agree to data collection to continue")
                  : ""}
              </p>
            )}
          </>
        )}

        {/* Error text */}
        {error && !joinError && (
          <p className="text-xs text-[#DC2626] text-center">{error}</p>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-[#999999] dark:text-[#666666] flex items-center justify-center gap-1">
          <Shield size={10} />
          {lang === "ar"
            ? "اجتماعاتك مشفرة وآمنة"
            : "Your meetings are encrypted and secure"}
        </p>
      </div>
    </div>
  )
}
