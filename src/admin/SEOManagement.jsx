import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

const PAGES = ['home', 'workouts', 'trainers', 'membership', 'about', 'contact'];

export default function SEOManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('home');
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { applySEO({ title: 'SEO', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const list = await api.seo.list();
      const map = {};
      for (const p of PAGES) {
        const item = (list || []).find(x => x.page === p);
        map[p] = item || { page: p, title: '', description: '', keywords: '', canonical_url: '', og_title: '', og_description: '', og_image: '', twitter_title: '', twitter_description: '', twitter_image: '', robots: 'index,follow' };
      }
      setData(map);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const update = (field, value) => setData(d => ({ ...d, [active]: { ...d[active], [field]: value } }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.seo.update(data[active]);
      toast.success('SEO saved');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  const cur = data[active] || {};

  return (
    <>
      <div className="chips mb-4">
        {PAGES.map(p => (
          <button key={p} className={`chip ${active === p ? 'active' : ''}`} onClick={() => setActive(p)}>{p}</button>
        ))}
      </div>

      <form onSubmit={save} className="admin-card">
        <h2>SEO for: {active}</h2>
        <div className="form-group"><label>Page Title</label><input value={cur.title || ''} onChange={e => update('title', e.target.value)} /></div>
        <div className="form-group"><label>Meta Description</label><textarea value={cur.description || ''} onChange={e => update('description', e.target.value)} /></div>
        <div className="form-group"><label>Keywords (comma separated)</label><input value={cur.keywords || ''} onChange={e => update('keywords', e.target.value)} /></div>
        <div className="form-group"><label>Canonical URL</label><input value={cur.canonical_url || ''} onChange={e => update('canonical_url', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>OG Title</label><input value={cur.og_title || ''} onChange={e => update('og_title', e.target.value)} /></div>
          <div className="form-group"><label>OG Description</label><input value={cur.og_description || ''} onChange={e => update('og_description', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>OG Image URL</label><input value={cur.og_image || ''} onChange={e => update('og_image', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>Twitter Title</label><input value={cur.twitter_title || ''} onChange={e => update('twitter_title', e.target.value)} /></div>
          <div className="form-group"><label>Twitter Description</label><input value={cur.twitter_description || ''} onChange={e => update('twitter_description', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Twitter Image URL</label><input value={cur.twitter_image || ''} onChange={e => update('twitter_image', e.target.value)} /></div>
        <div className="form-group">
          <label>Robots</label>
          <select value={cur.robots || 'index,follow'} onChange={e => update('robots', e.target.value)}>
            <option value="index,follow">index,follow</option>
            <option value="noindex,nofollow">noindex,nofollow</option>
          </select>
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save SEO'}</button>
      </form>
    </>
  );
}
