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
        <h3
