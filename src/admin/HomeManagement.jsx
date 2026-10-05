import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

const EMPTY_STAT = { label: '', value: '', icon: '', sort_order: 0, status: 'active' };
const EMPTY_FEAT = { title: '', description: '', icon: '', sort_order: 0, status: 'active' };

export default function HomeManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [home, setHome] = useState({});
  const [stats, setStats] = useState([]);
  const [features, setFeatures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [statForm, setStatForm] = useState(EMPTY_STAT);
  const [statEditId, setStatEditId] = useState(null);
  const [featForm, setFeatForm] = useState(EMPTY_FEAT);
  const [featEditId, setFeatEditId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { applySEO({ title: 'Home Management', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [h, s, f] = await Promise.all([api.home.get(), api.stats.list(true), api.features.list(true)]);
      setHome(h || {});
      setStats(s || []);
      setFeatures(f || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const saveHome = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.home.update(home);
      toast.success('Home content saved');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const saveStat = async (e) => {
    e.preventDefault();
    try {
      if (statEditId) await api.stats.update(statEditId, statForm);
      else await api.stats.create(statForm);
      toast.success('Saved');
      setStatForm(EMPTY_STAT); setStatEditId(null);
      const s = await api.stats.list(true); setStats(s || []);
    } catch (e) { toast.error(e.message); }
  };

  const saveFeat = async (e) => {
    e.preventDefault();
    try {
      if (featEditId) await api.features.update(featEditId, featForm);
      else await api.features.create(featForm);
      toast.success('Saved');
      setFeatForm(EMPTY_FEAT); setFeatEditId(null);
      const f = await api.features.list(true); setFeatures(f || []);
    } catch (e) { toast.error(e.message); }
  };

  const deleteStat = async (id) => {
    try {
      await api.stats.remove(id);
      toast.success('Deleted');
      setStats(await api.stats.list(true) || []);
    } catch (e) { toast.error(e.message); }
    finally { setConfirm(null); }
  };

  const deleteFeat = async (id) => {
    try {
      await api.features.remove(id);
      toast.success('Deleted');
      setFeatures(await api.features.list(true) || []);
    } catch (e) { toast.error(e.message); }
    finally { setConfirm(null); }
  };

  if (loading) return <Loading />;

  return (
    <>
      <form onSubmit={saveHome} className="admin-card">
        <h2>Hero Section</h2>
        <div className="form-row">
          <div className="form-group"><label>Badge</label><input value={home.hero_badge || ''} onChange={e => setHome({ ...home, hero_badge: e.target.value })} /></div>
          <div className="form-group"><label>Heading</label><input value={home.hero_heading || ''} onChange={e => setHome({ ...home, hero_heading: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Description</label><textarea value={home.hero_description || ''} onChange={e => setHome({ ...home, hero_description: e.target.value })} /></div>
        <div className="form-row">
          <div className="form-group"><label>Button Text</label><input value={home.hero_button_text || ''} onChange={e => setHome({ ...home, hero_button_text: e.target.value })} /></div>
          <div className="form-group"><label>Button Link</label><input value={home.hero_button_link || ''} onChange={e => setHome({ ...home, hero_button_link: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Hero Image URL</label><input value={home.hero_image_url || ''} onChange={e => setHome({ ...home, hero_image_url: e.target.value })} /></div>

        <h2 style={{ marginTop: 32 }}>About Section</h2>
        <div className="form-group"><label>About Heading</label><input value={home.about_heading || ''} onChange={e => setHome({ ...home, about_heading: e.target.value })} /></div>
        <div className="form-group"><label>About Description</label><textarea value={home.about_description || ''} onChange={e => setHome({ ...home, about_description: e.target.value })} /></div>
        <div className="form-group"><label>About Image URL</label><input value={home.about_image_url || ''} onChange={e => setHome({ ...home, about_image_url: e.target.value })} /></div>

        <h2 style={{ marginTop: 32 }}>CTA Section</h2>
        <div className="form-group"><label>CTA Heading</label><input value={home.cta_heading || ''} onChange={e => setHome({ ...home, cta_heading: e.target.value })} /></div>
        <div className="form-group"><label>CTA Description</label><textarea value={home.cta_description || ''} onChange={e => setHome({ ...home, cta_description: e.target.value })} /></div>
        <div className="form-row">
          <div className="form-group"><label>CTA Button Text</label><input value={home.cta_button_text || ''} onChange={e => setHome({ ...home, cta_button_text: e.target.value })} /></div>
          <div className="form-group"><label>CTA Button Link</label><input value={home.cta_button_link || ''} onChange={e => setHome({ ...home, cta_button_link: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Home Content'}</button>
      </form>

      <div className="admin-card">
        <h2>Gym Statistics</h2>
        <form onSubmit={saveStat} className="mb-4">
          <div className="form-row">
            <div className="form-group"><label>Label *</label><input value={statForm.label} onChange={e => setStatForm({ ...statForm, label: e.target.value })} required /></div>
            <div className="form-group"><label>Value *</label><input value={statForm.value} onChange={e => setStatForm({ ...statForm, value: e.target.value })} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Icon (emoji or text)</label><input value={statForm.icon} onChange={e => setStatForm({ ...statForm, icon: e.target.value })} /></div>
            <div className="form-group"><label>Sort Order</label><input type="number" value={statForm.sort_order} onChange={e => setStatForm({ ...statForm, sort_order: Number(e.target.value) })} /></div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={statForm.status} onChange={e => setStatForm({ ...statForm, status: e.target.value })}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex">
            <button className="btn btn-primary btn-sm">{statEditId ? 'Update' : 'Add'} Statistic</button>
            {statEditId && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setStatEditId(null); setStatForm(EMPTY_STAT); }}>Cancel</button>}
          </div>
        </form>

        {stats.length === 0 ? (
          <p className="text-muted">No statistics added yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Label</th><th>Value</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {stats.map(s => (
                  <tr key={s.id}>
                    <td>{s.label}</td><td>{s.value}</td>
                    <td><span className={`badge ${s.status}`}>{s.status}</span></td>
                    <td>{s.sort_order}</td>
                    <td className="action-row">
                      <button className="btn btn-outline btn-sm" onClick={() => { setStatEditId(s.id); setStatForm({ ...s }); }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: 'stat', id: s.id })}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2>Features</h2>
        <form onSubmit={saveFeat} className="mb-4">
          <div className="form-group"><label>Title *</label><input value={featForm.title} onChange={e => setFeatForm({ ...featForm, title: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label><textarea value={featForm.description} onChange={e => setFeatForm({ ...featForm, description: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label>Icon</label><input value={featForm.icon} onChange={e => setFeatForm({ ...featForm, icon: e.target.value })} /></div>
            <div className="form-group"><label>Sort Order</label><input type="number" value={featForm.sort_order} onChange={e => setFeatForm({ ...featForm, sort_order: Number(e.target.value) })} /></div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={featForm.status} onChange={e => setFeatForm({ ...featForm, status: e.target.value })}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex">
            <button className="btn btn-primary btn-sm">{featEditId ? 'Update' : 'Add'} Feature</button>
            {featEditId && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setFeatEditId(null); setFeatForm(EMPTY_FEAT); }}>Cancel</button>}
          </div>
        </form>

        {features.length === 0 ? (
          <p className="text-muted">No features added yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {features.map(f => (
                  <tr key={f.id}>
                    <td>{f.title}</td>
                    <td><span className={`badge ${f.status}`}>{f.status}</span></td>
                    <td>{f.sort_order}</td>
                    <td className="action-row">
                      <button className="btn btn-outline btn-sm" onClick={() => { setFeatEditId(f.id); setFeatForm({ ...f }); }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: 'feature', id: f.id })}>Delete</button>
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
        title="Delete item"
        message="Are you sure? This cannot be undone."
        confirmText="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm.type === 'stat' ? deleteStat(confirm.id) : deleteFeat(confirm.id)}
      />
    </>
  );
}
