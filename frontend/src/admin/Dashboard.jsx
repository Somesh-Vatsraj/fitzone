import { Link } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';
import AdminTable from './AdminTable.jsx';

export default function Dashboard() {
  const { members, plans, trainers, workouts, messages } = useStore();
  const activePlans = plans.filter((p) => p.enabled).length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;

  const stats = [
    { label: 'Total Members', value: members.length, icon: '👥', sub: `${activeMembers} active` },
    { label: 'Active Plans', value: activePlans, icon: '◈', sub: `${plans.length} total` },
    { label: 'Total Trainers', value: trainers.length, icon: '🏋️', sub: 'Certified' },
    { label: 'Total Workouts', value: workouts.length, icon: '⚡', sub: 'In library' },
  ];

  const columns = [
    { key: 'name', header: 'Member' },
    { key: 'plan', header: 'Plan' },
    { key: 'joined', header: 'Joined' },
    { key: 'status', header: 'Status', render: (r) => (
      <span className={`badge ${r.status === 'Active' ? 'badge--green' : 'badge--amber'}`}>{r.status}</span>
    )},
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div><h2>Overview</h2><p className="muted">Quick snapshot of your gym.</p></div>
        <div className="admin-page__actions">
          <Link to="/admin/membership" className="btn btn--primary btn--sm">+ Add Plan</Link>
          <Link to="/admin/workouts" className="btn btn--ghost btn--sm">+ Add Workout</Link>
        </div>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat">
            <span className="admin-stat__icon">{s.icon}</span>
            <div>
              <span className="admin-stat__value">{s.value}</span>
              <span className="admin-stat__label">{s.label}</span>
              <span className="admin-stat__sub">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panels">
        <div className="panel">
          <div className="panel__head"><h3>Recent Members</h3></div>
          <AdminTable columns={columns} rows={members.slice(0, 5)} />
        </div>
        <div className="panel">
          <div className="panel__head"><h3>Quick Actions</h3></div>
          <div className="quick-actions">
            <Link to="/admin/home-settings" className="quick-action"><span>⌂</span> Edit Hero</Link>
            <Link to="/admin/trainers" className="quick-action"><span>☺</span> Manage Trainers</Link>
            <Link to="/admin/workouts" className="quick-action"><span>⚡</span> Manage Workouts</Link>
            <Link to="/admin/contact-settings" className="quick-action"><span>☎</span> Contact Info</Link>
          </div>
          <div className="panel__note">
            <strong>{messages.length}</strong> {messages.length === 1 ? 'enquiry' : 'enquiries'} received.
          </div>
        </div>
      </div>
    </div>
  );
}
