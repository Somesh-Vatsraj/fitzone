import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/membership', label: 'Membership' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { site } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="brand" aria-label="FitZone home">
          <span className="brand__mark">FZ</span>
          <span className="brand__text">
            {site?.siteName || 'FITZONE'}
            <small>{site?.tagline || 'Train Hard. Live Strong.'}</small>
          </span>
        </Link>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/membership" className="btn btn--primary nav__cta">Join Now</Link>
        </nav>

        <button className={`nav__burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
