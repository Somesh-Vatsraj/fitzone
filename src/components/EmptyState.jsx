export default function EmptyState({ icon = '📭', title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title || 'Nothing here yet'}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
