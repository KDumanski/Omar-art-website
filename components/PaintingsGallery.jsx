'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

// The paintings view: one grid with three independent facets (Year · Size ·
// Surface), each card opens a stepping lightbox over the *currently filtered*
// list. A card that belongs to a show links to /shows/{showSlug}. Ported from
// the static script.js, but the works come from the DB via props.
//
// works: [{ slug, title, year, medium, dimensions, image, status, surface,
//           tier, showTitle, showSlug }]

const TIERS = [
  { value: 'all', label: 'All' },
  { value: 'pequeno', label: 'Pequeño', hint: 'up to 16″' },
  { value: 'mediano', label: 'Mediano', hint: '20–34″' },
  { value: 'grande', label: 'Grande', hint: '40″ +' },
];
const SURFACES = [
  { value: 'all', label: 'All' },
  { value: 'Canvas', label: 'Canvas' },
  { value: 'Paper', label: 'Paper' },
  { value: 'Wood panel', label: 'Wood panel' },
];

const statusClass = (s) =>
  s ? `art__status art__status--${String(s).toLowerCase().replace(/[^a-z]/g, '')}` : '';
const metaLine = (w) => [w.dimensions, w.year].filter(Boolean).join(' · ');
const cap = (w) => `${w.title} — ${[w.medium || w.surface, w.dimensions, w.year].filter(Boolean).join(', ')}`;

export default function PaintingsGallery({ works = [] }) {
  const [year, setYear] = useState('all');
  const [tier, setTier] = useState('all');
  const [surface, setSurface] = useState('all');
  const [index, setIndex] = useState(-1); // lightbox index into the filtered list

  const years = useMemo(
    () => Array.from(new Set(works.map((w) => w.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a)),
    [works]
  );

  const filtered = useMemo(
    () =>
      works.filter(
        (w) =>
          (year === 'all' || String(w.year) === String(year)) &&
          (tier === 'all' || w.tier === tier) &&
          (surface === 'all' || w.surface === surface)
      ),
    [works, year, tier, surface]
  );

  const open = index >= 0;
  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(
    (dir) => setIndex((i) => (i < 0 ? i : (i + dir + filtered.length) % filtered.length)),
    [filtered.length]
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

  const clearAll = () => { setYear('all'); setTier('all'); setSurface('all'); };
  const current = open ? filtered[index] : null;

  return (
    <>
      <div className="filters">
        <div className="filters__row" aria-label="Filter by year">
          <span className="filters__label">Year</span>
          <span className="filters__chips">
            <button className={`chip${year === 'all' ? ' is-active' : ''}`} onClick={() => setYear('all')}>All</button>
            {years.map((y) => (
              <button key={y} className={`chip${String(year) === String(y) ? ' is-active' : ''}`} onClick={() => setYear(y)}>{y}</button>
            ))}
          </span>
        </div>

        <div className="filters__row" aria-label="Filter by size">
          <span className="filters__label">Size</span>
          <span className="filters__chips">
            {TIERS.map((t) => (
              <button key={t.value} className={`chip${tier === t.value ? ' is-active' : ''}`} onClick={() => setTier(t.value)}>
                {t.label}{t.hint && <small>{t.hint}</small>}
              </button>
            ))}
          </span>
        </div>

        <div className="filters__row" aria-label="Filter by surface">
          <span className="filters__label">Surface</span>
          <span className="filters__chips">
            {SURFACES.map((s) => (
              <button key={s.value} className={`chip${surface === s.value ? ' is-active' : ''}`} onClick={() => setSurface(s.value)}>
                {s.label}
              </button>
            ))}
          </span>
        </div>
      </div>

      <p className="filters__count">{filtered.length} {filtered.length === 1 ? 'work' : 'works'}</p>

      {filtered.length === 0 ? (
        <p className="filters__empty">
          No works match those filters.{' '}
          <button className="linkback" onClick={clearAll}>Clear filters</button>
        </p>
      ) : (
        <div className="grid">
          {filtered.map((w, i) => (
            <div key={w.slug || w.image || i} className="art">
              {w.surface && <span className="art__tag">{w.surface}</span>}
              {w.status && <span className={statusClass(w.status)}>{w.status}</span>}
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View ${w.title}`}
                style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}
              >
                <img src={w.image} alt={`${w.title}${metaLine(w) ? ' — ' + metaLine(w) : ''}`} loading="lazy" />
              </button>
              <span className="art__overlay">
                <span className="art__title">{w.title}</span>
                <span className="art__meta">{[w.medium, w.dimensions, w.year].filter(Boolean).join(' · ')}</span>
                {w.showSlug && (
                  <Link className="art__show" href={`/shows/${w.showSlug}`}>
                    Exhibited in {w.showTitle} ↗
                  </Link>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        className={`lightbox${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={open ? 'false' : 'true'}
        aria-label="Artwork viewer"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <button className="lightbox__close" aria-label="Close" onClick={close}>×</button>
        {filtered.length > 1 && (
          <button className="lightbox__nav lightbox__nav--prev" aria-label="Previous" onClick={() => step(-1)}>‹</button>
        )}
        <figure className="lightbox__figure">
          {current && <img src={current.image} alt={cap(current)} />}
          <figcaption>{current ? cap(current) : ''}</figcaption>
        </figure>
        {filtered.length > 1 && (
          <button className="lightbox__nav lightbox__nav--next" aria-label="Next" onClick={() => step(1)}>›</button>
        )}
      </div>
    </>
  );
}
