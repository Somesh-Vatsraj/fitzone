import { onImgError } from '../utils/helpers.js';

export default function TrainerCard({ trainer, onContact }) {
  return (
    <article className="trainer-card">
      <div className="trainer-card__media">
        <img src={trainer.image} alt={trainer.name} loading="lazy" onError={onImgError} />
        <span className="trainer-card__exp">{trainer.experience}</span>
      </div>
      <div className="trainer-card__body">
        <h3 className="trainer-card__name">{trainer.name}</h3>
        <p className="trainer-card__spec">{trainer.specialization}</p>
        <button className="btn btn--ghost btn--block" onClick={() => onContact(trainer)}>
          Contact Trainer
        </button>
      </div>
    </article>
  );
}
