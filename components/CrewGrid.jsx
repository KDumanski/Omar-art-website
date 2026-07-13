import SectionReveal from './SectionReveal';
import { asset } from '@/lib/asset';
import styles from './CrewGrid.module.css';

// The crew, passed in from a server page that reads the DB (lib/data.getCrew()).
// Fabian (the founder, lead=true) gets a wider feature card with his note; everyone
// else is an even portrait grid. `limit` lets the home page show a teaser.
export default function CrewGrid({ crew = [], limit }) {
  const people = limit ? crew.slice(0, limit) : crew;
  return (
    <div className={styles.grid}>
      {people.map((m, i) => (
        <SectionReveal
          key={m.id ?? m.name}
          delay={Math.min(i, 3) * 50}
          className={`${styles.card} ${m.lead ? styles.lead : ''}`}
        >
          <div className={styles.media}>
            <img src={asset(m.photo)} alt={m.name} className={styles.photo} loading="lazy" />
          </div>
          <div className={styles.body}>
            {m.lead ? <span className={styles.leadKicker}>The Founder</span> : null}
            <h3 className={styles.name}>{m.name}</h3>
            <p className={styles.role}>{m.role}</p>
            {m.note ? <p className={styles.note}>{m.note}</p> : null}
          </div>
        </SectionReveal>
      ))}
    </div>
  );
}
