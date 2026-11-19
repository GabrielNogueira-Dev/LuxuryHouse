import { useEffect, useRef, useState } from 'react';
import ImmersiveTour from './ImmersiveTour.jsx';
import {
  ABOUT_IMAGE,
  EXPERIENCE_IMAGES,
  HERO_IMAGE,
  SPACE_IMAGES,
  VIDEO_COVER,
} from './data/media.js';
import './styles.css';

const features = [
  { title: 'Sala e jardim', image: ABOUT_IMAGE, scene: 'garden-lounge' },
  { title: 'Quartos', image: SPACE_IMAGES[2], scene: 'primary-suite' },
  { title: 'Piscina', image: EXPERIENCE_IMAGES[0], scene: 'infinity-pool' },
];

export default function App() {
  const tourRef = useRef(null);
  const transitionTimers = useRef([]);
  const [transition, setTransition] = useState(null);
  const [transitioned, setTransitioned] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(
    () => () => transitionTimers.current.forEach((timer) => window.clearTimeout(timer)),
    [],
  );

  function startTour(event) {
    event.preventDefault();
    const tour = tourRef.current;
    if (!tour) return;

    void tour.startAmbientMusic();
    tour.scrollToStage('smooth');
    const from = document.getElementById('hero-image')?.currentSrc || HERO_IMAGE.src;
    const to = tour.getCurrentImage();
    setTransition({ from, to });
    setTransitioned(false);
    setFading(false);

    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [
      window.setTimeout(() => setTransitioned(true), 60),
      window.setTimeout(() => setFading(true), 1050),
      window.setTimeout(() => setTransition(null), 1720),
    ];
  }

  return (
    <main className="site">
      <section className="landing-hero" id="inicio" aria-labelledby="hero-title">
        <img
          className="landing-image"
          id="hero-image"
          src={HERO_IMAGE.src}
          alt=""
          fetchPriority="high"
        />
        <div className="landing-shade" aria-hidden="true" />

        <header className="site-header">
          <a className="site-brand" href="#inicio" aria-label="Luxury House — início">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span className="brand-copy">
              <b>Luxury House</b>
              <small>Private villa</small>
            </span>
          </a>
          <nav className="site-nav" aria-label="Navegação principal">
            <a href="#experiencia">A casa</a>
            <a href="#tour" onClick={() => void tourRef.current?.startAmbientMusic()}>
              Espaços
            </a>
            <a className="site-nav-cta" href="#contacto">Ver localização</a>
          </nav>
        </header>

        <div className="hero-content">
          <span className="hero-kicker">Villa privada com piscina e jardim</span>
          <h1 id="hero-title">Luxury House</h1>
          <p>An Exclusive Escape Beyond Expectations</p>
          <div className="hero-actions">
            <a className="hero-secondary" href="#experiencia">
              Conhecer a villa <span aria-hidden="true">↗</span>
            </a>
            <a className="hero-cta" href="#tour" onClick={startTour}>
              Explorar os espaços <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-location">
          <strong>Luxury House</strong>
          <span>Estadia privada</span>
        </div>
      </section>

      <section className="experience" id="experiencia" aria-labelledby="experience-title">
        <div className="experience-inner">
          <div className="experience-head">
            <div>
              <span className="section-kicker">A casa</span>
              <h2 id="experience-title">Um lugar para estar à vontade.</h2>
            </div>
            <p className="experience-intro">
              Espaços interiores e exteriores pensados para dias sem pressa,
              momentos partilhados e tempo só para si.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <a
                className="feature-card"
                href="#tour"
                key={feature.scene}
                aria-label={`Explorar: ${feature.title}`}
                onClick={(event) => {
                  event.preventDefault();
                  tourRef.current?.goTo(feature.scene);
                  void tourRef.current?.startAmbientMusic();
                  tourRef.current?.scrollToStage('smooth');
                }}
              >
                <img src={feature.image.src} alt={feature.image.alt} loading="lazy" />
                <span className="feature-copy">
                  <strong>{feature.title}</strong>
                  <span aria-hidden="true">Explorar espaço ↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ImmersiveTour ref={tourRef} />

      <section className="location-section" id="contacto" aria-labelledby="contact-title">
        <div className="location-inner">
          <div className="location-copy">
            <span className="section-kicker">Contacto</span>
            <h2 id="contact-title">Um endereço partilhado em privado.</h2>
            <p>
              A localização exata é partilhada após a confirmação da reserva.
              O mapa é apenas ilustrativo e não indica a morada da villa.
            </p>
            <address>Luxury House · localização privada</address>
            <a className="location-cta" href="#tour">
              Explorar os espaços <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div
            className="location-map"
            role="img"
            aria-label="Mapa ilustrativo da Luxury House. Não representa a localização real."
          >
            <div className="map-canvas" aria-hidden="true">
              <span className="map-park map-park-one" />
              <span className="map-park map-park-two" />
              <span className="map-road map-road-main" />
              <span className="map-road map-road-cross" />
              <span className="map-road map-road-side" />
              <span className="map-marker"><b>LH</b></span>
            </div>
            <div className="map-location-card" aria-hidden="true">
              <span>Luxury House</span>
              <strong>Localização privada</strong>
            </div>
            <span className="map-disclaimer" aria-hidden="true">
              Mapa ilustrativo · sem morada real
            </span>
          </div>
        </div>
      </section>

      <section className="video-section" aria-labelledby="video-title">
        <div className="video-inner">
          <div className="video-copy">
            <span className="section-kicker">Luxury House</span>
            <h2 id="video-title">Um vislumbre da sua próxima estadia.</h2>
            <p>
              Descubra os espaços da casa e imagine os dias que pode viver aqui.
            </p>
            <a className="video-link" href="#tour">
              Ver os espaços <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="video-frame">
            <img src={VIDEO_COVER} alt="Imagem editorial da Luxury House." loading="lazy" />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="site-brand" href="#inicio" aria-label="Luxury House — voltar ao início">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span className="brand-copy">
            <b>Luxury House</b>
            <small>Private villa</small>
          </span>
        </a>
        <span>© {new Date().getFullYear()} Luxury House</span>
        <a href="#contacto">Localização</a>
      </footer>

      {transition && (
        <div
          className={`entry-transition active${transitioned ? ' transitioned' : ''}${fading ? ' fading' : ''}`}
          aria-hidden="true"
        >
          <img className="entry-from" src={transition.from} alt="" />
          <img className="entry-to" src={transition.to} alt="" />
        </div>
      )}
    </main>
  );
}
