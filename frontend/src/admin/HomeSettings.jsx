import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Field, Input, Textarea, FormGrid } from '../components/Form.jsx';
import { uid, onImgError } from '../utils/helpers.js';

export default function HomeSettings() {
  const { home, updateSettings } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(home)));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setStat = (id, k, v) => setForm((f) => ({
    ...f, stats: f.stats.map((s) => (s.id === id ? { ...s, [k]: v } : s)),
  }));
  const addStat = () => setForm((f) => ({ ...f, stats: [...f.stats, { id: uid('st'), value: '', label: '' }] }));
  const removeStat = (id) => setForm((f) => ({ ...f, stats: f.stats.filter((s) => s.id !== id) }));

  const validate = () => {
    const e = {};
    if (!form.heroHeading.trim()) e.heroHeading = 'Required';
    if (!form.heroDescription.trim()) e.heroDescription = 'Required';
    if (!form.heroImage.trim()) e.heroImage = 'Required';
    if (!form.ctaText.trim()) e.ctaText = 'Required';
    if (form.stats.some((s) => !s.value.trim() || !s.label.trim())) e.stats = 'All stats need value + label';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Fix highlighted fields'); return; }
    try { setSaving(true); await updateSettings('home', form); toast.success('Home settings saved'); }
    catch (e) { toast.error(`Save failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Home Settings</h2><p className="muted">Update hero, stats and CTA.</p></div>
      </div>
      <form onSubmit={save} className="panel panel--form">
        <h3 className="panel__title">Hero Section</h3>
        <FormGrid cols={2}>
          <Field label="Hero Badge"><Input value={form.heroBadge} onChange={set('heroBadge')} /></Field>
          <Field label="CTA Text" error={errors.ctaText}><Input value={form.ctaText} onChange={set('ctaText')} /></Field>
          <Field label="Hero Heading" error={errors.heroHeading} full><Input value={form.heroHeading} onChange={set('heroHeading')} /></Field>
          <Field label="Hero Description" error={errors.heroDescription} full>
            <Textarea value={form.heroDescription} onChange={set('heroDescription')} rows={4} />
          </Field>
          <Field label="Hero Image URL" error={errors.heroImage} full><Input value={form.heroImage} onChange={set('heroImage')} /></Field>
        </FormGrid>
        {form.heroImage ? <div className="image-preview"><img src={form.heroImage} alt="Preview" onError={onImgError} /></div> : null}

        <h3 className="panel__title mt-32">Statistics</h3>
        {errors.stats ? <div className="alert alert--error">{errors.stats}</div> : null}
        <div className="repeat-list">
          {form.stats.map((s, i) => (
            <div key={s.id} className="repeat-row">
              <span className="repeat-row__index">{i + 1}</span>
              <Input placeholder="Value" value={s.value} onChange={(e) => setStat(s.id, 'value', e.target.value)} />
              <Input placeholder="Label" value={s.label} onChange={(e) => setStat(s.id, 'label', e.target.value)} />
              <button type="button" className="btn btn--danger btn--sm" onClick={() => removeStat(s.id)}>Remove</button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={addStat}>+ Add Statistic</button>

        <h3 className="panel__title mt-32">Call To Action</h3>
        <FormGrid cols={1}>
          <Field label="CTA Heading"><Input value={form.ctaTitle} onChange={set('ctaTitle')} /></Field>
          <Field label="CTA Description"><Textarea value={form.ctaDescription} onChange={set('ctaDescription')} rows={3} /></Field>
        </FormGrid>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={() => {
            setForm(JSON.parse(JSON.stringify(home))); setErrors({}); toast.info('Discarded');
          }}>Discard</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
