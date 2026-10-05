import Modal from './Modal.jsx';
import { useToast } from './Toast.jsx';
import { useStore } from '../data/StoreContext.jsx';
import { copyText, formatINR, telLink, waLink } from '../utils/helpers.js';

export default function JoinPlanModal({ plan, open, onClose }) {
  const { contact } = useStore();
  const toast = useToast();
  if (!plan || !contact) return null;

  const message = `Hi FitZone! I would like to join the ${plan.name} plan (${formatINR(plan.amount)} / ${plan.duration}).`;

  const handleCopy = async () => {
    const ok = await copyText(contact.paytm);
    if (ok) toast.success('Paytm number copied');
    else toast.error('Could not copy');
  };

  return (
    <Modal open={open} onClose={onClose} title={`Join the ${plan.name} Plan`} size="sm"
      footer={<button className="btn btn--ghost btn--block" onClick={onClose}>Close</button>}>
      <p className="join-note">
        To join this plan, contact us or pay through <strong>Paytm</strong>.
      </p>
      <div className="join-rows">
        <div className="join-row"><span>Plan</span><strong>{plan.name}</strong></div>
        <div className="join-row"><span>Duration</span><strong>{plan.duration}</strong></div>
        <div className="join-row join-row--accent"><span>Plan Amount</span><strong>{formatINR(plan.amount)}</strong></div>
        <div className="join-row"><span>Paytm Number</span><strong>{contact.paytm}</strong></div>
        <div className="join-row"><span>Contact Number</span><strong>{contact.phone}</strong></div>
      </div>
      <div className="join-actions">
        <a className="btn btn--primary btn--block" href={telLink(contact.phone)}>📞 Call Now</a>
        <a className="btn btn--whatsapp btn--block" href={waLink(contact.whatsapp, message)} target="_blank" rel="noreferrer">
          💬 Contact on WhatsApp
        </a>
        <button className="btn btn--ghost btn--block" onClick={handleCopy}>⧉ Copy Paytm Number</button>
      </div>
      <p className="join-disclaimer">
        Payments are completed manually outside this website. Share the screenshot on WhatsApp after paying.
      </p>
    </Modal>
  );
}
