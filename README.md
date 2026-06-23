# Omar Chacón — Painter

A one-page portfolio site for the Colombian-American painter **Omar Chacón** (b. Bogotá, 1979; based in Queens, New York). Chacón builds vivid, mosaic-like abstractions from thousands of hand-cast acrylic drips — *a brush is never used.* The site lets the work carry it: the paintings crossfade full-bleed across the hero, with the artist's name set quietly over a soft scrim, then it opens into a calm gallery, process, about, and exhibitions.

## What's included

- `index.html` — single-page site: hero, work gallery, process, about, exhibitions, contact.
- `styles.css` — one font system (Inter + Fraunces), 8px grid, golden-ratio layout, dark by default with a light toggle.
- `script.js` — gallery lightbox, exhibition mode, scroll reveals, sticky nav, count-up stats, theme persistence.
- `assets/` — artwork images.
- `favicon.svg` — a single concentric drip.

## Interactive elements

- **Full-bleed hero** — a crossfading slideshow of paintings (each fading in, holding, then handing off to the next) plays full-screen behind the artist's name, with a slow, near-imperceptible drift. Under `prefers-reduced-motion` the crossfade and drift are disabled and a single still painting is held.
- **Exhibition mode** — a fullscreen, one-work-at-a-time slideshow with keyboard nav (←/→/Esc), a progress bar, slide counter, and dot navigation.
- **Lightbox gallery** — keyboard-navigable (←/→/Esc), asymmetric golden-ratio grid, with 3D tilt-toward-cursor and a spotlight that follows the pointer.
- **Status chips** — each work is tagged Available / Sold / Commissioned.
- **Count-up stats, branded page loader, scroll-spy section dots.**
- **Contact form** — serverless inquiry form via Web3Forms (add an access key in `index.html`), with success/error states and a honeypot.
- **Scroll reveals, marquee, light/dark toggle.**

Respects `prefers-reduced-motion` and falls back gracefully on touch devices.

## Before going live (two quick steps)

1. **Contact form** — create a free key at [web3forms.com](https://web3forms.com) and replace `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html`. Until then the form shows a "not configured" message instead of sending.
2. **Analytics (optional)** — paste a GA4 Measurement ID into the commented analytics block in `index.html` and uncomment it.

## SEO

Includes Open Graph + Twitter Card meta, a canonical URL, `robots.txt`, `sitemap.xml`, and JSON-LD `VisualArtist` structured data so search engines treat Omar as a recognized entity.

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
site via GitHub Pages. In the repo: **Settings → Pages → Source → GitHub Actions.**

The `CNAME` file points the site at **omarchaconart.com** — set the domain's DNS
to GitHub Pages (an `ALIAS`/`A` records for the apex, or a `CNAME` record to
`<username>.github.io`), then confirm the custom domain under Settings → Pages.

## Sources & credit

Biographical and exhibition facts were compiled from the artist's representing
gallery (Robischon Gallery, Denver) and others he has shown with (Margaret
Thatcher Projects, Fouladi Projects), plus Ringling College and the Bronx River
Art Center. All artwork is © Omar Chacón. This site is a portfolio/tribute build.
