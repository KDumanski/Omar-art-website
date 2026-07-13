import { Inter, Fraunces } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import TopBar from '@/components/TopBar';

// One font system, matching the static site: Inter for UI/body, Fraunces for the
// serif display (name, titles, pull-quotes). Exposed as CSS variables that
// globals.css reads (--font-inter / --font-fraunces).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['300', '400', '500', '600'] });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', weight: ['300', '400', '500', '600'] });

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://omarchaconart.com'),
  title: {
    default: 'Omar Chacón — Painter',
    template: '%s · Omar Chacón',
  },
  description:
    'Omar Chacón is a Colombian-American painter who builds vivid, mosaic-like abstractions from thousands of hand-cast acrylic drips — a brush is never used. Born Bogotá 1979, based in Queens, New York.',
  keywords: ['Omar Chacón', 'Colombian American painter', 'hand-cast acrylic', 'mosaic abstraction', 'contemporary painting', 'Robischon Gallery'],
  openGraph: {
    title: 'Omar Chacón — Painter',
    description: 'Thousands of hand-cast acrylic drips, peeled by hand and collaged onto canvas. A brush is never used.',
    type: 'website',
    siteName: 'Omar Chacón',
  },
  twitter: { card: 'summary_large_image', title: 'Omar Chacón — Painter' },
  icons: { icon: '/favicon.svg' },
};

export const viewport = {
  themeColor: '#f6f3ec',
};

// Set [data-theme] before first paint to avoid a flash of the wrong theme.
// Light (white bg, black text — the Barbara Takenaga reference look Omar asked for) is
// the default; honor a saved choice (key: oc-theme) if one exists.
const themeScript = `(function(){try{
  var s=localStorage.getItem('oc-theme');
  var t=(s==='light'||s==='dark')?s:'light';
  document.documentElement.setAttribute('data-theme',t);
}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

const IG = 'https://www.instagram.com/omarchaconjr/';

// Studio credit shown in the footer of every client site. Swap the name here
// (one place) if the studio brand changes; the URL is the portfolio page.
const MADE_BY = { name: 'The Happy Endings', url: 'https://thehappyendings.org/projects/' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only">Skip to content</a>
        <TopBar />
        <main id="main">{children}</main>
        <footer className="footer">
          <span>© {new Date().getFullYear()} Omar Chacón · Every drip, unique.</span>
          <span className="footer__links">
            <Link href="/shows">Paintings &amp; Shows</Link>
            <Link href="/contact">Contact</Link>
            <a href={IG} target="_blank" rel="noopener noreferrer">Instagram&nbsp;↗</a>
            <a className="footer__credit" href={MADE_BY.url} target="_blank" rel="noopener noreferrer">
              Site by {MADE_BY.name}
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
