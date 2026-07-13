import { getShowsWithMedia, getCvText, getWorks } from '@/lib/data';
import WorkBrowser from '@/components/WorkBrowser';

export const metadata = {
  title: 'Paintings & Shows',
  description: 'The full body of work — browse by exhibition (installation views + the paintings that hung in each) or by individual painting, plus a working record of education, awards, and commissions.',
};

// PAINTINGS & SHOWS (one section). A single browser you can view by show (paintings
// merged into the exhibition they hung in) or by painting (the full filterable grid),
// followed by the working record.
export default async function ShowsPage() {
  const [shows, cv, works] = await Promise.all([getShowsWithMedia(), getCvText(), getWorks()]);

  return (
    <div className="page">
      <div className="page__chrome">
        <p className="page__eyebrow">Paintings &amp; Shows</p>
      </div>
      <div className="page__body">
        <header className="page__head">
          <h1 className="page__title">The work.</h1>
          <p className="page__intro">
            Browse <strong>by show</strong> — each exhibition with its installation views and the paintings that hung in it — or <strong>by painting</strong>, the full body of work. Open any painting to step through it up close.
          </p>
        </header>

        <WorkBrowser shows={shows} works={works} />

        {/* A working record — free text Omar pastes and formats himself */}
        {cv && (
          <>
            <header className="page__head resume__cv-head">
              <h2 className="page__title">A working record.</h2>
              <p className="page__intro">Education, awards, commissions, and press.</p>
            </header>
            <div className="cv cv__text">{cv}</div>
          </>
        )}
      </div>
    </div>
  );
}
