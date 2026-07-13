import 'server-only';
import raw from '@/content/site-data.json';

// ============================================================================
// Data-access layer for the Omar Chacón site — static edition.
// The site is a fully static build (GitHub Pages): all content lives in
// content/site-data.json, which the Drive sync regenerates from Omar's shared
// Google Drive folder + catalog Sheet. Same exported API the pages always used,
// so no page component changed when the Postgres CMS was retired.
//
// MODEL (paintings + installations are connected):
//   shows         — exhibitions { gallery, city, year, ... }
//   installations — room shots, each belongs to a show (linked by showSlug)
//   works         — individual paintings; each MAY belong to a show (showSlug)
//   cv/bio/contact — section content (cvText overrides the structured cv list)
// ============================================================================

// Raw <img src> paths need the deploy base path under a GitHub Pages project
// site (e.g. /omar-art/assets/…). Applied once here so components stay clean.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const img = (p) => (!p || /^https?:\/\//.test(p) ? p : `${BASE}${p.startsWith('/') ? '' : '/'}${p}`);

// Sort helper mirroring the old SQL: year DESC NULLS LAST, sort_order, id.
const byYearDesc = (a, b) =>
  (b.year ?? -Infinity) - (a.year ?? -Infinity) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id;
const bySortOrder = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id;

/* ----------------------------------------------------------------- SHOWS */
const SHOWS = (raw.shows || []).map((s, i) => ({
  id: i + 1,
  slug: s.slug,
  title: s.title,
  gallery: s.gallery || '',
  city: s.city || '',
  year: s.year ?? null,
  blurb: s.blurb || '',
  pressUrl: s.pressUrl || s.press_url || null,
  sortOrder: s.sortOrder ?? s.sort_order ?? i,
}));
const showBySlug = Object.fromEntries(SHOWS.map((s) => [s.slug, s]));

/* ----------------------------------------------------------------- WORKS (paintings) */
const WORKS = (raw.works || []).map((w, i) => {
  const show = w.showSlug ? showBySlug[w.showSlug] : null;
  return {
    id: i + 1,
    slug: w.slug,
    title: w.title,
    year: w.year ?? null,
    medium: w.medium || '',
    dimensions: w.dimensions || '',
    image: img(w.image),
    status: w.status || null,
    surface: w.surface || null,
    tier: w.tier || null,
    showId: show ? show.id : null,
    showTitle: show ? show.title : null,
    showSlug: show ? show.slug : null,
    sortOrder: w.sortOrder ?? w.sort_order ?? i,
    isHero: !!(w.isHero ?? w.is_hero ?? w.hero),
  };
});

/* ----------------------------------------------------------------- INSTALLATIONS */
const INSTALLATIONS = (raw.installations || []).map((r, i) => ({
  id: i + 1,
  showSlug: r.showSlug,
  image: img(r.image),
  caption: r.caption || '',
  sortOrder: r.sortOrder ?? r.sort_order ?? i,
}));

const worksForShow = (show) =>
  WORKS.filter((w) => w.showSlug === show.slug).slice().sort(bySortOrder);
const installationsForShow = (show) =>
  INSTALLATIONS.filter((it) => it.showSlug === show.slug)
    .slice().sort(bySortOrder)
    .map((it) => ({ id: it.id, image: it.image, caption: it.caption }));

export async function getShows() {
  return SHOWS.slice().sort(byYearDesc);
}

export async function getShow(slug) {
  const s = showBySlug[slug];
  if (!s) return null;
  return { ...s, works: worksForShow(s), installations: installationsForShow(s) };
}

// Shows with installation shots + works (Installations/Shows index page).
export async function getShowsWithMedia() {
  return (await getShows()).map((s) => ({
    ...s,
    works: worksForShow(s),
    installations: installationsForShow(s),
  }));
}

export async function getShowSlugs() {
  return SHOWS.map((s) => s.slug);
}

export async function getWorks() {
  return WORKS.slice().sort(byYearDesc);
}

// Homepage crossfade background. Priority: the heroImages list in site-data.json
// (Omar's hand-picked lead images — the "Vancouver airport" picks), then paintings
// marked isHero, then the newest five with an image so the homepage never goes blank.
export async function getHeroWorks() {
  const heroImages = raw.heroImages || [];
  if (heroImages.length) return heroImages.map((p, i) => ({ id: -(i + 1), image: img(p) }));
  const picked = WORKS.filter((w) => w.isHero && w.image).slice().sort(bySortOrder);
  if (picked.length) return picked;
  return WORKS.filter((w) => w.image).slice().sort(byYearDesc).slice(0, 5);
}

export async function getWork(slug) {
  return WORKS.find((w) => w.slug === slug) || null;
}

export async function getWorkSlugs() {
  return WORKS.map((w) => w.slug);
}

/* ----------------------------------------------------------------- CONTENT (bio, contact, cv) */
export async function getContent(key) {
  return raw[key] ?? null;
}

export async function getBio() {
  const bio = raw.bio || {};
  return {
    heading: bio.heading || '',
    paragraphs: bio.paragraphs || [],
    statement: bio.statement || '',
    portrait: img(bio.portrait || ''),
  };
}

export async function getContact() {
  return { email: '', instagram: '', gallery: '', artnet: '', blurb: '', ...(raw.contact || {}) };
}

// The working record (education, awards, commissions) is free text rendered as-is
// (line breaks preserved). cvText in site-data.json wins; otherwise the structured
// cv list is formatted into grouped lines.
const CV_GROUPS = [
  ['represented', 'Represented by'],
  ['commission', 'Commissions'],
  ['award', 'Awards & Fellowships'],
  ['education', 'Education'],
];

export async function getCvText() {
  if (raw.cvText) return raw.cvText;
  const entries = raw.cv || [];
  if (!entries.length) return '';
  const blocks = [];
  for (const [kind, heading] of CV_GROUPS) {
    const group = entries.filter((e) => e.kind === kind);
    if (!group.length) continue;
    const lines = group
      .slice()
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((e) => [e.year, [e.title, e.venue].filter(Boolean).join(', ')].filter(Boolean).join('  '));
    blocks.push([heading.toUpperCase(), ...lines].join('\n'));
  }
  return blocks.join('\n\n');
}
