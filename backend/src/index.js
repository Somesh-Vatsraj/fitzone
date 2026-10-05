import * as db from './db.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

const err = (message, status = 400) => json({ error: message }, status);
const SETTINGS_KEYS = new Set(['home', 'contact', 'site']);

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '');
    const method = req.method;
    const DB = env.DB;

    try {
      // HEALTH
      if (path === '/api/health' && method === 'GET') {
        return json({ ok: true, ts: Date.now() });
      }

      // BOOTSTRAP
      if (path === '/api/bootstrap' && method === 'GET') {
        const [settings, plans, trainers, workouts, members, messages] = await Promise.all([
          db.getSettings(DB), db.listPlans(DB), db.listTrainers(DB),
          db.listWorkouts(DB), db.listMembers(DB), db.listMessages(DB),
        ]);
        return json({
          home: settings.home || null, contact: settings.contact || null,
          site: settings.site || null, plans, trainers, workouts, members, messages,
        });
      }

      // SETTINGS
      const sm = path.match(/^\/api\/settings\/([a-z]+)$/);
      if (sm) {
        const key = sm[1];
        if (!SETTINGS_KEYS.has(key)) return err('Unknown settings key', 404);
        if (method === 'GET') return json(await db.getSetting(DB, key));
        if (method === 'PUT') {
          const body = await req.json();
          return json(await db.upsertSetting(DB, key, body));
        }
      }

      // PLANS
      if (path === '/api/plans') {
        if (method === 'GET') return json(await db.listPlans(DB));
        if (method === 'POST') {
          const body = await req.json();
          if (!body.name || !body.duration) return err('Name and duration required');
          return json(await db.createPlan(DB, body), 201);
        }
      }
      let m = path.match(/^\/api\/plans\/([^/]+)$/);
      if (m) {
        const id = decodeURIComponent(m[1]);
        if (method === 'GET') { const p = await db.getPlan(DB, id); return p ? json(p) : err('Not found', 404); }
        if (method === 'PUT') return json(await db.updatePlan(DB, id, await req.json()));
        if (method === 'DELETE') { await db.deletePlan(DB, id); return json({ ok: true }); }
      }

      // TRAINERS
      if (path === '/api/trainers') {
        if (method === 'GET') return json(await db.listTrainers(DB));
        if (method === 'POST') {
          const body = await req.json();
          if (!body.name) return err('Name required');
          return json(await db.createTrainer(DB, body), 201);
        }
      }
      m = path.match(/^\/api\/trainers\/([^/]+)$/);
      if (m) {
        const id = decodeURIComponent(m[1]);
        if (method === 'GET') { const t = await db.getTrainer(DB, id); return t ? json(t) : err('Not found', 404); }
        if (method === 'PUT') return json(await db.updateTrainer(DB, id, await req.json()));
        if (method === 'DELETE') { await db.deleteTrainer(DB, id); return json({ ok: true }); }
      }

      // WORKOUTS
      if (path === '/api/workouts') {
        if (method === 'GET') return json(await db.listWorkouts(DB));
        if (method === 'POST') {
          const body = await req.json();
          if (!body.name || !body.category) return err('Name and category required');
          return json(await db.createWorkout(DB, body), 201);
        }
      }
      m = path.match(/^\/api\/workouts\/([^/]+)$/);
      if (m) {
        const id = decodeURIComponent(m[1]);
        if (method === 'GET') { const w = await db.getWorkout(DB, id); return w ? json(w) : err('Not found', 404); }
        if (method === 'PUT') return json(await db.updateWorkout(DB, id, await req.json()));
        if (method === 'DELETE') { await db.deleteWorkout(DB, id); return json({ ok: true }); }
      }

      // MEMBERS
      if (path === '/api/members') {
        if (method === 'GET') return json(await db.listMembers(DB));
        if (method === 'POST') {
          const body = await req.json();
          if (!body.name) return err('Name required');
          return json(await db.createMember(DB, body), 201);
        }
        if (method === 'DELETE') { await db.clearMembers(DB); return json({ ok: true }); }
      }
      m = path.match(/^\/api\/members\/([^/]+)$/);
      if (m) {
        const id = decodeURIComponent(m[1]);
        if (method === 'PUT') return json(await db.updateMember(DB, id, await req.json()));
        if (method === 'DELETE') { await db.deleteMember(DB, id); return json({ ok: true }); }
      }

      // MESSAGES
      if (path === '/api/messages') {
        if (method === 'GET') return json(await db.listMessages(DB));
        if (method === 'POST') {
          const body = await req.json();
          if (!body.name || !body.message) return err('Name and message required');
          return json(await db.createMessage(DB, body), 201);
        }
        if (method === 'DELETE') { await db.clearMessages(DB); return json({ ok: true }); }
      }
      m = path.match(/^\/api\/messages\/([^/]+)$/);
      if (m && method === 'DELETE') {
        await db.deleteMessage(DB, decodeURIComponent(m[1]));
        return json({ ok: true });
      }

      return err('Route not found', 404);
    } catch (e) {
      console.error('Worker error:', e);
      return err(e.message || 'Server error', 500);
    }
  },
};
