-- Monest Seed Data
-- Run this after schema.sql to populate initial data

-- 1. Sample meetings
INSERT INTO meetings (title_ar, title_en, room_code, organizer, date, start_time, duration, attendees, status, description_ar, description_en, host_joined, recording)
VALUES
  ('مراجعة أداء الربع الثاني', 'Q2 Performance Review', 'aB3xK9mZ', 'أحمد السالم', '2026-06-20', '10:00', 47, 8, 'completed', 'مناقشة أداء الفريق للربع الثاني', 'Team Q2 performance discussion', false, true),
  ('تخطيط استراتيجية المنتج', 'Product Strategy Planning', 'X7pQ2wRn', 'سارة الحربي', '2026-06-25', '14:30', 62, 0, 'scheduled', 'مناقشة خارطة طريق المنتج للربع القادم', 'Next quarter product roadmap discussion', true, false),
  ('عرض تقدم المشروع', 'Project Progress Demo', 'tR8vF5cE', 'فهد العتيبي', '2026-06-26', '16:00', 35, 0, 'scheduled', 'عرض تقدم مشروع العميل الجديد', 'New client project progress demo', false, false),
  ('اجتماع الفريق الأسبوعي', 'Weekly Team Sync', 'wK9mN2xP', 'أحمد السالم', '2026-06-27', '09:00', 30, 0, 'scheduled', 'اجتماع الفريق الأسبوعي', 'Weekly team sync meeting', false, false),
  ('مقابلة عميل محتمل', 'Prospective Client Call', 'vF5cE3rT', 'نورة الدوسري', '2026-06-28', '11:00', 45, 0, 'scheduled', 'مقابلة عميل محتمل', 'Prospective client meeting', false, false);

-- 2. Sample invoices (for the plan page)
INSERT INTO invoices (invoice_no, plan_key, amount, vat_percent, vat_amount, total, status, tax_number)
VALUES
  ('INV-2026-001', 'سنوي', 2499.00, 15, 374.85, 2873.85, 'paid', '310123456700003'),
  ('INV-2026-002', '6 أشهر', 1499.00, 15, 224.85, 1723.85, 'paid', '310123456700003');

-- 3. Sample chat messages
INSERT INTO chat_messages (sender, sender_name, message, channel)
VALUES
  ('system', 'النظام', 'أهلاً بكم في مجتمع Monest 👋', 'general'),
  ('user1', 'أحمد السالم', 'مرحباً بالجميع', 'general'),
  ('user2', 'سارة الحربي', 'أهلاً أحمد، كيف الاجتماع؟', 'general');

-- 4. Sample community contacts
INSERT INTO community_contacts (name, phone, status)
VALUES
  ('المجموعة العامة', '+966501234567', 'online'),
  ('أحمد السالم', '+966551234567', 'online'),
  ('سارة الحربي', '+966531234567', 'away'),
  ('فهد العتيبي', '+966541234567', 'online'),
  ('نورة الدوسري', '+966561234567', 'offline'),
  ('خالد المطيري', '+966571234567', 'online'),
  ('منى الشمري', '+966581234567', 'away'),
  ('سعود القحطاني', '+966591234567', 'offline'),
  ('هند الزهراني', '+966502345678', 'online'),
  ('محمد العبدالله', '+966552345678', 'offline');

-- IMPORTANT: user_permissions requires a valid user_id.
-- After creating users in Supabase Auth, run:
-- INSERT INTO user_permissions (user_id, permission, enabled)
-- SELECT id, k, true FROM auth.users CROSS JOIN (VALUES
--   ('customers'), ('orders'), ('carts'), ('branches'), ('products'),
--   ('webhooks'), ('payments'), ('taxes'), ('shipping'), ('marketing'),
--   ('reports'), ('analytics'), ('coupons'), ('reviews')
-- ) AS p(k)
-- WHERE NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = auth.users.id AND permission = p.k);
