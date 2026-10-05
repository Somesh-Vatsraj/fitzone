import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Field, Input, Textarea, FormGrid } from '../components/Form.jsx';
import { ConfirmDialog } from '../components/Modal.jsx';

export default function ContactSettings() {
  const { contact, updateSettings, messages, deleteMessage, clearMessages } = useStore();
  const toast = useToast();
  const [form, setForm] = useState({ ...contact });
  const [errors, setErrors] = useState({});
  const [confirmClear, setConfirmClear] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.phone.trim()) e.phone = 'Required';
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Invalid phone';
    if (!form.whatsapp.trim()) e.whatsapp = 'Required';
    if (!form.paytm.trim()) e.paytm = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.hours.trim()) e.hours = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (ev) => {
    ev.preventDefault();
    if (!validate()) { toast.error('Fix errors'); return; }
    try {
      setSaving(true);
      await updateSettings('contact', {
        phone: form.phone.trim(), whatsapp: form.whatsapp.trim(),
        paytm: form.paytm.trim(), email: form.email.trim(),
        address: form.address.trim(), hours: form.hours.trim(),
      });
      toast.success('Saved');
    } catch (e) { toast.error(`Failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteMessage(id); toast.success('Deleted'); } catch (e) { toast.error(e.message); }
  };

  const handleClearAll = async () => {
    try { await clearMessages(); setConfirmClear(false); toast.success('Cleared'); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Contact Settings</h2><p className="muted">Shown on footer, contact page and modal.</p></div>
      </div>

      <form onSubmit={save} className="panel panel--form">
        <h3 className="panel__title">Contact Details</h3>
        <FormGrid cols={2}>
          <Field label="Contact Number" error={errors.phone}><Input value={form.phone} onChange={set('phone')} /></Field>
          <Field label="WhatsApp Number" error={errors.whatsapp}><Input value={form.whatsapp} onChange={set('whatsapp')} /></Field>
          <Field label="Paytm Number" error={errors.paytm} hint="Shown to customers"><Input value={form.paytm} onChange={set('paytm')} /></Field>
          <Field label="Email" error={errors.email}><Input type="email" value={form.email} onChange={set('email')} /></Field>
          <Field label="Address" error={errors.address} full><Textarea value={form.address} onChange={set('address')} rows={3} /></Field>
          <Field label="Opening Hours" error={errors.hours} full><Input value={form.hours} onChange={set('hours')} /></Field>
        </FormGrid>
        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={() => {
            setForm({ ...contact }); setErrors({}); toast.info('Discarded');
          }}>Discard</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>

      <div className="panel">
        <div className="panel__head">
          <h3>Enquiries ({messages.length})</h3>
          {messages.length ? <button className="btn btn--danger btn--sm" onClick={() => setConfirmClear(true)}>Clear All</button> : null}
        </div>
        {messages.length === 0 ? <p className="muted">No enquiries yet.</p> : (
          <div className="message-list">
            {messages.map((m) => (
              <div key={m.id} className="message-card">
                <div className="message-card__head">
                  <div><strong>{m.name}</strong><span className="muted"> · {m.createdAt}</span></div>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(m.id)}>Delete</button>
                </div>
                <div className="message-card__meta">
                  <a href={`mailto:${m.email}`}>{m.email}</a><span>·</span>
                  <a href={`tel:${m.phone}`}>{m.phone}</a>
                </div>
                <p>{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog open={confirmClear} title="Clear all enquiries?"
        message="Every enquiry will be permanently deleted." confirmText="Clear All"
        onCancel={() => setConfirmClear(false)} onConfirm={handleClearAll} />
    </div>
  );
}
