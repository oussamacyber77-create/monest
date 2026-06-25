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
  { key: "lifetime", label: { ar: "الباقات الدائمة", en: "Lifetime (Best)" } },
]

export const pricingPlans: Record<PricingPlanType, PricingPlan[]> = {
  subscription: [
    {
      key: "شهري",
      price: 79,
      period: "month",
      type: "subscription",
      desc: { ar: "عضوية شهرية مرنة — يمكن الإلغاء في أي وقت", en: "Flexible monthly membership — cancel anytime" },
      features: {
        ar: ["عضوية المجتمع", "اجتماعات أسبوعية", "متابعة المتجر", "دعم عبر البريد"],
        en: ["Community membership", "Weekly meetings", "Store monitoring", "Email support"],
      },
    },
    {
      key: "3 أشهر",
      price: 199,
      period: "quarter",
      type: "subscription",
      desc: { ar: "عضوية 3 أشهر — وفّر 11%", en: "3-month membership — save 11%" },
      features: {
        ar: ["كل ميزات الشهرية", "اجتماعات فردية", "دعم واتساب", "متابعة متقدمة للمتجر", "توصيات ذكية"],
        en: ["All monthly features", "Individual meetings", "WhatsApp support", "Advanced store monitoring", "Smart recommendations"],
      },
    },
    {
      key: "6 أشهر",
      price: 399,
      period: "semi",
      type: "subscription",
      desc: { ar: "عضوية 6 أشهر — وفّر 16%", en: "6-month membership — save 16%" },
      features: {
        ar: ["كل ميزات 3 أشهر", "جلسات توجيه شخصي", "دعم فوري", "تحليلات متقدمة", "تقارير المخزون", "توصيات تسويقية"],
        en: ["All 3-month features", "Personal coaching", "Priority support", "Advanced analytics", "Inventory reports", "Marketing recommendations"],
      },
    },
    {
      key: "سنوي",
      price: 699,
      period: "year",
      type: "subscription",
      badge: { ar: "الأفضل قيمة", en: "Best Value" },
      desc: { ar: "عضوية سنوية — وفّر 30% (الأفضل قيمة)", en: "Annual membership — save 30% (best value)" },
      features: {
        ar: ["كل ميزات 6 أشهر", "لقاءات حصرية", "مدرب شخصي", "متابعة شاملة", "توقعات ذكية", "تقارير تنفيذية", "تدريب للفريق"],
        en: ["All 6-month features", "Exclusive gatherings", "Personal coach", "Full monitoring", "Smart forecasts", "Executive reports", "Team training"],
      },
    },
  ],
  lifetime: [
    {
<<<<<<< HEAD
      key: "دوام أساسي",
      price: 1299,
      originalPrice: 2599,
=======
      key: "الباقة الأساسية الدائمة",
      price: 4999,
      originalPrice: 9999,
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
      period: "lifetime",
      type: "lifetime",
      desc: { ar: "عضوية مدى الحياة — الباقة الأساسية", en: "Lifetime membership — basic plan" },
      features: {
        ar: ["جميع ميزات السنوية", "عضوية مدى الحياة", "دعم أولوية VIP", "خصم 50% عن السعر الأصلي"],
        en: ["All annual features", "Lifetime membership", "VIP priority support", "50% off original price"],
      },
    },
    {
<<<<<<< HEAD
      key: "دوام كامل",
      price: 2499,
      originalPrice: 4999,
=======
      key: "الباقة الكاملة الدائمة",
      price: 9999,
      originalPrice: 19999,
>>>>>>> e27e9d3d4d737f3fa8d7df5493b213e1fb709893
      period: "lifetime",
      type: "lifetime",
      badge: { ar: "الأكثر طلباً", en: "Most Popular" },
      desc: { ar: "عضوية مدى الحياة — كل الميزات بلا حدود", en: "Lifetime membership — everything unlimited" },
      features: {
        ar: ["جميع ميزات دوام أساسي", "استشارات أسبوعية", "تدريب مخصص للفريق", "اجتماعات حصرية", "أولوية الميزات الجديدة", "دعم شخصي مخصص"],
        en: ["All basic lifetime features", "Weekly consultations", "Custom team training", "Exclusive meetings", "Early access to new features", "Dedicated support"],
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
