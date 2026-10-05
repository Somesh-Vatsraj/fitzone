const API_BASE = '/api';

function getToken() { return localStorage.getItem('fitzone_token'); }
export function setToken(t) { if (t) localStorage.setItem('fitzone_token', t); else localStorage.removeItem('fitzone_token'); }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    if (res.status === 401 && path !== '/auth/login' && path !== '/auth/status' && path !== '/auth/setup') {
      localStorage.removeItem('fitzone_token');
    }
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  auth: {
    status: () => request('/auth/status'),
    setup: (username, password) => request('/auth/setup', { method: 'POST', body: JSON.stringify({ username, password }) }),
    login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me')
  },
  settings: {
    get: () => request('/site-settings'),
    update: (d) => request('/site-settings', { method: 'PUT', body: JSON.stringify(d) })
  },
  home: {
    get: () => request('/home'),
    update: (d) => request('/home', { method: 'PUT', body: JSON.stringify(d) })
  },
  stats: {
    list: (all) => request('/stats' + (all ? '?all=1' : '')),
    create: (d) => request('/stats', { method: 'POST', body: JSON.stringify(d) }),
    update: (id, d) => request(`/stats/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id) => request(`/stats/${id}`, { method: 'DELETE' })
  },
  features: {
    list: (all) => request('/features' + (all ? '?all=1' : '')),
    create: (d) => request('/features', { method: 'POST', body: JSON.stringify(d) }),
    update: (id, d) => request(`/features/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id) => request(`/features/${id}`, { method: 'DELETE' })
  },
  memberships: {
    list: (all) => request('/memberships' + (all ? '?all=1' : '')),
    create: (d) => request('/memberships', { method: 'POST', body: JSON.stringify(d) }),
    update: (id, d) => request(`/memberships/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id) => request(`/memberships/${id}`, { method: 'DELETE' })
  },
  trainers: {
    list: (all) => request('/trainers' + (all ? '?all=1' : '')),
    create: (d) => request('/trainers', { method: 'POST', body: JSON.stringify(d) }),
    update: (id, d) => request(`/trainers/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id) => request(`/trainers/${id}`, { method: 'DELETE' })
  },
  categories: {
    list: () => request('/categories'),
    create: (d) => request('/categories', { method: 'POST', body: JSON.stringify(d) }),
    remove: (id) => request(`/categories/${id}`, { method: 'DELETE' })
  },
  workouts: {
    list: (all) => request('/workouts' + (all ? '?all=1' : '')),
    create: (d) => request('/workouts', { method: 'POST', body: JSON.stringify(d) }),
    update: (id, d) => request(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id) => request(`/workouts/${id}`, { method: 'DELETE' })
  },
  about: {
    get: () => request('/about'),
    update: (d) => request('/about', { method: 'PUT', body: JSON.stringify(d) })
  },
  contact: {
    send: (d) => request('/contact', { method: 'POST', body: JSON.stringify(d) })
  },
  messages: {
    list: () => request('/messages'),
    update: (id, d) => request(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id) => request(`/messages/${id}`, { method: 'DELETE' })
  },
  social: {
    list: () => request('/social'),
    update: (links) => request('/social', { method: 'PUT', body: JSON.stringify({ links }) })
  },
  seo: {
    list: () => request('/seo'),
    get: (page) => request('/seo?page=' + page),
    update: (d) => request('/seo', { method: 'PUT', body: JSON.stringify(d) })
  },
  dashboard: {
    stats: () => request('/admin/dashboard')
  }
};
