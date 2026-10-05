import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

const EMPTY = { name: '', amount: 0, duration: '', description: '', status: 'active', sort_order: 0, features: [''] };

export default function MembershipManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { applySEO({ title: 'Memberships', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try { setPlans(await api.memberships.list(true) || []); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const save = async (e) => {
    e.preventDefault();
    if (!form.name || form.amount === '' || !form.duration) { toast.error('Name, amount, duration required'); return; }
    try {
      if (editId) await api.memberships.update(editId, form);
      else await api.memberships.create(form);
      toast.success('Saved');
      setForm(EMPTY); setEditId(null);
      await load();
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    try { await api.memberships.remove(id); toast.success('Deleted'); await load(); }
    catch (e) { toast.error(e.message); }
    finally { setConfirm(null); }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name, amount: p.amount, duration: p.duration, description: p.description || '',
      status: p.status, sort_order: p.sort_order, features: p.features?.length ? p.features : ['']
    });
  };

  const toggleStatus = async (p) => {
    try {
      await api.memberships.update(p.id, { ...p, status: p.status === 'active' ? 'inactive' : 'active' });
      await load();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <form onSubmit={save} className="admin-card">
        <h2>{editId ? 'Edit Plan' : 'Add Membership Plan'}</h2>
        <div className="form-row">
          <div className="form-group"><label>Plan Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Amount *</label><input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} required /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Duration *</label><input placeholder="e.g. 1 Month" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required /></div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
        <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div className="form-group">
          <label>Features</label>
          {form.features.map((f, i) => (
            <div key={i} className="feat-item-row">
              <input value={f} onChange={e => {
                const arr = [...form.features]; arr[i] = e.target.value; setForm({ ...form, features: arr });
              }} placeholder="Feature" />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                const arr = form.features.filter((_, idx) => idx !== i);
                setForm({ ...form, features: arr.length ? arr : [''] });
              }}>×</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => setForm({ ...form, features: [...form.features, ''] })}>+ Add Feature</button>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex">
          <button className="btn btn-primary" disabled={!form.name}>{editId ? 'Update Plan' : 'Add Plan'}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      <div className="admin-card">
        <h2>All Plans</h2>
        {loading ? <Loading /> : plans.length === 0 ? (
          <p className="text-muted">No membership plans yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Amount</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {plans.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>₹{Number(p.amount).toLocaleString()}</td>
                    <td>{p.duration}</td>
                    <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                    <td className="action-row">
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(p)}>{p.status === 'active' ? 'Disable' : 'Enable'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: p.id })}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirm}
        title="Delete plan"
        message="Delete this membership plan permanently?"
        confirmText="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => remove(confirm.id)}
      />
    </>
  );
}
