import { getBio } from '@/lib/data';

export const metadata = {
  title: 'Artist Statement',
  description: 'Omar Chacón — artist statement and bio: hand-cast acrylic drips, peeled and collaged. A brush is never used.',
};

// ARTIST STATEMENT — the bio (portrait + story) and the method in his words.
// The working-record / CV timeline now lives on the Shows page.
export default async function StatementPage() {
  const bio = await getBio();
  const heading = bio.heading || 'From Bogotá to a Queens studio.';
  const paragraphs = bio.paragraphs && bio.paragraphs.length ? bio.paragraphs : [];

  return (
    <div className="page">
      <div className="page__chrome">
        <p className="page__eyebrow">Artist Statement</p>
      </div>
      <div className="page__body">
        <div className="about">
          <div className="about__media">
            {bio.portrait && (
              <div className="about__frame">
                <img src={bio.portrait} alt={`Omar Chacón — ${heading}`} loading="lazy" />
              </div>
            )}
          </div>
          <div className="about__text">
            <h1 className="page__title">{heading}</h1>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {bio.statement && (
              <figure className="pullquote pullquote--inline">
                <blockquote>{bio.statement}</blockquote>
                <figcaption>The method, in his words</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
