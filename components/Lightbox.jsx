'use client';
import { useCallback, useEffect, useState } from 'react';

// Generic image gallery + lightbox, ported from the static site's [data-lightbox]
// behavior. Renders a grid of .shot buttons; clicking one opens the modal, which
// steps through the same list with ‹ / › and arrow keys, closes on Esc / backdrop.
//
// items: [{ src, cap }]  ·  tall: use the 3:4 ("tall") gallery layout.
export default function Lightbox({ items = [], tall = false, className = '' }) {
  const [index, setIndex] = useState(-1); // -1 = closed
  const open = index >= 0;

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(
    (dir) => setIndex((i) => (i < 0 ? i : (i + dir + items.length) % items.length)),
    [items.length]
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

  if (!items.length) return null;
  const current = open ? items[index] : null;

  return (
    <>
      <div className={`gallery${tall ? ' gallery--tall' : ''} ${className}`.trim()}>
        {items.map((it, i) => (
          <button
            key={it.src + i}
            type="button"
            className="shot"
            onClick={() => setIndex(i)}
            aria-label={it.cap ? `View: ${it.cap}` : 'View image'}
          >
            {/* plain <img> to match the static site (no next/image optimizer) */}
            <img src={it.src} alt={it.cap || ''} loading="lazy" />
          </button>
        ))}
      </div>

      <div
        className={`lightbox${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={open ? 'false' : 'true'}
        aria-label="Image viewer"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <button className="lightbox__close" aria-label="Close" onClick={close}>×</button>
        {items.length > 1 && (
          <button className="lightbox__nav lightbox__nav--prev" aria-label="Previous" onClick={() => step(-1)}>‹</button>
        )}
        <figure className="lightbox__figure">
          {current && <img src={current.src} alt={current.cap || ''} />}
          <figcaption>{current?.cap || ''}</figcaption>
        </figure>
        {items.length > 1 && (
          <button className="lightbox__nav lightbox__nav--next" aria-label="Next" onClick={() => step(1)}>›</button>
        )}
      </div>
    </>
  );
}
