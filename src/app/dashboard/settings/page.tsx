"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { User, Bell, Shield, CreditCard, Store, Lock } from "lucide-react"
import { getSallaAuthUrl } from "@/lib/salla/config"
import { Modal } from "@/components/ui/modal"

const sections = [
  { icon: User, label: { ar: "الملف الشخصي", en: "Profile" }, href: "" },
  { icon: Bell, label: { ar: "الإشعارات", en: "Notifications" }, href: "" },
  { icon: Shield, label: { ar: "الصلاحيات", en: "Permissions" }, href: "/dashboard/settings/permissions" },
  { icon: CreditCard, label: { ar: "طرق الدفع", en: "Payment Methods" }, href: "" },
  { icon: Store, label: { ar: "ربط متجر سلة", en: "Connect Salla Store" }, href: getSallaAuthUrl(), external: true },
  { icon: Lock, label: { ar: "الأمان", en: "Security" }, href: "" },
]

export default function SettingsPage() {
  const { direction } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"
  const [comingSoon, setComingSoon] = useState("")

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "الإعدادات" : "Settings"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إدارة إعدادات حسابك ومتجرك" : "Manage your account and store settings"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((s) => {
          const content = (
            <>
              <div className="w-12 h-12 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
                <s.icon size={22} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.label[lang]}</p>
              </div>
            </>
          )

          if (s.external) {
            return (
              <a key={s.label.en} href={s.href} target="_blank" rel="noopener noreferrer" className="p-6 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex gap-4 items-center" aria-label={s.label[lang]}>
                {content}
              </a>
            )
          }

          if (s.href) {
            return (
              <button key={s.label.en} onClick={() => router.push(s.href)} className="p-6 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex gap-4 items-center text-start" aria-label={s.label[lang]}>
                {content}
              </button>
            )
          }

          return (
            <button key={s.label.en} onClick={() => setComingSoon(s.label[lang])} className="p-6 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors flex gap-4 items-center text-start" aria-label={s.label[lang]}>
              {content}
            </button>
          )
        })}
      </div>

      <Modal isOpen={!!comingSoon} onClose={() => setComingSoon("")} title={comingSoon}>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "هذه الميزة قيد التطوير وستكون متاحة قريباً" : "This feature is under development and will be available soon"}
        </p>
      </Modal>
    </div>
  )
}
