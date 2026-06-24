"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { useRoomStore } from "@/stores/room-store"
import { useSettingsStore } from "@/stores/settings-store"
import { generateRoomCode } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function Hero() {
  const [phone, setPhoneValue] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { setPhone: storePhone, setRoom, setAdmin } = useRoomStore()
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"

  const handleCreateMeeting = async () => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 4) {
      setError(lang === "ar" ? "أدخل 4 أرقام على الأقل" : "Enter at least 4 digits")
      return
    }
    setError("")
    setLoading(true)
    try {
      const roomCode = generateRoomCode()
      storePhone(phone)
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: roomCode,
          identity: digits,
          name: "User " + digits.slice(-4),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRoom(roomCode, data.token)
      setAdmin(true)
      router.push("/meetings/join/" + roomCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === "ar" ? "فشل إنشاء الاجتماع" : "Failed to create meeting")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="text-sm text-[#666666] dark:text-[#999999] mb-8 max-w-md mx-auto">
        {lang === "ar"
          ? "لا حساب مطلوب • مجاني • فوري"
          : "No account required • Free • Instant"}
      </p>

      <GlassCard className="p-6 max-w-sm mx-auto">
        <div className="space-y-4">
          <Input
            label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
            placeholder={lang === "ar" ? "05xxxxxxxx" : "+1 (555) 000-0000"}
            value={phone}
            onChange={(e) => { setPhoneValue(e.target.value); if (error) setError("") }}
            error={error}
            type="tel"
          />

          <Button onClick={handleCreateMeeting} disabled={loading || !phone} className="w-full" size="lg">
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#F2F2F2]/30 border-t-[#F2F2F2] animate-spin" />
            ) : (
              <>
                <Plus size={18} />
                {lang === "ar" ? "إنشاء اجتماع" : "Create Meeting"}
              </>
            )}
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  )
}
