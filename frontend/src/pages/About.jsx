import { Link } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';
import SectionHead from '../components/SectionHead.jsx';
import StatCard from '../components/StatCard.jsx';
import { onImgError } from '../utils/helpers.js';

const VALUES = [
  { icon: '🏋️', title: 'Coaching First', text: 'Certified coaches who correct your form and build your plan.' },
  { icon: '📈', title: 'Progress You Can See', text: 'Monthly scans and strength benchmarks.' },
  { icon: '🫶', title: 'A Real Community', text: 'No egos, no judgement. Just support.' },
  { icon: '🧼', title: 'Spotless Facility', text: 'Sanitised equipment, premium showers.' },
];

export default function About() {
  const { site, home, contact } = useStore();
  if (!site || !home || !contact) return null;

  return (
    <>
      <section className="section page-top">
        <div className="container about__grid">
          <div>
            <span className="eyebrow">Our Story</span>
            <h1 className="about__title">{site.aboutTitle}</h1>
            <p className="about__text">{site.aboutText}</p>
            <div className="hero__actions">
              <Link to="/membership" className="btn btn--primary btn--lg">View Membership</Link>
              <Link to="/contact" className="btn btn--ghost btn--lg">Visit the Gym</Link>
            </div>
          </div>
          <div className="about__visual">
            <img src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80"
              alt="FitZone gym" onError={onImgError} />
            <div className="about__badge"><strong>12+</strong><span>Years of coaching</span></div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="stats-grid">
            {home.stats.map((s) => <StatCard key={s.id} value={s.value} label={s.label} />)}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHead eyebrow="What we stand for" title="WHY FITZONE" />
          <div className="grid grid--4">
            {VALUES.map((v) => (
              <div key={v.title} className="value-card">
                <span className="value-card__icon">{v.icon}</span>
                <h3>{v.title}</h3><p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div className="cta__glow" aria-hidden="true" />
            <div className="cta__content">
              <h2>COME TRAIN WITH US</h2>
              <p>Drop by for a free trial. Open {contact.hours}.</p>
              <div className="cta__actions">
                <Link to="/contact" className="btn btn--primary btn--lg">Get Directions</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
