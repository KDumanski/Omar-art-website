import Glyph from './Glyph';
import styles from './PageHero.module.css';

// Reusable compact hero for inner pages: full-bleed image + kicker + title + sub.
// `glyph` is an SVG glyph name (see components/Glyph.jsx).
export default function PageHero({ kicker, title, sub, image, glyph }) {
  return (
    <header className={styles.hero}>
      <img src={image} alt="" aria-hidden="true" className={styles.bg} />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        {glyph && <Glyph name={glyph} className={styles.glyph} />}
        {kicker && <p className={styles.kicker}>{kicker}</p>}
        <h1 className={styles.title}>{title}</h1>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
    </header>
  );
}
