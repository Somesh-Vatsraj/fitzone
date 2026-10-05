import { useMemo, useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import AdminTable from './AdminTable.jsx';
import Modal, { ConfirmDialog } from '../components/Modal.jsx';
import { Field, Input, Toggle, FormGrid } from '../components/Form.jsx';
import { formatINR } from '../utils/helpers.js';

const emptyPlan = { name: '', amount: '', duration: '', features: [''], popular: false, enabled: true };

export default function MembershipAdmin() {
  const { plans, createPlan, updatePlan, deletePlan } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [errors, setErrors] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () => plans.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [plans, query]
  );

  const openAdd = () => { setEditing(null); setForm({ ...emptyPlan, features: [''] }); setErrors({}); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, amount: String(p.amount), features: [...p.features] }); setErrors({}); setOpen(true); };
  const setFeature = (i, v) => setForm((f) => ({ ...f, features: f.features.map((x, idx) => (idx === i ? v : x)) }));
  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, ''] }));
  const removeFeature = (i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (form.amount === '' || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Valid amount';
    if (!form.duration.trim()) e.duration = 'Required';
    if (!form.features.map((f) => f.trim()).filter(Boolean).length) e.features = 'At least one feature';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (ev) => {
    ev.preventDefault();
    if (!validate()) { toast.error('Fix errors'); return; }
    const payload = {
      name: form.name.trim(), amount: Number(form.amount), duration: form.duration.trim(),
      features: form.features.map((f) => f.trim()).filter(Boolean),
      popular: !!form.popular, enabled: !!form.enabled,
    };
    try {
      setSaving(true);
      if (editing) { await updatePlan(editing.id, payload); toast.success('Updated'); }
      else { await createPlan(payload); toast.success('Added'); }
      setOpen(false);
    } catch (e) { toast.error(`Failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const toggleEnabled = async (plan) => {
    try { await updatePlan(plan.id, { ...plan, enabled: !plan.enabled }); toast.info('Updated'); }
    catch (e) { toast.error(e.message); }
  };

  const confirmDelete = async () => {
    try { await deletePlan(confirmTarget.id); toast.success('Deleted'); setConfirmTarget(null); }
    catch (e) { toast.error(e.message); }
  };

  const columns = [
    { key: 'name', header: 'Plan', render: (r) => (
      <div className="cell-stack"><strong>{r.name}</strong>
        {r.popular ? <span className="badge badge--accent">Popular</span> : null}</div>
    )},
    { key: 'amount', header: 'Amount', render: (r) => formatINR(r.amount) },
    { key: 'duration', header: 'Duration' },
    { key: 'features', header: 'Features', render: (r) => `${r.features.length} included` },
    { key: 'enabled', header: 'Status', render: (r) => (
      <span className={`badge ${r.enabled ? 'badge--green' : 'badge--muted'}`}>
        {r.enabled ? 'Enabled' : 'Disabled'}
      </span>
    )},
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Membership Plans</h2><p className="muted">Manage plans shown on your site.</p></div>
        <div className="admin-page__actions">
          <input className="input input--sm" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn btn--primary btn--sm" onClick={openAdd}>+ Add Plan</button>
        </div>
      </div>

      <div className="panel">
        <AdminTable columns={columns} rows={filtered} empty="No plans yet."
          actions={(row) => (
            <div className="row-actions">
              <button className="btn btn--ghost btn--sm" onClick={() => openEdit(row)}>Edit</button>
              <button className="btn btn--ghost btn--sm" onClick={() => toggleEnabled(row)}>
                {row.enabled ? 'Disable' : 'Enable'}
              </button>
              <button className="btn btn--danger btn--sm" onClick={() => setConfirmTarget(row)}>Delete</button>
            </div>
          )}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add New Plan'}
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
            <Field label="Plan Name" error={errors.name}>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Amount (₹)" error={errors.amount}>
              <Input type="number" min="1" value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </Field>
            <Field label="Duration" error={errors.duration} full>
              <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
            </Field>
          </FormGrid>
          <div className="field">
            <span className="field__label">Features</span>
            {errors.features ? <span className="field__error">{errors.features}</span> : null}
            <div className="repeat-list">
              {form.features.map((f, i) => (
                <div key={i} className="repeat-row repeat-row--tight">
                  <Input value={f} placeholder={`Feature ${i + 1}`} onChange={(e) => setFeature(i, e.target.value)} />
                  <button type="button" className="btn btn--danger btn--sm" onClick={() => removeFeature(i)}>✕</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={addFeature}>+ Add Feature</button>
          </div>
          <div className="toggle-row">
            <Toggle checked={form.popular} onChange={(v) => setForm((f) => ({ ...f, popular: v }))} label="Mark as popular" />
            <Toggle checked={form.enabled} onChange={(v) => setForm((f) => ({ ...f, enabled: v }))} label="Visible on site" />
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmTarget} title="Delete plan?"
        message={confirmTarget ? `"${confirmTarget.name}" will be removed.` : ''}
        onCancel={() => setConfirmTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
