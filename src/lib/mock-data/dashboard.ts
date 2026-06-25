export interface DashboardStat {
  label: { ar: string; en: string }
  value: number
  prefix?: string
  suffix?: string
  change: number
  changeLabel?: string
}

export interface SaleDay {
  day: string
  sales: number
  orders: number
}

export interface Product {
  id: string
  name: { ar: string; en: string }
  price: number
  cost: number
  sales: number
  views: number
  stock: number
  category: string
  aiSuggestion: { ar: string; en: string; type: "raise" | "lower" | "bundle" | "promote" | "discontinue" }
}

export interface CustomerSegment {
  label: { ar: string; en: string }
  count: number
  percentage: number
  trend: "up" | "down" | "stable"
}

export interface MarketingPlatform {
  name: string
  icon: string
  costPerAcquisition: number
  roas: number
  conversionRate: number
  spend: number
  revenue: number
}

export interface InventoryItem {
  id: string
  name: { ar: string; en: string }
  stock: number
  dailySales: number
  daysUntilOut: number | null
  daysStagnant: number | null
  status: "normal" | "warning" | "critical" | "stagnant"
}

export interface Campaign {
  name: string
  platform: string
  spend: number
  revenue: number
  roas: number
  status: "active" | "paused" | "ended"
}

export interface ExecutiveSummary {
  daily: { ar: string; en: string }
  weekly: { ar: string; en: string }
  monthly: { ar: string; en: string }
  yearly: { ar: string; en: string }
}

const stats: DashboardStat[] = [
  { label: { ar: "إجمالي المبيعات", en: "Total Sales" }, value: 284750, prefix: "", suffix: "ر.س", change: 23 },
  { label: { ar: "إجمالي الطلبات", en: "Total Orders" }, value: 1842, change: 18 },
  { label: { ar: "إجمالي العملاء", en: "Total Customers" }, value: 1256, change: 12 },
  { label: { ar: "متوسط قيمة الطلب", en: "Avg Order Value" }, value: 154, prefix: "", suffix: "ر.س", change: 4 },
  { label: { ar: "معدل التحويل", en: "Conversion Rate" }, value: 3.2, suffix: "%", change: 0.5 },
  { label: { ar: "صافي الأرباح", en: "Net Profit" }, value: 85425, prefix: "", suffix: "ر.س", change: 31 },
  { label: { ar: "الإيرادات الشهرية", en: "Monthly Revenue" }, value: 142375, prefix: "", suffix: "ر.س", change: 15 },
  { label: { ar: "الإيرادات السنوية", en: "Yearly Revenue" }, value: 1708500, prefix: "", suffix: "ر.س", change: 28 },
]

function generateSalesDays(): SaleDay[] {
  const days: SaleDay[] = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date("2026-06-24")
    d.setDate(d.getDate() - i)
    const dayStr = d.toLocaleDateString("en-CA")
    days.push({ day: dayStr, sales: Math.floor(Math.random() * 15000) + 3000, orders: Math.floor(Math.random() * 80) + 20 })
  }
  const peak = Math.floor(Math.random() * days.length)
  days[peak].sales = 28500
  days[peak].orders = 156
  return days
}

