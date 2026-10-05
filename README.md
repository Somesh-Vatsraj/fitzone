# 🏋️ FitZone Gym & Fitness
<img width="1280" height="5008" alt="https-fitzone someshsoftwareengineer-233 workers dev-" src="https://github.com/user-attachments/assets/7880200b-e511-4c1e-ac8c-638fd2f0b256" />

A complete, production-ready gym/fitness management website built with **React + Vite** on the frontend and **Cloudflare Workers + Cloudflare D1** on the backend.

Includes a full **public website**, **admin panel**, **REST API**, and **database schema** — all deployable to Cloudflare in minutes.

---

## ✨ Features

### Public Website
- 🏠 Home page with hero, stats, features, workouts, trainers, CTA (all admin-controlled)
- 💪 Workouts page with search + category filter
- 🧑‍🏫 Trainers listing
- 💳 Membership plans with "Join Now" → Contact Modal (Call / WhatsApp)
- ℹ️ About page
- 📞 Contact page with working form (saves to D1)
- 📱 Fully responsive (360px → 1440px)
- 🎨 Modern UI with animations, hover effects, gradient accents

### Admin Panel (`/admin`)
- 🔐 Server-side auth (PBKDF2 hashing, session tokens)
- 📊 Dashboard with real D1 counts (no fake numbers)
- 🏠 Home management (hero, about, CTA, stats, features)
- 💳 Full CRUD for membership plans + features
- 🧑‍🏫 Full CRUD for trainers
- 🏋️ Full CRUD for workouts + workout categories
- ℹ️ About page editor
- ✉️ Contact messages inbox (view / mark read / delete)
- 🔍 Per-page SEO management (title, description, OG, Twitter, robots)
- ⚙️ Website settings (name, logo, phone, WhatsApp, email, address, hours, social links)

### Technical
- 🗄️ Cloudflare D1 (SQLite) — single source of truth
- 🔒 Parameterized SQL queries everywhere (SQL-injection safe)
- 🌐 SEO: meta tags, Open Graph, Twitter Cards, canonical URLs, JSON-LD structured data
- 🤖 `robots.txt` + `sitemap.xml` served by the Worker
- 🚫 Admin routes marked `noindex,nofollow`
- ⚡ Edge-deployed API (zero cold-start cost model)
- 🎯 No default/demo data — clean empty states when DB is empty
- ❌ No payment gateway, no R2, no "Add to Cart" functionality

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite 5, vanilla CSS3 |
| Backend | Cloudflare Workers (ES modules) |
| Database | Cloudflare D1 (SQLite) |
| Auth | PBKDF2 password hashing + opaque session tokens |
| SEO | Meta tags, JSON-LD, sitemap.xml, robots.txt |
| Deployment | Cloudflare Workers with static assets binding |

---

## 📁 Project Structure

```
fitzone-gym/
├── package.json
├── index.html
├── vite.config.js
├── wrangler.toml
├── schema.sql              ← tables only, no data
├── seed.sql                ← OPTIONAL sample data
├── README.md
├── .gitignore
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── WorkoutCard.jsx
│   │   ├── TrainerCard.jsx
│   │   ├── MembershipCard.jsx
│   │   ├── ContactModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── Toast.jsx
│   │   ├── Loading.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Workouts.jsx
│   │   ├── Trainers.jsx
│   │   ├── Membership.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   │
│   ├── admin/
│   │   ├── AdminLogin.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── HomeManagement.jsx
│   │   ├── MembershipManagement.jsx
│   │   ├── TrainerManagement.jsx
│   │   ├── WorkoutManagement.jsx
│   │   ├── AboutManagement.jsx
│   │   ├── ContactManagement.jsx
│   │   ├── SEOManagement.jsx
│   │   └── WebsiteSettings.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │   ├── useApi.js
│   │   └── useAuth.jsx
│   │
│   └── utils/
│       ├── validation.js
│       └── seo.js
│
└── worker/
    ├── index.js
    └── auth.js
```

---

## 🚀 Full Setup Guide

