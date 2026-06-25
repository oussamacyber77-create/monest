"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"
import { User, Bell, Shield, CreditCard, Store, Lock, Globe, Moon, Sun, Languages, Save, Check, AlertTriangle, LogOut, Eye, EyeOff, Smartphone, Mail, Key, Wifi, Clock } from "lucide-react"
import { getSallaAuthUrl } from "@/lib/salla/config"
import { SARIcon } from "@/components/ui/sar-icon"

export default function SettingsPage() {
  const { direction, theme, toggleDirection, toggleTheme } = useSettingsStore()
  const router = useRouter()
  const lang = direction === "rtl" ? "ar" : "en"

  const [activeSection, setActiveSection] = useState("store")
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    storeName: "متجر الإلكترونيات",
    email: "owner@example.com",
    phone: "+966 55 123 4567",
    currency: "SAR",
    language: "ar",
    notifications: { email: true, sms: false, browser: true },
    currentPassword: "",
    newPassword: "",
  })

  const triggerSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { id: "store", label: { ar: "المتجر", en: "Store" }, icon: Store },
    { id: "profile", label: { ar: "الملف الشخصي", en: "Profile" }, icon: User },
    { id: "security", label: { ar: "الأمان", en: "Security" }, icon: Lock },
    { id: "notifications", label: { ar: "الإشعارات", en: "Notifications" }, icon: Bell },
    { id: "payment", label: { ar: "طرق الدفع", en: "Payment" }, icon: CreditCard },
    { id: "appearance", label: { ar: "المظهر", en: "Appearance" }, icon: Sun },
  ]

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">
              {lang === "ar" ? "الإعدادات" : "Settings"}
            </h1>
            <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">
              {lang === "ar" ? "إدارة إعدادات حسابك ومتجرك" : "Manage your account and store settings"}
            </p>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5">
              <Check size={14} /> {lang === "ar" ? "تم الحفظ" : "Saved"}
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="md:col-span-1 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={"w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors text-start " + (activeSection === s.id ? "bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10 text-[#0D0D0D] dark:text-[#F2F2F2] border-e-2 border-e-[#0D0D0D] dark:border-e-[#F2F2F2]" : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A]")}
              >
                <s.icon size={16} />
                {s.label[lang]}
              </button>
            ))}
            <hr className="my-2 border-[#D4D4D4] dark:border-[#333333]" />
            <button
              onClick={() => router.push("/dashboard/settings/permissions")}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-colors text-start"
            >
              <Shield size={16} />
              {lang === "ar" ? "الصلاحيات" : "Permissions"}
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-5">

            {/* === STORE === */}
            {activeSection === "store" && (
              <>
                <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Store size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                    <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "بيانات المتجر" : "Store Information"}</h2>
                  </div>
                  <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-4">{lang === "ar" ? "البيانات الأساسية لمتجرك المرتبط" : "Your connected store basic info"}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "اسم المتجر" : "Store Name"}</label>
                      <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "رقم الجوال" : "Phone Number"}</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                    </div>
                  </div>
                  <button onClick={triggerSaved} className="mt-4 h-10 px-6 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <Save size={14} /> {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
                  </button>
                </div>

                {/* Salla Connection */}
                <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] flex items-center gap-2">
                        <Store size={16} /> {lang === "ar" ? "ربط متجر سلة" : "Salla Store Connection"}
                      </h3>
                      <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mt-1">{lang === "ar" ? "اربط متجرك بسلة للاستفادة من التحليلات" : "Connect your Salla store for analytics"}</p>
                    </div>
                    <a href={getSallaAuthUrl()} target="_blank" rel="noopener noreferrer" className="h-10 px-4 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                      <Store size={14} /> {lang === "ar" ? "ربط" : "Connect"}
                    </a>
                  </div>
                </div>

                {/* Currency */}
                <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                  <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3">{lang === "ar" ? "العملة" : "Currency"}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg"><SARIcon className="w-6 h-6" /></span>
                    <span className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الريال السعودي (SAR)" : "Saudi Riyal (SAR)"}</span>
                  </div>
                </div>
              </>
            )}

            {/* === PROFILE === */}
            {activeSection === "profile" && (
              <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الملف الشخصي" : "Profile"}</h2>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-4">{lang === "ar" ? "معلومات حسابك الشخصي" : "Your personal account info"}</p>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] flex items-center justify-center text-xl font-bold">أ</div>
                  <div>
                    <p className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "أحمد السالم" : "Ahmed Al-Salem"}</p>
                    <p className="text-xs text-[#666666] dark:text-[#B3B3B3]">ahmed@example.com</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                    <input defaultValue="أحمد السالم" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">البريد الإلكتروني / Email</label>
                    <input defaultValue="ahmed@example.com" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                  </div>
                  <button onClick={triggerSaved} className="h-10 px-6 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <Save size={14} /> {lang === "ar" ? "حفظ" : "Save"}
                  </button>
                </div>
              </div>
            )}

            {/* === SECURITY === */}
            {activeSection === "security" && (
              <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الأمان" : "Security"}</h2>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-4">{lang === "ar" ? "تغيير كلمة المرور وإعدادات الأمان" : "Change password and security settings"}</p>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute end-2 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2]">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1.5 block">{lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}</label>
                    <input type="password" placeholder={lang === "ar" ? "أدخل كلمة مرور جديدة" : "Enter new password"} className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder:text-[#999999] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2] transition-colors" />
                  </div>
                  <button onClick={triggerSaved} className="h-10 px-6 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <Key size={14} /> {lang === "ar" ? "تحديث كلمة المرور" : "Update Password"}
                  </button>
                </div>
                <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  {lang === "ar" ? "نوصي بتغيير كلمة المرور كل 3 أشهر للحفاظ على أمان حسابك." : "We recommend changing your password every 3 months to keep your account secure."}
                </div>
              </div>
            )}

            {/* === NOTIFICATIONS === */}
            {activeSection === "notifications" && (
              <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "الإشعارات" : "Notifications"}</h2>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-4">{lang === "ar" ? "تحكم في كيفية تلقي الإشعارات" : "Control how you receive notifications"}</p>
                <div className="space-y-3">
                  {[
                    { key: "email", label: { ar: "الإشعارات عبر البريد الإلكتروني", en: "Email Notifications" }, desc: { ar: "استلام التقارير والتنبيهات على بريدك", en: "Receive reports and alerts via email" }, icon: Mail },
                    { key: "sms", label: { ar: "رسائل SMS", en: "SMS Notifications" }, desc: { ar: "تنبيهات الطلبات الجديدة والمهمة", en: "New order and important alerts via SMS" }, icon: Smartphone },
                    { key: "browser", label: { ar: "إشعارات المتصفح", en: "Browser Notifications" }, desc: { ar: "إشعارات فورية أثناء التصفح", en: "Instant notifications while browsing" }, icon: Wifi },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between p-3 bg-[#F2F2F2] dark:bg-[#1A1A1A]">
                      <div className="flex items-center gap-3">
                        <n.icon size={16} className="text-[#666666] dark:text-[#999999]" />
                        <div>
                          <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">{n.label[lang]}</p>
                          <p className="text-[10px] text-[#999999]">{n.desc[lang]}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setForm({ ...form, notifications: { ...form.notifications, [n.key]: !(form.notifications as any)[n.key] } })}
                        className={"w-10 h-5 rounded-full transition-colors relative " + ((form.notifications as any)[n.key] ? "bg-[#0D0D0D] dark:bg-[#F2F2F2]" : "bg-[#D4D4D4] dark:bg-[#333333]")}
                      >
                        <span className={"absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all " + ((form.notifications as any)[n.key] ? "start-[22px]" : "start-0.5")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === PAYMENT === */}
            {activeSection === "payment" && (
              <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                  <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "طرق الدفع" : "Payment Methods"}</h2>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-4">{lang === "ar" ? "إدارة طرق الدفع المرتبطة بحسابك" : "Manage payment methods linked to your account"}</p>
                <div className="space-y-3">
                  {[
                    { type: "visa", last4: "4242", expiry: "12/27", brand: "Visa" },
                    { type: "mada", last4: "9876", expiry: "08/26", brand: "Mada" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-[#D4D4D4] dark:border-[#333333]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-[#0D0D0D] dark:bg-[#F2F2F2] flex items-center justify-center text-[8px] font-bold text-[#F2F2F2] dark:text-[#0D0D0D]">{c.brand}</div>
                        <div>
                          <p className="text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]">•••• {c.last4}</p>
                          <p className="text-[10px] text-[#999999]">{lang === "ar" ? "تنتهي" : "Expires"}: {c.expiry}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-green-600">{lang === "ar" ? "افتراضي" : "Default"}</span>
                    </div>
                  ))}
                  <button className="w-full h-10 border border-dashed border-[#D4D4D4] dark:border-[#333333] text-xs font-medium text-[#999999] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors flex items-center justify-center gap-1.5">
                    <CreditCard size={14} /> {lang === "ar" ? "إضافة بطاقة جديدة" : "Add New Card"}
                  </button>
                </div>
              </div>
            )}

            {/* === APPEARANCE === */}
            {activeSection === "appearance" && (
              <>
                <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun size={16} className="text-[#0D0D0D] dark:text-[#F2F2F2]" />
                    <h2 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{lang === "ar" ? "المظهر واللغة" : "Appearance & Language"}</h2>
                  </div>
                  <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-4">{lang === "ar" ? "تخصيص طريقة عرض المنصة" : "Customize how the platform looks"}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-[#D4D4D4] dark:border-[#333333]">
                      <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5"><Moon size={14} /> {lang === "ar" ? "الوضع" : "Theme"}</p>
                      <div className="flex gap-2">
                        <button onClick={toggleTheme} className={"flex-1 py-3 text-xs font-medium border transition-all " + (theme === "light" ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10" : "border-[#D4D4D4] dark:border-[#333333]")}>
                          <Sun size={16} className="mx-auto mb-1" />
                          {lang === "ar" ? "فاتح" : "Light"}
                        </button>
                        <button onClick={toggleTheme} className={"flex-1 py-3 text-xs font-medium border transition-all " + (theme === "dark" ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10" : "border-[#D4D4D4] dark:border-[#333333]")}>
                          <Moon size={16} className="mx-auto mb-1" />
                          {lang === "ar" ? "داكن" : "Dark"}
                        </button>
                      </div>
                    </div>
                    <div className="p-4 border border-[#D4D4D4] dark:border-[#333333]">
                      <p className="text-xs font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-3 flex items-center gap-1.5"><Globe size={14} /> {lang === "ar" ? "اللغة" : "Language"}</p>
                      <div className="flex gap-2">
                        <button onClick={toggleDirection} className={"flex-1 py-3 text-xs font-medium border transition-all " + (direction === "rtl" ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10" : "border-[#D4D4D4] dark:border-[#333333]")}>
                          <Languages size={16} className="mx-auto mb-1" />
                          العربية
                        </button>
                        <button onClick={toggleDirection} className={"flex-1 py-3 text-xs font-medium border transition-all " + (direction === "ltr" ? "border-[#0D0D0D] dark:border-[#F2F2F2] bg-[#0D0D0D]/5 dark:bg-[#F2F2F2]/10" : "border-[#D4D4D4] dark:border-[#333333]")}>
                          <Languages size={16} className="mx-auto mb-1" />
                          English
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timezone */}
                <div className="border border-[#D4D4D4] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] p-5">
                  <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1 flex items-center gap-1.5"><Clock size={14} /> {lang === "ar" ? "المنطقة الزمنية" : "Timezone"}</h3>
                  <p className="text-xs text-[#666666] dark:text-[#B3B3B3] mb-3">{lang === "ar" ? "توقيت الرياض (UTC+3)" : "Riyadh Time (UTC+3)"}</p>
                  <select className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] outline-none">
                    <option value="riyadh">(UTC+3) الرياض، جدة، مكة</option>
                    <option value="dubai">(UTC+4) دبي، أبوظبي</option>
                    <option value="cairo">(UTC+2) القاهرة</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
