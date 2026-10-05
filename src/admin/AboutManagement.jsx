import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

export default function AboutManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ heading: '', description: '', mission: '', vision: '', story: '', image_url: '', features: [''] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { applySEO({ title: 'About', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const a = await api.about.get();
      setForm({
        heading: a.heading || '', description: a.description || '', mission: a.mission || '',
        vision: a.vision || '', story: a.story || '', image_url: a.image_url || '',
        features: a.features?.length ? a.features : ['']
      });
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.about.update(form);
      toast.success('About saved');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={save} className="admin-card">
      <h2>About Content</h2>
      <div className="form-group"><label>Heading</label><input value={form.heading} onChange={e => setForm({ ...form, heading: e.target.value })} /></div>
      <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div className="form-group"><label>Image URL</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
      <div className="form-row">
        <div className="form-group"><label>Mission</label><textarea value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} /></div>
        <div className="form-group"><label>Vision</label><textarea value={form.vision} onChange={e => setForm({ ...form, vision: e.target.value })} /></div>
      </div>
      <div className="form-group"><label>Story</label><textarea value={form.story} onChange={e => setForm({ ...form, story: e.target.value })} style={{ minHeight: 140 }} /></div>

      <div className="form-group">
        <label>Features / Highlights</label>
        {form.features.map((f, i) => (
          <div key={i} className="feat-item-row">
            <input value={f} onChange={e => {
              const arr = [...form.features]; arr[i] = e.target.value; setForm({ ...form, features: arr });
            }} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
              const arr = form.features.filter((_, idx) => idx !== i);
              setForm({ ...form, features: arr.length ? arr : [''] });
            }}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => setForm({ ...form, features: [...form.features, ''] })}>+ Add Feature</button>
      </div>

      <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
