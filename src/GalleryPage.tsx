import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import type { ApiHomepageContentItem } from './api';

type GalleryPageProps = {
  content: ApiHomepageContentItem[];
};

const galleryFallbackIntro = {
  label: 'FOTODOKUMENTACE',
  title: 'Proměna, která je vidět.',
  body: 'Skutečná práce nevzniká v prezentaci. Roste krok za krokem z dostupného materiálu, společného úsilí a odhodlání dát lidem i věcem další možnost.'
};

const wrapGalleryIndex = (index: number, length: number) => (index + length) % length;

export default function GalleryPage({ content }: GalleryPageProps) {
  const intro = content.find((item) => item.id === 'practice-gallery' && item.contentType === 'section');
  const galleryItems = React.useMemo(
    () =>
      content
        .filter((item) => item.contentType === 'gallery' && item.isActive && item.imageUrl.trim())
        .sort((left, right) => left.sortOrder - right.sortOrder),
    [content]
  );
  const [featuredIndex, setFeaturedIndex] = React.useState(0);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const manualPauseUntil = React.useRef(0);
  const swipeStartX = React.useRef<number | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const featuredItem = galleryItems[featuredIndex] ?? galleryItems[0];
  const lightboxItem = lightboxIndex === null ? null : galleryItems[lightboxIndex];
  const title = intro?.title || galleryFallbackIntro.title;
  const description = intro?.body || galleryFallbackIntro.body;

  const showFeatured = React.useCallback(
    (index: number, manual = false) => {
      if (galleryItems.length === 0) return;
      if (manual) manualPauseUntil.current = Date.now() + 10_000;
      setFeaturedIndex(wrapGalleryIndex(index, galleryItems.length));
    },
    [galleryItems.length]
  );

  const moveLightbox = React.useCallback(
    (direction: number) => {
      setLightboxIndex((current) =>
        current === null || galleryItems.length === 0
          ? current
          : wrapGalleryIndex(current + direction, galleryItems.length)
      );
    },
    [galleryItems.length]
  );

  React.useEffect(() => {
    if (galleryItems.length < 2) return undefined;
    const timer = window.setInterval(() => {
      if (Date.now() < manualPauseUntil.current || document.hidden) return;
      setFeaturedIndex((current) => wrapGalleryIndex(current + 1, galleryItems.length));
    }, 6_800);
    return () => window.clearInterval(timer);
  }, [galleryItems.length]);

  React.useEffect(() => {
    if (featuredIndex >= galleryItems.length) setFeaturedIndex(0);
    if (lightboxIndex !== null && lightboxIndex >= galleryItems.length) setLightboxIndex(null);
  }, [featuredIndex, galleryItems.length, lightboxIndex]);

  React.useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, moveLightbox]);

  React.useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionMeta?.content;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link');
    const canonicalCreated = !canonical.parentNode;
    const previousCanonical = canonical.href;
    if (canonicalCreated) {
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    document.title = 'Galerie z praxe | RESTART Integrace';
    if (descriptionMeta) descriptionMeta.content = description;
    canonical.href = `${window.location.origin}/galerie`;
    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== undefined) descriptionMeta.content = previousDescription;
      if (canonicalCreated) canonical.remove();
      else canonical.href = previousCanonical;
    };
  }, [description]);

  return (
    <div className="gallery-page">
      <header className="gallery-page-header">
        <div className="gallery-page-heading">
          <p className="section-label">{intro?.label || galleryFallbackIntro.label}</p>
          <h1 id="gallery-page-title">{title}</h1>
          <p>{description}</p>
        </div>
        <div className="gallery-page-mark" aria-label={`${galleryItems.length} fotografií z praxe`}>
          <ImageIcon size={22} aria-hidden="true" />
          <strong>{galleryItems.length}</strong>
          <span>fotografií<br />z praxe</span>
        </div>
      </header>

      {featuredItem ? (
        <section className="gallery-feature" aria-labelledby="gallery-feature-title">
          <div className="gallery-feature-copy">
            <p className="section-label">{featuredItem.label || 'VYBRANÝ PŘÍBĚH'}</p>
            <span className="gallery-feature-number">{String(featuredIndex + 1).padStart(2, '0')}</span>
            <h2 id="gallery-feature-title">{featuredItem.title}</h2>
            <p>{featuredItem.body}</p>
            <div className="gallery-feature-controls" aria-label="Ovládání slideshow">
              <button type="button" onClick={() => showFeatured(featuredIndex - 1, true)} aria-label="Předchozí fotografie">
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <span>{featuredIndex + 1} / {galleryItems.length}</span>
              <button type="button" onClick={() => showFeatured(featuredIndex + 1, true)} aria-label="Další fotografie">
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <button
            className="gallery-feature-image"
            type="button"
            onClick={() => setLightboxIndex(featuredIndex)}
            aria-label={`Zvětšit fotografii: ${featuredItem.title}`}
          >
            <img src={featuredItem.imageUrl} alt={featuredItem.title} fetchPriority="high" />
            <span><Maximize2 size={17} aria-hidden="true" /> Zobrazit přes celou obrazovku</span>
          </button>
        </section>
      ) : (
        <section className="gallery-empty" aria-labelledby="gallery-empty-title">
          <ImageIcon size={28} aria-hidden="true" />
          <h2 id="gallery-empty-title">Galerie se právě připravuje.</h2>
          <p>Fotodokumentaci postupně doplňujeme v administraci projektu.</p>
        </section>
      )}

      {galleryItems.length > 0 && (
        <section className="gallery-collection" aria-labelledby="gallery-collection-title">
          <div className="gallery-collection-heading">
            <div>
              <p className="section-label">CELÁ FOTODOKUMENTACE</p>
              <h2 id="gallery-collection-title">Místo, lidé a práce v obrazech.</h2>
            </div>
            <p>Každá fotografie zachycuje konkrétní krok. Kliknutím ji otevřete v plné velikosti.</p>
          </div>
          <div className="gallery-collection-grid">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                className="gallery-tile"
                data-layout={index % 8}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Otevřít fotografii: ${item.title}`}
              >
                <img src={item.imageUrl} alt="" loading="lazy" decoding="async" />
                <span className="gallery-tile-shade" aria-hidden="true" />
                <span className="gallery-tile-caption">
                  <small>{item.label || String(index + 1).padStart(2, '0')}</small>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </span>
                <Maximize2 className="gallery-tile-icon" size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="gallery-page-cta" aria-label="Zapojení do projektu">
        <div>
          <p className="section-label">DALŠÍ KROK</p>
          <h2>Proměna pokračuje každý den.</h2>
          <p>Pomoci můžete materiálem, prací, odborností nebo partnerstvím.</p>
        </div>
        <div>
          <a className="button primary" href="/zapojeni">Jak se zapojit <ArrowRight size={17} /></a>
          <a className="button secondary" href="/kontakt">Napište nám</a>
        </div>
      </section>

      {lightboxItem && lightboxIndex !== null && createPortal((
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
          aria-describedby="gallery-lightbox-description"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <button
            ref={closeButtonRef}
            className="gallery-lightbox-close"
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Zavřít galerii"
          >
            <X size={22} aria-hidden="true" />
          </button>
          {galleryItems.length > 1 && (
            <button className="gallery-lightbox-arrow previous" type="button" onClick={() => moveLightbox(-1)} aria-label="Předchozí fotografie">
              <ArrowLeft size={23} aria-hidden="true" />
            </button>
          )}
          <figure
            onTouchStart={(event) => {
              swipeStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (swipeStartX.current === null) return;
              const distance = (event.changedTouches[0]?.clientX ?? swipeStartX.current) - swipeStartX.current;
              if (Math.abs(distance) > 45) moveLightbox(distance > 0 ? -1 : 1);
              swipeStartX.current = null;
            }}
          >
            <img src={lightboxItem.imageUrl} alt={lightboxItem.title} />
            <figcaption>
              <span>{lightboxIndex + 1} / {galleryItems.length}</span>
              <div>
                <h2 id="gallery-lightbox-title">{lightboxItem.title}</h2>
                <p id="gallery-lightbox-description">{lightboxItem.body}</p>
              </div>
            </figcaption>
          </figure>
          {galleryItems.length > 1 && (
            <button className="gallery-lightbox-arrow next" type="button" onClick={() => moveLightbox(1)} aria-label="Další fotografie">
              <ArrowRight size={23} aria-hidden="true" />
            </button>
          )}
        </div>
      ), document.body)}
    </div>
  );
}
