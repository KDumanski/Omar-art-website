'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PaintingsGallery from './PaintingsGallery';

// PAINTINGS & SHOWS browser with a "By show / By painting" toggle.
//  - By show: each exhibition shows its installation views + the paintings that hung
//    in it (merged in). Paintings not linked to any show fall into a loose "Other work"
//    group. Clicking a painting opens a lightbox that steps through the whole body of
//    work in show order.
//  - By painting: the full filterable grid (PaintingsGallery), self-contained.
//
// shows: [{ slug, title, gallery, city, year, blurb, installations:[{id,image,caption}] }]
// works: [{ slug, title, year, medium, dimensions, image, status, surface, tier, showTitle, showSlug }]

const statusClass = (s) =>
  s ? `art__status art__status--${String(s).toLowerCase().replace(/[^a-z]/g, '')}` : '';
const metaLine = (w) => [w.dimensions, w.year].filter(Boolean).join(' · ');
const cap = (w) => `${w.title} — ${[w.medium || w.surface, w.dimensions, w.year].filter(Boolean).join(', ')}`;

function ArtCard({ w, onOpen }) {
  return (
    <div className="art">
      {w.surface && <span className="art__tag">{w.surface}</span>}
      {w.status && <span className={statusClass(w.status)}>{w.status}</span>}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${w.title}`}
        style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}
      >
        <img src={w.image} alt={`${w.title}${metaLine(w) ? ' — ' + metaLine(w) : ''}`} loading="lazy" />
      </button>
      <span className="art__overlay">
        <span className="art__title">{w.title}</span>
        <span className="art__meta">{[w.medium, w.dimensions, w.year].filter(Boolean).join(' · ')}</span>
      </span>
    </div>
  );
}

export default function WorkBrowser({ shows = [], works = [] }) {
  const [view, setView] = useState('show'); // 'show' | 'painting'
  const [index, setIndex] = useState(-1);   // lightbox index into `ordered` (show view)

  // group works by show slug + a loose bucket for unlinked ones
  const { bySlug, loose, ordered } = useMemo(() => {
    const bySlug = {};
    const loose = [];
    for (const w of works) {
      if (w.showSlug) (bySlug[w.showSlug] ||= []).push(w);
      else loose.push(w);
    }
    // flat list in show order (then loose) so the lightbox steps through everything
    const ordered = [];
    for (const sh of shows) for (const w of (bySlug[sh.slug] || [])) ordered.push(w);
    for (const w of loose) ordered.push(w);
    return { bySlug, loose, ordered };
  }, [shows, works]);

  const open = index >= 0;
  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(
    (dir) => setIndex((i) => (i < 0 ? i : (i + dir + ordered.length) % ordered.length)),
    [ordered.length]
  );
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, step]);
  const current = open ? ordered[index] : null;

  return (
    <>
      {/* toggle — reuses the filter-chip styling */}
      <div className="filters filters--toggle">
        <div className="filters__row" aria-label="Choose how to browse">
          <span className="filters__label">View</span>
          <span className="filters__chips">
            <button className={`chip${view === 'show' ? ' is-active' : ''}`} onClick={() => setView('show')}>By show</button>
            <button className={`chip${view === 'painting' ? ' is-active' : ''}`} onClick={() => setView('painting')}>By painting</button>
          </span>
        </div>
      </div>

      {view === 'painting' ? (
        <PaintingsGallery works={works} />
      ) : (
        <>
          {shows.map((show) => {
            const meta = [show.gallery, show.city, show.year].filter(Boolean).join(' · ');
            const thumbs = (show.installations || []).slice(0, 4);
            const shite = bySlug[show.slug] || [];
            return (
              <article className="install-show" key={show.slug}>
                <header className="install-show__head">
                  <h2 className="install-show__title">
                    <Link href={`/shows/${show.slug}`}>{show.title}</Link>
                  </h2>
                  {meta && <p className="install-show__meta">{meta}</p>}
                  <Link className="install-show__link" href={`/shows/${show.slug}`}>View exhibition&nbsp;↗</Link>
                </header>

                {thumbs.length > 0 && (
                  <div className="gallery">
                    {thumbs.map((inst, i) => (
                      <Link key={inst.id ?? i} href={`/shows/${show.slug}`} className="shot" aria-label={`View ${show.title}`}>
                        <img src={inst.image} alt={inst.caption || `${show.title} installation view`} loading="lazy" />
                      </Link>
                    ))}
                  </div>
                )}

                {shite.length > 0 ? (
                  <div className="grid">
                    {shite.map((w) => (
                      <ArtCard key={w.slug || w.image} w={w} onOpen={() => setIndex(ordered.indexOf(w))} />
                    ))}
                  </div>
                ) : (
                  thumbs.length === 0 && show.blurb && (
                    <p className="page__intro" style={{ marginTop: 'var(--s2)' }}>{show.blurb}</p>
                  )
                )}
              </article>
            );
          })}

          {loose.length > 0 && (
            <article className="install-show">
              <header className="install-show__head">
                <h2 className="install-show__title">Other work</h2>
                <p className="install-show__meta">Paintings not tied to a particular show.</p>
              </header>
              <div className="grid">
                {loose.map((w) => (
                  <ArtCard key={w.slug || w.image} w={w} onOpen={() => setIndex(ordered.indexOf(w))} />
                ))}
              </div>
            </article>
          )}

          {/* shared lightbox over the whole ordered body of work */}
          <div
            className={`lightbox${open ? ' is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={open ? 'false' : 'true'}
            aria-label="Artwork viewer"
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          >
            <button className="lightbox__close" aria-label="Close" onClick={close}>×</button>
            {ordered.length > 1 && (
              <button className="lightbox__nav lightbox__nav--prev" aria-label="Previous" onClick={() => step(-1)}>‹</button>
            )}
            <figure className="lightbox__figure">
              {current && <img src={current.image} alt={cap(current)} />}
              <figcaption>{current ? cap(current) : ''}</figcaption>
            </figure>
            {ordered.length > 1 && (
              <button className="lightbox__nav lightbox__nav--next" aria-label="Next" onClick={() => step(1)}>›</button>
            )}
          </div>
        </>
      )}
    </>
  );
}
