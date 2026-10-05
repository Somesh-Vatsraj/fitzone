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



-- ============================================================
-- FitZone Gym — OPTIONAL SAMPLE DATA (for testing only)
-- ============================================================
-- Run ONLY if you want to see the site populated with example content.
-- Safe to run any time. Safe to delete rows any time.
-- To clear all sample data, run the DELETE section at the bottom.
-- ============================================================

-- ---------- Site Settings ----------
UPDATE site_settings SET
  gym_name      = 'FitZone Gym & Fitness',
  logo_text     = 'FitZone',
  phone         = '+91 98765 43210',
  whatsapp      = '+91 98765 43210',
  email         = 'hello@fitzonegym.com',
  address       = '42 Iron Street, Fitness District, Mumbai 400001',
  opening_hours = 'Mon–Sat: 6:00 AM – 10:00 PM  |  Sun: 7:00 AM – 8:00 PM',
  footer_text   = 'Transform your body. Transform your life. Join FitZone today.'
WHERE id = 1;

-- ---------- Home Content ----------
UPDATE home_content SET
  hero_badge          = 'FITNESS • STRENGTH • DISCIPLINE',
  hero_heading        = 'Build Your Best Version',
  hero_description    = 'Train with expert coaches, world-class equipment, and a community that pushes you further every single day.',
  hero_button_text    = 'Explore Membership',
  hero_button_link    = '/membership',
  hero_image_url      = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
  about_heading       = 'More Than a Gym',
  about_description   = 'FitZone is a fitness community built on sweat, discipline, and results. From beginners to athletes, we help every member reach their peak.',
  about_image_url     = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=80',
  cta_heading         = 'Ready to Start Your Transformation?',
  cta_description     = 'Join hundreds of members who changed their lives at FitZone.',
  cta_button_text     = 'View Plans',
  cta_button_link     = '/membership'
WHERE id = 1;

-- ---------- Gym Statistics ----------
DELETE FROM gym_stats;
INSERT INTO gym_stats (label, value, icon, sort_order, status) VALUES
  ('Active Members',   '500+',  '💪', 1, 'active'),
  ('Expert Trainers',  '10+',   '🏋️', 2, 'active'),
  ('Weekly Workouts',  '80+',   '🔥', 3, 'active'),
  ('Years of Trust',   '8+',    '⭐', 4, 'active');

-- ---------- Features ----------
DELETE FROM features;
INSERT INTO features (title, description, icon, sort_order, status) VALUES
  ('Expert Trainers',       'Certified coaches with years of real-world training experience.',       '🧑‍🏫', 1, 'active'),
  ('Modern Equipment',      'State-of-the-art machines and free weights for every training style.', '🏋️', 2, 'active'),
  ('Personalized Plans',    'Custom workout and nutrition plans built around your goals.',          '📋', 3, 'active'),
  ('Flexible Memberships',  'Choose from monthly, quarterly, and yearly plans that fit your life.', '📅', 4, 'active');

-- ---------- Membership Plans ----------
DELETE FROM membership_features;
DELETE FROM membership_plans;

INSERT INTO membership_plans (name, amount, duration, description, status, sort_order) VALUES
  ('Basic',   999,  '1 Month',   'Perfect for getting started.',       'active', 1),
  ('Pro',     2499, '3 Months',  'Most popular for consistent progress.', 'active', 2),
  ('Elite',   7999, '12 Months', 'Best value for long-term commitment.', 'active', 3);

-- Basic plan features (id = last inserted 'Basic')
INSERT INTO membership_features (membership_id, feature, sort_order)
SELECT id, 'Gym floor access', 1 FROM membership_plans WHERE name = 'Basic'
UNION ALL SELECT id, 'Locker room access', 2 FROM membership_plans WHERE name = 'Basic'
UNION ALL SELECT id, '1 group class / week', 3 FROM membership_plans WHERE name = 'Basic';

