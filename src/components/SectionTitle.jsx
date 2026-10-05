export default function SectionTitle({ kicker, title, subtitle }) {
  if (!title && !subtitle) return null;
  return (
    <div className="section-title">
      {kicker && <span className="kicker">{kicker}</span>}
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
