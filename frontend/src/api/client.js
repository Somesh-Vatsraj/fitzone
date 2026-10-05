const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    let msg = res.statusText || `HTTP ${res.status}`;
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  bootstrap: () => req('/bootstrap'),
  updateSettings: (key, data) => req(`/settings/${key}`, { method: 'PUT', body: data }),

  plans: {
    create: (b) => req('/plans', { method: 'POST', body: b }),
    update: (id, b) => req(`/plans/${id}`, { method: 'PUT', body: b }),
    remove: (id) => req(`/plans/${id}`, { method: 'DELETE' }),
  },
  trainers: {
    create: (b) => req('/trainers', { method: 'POST', body: b }),
    update: (id, b) => req(`/trainers/${id}`, { method: 'PUT', body: b }),
    remove: (id) => req(`/trainers/${id}`, { method: 'DELETE' }),
  },
  workouts: {
    create: (b) => req('/workouts', { method: 'POST', body: b }),
    update: (id, b) => req(`/workouts/${id}`, { method: 'PUT', body: b }),
    remove: (id) => req(`/workouts/${id}`, { method: 'DELETE' }),
  },
  members: {
    list: () => req('/members'),
    clear: () => req('/members', { method: 'DELETE' }),
  },
  messages: {
    create: (b) => req('/messages', { method: 'POST', body: b }),
    remove: (id) => req(`/messages/${id}`, { method: 'DELETE' }),
    clear: () => req('/messages', { method: 'DELETE' }),
  },
};
