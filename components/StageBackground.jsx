'use client';
import { useEffect, useState } from 'react';

// Crossfading painting background for the landing. Cycles through the first few
// works' images every 6s; the "Next painting" button advances and resets the
// clock. Ported from the static script.js stage logic. Falls back gracefully if
// there are no images yet (DB unseeded) — renders nothing visible.
export default function StageBackground({ images = [] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, [images.length]);

  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <>
      <div className="stage__bg" aria-hidden="true">
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            className={i === active ? 'is-active' : ''}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        ))}
      </div>
      <div className="stage__scrim" aria-hidden="true" />
      {images.length > 1 && (
        <button className="stage__cycle" onClick={next} aria-label="Show the next painting">
          <span aria-hidden="true" /> Next painting
        </button>
      )}
    </>
  );
}
