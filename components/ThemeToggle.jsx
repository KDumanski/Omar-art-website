'use client';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

// Sun (light) / Moon (dark) toggle. Reads the attribute the inline ThemeScript
// already set, so the icon is correct on first interaction without hydration flash.
export default function ThemeToggle({ className = '' }) {
  // Light is this site's default (see the theme script in layout.jsx), so start
  // there — starting at 'dark' briefly rendered the wrong icon on a light page.
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    // Must match the key layout.jsx reads. This wrote 'ft-theme' (left over from
    // the app this was forked from) while the loader read 'oc-theme', so the
    // visitor's choice was silently forgotten on the next page load.
    try { localStorage.setItem('oc-theme', next); } catch (e) {}
    setTheme(next);
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      className={`${styles.toggle} ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        // Sun (Ra's disc) — shown in dark mode to switch to light
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21.5" y2="12" />
            <line x1="5.2" y1="5.2" x2="6.9" y2="6.9" /><line x1="17.1" y1="17.1" x2="18.8" y2="18.8" />
            <line x1="18.8" y1="5.2" x2="17.1" y2="6.9" /><line x1="6.9" y1="17.1" x2="5.2" y2="18.8" />
          </g>
        </svg>
      ) : (
        // Crescent moon (Khonsu) — shown in light mode to switch to dark
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 14.2A8.2 8.2 0 0 1 9.8 3.5a8.2 8.2 0 1 0 10.7 10.7z" />
        </svg>
      )}
    </button>
  );
}