const products: Product[] = [
  { id: "p-001", name: { ar: "سماعات بلوتوث لاسلكية", en: "Wireless Bluetooth Earbuds" }, price: 299, cost: 120, sales: 847, views: 12500, stock: 340, category: "إلكترونيات", aiSuggestion: { ar: "رفع السعر 10% — الطلب مرتفع", en: "Raise price 10% — high demand", type: "raise" } },
  { id: "p-002", name: { ar: "حافظة جوال ذكية", en: "Smart Phone Case" }, price: 89, cost: 35, sales: 623, views: 8900, stock: 520, category: "إكسسوارات", aiSuggestion: { ar: "إنشاء عرض Buy 2 Get 1", en: "Create Buy 2 Get 1 offer", type: "promote" } },
  { id: "p-003", name: { ar: "ساعة رياضية ذكية", en: "Smart Sports Watch" }, price: 599, cost: 250, sales: 412, views: 7200, stock: 85, category: "إلكترونيات", aiSuggestion: { ar: "تنبيه: المخزون منخفض — زِد الكمية", en: "Alert: Low stock — restock soon", type: "promote" } },
  { id: "p-004", name: { ar: "شاحن متنقل 20000mAh", en: "Power Bank 20000mAh" }, price: 149, cost: 65, sales: 1024, views: 15800, stock: 210, category: "إلكترونيات", aiSuggestion: { ar: "الأكثر مبيعاً — حافظ على السعر", en: "Best seller — maintain price", type: "promote" } },
  { id: "p-005", name: { ar: "حقيبة ظهر عازلة للماء", en: "Waterproof Backpack" }, price: 249, cost: 110, sales: 198, views: 5600, stock: 45, category: "حقائب", aiSuggestion: { ar: "تخفيض السعر 15% — المبيعات ضعيفة", en: "Lower price 15% — low sales", type: "lower" } },
  { id: "p-006", name: { ar: "مصباح مكتب LED", en: "LED Desk Lamp" }, price: 179, cost: 70, sales: 267, views: 4300, stock: 130, category: "منزل", aiSuggestion: { ar: "اقتراح: دمج مع سماعات بلوتوث كعرض", en: "Suggestion: bundle with earbuds", type: "bundle" } },
  { id: "p-007", name: { ar: "ماوس لاسلكي", en: "Wireless Mouse" }, price: 129, cost: 50, sales: 534, views: 9800, stock: 380, category: "إلكترونيات", aiSuggestion: { ar: "إنشاء عرض مع لوحة مفاتيح", en: "Create bundle with keyboard", type: "bundle" } },
  { id: "p-008", name: { ar: "لوحة مفاتيح ميكانيكية", en: "Mechanical Keyboard" }, price: 399, cost: 180, sales: 156, views: 4100, stock: 25, category: "إلكترونيات", aiSuggestion: { ar: "إيقاف — مبيعات منخفضة ومخزون شبه منتهي", en: "Discontinue — low sales, near zero stock", type: "discontinue" } },
  { id: "p-009", name: { ar: "قارئ كتب إلكتروني", en: "E-Book Reader" }, price: 899, cost: 400, sales: 89, views: 2900, stock: 60, category: "إلكترونيات", aiSuggestion: { ar: "تخفيض السعر 20% لزيادة المبيعات", en: "Lower price 20% to boost sales", type: "lower" } },
  { id: "p-010", name: { ar: "سماعة أذن طبية", en: "Medical Earphone" }, price: 449, cost: 200, sales: 178, views: 3800, stock: 90, category: "صحة", aiSuggestion: { ar: "استهداف إعلاني لفئة المهتمين بالصحة", en: "Target health-conscious audience", type: "promote" } },
  { id: "p-011", name: { ar: "كاميرا مراقبة منزلية", en: "Home Security Camera" }, price: 349, cost: 150, sales: 234, views: 6200, stock: 75, category: "إلكترونيات", aiSuggestion: { ar: "رفع السعر 8% — موسم الطلب مرتفع", en: "Raise price 8% — peak season", type: "raise" } },
  { id: "p-012", name: { ar: "سجادة يوجا", en: "Yoga Mat" }, price: 99, cost: 35, sales: 412, views: 7800, stock: 200, category: "رياضة", aiSuggestion: { ar: "إنشاء عرض Buy 1 Get 1", en: "Create Buy 1 Get 1 offer", type: "promote" } },
  { id: "p-013", name: { ar: "مكبر صوت محمول", en: "Portable Speaker" }, price: 259, cost: 110, sales: 198, views: 5100, stock: 65, category: "إلكترونيات", aiSuggestion: { ar: "تجميع مع شاحن متنقل كعرض", en: "Bundle with power bank", type: "bundle" } },
  { id: "p-014", name: { ar: "نظارة واقع افتراضي", en: "VR Headset" }, price: 1299, cost: 600, sales: 45, views: 1800, stock: 30, category: "إلكترونيات", aiSuggestion: { ar: "إيقاف — مبيعات منخفضة جداً", en: "Discontinue — very low sales", type: "discontinue" } },
  { id: "p-015", name: { ar: "قلم ذكي للرسم", en: "Smart Drawing Pen" }, price: 199, cost: 80, sales: 312, views: 6400, stock: 140, category: "إلكترونيات", aiSuggestion: { ar: "استهداف فئة المصممين بإعلانات", en: "Target designers with ads", type: "promote" } },
]