### Prerequisites

- **Node.js 18+** and npm
- A free **Cloudflare account** — https://dash.cloudflare.com/sign-up
- **Wrangler CLI** (installed via `npm install` below)

Verify:
```bash
node -v      # v18.x or higher
npm -v       # v9.x or higher
```

---

### Step 1 — Clone / Create the project

If you already have the files, skip this. Otherwise create the folder and copy all files from this repo.

```bash
cd fitzone-gym
```

---

### Step 2 — Install dependencies

```bash
npm install
```

This installs React, Vite, React Router, and Wrangler.

---

### Step 3 — Create the Cloudflare D1 database

```bash
npx wrangler d1 create fitzone-db
```

Wrangler will output something like:

```
✅ Successfully created DB 'fitzone-db' in region WEUR
[[d1_databases]]
binding = "DB"
database_name = "fitzone-db"
database_id = "abc123def456-xyz-789"
```

**Copy the `database_id`** and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "fitzone-db"
database_id = "abc123def456-xyz-789"   # ← paste your ID here
```

---

### Step 4 — Apply the database schema (local)

Create all tables in your **local** D1 for development:

```bash
npm run db:init:local
```

This runs `schema.sql` — creates tables only. **No data is inserted.**

Expected output: dozens of `🚣 Executed N queries` lines.

---

### Step 5 — Run the project locally

You need **two terminals** running side by side.

#### Terminal 1 — Cloudflare Worker (API + assets on port 8787)

```bash
npx wrangler dev
```

You should see:
```
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

#### Terminal 2 — Vite dev server (frontend on port 5173)

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** → public site loads.
Vite proxies `/api/*`, `/robots.txt`, `/sitemap.xml` → Worker on `:8787`.

---

### Step 6 — Create the first admin account

Visit:

```
http://localhost:5173/admin/login
```

- First visit detects **no admins exist** → shows **"Set Up Admin"** screen
- Enter a username (e.g. `admin`) and password (min 6 chars)
- Confirm password → click **"Create Admin Account"**

You are now logged in and redirected to `/admin`.

> 🔒 Passwords are hashed with **PBKDF2 (100,000 iterations, SHA-256)**. The plaintext is never stored or sent to the browser.

---

### Step 7 — Populate your content

Everything starts empty. From the admin sidebar, fill in:

| Section | What to add |
|---|---|
| ⚙️ Website Settings | Gym name, phone, WhatsApp, email, address, opening hours, social links |
| 🏠 Home | Hero heading, description, button, hero image URL, about text, CTA |
| 🏠 Home → Stats | e.g. "500+ Active Members" |
| 🏠 Home → Features | e.g. "Expert Trainers", "Modern Equipment" |
| 💳 Memberships | Basic / Pro / Elite plans with features |
| 🧑‍🏫 Trainers | Name, photo URL, specialization, bio |
| 🏋️ Workouts | Categories first, then workouts |
| ℹ️ About | Heading, description, mission, vision, story, image |
| 🔍 SEO | Per-page titles, descriptions, OG images |

Changes save to D1 and appear on the public site after reload.

---

### Step 8 — (Optional) Load sample data

If you want a pre-filled demo to explore quickly, run **`seed.sql`**:

```bash
# Local only
npx wrangler d1 execute fitzone-db --local --file=./seed.sql
```

This inserts sample stats, features, 3 membership plans, 3 trainers, 6 workouts, SEO defaults, and social links.

**To wipe it later**, use the DELETE block at the bottom of `seed.sql`, or re-run `schema.sql`.

> ⚠️ `seed.sql` is **never** run automatically. Your production site stays empty until *you* add real data via the admin panel.

---

## ☁️ Deploy to Cloudflare (Production)

### Step 1 — Create production D1 database (if you haven't)

If you already created one in Step 3, skip. Otherwise:

```bash
npx wrangler d1 create fitzone-db
```

Update `wrangler.toml` with the new `database_id`.

### Step 2 — Apply schema to production D1

```bash
npm run db:init
```

