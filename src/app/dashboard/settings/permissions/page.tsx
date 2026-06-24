"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { permissions } from "@/lib/mock-data/dashboard"
import { Store, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PermissionsPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    permissions.forEach((p) => { initial[p.key] = true })
    return initial
  })
  const [storeConnected, setStoreConnected] = useState(true)

  const toggle = (key: string) => setEnabled((e) => ({ ...e, [key]: !e[key] }))

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "إعدادات الصلاحيات" : "Permissions Settings"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إدارة صلاحيات متجر سلة" : "Manage Salla store permissions"}
        </p>
      </div>

      <div className="p-5 border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#E8E8E8] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333] flex items-center justify-center">
            <Store size={22} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "متجر سلة" : "Salla Store"}
            </p>
            <p className="text-xs text-[#666666] dark:text-[#999999]">
              {storeConnected
                ? (lang === "ar" ? "حالة الاتصال: متصل" : "Status: Connected")
                : (lang === "ar" ? "حالة الاتصال: غير مربوط" : "Status: Not Connected")}
            </p>
          </div>
        </div>
        <Button
          variant={storeConnected ? "secondary" : "primary"}
          onClick={() => setStoreConnected(!storeConnected)}
        >
          {storeConnected
            ? (lang === "ar" ? "إلغاء الربط" : "Disconnect")
            : (lang === "ar" ? "ربط متجر سلة" : "Connect Salla Store")}
        </Button>
      </div>

      <div className="space-y-1">
        {permissions.map((perm) => (
          <label
            key={perm.key}
            className="flex items-center justify-between px-5 py-4 border-b border-[#D4D4D4] dark:border-[#333333] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{perm.label[lang]}</span>
            <button
              onClick={() => toggle(perm.key)}
              className={"w-12 h-7 relative transition-colors " + (enabled[perm.key] ? "bg-[#0D0D0D] dark:bg-[#F2F2F2]" : "bg-[#D4D4D4] dark:bg-[#333333]")}
            >
              <span className={"absolute top-0.5 w-6 h-6 bg-white transition-all " + (enabled[perm.key] ? "end-0.5" : "start-0.5")} />
            </button>
          </label>
        ))}
      </div>
    </div>
  )
}
