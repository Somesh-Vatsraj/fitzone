import { useMemo, useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import AdminTable from './AdminTable.jsx';
import Modal, { ConfirmDialog } from '../components/Modal.jsx';
import { Field, Input, FormGrid } from '../components/Form.jsx';
import { onImgError } from '../utils/helpers.js';

const emptyTrainer = { name: '', specialization: '', experience: '', phone: '', email: '', image: '' };

export default function TrainersAdmin() {
  const { trainers, createTrainer, updateTrainer, deleteTrainer } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTrainer);
  const [errors, setErrors] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => trainers.filter((t) => {
    const q = query.trim().toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q);
  }), [trainers, query]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const openAdd = () => { setEditing(null); setForm(emptyTrainer); setErrors({}); setOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ ...t }); setErrors({}); setOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.specialization.trim()) e.specialization = 'Required';
    if (!form.experience.trim()) e.experience = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Invalid phone';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid email';
    if (!form.image.trim()) e.image = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (ev) => {
    ev.preventDefault();
    if (!validate()) { toast.error('Fix errors'); return; }
    const payload = {
      name: form.name.trim(), specialization: form.specialization.trim(),
      experience: form.experience.trim(), phone: form.phone.trim(),
      email: form.email.trim(), image: form.image.trim(),
    };
    try {
      setSaving(true);
      if (editing) { await updateTrainer(editing.id, payload); toast.success('Updated'); }
      else { await createTrainer(payload); toast.success('Added'); }
      setOpen(false);
    } catch (e) { toast.error(`Failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await deleteTrainer(confirmTarget.id); toast.success('Deleted'); setConfirmTarget(null); }
    catch (e) { toast.error(e.message); }
  };

  const columns = [
    { key: 'name', header: 'Trainer', render: (r) => (
      <div className="cell-user">
        <img src={r.image} alt={r.name} onError={onImgError} />
        <div><strong>{r.name}</strong><small className="muted">{r.email || '—'}</small></div>
      </div>
    )},
    { key: 'specialization', header: 'Specialization' },
    { key: 'experience', header: 'Experience' },
    { key: 'phone', header: 'Contact' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Trainers</h2><p className="muted">Manage your coaching team.</p></div>
        <div className="admin-page__actions">
          <input className="input input--sm" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn btn--primary btn--sm" onClick={openAdd}>+ Add Trainer</button>
        </div>
      </div>

      <div className="panel">
        <AdminTable columns={columns} rows={filtered} empty="No trainers yet."
          actions={(row) => (
            <div className="row-actions">
              <button className="btn btn--ghost btn--sm" onClick={() => openEdit(row)}>Edit</button>
              <button className="btn btn--danger btn--sm" onClick={() => setConfirmTarget(row)}>Delete</button>
            </div>
          )}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add New Trainer'}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save' : 'Add'}
            </button>
          </>
        }>
        <form onSubmit={save}>
          <FormGrid cols={2}>
            <Field label="Full Name" error={errors.name}><Input value={form.name} onChange={set('name')} /></Field>
            <Field label="Specialization" error={errors.specialization}><Input value={form.specialization} onChange={set('specialization')} /></Field>
            <Field label="Experience" error={errors.experience}><Input value={form.experience} onChange={set('experience')} /></Field>
            <Field label="Phone" error={errors.phone}><Input value={form.phone} onChange={set('phone')} /></Field>
            <Field label="Email (optional)" error={errors.email} full><Input type="email" value={form.email} onChange={set('email')} /></Field>
            <Field label="Photo URL" error={errors.image} full><Input value={form.image} onChange={set('image')} /></Field>
          </FormGrid>
          {form.image ? <div className="image-preview image-preview--avatar"><img src={form.image} alt="Preview" onError={onImgError} /></div> : null}
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmTarget} title="Remove trainer?"
        message={confirmTarget ? `${confirmTarget.name} will be removed.` : ''}
        onCancel={() => setConfirmTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
