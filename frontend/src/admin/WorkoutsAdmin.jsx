import { useMemo, useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import AdminTable from './AdminTable.jsx';
import Modal, { ConfirmDialog } from '../components/Modal.jsx';
import { Field, Input, Select, Textarea, FormGrid } from '../components/Form.jsx';
import { onImgError } from '../utils/helpers.js';

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Cardio', 'Abs'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const emptyWorkout = { name: '', category: CATEGORIES[0], sets: 3, reps: '10 - 12', difficulty: 'Beginner', description: '', image: '' };

export default function WorkoutsAdmin() {
  const { workouts, createWorkout, updateWorkout, deleteWorkout } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyWorkout);
  const [errors, setErrors] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => workouts.filter((w) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || w.name.toLowerCase().includes(q);
    const matchC = categoryFilter === 'All' || w.category === categoryFilter;
    return matchQ && matchC;
  }), [workouts, query, categoryFilter]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const openAdd = () => { setEditing(null); setForm(emptyWorkout); setErrors({}); setOpen(true); };
  const openEdit = (w) => { setEditing(w); setForm({ ...w, sets: String(w.sets) }); setErrors({}); setOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.category) e.category = 'Required';
    if (form.sets === '' || isNaN(Number(form.sets)) || Number(form.sets) < 1) e.sets = 'Valid sets';
    if (!String(form.reps).trim()) e.reps = 'Required';
    if (!form.difficulty) e.difficulty = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.image.trim()) e.image = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (ev) => {
    ev.preventDefault();
    if (!validate()) { toast.error('Fix errors'); return; }
    const payload = {
      name: form.name.trim(), category: form.category, sets: Number(form.sets),
      reps: String(form.reps).trim(), difficulty: form.difficulty,
      description: form.description.trim(), image: form.image.trim(),
    };
    try {
      setSaving(true);
      if (editing) { await updateWorkout(editing.id, payload); toast.success('Updated'); }
      else { await createWorkout(payload); toast.success('Added'); }
      setOpen(false);
    } catch (e) { toast.error(`Failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await deleteWorkout(confirmTarget.id); toast.success('Deleted'); setConfirmTarget(null); }
    catch (e) { toast.error(e.message); }
  };

  const columns = [
    { key: 'name', header: 'Exercise', render: (r) => (
      <div className="cell-user">
        <img src={r.image} alt={r.name} onError={onImgError} />
        <div><strong>{r.name}</strong><small className="muted">{r.category}</small></div>
      </div>
    )},
    { key: 'sets', header: 'Sets' },
    { key: 'reps', header: 'Reps' },
    { key: 'difficulty', header: 'Difficulty', render: (r) => (
      <span className={`badge badge--${(r.difficulty || '').toLowerCase()}`}>{r.difficulty}</span>
    )},
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Workouts</h2><p className="muted">Manage exercise library.</p></div>
        <div className="admin-page__actions">
          <input className="input input--sm" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input input--sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn--primary btn--sm" onClick={openAdd}>+ Add Workout</button>
        </div>
      </div>

      <div className="panel">
        <AdminTable columns={columns} rows={filtered} empty="No workouts match."
          actions={(row) => (
            <div className="row-actions">
              <button className="btn btn--ghost btn--sm" onClick={() => openEdit(row)}>Edit</button>
              <button className="btn btn--danger btn--sm" onClick={() => setConfirmTarget(row)}>Delete</button>
            </div>
          )}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add New Workout'}
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
            <Field label="Exercise Name" error={errors.name} full><Input value={form.name} onChange={set('name')} /></Field>
            <Field label="Category" error={errors.category}>
              <Select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Difficulty" error={errors.difficulty}>
              <Select value={form.difficulty} onChange={set('difficulty')}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Sets" error={errors.sets}><Input type="number" min="1" value={form.sets} onChange={set('sets')} /></Field>
            <Field label="Reps" error={errors.reps}><Input value={form.reps} onChange={set('reps')} /></Field>
            <Field label="Description" error={errors.description} full><Textarea value={form.description} onChange={set('description')} rows={4} /></Field>
            <Field label="Image URL" error={errors.image} full><Input value={form.image} onChange={set('image')} /></Field>
          </FormGrid>
          {form.image ? <div className="image-preview"><img src={form.image} alt="Preview" onError={onImgError} /></div> : null}
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmTarget} title="Delete workout?"
        message={confirmTarget ? `"${confirmTarget.name}" will be removed.` : ''}
        onCancel={() => setConfirmTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
