DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS messages;

CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  data       TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE plans (
  id       TEXT PRIMARY KEY,
  name     TEXT    NOT NULL,
  amount   INTEGER NOT NULL,
  duration TEXT    NOT NULL,
  features TEXT    NOT NULL DEFAULT '[]',
  popular  INTEGER NOT NULL DEFAULT 0,
  enabled  INTEGER NOT NULL DEFAULT 1,
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE trainers (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience     TEXT NOT NULL,
  phone          TEXT,
  email          TEXT,
  image          TEXT,
  sort           INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE workouts (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  sets        INTEGER NOT NULL DEFAULT 3,
  reps        TEXT NOT NULL,
  difficulty  TEXT NOT NULL,
  description TEXT,
  image       TEXT,
  sort        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE members (
  id     TEXT PRIMARY KEY,
  name   TEXT NOT NULL,
  plan   TEXT,
  joined TEXT,
  status TEXT DEFAULT 'Active'
);

CREATE TABLE messages (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  message    TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_workouts_category ON workouts(category);
CREATE INDEX idx_plans_sort        ON plans(sort);
CREATE INDEX idx_messages_created  ON messages(created_at);

-- ============ SEED DATA ============

INSERT INTO settings (key, data, updated_at) VALUES
('site', '{"siteName":"FITZONE","tagline":"Train Hard. Live Strong.","footerText":"FitZone is a modern strength & conditioning studio built for people who refuse to settle. Train smart, recover well, repeat.","aboutTitle":"MORE THAN A GYM. A MOVEMENT.","aboutText":"Founded in 2013, FitZone started as a single-room strength club and grew into one of the city’s most trusted fitness destinations. We combine certified coaching, science-backed programming and a community that shows up every single day. Whether you want to lose fat, build muscle or simply feel better in your own skin — there is a place for you here."}', datetime('now')),
('contact', '{"phone":"+91 98765 43210","whatsapp":"+91 98765 43210","paytm":"+91 98765 43210","email":"hello@fitzone.com","address":"2nd Floor, FitZone Tower, MG Road, Bengaluru, Karnataka 560001","hours":"Mon – Sat: 5:00 AM – 10:00 PM | Sunday: 6:00 AM – 8:00 PM"}', datetime('now')),
('home', '{"heroBadge":"#1 Rated Strength Studio in the City","heroHeading":"BUILD YOUR BEST VERSION","heroDescription":"Elite coaches. Science-backed programming. A community that pushes you further than you thought possible. Your strongest self is already in there — let’s bring it out.","heroImage":"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80","ctaText":"Join Now","ctaTitle":"READY TO START YOUR TRANSFORMATION?","ctaDescription":"Walk in for a free trial session, meet a coach, and feel the FitZone difference for yourself. No pressure, no contracts on day one.","stats":[{"id":"st1","value":"5000+","label":"Active Members"},{"id":"st2","value":"25+","label":"Expert Trainers"},{"id":"st3","value":"120+","label":"Workouts"},{"id":"st4","value":"12+","label":"Years Experience"}]}', datetime('now'));

INSERT INTO plans (id, name, amount, duration, features, popular, enabled, sort) VALUES
('p1','Basic',999,'1 Month','["Full gym floor access","Locker & shower facility","1 group class per week","Free fitness assessment"]',0,1,1),
('p2','Standard',2499,'3 Months','["Everything in Basic","Unlimited group classes","Personalised diet plan","Monthly body composition analysis","2 personal training sessions"]',1,1,2),
('p3','Premium',4999,'6 Months','["Everything in Standard","Unlimited personal training","Sauna & steam access","Supplement consultation","Priority class booking","Free FitZone merch kit"]',0,1,3);

INSERT INTO trainers (id, name, specialization, experience, phone, email, image, sort) VALUES
('t1','Rahul Verma','Strength & Conditioning','10 Years','+91 98765 43211','rahul@fitzone.com','https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',1),
('t2','Ananya Sharma','Fat Loss & Nutrition','7 Years','+91 98765 43212','ananya@fitzone.com','https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80',2),
('t3','Karan Malhotra','Bodybuilding & Hypertrophy','12 Years','+91 98765 43213','karan@fitzone.com','https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&w=800&q=80',3),
('t4','Priya Nair','Yoga & Mobility','9 Years','+91 98765 43214','priya@fitzone.com','https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',4),
('t5','Arjun Desai','Functional Training & HIIT','6 Years','+91 98765 43215','arjun@fitzone.com','https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',5),
('t6','Meera Iyer','Cardio & Endurance','8 Years','+91 98765 43216','meera@fitzone.com','https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80',6);

INSERT INTO workouts (id, name, category, sets, reps, difficulty, description, image, sort) VALUES
('w1','Barbell Bench Press','Chest',4,'8 – 10','Intermediate','The king of upper-body pressing movements. Builds raw chest, shoulder and triceps strength with progressive overload.','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',1),
('w2','Incline Dumbbell Press','Chest',4,'10 – 12','Beginner','Targets the upper chest with a deeper stretch. Great for building a fuller, more balanced chest.','https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',2),
('w3','Cable Chest Fly','Chest',3,'12 – 15','Beginner','Constant-tension isolation for the pecs. Perfect finisher after heavy pressing work.','https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',3),
('w4','Deadlift','Back',5,'5','Advanced','Full posterior-chain power builder. Develops the entire back, glutes, hamstrings and grip.','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',4),
('w5','Lat Pulldown','Back',4,'10 – 12','Beginner','Builds width in the lats with a controlled vertical pull. Ideal for beginners learning back engagement.','https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80',5),
('w6','Barbell Row','Back',4,'8 – 10','Intermediate','A mass-building horizontal pull that thickens the mid-back and improves posture.','https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',6),
('w7','Back Squat','Legs',5,'6 – 8','Intermediate','The ultimate lower-body compound. Builds quads, glutes and total-body strength.','https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',7),
('w8','Romanian Deadlift','Legs',4,'10','Intermediate','Hip-hinge movement that hammers the hamstrings and glutes while improving flexibility.','https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',8),
('w9','Walking Lunges','Legs',3,'20 steps','Beginner','Single-leg strength and balance work that fires up the glutes and quads.','https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',9),
('w10','Overhead Barbell Press','Shoulders',4,'8','Intermediate','Builds strong, capped shoulders and a rock-solid core through strict vertical pressing.','https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=800&q=80',10),
('w11','Lateral Raise','Shoulders',4,'12 – 15','Beginner','Isolation movement for the side delts — the key to a wider-looking physique.','https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&q=80',11),
('w12','Barbell Curl','Arms',4,'10 – 12','Beginner','Classic biceps builder. Focus on controlled tempo and a full stretch at the bottom.','https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=800&q=80',12),
('w13','Triceps Rope Pushdown','Arms',3,'12 – 15','Beginner','Cable isolation for the triceps with constant tension throughout the range of motion.','https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=800&q=80',13),
('w14','Treadmill HIIT Intervals','Cardio',8,'30s on / 60s off','Intermediate','High-intensity intervals that torch calories and improve VO2 max in minimal time.','https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',14),
('w15','Rowing Machine Sprints','Cardio',6,'250 m','Advanced','Full-body conditioning with zero joint impact. Excellent for building engine and endurance.','https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?auto=format&fit=crop&w=800&q=80',15),
('w16','Hanging Leg Raise','Abs',4,'12 – 15','Advanced','Advanced core movement that builds the lower abs and grip strength simultaneously.','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',16),
('w17','Plank','Abs',3,'60 seconds','Beginner','Isometric core stability builder. Perfect foundation for every other lift you do.','https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',17),
('w18','Cable Woodchopper','Abs',3,'15 each side','Intermediate','Rotational core work that strengthens the obliques and improves athletic power transfer.','https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80',18);

INSERT INTO members (id, name, plan, joined, status) VALUES
('m1','Arjun Mehta','Premium','02 Nov 2024','Active'),
('m2','Sneha Kapoor','Standard','14 Nov 2024','Active'),
('m3','Rohit Bansal','Basic','21 Nov 2024','Active'),
('m4','Divya Rao','Premium','03 Dec 2024','Active'),
('m5','Imran Sheikh','Standard','09 Dec 2024','Paused'),
('m6','Neha Joshi','Basic','18 Dec 2024','Active');
