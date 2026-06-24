export type PricingPlanType = "subscription" | "lifetime"

export interface PricingPlan {
  key: string
  price: number
  originalPrice?: number
  period: "month" | "quarter" | "semi" | "year" | "lifetime"
  type: PricingPlanType
  badge?: { ar: string; en: string }
  desc: { ar: string; en: string }
  features: { ar: string[]; en: string[] }
}

export const pricingPlanTypes: { key: PricingPlanType; label: { ar: string; en: string } }[] = [
  { key: "subscription", label: { ar: "الاشتراك المتكرر", en: "Subscription" } },
  { key: "lifetime", label: { ar: "الدوام (الأفضل)", en: "Lifetime (Best)" } },
]

export const pricingPlans: Record<PricingPlanType, PricingPlan[]> = {
  subscription: [
    {
      key: "شهري",
      price: 299,
      period: "month",
      type: "subscription",
      desc: { ar: "اشتراك شهري مرن — يمكن الإلغاء في أي وقت", en: "Flexible monthly — cancel anytime" },
      features: {
        ar: ["تحليلات أساسية", "تقرير أسبوعي", "دعم عبر البريد", "ربط متجر واحد"],
        en: ["Basic analytics", "Weekly report", "Email support", "1 store connection"],
      },
    },
    {
      key: "3 أشهر",
      price: 799,
      period: "quarter",
      type: "subscription",
      desc: { ar: "توفير 11% مقارنة بالشهري", en: "Save 11% vs monthly" },
      features: {
        ar: ["كل ميزات الشهري", "تقارير يومية", "دعم عبر البريد والواتساب", "ربط حتى 3 متاجر", "اقتراحات منتجات AI"],
        en: ["All monthly features", "Daily reports", "Email & WhatsApp support", "Up to 3 stores", "AI product suggestions"],
      },
    },
    {
      key: "6 أشهر",
      price: 1499,
      period: "semi",
      type: "subscription",
      desc: { ar: "توفير 16% مقارنة بالشهري", en: "Save 16% vs monthly" },
      features: {
        ar: ["كل ميزات 3 أشهر", "تحليلات متقدمة", "دعم فوري", "ربط حتى 5 متاجر", "حملات AI تسويقية", "تقارير المخزون"],
        en: ["All quarterly features", "Advanced analytics", "Priority support", "Up to 5 stores", "AI marketing campaigns", "Inventory reports"],
      },
    },
    {
      key: "سنوي",
      price: 2499,
      period: "year",
      type: "subscription",
      badge: { ar: "الأفضل قيمة", en: "Best Value" },
      desc: { ar: "توفير 30% — الأفضل قيمة", en: "Save 30% — best value" },
      features: {
        ar: ["كل ميزات 6 أشهر", "لوحة تنفيذية كاملة", "مدير حساب مخصص", "ربط غير محدود", "API مفتوح", "توقعات أرباح AI", "تدريب فريق العمل"],
        en: ["All 6-month features", "Full executive dashboard", "Dedicated account manager", "Unlimited stores", "Open API", "AI profit forecasting", "Team training"],
      },
    },
  ],
  lifetime: [
    {
      key: "دوام أساسي",
      price: 4999,
      originalPrice: 9999,
      period: "lifetime",
      type: "lifetime",
      desc: { ar: "اشتراك مدى الحياة — الباقة الأساسية", en: "Lifetime access — basic plan" },
      features: {
        ar: ["جميع ميزات الباقة السنوية", "تحديثات مدى الحياة", "دعم فريد الأولوية", "خصم 50% عن السعر الأصلي"],
        en: ["All yearly plan features", "Lifetime updates", "VIP priority support", "50% off original price"],
      },
    },
    {
      key: "دوام كامل",
      price: 9999,
      originalPrice: 19999,
      period: "lifetime",
      type: "lifetime",
      badge: { ar: "الأكثر طلباً", en: "Most Popular" },
      desc: { ar: "اشتراك مدى الحياة — كل الميزات بلا حدود", en: "Lifetime access — everything unlimited" },
      features: {
        ar: ["جميع ميزات دوام أساسي", "استشارات أسبوعية", "تدريب مخصص للفريق", "API غير محدود", "تكامل مخصص", "أولوية التحديثات الجديدة"],
        en: ["All basic lifetime features", "Weekly consultations", "Custom team training", "Unlimited API", "Custom integrations", "Early access to new features"],
      },
    },
  ],
}

export function findPlan(key: string): PricingPlan | undefined {
  for (const type of ["subscription", "lifetime"] as PricingPlanType[]) {
    const plan = pricingPlans[type].find((p) => p.key === key)
    if (plan) return plan
  }
  return undefined
}
