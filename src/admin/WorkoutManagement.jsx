import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

const EMPTY = { name: '', category: '', image_url: '', sets: '', reps: '', difficulty: '', description: '', status: 'active', sort_order: 0 };

export default function WorkoutManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [newCat, setNewCat] = useState('');

  useEffect(() => { applySEO({ title: 'Workouts', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [w, c] = await Promise.all([api.workouts.list(true), api.categories.list()]);
      setItems(w || []); setCats(c || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const save = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name required'); return; }
    try {
      if (editId) await api.workouts.update(editId, form);
      else await api.workouts.create(form);
      toast.success('Saved');
      setForm(EMPTY); setEditId(null);
      await load();
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    try { await api.workouts.remove(id); toast.success('Deleted'); await load(); }
    catch (e) { toast.error(e.message); }
    finally { setConfirm(null); }
  };

  const addCat = async () => {
    if (!newCat.trim()) return;
    try {
      await api.categories.create({ name: newCat.trim() });
      setNewCat(''); await load();
    } catch (e) { toast.error(e.message); }
  };

  const removeCat = async (id) => {
    try { await api.categories.remove(id); await load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <form onSubmit={save} className="admin-card">
        <h2>{editId ? 'Edit Workout' : 'Add Workout'}</h2>
        <div className="form-row">
          <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">— None —</option>
              {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label>Image URL</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
        <div className="form-row">
          <div className="form-group"><label>Sets</label><input value={form.sets} onChange={e => setForm({ ...form, sets: e.target.value })} /></div>
          <div className="form-group"><label>Reps</label><input value={form.reps} onChange={e => setForm({ ...form, reps: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Difficulty</label><input value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} placeholder="Beginner/Intermediate/Advanced" /></div>
          <div className="form-group"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        </div>
        <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex">
          <button className="btn btn-primary">{editId ? 'Update' : 'Add'} Workout</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      <div className="admin-card">
        <h2>Workout Categories</h2>
        <div className="flex mb-3">
          <input placeholder="New category name" value={newCat} onChange={e => setNewCat(e.target.value)} style={{ flex: 1 }} />
          <button type="button" className="btn btn-primary btn-sm" onClick={addCat}>Add</button>
        </div>
        {cats.length === 0 ? (
          <p className="text-muted">No categories yet.</p>
        ) : (
          <div className="chips">
            {cats.map(c => (
              <span key={c.id} className="chip">
                {c.name} <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', marginLeft: 6 }} onClick={() => removeCat(c.id)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2>All Workouts</h2>
        {loading ? <Loading /> : items.length === 0 ? (
          <p className="text-muted">No workouts yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Category</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(w => (
                  <tr key={w.id}>
                    <td>{w.name}</td>
                    <td>{w.category || '—'}</td>
                    <td>{w.difficulty || '—'}</td>
                    <td><span className={`badge ${w.status}`}>{w.status}</span></td>
                    <td className="action-row">
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditId(w.id); setForm({ ...EMPTY, ...w }); }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: w.id })}>Delete</button>
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
        title="Delete workout"
        message="Delete this workout permanently?"
        confirmText="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => remove(confirm.id)}
      />
    </>
  );
}
