import SectionReveal from './SectionReveal';
import Glyph from './Glyph';
import { PILLARS } from '@/lib/copy';
import styles from './PillarGrid.module.css';

export default function PillarGrid() {
  return (
    <div className={`grid grid-4 ${styles.grid}`}>
      {PILLARS.map((p, i) => (
        <SectionReveal key={p.title} delay={i * 90} className={styles.card}>
          <Glyph name={p.glyph} className={styles.glyph} />
          <h3 className={styles.title}>{p.title}</h3>
          <p className={styles.body}>{p.body}</p>
        </SectionReveal>
      ))}
    </div>
  );
}
