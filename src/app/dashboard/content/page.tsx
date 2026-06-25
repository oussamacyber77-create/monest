"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { FileText, Image, Video, File, Upload, Download, Trash2, Search, Plus, FolderOpen } from "lucide-react"

const categories = [
  { icon: FileText, label: { ar: "المستندات", en: "Documents" }, count: 12, size: "48 MB", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: Image, label: { ar: "الصور", en: "Images" }, count: 48, size: "156 MB", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: Video, label: { ar: "الفيديوهات", en: "Videos" }, count: 8, size: "1.2 GB", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { icon: File, label: { ar: "الملفات", en: "Files" }, count: 23, size: "92 MB", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
]

const recentFiles = [
  { name: "تقرير المبيعات يونيو.pdf", type: "pdf", size: "2.4 MB", date: "2026-06-25", icon: FileText },
  { name: "شعار المتجر.png", type: "image", size: "856 KB", date: "2026-06-24", icon: Image },
  { name: "فيديو تعريفي.mp4", type: "video", size: "45 MB", date: "2026-06-20", icon: Video },
  { name: "قائمة المنتجات.xlsx", type: "excel", size: "1.1 MB", date: "2026-06-18", icon: File },
]

export default function ContentCenterPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [search, setSearch] = useState("")

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "مركز المحتوى" : "Content Center"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#999999]">
            {lang === "ar" ? "إدارة جميع محتويات متجرك في مكان واحد" : "Manage all your store content in one place"}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[#999999]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === "ar" ? "بحث..." : "Search..."} className="w-48 h-10 ps-9 pe-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
          </div>
          <button className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-80 transition-opacity flex items-center gap-1.5">
            <Upload size={14} />
            {lang === "ar" ? "رفع ملف" : "Upload"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button key={cat.label.en} className="p-5 border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors text-start">
            <div className={"w-10 h-10 rounded-lg flex items-center justify-center mb-3 " + cat.bg}>
              <cat.icon size={22} className={cat.color} />
            </div>
            <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{cat.label[lang]}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#999999]">{cat.count} {lang === "ar" ? "ملف" : "files"}</span>
              <span className="text-[10px] text-[#999999]">•</span>
              <span className="text-[10px] text-[#999999]">{cat.size}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Storage */}
      <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "مساحة التخزين" : "Storage"}
          </p>
          <span className="text-xs text-[#999999]">1.5 GB / 10 GB</span>
        </div>
        <div className="h-2 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
          <div className="h-full w-[15%] bg-[#0D0D0D] dark:bg-[#F2F2F2]" />
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333]">
        <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
          <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
            {lang === "ar" ? "آخر الملفات" : "Recent Files"}
          </p>
          <div className="flex gap-2">
            <button className="text-xs text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"><FolderOpen size={14} /></button>
          </div>
        </div>
        <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
          {recentFiles.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-[#666666] dark:text-[#999999]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{f.name}</p>
                  <p className="text-[10px] text-[#999999]">{f.size} • {f.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"><Download size={14} /></button>
                <button className="p-1.5 text-[#999999] hover:text-[#DC2626] transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
