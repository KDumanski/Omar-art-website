import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page">
      <div className="page__body">
        <div className="news-empty">
          <h1 className="page__title">This page peeled away.</h1>
          <p className="page__intro">The page you were looking for isn&rsquo;t here. Let&rsquo;s get you back to the work.</p>
          <div style={{ display: 'flex', gap: 'var(--s2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn--solid">Home</Link>
            <Link href="/shows" className="btn btn--ghost">Browse paintings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
