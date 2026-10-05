import { onImgError } from '../utils/helpers.js';

export default function WorkoutCard({ workout }) {
  const level = (workout.difficulty || 'Beginner').toLowerCase();
  return (
    <article className="workout-card">
      <div className="workout-card__media">
        <img src={workout.image} alt={workout.name} loading="lazy" onError={onImgError} />
        <span className="chip chip--category">{workout.category}</span>
        <span className={`chip chip--level chip--${level}`}>{workout.difficulty}</span>
      </div>
      <div className="workout-card__body">
        <h3 className="workout-card__title">{workout.name}</h3>
        <div className="workout-card__meta">
          <span><strong>{workout.sets}</strong> Sets</span>
          <span className="divider" />
          <span><strong>{workout.reps}</strong> Reps</span>
        </div>
        <p className="workout-card__desc">{workout.description}</p>
      </div>
    </article>
  );
}
