import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getShow, getShowSlugs } from '@/lib/data';
import Lightbox from '@/components/Lightbox';

// Pre-list the known shows for nicer routing, but keep pages dynamic (DB-backed,
// rendered per request — this app runs as a Node server, not a static export).
export async function generateStaticParams() {
  try {
    const slugs = await getShowSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // DB unavailable at build — pages are dynamic anyway, so render on demand.
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) return { title: 'Exhibition' };
  const meta = [show.gallery, show.city, show.year].filter(Boolean).join(', ');
  return {
    title: show.title,
    description: show.blurb || `${show.title}${meta ? ' — ' + meta : ''}`,
  };
}

// ONE EXHIBITION — its installation room-shots (lightbox gallery) plus the
// individual paintings shown in it. Each painting links back into the paintings
// view; the cross-link from a painting to this show lives in PaintingsGallery.
export default async function ShowDetailPage({ params }) {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) notFound();

  const meta = [show.gallery, show.city, show.year].filter(Boolean).join(' · ');
  const installItems = (show.installations || []).map((i) => ({
    src: i.image,
    cap: i.caption || `${show.title}${meta ? ' — ' + meta : ''}`,
  }));

  return (
    <div className="page">
      <div className="page__chrome">
        <p className="page__eyebrow">Exhibition</p>
      </div>
      <div className="page__body">
        <Link href="/shows" className="linkback">‹ All shows</Link>

        <header className="page__head">
          <h1 className="page__title">{show.title}</h1>
          {meta && <p className="page__intro">{meta}</p>}
          {show.blurb && <p className="about__text" style={{ color: 'var(--ink-soft)', marginTop: 'var(--s3)' }}>{show.blurb}</p>}
          {show.pressUrl && (
            <p style={{ marginTop: 'var(--s3)' }}>
              <a className="install-show__link" style={{ marginLeft: 0 }} href={show.pressUrl} target="_blank" rel="noopener noreferrer">
                Press release&nbsp;↗
              </a>
            </p>
          )}
        </header>

        {/* Installation room-shots */}
        {installItems.length > 0 && (
          <section style={{ marginBottom: 'var(--s6)' }}>
            <h2 className="press__subtitle">Installation views</h2>
            <Lightbox items={installItems} />
          </section>
        )}

        {/* The paintings shown in this exhibition */}
        {show.works && show.works.length > 0 && (
          <section>
            <h2 className="press__subtitle">Paintings in this show</h2>
            <div className="grid">
              {show.works.map((w) => (
                <div className="art" key={w.slug || w.id}>
                  {w.surface && <span className="art__tag">{w.surface}</span>}
                  {w.status && (
                    <span className={`art__status art__status--${String(w.status).toLowerCase().replace(/[^a-z]/g, '')}`}>{w.status}</span>
                  )}
                  <Link href="/shows" aria-label={`View ${w.title} in paintings`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img src={w.image} alt={`${w.title}${w.year ? ' — ' + w.year : ''}`} loading="lazy" />
                  </Link>
                  <span className="art__overlay">
                    <span className="art__title">{w.title}</span>
                    <span className="art__meta">{[w.medium, w.dimensions, w.year].filter(Boolean).join(' · ')}</span>
                    <Link className="art__show" href="/shows">See in paintings ↗</Link>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {installItems.length === 0 && (!show.works || show.works.length === 0) && (
          <p className="filters__empty">No installation views or paintings have been added for this show yet.</p>
        )}
      </div>
    </div>
  );
}
