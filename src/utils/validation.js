export function required(v) { return v !== null && v !== undefined && String(v).trim().length > 0; }
export function validEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)); }
export function validPhone(v) { return !v || /^[+\d][\d\s\-()]{5,}$/.test(String(v)); }
export function validUrl(v) {
  if (!v) return true;
  try { new URL(v); return true; } catch { return false; }
}