This runs `schema.sql` against your **remote** D1. Creates empty tables. No data.

### Step 3 — Configure production settings

Edit `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
ALLOWED_ORIGIN = "https://your-domain.com"   # ← your real domain
```

- `ALLOWED_ORIGIN` restricts CORS to your actual frontend domain
- Leave it as your Cloudflare Workers domain if you don't have a custom domain yet (e.g. `https://fitzone-gym.your-subdomain.workers.dev`)

### Step 4 — Build & deploy

```bash
npm run deploy
```

This runs `vite build` (creates `./dist`) and then `wrangler deploy`. Cloudflare uploads:
- Your compiled React SPA (as static assets)
- Your Worker (serves `/api/*`, `robots.txt`, `sitemap.xml`, and falls through to the SPA)

You'll get a URL like:

```
https://fitzone-gym.your-subdomain.workers.dev
```

### Step 5 — Create production admin

Visit `https://your-url/admin/login` and create the admin account (same as Step 6, but for production D1).

### Step 6 — (Optional) Load production sample data

```bash
npx wrangler d1 execute fitzone-db --remote --file=./seed.sql
```

### Step 7 — (Optional) Custom domain

In Cloudflare dashboard:
- **Workers & Pages** → your worker → **Settings** → **Domains & Routes**
- Add `fitzone.your-domain.com` (must already be in Cloudflare DNS)

Then update `ALLOWED_ORIGIN` in `wrangler.toml` and redeploy.

---

## 📜 Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite frontend dev server (`:5173`) |
| `npx wrangler dev` | Start Cloudflare Worker locally (`:8787`) |
| `npm run build` | Build production React SPA into `./dist` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run db:init` | Apply `schema.sql` to **remote** D1 |
| `npm run db:init:local` | Apply `schema.sql` to **local** D1 |

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### Public (no auth)

| Method | Path | Description |
|---|---|---|
| GET | `/api/site-settings` | Site settings |
| GET | `/api/home` | Home content |
| GET | `/api/stats` | Active gym stats |
| GET | `/api/features` | Active features |
| GET | `/api/memberships` | Active membership plans (with features) |
| GET | `/api/trainers` | Active trainers |
| GET | `/api/workouts` | Active workouts |
| GET | `/api/categories` | Workout categories |
| GET | `/api/about` | About content |
| GET | `/api/social` | Social links |
| GET | `/api/seo?page=home` | SEO for one page (or all if no `page`) |
| POST | `/api/contact` | Submit contact form |

### Auth

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/status` | Is setup required? |
| POST | `/api/auth/setup` | Create first admin (only if none exists) |
| POST | `/api/auth/login` | Login → returns session token |
| GET | `/api/auth/me` | Current admin info |
| POST | `/api/auth/logout` | Destroy session |

### Admin (require `Authorization: Bearer <token>`)

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard counts |
| PUT | `/api/site-settings` | Update settings |
| PUT | `/api/home` | Update home content |
| GET/POST | `/api/stats` | List (with `?all=1`) / create stats |
| PUT/DELETE | `/api/stats/:id` | Update / delete stat |
| GET/POST | `/api/features` | List / create features |
| PUT/DELETE | `/api/features/:id` | Update / delete feature |
| GET/POST | `/api/memberships` | List / create |
| PUT/DELETE | `/api/memberships/:id` | Update / delete |
| GET/POST | `/api/trainers` | List / create |
| PUT/DELETE | `/api/trainers/:id` | Update / delete |
| GET/POST | `/api/categories` | List / create workout categories |
| DELETE | `/api/categories/:id` | Delete category |
| GET/POST | `/api/workouts` | List / create |
| PUT/DELETE | `/api/workouts/:id` | Update / delete |
| GET/PUT | `/api/about` | Get / update about page |
| GET | `/api/messages` | List contact messages |
| PUT/DELETE | `/api/messages/:id` | Mark read / delete |
| PUT | `/api/social` | Update social links |
| PUT | `/api/seo` | Update SEO for one page |

---

## 🗄️ Database Schema Overview

