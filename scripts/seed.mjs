// Seed the Omar Chacón database: create the schema, then upsert the contents of a JSON
// dump into the tables. Idempotent — shows/works upsert on their slug, the list sections
// (installations, press, cv, news) are cleared and refilled, and content (bio/contact)
// upserts on its key. If the JSON file is absent, the schema is still created and we exit.
//
//   POSTGRES_URL=... node scripts/seed.mjs
//
// SSL mirrors lib/db.js: POSTGRES_SSL=off disables TLS, otherwise the value (default
// 'prefer') is passed through — so the same script runs on Neon/Vercel and on a VPS.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lives inside the repo (scripts/seed-data.json) so it ships with the app to the VPS.
const SEED_JSON = process.env.SEED_JSON || path.join(__dirname, 'seed-data.json');

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('ERROR: set POSTGRES_URL (or DATABASE_URL). Aborting.');
  process.exit(1);
}
const sslEnv = process.env.POSTGRES_SSL;
const ssl = sslEnv === 'off' ? false : (sslEnv || 'prefer');
const sql = postgres(url, { ssl, max: 5, idle_timeout: 20, connect_timeout: 10 });

const intOrNull = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

async function main() {
  console.log('→ Creating schema…');
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await sql.unsafe(schema);

  if (!fs.existsSync(SEED_JSON)) {
    console.log(`→ No seed file at ${SEED_JSON} — schema created, nothing to load. Exiting cleanly.`);
    await sql.end();
    return;
  }

  const data = JSON.parse(fs.readFileSync(SEED_JSON, 'utf8'));
  const shows = data.shows || [];
  const works = data.works || [];
  const installations = data.installations || [];
  const press = data.press || [];
  const cv = data.cv || [];
  const news = data.news || [];
  const bio = data.bio || null;
  const contact = data.contact || null;

  // --- SHOWS (upsert on slug) — build a slug→id map for works/installations to link against.
  console.log(`→ Seeding ${shows.length} shows…`);
  const showIdBySlug = {};
  for (let i = 0; i < shows.length; i++) {
    const s = shows[i];
    const [row] = await sql`
      INSERT INTO shows (slug, title, gallery, city, year, blurb, press_url, sort_order)
      VALUES (${s.slug}, ${s.title}, ${s.gallery ?? null}, ${s.city ?? null},
              ${intOrNull(s.year)}, ${s.blurb ?? null}, ${s.press_url ?? s.pressUrl ?? null},
              ${intOrNull(s.sort_order) ?? i})
      ON CONFLICT (slug) DO UPDATE SET
        title=EXCLUDED.title, gallery=EXCLUDED.gallery, city=EXCLUDED.city,
        year=EXCLUDED.year, blurb=EXCLUDED.blurb, press_url=EXCLUDED.press_url,
        sort_order=EXCLUDED.sort_order, updated_at=now()
      RETURNING id`;
    showIdBySlug[s.slug] = row.id;
  }

  // --- WORKS (upsert on slug). showSlug links the painting to the show it hung in.
  console.log(`→ Seeding ${works.length} works…`);
  for (let i = 0; i < works.length; i++) {
    const w = works[i];
    const showId = w.show_id ?? (w.showSlug ? showIdBySlug[w.showSlug] ?? null : null);
    await sql`
      INSERT INTO works (slug, title, year, medium, dimensions, image, status, surface,
                         tier, show_id, sort_order)
      VALUES (${w.slug}, ${w.title}, ${intOrNull(w.year)}, ${w.medium ?? null},
              ${w.dimensions ?? null}, ${w.image ?? null}, ${w.status ?? null},
              ${w.surface ?? null}, ${w.tier ?? null}, ${showId}, ${intOrNull(w.sort_order) ?? i})
      ON CONFLICT (slug) DO UPDATE SET
        title=EXCLUDED.title, year=EXCLUDED.year, medium=EXCLUDED.medium,
        dimensions=EXCLUDED.dimensions, image=EXCLUDED.image, status=EXCLUDED.status,
        surface=EXCLUDED.surface, tier=EXCLUDED.tier, show_id=EXCLUDED.show_id,
        sort_order=EXCLUDED.sort_order, updated_at=now()`;
  }

  // --- INSTALLATIONS (no natural key) — clear + refill so re-runs stay deterministic.
  console.log(`→ Seeding ${installations.length} installations…`);
  await sql`DELETE FROM installations`;
  for (let i = 0; i < installations.length; i++) {
    const inst = installations[i];
    const showId = inst.show_id ?? (inst.showSlug ? showIdBySlug[inst.showSlug] ?? null : null);
    if (!showId) {
      console.warn(`  ! installation #${i} has no resolvable show (showSlug=${inst.showSlug}) — skipping`);
      continue;
    }
    await sql`
      INSERT INTO installations (show_id, image, caption, sort_order)
      VALUES (${showId}, ${inst.image}, ${inst.caption ?? null}, ${intOrNull(inst.sort_order) ?? i})`;
  }

  // --- PRESS (no natural key) — clear + refill.
  console.log(`→ Seeding ${press.length} press…`);
  await sql`DELETE FROM press`;
  for (let i = 0; i < press.length; i++) {
    const p = press[i];
    await sql`
      INSERT INTO press (publication, title, year, image, pdf_url, quote, sort_order)
      VALUES (${p.publication ?? null}, ${p.title ?? null}, ${intOrNull(p.year)},
              ${p.image ?? null}, ${p.pdf_url ?? p.pdfUrl ?? null}, ${p.quote ?? null},
              ${intOrNull(p.sort_order) ?? i})`;
  }

  // --- CV (no natural key) — clear + refill.
  console.log(`→ Seeding ${cv.length} CV entries…`);
  await sql`DELETE FROM cv_entries`;
  for (let i = 0; i < cv.length; i++) {
    const c = cv[i];
    await sql`
      INSERT INTO cv_entries (year, kind, title, venue, sort_order)
      VALUES (${intOrNull(c.year)}, ${c.kind ?? 'group'}, ${c.title}, ${c.venue ?? null},
              ${intOrNull(c.sort_order) ?? i})`;
  }

  // --- NEWS (no natural key) — clear + refill.
  console.log(`→ Seeding ${news.length} news…`);
  await sql`DELETE FROM news`;
  for (let i = 0; i < news.length; i++) {
    const n = news[i];
    await sql`
      INSERT INTO news (title, date, body, link, sort_order)
      VALUES (${n.title}, ${n.date ?? null}, ${n.body ?? null}, ${n.link ?? null},
              ${intOrNull(n.sort_order) ?? i})`;
  }

  // --- CONTENT (bio, contact) — upsert on key.
  if (bio) {
    console.log('→ Seeding bio…');
    await sql`
      INSERT INTO content (key, value) VALUES ('bio', ${sql.json(bio)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
  }
  if (contact) {
    console.log('→ Seeding contact…');
    await sql`
      INSERT INTO content (key, value) VALUES ('contact', ${sql.json(contact)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
  }

  // --- Counts
  const [{ count: sc }] = await sql`SELECT count(*)::int FROM shows`;
  const [{ count: wc }] = await sql`SELECT count(*)::int FROM works`;
  const [{ count: ic }] = await sql`SELECT count(*)::int FROM installations`;
  const [{ count: pc }] = await sql`SELECT count(*)::int FROM press`;
  const [{ count: cc }] = await sql`SELECT count(*)::int FROM cv_entries`;
  const [{ count: nc }] = await sql`SELECT count(*)::int FROM news`;
  const [{ count: cnt }] = await sql`SELECT count(*)::int FROM content`;
  console.log(
    `✓ Done. shows=${sc} works=${wc} installations=${ic} press=${pc} cv=${cc} news=${nc} content=${cnt}`
  );
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
