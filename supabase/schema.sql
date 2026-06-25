-- Monest Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  store_id    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Meetings
CREATE TABLE meetings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  room_code   TEXT UNIQUE NOT NULL,
  organizer   TEXT NOT NULL DEFAULT '',
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time  TEXT NOT NULL DEFAULT '',
  password    TEXT NOT NULL DEFAULT '',
  duration    INT NOT NULL DEFAULT 0,
  attendees   INT NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  host_joined BOOLEAN DEFAULT false,
  ended       BOOLEAN DEFAULT false,
  recording   BOOLEAN DEFAULT false,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meetings"
  ON meetings FOR SELECT USING (true);

CREATE POLICY "Admins can insert meetings"
  ON meetings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update meetings"
  ON meetings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Meeting participants
CREATE TABLE meeting_participants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'attendee' CHECK (role IN ('admin', 'attendee')),
  joined_at   TIMESTAMPTZ DEFAULT now(),
  duration    TEXT DEFAULT '',
  user_id     UUID REFERENCES profiles(id)
);

ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view participants"
  ON meeting_participants FOR SELECT USING (true);

-- 4. Recordings
CREATE TABLE recordings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  title_ar    TEXT NOT NULL DEFAULT '',
  title_en    TEXT NOT NULL DEFAULT '',
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  duration    TEXT NOT NULL DEFAULT '',
  size        TEXT NOT NULL DEFAULT '',
  url         TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recordings"
  ON recordings FOR SELECT USING (true);

-- 5. Chat / Community messages
CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender      TEXT NOT NULL DEFAULT '',
  sender_name TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL DEFAULT '',
  channel     TEXT NOT NULL DEFAULT 'general',
  timestamp   TIMESTAMPTZ DEFAULT now(),
  user_id     UUID REFERENCES profiles(id)
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT USING (true);

CREATE POLICY "Users can insert their own messages"
  ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Community contacts
CREATE TABLE community_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  avatar_url  TEXT DEFAULT '',
  status      TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away')),
  last_seen   TIMESTAMPTZ DEFAULT now(),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contacts"
  ON community_contacts FOR SELECT USING (true);

-- 7. Invoices
CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no    TEXT UNIQUE NOT NULL,
  user_id       UUID REFERENCES profiles(id),
  plan_key      TEXT NOT NULL,
  amount        DECIMAL(10,2) NOT NULL,
  vat_percent   DECIMAL(5,2) NOT NULL DEFAULT 15,
  vat_amount    DECIMAL(10,2) NOT NULL,
  total         DECIMAL(10,2) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  tax_number    TEXT NOT NULL DEFAULT '310123456700003',
  paid_at       TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT USING (auth.uid() = user_id);

-- 8. API keys
CREATE TABLE api_keys (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  key_hash    TEXT NOT NULL,
  last_used   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  revoked     BOOLEAN DEFAULT false
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE USING (auth.uid() = user_id);

-- 9. User sessions (login history)
CREATE TABLE login_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip          TEXT DEFAULT '',
  device      TEXT DEFAULT '',
  location    TEXT DEFAULT '',
  success     BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own login history"
  ON login_history FOR SELECT USING (auth.uid() = user_id);

-- 10. Active sessions
CREATE TABLE active_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device        TEXT DEFAULT '',
  browser       TEXT DEFAULT '',
  location      TEXT DEFAULT '',
  ip            TEXT DEFAULT '',
  is_current    BOOLEAN DEFAULT false,
  last_active   TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON active_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON active_sessions FOR DELETE USING (auth.uid() = user_id);

-- 11. Store connections (Salla)
CREATE TABLE store_connections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_name  TEXT NOT NULL,
  domain      TEXT DEFAULT '',
  salla_token TEXT DEFAULT '',
  connected   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE store_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stores"
  ON store_connections FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own stores"
  ON store_connections FOR ALL USING (auth.uid() = user_id);

-- 12. User subscriptions
CREATE TABLE subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_key      TEXT NOT NULL,
  plan_type     TEXT NOT NULL CHECK (plan_type IN ('subscription', 'lifetime')),
  price         DECIMAL(10,2) NOT NULL,
  period        TEXT NOT NULL DEFAULT 'month',
  start_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date      DATE,
  auto_renew    BOOLEAN DEFAULT true,
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 13. User permissions
CREATE TABLE user_permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission  TEXT NOT NULL,
  enabled     BOOLEAN DEFAULT false,
  CONSTRAINT unique_user_permission UNIQUE (user_id, permission)
);

ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions"
  ON user_permissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own permissions"
  ON user_permissions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own permissions"
  ON user_permissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 14. Dashboard settings
CREATE TABLE dashboard_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme         TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  direction     TEXT DEFAULT 'rtl' CHECK (direction IN ('rtl', 'ltr')),
  primary_color TEXT DEFAULT '#0D0D0D',
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dashboard_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON dashboard_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON dashboard_settings FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
