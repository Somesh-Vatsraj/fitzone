import {
  hashPassword, verifyPassword, createSession, verifySession, destroySession
} from './auth.js';

// ---------- Helpers ----------
function cors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || '';
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400'
  };
  if (origin && (allowed === '*' || allowed === origin || (env.ENVIRONMENT !== 'production' && origin.startsWith('http://localhost')))) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra }
  });
}

async function body(req) {
  try { return await req.json(); } catch { return {}; }
}

function clean(v, max = 1000) {
  if (v === null || v === undefined) return '';
  return String(v).trim().slice(0, max);
}

function num(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function requireAdmin(session, ch) {
  if (!session) throw Object.assign(new Error('Unauthorized'), { status: 401 });
}

// ---------- Public Routes ----------
async function getSiteSettings(env) {
  const row = await env.DB.prepare('SELECT * FROM site_settings WHERE id = 1').first();
  return row || {};
}

async function getHome(env) {
  const row = await env.DB.prepare('SELECT * FROM home_content WHERE id = 1').first();
  return row || {};
}

async function listStats(env, all) {
  const sql = all
    ? 'SELECT * FROM gym_stats ORDER BY sort_order ASC, id ASC'
    : "SELECT * FROM gym_stats WHERE status = 'active' ORDER BY sort_order ASC, id ASC";
  return (await env.DB.prepare(sql).all()).results || [];
}

async function listFeatures(env, all) {
  const sql = all
    ? 'SELECT * FROM features ORDER BY sort_order ASC, id ASC'
    : "SELECT * FROM features WHERE status = 'active' ORDER BY sort_order ASC, id ASC";
  return (await env.DB.prepare(sql).all()).results || [];
}

async function listMemberships(env, all) {
  const sql = all
    ? 'SELECT * FROM membership_plans ORDER BY sort_order ASC, id ASC'
    : "SELECT * FROM membership_plans WHERE status = 'active' ORDER BY sort_order ASC, id ASC";
  const plans = (await env.DB.prepare(sql).all()).results || [];
  if (!plans.length) return [];
  const ids = plans.map(p => p.id);
  const placeholders = ids.map(() => '?').join(',');
  const feats = (await env.DB.prepare(
    `SELECT * FROM membership_features WHERE membership_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`
  ).bind(...ids).all()).results || [];
  const map = {};
  for (const f of feats) {
    if (!map[f.membership_id]) map[f.membership_id] = [];
    map[f.membership_id].push(f.feature);
  }
  return plans.map(p => ({ ...p, features: map[p.id] || [] }));
}

async function listTrainers(env, all) {
  const sql = all
    ? 'SELECT * FROM trainers ORDER BY sort_order ASC, id ASC'
    : "SELECT * FROM trainers WHERE status = 'active' ORDER BY sort_order ASC, id ASC";
  return (await env.DB.prepare(sql).all()).results || [];
}

async function listWorkouts(env, all) {
  const sql = all
    ? 'SELECT * FROM workouts ORDER BY sort_order ASC, id ASC'
    : "SELECT * FROM workouts WHERE status = 'active' ORDER BY sort_order ASC, id ASC";
  return (await env.DB.prepare(sql).all()).results || [];
}

async function listCategories(env) {
  return (await env.DB.prepare('SELECT * FROM workout_categories ORDER BY sort_order ASC, id ASC').all()).results || [];
}

async function getAbout(env) {
  const row = await env.DB.prepare('SELECT * FROM about_content WHERE id = 1').first();
  const features = (await env.DB.prepare('SELECT * FROM about_features ORDER BY sort_order ASC, id ASC').all()).results || [];
  return { ...(row || {}), features: features.map(f => f.feature) };
}

async function listSocial(env) {
  return (await env.DB.prepare('SELECT * FROM social_links ORDER BY sort_order ASC, id ASC').all()).results || [];
}

async function getSeo(env, page) {
  if (page) return await env.DB.prepare('SELECT * FROM seo_settings WHERE page = ?').bind(page).first();
  return (await env.DB.prepare('SELECT * FROM seo_settings ORDER BY id ASC').all()).results || [];
}

// ---------- Main Handler ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = cors(request, env);

    // Handle static / SEO files even before /api check
    if (path === '/robots.txt') {
      const s = await getSiteSettings(env);
      const base = url.origin;
      const txt = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /admin/login\n\nSitemap: ${base}/sitemap.xml\n`;
      return new Response(txt, { headers: { 'Content-Type': 'text/plain', ...corsHeaders } });
    }
    if (path === '/sitemap.xml') {
      const base = url.origin;
      const pages = ['', 'workouts', 'trainers', 'membership', 'about', 'contact'];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${base}/${p}</loc><changefreq>weekly</changefreq></url>`).join('\n')}\n</urlset>`;
      return new Response(xml, { headers: { 'Content-Type': 'application/xml', ...corsHeaders } });
    }

    if (method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    if (!path.startsWith('/api')) {
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return new Response('Not Found', { status: 404 });
    }

    try {
      const res = await route(request, env, url);
      // Merge CORS into response
      const merged = new Headers(res.headers);
      for (const [k, v] of Object.entries(corsHeaders)) merged.set(k, v);
      return new Response(res.body, { status: res.status, headers: merged });
    } catch (err) {
      const status = err.status || 500;
      return json({ error: err.message || 'Server error' }, status, corsHeaders);
    }
  }
};

// ---------- Router ----------
async function route(request, env, url) {
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = request.method;
  const segments = path.split('/').filter(Boolean);

  // ===== AUTH =====
  if (path === '/auth/status' && method === 'GET') {
    const c = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first();
    return json({ setupRequired: !c || c.count === 0 });
  }
  if (path === '/auth/setup' && method === 'POST') {
    const count = await env.DB.prepare('SELECT COUNT(*) as c FROM admins').first();
    if (count.c > 0) return json({ error: 'Setup already completed' }, 400);
    const b = await body(request);
    const username = clean(b.username, 60);
    const password = String(b.password || '');
    if (!username || password.length < 6) return json({ error: 'Username and password (min 6 chars) required' }, 400);
    const { hash, salt } = await hashPassword(password);
    const r = await env.DB.prepare('INSERT INTO admins (username, password_hash, salt) VALUES (?, ?, ?)')
      .bind(username, hash, salt).run();
    const adminId = r.meta.last_row_id;
    const { token } = await createSession(env.DB, adminId);
    return json({ token, username });
  }
  if (path === '/auth/login' && method === 'POST') {
    const b = await body(request);
    const username = clean(b.username, 60);
    const password = String(b.password || '');
    if (!username || !password) return json({ error: 'Missing credentials' }, 400);
    const admin = await env.DB.prepare('SELECT * FROM admins WHERE username = ?').bind(username).first();
    if (!admin) return json({ error: 'Invalid credentials' }, 401);
    const ok = await verifyPassword(password, admin.password_hash, admin.salt);
    if (!ok) return json({ error: 'Invalid credentials' }, 401);
    const { token } = await createSession(env.DB, admin.id);
    return json({ token, username: admin.username });
  }
  if (path === '/auth/me' && method === 'GET') {
    const s = await verifySession(env.DB, request);
    if (!s) return json({ error: 'Unauthorized' }, 401);
    return json({ username: s.username, adminId: s.admin_id });
  }
  if (path === '/auth/logout' && method === 'POST') {
    await destroySession(env.DB, request);
    return json({ ok: true });
  }

  // ===== SETTINGS =====
  if (path === '/site-settings' && method === 'GET') return json(await getSiteSettings(env));
  if (path === '/site-settings' && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    await env.DB.prepare(
      `UPDATE site_settings SET gym_name=?, logo_text=?, logo_url=?, phone=?, whatsapp=?, email=?, address=?, opening_hours=?, footer_text=?, updated_at=datetime('now') WHERE id=1`
    ).bind(
      clean(b.gym_name, 120), clean(b.logo_text, 120), clean(b.logo_url, 500),
      clean(b.phone, 40), clean(b.whatsapp, 40), clean(b.email, 120),
      clean(b.address, 300), clean(b.opening_hours, 200), clean(b.footer_text, 500)
    ).run();
    return json(await getSiteSettings(env));
  }

  // ===== HOME =====
  if (path === '/home' && method === 'GET') return json(await getHome(env));
  if (path === '/home' && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    await env.DB.prepare(
      `UPDATE home_content SET hero_badge=?, hero_heading=?, hero_description=?, hero_button_text=?, hero_button_link=?, hero_image_url=?, about_heading=?, about_description=?, about_image_url=?, cta_heading=?, cta_description=?, cta_button_text=?, cta_button_link=?, updated_at=datetime('now') WHERE id=1`
    ).bind(
      clean(b.hero_badge, 200), clean(b.hero_heading, 200), clean(b.hero_description, 1000),
      clean(b.hero_button_text, 60), clean(b.hero_button_link, 300), clean(b.hero_image_url, 500),
      clean(b.about_heading, 200), clean(b.about_description, 1500), clean(b.about_image_url, 500),
      clean(b.cta_heading, 200), clean(b.cta_description, 1000),
      clean(b.cta_button_text, 60), clean(b.cta_button_link, 300)
    ).run();
    return json(await getHome(env));
  }

  // ===== STATS =====
  if (path === '/stats' && method === 'GET') {
    const all = url.searchParams.get('all') === '1';
    if (all) requireAdmin(await verifySession(env.DB, request));
    return json(await listStats(env, all));
  }
  if (path === '/stats' && method === 'POST') {
    const s = await verifySession(env.DB, request); requireAdmin(s);
    const b = await body(request);
    if (!clean(b.label) || !clean(b.value)) return json({ error: 'Label and value required' }, 400);
    const r = await env.DB.prepare('INSERT INTO gym_stats (label, value, icon, sort_order, status) VALUES (?,?,?,?,?)')
      .bind(clean(b.label, 80), clean(b.value, 40), clean(b.icon, 60), num(b.sort_order), b.status === 'inactive' ? 'inactive' : 'active').run();
    return json({ id: r.meta.last_row_id });
  }
  if (segments[0] === 'stats' && segments[1] && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const id = num(segments[1]);
    const b = await body(request);
    await env.DB.prepare('UPDATE gym_stats SET label=?, value=?, icon=?, sort_order=?, status=?, updated_at=datetime(\'now\') WHERE id=?')
      .bind(clean(b.label, 80), clean(b.value, 40), clean(b.icon, 60), num(b.sort_order), b.status === 'inactive' ? 'inactive' : 'active', id).run();
    return json({ ok: true });
  }
  if (segments[0] === 'stats' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM gym_stats WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== FEATURES =====
  if (path === '/features' && method === 'GET') {
    const all = url.searchParams.get('all') === '1';
    if (all) requireAdmin(await verifySession(env.DB, request));
    return json(await listFeatures(env, all));
  }
  if (path === '/features' && method === 'POST') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    if (!clean(b.title)) return json({ error: 'Title required' }, 400);
    const r = await env.DB.prepare('INSERT INTO features (title, description, icon, sort_order, status) VALUES (?,?,?,?,?)')
      .bind(clean(b.title, 120), clean(b.description, 500), clean(b.icon, 60), num(b.sort_order), b.status === 'inactive' ? 'inactive' : 'active').run();
    return json({ id: r.meta.last_row_id });
  }
  if (segments[0] === 'features' && segments[1] && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const id = num(segments[1]); const b = await body(request);
    await env.DB.prepare('UPDATE features SET title=?, description=?, icon=?, sort_order=?, status=?, updated_at=datetime(\'now\') WHERE id=?')
      .bind(clean(b.title, 120), clean(b.description, 500), clean(b.icon, 60), num(b.sort_order), b.status === 'inactive' ? 'inactive' : 'active', id).run();
    return json({ ok: true });
  }
  if (segments[0] === 'features' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM features WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== MEMBERSHIPS =====
  if (path === '/memberships' && method === 'GET') {
    const all = url.searchParams.get('all') === '1';
    if (all) requireAdmin(await verifySession(env.DB, request));
    return json(await listMemberships(env, all));
  }
  if (path === '/memberships' && method === 'POST') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    if (!clean(b.name) || b.amount === undefined || !clean(b.duration)) return json({ error: 'Name, amount, duration required' }, 400);
    const r = await env.DB.prepare('INSERT INTO membership_plans (name, amount, duration, description, status, sort_order) VALUES (?,?,?,?,?,?)')
      .bind(clean(b.name, 120), num(b.amount), clean(b.duration, 60), clean(b.description, 800), b.status === 'inactive' ? 'inactive' : 'active', num(b.sort_order)).run();
    const id = r.meta.last_row_id;
    if (Array.isArray(b.features)) {
      let i = 0;
      for (const f of b.features) {
        if (!clean(f)) { i++; continue; }
        await env.DB.prepare('INSERT INTO membership_features (membership_id, feature, sort_order) VALUES (?,?,?)')
          .bind(id, clean(f, 200), i++).run();
      }
    }
    return json({ id });
  }
  if (segments[0] === 'memberships' && segments[1] && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const id = num(segments[1]); const b = await body(request);
    await env.DB.prepare('UPDATE membership_plans SET name=?, amount=?, duration=?, description=?, status=?, sort_order=?, updated_at=datetime(\'now\') WHERE id=?')
      .bind(clean(b.name, 120), num(b.amount), clean(b.duration, 60), clean(b.description, 800), b.status === 'inactive' ? 'inactive' : 'active', num(b.sort_order), id).run();
    await env.DB.prepare('DELETE FROM membership_features WHERE membership_id=?').bind(id).run();
    if (Array.isArray(b.features)) {
      let i = 0;
      for (const f of b.features) {
        if (!clean(f)) { i++; continue; }
        await env.DB.prepare('INSERT INTO membership_features (membership_id, feature, sort_order) VALUES (?,?,?)')
          .bind(id, clean(f, 200), i++).run();
      }
    }
    return json({ ok: true });
  }
  if (segments[0] === 'memberships' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM membership_plans WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== TRAINERS =====
  if (path === '/trainers' && method === 'GET') {
    const all = url.searchParams.get('all') === '1';
    if (all) requireAdmin(await verifySession(env.DB, request));
    return json(await listTrainers(env, all));
  }
  if (path === '/trainers' && method === 'POST') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    if (!clean(b.name)) return json({ error: 'Name required' }, 400);
    const r = await env.DB.prepare('INSERT INTO trainers (name, image_url, specialization, experience, bio, contact_number, status, sort_order) VALUES (?,?,?,?,?,?,?,?)')
      .bind(clean(b.name, 120), clean(b.image_url, 500), clean(b.specialization, 120), clean(b.experience, 60), clean(b.bio, 800), clean(b.contact_number, 40), b.status === 'inactive' ? 'inactive' : 'active', num(b.sort_order)).run();
    return json({ id: r.meta.last_row_id });
  }
  if (segments[0] === 'trainers' && segments[1] && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const id = num(segments[1]); const b = await body(request);
    await env.DB.prepare('UPDATE trainers SET name=?, image_url=?, specialization=?, experience=?, bio=?, contact_number=?, status=?, sort_order=?, updated_at=datetime(\'now\') WHERE id=?')
      .bind(clean(b.name, 120), clean(b.image_url, 500), clean(b.specialization, 120), clean(b.experience, 60), clean(b.bio, 800), clean(b.contact_number, 40), b.status === 'inactive' ? 'inactive' : 'active', num(b.sort_order), id).run();
    return json({ ok: true });
  }
  if (segments[0] === 'trainers' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM trainers WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== WORKOUT CATEGORIES =====
  if (path === '/categories' && method === 'GET') return json(await listCategories(env));
  if (path === '/categories' && method === 'POST') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    const name = clean(b.name, 80);
    if (!name) return json({ error: 'Name required' }, 400);
    try {
      const r = await env.DB.prepare('INSERT INTO workout_categories (name, sort_order) VALUES (?,?)').bind(name, num(b.sort_order)).run();
      return json({ id: r.meta.last_row_id });
    } catch (e) { return json({ error: 'Category already exists' }, 400); }
  }
  if (segments[0] === 'categories' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM workout_categories WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== WORKOUTS =====
  if (path === '/workouts' && method === 'GET') {
    const all = url.searchParams.get('all') === '1';
    if (all) requireAdmin(await verifySession(env.DB, request));
    return json(await listWorkouts(env, all));
  }
  if (path === '/workouts' && method === 'POST') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    if (!clean(b.name)) return json({ error: 'Name required' }, 400);
    const r = await env.DB.prepare('INSERT INTO workouts (name, category, image_url, sets, reps, difficulty, description, status, sort_order) VALUES (?,?,?,?,?,?,?,?,?)')
      .bind(clean(b.name, 120), clean(b.category, 80), clean(b.image_url, 500), clean(b.sets, 40), clean(b.reps, 40), clean(b.difficulty, 40), clean(b.description, 800), b.status === 'inactive' ? 'inactive' : 'active', num(b.sort_order)).run();
    return json({ id: r.meta.last_row_id });
  }
  if (segments[0] === 'workouts' && segments[1] && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const id = num(segments[1]); const b = await body(request);
    await env.DB.prepare('UPDATE workouts SET name=?, category=?, image_url=?, sets=?, reps=?, difficulty=?, description=?, status=?, sort_order=?, updated_at=datetime(\'now\') WHERE id=?')
      .bind(clean(b.name, 120), clean(b.category, 80), clean(b.image_url, 500), clean(b.sets, 40), clean(b.reps, 40), clean(b.difficulty, 40), clean(b.description, 800), b.status === 'inactive' ? 'inactive' : 'active', num(b.sort_order), id).run();
    return json({ ok: true });
  }
  if (segments[0] === 'workouts' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM workouts WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== ABOUT =====
  if (path === '/about' && method === 'GET') return json(await getAbout(env));
  if (path === '/about' && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    await env.DB.prepare(
      `UPDATE about_content SET heading=?, description=?, mission=?, vision=?, story=?, image_url=?, updated_at=datetime('now') WHERE id=1`
    ).bind(
      clean(b.heading, 200), clean(b.description, 2000), clean(b.mission, 1000),
      clean(b.vision, 1000), clean(b.story, 3000), clean(b.image_url, 500)
    ).run();
    await env.DB.prepare('DELETE FROM about_features').run();
    if (Array.isArray(b.features)) {
      let i = 0;
      for (const f of b.features) {
        if (!clean(f)) continue;
        await env.DB.prepare('INSERT INTO about_features (feature, sort_order) VALUES (?,?)').bind(clean(f, 200), i++).run();
      }
    }
    return json(await getAbout(env));
  }

  // ===== CONTACT =====
  if (path === '/contact' && method === 'POST') {
    const b = await body(request);
    const name = clean(b.name, 120);
    const phone = clean(b.phone, 40);
    const email = clean(b.email, 120);
    const message = clean(b.message, 2000);
    if (!name || !phone || !message) return json({ error: 'Name, phone and message are required' }, 400);
    const r = await env.DB.prepare('INSERT INTO contact_messages (name, phone, email, message) VALUES (?,?,?,?)')
      .bind(name, phone, email, message).run();
    return json({ id: r.meta.last_row_id, ok: true });
  }

  // ===== MESSAGES (admin) =====
  if (path === '/messages' && method === 'GET') {
    requireAdmin(await verifySession(env.DB, request));
    const rows = (await env.DB.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC').all()).results || [];
    return json(rows);
  }
  if (segments[0] === 'messages' && segments[1] && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const id = num(segments[1]); const b = await body(request);
    await env.DB.prepare('UPDATE contact_messages SET is_read=? WHERE id=?')
      .bind(b.is_read ? 1 : 0, id).run();
    return json({ ok: true });
  }
  if (segments[0] === 'messages' && segments[1] && method === 'DELETE') {
    requireAdmin(await verifySession(env.DB, request));
    await env.DB.prepare('DELETE FROM contact_messages WHERE id=?').bind(num(segments[1])).run();
    return json({ ok: true });
  }

  // ===== SOCIAL =====
  if (path === '/social' && method === 'GET') return json(await listSocial(env));
  if (path === '/social' && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    const items = Array.isArray(b.links) ? b.links : [];
    for (const item of items) {
      const platform = clean(item.platform, 40);
      if (!platform) continue;
      const url = clean(item.url, 500);
      const existing = await env.DB.prepare('SELECT id FROM social_links WHERE platform = ?').bind(platform).first();
      if (existing) {
        await env.DB.prepare('UPDATE social_links SET url=?, sort_order=?, updated_at=datetime(\'now\') WHERE platform=?')
          .bind(url, num(item.sort_order), platform).run();
      } else {
        await env.DB.prepare('INSERT INTO social_links (platform, url, sort_order) VALUES (?,?,?)')
          .bind(platform, url, num(item.sort_order)).run();
      }
    }
    return json(await listSocial(env));
  }

  // ===== SEO =====
  if (path === '/seo' && method === 'GET') {
    const page = url.searchParams.get('page');
    if (page) return json(await getSeo(env, page));
    return json(await getSeo(env));
  }
  if (path === '/seo' && method === 'PUT') {
    requireAdmin(await verifySession(env.DB, request));
    const b = await body(request);
    const page = clean(b.page, 40);
    if (!page) return json({ error: 'Page is required' }, 400);
    const fields = ['title','description','keywords','canonical_url','og_title','og_description','og_image','twitter_title','twitter_description','twitter_image','robots'];
    const vals = fields.map(f => clean(b[f], 1000));
    const existing = await env.DB.prepare('SELECT id FROM seo_settings WHERE page=?').bind(page).first();
    if (existing) {
      await env.DB.prepare(
        `UPDATE seo_settings SET title=?, description=?, keywords=?, canonical_url=?, og_title=?, og_description=?, og_image=?, twitter_title=?, twitter_description=?, twitter_image=?, robots=?, updated_at=datetime('now') WHERE page=?`
      ).bind(...vals, page).run();
    } else {
      await env.DB.prepare(
        `INSERT INTO seo_settings (page, title, description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, robots) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(page, ...vals).run();
    }
    return json(await getSeo(env, page));
  }

  // ===== DASHBOARD =====
  if (path === '/admin/dashboard' && method === 'GET') {
    requireAdmin(await verifySession(env.DB, request));
    const [m, t, w, msg, unread] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as c FROM membership_plans').first(),
      env.DB.prepare('SELECT COUNT(*) as c FROM trainers').first(),
      env.DB.prepare('SELECT COUNT(*) as c FROM workouts').first(),
      env.DB.prepare('SELECT COUNT(*) as c FROM contact_messages').first(),
      env.DB.prepare('SELECT COUNT(*) as c FROM contact_messages WHERE is_read = 0').first()
    ]);
    return json({
      memberships: m.c, trainers: t.c, workouts: w.c, messages: msg.c, unread: unread.c
    });
  }

  return json({ error: 'Not found' }, 404);
}
