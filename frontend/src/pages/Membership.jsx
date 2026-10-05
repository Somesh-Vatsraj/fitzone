import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import MembershipCard from '../components/MembershipCard.jsx';
import JoinPlanModal from '../components/JoinPlanModal.jsx';
import SectionHead from '../components/SectionHead.jsx';

const FAQS = [
  { q: 'How do I pay?', a: 'Pay via Paytm or at the front desk. No online payment on this site.' },
  { q: 'Can I switch plans?', a: 'Yes. Upgrade or downgrade any time at the front desk.' },
  { q: 'Joining fee?', a: 'No joining fee, no hidden charges.' },
  { q: 'Free trial?', a: 'Yes. One free trial session with a coach for new visitors.' },
];

export default function Membership() {
  const { plans } = useStore();
  const [selected, setSelected] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const visible = plans.filter((p) => p.enabled);

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHead eyebrow="Pricing" title="MEMBERSHIP PLANS"
          description="Simple, honest pricing. Pay offline via Paytm or at the gym." />

        <div className="grid grid--3">
          {visible.map((p) => <MembershipCard key={p.id} plan={p} onJoin={setSelected} />)}
        </div>

        {!visible.length ? (
          <div className="empty-state">
            <h3>No plans available</h3>
            <p>Check back soon or contact us for details.</p>
          </div>
        ) : null}

        <div className="notice">
          <strong>Please note:</strong> FitZone does not process payments online. Pay manually via Paytm or in person.
        </div>

        <div className="faq">
          <SectionHead eyebrow="Questions" title="Frequently Asked" />
          <div className="faq__list">
            {FAQS.map((f, i) => (
              <div key={f.q} className={`faq__item ${openFaq === i ? 'is-open' : ''}`}>
                <button className="faq__q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}<span className="faq__icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i ? <p className="faq__a">{f.a}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <JoinPlanModal plan={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
}
