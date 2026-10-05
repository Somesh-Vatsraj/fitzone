import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import Hero from '../components/Hero.jsx';
import StatCard from '../components/StatCard.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';
import TrainerCard from '../components/TrainerCard.jsx';
import MembershipCard from '../components/MembershipCard.jsx';
import JoinPlanModal from '../components/JoinPlanModal.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { telLink } from '../utils/helpers.js';

export default function Home() {
  const { home, workouts, trainers, plans, contact } = useStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  if (!home || !contact) return null;

  const featuredWorkouts = workouts.slice(0, 4);
  const featuredTrainers = trainers.slice(0, 3);
  const visiblePlans = plans.filter((p) => p.enabled);

  return (
    <>
      <Hero />

      <section className="section section--tight">
        <div className="container">
          <div className="stats-grid">
            {home.stats.map((s) => <StatCard key={s.id} value={s.value} label={s.label} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Train with purpose" title="Featured Workouts"
            description="Hand-picked sessions from our programming library." />
          <div className="grid grid--4">
            {featuredWorkouts.map((w) => <WorkoutCard key={w.id} workout={w} />)}
          </div>
          <div className="center mt-40">
            <Link to="/workouts" className="btn btn--ghost btn--lg">View all workouts →</Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHead eyebrow="Meet the experts" title="Featured Trainers"
            description="Certified, experienced and invested in your progress." />
          <div className="grid grid--3">
            {featuredTrainers.map((t) => (
              <TrainerCard key={t.id} trainer={t} onContact={() => { window.location.href = '/trainers'; }} />
            ))}
          </div>
          <div className="center mt-40">
            <Link to="/trainers" className="btn btn--ghost btn--lg">Meet the full team →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Membership" title="Plans Built Around You"
            description="Simple pricing. No hidden charges. Pay via Paytm or at the front desk." />
          <div className="grid grid--3">
            {visiblePlans.map((p) => <MembershipCard key={p.id} plan={p} onJoin={setSelectedPlan} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div className="cta__glow" aria-hidden="true" />
            <div className="cta__content">
              <h2>{home.ctaTitle}</h2>
              <p>{home.ctaDescription}</p>
              <div className="cta__actions">
                <Link to="/membership" className="btn btn--primary btn--lg">{home.ctaText}</Link>
                <a href={telLink(contact.phone)} className="btn btn--ghost btn--lg">Call {contact.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JoinPlanModal plan={selectedPlan} open={!!selectedPlan} onClose={() => setSelectedPlan(null)} />
    </>
  );
}
