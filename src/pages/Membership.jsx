import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useApi } from '../hooks/useApi.js';
import { applySEO } from '../utils/seo.js';
import MembershipCard from '../components/MembershipCard.jsx';
import ContactModal from '../components/ContactModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function Membership() {
  const { data: plans, loading } = useApi(() => api.memberships.list(), []);
  const { data: settings } = useApi(() => api.settings.get(), []);
  const { data: seo } = useApi(() => api.seo.get('membership'), []);
  const [selected, setSelected] = useState(null);

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
        <h1>Membership Plans</h1>
        <p>Choose the plan that fits your fitness journey. Contact us to join.</p>
      </header>

      {loading ? <Loading /> : (
        plans && plans.length > 0 ? (
          <div className="member-grid">
            {plans.map(p => <MembershipCard key={p.id} plan={p} onJoin={setSelected} />)}
          </div>
        ) : (
          <EmptyState icon="💳" title="No membership plans available yet." message="Plans will be published soon. Please check back." />
        )
      )}

      <ContactModal plan={selected} settings={settings} onClose={() => setSelected(null)} />
    </div>
  );
}
