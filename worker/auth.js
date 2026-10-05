const ITERATIONS = 100000;
const SESSION_DAYS = 7;

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

export async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function verifyPassword(password, hash, saltHex) {
  const { hash: computed } = await hashPassword(password, saltHex);
  return computed === hash;
}

export function generateToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

export async function createSession(db, adminId) {
  const token = generateToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.prepare('INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)')
    .bind(token, adminId, expires).run();
  return { token, expires };
}

export async function verifySession(db, request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const session = await db.prepare(
    `SELECT s.id as session_id, s.admin_id, a.username
     FROM sessions s JOIN admins a ON a.id = s.admin_id
     WHERE s.id = ? AND s.expires_at > ?`
  ).bind(token, new Date().toISOString()).first();
  return session || null;
}

export async function destroySession(db, request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return;
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(auth.slice(7)).run();
}
