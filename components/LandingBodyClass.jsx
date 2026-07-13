'use client';
import { useEffect } from 'react';

// The landing is a fit-to-screen stage: lock page scroll and hide the flow footer
// while it's mounted. Cleans up on navigation away.
export default function LandingBodyClass() {
  useEffect(() => {
    document.body.classList.add('is-landing');
    return () => document.body.classList.remove('is-landing');
  }, []);
  return null;
}
