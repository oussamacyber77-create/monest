"use client"

import { useSettingsStore } from "@/stores/settings-store"
import { FileText, Image, Video, File } from "lucide-react"

const categories = [
  { icon: FileText, label: { ar: "المستندات", en: "Documents" }, count: 12, color: "text-blue-500" },
  { icon: Image, label: { ar: "الصور", en: "Images" }, count: 48, color: "text-emerald-500" },
  { icon: Video, label: { ar: "الفيديوهات", en: "Videos" }, count: 8, color: "text-violet-500" },
  { icon: File, label: { ar: "الملفات", en: "Files" }, count: 23, color: "text-amber-500" },
]

export default function ContentCenterPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
          {lang === "ar" ? "مركز المحتوى" : "Content Center"}
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#999999]">
          {lang === "ar" ? "إدارة جميع محتويات متجرك في مكان واحد" : "Manage all your store content in one place"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button key={cat.label.en} className="p-6 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors text-start">
            <cat.icon size={28} className={cat.color + " mb-3"} />
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{cat.label[lang]}</p>
            <p className="text-xs text-[#999999]">{cat.count} {lang === "ar" ? "ملف" : "files"}</p>
          </button>
        ))}
      </div>

      <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
        <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
          <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "آخر الملفات" : "Recent Files"}
          </p>
        </div>
        <div className="p-8 text-center text-sm text-[#999999]">
          {lang === "ar" ? "لم يتم رفع أي ملفات بعد" : "No files uploaded yet"}
        </div>
      </div>
    </div>
  )
}
