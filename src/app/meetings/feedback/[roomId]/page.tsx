"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/stores/settings-store"

export default function FeedbackPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => router.push("/auth/login"), 1000)
  }

  const handleSkip = () => {
    router.push("/auth/login")
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🙏</div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {lang === "ar" ? "شكراً لتقييمك!" : "Thank you for your feedback!"}
          </h1>
          <p className="text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "جاري تحويلك إلى الرئيسية..." : "Redirecting to home..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
            {lang === "ar" ? "كيف كانت تجربتك؟" : "How was your experience?"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "تقييمك يساعدنا في تحسين الخدمة" : "Your feedback helps us improve"}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="w-12 h-12 flex items-center justify-center text-3xl transition-all hover:scale-110"
            >
              {(hover || rating) >= star ? "★" : "☆"}
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={lang === "ar" ? "أخبرنا عن تجربتك (اختياري)..." : "Tell us about your experience (optional)..."}
          rows={4}
          className="w-full p-4 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-[#0D0D0D] dark:text-[#F2F2F2] text-sm placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]"
        />

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={rating === 0} className="flex-1" size="lg">
            {lang === "ar" ? "إرسال التقييم" : "Submit Rating"}
          </Button>
          <Button variant="secondary" onClick={handleSkip} size="lg">
            {lang === "ar" ? "تخطي" : "Skip"}
          </Button>
        </div>
      </div>
    </div>
  )
}
