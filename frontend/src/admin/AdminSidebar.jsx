import { NavLink, Link } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';

const ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/admin/home-settings', label: 'Home Settings', icon: '⌂' },
  { to: '/admin/membership', label: 'Membership Plans', icon: '◈' },
  { to: '/admin/trainers', label: 'Trainers', icon: '☺' },
  { to: '/admin/workouts', label: 'Workouts', icon: '⚡' },
  { to: '/admin/contact-settings', label: 'Contact Settings', icon: '☎' },
  { to: '/admin/website-settings', label: 'Website Settings', icon: '⚙' },
];

export default function AdminSidebar({ open, onClose, onLogout }) {
  const { site } = useStore();
  return (
    <>
      <div className={`admin-sidebar__scrim ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand">
          <span className="brand__mark">FZ</span>
          <div><strong>{site?.siteName || 'FITZONE'}</strong><small>Admin Panel</small></div>
          <button className="admin-sidebar__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <nav className="admin-sidebar__nav">
          {ITEMS.map((i) => (
            <NavLink key={i.to} to={i.to}
              className={({ isActive }) => `admin-nav__link ${isActive ? 'is-active' : ''}`}
              onClick={onClose}>
              <span className="admin-nav__icon">{i.icon}</span>{i.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <Link to="/" className="btn btn--ghost btn--sm btn--block">← View Website</Link>
          <button className="btn btn--danger btn--sm btn--block" onClick={onLogout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
