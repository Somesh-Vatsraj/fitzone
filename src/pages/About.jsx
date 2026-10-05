import { useEffect } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { applySEO } from '../utils/seo.js';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function About() {
  const { data: about, loading } = useApi(() => api.about.get(), []);
  const { data: seo } = useApi(() => api.seo.get('about'), []);

  useEffect(() => {
    if (seo) applySEO({
      title: seo.title, description: seo.description, keywords: seo.keywords,
      canonical: seo.canonical_url, ogTitle: seo.og_title, ogDescription: seo.og_description,
      ogImage: seo.og_image, twitterTitle: seo.twitter_title,
      twitterDescription: seo.twitter_description, twitterImage: seo.twitter_image,
      robots: seo.robots || 'index,follow'
    });
  }, [seo]);

  if (loading) return <Loading />;

  const hasContent = about && (about.heading || about.description || about.mission || about.vision || about.story);

  return (
    <div className="container">
      <header className="page-header">
        <h1>{about?.heading || 'About Us'}</h1>
      </header>

      {!hasContent ? (
        <EmptyState icon="ℹ️" title="About content is not available yet." message="Please check back soon." />
      ) : (
        <>
          {about.image_url && (
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 40, maxHeight: 460 }}>
              <img src={about.image_url} alt={about.heading || 'About'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {about.description && (
            <section style={{ maxWidth: 800, margin: '0 auto 40px' }}>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-2)' }}>{about.description}</p>
            </section>
          )}

          <div className="grid grid-2" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {about.mission && (
              <div className="admin-card" style={{ marginBottom: 0 }}>
                <h3 className="mb-2">Our Mission</h3>
                <p className="text-muted">{about.mission}</p>
              </div>
            )}
            {about.vision && (
              <div className="admin-card" style={{ marginBottom: 0 }}>
                <h3 className="mb-2">Our Vision</h3>
                <p className="text-muted">{about.vision}</p>
              </div>
            )}
          </div>

          {about.story && (
            <section style={{ maxWidth: 800, margin: '40px auto 0' }}>
              <h2 className="mb-3">Our Story</h2>
              <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{about.story}</p>
            </section>
          )}

          {about.features?.length > 0 && (
            <section style={{ maxWidth: 800, margin: '40px auto 0' }}>
              <h2 className="mb-3">Highlights</h2>
              <ul style={{ listStyle: 'none' }}>
                {about.features.map((f, i) => (
                  <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
