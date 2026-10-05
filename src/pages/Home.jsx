import { useEffect } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { applySEO, setJSONLD } from '../utils/seo.js';
import Hero from '../components/Hero.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';
import TrainerCard from '../components/TrainerCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const { data: home, loading: hLoading } = useApi(() => api.home.get(), []);
  const { data: settings } = useApi(() => api.settings.get(), []);
  const { data: stats } = useApi(() => api.stats.list(), []);
  const { data: features } = useApi(() => api.features.list(), []);
  const { data: workouts } = useApi(() => api.workouts.list(), []);
  const { data: trainers } = useApi(() => api.trainers.list(), []);
  const { data: seo } = useApi(() => api.seo.get('home'), []);

  useEffect(() => {
    const gymName = settings?.logo_text || settings?.gym_name || '';
    if (seo) applySEO({
      title: seo.title || gymName,
      description: seo.description,
      keywords: seo.keywords,
      canonical: seo.canonical_url,
      ogTitle: seo.og_title, ogDescription: seo.og_description, ogImage: seo.og_image,
      twitterTitle: seo.twitter_title, twitterDescription: seo.twitter_description, twitterImage: seo.twitter_image,
      robots: seo.robots || 'index,follow'
    });

    if (gymName) {
      setJSONLD('ld-website', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: gymName,
        url: window.location.origin
      });
      if (settings?.phone || settings?.address) {
        setJSONLD('ld-localbusiness', {
          '@context': 'https://schema.org',
          '@type': 'HealthAndBeautyBusiness',
          name: gymName,
          telephone: settings.phone || undefined,
          email: settings.email || undefined,
          address: settings.address || undefined,
          openingHours: settings.opening_hours || undefined,
          url: window.location.origin
        });
      }
    }
  }, [seo, settings]);

  if (hLoading) return <Loading />;

  const featuredWorkouts = (workouts || []).slice(0, 3);
  const featuredTrainers = (trainers || []).slice(0, 3);

  return (
    <>
      <Hero home={home} imageUrl={home?.hero_image_url} />

      {/* Stats */}
      {stats && stats.length > 0 && (
        <section className="section-sm">
          <div className="container">
            <div className="stats-row">
              {stats.map(s => (
                <div key={s.id} className="stat-card">
                  {s.icon && <div className="stat-icon">{s.icon}</div>}
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About from home_content */}
      {home?.about_heading && (
        <section className="section">
          <div className="container">
            <div className="grid grid-2" style={{ alignItems: 'center', gap: 60 }}>
              <div>
                <SectionTitle kicker="About Us" title={home.about_heading} subtitle={home.about_description} />
              </div>
              {home.about_image_url && (
                <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <img src={home.about_image_url} alt={home.about_heading} style={{ width: '100%', height: 'auto' }} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionTitle kicker="Why Us" title="What We Offer" subtitle="Discover what makes our gym stand out." />
            <div className="grid grid-3">
              {features.map(f => (
                <div key={f.id} className="feature-card">
                  {f.icon && <div className="feat-icon">{f.icon}</div>}
                  <h3>{f.title}</h3>
                  {f.description && <p>{f.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Workouts */}
      {workouts && workouts.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionTitle kicker="Train Hard" title="Featured Workouts" subtitle="Explore some of our signature workout routines." />
            <div className="grid grid-3">
              {featuredWorkouts.map(w => <WorkoutCard key={w.id} workout={w} />)}
            </div>
          </div>
        </section>
      )}

      {/* Featured Trainers */}
      {trainers && trainers.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionTitle kicker="Meet The Team" title="Featured Trainers" subtitle="Our expert coaches are here to guide you." />
            <div className="grid grid-3">
              {featuredTrainers.map(t => <TrainerCard key={t.id} trainer={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* Empty state: nothing at all yet */}
      {(!stats || stats.length === 0) &&
       (!features || features.length === 0) &&
       (!workouts || workouts.length === 0) &&
       (!trainers || trainers.length === 0) &&
       !home?.hero_heading && (
        <section className="section">
          <div className="container">
            <EmptyState icon="🏋️" title="No content available yet" message="The website content has not been published yet. Please check back soon." />
          </div>
        </section>
      )}

      {/* CTA */}
      {home?.cta_heading && (
        <section className="section">
          <div className="container">
            <div className="cta-section">
              <h2>{home.cta_heading}</h2>
              {home.cta_description && <p>{home.cta_description}</p>}
              {home.cta_button_text && home.cta_button_link && (
                <a href={home.cta_button_link} className="btn btn-primary">{home.cta_button_text}</a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
