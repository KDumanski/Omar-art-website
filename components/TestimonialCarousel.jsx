'use client';
import { useState } from 'react';
import styles from './TestimonialCarousel.module.css';

// Written testimonials, passed in from a server page that reads the DB.
export default function TestimonialCarousel({ testimonials = [] }) {
  const [i, setI] = useState(0);
  const n = testimonials.length;
  if (n === 0) return null;
  const idx = i % n;
  const go = (d) => setI((prev) => (prev + d + n) % n);
  const t = testimonials[idx];

  return (
    <div className={styles.wrap}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={() => go(-1)} aria-label="Previous testimonial">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <figure className={styles.card} key={idx}>
        <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
        <blockquote className={styles.quote}>{t.quote}</blockquote>
        <figcaption className={styles.cap}>
          <span className={styles.avatar} aria-hidden="true">{(t.name || '?').charAt(0)}</span>
          <span className={styles.who}>
            <span className={styles.name}>{t.name}</span>
            <span className={styles.from}>{[t.from, t.journey].filter(Boolean).join(' · ')}</span>
          </span>
        </figcaption>
      </figure>

      <button className={`${styles.arrow} ${styles.right}`} onClick={() => go(1)} aria-label="Next testimonial">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
        {testimonials.map((_, d) => (
          <button
            key={d}
            className={`${styles.dot} ${d === idx ? styles.dotActive : ''}`}
            onClick={() => setI(d)}
            aria-label={`Go to testimonial ${d + 1}`}
            aria-selected={d === idx}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
