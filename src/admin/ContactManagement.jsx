import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loading from '../components/Loading.jsx';
import { applySEO } from '../utils/seo.js';

export default function ContactManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => { applySEO({ title: 'Messages', robots: 'noindex,nofollow' }); load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await api.messages.list() || []); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  const markRead = async (m, is_read) => {
    try {
      await api.messages.update(m.id, { is_read });
      await load();
      if (selected?.id === m.id) setSelected({ ...m, is_read: is_read ? 1 : 0 });
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    try { await api.messages.remove(id); toast.success('Deleted'); setSelected(null); await load(); }
    catch (e) { toast.error(e.message); }
    finally { setConfirm(null); }
  };

  return (
    <>
      <div className="admin-card">
        <h2>Inbox</h2>
        {loading ? <Loading /> : items.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>From</th><th>Phone</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(m => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.phone}</td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                    <td className="text-muted">{new Date(m.created_at).toLocaleString()}</td>
                    <td>{m.is_read ? <span className="badge active">read</span> : <span className="badge unread">unread</span>}</td>
                    <td className="action-row">
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(m); if (!m.is_read) markRead(m, 1); }}>View</button>
                      <button className="btn btn-outline btn-sm" onClick={() => markRead(m, m.is_read ? 0 : 1)}>{m.is_read ? 'Mark Unread' : 'Mark Read'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: m.id })}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Message from {selected.name}</h3>
              <button className="close-x" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-3">{new Date(selected.created_at).toLocaleString()}</p>
              <div className="mb-3"><strong>Phone:</strong> {selected.phone}</div>
              {selected.email && <div className="mb-3"><strong>Email:</strong> {selected.email}</div>}
              <div style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</div>
            </div>
            <div className="modal-foot">
              <a href={`tel:${selected.phone}`} className="btn btn-outline">CALL</a>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete message"
        message="Delete this message permanently?"
        confirmText="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => remove(confirm.id)}
      />
    </>
  );
}
