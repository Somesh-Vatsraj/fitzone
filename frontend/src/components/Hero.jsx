import { Link } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';
import { onImgError } from '../utils/helpers.js';

export default function Hero() {
  const { home, contact } = useStore();
  if (!home || !contact) return null;

  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow eyebrow--pill">{home.heroBadge}</span>
          <h1 className="hero__title">{home.heroHeading}</h1>
          <p className="hero__desc">{home.heroDescription}</p>
          <div className="hero__actions">
            <Link to="/membership" className="btn btn--primary btn--lg">{home.ctaText}</Link>
            <Link to="/workouts" className="btn btn--ghost btn--lg">Explore Workouts</Link>
          </div>
          <div className="hero__meta">
            <div><strong>{contact.hours.split('|')[0]}</strong><span>Open Hours</span></div>
            <div><strong>{contact.phone}</strong><span>Call us today</span></div>
          </div>
        </div>

        <div className="hero__visual">
          <img src={home.heroImage} alt="Athlete training" onError={onImgError} />
          <div className="hero__float hero__float--top">
            <span className="dot" />
            <div><strong>Live Classes</strong><small>12 sessions today</small></div>
          </div>
          <div className="hero__float hero__float--bottom">
            <strong>4.9★</strong><small>1,200+ reviews</small>
          </div>
        </div>
      </div>
    </section>
  );
}
