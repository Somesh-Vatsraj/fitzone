import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', end: true, icon: '📊', label: 'Dashboard' },
  { to: '/admin/home', icon: '🏠', label: 'Home' },
  { to: '/admin/memberships', icon: '💳', label: 'Memberships' },
  { to: '/admin/trainers', icon: '🧑‍🏫', label: 'Trainers' },
  { to: '/admin/workouts', icon: '🏋️', label: 'Workouts' },
  { to: '/admin/about', icon: 'ℹ️', label: 'About' },
  { to: '/admin/messages', icon: '✉️', label: 'Messages' },
  { to: '/admin/seo', icon: '🔍', label: 'SEO' },
  { to: '/admin/settings', icon: '⚙️', label: 'Website Settings' }
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-brand">
        <span className="logo-mark">F</span>
        <span>FitZone Admin</span>
      </div>
      <nav className="admin-nav" onClick={onClose}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            <span className="nav-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
