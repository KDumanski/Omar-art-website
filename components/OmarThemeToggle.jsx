'use client';
import { useEffect, useState } from 'react';

// Split yellow/purple dot toggle, matching the static site. The inline ThemeScript
// in layout.jsx sets [data-theme] before paint (key: oc-theme); this just flips it.
export default function OmarThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }, []);

  function toggle() {
    const next = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('oc-theme', next); } catch (e) {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="theme"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <span className="theme__dot" aria-hidden="true" />
    </button>
  );
}