const customerSegments: CustomerSegment[] = [
  { label: { ar: "جدد", en: "New" }, count: 312, percentage: 25, trend: "up" },
  { label: { ar: "دائمون", en: "Regular" }, count: 478, percentage: 38, trend: "up" },
  { label: { ar: "VIP", en: "VIP" }, count: 124, percentage: 10, trend: "stable" },
  { label: { ar: "خاملون", en: "Inactive" }, count: 215, percentage: 17, trend: "down" },
  { label: { ar: "متوقع خسارتهم", en: "At Risk" }, count: 127, percentage: 10, trend: "up" },
]

const marketingPlatforms: MarketingPlatform[] = [
  { name: "Google Ads", icon: "G", costPerAcquisition: 45, roas: 3.2, conversionRate: 2.8, spend: 28500, revenue: 91200 },
  { name: "Meta Ads", icon: "M", costPerAcquisition: 38, roas: 4.1, conversionRate: 3.5, spend: 34200, revenue: 140220 },
  { name: "TikTok Ads", icon: "T", costPerAcquisition: 29, roas: 2.6, conversionRate: 1.9, spend: 18000, revenue: 46800 },
]

const inventoryItems: InventoryItem[] = [
  { id: "p-003", name: { ar: "ساعة رياضية ذكية", en: "Smart Sports Watch" }, stock: 85, dailySales: 6, daysUntilOut: 14, daysStagnant: null, status: "warning" },
  { id: "p-005", name: { ar: "حقيبة ظهر عازلة للماء", en: "Waterproof Backpack" }, stock: 45, dailySales: 1.5, daysUntilOut: 30, daysStagnant: null, status: "normal" },
  { id: "p-008", name: { ar: "لوحة مفاتيح ميكانيكية", en: "Mechanical Keyboard" }, stock: 25, dailySales: 0.8, daysUntilOut: 31, daysStagnant: 45, status: "stagnant" },
  { id: "p-004", name: { ar: "شاحن متنقل 20000mAh", en: "Power Bank 20000mAh" }, stock: 210, dailySales: 12, daysUntilOut: 18, daysStagnant: null, status: "warning" },
  { id: "p-014", name: { ar: "نظارة واقع افتراضي", en: "VR Headset" }, stock: 30, dailySales: 0.4, daysUntilOut: 75, daysStagnant: 90, status: "critical" },
  { id: "p-001", name: { ar: "سماعات بلوتوث لاسلكية", en: "Wireless Bluetooth Earbuds" }, stock: 340, dailySales: 14, daysUntilOut: 24, daysStagnant: null, status: "warning" },
  { id: "p-011", name: { ar: "كاميرا مراقبة منزلية", en: "Home Security Camera" }, stock: 75, dailySales: 5, daysUntilOut: 15, daysStagnant: null, status: "warning" },
  { id: "p-012", name: { ar: "سجادة يوجا", en: "Yoga Mat" }, stock: 200, dailySales: 8, daysUntilOut: 25, daysStagnant: null, status: "normal" },
]

const profitBreakdown = {
  revenue: 284750,
  costOfGoods: 128137,
  grossProfit: 156613,
  expenses: 51288,
  taxes: 14238,
  fees: 5662,
  netProfit: 85425,
}

