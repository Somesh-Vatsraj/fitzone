import { Link } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';
import { telLink, waLink } from '../utils/helpers.js';

export default function Footer() {
  const { contact, site } = useStore();
  const year = new Date().getFullYear();
  if (!contact || !site) return null;

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__col--brand">
          <Link to="/" className="brand brand--footer">
            <span className="brand__mark">FZ</span>
            <span className="brand__text">{site.siteName}<small>{site.tagline}</small></span>
          </Link>
          <p className="muted">{site.footerText}</p>
          <div className="footer__socials">
            <a href={waLink(contact.whatsapp)} target="_blank" rel="noreferrer" className="social">WA</a>
            <a href={`mailto:${contact.email}`} className="social">@</a>
            <a href={telLink(contact.phone)} className="social">☎</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul className="footer__list">
            <li><Link to="/workouts">Workouts</Link></li>
            <li><Link to="/trainers">Trainers</Link></li>
            <li><Link to="/membership">Membership</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Get in touch</h4>
          <ul className="footer__list">
            <li><span className="footer__k">Contact</span><a href={telLink(contact.phone)}>{contact.phone}</a></li>
            <li><span className="footer__k">Paytm</span><span className="highlight">{contact.paytm}</span></li>
            <li><span className="footer__k">WhatsApp</span><a href={waLink(contact.whatsapp)} target="_blank" rel="noreferrer">{contact.whatsapp}</a></li>
            <li><span className="footer__k">Email</span><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Visit us</h4>
          <p className="muted">{contact.address}</p>
          <p className="footer__hours">{contact.hours}</p>
          <Link to="/admin/login" className="footer__admin">Admin Login →</Link>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {year} {site.siteName}. All rights reserved.</span>
        <span className="muted">No online payments — pay via Paytm or at the front desk.</span>
      </div>
    </footer>
  );
}
