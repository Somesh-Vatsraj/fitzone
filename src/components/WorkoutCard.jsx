export default function WorkoutCard({ workout }) {
  return (
    <article className="card">
      <div className="card-img">
        {workout.image_url ? (
          <img src={workout.image_url} alt={workout.name} loading="lazy" />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>No image</div>
        )}
      </div>
      <div className="card-body">
        {workout.category && <span className="card-tag">{workout.category}</span>}
        <h3>{workout.name}</h3>
        {workout.description && <p>{workout.description}</p>}
        <div className="card-meta">
          {workout.sets && <span>Sets: {workout.sets}</span>}
          {workout.reps && <span>Reps: {workout.reps}</span>}
          {workout.difficulty && <span>{workout.difficulty}</span>}
        </div>
      </div>
    </article>
  );
}
