'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import OmarThemeToggle from './OmarThemeToggle';

// Persistent top bar (Barbara Takenaga–style). Over the landing it goes
// transparent + light-on-art; on the section routes it sits on a solid blurred
// bar. Active section is highlighted from the current path.
const LINKS = [
  { href: '/shows', label: 'Paintings & Shows' },
  { href: '/resume', label: 'Artist Statement' },
  { href: '/contact', label: 'Contact' },
];
const IG = 'https://www.instagram.com/omarchaconjr/';

export default function TopBar() {
  const pathname = usePathname() || '/';
  const isLanding = pathname === '/';

  return (
    <header
      className={`topbar ${isLanding ? 'topbar--landing' : 'topbar--solid'}`}
      data-landing={isLanding ? '' : undefined}
    >
      <nav className="topnav" aria-label="Sections">
        <Link className="topbar__brand" href="/">Omar&nbsp;Chacón</Link>
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/');
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`topnav__link${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {l.label}
            </Link>
          );
        })}
        <a className="topnav__link topnav__ig" href={IG} target="_blank" rel="noopener noreferrer">
          Instagram&nbsp;↗
        </a>
        <OmarThemeToggle />
      </nav>
    </header>
  );
}
