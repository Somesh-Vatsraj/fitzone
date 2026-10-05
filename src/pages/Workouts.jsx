import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { applySEO } from '../utils/seo.js';
import WorkoutCard from '../components/WorkoutCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function Workouts() {
  const { data: workouts, loading } = useApi(() => api.workouts.list(), []);
  const { data: categories } = useApi(() => api.categories.list(), []);
  const { data: seo } = useApi(() => api.seo.get('workouts'), []);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    if (seo) applySEO({
      title: seo.title, description: seo.description, keywords: seo.keywords,
      canonical: seo.canonical_url, ogTitle: seo.og_title, ogDescription: seo.og_description,
      ogImage: seo.og_image, twitterTitle: seo.twitter_title,
      twitterDescription: seo.twitter_description, twitterImage: seo.twitter_image,
      robots: seo.robots || 'index,follow'
    });
  }, [seo]);

  const filtered = useMemo(() => {
    let list = workouts || [];
    if (activeCat && activeCat !== 'All') list = list.filter(w => w.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.name?.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q) ||
        w.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [workouts, activeCat, search]);

  const cats = categories || [];

  return (
    <div className="container">
      <header className="page-header">
        <h1>Workouts</h1>
        <p>Browse our complete library of training routines.</p>
      </header>

      {loading ? <Loading /> : (
        <>
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search workouts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search workouts"
            />
          </div>

          {cats.length === 0 ? (
            <p className="text-muted mb-3">No workout categories available.</p>
          ) : (
            <div className="chips">
              <button className={`chip ${activeCat === 'All' ? 'active' : ''}`} onClick={() => setActiveCat('All')}>All</button>
              {cats.map(c => (
                <button key={c.id} className={`chip ${activeCat === c.name ? 'active' : ''}`} onClick={() => setActiveCat(c.name)}>{c.name}</button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState icon="🏋️" title="No workouts available yet." message="Workouts will appear here once added by the admin." />
          ) : (
            <div className="grid grid-3">
              {filtered.map(w => <WorkoutCard key={w.id} workout={w} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
