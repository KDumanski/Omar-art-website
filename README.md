# Fabian's Tours — Sacred Egypt Journeys

A cinematic-luxury marketing site for an Egypt vacation-tours brand, modeled on the
structure of [oceanicventures.co](https://oceanicventures.co) and re-skinned with a
dark + gold, full-bleed aesthetic, heavy ancient-Egyptian theming, light/dark mode,
and a working application form. Built with **Next.js (static export)** and deployed to
**GitHub Pages**.

## Live site

After the first deploy completes: `https://<your-username>.github.io/fabians-tours/`

## Tech

- **Next.js 15** App Router, `output: 'export'` (pure static HTML/CSS/JS — no server)
- **CSS Modules** + a token-based design system (`app/globals.css`)
- **next/font** self-hosting Playfair Display + Inter
- Scroll-reveal via IntersectionObserver; sticky transparent→solid nav
- **Light + dark theme** with no-flash bootstrap (`components/ThemeScript.jsx`), persisted to `localStorage`
- All Egypt photography via the Unsplash CDN (free for commercial use)

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, four "gates" pillars, featured journeys, about & impact teasers, testimonials, CTA |
| `/journeys/` | All journeys listing |
| `/journeys/[slug]/` | Individual journey detail (overview, highlights, day-by-day, booking rail) |
| `/experiences/` | Signature experiences + photo gallery |
| `/about/` | Brand story + founder (Fabian) |
| `/testimonials/` | Traveler reviews |
| `/social-impact/` | The three regeneration funds |
| `/apply/` | Application / contact form (Formspree) |
| `/terms/` | Terms & conditions |
| `/admin/` | Admin dashboard (listings editor — see below) |

## Local development

```bash
npm install
npm run dev        # http://localhost:3000  (basePath disabled in dev)
```

### Local production preview

The production build prefixes assets with the repo base path (`/fabians-tours`),
so serving `out/` at the root won't find them. For a correct local preview, build
**without** a base path:

```bash
# Git Bash:  BASE_PATH=none npm run build
# PowerShell: $env:BASE_PATH="none"; npm run build
npx serve out
```

## Deployment (GitHub Pages)

Deploys automatically on every push to `main` via `.github/workflows/deploy.yml`
(official `configure-pages` → `upload-pages-artifact` → `deploy-pages`). The workflow
passes the repo base path into the build, so assets resolve correctly under
`username.github.io/fabians-tours/`. `public/.nojekyll` stops Jekyll from stripping
Next's `_next/` folder.

**One-time setup:** in the repo, **Settings → Pages → Build and deployment → Source =
GitHub Actions**.

### Custom domain or `username.github.io` root repo

Set the base path to empty so assets resolve from `/`:

- Add a repo variable / env `BASE_PATH=none` for the build, **or** change the default
  in `next.config.mjs`.
- For a custom domain, also add a `CNAME` file in `public/` with your domain.

## Configuration you should change

| What | Where |
|------|-------|
| Formspree form ID | `components/ApplyForm.jsx` → replace `PLACEHOLDER` in the endpoint |
| WhatsApp number, email, social links | `lib/copy.js` → `BRAND` |
| Tours / pricing / itineraries | `lib/tours.js` |
| Testimonials | `lib/testimonials.js` |
| Images | `lib/images.js` (drop files in `public/` and reference `/file.jpg` to self-host) |
| Admin login allowlist | `lib/allowlist.js` (or `ADMIN_EMAILS` env var) |

## Admin dashboard (real login + database)

`/admin/` is a real, secure dashboard: **Google login** (restricted to an email
allowlist) backed by a **Postgres database**. Add / edit / remove tours, crew, and
testimonials — changes go live instantly, no rebuild.

- **Login allowlist:** `lib/allowlist.js` (`keith.dumanski@gmail.com` +
  `fabianguhl@gmail.com`; extend with the `ADMIN_EMAILS` env var).
- **Auth:** Auth.js / NextAuth v5 (`auth.js`, `middleware.js`, `app/api/auth/...`).
- **Data:** `lib/db.js` (Postgres client) + `lib/data.js` (read helpers). Public pages
  read live from the DB; the old `lib/tours.js` / `crew.js` / `testimonials.js` are now
  only the one-time **seed** source (`scripts/seed.mjs`, schema in `scripts/schema.sql`).
- **Mutations:** server actions in `app/admin/actions.js` (with Vercel Blob image upload).

### Set it up

This requires a one-time setup (Vercel project + Postgres + Google OAuth). Full
click-by-click guide: **[DEPLOY-VERCEL.md](DEPLOY-VERCEL.md)**. Env vars are documented in
`.env.local.example`.

> Hosting note: this app is now a **server-rendered Next.js app for Vercel** — it is no
> longer a static GitHub Pages export. (The `asset()` basePath helper becomes a harmless
> no-op on Vercel since the site is served from the domain root.)

## Accessibility & quality

- All text/background pairs meet **WCAG AA** contrast (verified in both themes)
- Visible focus rings, skip-to-content link, `aria-label`s on icon buttons
- `prefers-reduced-motion` respected (animations disabled)
- No text below 13px