| Table | Purpose |
|---|---|
| `admins` | Admin users (PBKDF2-hashed passwords) |
| `sessions` | Active login sessions (opaque tokens) |
| `site_settings` | Gym name, phone, WhatsApp, email, address, hours, footer |
| `home_content` | Hero + about + CTA text + image URLs |
| `gym_stats` | Homepage statistics (label / value / icon) |
| `features` | Homepage feature cards |
| `membership_plans` | Membership plans |
| `membership_features` | Features per plan (1→many) |
| `trainers` | Trainer records |
| `workout_categories` | Workout category names |
| `workouts` | Workout records |
| `about_content` | About page content |
| `about_features` | About page highlights |
| `contact_messages` | Form submissions |
| `social_links` | Instagram / Facebook / YouTube / Twitter / WhatsApp URLs |
| `seo_settings` | Per-page SEO metadata |
| `admin_activity` | Audit log |

All tables have `created_at` / `updated_at` where appropriate, foreign keys, and indexes.

---

## 🔒 Security

- ✅ Passwords hashed with **PBKDF2** (100,000 iterations, 16-byte salt, SHA-256)
- ✅ Random 256-bit session tokens, stored in D1 with expiry
- ✅ Sessions validated server-side on every admin request
- ✅ **All SQL uses parameterized queries** — no string concatenation
- ✅ Input sanitized & length-limited on the server
- ✅ CORS restricted to `ALLOWED_ORIGIN` (no wildcard)
- ✅ Admin routes marked `noindex,nofollow` in SEO
- ✅ Session tokens never exposed in server logs

---

## ✅ Rules This Project Follows

- ❌ **No** default / demo / fake data — tables start empty
- ❌ **No** Cloudflare R2 — image URLs only
- ❌ **No** payment gateway (no Paytm / Razorpay / Stripe / PayPal / UPI)
- ❌ **No** "Add to Cart" / "Add to Plan" / checkout flows
- ❌ **No** localStorage as the source of truth (only session token)
- ❌ **No** hardcoded contact, gym name, plans, trainers, or workouts
- ✅ Empty DB → clean empty states everywhere
- ✅ Full admin customization of every dynamic value

---

## 🐛 Troubleshooting

### `wrangler dev` says "database_id not set"
→ Paste your D1 `database_id` into `wrangler.toml`.

### Frontend shows "Failed to fetch" or 404 on `/api/*`
→ Make sure `wrangler dev` is running on port `8787` in a separate terminal.

### Admin login page keeps loading
→ Check that `schema.sql` ran successfully: `npx wrangler d1 execute fitzone-db --local --command "SELECT name FROM sqlite_master WHERE type='table';"`

### "Setup already completed" when trying to create admin
→ You already have an admin. Login normally. To reset: `npx wrangler d1 execute fitzone-db --local --command "DELETE FROM admins;"`

### CORS errors in production
→ Set `ALLOWED_ORIGIN` in `wrangler.toml` to your exact deployed domain, then `npm run deploy`.

### Changes in admin panel don't appear on public site
→ Hard refresh (`Ctrl+Shift+R`). The browser may cache the previous fetch.

---

## 📝 License

Free to use for personal and commercial projects.

---

## 🙏 Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)

---

## 📞 Quick Command Reference

```bash
# Install
npm install

# Create D1
npx wrangler d1 create fitzone-db
# → paste database_id into wrangler.toml

# Apply schema locally
npm run db:init:local

# Dev (two terminals)
npx wrangler dev    # terminal 1
npm run dev         # terminal 2

# Open http://localhost:5173/admin/login → create admin

# (Optional) load sample data locally
npx wrangler d1 execute fitzone-db --local --file=./seed.sql

# Deploy to production
npm run db:init        # once, applies schema remotely
npm run deploy         # builds + deploys

# (Optional) sample data remotely
npx wrangler d1 execute fitzone-db --remote --file=./seed.sql
```

---

**You're done.** 🎉 Your FitZone Gym site is live, admin-manageable, and fully data-driven from Cloudflare D1.