const executiveSummaries: Record<string, ExecutiveSummary> = {
  general: {
    daily: { ar: "مبيعات اليوم: 12,450 ر.س بزيادة 8% عن أمس. سماعات البلوتوث تصدرت المبيعات بـ 45 وحدة. أفضل وقت للإعلانات 10-11 صباحاً.", en: "Today's sales: 12,450 SAR, up 8% from yesterday. Bluetooth earbuds top sales at 45 units. Best ad time: 10-11 AM." },
    weekly: { ar: "مبيعات الأسبوع: 87,200 ر.س بزيادة 15% عن الأسبوع الماضي. منتج الشاحن المتنقل الأكثر مبيعاً (+22%). متوسط قيمة الطلب ارتفع 5%.", en: "Weekly sales: 87,200 SAR, up 15% from last week. Power bank is the best seller (+22%). Avg order value up 5%." },
    monthly: { ar: "مبيعات الشهر: 142,375 ر.س بزيادة 23% عن الشهر الماضي. إجمالي الطلبات 1,842. عملاء جدد: 312. معدل التحويل 3.2%. الأرباح الصافية 85,425 ر.س.", en: "Monthly sales: 142,375 SAR, up 23% from last month. Total orders: 1,842. New customers: 312. Conversion rate: 3.2%. Net profit: 85,425 SAR." },
    yearly: { ar: "مبيعات السنة: 1,708,500 ر.س بزيادة 31% عن السنة الماضية. إجمالي العملاء: 1,256. أفضل ربع كان Q2 بمبيعات 512,000 ر.س.", en: "Yearly sales: 1,708,500 SAR, up 31% from last year. Total customers: 1,256. Best quarter: Q2 with 512,000 SAR in sales." },
  },
  low: {
    daily: { ar: "مبيعات اليوم منخفضة: 4,230 ر.س (35% أقل من الأمس). يُنصح بتفعيل عرض خصم سريع.", en: "Today's sales low: 4,230 SAR (35% below yesterday). Consider activating a flash discount." },
    weekly: { ar: "أسبوع ضعيف: 52,000 ر.س فقط. انخفاض ملحوظ في مبيعات الإكسسوارات (-18%). يوصى بحملة إعلانية.", en: "Weak week: only 52,000 SAR. Notable decline in accessory sales (-18%). Ad campaign recommended." },
    monthly: { ar: "تراجع شهري: 98,000 ر.س (انخفاض 12%). 3 منتجات بحاجة لإعادة تسعير. العملاء الخاملون ارتفعوا إلى 215.", en: "Monthly decline: 98,000 SAR (down 12%). 3 products need repricing. Inactive customers rose to 215." },
    yearly: { ar: "تحديات سنوية: النمو تباطأ إلى 8% فقط. مصاريف التشغيل ارتفعت 15%. يُوصى بمراجعة هيكل التكاليف.", en: "Yearly challenges: Growth slowed to only 8%. Operating expenses up 15%. Cost structure review recommended." },
  },
  high: {
    daily: { ar: "مبيعات اليوم استثنائية: 28,500 ر.س — أعلى يوم هذا الشهر! الشاحن المتنقل حقق 156 طلباً.", en: "Exceptional sales today: 28,500 SAR — highest day this month! Power bank achieved 156 orders." },
    weekly: { ar: "أسبوع قياسي: 124,000 ر.س بزيادة 42%. 4 منتجات نفدت من المخزون. يُوصى بتعويض المخزون فوراً.", en: "Record week: 124,000 SAR, up 42%. 4 products out of stock. Restock immediately recommended." },
    monthly: { ar: "شهر استثنائي: 195,000 ر.س (+37% عن المستهدف). جميع المؤشرات إيجابية. أفضل شهر في تاريخ المتجر.", en: "Exceptional month: 195,000 SAR (+37% above target). All indicators positive. Best month in store history." },
    yearly: { ar: "عام استثنائي: 2,100,000 ر.س (+45% عن الماضي). قاعدة العملاء تضاعفت. التوسع لأسواق جديدة موصى به.", en: "Exceptional year: 2,100,000 SAR (+45% vs last year). Customer base doubled. Expansion to new markets recommended." },
  },
}

