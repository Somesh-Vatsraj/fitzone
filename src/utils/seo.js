export function applySEO({ title, description, keywords, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage, robots }) {
  if (title) document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'keywords', keywords);
  setMeta('name', 'robots', robots || 'index,follow');
  setLink('canonical', canonical);
  setMeta('property', 'og:title', ogTitle || title);
  setMeta('property', 'og:description', ogDescription || description);
  setMeta('property', 'og:image', ogImage);
  setMeta('property', 'og:type', 'website');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', twitterTitle || ogTitle || title);
  setMeta('name', 'twitter:description', twitterDescription || ogDescription || description);
  setMeta('name', 'twitter:image', twitterImage || ogImage);
}

function setMeta(attr, name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function setJSONLD(id, data) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.id = id;
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

export function telLink(phone) {
  if (!phone) return '';
  const cleaned = String(phone).replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

export function whatsappLink(number, text) {
  if (!number) return '';
  const cleaned = String(number).replace(/[^\d]/g, '');
  const msg = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${cleaned}${msg}`;
}
