import { useEffect } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

export default function AdminDashboard() {
  const { data, loading } = useApi(() => api.dashboard.stats(), []);

  useEffect(() => { applySEO({ title: 'Dashboard', robots: 'noindex,nofollow' }); }, []);

  return (
    <>
      <p className="text-muted mb-4">Overview of your website content.</p>
      {loading ? <Loading /> : (
        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-label">Membership Plans</div>
            <div className="dash-value">{data?.memberships ?? 0}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Trainers</div>
            <div className="dash-value">{data?.trainers ?? 0}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Workouts</div>
            <div className="dash-value">{data?.workouts ?? 0}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Messages</div>
            <div className="dash-value">{data?.messages ?? 0}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Unread Messages</div>
            <div className="dash-value" style={{ color: 'var(--warning)' }}>{data?.unread ?? 0}</div>
          </div>
        </div>
      )}
    </>
  );
}
