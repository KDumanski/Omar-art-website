// Inline SVG Egyptian glyphs — zero font dependency, render identically on every
// device (the Unicode hieroglyph block isn't reliably installed on most OSes).
// Use <Glyph name="ankh" /> etc. Sized via font-size (uses 1em) and inherits color.

const PATHS = {
  // Ankh — life
  ankh: (
    <>
      <ellipse cx="12" cy="6.5" rx="3.6" ry="4.4" />
      <line x1="12" y1="11" x2="12" y2="21.5" />
      <line x1="7" y1="14.5" x2="17" y2="14.5" />
    </>
  ),
  // Eye of Horus (wedjat) — protection
  eye: (
    <>
      <path d="M3 11c3-3.4 7-5 9.5-5S19 8 21 11c-2 3-5 5-8.5 5S6 14 3 11z" />
      <circle cx="11.5" cy="11" r="2.4" fill="currentColor" stroke="none" />
      <path d="M12 16.5c.5 2 .2 3.6-1.2 4.8" />
      <path d="M16.5 15.5c1.8.4 2.8 1.6 3 3.4" />
    </>
  ),
  // Lotus — rebirth / the Nile
  lotus: (
    <>
      <path d="M12 21c0-5 0-9 0-11" />
      <path d="M12 10c-2-2-5-2-7 0 0 4 3 6 7 6 4 0 7-2 7-6-2-2-5-2-7 0z" />
      <path d="M12 12c-1.4-3-4-4.5-7-4 0 0 .5 3 3 4.5" />
      <path d="M12 12c1.4-3 4-4.5 7-4 0 0-.5 3-3 4.5" />
    </>
  ),
  // Wave / water — somatics, the sea
  water: (
    <>
      <path d="M2 8c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 6.5 0" />
      <path d="M2 13c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 6.5 0" />
      <path d="M2 18c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 6.5 0" />
    </>
  ),
  // Sun disc of Ra — awaken / dawn
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="2.5" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21.5" y2="12" />
      <line x1="5.4" y1="5.4" x2="7.5" y2="7.5" />
      <line x1="16.5" y1="16.5" x2="18.6" y2="18.6" />
      <line x1="18.6" y1="5.4" x2="16.5" y2="7.5" />
      <line x1="7.5" y1="16.5" x2="5.4" y2="18.6" />
    </>
  ),
  // Circle of unity — sharing circles / integrate
  circle: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  // Pyramid — Egypt / temples
  pyramid: (
    <>
      <path d="M12 3 22 20H2L12 3z" />
      <path d="M12 3 12 20" />
      <path d="M7.5 11.5 12 9l4.5 2.5" />
    </>
  ),
  // Scarab — transformation
  scarab: (
    <>
      <ellipse cx="12" cy="13" rx="5" ry="6.5" />
      <circle cx="12" cy="4.5" r="2.2" />
      <line x1="12" y1="6.5" x2="12" y2="19.5" />
      <path d="M7 9 3 7M17 9l4-2M7 14H2.5M17 14h4.5M7.5 18l-3 2M16.5 18l3 2" />
    </>
  ),
  // Feather of Ma'at — truth / balance
  feather: (
    <>
      <path d="M14 3c-4 2-7 6-8 11-.4 2-.4 4 0 7" />
      <path d="M14 3c2 3 2 7 0 11-1 2-2.5 3.5-5 5" />
      <path d="M12 7l-3.5 2M12.5 11l-4 2.2M12 15l-4 2.4" />
    </>
  ),
};

export default function Glyph({ name = 'ankh', className = '', style, title }) {
  const path = PATHS[name] || PATHS.ankh;
  return (
    <svg
      className={className}
      style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
}

// A row of glyphs used as a decorative divider.
export function GlyphRule({ names = ['eye', 'water', 'ankh'], className = '' }) {
  return (
    <span className={className} aria-hidden="true" style={{ display: 'inline-flex', gap: '0.4em', alignItems: 'center' }}>
      {names.map((n, i) => <Glyph key={i} name={n} />)}
    </span>
  );
}
