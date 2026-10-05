import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';

const TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/home-settings': 'Home Settings',
  '/admin/membership': 'Membership Plans',
  '/admin/trainers': 'Trainers',
  '/admin/workouts': 'Workouts',
  '/admin/contact-settings': 'Contact Settings',
  '/admin/website-settings': 'Website Settings',
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { setAuth } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const logout = () => {
    setAuth(false);
    toast.info('Logged out');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin">
      <AdminSidebar open={open} onClose={() => setOpen(false)} onLogout={logout} />
      <div className="admin__main">
        <header className="admin__topbar">
          <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Menu">☰</button>
          <h1 className="admin__title">{TITLES[location.pathname] || 'Admin'}</h1>
          <div className="admin__topbar-right">
            <span className="admin__user">
              <span className="avatar">A</span>
              <span className="admin__user-text"><strong>Admin</strong><small>admin@fitzone.com</small></span>
            </span>
            <button className="btn btn--danger btn--sm" onClick={logout}>Logout</button>
          </div>
        </header>
        <div className="admin__content"><Outlet /></div>
      </div>
    </div>
  );
}
