import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

const SOCIALS = ['instagram', 'facebook', 'youtube', 'twitter', 'whatsapp'];

export default function WebsiteSettings() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [social, setSocial] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { applySEO({ title: 'Website Settings', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [s, soc] = await Promise.all([api.settings.get(), api.social.list()]);
      setSettings(s || {});
      const map = {};
      for (const p of SOCIALS) map[p] = (soc || []).find(x => x.platform === p)?.url || '';
      setSocial(map);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.settings.update(settings);
      const links = SOCIALS.map((p, i) => ({ platform: p, url: social[p] || '', sort_order: i }));
      await api.social.update(links);
      toast.success('Settings saved');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={save}>
      <div className="admin-card">
        <h2>Brand</h2>
        <div className="form-row">
          <div className="form-group"><label>Gym Name</label><input value={settings.gym_name || ''} onChange={e => setSettings({ ...settings, gym_name: e.target.value })} /></div>
          <div className="form-group"><label>Logo Text</label><input value={settings.logo_text || ''} onChange={e => setSettings({ ...settings, logo_text: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Logo Image URL</label><input value={settings.logo_url || ''} onChange={e => setSettings({ ...settings, logo_url: e.target.value })} placeholder="https://..." /></div>
      </div>

      <div className="admin-card">
        <h2>Contact Information</h2>
        <div className="form-row">
          <div className="form-group"><label>Phone Number</label><input value={settings.phone || ''} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
          <div className="form-group"><label>WhatsApp Number</label><input value={settings.whatsapp || ''} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Email</label><input type="email" value={settings.email || ''} onChange={e => setSettings({ ...settings, email: e.target.value })} /></div>
        <div className="form-group"><label>Address</label><textarea value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} /></div>
        <div className="form-group"><label>Opening Hours</label><input value={settings.opening_hours || ''} onChange={e => setSettings({ ...settings, opening_hours: e.target.value })} placeholder="Mon–Sun: 6:00 AM – 10:00 PM" /></div>
        <div className="form-group"><label>Footer Text</label><textarea value={settings.footer_text || ''} onChange={e => setSettings({ ...settings, footer_text: e.target.value })} /></div>
      </div>

      <div className="admin-card">
        <h2>Social Links</h2>
        {SOCIALS.map(p => (
          <div key={p} className="form-group">
            <label style={{ textTransform: 'capitalize' }}>{p}</label>
            <input value={social[p] || ''} onChange={e => setSocial({ ...social, [p]: e.target.value })} placeholder={`https://${p}.com/...`} />
          </div>
        ))}
      </div>

      <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
    </form>
  );
}