const aiChatResponses: Record<string, { ar: string; en: string }> = {
  "لماذا انخفضت مبيعاتي": { ar: "حسب تحليل البيانات، المبيعات انخفضت 12% هذا الشهر مقارنة بالشهر الماضي. الأسباب المحتملة: 1) تراجع مبيعات الإكسسوارات بنسبة 18%  2) 3 منتجات بحاجة لإعادة تسعير  3) زيادة العملاء الخاملين إلى 215. التوصية: تفعيل حملة إعلانية مركزة على Google Ads وميتا، وتقديم عرض خصم 15% على المنتجات الراكدة.", en: "Based on data analysis, sales dropped 12% this month vs last month. Possible causes: 1) Accessory sales declined 18% 2) 3 products need repricing 3) Inactive customers rose to 215. Recommendation: Launch targeted Google Ads & Meta campaign, offer 15% discount on stagnant products." },
  "ما هو أفضل وقت للإعلانات": { ar: "أفضل وقت للإعلانات وفقاً لبياناتك هو بين الساعة 10 صباحاً و 12 ظهراً، ومرة أخرى بين 8 و 10 مساءً. هذه الأوقات سجلت أعلى معدلات تحويل (4.2% و 3.8% على التوالي). يوم الجمعة من الساعة 2-4 عصراً هو أيضاً وقت ممتاز. أقل الأوقات فعالية: 2-5 صباحاً.", en: "Best ad times based on your data: 10 AM - 12 PM, and again 8-10 PM. These slots recorded highest conversion rates (4.2% and 3.8% respectively). Friday 2-4 PM is also excellent. Least effective: 2-5 AM." },
  "كيف أحسن معدل التحويل": { ar: "معدل التحويل الحالي 3.2% — جيد لكنه قابل للتحسين. الاقتراحات: 1) تحسين سرعة الموقع — الصفحات البطيئة تفقد 40% من الزوار  2) إضافة تقييمات العملاء على صفحات المنتج  3) تبسيط عملية الدفع — كل خطوة إضافية تقلل التحويل 10%  4) استخدام إعلانات إعادة الاستهداف للزوار الذين تركوا عرباتهم.", en: "Current conversion rate 3.2% — good but improvable. Suggestions: 1) Improve site speed — slow pages lose 40% of visitors 2) Add customer reviews on product pages 3) Simplify checkout — each extra step reduces conversion by 10% 4) Use retargeting ads for cart abandoners." },
  "أي المنتجات يجب أن أوقف": { ar: "بناءً على تحليل AI، المنتجَان اللذان يوصى بإيقافهما: 1) نظارة واقع افتراضي (VR Headset) — مبيعات 45 فقط بمتوسط 0.4 وحدة/يوم، مخزون راكد 90 يوماً  2) لوحة مفاتيح ميكانيكية — مبيعات منخفضة (156) ومخزون شبه منتهٍ. البديل: تركيز الجهود على سماعات البلوتوث والشاحن المتنقل الأعلى مبيعاً.", en: "Based on AI analysis, products recommended for discontinuation: 1) VR Headset — only 45 sales, 0.4 units/day, stagnant 90 days 2) Mechanical Keyboard — low sales (156), near zero stock. Alternative: Focus efforts on best-selling earbuds and power bank." },
  "من هم أفضل 5 عملاء": { ar: "أفضل 5 عملاء حسب إجمالي المشتريات: 1) محمد العبدالله — 28,450 ر.س  2) سارة الحربي — 24,800 ر.س  3) عبدالرحمن القحطاني — 22,150 ر.س  4) نورة الشمري — 19,600 ر.س  5) فيصل الدوسري — 17,300 ر.س. إجمالي مشتريات هؤلاء العملاء يمثل 22% من إجمالي المبيعات. يُوصى بإرسال عروض VIP خاصة لهم.", en: "Top 5 customers by total purchases: 1) Mohammed Al-Abdullah — 28,450 SAR 2) Sara Al-Harbi — 24,800 SAR 3) Abdulrahman Al-Qahtani — 22,150 SAR 4) Noura Al-Shammari — 19,600 SAR 5) Faisal Al-Dosari — 17,300 SAR. These top customers represent 22% of total sales. VIP offers recommended." },
  "أرسل حملة تسويقية": { ar: "تم إنشاء حملة مقترحة: الهدف — استهداف العملاء الخاملين (215 عميل) بعرض \"عودتك مكسب\" خصم 20% على أول طلب. القناة المقترحة: واتساب + إيميل. الميزانية المقترحة: 2,500 ر.س. العائد المتوقع: 15,000 - 22,000 ر.س (ROAS 6-9x). هل توافق على إطلاق الحملة؟", en: "Campaign proposal created: Target inactive customers (215 customer) with 'Welcome Back' 20% discount on first order. Channels: WhatsApp + Email. Budget: 2,500 SAR. Expected return: 15,000-22,000 SAR (ROAS 6-9x). Approve campaign launch?" },
  "default": { ar: "شكراً لسؤالك. يقوم AI بتحليل بيانات متجرك. للإجابة الدقيقة، يرجى توضيح: هل تقصد المبيعات، العملاء، المنتجات، أو الحملات التسويقية؟ يمكنني تقديم تحليل مفصل لأي مجال.", en: "Thank you for your question. AI is analyzing your store data. For a precise answer, please specify: sales, customers, products, or marketing campaigns? I can provide detailed analysis for any area." },
}

