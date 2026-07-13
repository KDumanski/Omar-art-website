import Link from 'next/link';
import { GlyphRule } from './Glyph';
import { BRAND, FOOTER_LINKS } from '@/lib/copy';
import { asset } from '@/lib/asset';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <img src={asset(BRAND.logo)} alt="" aria-hidden="true" className={styles.logoMark} />
              Oceanic <em>Ventures</em>
            </Link>
            <p className={styles.tagline}>{BRAND.tagline}</p>
            <p className={styles.blurb}>
              Transformational retreats rooted in the wisdom of water — sea, river,
              temple, and desert. Come for the wonder. Leave changed.
            </p>
            <div className={styles.socials} aria-label="Social links">
              <a href={BRAND.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={BRAND.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={BRAND.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>

          <nav className={styles.linkCol} aria-label="Explore">
            <h4>Explore</h4>
            {FOOTER_LINKS.explore.map((l) => (
              <Link key={l.label} href={l.href}>{l.label}</Link>
            ))}
          </nav>
          <nav className={styles.linkCol} aria-label="Discover">
            <h4>Discover</h4>
            {FOOTER_LINKS.about.map((l) => (
              <Link key={l.label} href={l.href}>{l.label}</Link>
            ))}
          </nav>
          <nav className={styles.linkCol} aria-label="More">
            <h4>More</h4>
            {FOOTER_LINKS.legal.map((l) => (
              <Link key={l.label} href={l.href}>{l.label}</Link>
            ))}
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </nav>
        </div>

        <GlyphRule className={styles.glyphRule} names={['eye', 'lotus', 'feather', 'sun', 'ankh']} />

        <div className={styles.bottom}>
          <span>
            {BRAND.name} &copy; {2026}. All rights reserved.
          </span>
          <span className={styles.made}>Crafted on the banks of the Nile.</span>
        </div>
      </div>
    </footer>
  );
}
