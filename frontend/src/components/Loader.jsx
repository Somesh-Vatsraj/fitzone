export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader">
      <span className="loader__ring" />
      <span className="loader__label">{label}</span>
    </div>
  );
}
