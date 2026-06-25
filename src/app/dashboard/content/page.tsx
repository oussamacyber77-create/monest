"use client"

import { useState } from "react"
import { useSettingsStore } from "@/stores/settings-store"
import { CalendarDays, Clock, Camera, Play, Globe, Hash, Sparkles, Check, Plus, ChevronLeft, ChevronRight, Send, Image, FileText, BarChart3, Target, PenLine, Trash2, MoreHorizontal, Eye, MessageSquare, Heart, TrendingUp, Zap, LayoutGrid, List, Filter, Download, Smartphone, Monitor, AlignLeft, Type, Video as VideoIcon } from "lucide-react"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Camera, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20", stats: { posts: 24, reach: "12.4K", engagement: "3.8%" } },
  { id: "twitter", name: "X", icon: Hash, color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", stats: { posts: 18, reach: "8.2K", engagement: "2.1%" } },
  { id: "youtube", name: "YouTube", icon: Play, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", stats: { posts: 6, reach: "22.5K", engagement: "5.2%" } },
  { id: "tiktok", name: "TikTok", icon: Smartphone, color: "text-[#0D0D0D] dark:text-[#F2F2F2]", bg: "bg-[#E8E8E8] dark:bg-[#333333]", stats: { posts: 12, reach: "45.8K", engagement: "7.5%" } },
]

interface ScheduledPost {
  id: string
  title: { ar: string; en: string }
  platform: string
  date: string
  time: string
  status: "scheduled" | "published" | "draft"
  type: "image" | "video" | "carousel" | "text"
  engagement?: string
  reach?: string
}

const initialPosts: ScheduledPost[] = [
  { id: "sp1", title: { ar: "منتج جديد: سماعات البلوتوث", en: "New Product: Bluetooth Earbuds" }, platform: "instagram", date: "2026-07-05", time: "10:00", status: "scheduled", type: "image" },
  { id: "sp2", title: { ar: "عرض اليوم الوطني", en: "National Day Offer" }, platform: "twitter", date: "2026-07-06", time: "12:00", status: "scheduled", type: "text" },
  { id: "sp3", title: { ar: "فيديو تعريفي بالمنتجات", en: "Product Overview Video" }, platform: "youtube", date: "2026-07-08", time: "15:00", status: "draft", type: "video" },
  { id: "sp4", title: { ar: "تحدي قصير: أفضل منتج", en: "Short Challenge: Best Product" }, platform: "tiktok", date: "2026-07-10", time: "18:00", status: "scheduled", type: "video" },
  { id: "sp5", title: { ar: "نصائح العناية بالمنتجات", en: "Product Care Tips" }, platform: "instagram", date: "2026-07-12", time: "09:00", status: "published", type: "carousel" },
  { id: "sp6", title: { ar: "تحديثات الشهر", en: "Monthly Updates" }, platform: "twitter", date: "2026-07-03", time: "14:00", status: "published", type: "text" },
  { id: "sp7", title: { ar: "فيديو شرح الميزة الجديدة", en: "New Feature Walkthrough" }, platform: "youtube", date: "2026-07-15", time: "11:00", status: "draft", type: "video" },
]

const aiSuggestions = [
  { ar: "منشور عن المنتج الأكثر مبيعاً هذا الأسبوع مع صور عالية الجودة", en: "Post about this week's best seller with high-quality images", platform: "instagram", tone: "enthusiastic" },
  { ar: "تغريدة استفتاء: وش الميزة اللي تبيها في التحديث الجاي؟", en: "Poll tweet: What feature do you want in the next update?", platform: "twitter", tone: "casual" },
  { ar: "فيديو قصير: 5 نصائح لاختيار الهدية المثالية", en: "Short video: 5 tips for choosing the perfect gift", platform: "tiktok", tone: "educational" },
  { ar: "فيديو تعليمي: كيف تستخدم المنصة لزيادة مبيعاتك", en: "Tutorial: How to use the platform to boost sales", platform: "youtube", tone: "professional" },
]

export default function ContentCenterPage() {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "ai" | "analytics">("overview")
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [filterStatus, setFilterStatus] = useState<"all" | "scheduled" | "published" | "draft">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiTone, setAiTone] = useState("professional")
  const [aiPlatform, setAiPlatform] = useState("instagram")

  const filteredPosts = posts.filter(p => filterStatus === "all" || p.status === filterStatus)

  const stats = {
    scheduled: posts.filter(p => p.status === "scheduled").length,
    published: posts.filter(p => p.status === "published").length,
    drafts: posts.filter(p => p.status === "draft").length,
    totalReach: "88.9K",
    avgEngagement: "4.2%",
    bestPlatform: "TikTok",
  }

  const statusBadge = (status: string) => {
    const styles = {
      scheduled: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      published: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      draft: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    }
    const labels = {
      scheduled: lang === "ar" ? "مجدول" : "Scheduled",
      published: lang === "ar" ? "منشور" : "Published",
      draft: lang === "ar" ? "مسودة" : "Draft",
    }
    return <span className={"text-[9px] font-bold px-1.5 py-0.5 " + (styles[status as keyof typeof styles] || "")}>{labels[status as keyof typeof labels]}</span>
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image size={12} />
      case "video": return <VideoIcon size={12} />
      case "carousel": return <LayoutGrid size={12} />
      case "text": return <AlignLeft size={12} />
      default: return <FileText size={12} />
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
            {lang === "ar" ? "مركز المحتوى" : "Content Center"}
          </h1>
          <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
            {lang === "ar" ? "جدولة المحتوى بذكاء الاصطناعي لكل المنصات" : "AI-powered content scheduling for all platforms"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-3 border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] flex items-center gap-1.5">
            <Download size={14} /> {lang === "ar" ? "تصدير" : "Export"}
          </button>
          <button onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Plus size={14} /> {lang === "ar" ? "منشور جديد" : "New Post"}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: { ar: "مجدول", en: "Scheduled" }, value: stats.scheduled, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", suffix: "" },
          { label: { ar: "منشور", en: "Published" }, value: stats.published, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", suffix: "" },
          { label: { ar: "مسودة", en: "Drafts" }, value: stats.drafts, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", suffix: "" },
          { label: { ar: "إجمالي الوصول", en: "Total Reach" }, value: stats.totalReach, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20", suffix: "" },
          { label: { ar: "متوسط التفاعل", en: "Avg. Engagement" }, value: stats.avgEngagement, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", suffix: "" },
        ].map((s) => (
          <div key={s.label.en} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
            <p className="text-[10px] text-[#999999] mb-1">{s.label[lang]}</p>
            <p className={"text-lg font-bold " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#E8E8E8] dark:bg-[#1A1A1A] p-1 max-w-xl">
        {(["overview", "schedule", "ai", "analytics"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={"flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 " + (activeTab === tab ? "bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}>
            {tab === "overview" ? <Globe size={13} /> : tab === "schedule" ? <CalendarDays size={13} /> : tab === "ai" ? <Sparkles size={13} /> : <BarChart3 size={13} />}
            {tab === "overview" ? (lang === "ar" ? "المنصات" : "Platforms") : tab === "schedule" ? (lang === "ar" ? "الجدول" : "Schedule") : tab === "ai" ? (lang === "ar" ? "AI" : "AI") : (lang === "ar" ? "التحليلات" : "Analytics")}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW / PLATFORMS TAB ===== */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          {platforms.map((p) => (
            <div key={p.id} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5 hover:border-[#0D0D0D]/30 dark:hover:border-[#F2F2F2]/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + p.bg}>
                  <p.icon size={20} className={p.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</p>
                    <span className="text-[9px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 flex items-center gap-0.5">
                      <Check size={9} /> {lang === "ar" ? "متصل" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.stats.posts}</p>
                  <p className="text-[9px] text-[#999999]">{lang === "ar" ? "منشورات" : "Posts"}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.stats.reach}</p>
                  <p className="text-[9px] text-[#999999]">{lang === "ar" ? "وصول" : "Reach"}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{p.stats.engagement}</p>
                  <p className="text-[9px] text-[#999999]">{lang === "ar" ? "تفاعل" : "Engagement"}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D4D4D4] dark:border-[#333333] flex justify-between">
                <button className="text-[10px] font-medium text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">{lang === "ar" ? "جدولة منشور" : "Schedule Post"}</button>
                <button className="text-[10px] font-medium text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">{lang === "ar" ? "عرض التحليلات" : "View Analytics"}</button>
              </div>
            </div>
          ))}
          {/* Connect new platform */}
          <button className="border border-dashed border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors flex flex-col items-center justify-center gap-2 text-[#999999]">
            <Plus size={24} />
            <span className="text-xs font-medium">{lang === "ar" ? "ربط منصة جديدة" : "Connect New Platform"}</span>
          </button>
        </div>
      )}

      {/* ===== SCHEDULE TAB ===== */}
      {activeTab === "schedule" && (
        <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D]">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4D4D4] dark:border-[#333333]">
            <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
              {lang === "ar" ? "المنشورات" : "Posts"}
            </h2>
            <div className="flex items-center gap-2">
              {/* Status filter */}
              <div className="flex gap-1">
                {(["all", "scheduled", "published", "draft"] as const).map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={"px-2 py-1 text-[9px] font-medium transition-colors " + (filterStatus === s ? "bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D]" : "text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}>
                    {s === "all" ? (lang === "ar" ? "الكل" : "All") : statusBadge(s)}
                  </button>
                ))}
              </div>
              {/* View toggle */}
              <div className="flex border border-[#D4D4D4] dark:border-[#333333]">
                <button onClick={() => setViewMode("list")} className={"p-1.5 " + (viewMode === "list" ? "bg-[#E8E8E8] dark:bg-[#333333]" : "")}>
                  <List size={14} className="text-[#666666]" />
                </button>
                <button onClick={() => setViewMode("grid")} className={"p-1.5 " + (viewMode === "grid" ? "bg-[#E8E8E8] dark:bg-[#333333]" : "")}>
                  <LayoutGrid size={14} className="text-[#666666]" />
                </button>
              </div>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarDays size={40} className="text-[#D4D4D4] dark:text-[#333333] mb-3" />
              <p className="text-sm font-medium text-[#666666] mb-1">
                {lang === "ar" ? "لا توجد منشورات" : "No posts found"}
              </p>
              <p className="text-xs text-[#999999] mb-4">
                {lang === "ar" ? "أنشئ أول منشور لك" : "Create your first post"}
              </p>
              <button onClick={() => setShowCreateModal(true)}
                className="h-9 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold flex items-center gap-1.5">
                <Plus size={14} /> {lang === "ar" ? "منشور جديد" : "New Post"}
              </button>
            </div>
          ) : viewMode === "list" ? (
            <div className="divide-y divide-[#D4D4D4] dark:divide-[#333333]">
              {filteredPosts.map((post) => {
                const pf = platforms.find(p => p.id === post.platform)
                return (
                  <div key={post.id} className="flex items-center gap-3 p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors group">
                    {/* Platform icon */}
                    <div className={"w-9 h-9 rounded flex items-center justify-center shrink-0 " + (pf?.bg || "bg-gray-100")}>
                      {pf && <pf.icon size={16} className={pf.color} />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] truncate">{post.title[lang]}</p>
                      <div className="flex items-center gap-3 text-[10px] text-[#999999] mt-0.5">
                        <span className="flex items-center gap-0.5"><CalendarDays size={10} />{post.date}</span>
                        <span className="flex items-center gap-0.5"><Clock size={10} />{post.time}</span>
                        <span className="flex items-center gap-0.5">{typeIcon(post.type)} {post.type}</span>
                        {post.engagement && <span className="flex items-center gap-0.5"><Heart size={10} />{post.engagement}</span>}
                        {post.reach && <span className="flex items-center gap-0.5"><Eye size={10} />{post.reach}</span>}
                      </div>
                    </div>
                    {/* Status + Actions */}
                    <div className="flex items-center gap-2">
                      {statusBadge(post.status)}
                      <button className="p-1.5 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Grid view */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredPosts.map((post) => {
                const pf = platforms.find(p => p.id === post.platform)
                return (
                  <div key={post.id} className="border border-[#D4D4D4] dark:border-[#333333] p-4 hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={"w-7 h-7 rounded flex items-center justify-center " + (pf?.bg || "bg-gray-100")}>
                        {pf && <pf.icon size={12} className={pf.color} />}
                      </div>
                      <span className="text-[10px] text-[#999999]">{pf?.name}</span>
                      <div className="me-auto" />
                      {statusBadge(post.status)}
                    </div>
                    <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2] mb-2 line-clamp-2">{post.title[lang]}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#999999]">
                      <CalendarDays size={10} />{post.date}
                      <Clock size={10} />{post.time}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#D4D4D4] dark:border-[#333333] flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "تعديل" : "Edit"}</button>
                      <button className="text-[10px] font-medium text-[#DC2626]">{lang === "ar" ? "حذف" : "Delete"}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== AI TAB ===== */}
      {activeTab === "ai" && (
        <div className="grid md:grid-cols-5 gap-5">
          {/* Left: Generator */}
          <div className="md:col-span-3 space-y-4">
            <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Sparkles size={16} className="text-violet-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "توليد محتوى بالذكاء الاصطناعي" : "AI Content Generation"}</h2>
                  <p className="text-[10px] text-[#999999]">{lang === "ar" ? "اختر المنصة ونغمة الصوت واترك الباقي للذكاء الاصطناعي" : "Choose platform, tone, and let AI do the rest"}</p>
                </div>
              </div>

              {/* Platform selector */}
              <div className="flex gap-2 mb-4">
                {platforms.map((p) => (
                  <button key={p.id} onClick={() => setAiPlatform(p.id)}
                    className={"flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border " + (aiPlatform === p.id ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}>
                    <p.icon size={14} className={p.color} /> {p.name}
                  </button>
                ))}
              </div>

              {/* Tone selector */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: "professional", label: { ar: "احترافي", en: "Professional" }, icon: PenLine },
                  { id: "casual", label: { ar: "عفوي", en: "Casual" }, icon: MessageSquare },
                  { id: "enthusiastic", label: { ar: "حماسي", en: "Enthusiastic" }, icon: TrendingUp },
                  { id: "educational", label: { ar: "تعليمي", en: "Educational" }, icon: Target },
                ].map((t) => (
                  <button key={t.id} onClick={() => setAiTone(t.id)}
                    className={"flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium transition-colors border " + (aiTone === t.id ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10" : "border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]")}>
                    <t.icon size={12} /> {t.label[lang]}
                  </button>
                ))}
              </div>

              <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={lang === "ar" ? "اكتب موضوع المنشور الذي تريد إنشاءه... مثال: إعلان عن خصم 50% على منتجات الصيف" : "Enter the post topic. E.g., 50% discount on summer collection..."}
                className="w-full h-28 p-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] resize-none outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] flex items-center gap-1"><Image size={12} /> {lang === "ar" ? "صورة" : "Image"}</button>
                  <button className="px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] flex items-center gap-1"><FileText size={12} /> {lang === "ar" ? "نص" : "Text"}</button>
                  <button className="px-3 py-1.5 border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] flex items-center gap-1"><VideoIcon size={12} /> {lang === "ar" ? "فيديو" : "Video"}</button>
                </div>
                <button disabled={!aiPrompt.trim()}
                  className="h-9 px-5 bg-violet-500 text-white text-xs font-bold hover:bg-violet-600 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  {lang === "ar" ? "توليد" : "Generate"}
                </button>
              </div>
            </div>

            {/* Generated output preview */}
            {aiPrompt.trim() && (
              <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Check size={14} className="text-green-500" />
                  <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المحتوى المقترح" : "Suggested Content"}</h3>
                </div>
                <div className="p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] leading-relaxed mb-3">
                  {lang === "ar"
                    ? "🔥 عرض الصيف! خصم 50% على جميع منتجاتنا\n\nلفترة محدودة، احصل على أقوى العروض على منتجات الصيف. تسوق الآن ووفر!\n\n#عرض_الصيف #تخفيضات #تسوق"
                    : "🔥 Summer Sale! 50% OFF on all products\n\nLimited time offer. Get the best deals on summer products. Shop now and save!\n\n#SummerSale #Discounts #Shop"}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-[10px] font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">{lang === "ar" ? "تعديل" : "Edit"}</button>
                    <button className="px-3 py-1.5 text-[10px] font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">{lang === "ar" ? "إعادة توليد" : "Regenerate"}</button>
                  </div>
                  <button className="px-4 py-1.5 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-[10px] font-bold">{lang === "ar" ? "جدولة المنشور" : "Schedule Post"}</button>
                </div>
              </div>
            )}
          </div>

          {/* Right: AI suggestions */}
          <div className="md:col-span-2 space-y-4">
            <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
              <h3 className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                {lang === "ar" ? "اقتراحات اليوم" : "Today's Suggestions"}
              </h3>
              <div className="space-y-2">
                {aiSuggestions.map((s, i) => {
                  const pf = platforms.find(p => p.id === s.platform)
                  return (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                      <div className={"w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 " + (pf?.bg || "bg-gray-100")}>
                        {pf && <pf.icon size={11} className={pf.color} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#666666] dark:text-[#B3B3B3] leading-relaxed">{s[lang]}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-[#999999]">{pf?.name}</span>
                          <span className="text-[9px] text-violet-500">{s.tone}</span>
                        </div>
                      </div>
                      <button className="text-[9px] font-medium text-[#0D0D0D] dark:text-[#F2F2F2] border border-[#D4D4D4] dark:border-[#333333] px-2 py-0.5 shrink-0 hover:bg-[#E8E8E8] dark:hover:bg-[#333333] transition-colors">
                        {lang === "ar" ? "استخدام" : "Use"}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick stats */}
            <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-4">
              <h3 className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">{lang === "ar" ? "أداء المحتوى" : "Content Performance"}</h3>
              <div className="space-y-3">
                {[
                  { label: { ar: "أفضل منصة", en: "Best Platform" }, value: "TikTok", detail: "7.5% engagement" },
                  { label: { ar: "أفضل وقت للنشر", en: "Best Posting Time" }, value: lang === "ar" ? "8-10 مساءً" : "8-10 PM", detail: "32% higher reach" },
                  { label: { ar: "نوع المحتوى الأفضل", en: "Best Content Type" }, value: lang === "ar" ? "فيديو قصير" : "Short Video", detail: "2.3x engagement" },
                ].map((s) => (
                  <div key={s.label.en} className="flex items-center justify-between">
                    <span className="text-[10px] text-[#999999]">{s.label[lang]}</span>
                    <div className="text-end">
                      <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.value}</p>
                      <p className="text-[9px] text-green-500">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ANALYTICS TAB ===== */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: { ar: "إجمالي المنشورات", en: "Total Posts" }, value: posts.length, change: "+3 this week", icon: FileText, color: "text-blue-500" },
              { label: { ar: "إجمالي الوصول", en: "Total Reach" }, value: "88.9K", change: "+12.4%", icon: Eye, color: "text-violet-500" },
              { label: { ar: "معدل التفاعل", en: "Engagement Rate" }, value: "4.2%", change: "+0.8%", icon: Heart, color: "text-red-500" },
            ].map((s) => (
              <div key={s.label.en} className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <s.icon size={20} className={s.color} />
                  <span className="text-xs text-[#999999]">{s.label[lang]}</span>
                </div>
                <p className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{s.value}</p>
                <p className="text-xs text-green-500 mt-1">{s.change}</p>
              </div>
            ))}
          </div>

          {/* Platform comparison */}
          <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
            <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-4">{lang === "ar" ? "مقارنة المنصات" : "Platform Comparison"}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#D4D4D4] dark:border-[#333333]">
                    <th className="text-start pb-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المنصة" : "Platform"}</th>
                    <th className="text-end pb-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المنشورات" : "Posts"}</th>
                    <th className="text-end pb-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الوصول" : "Reach"}</th>
                    <th className="text-end pb-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "التفاعل" : "Engagement"}</th>
                    <th className="text-end pb-3 font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الأداء" : "Performance"}</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((p) => (
                    <tr key={p.id} className="border-b border-[#D4D4D4]/50 dark:border-[#333333]/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <p.icon size={14} className={p.color} />
                          <span className="font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-end py-3 text-[#666666]">{p.stats.posts}</td>
                      <td className="text-end py-3 text-[#666666]">{p.stats.reach}</td>
                      <td className="text-end py-3 text-[#666666]">{p.stats.engagement}</td>
                      <td className="text-end py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 bg-[#E8E8E8] dark:bg-[#333333]">
                            <div className="h-full bg-[#0D0D0D] dark:bg-[#F2F2F2]" style={{ width: Math.random() * 60 + 40 + "%" }} />
                          </div>
                          <span className="text-[10px] font-medium text-green-500">+{Math.floor(Math.random() * 20 + 5)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-lg bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "منشور جديد" : "New Post"}</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2]"><Plus size={18} className="rotate-45" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "المنصة" : "Platform"}</label>
                <div className="flex gap-2">
                  {platforms.map((p) => (
                    <button key={p.id} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                      <p.icon size={14} className={p.color} /> {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "العنوان" : "Title"}</label>
                <input className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none" placeholder={lang === "ar" ? "عنوان المنشور" : "Post title"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "التاريخ" : "Date"}</label>
                  <input type="date" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "الوقت" : "Time"}</label>
                  <input type="time" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "نوع المحتوى" : "Content Type"}</label>
                <div className="flex gap-2">
                  {["image", "video", "carousel", "text"].map((t) => (
                    <button key={t} className="px-3 py-1.5 text-[10px] font-medium border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] flex items-center gap-1">
                      {typeIcon(t)} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 h-11 border border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button className="flex-1 h-11 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold">
                  {lang === "ar" ? "جدولة" : "Schedule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
