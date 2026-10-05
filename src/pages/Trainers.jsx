import { useEffect } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { applySEO } from '../utils/seo.js';
import TrainerCard from '../components/TrainerCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function Trainers() {
  const { data: trainers, loading } = useApi(() => api.trainers.list(), []);
  const { data: seo } = useApi(() => api.seo.get('trainers'), []);

  useEffect(() => {
    if (seo) applySEO({
      title: seo.title, description: seo.description, keywords: seo.keywords,
      canonical: seo.canonical_url, ogTitle: seo.og_title, ogDescription: seo.og_description,
      ogImage: seo.og_image, twitterTitle: seo.twitter_title,
      twitterDescription: seo.twitter_description, twitterImage: seo.twitter_image,
      robots: seo.robots || 'index,follow'
    });
  }, [seo]);

  return (
    <div className="container">
      <header className="page-header">
        <h1>Our Trainers</h1>
        <p>Meet the certified professionals ready to help you reach your goals.</p>
      </header>

      {loading ? <Loading /> : (
        trainers && trainers.length > 0 ? (
          <div className="grid grid-3">
            {trainers.map(t => <TrainerCard key={t.id} trainer={t} />)}
          </div>
        ) : (
          <EmptyState icon="👥" title="No trainers available yet." message="Our trainers will be listed here soon." />
        )
      )}
    </div>
  );
}
