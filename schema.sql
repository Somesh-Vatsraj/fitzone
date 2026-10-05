-- ============================================
-- FitZone Gym - Cloudflare D1 Schema
-- Tables only. NO DEFAULT DATA.
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_admin ON sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  gym_name TEXT DEFAULT '',
  logo_text TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  opening_hours TEXT DEFAULT '',
  footer_text TEXT DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO site_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS home_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hero_badge TEXT DEFAULT '',
  hero_heading TEXT DEFAULT '',
  hero_description TEXT DEFAULT '',
  hero_button_text TEXT DEFAULT '',
  hero_button_link TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  about_heading TEXT DEFAULT '',
  about_description TEXT DEFAULT '',
  about_image_url TEXT DEFAULT '',
  cta_heading TEXT DEFAULT '',
  cta_description TEXT DEFAULT '',
  cta_button_text TEXT DEFAULT '',
  cta_button_link TEXT DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO home_content (id) VALUES (1);

CREATE TABLE IF NOT EXISTS gym_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS membership_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  duration TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS membership_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  membership_id INTEGER NOT NULL,
  feature TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (membership_id) REFERENCES membership_plans(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_mf_membership ON membership_features(membership_id);

CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  specialization TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  contact_number TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workout_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sets TEXT DEFAULT '',
  reps TEXT DEFAULT '',
  difficulty TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_workouts_category ON workouts(category);

CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  heading TEXT DEFAULT '',
  description TEXT DEFAULT '',
  mission TEXT DEFAULT '',
  vision TEXT DEFAULT '',
  story TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO about_content (id) VALUES (1);

CREATE TABLE IF NOT EXISTS about_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feature TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages(is_read);

CREATE TABLE IF NOT EXISTS social_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT UNIQUE NOT NULL,
  url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT UNIQUE NOT NULL,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  keywords TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  twitter_title TEXT DEFAULT '',
  twitter_description TEXT DEFAULT '',
  twitter_image TEXT DEFAULT '',
  robots TEXT DEFAULT 'index,follow',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER,
  action TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
