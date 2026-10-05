import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

const EMPTY = { name: '', image_url: '', specialization: '', experience: '', bio: '', contact_number: '', status: 'active', sort_order: 0 };

export default function TrainerManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { applySEO({ title: 'Trainers', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await api.trainers.list(true) || []); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const save = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name required'); return; }
    try {
      if (editId) await api.trainers.update(editId, form);
      else await api.trainers.create(form);
      toast.success('Saved');
      setForm(EMPTY); setEditId(null);
      await load();
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    try { await api.trainers.remove(id); toast.success('Deleted'); await load(); }
    catch (e) { toast.error(e.message); }
    finally { setConfirm(null); }
  };

  return (
    <>
      <form onSubmit={save} className="admin-card">
        <h2>{editId ? 'Edit Trainer' : 'Add Trainer'}</h2>
        <div className="form-row">
          <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Specialization</label><input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Image URL</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
        <div className="form-row">
          <div className="form-group"><label>Experience</label><input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 5 years" /></div>
          <div className="form-group"><label>Contact Number</label><input value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
        <div className="flex">
          <button className="btn btn-primary">{editId ? 'Update' : 'Add'} Trainer</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      <div className="admin-card">
        <h2>All Trainers</h2>
        {loading ? <Loading /> : items.length === 0 ? (
          <p className="text-muted">No trainers yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Specialization</th><th>Experience</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td>{t.specialization || '—'}</td>
                    <td>{t.experience || '—'}</td>
                    <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                    <td className="action-row">
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditId(t.id); setForm({ ...EMPTY, ...t }); }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: t.id })}>Delete</button>
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
        title="Delete trainer"
        message="Delete this trainer permanently?"
        confirmText="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => remove(confirm.id)}
      />
    </>
  );
}
