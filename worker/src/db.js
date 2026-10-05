const uid = (p) => `${p}_${crypto.randomUUID().slice(0, 8)}`;
const safeParse = (s, fallback) => { try { return JSON.parse(s); } catch { return fallback; } };

// ---------- SETTINGS ----------
export async function getSettings(db) {
  const rows = await db.prepare('SELECT key, data FROM settings').all();
  const out = {};
  for (const r of rows.results || []) out[r.key] = safeParse(r.data, null);
  return out;
}

export async function upsertSetting(db, key, data) {
  await db
    .prepare(
      `INSERT INTO settings (key, data, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    )
    .bind(key, JSON.stringify(data))
    .run();
  return data;
}

// ---------- PLANS ----------
const rowToPlan = (r) => ({
  id: r.id,
  name: r.name,
  amount: r.amount,
  duration: r.duration,
  features: safeParse(r.features, []),
  popular: !!r.popular,
  enabled: !!r.enabled,
  sort: r.sort,
});

export async function listPlans(db) {
  const rows = await db.prepare('SELECT * FROM plans ORDER BY sort ASC, name ASC').all();
  return (rows.results || []).map(rowToPlan);
}

export async function getPlan(db, id) {
  const r = await db.prepare('SELECT * FROM plans WHERE id = ?').bind(id).first();
  return r ? rowToPlan(r) : null;
}

export async function createPlan(db, b) {
  const id = b.id || uid('plan');
  const sort = b.sort ?? Date.now();
  await db.prepare(
    `INSERT INTO plans (id, name, amount, duration, features, popular, enabled, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, b.name, Number(b.amount) || 0, b.duration,
    JSON.stringify(b.features || []),
    b.popular ? 1 : 0, b.enabled === false ? 0 : 1, sort
  ).run();
  return getPlan(db, id);
}

export async function updatePlan(db, id, b) {
  await db.prepare(
    `UPDATE plans SET name = ?, amount = ?, duration = ?, features = ?, popular = ?, enabled = ? WHERE id = ?`
  ).bind(
    b.name, Number(b.amount) || 0, b.duration,
    JSON.stringify(b.features || []),
    b.popular ? 1 : 0, b.enabled === false ? 0 : 1, id
  ).run();
  return getPlan(db, id);
}

export async function deletePlan(db, id) {
  await db.prepare('DELETE FROM plans WHERE id = ?').bind(id).run();
}

// ---------- TRAINERS ----------
export async function listTrainers(db) {
  const rows = await db.prepare('SELECT * FROM trainers ORDER BY sort ASC, name ASC').all();
  return rows.results || [];
}

export async function getTrainer(db, id) {
  return db.prepare('SELECT * FROM trainers WHERE id = ?').bind(id).first();
}

export async function createTrainer(db, b) {
  const id = b.id || uid('trainer');
  const sort = b.sort ?? Date.now();
  await db.prepare(
    `INSERT INTO trainers (id, name, specialization, experience, phone, email, image, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, b.name, b.specialization, b.experience,
    b.phone || '', b.email || '', b.image || '', sort
  ).run();
  return getTrainer(db, id);
}

export async function updateTrainer(db, id, b) {
  await db.prepare(
    `UPDATE trainers SET name = ?, specialization = ?, experience = ?, phone = ?, email = ?, image = ? WHERE id = ?`
  ).bind(
    b.name, b.specialization, b.experience,
    b.phone || '', b.email || '', b.image || '', id
  ).run();
  return getTrainer(db, id);
}

export async function deleteTrainer(db, id) {
  await db.prepare('DELETE FROM trainers WHERE id = ?').bind(id).run();
}

// ---------- WORKOUTS ----------
export async function listWorkouts(db) {
  const rows = await db.prepare('SELECT * FROM workouts ORDER BY sort ASC, name ASC').all();
  return rows.results || [];
}

export async function getWorkout(db, id) {
  return db.prepare('SELECT * FROM workouts WHERE id = ?').bind(id).first();
}

export async function createWorkout(db, b) {
  const id = b.id || uid('workout');
  const sort = b.sort ?? Date.now();
  await db.prepare(
    `INSERT INTO workouts (id, name, category, sets, reps, difficulty, description, image, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, b.name, b.category, Number(b.sets) || 3, String(b.reps),
    b.difficulty, b.description || '', b.image || '', sort
  ).run();
  return getWorkout(db, id);
}

export async function updateWorkout(db, id, b) {
  await db.prepare(
    `UPDATE workouts SET name = ?, category = ?, sets = ?, reps = ?, difficulty = ?, description = ?, image = ? WHERE id = ?`
  ).bind(
    b.name, b.category, Number(b.sets) || 3, String(b.reps),
    b.difficulty, b.description || '', b.image || '', id
  ).run();
  return getWorkout(db, id);
}

export async function deleteWorkout(db, id) {
  await db.prepare('DELETE FROM workouts WHERE id = ?').bind(id).run();
}

// ---------- MEMBERS ----------
export async function listMembers(db) {
  const rows = await db.prepare('SELECT * FROM members ORDER BY joined DESC').all();
  return rows.results || [];
}

export async function clearMembers(db) {
  await db.prepare('DELETE FROM members').run();
}

// ---------- MESSAGES ----------
export async function listMessages(db) {
  const rows = await db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  return (rows.results || []).map((m) => ({
    id: m.id, name: m.name, email: m.email,
    phone: m.phone, message: m.message, createdAt: m.created_at,
  }));
}

export async function createMessage(db, b) {
  const id = b.id || uid('msg');
  const createdAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  await db.prepare(
    `INSERT INTO messages (id, name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, b.name, b.email || '', b.phone || '', b.message || '', createdAt).run();
  return { id, ...b, createdAt };
}

export async function deleteMessage(db, id) {
  await db.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
}

export async function clearMessages(db) {
  await db.prepare('DELETE FROM messages').run();
}
