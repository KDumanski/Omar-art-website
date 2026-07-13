import Link from 'next/link';
import Glyph from './Glyph';
import { HERO } from '@/lib/copy';
import { IMG } from '@/lib/images';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <img src={IMG.gizaPyramids} alt="" aria-hidden="true" className={styles.bg} fetchPriority="high" />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <p className={styles.kicker}>
          <Glyph name="eye" className={styles.glyph} />
          {HERO.kicker}
        </p>
        <h1 className={styles.title}>{HERO.title}</h1>
        <p className={styles.sub}>{HERO.sub}</p>
        <div className={styles.ctas}>
          <Link href="/journeys/" className="btn btn-primary">{HERO.ctaPrimary}</Link>
          <Link href="/apply/" className="btn btn-ghost">{HERO.ctaSecondary}</Link>
        </div>
      </div>
      <a href="#pillars" className={styles.scroll} aria-label="Scroll to explore">
        <span>Scroll</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
