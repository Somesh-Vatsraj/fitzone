export default function Loading({ label }) {
  return (
    <div className="loading-wrap">
      <div>
        <div className="spinner" />
        {label && <p className="text-muted" style={{ textAlign: 'center' }}>{label}</p>}
      </div>
    </div>
  );
}
