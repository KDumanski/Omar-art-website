import Link from 'next/link';
import styles from './JourneyCard.module.css';

export default function JourneyCard({ tour, featured = false }) {
  return (
    <Link
      href={`/journeys/${tour.slug}/`}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
    >
      <div className={styles.media}>
        {/* plain img: static export uses unoptimized images; Unsplash CDN */}
        <img src={tour.image} alt={tour.name} loading="lazy" className={styles.img} />
        <span className={styles.badge}>{tour.badge}</span>
        <span className={styles.price}>{tour.price}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.route}>{tour.route}</span>
          <span className={styles.dot} aria-hidden="true">&middot;</span>
          <span className={styles.dates}>{tour.dates}</span>
        </div>
        <h3 className={styles.title}>{tour.name}</h3>
        <p className={styles.subtitle}>{tour.subtitle}</p>
        <p className={styles.for}>{tour.forWhom}</p>
        <span className={styles.cta}>
          Explore the Journey
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
