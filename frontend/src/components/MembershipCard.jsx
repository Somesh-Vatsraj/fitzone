import { formatINR } from '../utils/helpers.js';

export default function MembershipCard({ plan, onJoin }) {
  return (
    <article className={`plan-card ${plan.popular ? 'plan-card--popular' : ''}`}>
      {plan.popular ? <span className="plan-card__ribbon">Most Popular</span> : null}
      <header className="plan-card__head">
        <h3 className="plan-card__name">{plan.name}</h3>
        <p className="plan-card__duration">{plan.duration}</p>
      </header>
      <div className="plan-card__price">
        <span className="plan-card__amount">{formatINR(plan.amount)}</span>
        <span className="plan-card__per">/ {plan.duration.toLowerCase()}</span>
      </div>
      <ul className="plan-card__features">
        {plan.features.map((f, i) => (
          <li key={`${plan.id}-f-${i}`}><span className="tick">✓</span>{f}</li>
        ))}
      </ul>
      <button className="btn btn--primary btn--block" onClick={() => onJoin(plan)}>Join Now</button>
      <p className="plan-card__note">No online payment · Pay via Paytm or at the desk</p>
    </article>
  );
}
