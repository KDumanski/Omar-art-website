'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { GlyphRule } from './Glyph';
import { BRAND } from '@/lib/copy';
import { asset } from '@/lib/asset';
import styles from './Nav.module.css';

const LINKS = [
  { label: 'Retreats', href: '/journeys/' },
  { label: 'Experiences', href: '/experiences/' },
  { label: 'About', href: '/about/' },
  { label: 'Our Crew', href: '/crew/' },
  { label: 'Testimonials', href: '/testimonials/' },
  { label: 'Social Impact', href: '/social-impact/' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change & lock body scroll while open
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.solid : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${BRAND.name} home`}>
          <img src={asset(BRAND.logo)} alt="" aria-hidden="true" className={styles.logoMark} />
          <span className={styles.logoText}>
            Oceanic <em>Ventures</em>
          </span>
        </Link>

        <nav className={styles.desktop} aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <Link href="/apply/" className={`btn btn-primary ${styles.apply}`}>
            Apply Now
          </Link>
          <button
            className={styles.burger}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`${styles.burgerBar} ${open ? styles.b1 : ''}`} />
            <span className={`${styles.burgerBar} ${open ? styles.b2 : ''}`} />
            <span className={`${styles.burgerBar} ${open ? styles.b3 : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} aria-hidden={!open}>
        <nav className={styles.drawerNav} aria-label="Mobile">
          <Link href="/" className={styles.drawerLink}>Home</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.drawerLink}>{l.label}</Link>
          ))}
          <Link href="/apply/" className={`btn btn-primary ${styles.drawerApply}`}>Apply Now</Link>
        </nav>
        <GlyphRule className={styles.glyphStrip} names={['eye', 'lotus', 'feather', 'sun']} />
      </div>
    </header>
  );
}
