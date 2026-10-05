import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { telLink, whatsappLink } from '../utils/seo.js';

/* ---------- Inline SVG social icons ---------- */
const SocialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2.5h3.68l-8.04 9.19L24 21.5h-7.41l-5.8-7.58-6.63 7.58H.47l8.6-9.83L0 2.5h7.59l5.25 6.94L18.9 2.5Zm-1.29 17h2.04L6.49 4.4H4.3l13.31 15.1Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2.5h3.68l-8.04 9.19L24 21.5h-7.41l-5.8-7.58-6.63 7.58H.47l8.6-9.83L0 2.5h7.59l5.25 6.94L18.9 2.5Zm-1.29 17h2.04L6.49 4.4H4.3l13.31 15.1Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.13 4.54.72.31 1.28.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.02c0-5.19 4.23-9.41 9.42-9.41 2.51 0 4.87.98 6.65 2.76a9.34 9.34 0 0 1 2.75 6.66c0 5.19-4.23 9.41-9.41 9.41Zm8-17.42A11.34 11.34 0 0 0 12.03.75C5.78.75.7 5.83.7 12.07c0 2 .52 3.94 1.51 5.66L.5 23.5l5.92-1.55a11.32 11.32 0 0 0 5.62 1.44h.01c6.25 0 11.33-5.08 11.33-11.32 0-3.03-1.18-5.87-3.32-8Z" />
    </svg>
  )
};

/* Label for accessibility / tooltip */
const SOCIAL_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  twitter: 'Twitter',
  x: 'X',
  whatsapp: 'WhatsApp'
};

export default function Footer() {
  const { data: settings } = useApi(() => api.settings.get(), []);
  const { data: social } = useApi(() => api.social.list(), []);
  const gymName = settings?.logo_text || settings?.gym_name || '';
  const year = new Date().getFullYear();

  const activeSocial = (social || []).filter(s => s.url && SocialIcons[s.platform]);

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
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[s.platform] || s.platform}
                    title={SOCIAL_LABELS[s.platform] || s.platform}
                  >
                    {SocialIcons[s.platform]}
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
