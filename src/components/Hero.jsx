import { Link } from 'react-router-dom';

export default function Hero({ home, imageUrl }) {
  if (!home?.hero_heading) return null;
  return (
    <section className="hero">
      {imageUrl && (
        <div className="hero-bg">
          <img src={imageUrl} alt="" aria-hidden="true" />
        </div>
      )}
      <div className="container hero-inner">
        <div>
          {home.hero_badge && <span className="hero-badge">{home.hero_badge}</span>}
          <h1>{home.hero_heading}</h1>
          {home.hero_description && <p>{home.hero_description}</p>}
          {home.hero_button_text && home.hero_button_link && (
            <div className="hero-cta">
              <Link to={home.hero_button_link} className="btn btn-primary">
                {home.hero_button_text}
              </Link>
            </div>
          )}
        </div>
        {imageUrl && (
          <div className="hero-image">
            <img src={imageUrl} alt="" />
          </div>
        )}
      </div>
    </section>
  );
}
