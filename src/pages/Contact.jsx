import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { applySEO, telLink, whatsappLink } from '../utils/seo.js';
import { required, validEmail } from '../utils/validation.js';
import { useToast } from '../components/Toast.jsx';

export default function Contact() {
  const { data: settings } = useApi(() => api.settings.get(), []);
  const { data: seo } = useApi(() => api.seo.get('contact'), []);
  const toast = useToast();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (seo) applySEO({
      title: seo.title, description: seo.description, keywords: seo.keywords,
      canonical: seo.canonical_url, ogTitle: seo.og_title, ogDescription: seo.og_description,
      ogImage: seo.og_image, twitterTitle: seo.twitter_title,
      twitterDescription: seo.twitter_description, twitterImage: seo.twitter_image,
      robots: seo.robots || 'index,follow'
    });
  }, [seo]);

  const submit = async (e) => {
    e.preventDefault();
    if (!required(form.name) || !required(form.phone) || !required(form.message)) {
      toast.error('Name, phone and message are required');
      return;
    }
    if (!validEmail(form.email)) { toast.error('Please enter a valid email'); return; }
    setSubmitting(true);
    try {
      await api.contact.send(form);
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch — we're here to help you get started.</p>
      </header>

      <div className="grid grid-2" style={{ gap: 40 }}>
        <div>
          <div className="admin-card">
            <h2 className="mb-3">Reach us at</h2>
            {!settings?.phone && !settings?.whatsapp && !settings?.email && !settings?.address && (
              <p className="text-muted">Contact information is not available yet.</p>
            )}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {settings?.phone && (
                <li className="flex" style={{ gap: 12 }}>
                  <span>📞</span>
                  <a href={telLink(settings.phone)} style={{ color: 'var(--accent)' }}>{settings.phone}</a>
                </li>
              )}
              {settings?.whatsapp && (
                <li className="flex" style={{ gap: 12 }}>
                  <span>💬</span>
                  <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>WhatsApp: {settings.whatsapp}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex" style={{ gap: 12 }}>
                  <span>✉️</span>
                  <a href={`mailto:${settings.email}`} style={{ color: 'var(--accent)' }}>{settings.email}</a>
                </li>
              )}
              {settings?.address && (
                <li className="flex" style={{ gap: 12, alignItems: 'flex-start' }}>
                  <span>📍</span><span>{settings.address}</span>
                </li>
              )}
              {settings?.opening_hours && (
                <li className="flex" style={{ gap: 12, alignItems: 'flex-start' }}>
                  <span>🕒</span><span>{settings.opening_hours}</span>
                </li>
              )}
            </ul>

            <div className="flex mt-4">
              {settings?.phone && <a href={telLink(settings.phone)} className="btn btn-outline btn-sm">CALL NOW</a>}
              {settings?.whatsapp && (
                <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">WHATSAPP</a>
              )}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="mb-3">Send a Message</h2>
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="cname">Name *</label>
              <input id="cname" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="cphone">Phone *</label>
              <input id="cphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="cemail">Email</label>
              <input id="cemail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="cmsg">Message *</label>
              <textarea id="cmsg" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
