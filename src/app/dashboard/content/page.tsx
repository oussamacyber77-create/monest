"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { CalendarDays, Clock, Camera, Play, Globe, Hash, Sparkles, Check, Plus, ChevronLeft, ChevronRight, Send, Image, FileText } from "lucide-react"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Camera, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  { id: "twitter", name: "X", icon: Hash, color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "youtube", name: "YouTube", icon: Play, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  { id: "tiktok", name: "TikTok", icon: Hash, color: "text-[#0D0D0D] dark:text-[#F2F2F2]", bg: "bg-[#E8E8E8] dark:bg-[#333333]" },
]

const scheduledPosts = [
  { id: "sp1", title: { ar: "منتج جديد: سماعات البلوتوث", en: "New Product: Bluetooth Earbuds" }, platform: "instagram", date: "2026-07-05", time: "10:00", status: "scheduled", type: "image" },
  { id: "sp2", title: { ar: "عرض اليوم الوطني", en: "National Day Offer" }, platform: "twitter", date: "2026-07-06", time: "12:00", status: "scheduled", type: "text" },
  { id: "sp3", title: { ar: "فيديو تعريفي بالمنتجات", en: "Product Overview Video" }, platform: "youtube", date: "2026-07-08", time: "15:00", status: "draft", type: "video" },
  { id: "sp4", title: { ar: "تحدي قصير: أفضل منتج", en: "Short Challenge: Best Product" }, platform: "tiktok", date: "2026-07-10", time: "18:00", status: "scheduled", type: "video" },
  { id: "sp5", title: { ar: "نصائح العناية بالمنتجات", en: "Product Care Tips" }, platform: "instagram", date: "2026-07-12", time: "09:00", status: "published", type: "carousel" },
]

export default function ContentCenterPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeTab, setActiveTab] = useState<"schedule" | "platforms" | "ai">("schedule")

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "مركز المحتوى" : "Content Center"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
            {lang === "ar" ? "جدولة المحتوى بذكاء الاصطناعي لكل المنصات" : "AI-powered content scheduling for all platforms"}
          </p>
        </div>
        <button className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
          <Plus size={14} />
          {lang === "ar" ? "إنشاء منشور" : "New Post"}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1 max-w-md">
        {(["schedule", "platforms", "ai"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={"flex-1 py-2 text-xs font-medium transition-colors " + (activeTab === tab ? "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}>
            {tab === "schedule" ? (lang === "ar" ? "الجدول" : "Schedule") : tab === "platforms" ? (lang === "ar" ? "المنصات" : "Platforms") : (lang === "ar" ? "AI" : "AI")}
          </button>
        ))}
      </div>

      {activeTab === "schedule" && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: { ar: "مجداول", en: "Scheduled" }, value: scheduledPosts.filter(p => p.status === "scheduled").length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: { ar: "منشور", en: "Published" }, value: scheduledPosts.filter(p => p.status === "published").length, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
              { label: { ar: "مسودة", en: "Drafts" }, value: scheduledPosts.filter(p => p.status === "draft").length, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
            ].map((s) => (
              <div key={s.label.en} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
                <p className="text-[10px] text-[#999999] mb-1">{s.label[lang]}</p>
                <p className={"text-xl font-bold " + s.color}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Schedule list */}
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] divide-y divide-[#D4D4D4] dark:divide-[#333333]">
            <div className="p-4 border-b border-[#D4D4D4] dark:border-[#333333] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-2">
                <CalendarDays size={16} />
                {lang === "ar" ? "المنشورات المجدولة" : "Scheduled Posts"}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-[#999999]">
                <span>{lang === "ar" ? "هذا الأسبوع" : "This week"}</span>
                <ChevronRight size={12} />
              </div>
            </div>
            {scheduledPosts.map((post) => {
              const pf = platforms.find(p => p.id === post.platform)
              const statusColor = post.status === "published" ? "text-green-600 bg-green-50 dark:bg-green-900/20" : post.status === "draft" ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20" : "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
              return (
                <div key={post.id} className="flex items-center gap-3 p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className={"w-8 h-8 rounded flex items-center justify-center shrink-0 " + (pf?.bg || "bg-gray-100")}>
                    {pf && <pf.icon size={14} className={pf.color} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{post.title[lang]}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#999999] mt-0.5">
                      <span className="flex items-center gap-0.5"><CalendarDays size={10} />{post.date}</span>
                      <span className="flex items-center gap-0.5"><Clock size={10} />{post.time}</span>
                    </div>
                  </div>
                  <span className={"text-[9px] font-bold px-1.5 py-0.5 " + statusColor}>{lang === "ar" ? { scheduled: "مجدول", published: "منشور", draft: "مسودة" }[post.status] : post.status}</span>
                  <button className="p-1.5 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]"><Send size={14} /></button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {activeTab === "platforms" && (
        <div className="grid md:grid-cols-2 gap-4">
          {platforms.map((p) => (
            <div key={p.id} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + p.bg}>
                  <p.icon size={20} className={p.color} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</p>
                  <p className="text-[10px] text-green-600 flex items-center gap-1"><Check size={10} /> {lang === "ar" ? "متصل" : "Connected"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#666666] dark:text-[#B3B3B3]">
                <span>{lang === "ar" ? "منشورات مجدولة" : "Scheduled"}: 4</span>
                <span>{lang === "ar" ? "تم النشر" : "Published"}: 12</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "ai" && (
        <div className="space-y-4">
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-violet-500" />
              <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "توليد محتوى بالذكاء الاصطناعي" : "AI Content Generation"}</h2>
            </div>
            <textarea
              placeholder={lang === "ar" ? "اكتب موضوع المنشور الذي تريد إنشاءه..." : "Enter the post topic you want to create..."}
              className="w-full h-24 p-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] resize-none outline-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] flex items-center gap-1"><Image size={12} /> {lang === "ar" ? "صورة" : "Image"}</button>
                <button className="px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] flex items-center gap-1"><FileText size={12} /> {lang === "ar" ? "نص" : "Text"}</button>
              </div>
              <button className="h-9 px-4 bg-violet-500 text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <Sparkles size={14} />
                {lang === "ar" ? "توليد" : "Generate"}
              </button>
            </div>
          </div>

          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" />
              {lang === "ar" ? "اقتراحات AI للأسبوع" : "AI Suggestions for This Week"}
            </h2>
            <div className="space-y-2">
              {[
                { ar: "منشور عن المنتج الأكثر مبيعاً هذا الأسبوع", en: "Post about this week's best seller", platform: "instagram" },
                { ar: "فيديو قصير: كيف تختار الهدية المثالية", en: "Short video: How to pick the perfect gift", platform: "tiktok" },
                { ar: "انفوجرافيك: إحصائيات السوق", en: "Infographic: Market statistics", platform: "twitter" },
              ].map((s, i) => {
                const pf = platforms.find(p => p.id === s.platform)
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                    {pf && <pf.icon size={14} className={pf.color} />}
                    <p className="text-xs text-[#666666] dark:text-[#B3B3B3] flex-1">{s[lang]}</p>
                    <button className="text-[9px] font-bold text-[#0D0D0D] dark:text-[#F2F2F2] border border-[#D4D4D4] dark:border-[#333333] px-2 py-1">{lang === "ar" ? "استخدام" : "Use"}</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
