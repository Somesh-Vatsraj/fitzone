import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { telLink, whatsappLink } from '../utils/seo.js';

const SOCIAL_ICONS = {
  instagram: '📷', facebook: '📘', youtube: '▶️', twitter: '🐦', x: '𝕏', whatsapp: '💬'
};

export default function Footer() {
  const { data: settings } = useApi(() => api.settings.get(), []);
  const { data: social } = useApi(() => api.social.list(), []);
  const gymName = settings?.logo_text || settings?.gym_name || '';
  const year = new Date().getFullYear();

  const activeSocial = (social || []).filter(s => s.url);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 style={{ marginBottom: 12 }}>{gymName || 'Fitness'}</h3>
            {settings?.footer_text && <p className="footer-about">{settings.footer_text}</p>}
            {activeSocial.length > 0 && (
              <div className="socials">
                {activeSocial.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} title={s.platform}>
                    {SOCIAL_ICONS[s.platform] || '🔗'}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/workouts">Workouts</Link></li>
              <li><Link to="/trainers">Trainers</Link></li>
              <li><Link to="/membership">Membership</Link></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/admin/login">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              {settings?.phone && <li><a href={telLink(settings.phone)}>📞 {settings.phone}</a></li>}
              {settings?.whatsapp && (
                <li><a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a></li>
              )}
              {settings?.email && <li><a href={`mailto:${settings.email}`}>✉️ {settings.email}</a></li>}
              {settings?.address && <li><span className="text-muted">📍 {settings.address}</span></li>}
              {settings?.opening_hours && <li><span className="text-muted">🕒 {settings.opening_hours}</span></li>}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {year} {gymName || 'Fitness'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
