import { telLink, whatsappLink } from '../utils/seo.js';

export default function ContactModal({ plan, settings, onClose }) {
  if (!plan) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>Contact to Join</h3>
          <button className="close-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: 16 }}>Contact us to join this membership.</p>
          <div style={{ padding: 16, background: 'var(--bg-3)', borderRadius: 8, marginBottom: 16 }}>
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <span className="text-muted">Plan</span>
              <strong>{plan.name}</strong>
            </div>
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <span className="text-muted">Amount</span>
              <strong>₹{Number(plan.amount).toLocaleString()}</strong>
            </div>
            <div className="flex-between">
              <span className="text-muted">Duration</span>
              <strong>{plan.duration}</strong>
            </div>
          </div>

          {settings?.phone && (
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <span className="text-muted">Phone</span>
              <strong>{settings.phone}</strong>
            </div>
          )}
          {settings?.whatsapp && (
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <span className="text-muted">WhatsApp</span>
              <strong>{settings.whatsapp}</strong>
            </div>
          )}
          {!settings?.phone && !settings?.whatsapp && (
            <p className="text-muted">Contact details are not available yet.</p>
          )}
        </div>
        <div className="modal-foot">
          {settings?.phone && <a href={telLink(settings.phone)} className="btn btn-outline">CALL NOW</a>}
          {settings?.whatsapp && (
            <a
              href={whatsappLink(settings.whatsapp, `Hi, I'm interested in the ${plan.name} membership plan.`)}
              target="_blank" rel="noopener noreferrer" className="btn btn-primary"
            >WHATSAPP</a>
          )}
          <button className="btn btn-ghost" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}
