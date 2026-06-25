import type { TourStep } from "./guided-tour"

export const landingTourSteps: TourStep[] = [
  {
    targetId: "tour-feature-meetings",
    title: { ar: "اجتماعات فورية", en: "Instant Meetings" },
    content: {
      ar: "أنشئ اجتماع فيديو فوري بدون تسجيل.只需 إدخال رقم الهاتف وشارك الرابط مع الآخرين للانضمام فوراً.",
      en: "Create instant video meetings with no registration. Just enter your phone and share the link for others to join immediately.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-feature-community",
    title: { ar: "مجتمع تجار حقيقي", en: "Real Merchant Community" },
    content: {
      ar: "انضم إلى مجتمع حصري من رواد الأعمال والتجار في السعودية. تبادل الخبرات، احصل على دعم حقيقي، وابنِ علاقات تجارية قيّمة.",
      en: "Join an exclusive community of entrepreneurs and merchants in Saudi Arabia. Exchange expertise, get real support, and build valuable business relationships.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-feature-ai-monitoring",
    title: { ar: "متابعة المتجر بالذكاء الاصطناعي", en: "AI Store Monitoring" },
    content: {
      ar: "اربط متجرك بـ Salla وتابع أداءه بالذكاء الاصطناعي — تحليلات متقدمة، توصيات ذكية، وتقارير أداء — كل ذلك ضمن عضويتك في Monest.",
      en: "Connect your Salla store and get AI-powered performance monitoring — advanced analytics, smart recommendations, and performance reports — all within your Monest membership.",
    },
    position: "bottom",
  },
]

export const meetingsTourSteps: TourStep[] = [
  {
    targetId: "tour-meetings-create",
    title: { ar: "إنشاء اجتماع", en: "Create Meeting" },
    content: {
      ar: "أدخل رقم هاتفك لإنشاء غرفة اجتماع فورية. سيتم إنشاء رابط يمكنك مشاركته مع أي شخص للانضمام.",
      en: "Enter your phone number to create an instant meeting room. A shareable link will be generated for others to join.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-meetings-join",
    title: { ar: "الانضمام برابط", en: "Join by Link" },
    content: {
      ar: "أدخل رمز الاجتماع المكون من 8 أحرف للانضمام إلى غرفة موجودة مسبقاً.",
      en: "Enter the 8-character meeting code to join an existing room created by someone else.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-meetings-recent",
    title: { ar: "آخر الاجتماعات", en: "Recent Meetings" },
    content: {
      ar: "سجل بآخر الاجتماعات التي أجريتها. يمكنك مراجعة التفاصيل والتواريخ والمدة لكل اجتماع.",
      en: "Your recent meetings history. Review details, dates, and duration of past meetings.",
    },
    position: "top",
  },
]

export const crmTourSteps: TourStep[] = [
  {
    targetId: "tour-crm-stats",
    title: { ar: "إحصائيات سريعة", en: "Quick Stats" },
    content: {
      ar: "نظرة سريعة على إجمالي العملاء، التسجيل الناقص، المكتملين، ومعدل التحويل.",
      en: "A quick overview of total customers, incomplete registrations, completed ones, and conversion rate.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-crm-stage-chart",
    title: { ar: "توزيع العملاء", en: "Customer Distribution" },
    content: {
      ar: "رسم بياني يوضح توزيع العملاء حسب مرحلة التسجيل. يمكنك معرفة أين يتوقف معظم العملاء.",
      en: "A chart showing customer distribution by registration stage. See where most customers drop off.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-crm-recent",
    title: { ar: "آخر العملاء", en: "Recent Leads" },
    content: {
      ar: "قائمة بأحدث العملاء المسجلين. يمكنك الضغط على عرض الكل لإدارة كل العملاء وتفعيل ميزة \"أكمل من نفس المكان\".",
      en: "List of the most recent leads. Click View All to manage all customers and use the 'Complete from same place' feature.",
    },
    position: "top",
  },
]

export const dashboardTourSteps: TourStep[] = [
  {
    targetId: "tour-dashboard-stats",
    title: { ar: "مؤشرات الأداء", en: "Performance KPIs" },
    content: {
      ar: "8 مؤشرات أداء رئيسية لمتجرك: الإيرادات، الطلبات، العملاء الجدد، والمزيد. كل مؤشر يعرض التغير مقارنة بالشهر الماضي.",
      en: "8 key performance indicators for your store: revenue, orders, new customers, and more. Each shows change vs last month.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-dashboard-chart",
    title: { ar: "الرسوم البيانية", en: "Charts & Products" },
    content: {
      ar: "مخطط المبيعات لآخر 30 يوم والمنتجات الأعلى مبيعاً. حلل الاتجاهات وحدد أفضل المنتجات أداءً.",
      en: "30-day sales chart and top-selling products. Analyze trends and identify your best performers.",
    },
    position: "bottom",
  },
  {
    targetId: "tour-dashboard-insights",
    title: { ar: "الرؤى الذكية", en: "Smart Insights" },
    content: {
      ar: "المنتجات الراكدة، أفضل العملاء، والعملاء المهددين بالمغادرة. رؤى مدعومة بالذكاء الاصطناعي لاتخاذ قرارات أسرع.",
      en: "Stagnant products, best customers, and at-risk customers. AI-powered insights for faster decision-making.",
    },
    position: "top",
  },
  {
    targetId: "tour-dashboard-ai-chat",
    title: { ar: "المساعد الذكي AI", en: "AI Chat Assistant" },
    content: {
      ar: "تحدث مع مساعد Monest الذكي. اطرح أسئلة مثل \"كيف أحسن مبيعاتي؟\" أو \"حلل أداء المتجر\" واحصل على إجابات فورية.",
      en: "Chat with the Monest AI assistant. Ask questions like 'How can I improve sales?' or 'Analyze store performance' for instant answers.",
    },
    position: "left",
  },
]