-- Pro plan features
INSERT INTO membership_features (membership_id, feature, sort_order)
SELECT id, 'Everything in Basic', 1 FROM membership_plans WHERE name = 'Pro'
UNION ALL SELECT id, 'Unlimited group classes', 2 FROM membership_plans WHERE name = 'Pro'
UNION ALL SELECT id, '1 personal training / month', 3 FROM membership_plans WHERE name = 'Pro'
UNION ALL SELECT id, 'Diet consultation', 4 FROM membership_plans WHERE name = 'Pro';

-- Elite plan features
INSERT INTO membership_features (membership_id, feature, sort_order)
SELECT id, 'Everything in Pro', 1 FROM membership_plans WHERE name = 'Elite'
UNION ALL SELECT id, 'Unlimited personal training', 2 FROM membership_plans WHERE name = 'Elite'
UNION ALL SELECT id, 'Custom diet plan', 3 FROM membership_plans WHERE name = 'Elite'
UNION ALL SELECT id, 'Priority booking', 4 FROM membership_plans WHERE name = 'Elite'
UNION ALL SELECT id, 'Guest passes (2 / month)', 5 FROM membership_plans WHERE name = 'Elite';

-- ---------- Trainers ----------
DELETE FROM trainers;
INSERT INTO trainers (name, image_url, specialization, experience, bio, contact_number, status, sort_order) VALUES
  ('Arjun Mehta',  'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80', 'Strength & Conditioning', '8 years', 'Former national powerlifter turned strength coach.', '+91 90000 11111', 'active', 1),
  ('Priya Sharma', 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80', 'Yoga & Mobility',           '6 years', 'Certified yoga instructor focused on flexibility and posture.', '+91 90000 22222', 'active', 2),
  ('Rahul Verma',  'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80', 'HIIT & Functional Training', '7 years', 'High-energy coach specializing in fat loss and endurance.', '+91 90000 33333', 'active', 3);

-- ---------- Workout Categories ----------
DELETE FROM workout_categories;
INSERT INTO workout_categories (name, sort_order) VALUES
  ('Strength', 1),
  ('Cardio',   2),
  ('HIIT',     3),
  ('Yoga',     4);

-- ---------- Workouts ----------
DELETE FROM workouts;
INSERT INTO workouts (name, category, image_url, sets, reps, difficulty, description, status, sort_order) VALUES
  ('Barbell Squat',   'Strength', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', '4', '8–10',  'Intermediate', 'Compound leg exercise for building lower body strength.', 'active', 1),
  ('Bench Press',     'Strength', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80', '4', '8–10',  'Intermediate', 'Classic upper-body pushing movement.',                   'active', 2),
  ('Treadmill Sprint','Cardio',   'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', '6', '30 sec','Beginner',     'Interval sprint training for fat loss and endurance.',    'active', 3),
  ('Burpees',         'HIIT',     'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', '5', '15',    'Intermediate', 'Full-body HIIT exercise.',                               'active', 4),
  ('Sun Salutation',  'Yoga',     'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', '5', '1 flow','Beginner',     'Classic yoga sequence for flexibility.',                 'active', 5),
  ('Deadlift',        'Strength', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80', '4', '5–6',   'Advanced',     'King of all lifts — full posterior chain strength.',      'active', 6);

-- ---------- About ----------
UPDATE about_content SET
  heading     = 'About FitZone Gym',
  description = 'FitZone was founded in 2016 with one mission: make world-class fitness accessible to everyone.',
  mission     = 'To help every member become the strongest, healthiest version of themselves.',
  vision      = 'To be the most trusted fitness community in the region.',
  story       = 'What started as a small 1200 sq.ft. gym has grown into a thriving community of 500+ members. We''ve helped people lose weight, build muscle, recover from injuries, and transform their lives.',
  image_url   = 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1000&q=80'
WHERE id = 1;

DELETE FROM about_features;
INSERT INTO about_features (feature, sort_order) VALUES
  ('Certified trainers',        1),
  ('Modern equipment',          2),
  ('Personal training',         3),
  ('Group classes',             4),
  ('Nutrition guidance',        5),
  ('Flexible memberships',      6);

-- ---------- Social Links ----------
DELETE FROM social_links;
INSERT INTO social_links (platform, url, sort_order) VALUES
  ('instagram', 'https://instagram.com/fitzonegym', 1),
  ('facebook',  'https://facebook.com/fitzonegym',  2),
  ('youtube',   'https://youtube.com/@fitzonegym',  3),
  ('twitter',   '',                                  4),
  ('whatsapp',  '+91 98765 43210',                   5);

-- ---------- SEO ----------
DELETE FROM seo_settings;
INSERT INTO seo_settings (page, title, description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, robots) VALUES
  ('home',       'FitZone Gym & Fitness — Build Your Best Version',   'Transform your body and mind at FitZone Gym. Expert trainers, modern equipment, and flexible membership plans.', 'gym, fitness, workout, personal training', '/',          'FitZone Gym & Fitness', 'Transform your body and mind at FitZone Gym.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'FitZone Gym & Fitness', 'Transform your body and mind at FitZone Gym.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'index,follow'),
  ('workouts',   'Workouts — FitZone Gym & Fitness',                  'Explore our complete library of workouts.',                                                                        'workouts, exercises, gym routines',        '/workouts',  'Workouts — FitZone Gym', 'Explore our complete library of workouts.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'Workouts — FitZone Gym', 'Explore our complete library of workouts.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'index,follow'),
  ('trainers',   'Trainers — FitZone Gym & Fitness',                  'Meet our certified trainers.',                                                                                     'trainers, coaches, fitness experts',       '/trainers',  'Trainers — FitZone Gym', 'Meet our certified trainers.',              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'Trainers — FitZone Gym', 'Meet our certified trainers.',              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'index,follow'),
  ('membership', 'Membership Plans — FitZone Gym & Fitness',          'Choose a membership plan that fits your goals.',                                                                   'membership, gym plans, fitness plans',     '/membership','Membership — FitZone Gym', 'Choose a membership plan.',                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'Membership — FitZone Gym', 'Choose a membership plan.',                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'index,follow'),
  ('about',      'About — FitZone Gym & Fitness',                     'Learn more about FitZone Gym.',                                                                                    'about gym, fitness story',                 '/about',     'About — FitZone Gym', 'Learn more about FitZone Gym.',             'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'About — FitZone Gym', 'Learn more about FitZone Gym.',             'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'index,follow'),
  ('contact',    'Contact — FitZone Gym & Fitness',                   'Get in touch with FitZone Gym.',                                                                                   'contact gym, fitness center',              '/contact',   'Contact — FitZone Gym', 'Get in touch with FitZone Gym.',            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'Contact — FitZone Gym', 'Get in touch with FitZone Gym.',            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 'index,follow');

-- ============================================================
-- DONE. Now refresh the admin dashboard and public website.
-- ============================================================

-- ============================================================
-- 🧹 TO WIPE ALL SAMPLE DATA (keep tables + admin + settings)
-- ============================================================
-- DELETE FROM gym_stats;
-- DELETE FROM features;
-- DELETE FROM membership_features;
-- DELETE FROM membership_plans;
-- DELETE FROM trainers;
-- DELETE FROM workout_categories;
-- DELETE FROM workouts;
-- DELETE FROM about_features;
-- DELETE FROM social_links;
-- DELETE FROM seo_settings;
-- UPDATE home_content SET hero_badge='', hero_heading='', hero_description='', hero_button_text='', hero_button_link='', hero_image_url='', about_heading='', about_description='', about_image_url='', cta_heading='', cta_description='', cta_button_text='', cta_button_link='' WHERE id=1;
-- UPDATE about_content SET heading='', description='', mission='', vision='', story='', image_url='' WHERE id=1;
