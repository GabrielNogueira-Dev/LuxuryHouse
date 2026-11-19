import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SCENES } from './data/scenes.js';

const AMBIENT_AUDIO = `${import.meta.env.BASE_URL}assets/audio/zen-ambience.wav`;

const ImmersiveTour = forwardRef(function ImmersiveTour(_props, ref) {
  const stageRef = useRef(null);
  const audioRef = useRef(null);
  const musicEnabledRef = useRef(false);
  const audioRequestRef = useRef(0);
  const panStartRef = useRef(null);
  const [currentId, setCurrentId] = useState(SCENES[0].id);
  const [seen, setSeen] = useState(() => new Set([SCENES[0].id]));
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const currentIndex = SCENES.findIndex((scene) => scene.id === currentId);
  const currentScene = SCENES[currentIndex] || SCENES[0];
  const previousScene = SCENES[(currentIndex - 1 + SCENES.length) % SCENES.length];
  const nextScene = SCENES[(currentIndex + 1) % SCENES.length];

  function goTo(id) {
    const scene = SCENES.find((entry) => entry.id === id);
    if (!scene) return;
    setCurrentId(scene.id);
    setSeen((previous) => new Set(previous).add(scene.id));
    setLocationsOpen(false);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    panStartRef.current = null;
  }

  function moveBy(offset) {
    const nextIndex = (currentIndex + offset + SCENES.length) % SCENES.length;
    goTo(SCENES[nextIndex].id);
  }

  function clampPan(x, y) {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return { x: 0, y: 0 };
    return {
      x: Math.max(-bounds.width * 0.06, Math.min(bounds.width * 0.06, x)),
      y: Math.max(-bounds.height * 0.06, Math.min(bounds.height * 0.06, y)),
    };
  }

  function handlePanStart(event) {
    if (event.button !== 0) return;
    panStartRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      clientX: event.clientX,
      clientY: event.clientY,
      x: pan.x,
      y: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePanMove(event) {
    const start = panStartRef.current;
    if (!start) {
      if (event.pointerType !== 'mouse') return;
      const bounds = stageRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
      setPan(clampPan(x * bounds.width * 0.06, y * bounds.height * 0.06));
      return;
    }
    if (start.pointerId !== event.pointerId) return;
    const verticalDelta = start.pointerType === 'touch' ? 0 : event.clientY - start.clientY;
    setPan(clampPan(start.x + event.clientX - start.clientX, start.y + verticalDelta));
  }

  function handlePanLeave(event) {
    if (panStartRef.current || event.pointerType !== 'mouse') return;
    setPan({ x: 0, y: 0 });
  }

  function handlePanEnd(event) {
    if (panStartRef.current?.pointerId !== event.pointerId) return;
    panStartRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePanKeyDown(event) {
    const step = event.shiftKey ? 72 : 36;
    const offsets = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    setPan((current) => clampPan(current.x + offset[0], current.y + offset[1]));
  }

  async function startAmbientMusic() {
    if (musicEnabledRef.current) return;

    const audio = audioRef.current;
    if (!audio) {
      setAudioError('A música ambiente não está disponível.');
      return;
    }

    const requestId = audioRequestRef.current + 1;
    audioRequestRef.current = requestId;
    try {
      audio.volume = 0.32;
      const playback = audio.play();
      musicEnabledRef.current = true;
      await playback;
      if (audioRequestRef.current !== requestId) return;
      setMusicEnabled(true);
      setAudioError('');
    } catch (error) {
      if (audioRequestRef.current !== requestId) return;
      musicEnabledRef.current = false;
      setMusicEnabled(false);
      console.error('Could not play the ambient music file.', error);
      setAudioError('A música ambiente não está disponível neste navegador.');
    }
  }

  function stopAmbientMusic() {
    audioRequestRef.current += 1;
    musicEnabledRef.current = false;
    setMusicEnabled(false);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  }

  function toggleAmbientMusic() {
    if (musicEnabledRef.current) {
      stopAmbientMusic();
    } else {
      void startAmbientMusic();
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      goTo,
      startAmbientMusic,
      getCurrentImage: () => currentScene.image.src,
      scrollToStage: (behavior = 'smooth') =>
        stageRef.current?.scrollIntoView({ behavior, block: 'start' }),
    }),
    [currentScene, startAmbientMusic],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setLocationsOpen(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audioRequestRef.current += 1;
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current || !('IntersectionObserver' in window)) return undefined;
    let hasEntered = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        hasEntered = true;
      } else if (hasEntered) {
        stopAmbientMusic();
      }
    }, { threshold: 0.1 });

    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="tour-section" id="tour" aria-labelledby="tour-title">
      <div className="tour-heading">
        <span className="section-kicker">Explore a casa</span>
        <h2 id="tour-title">Entre e descubra os espaços.</h2>
        <p>
          Siga o percurso entre os espaços em fotografias de ecrã inteiro. Uma
          visita Matterport poderá ser integrada aqui no futuro.
        </p>
      </div>

      <div className="tour" id="tour-stage" ref={stageRef}>
        <audio
          ref={audioRef}
          src={AMBIENT_AUDIO}
          loop
          preload="none"
          aria-hidden="true"
        />
        <div
          className={`tour-photo${isDragging ? ' is-dragging' : ''}`}
          data-scene={currentScene.id}
          key={currentScene.id}
          role="group"
          tabIndex={0}
          aria-label="Fotografia explorável. Mova o cursor, arraste ou use as setas do teclado."
          onKeyDown={handlePanKeyDown}
          onPointerDown={handlePanStart}
          onPointerMove={handlePanMove}
          onPointerLeave={handlePanLeave}
          onPointerUp={handlePanEnd}
          onPointerCancel={handlePanEnd}
        >
          <img
            id="img"
            src={currentScene.image.src}
            alt={currentScene.image.alt}
            draggable={false}
            style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(1.12)` }}
          />
        </div>
        <div className="shade" aria-hidden="true" />

        <div className="top">
          <a className="brand" href="#inicio" aria-label="Luxury House — início">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span className="brand-copy">
              <b>Luxury House</b>
              <small>Private villa</small>
            </span>
          </a>
          <div className="top-actions">
            <span className="status">
              <i aria-hidden="true" />
              PERCURSO FOTOGRÁFICO
            </span>
            <button
              className={`audio-toggle${musicEnabled ? ' is-on' : ''}`}
              type="button"
              aria-label={musicEnabled ? 'Desligar música ambiente' : 'Ligar música ambiente'}
              aria-pressed={musicEnabled}
              onClick={toggleAmbientMusic}
            >
              <span className="audio-symbol" aria-hidden="true">♫</span>
              <span className="audio-label">{musicEnabled ? 'Som ativo' : 'Som zen'}</span>
            </button>
            <button
              className={`pill${locationsOpen ? ' active' : ''}`}
              type="button"
              aria-expanded={locationsOpen}
              aria-controls="loc"
              onClick={() => setLocationsOpen((open) => !open)}
            >
              <span className="pill-label">Espaços</span>
              <span className="pill-count">
                {String(currentIndex + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
              </span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <p id="hint">Mova o cursor ou arraste para explorar o espaço</p>
        <button
          className="hs hs-prev b"
          type="button"
          aria-label={`Voltar para ${previousScene.title}`}
          onClick={() => moveBy(-1)}
        >
          <i aria-hidden="true" />
          <span><small>ANTERIOR</small>{previousScene.title}</span>
        </button>
        <button
          className="hs hs-next"
          type="button"
          aria-label={`Seguir para ${nextScene.title}`}
          onClick={() => moveBy(1)}
        >
          <i aria-hidden="true" />
          <span><small>PRÓXIMO ESPAÇO</small>{nextScene.title}</span>
        </button>

        <div className="cap" aria-live="polite">
          <span className="cap-kicker">
            Espaço {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <h2>{currentScene.title}</h2>
          <p>{currentScene.description}</p>
          {audioError && <p className="audio-error" role="status">{audioError}</p>}
        </div>
        <span className="cr">Fotografias da Luxury House</span>

        <div
          className={`locations-panel${locationsOpen ? ' on' : ''}`}
          id="loc"
          aria-hidden={!locationsOpen}
          inert={!locationsOpen}
        >
          <div className="loc-head">
            <div className="loc-title">
              <strong>Espaços da casa</strong>
              <span>Selecione uma fotografia</span>
            </div>
            <span className="loc-progress">
              {String(currentIndex + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
            </span>
          </div>
          <div className="st">
            {SCENES.map((scene, index) => (
              <button
                className={`th${scene.id === currentId ? ' cur' : ''}${seen.has(scene.id) ? ' seen' : ''}`}
                key={scene.id}
                type="button"
                aria-label={`Ver fotografia: ${scene.title}`}
                aria-current={scene.id === currentId ? 'true' : undefined}
                onClick={() => goTo(scene.id)}
              >
                <img src={scene.image.thumbnail} alt="" loading="lazy" />
                <span>{scene.title}</span>
                <span className="sr-only">Fotografia {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ImmersiveTour;