const permissions = [
  { key: "customers", label: { ar: "إدارة العملاء", en: "Customer Management" }, description: { ar: "الوصول إلى بيانات العملاء وإدارتها", en: "Access and manage customer data" } },
  { key: "orders", label: { ar: "إدارة الطلبات", en: "Order Management" }, description: { ar: "عرض وإدارة جميع الطلبات", en: "View and manage all orders" } },
  { key: "carts", label: { ar: "إدارة السلات", en: "Cart Management" }, description: { ar: "الوصول إلى سلات التسوق", en: "Access shopping carts" } },
  { key: "branches", label: { ar: "إدارة الفروع", en: "Branch Management" }, description: { ar: "إدارة فروع المتجر", en: "Manage store branches" } },
  { key: "products", label: { ar: "إدارة المنتجات", en: "Product Management" }, description: { ar: "إضافة وتعديل وحذف المنتجات", en: "Add, edit and delete products" } },
  { key: "webhooks", label: { ar: "Webhooks", en: "Webhooks" }, description: { ar: "إدارة نقاط الاتصال الخارجية", en: "Manage external webhook endpoints" } },
  { key: "payments", label: { ar: "إدارة المدفوعات", en: "Payment Management" }, description: { ar: "إدارة طرق الدفع والمعاملات", en: "Manage payment methods and transactions" } },
  { key: "taxes", label: { ar: "إدارة الضرائب", en: "Tax Management" }, description: { ar: "إعدادات الضرائب", en: "Tax configuration settings" } },
  { key: "shipping", label: { ar: "إدارة الشحن", en: "Shipping Management" }, description: { ar: "إعدادات الشحن والتوصيل", en: "Shipping and delivery settings" } },
  { key: "marketing", label: { ar: "إدارة التسويق", en: "Marketing Management" }, description: { ar: "الوصول إلى أدوات التسويق", en: "Access marketing tools" } },
  { key: "reports", label: { ar: "التقارير", en: "Reports" }, description: { ar: "عرض جميع التقارير", en: "View all reports" } },
  { key: "analytics", label: { ar: "التحليلات", en: "Analytics" }, description: { ar: "الوصول إلى لوحة التحليلات", en: "Access analytics dashboard" } },
  { key: "coupons", label: { ar: "القسائم والخصومات", en: "Coupons & Discounts" }, description: { ar: "إدارة القسائم والخصومات", en: "Manage coupons and discounts" } },
  { key: "reviews", label: { ar: "التقييمات", en: "Reviews" }, description: { ar: "إدارة تقييمات المنتجات", en: "Manage product reviews" } },
]

const bestCampaigns: Campaign[] = [
  { name: "خصم الصيف 20%", platform: "Meta Ads", spend: 8500, revenue: 42500, roas: 5.0, status: "active" },
  { name: "توصيل مجاني", platform: "Google Ads", spend: 6000, revenue: 27000, roas: 4.5, status: "active" },
  { name: "عرض اليوم الوطني", platform: "TikTok Ads", spend: 4000, revenue: 16800, roas: 4.2, status: "ended" },
]

const worstCampaigns: Campaign[] = [
  { name: "إعلان المنتجات الجديدة", platform: "Google Ads", spend: 12000, revenue: 15600, roas: 1.3, status: "ended" },
  { name: "حملة المؤثرين", platform: "Meta Ads", spend: 15000, revenue: 18000, roas: 1.2, status: "paused" },
  { name: "إعلان فيديو طويل", platform: "TikTok Ads", spend: 5000, revenue: 3500, roas: 0.7, status: "paused" },
]

export { stats as dashboardStats, generateSalesDays, products, customerSegments, marketingPlatforms, inventoryItems, profitBreakdown, executiveSummaries, aiChatResponses, permissions, bestCampaigns, worstCampaigns }

