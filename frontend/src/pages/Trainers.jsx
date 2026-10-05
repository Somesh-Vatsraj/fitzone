import { useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import TrainerCard from '../components/TrainerCard.jsx';
import SectionHead from '../components/SectionHead.jsx';
import Modal from '../components/Modal.jsx';
import { onImgError, telLink, waLink } from '../utils/helpers.js';

export default function Trainers() {
  const { trainers } = useStore();
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = trainers.filter((t) => {
    const q = query.trim().toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q);
  });

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHead eyebrow="Our Team" title="MEET YOUR TRAINERS"
          description="Every FitZone coach is certified and invested in your results." />

        <div className="filters filters--single">
          <input className="input filters__search" placeholder="Search trainers…"
            value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="grid grid--3">
          {filtered.map((t) => <TrainerCard key={t.id} trainer={t} onContact={setActive} />)}
        </div>

        {!filtered.length ? (
          <div className="empty-state">
            <h3>No trainers matched</h3>
            <button className="btn btn--ghost" onClick={() => setQuery('')}>Clear search</button>
          </div>
        ) : null}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)}
        title={active ? `Contact ${active.name}` : ''} size="sm"
        footer={<button className="btn btn--ghost btn--block" onClick={() => setActive(null)}>Close</button>}>
        {active ? (
          <>
            <div className="trainer-modal__head">
              <img src={active.image} alt={active.name} onError={onImgError} />
              <div>
                <h4>{active.name}</h4>
                <p className="muted">{active.specialization}</p>
                <span className="badge">{active.experience} experience</span>
              </div>
            </div>
            <div className="join-rows">
              <div className="join-row"><span>Phone</span><strong>{active.phone}</strong></div>
              <div className="join-row"><span>Email</span><strong>{active.email}</strong></div>
            </div>
            <div className="join-actions">
              <a className="btn btn--primary btn--block" href={telLink(active.phone)}>📞 Call Now</a>
              <a className="btn btn--whatsapp btn--block"
                href={waLink(active.phone, `Hi ${active.name}, I'd like to book a session.`)}
                target="_blank" rel="noreferrer">💬 WhatsApp</a>
            </div>
          </>
        ) : null}
      </Modal>
    </section>
  );
}
