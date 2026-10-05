export default function SectionHead({ eyebrow, title, description, align = 'center' }) {
  return (
    <div className={`section-head section-head--${align}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="section-head__title">{title}</h2>
      {description ? <p className="section-head__desc">{description}</p> : null}
    </div>
  );
}
