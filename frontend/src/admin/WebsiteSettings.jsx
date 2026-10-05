import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Field, Input, Textarea, FormGrid } from '../components/Form.jsx';
import { ConfirmDialog } from '../components/Modal.jsx';

export default function WebsiteSettings() {
  const { site, updateSettings, refresh, members, clearMembers } = useStore();
  const toast = useToast();
  const [form, setForm] = useState({ ...site });
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClearMembers, setConfirmClearMembers] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.siteName.trim()) e.siteName = 'Required';
    if (!form.tagline.trim()) e.tagline = 'Required';
    if (!form.aboutTitle.trim()) e.aboutTitle = 'Required';
    if (!form.aboutText.trim()) e.aboutText = 'Required';
    if (!form.footerText.trim()) e.footerText = 'Required';
    setErrors(e);
    if (Object.keys(e).length) { toast.error('Fix errors'); return; }
    try {
      setSaving(true);
      await updateSettings('site', {
        siteName: form.siteName.trim(), tagline: form.tagline.trim(),
        footerText: form.footerText.trim(), aboutTitle: form.aboutTitle.trim(),
        aboutText: form.aboutText.trim(),
      });
      toast.success('Saved');
    } catch (e) { toast.error(`Failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const onReset = async () => {
    setConfirmReset(false);
    await refresh();
    toast.success('Reloaded from server');
  };

  const onClearMembers = async () => {
    try { await clearMembers(); setConfirmClearMembers(false); toast.success('Members cleared'); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Website Settings</h2><p className="muted">Brand and about content.</p></div>
      </div>

      <form onSubmit={save} className="panel panel--form">
        <h3 className="panel__title">Brand</h3>
        <FormGrid cols={2}>
          <Field label="Site Name" error={errors.siteName}><Input value={form.siteName} onChange={set('siteName')} /></Field>
          <Field label="Tagline" error={errors.tagline}><Input value={form.tagline} onChange={set('tagline')} /></Field>
          <Field label="Footer Description" error={errors.footerText} full>
            <Textarea value={form.footerText} onChange={set('footerText')} rows={3} />
          </Field>
        </FormGrid>
        <h3 className="panel__title mt-32">About Page</h3>
        <FormGrid cols={1}>
          <Field label="About Heading" error={errors.aboutTitle}><Input value={form.aboutTitle} onChange={set('aboutTitle')} /></Field>
          <Field label="About Description" error={errors.aboutText}>
            <Textarea value={form.aboutText} onChange={set('aboutText')} rows={6} />
          </Field>
        </FormGrid>
        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={() => {
            setForm({ ...site }); setErrors({}); toast.info('Discarded');
          }}>Discard</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>

      <div className="panel panel--danger">
        <h3 className="panel__title">Demo Data</h3>
        <p className="muted">Data is stored in Cloudflare D1. Reset reloads from server.</p>
        <div className="danger-actions">
          <button className="btn btn--ghost" onClick={() => setConfirmClearMembers(true)} disabled={!members.length}>
            Clear Members ({members.length})
          </button>
          <button className="btn btn--danger" onClick={() => setConfirmReset(true)}>Reload From Server</button>
        </div>
      </div>

      <ConfirmDialog open={confirmReset} title="Reload from server?"
        message="This will fetch latest data from D1." confirmText="Reload"
        onCancel={() => setConfirmReset(false)} onConfirm={onReset} />

      <ConfirmDialog open={confirmClearMembers} title="Clear members?"
        message="Demo member records will be removed." confirmText="Clear"
        onCancel={() => setConfirmClearMembers(false)} onConfirm={onClearMembers} />
    </div>
  );
}
