import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { telLink, whatsappLink } from '../utils/seo.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useApi(() => api.settings.get(), []);

  const close = () => setOpen(false);
  const logoText = settings?.logo_text || settings?.gym_name || 'FitZone';

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={close}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={`${logoText} logo`} />
          ) : (
            <span className="logo-mark">{logoText.charAt(0).toUpperCase()}</span>
          )}
          <span>{logoText}</span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={close}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/workouts">Workouts</NavLink>
          <NavLink to="/trainers">Trainers</NavLink>
          <NavLink to="/membership">Membership</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-cta">
          {settings?.phone && (
            <a href={telLink(settings.phone)} className="btn btn-ghost btn-sm">
              📞 <span className="hide-mob">{settings.phone}</span>
            </a>
          )}
          {settings?.whatsapp && (
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              💬 <span className="hide-mob">WhatsApp</span>
            </a>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
