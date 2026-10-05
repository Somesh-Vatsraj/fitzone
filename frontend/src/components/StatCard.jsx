export default function StatCard({ value, label, icon }) {
  return (
    <div className="stat-card">
      {icon ? <span className="stat-card__icon">{icon}</span> : null}
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}
