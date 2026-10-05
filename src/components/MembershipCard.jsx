export default function MembershipCard({ plan, onJoin }) {
  return (
    <div className="member-card">
      <h3>{plan.name}</h3>
      <div className="price">
        <span className="currency">₹</span>
        {Number(plan.amount).toLocaleString()}
      </div>
      <div className="duration">{plan.duration}</div>
      {plan.description && <p className="plan-desc">{plan.description}</p>}
      {plan.features?.length > 0 && (
        <ul>
          {plan.features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      )}
      <button className="btn btn-primary btn-block" onClick={() => onJoin(plan)}>
        JOIN NOW
      </button>
    </div>
  );
}
