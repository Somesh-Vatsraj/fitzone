import { telLink } from '../utils/seo.js';

export default function TrainerCard({ trainer }) {
  return (
    <article className="card">
      <div className="card-img">
        {trainer.image_url ? (
          <img src={trainer.image_url} alt={trainer.name} loading="lazy" />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>No photo</div>
        )}
      </div>
      <div className="card-body">
        <h3>{trainer.name}</h3>
        {trainer.specialization && <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>{trainer.specialization}</p>}
        {trainer.experience && <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>Experience: {trainer.experience}</p>}
        {trainer.bio && <p style={{ marginTop: 12 }}>{trainer.bio}</p>}
      </div>
      {trainer.contact_number && (
        <div className="card-actions">
          <a href={telLink(trainer.contact_number)} className="btn btn-outline btn-sm">📞 Contact</a>
        </div>
      )}
    </article>
  );
}
