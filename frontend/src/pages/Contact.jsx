import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Field, Input, Textarea } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';
import { telLink, waLink } from '../utils/helpers.js';

const emptyForm = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const { contact, createMessage } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!contact) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim()) e.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone required';
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter valid phone';
    if (!form.message.trim()) e.message = 'Message required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) { toast.error('Fix highlighted fields'); return; }
    try {
      setSubmitting(true);
      await createMessage(form);
      setForm(emptyForm); setErrors({}); setSent(true);
      toast.success('Message sent!');
    } catch (e) { toast.error(`Failed: ${e.message}`); }
    finally { setSubmitting(false); }
  };

  const mapQuery = encodeURIComponent(contact.address);

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHead eyebrow="Get in touch" title="CONTACT FITZONE"
          description="Call, WhatsApp or send us a message." />

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <span className="info-card__icon">📍</span>
              <div><h4>Address</h4><p>{contact.address}</p></div>
            </div>
            <div className="info-card">
              <span className="info-card__icon">📞</span>
              <div><h4>Contact</h4><a href={telLink(contact.phone)}>{contact.phone}</a></div>
            </div>
            <div className="info-card">
              <span className="info-card__icon">💳</span>
              <div><h4>Paytm</h4><p className="highlight">{contact.paytm}</p>
                <small className="muted">Manual payment only.</small></div>
            </div>
            <div className="info-card">
              <span className="info-card__icon">💬</span>
              <div><h4>WhatsApp</h4><a href={waLink(contact.whatsapp)} target="_blank" rel="noreferrer">{contact.whatsapp}</a></div>
            </div>
            <div className="info-card">
              <span className="info-card__icon">🕒</span>
              <div><h4>Hours</h4><p>{contact.hours}</p></div>
            </div>
            <div className="info-card">
              <span className="info-card__icon">✉️</span>
              <div><h4>Email</h4><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h3 className="contact-form__title">Send us a message</h3>
            {sent ? (
              <div className="alert alert--success">
                ✅ Thanks! We'll contact you soon.
                <button className="alert__close" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : null}
            <form onSubmit={submit} noValidate>
              <Field label="Full Name" error={errors.name}>
                <Input value={form.name} onChange={set('name')} placeholder="Your name" />
              </Field>
              <div className="form-grid" style={{ '--cols': 2 }}>
                <Field label="Email" error={errors.email}>
                  <Input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <Input value={form.phone} onChange={set('phone')} placeholder="+91 90000 00000" />
                </Field>
              </div>
              <Field label="Message" error={errors.message}>
                <Textarea value={form.message} onChange={set('message')} rows={5} placeholder="Your message…" />
              </Field>
              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="map-placeholder">
          <div className="map-placeholder__inner">
            <span className="map-placeholder__pin">📍</span>
            <h3>Find us here</h3>
            <p>{contact.address}</p>
            <a className="btn btn--ghost"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank" rel="noreferrer">Open in Google Maps →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
