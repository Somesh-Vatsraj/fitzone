import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../components/Toast.jsx';

const titles = {
  '/admin': 'Dashboard',
  '/admin/home': 'Home Management',
  '/admin/memberships': 'Memberships',
  '/admin/trainers': 'Trainers',
  '/admin/workouts': 'Workouts',
  '/admin/about': 'About',
  '/admin/messages': 'Contact Messages',
  '/admin/seo': 'SEO',
  '/admin/settings': 'Website Settings'
};

export default function AdminHeader({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-header">
      <div className="flex">
        <button className="btn btn-ghost btn-sm admin-mobile-toggle" onClick={onToggleSidebar} aria-label="Toggle menu">☰</button>
        <h1>{titles[pathname] || 'Admin'}</h1>
      </div>
      <div className="admin-actions">
        <span className="text-muted hide-mobile">{admin?.username}</span>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
