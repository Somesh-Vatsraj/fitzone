export const uid = (p = 'id') =>
  `${p}_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

export const digitsOnly = (v = '') => String(v).replace(/\D/g, '');
export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const telLink = (p = '') => `tel:${String(p).replace(/[^\d+]/g, '')}`;
export const waLink = (p = '', t = '') =>
  `https://wa.me/${digitsOnly(p)}${t ? `?text=${encodeURIComponent(t)}` : ''}`;

export const FALLBACK_IMG =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1b1b21"/><stop offset="1" stop-color="#0c0c0f"/>
      </linearGradient></defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <text x="400" y="312" font-family="Arial" font-size="48" font-weight="bold" fill="#ff5a1f" text-anchor="middle">FITZONE</text>
    </svg>`
  );

export const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMG;
};

export async function copyText(text) {
  const value = String(text ?? '');
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    throw new Error('no-clipboard');
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch { return false; }
  }
}
