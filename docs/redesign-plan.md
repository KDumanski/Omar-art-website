# Omar Chacón site — redesign spec

Source: transcribed phone conversation between Keith & Omar (voice memo, Jun 21 2026).
This replaces the long single-scroll site with a **click-to-open, fit-to-screen
portfolio** in the spirit of Karin Davie's site, with a signature **drip**
interaction built from Omar's own method (poured, hand-cast acrylic drips).

## What Omar asked for (digest)

- **No scroll.** Landing is one static, fit-to-screen page. You **click** section
  buttons and the section opens full-screen. Same model on mobile.
- **Drip effect.** Interacting with the site makes the painting "drip down" — it
  references his real technique. Prototype it first and tune the look.
- **A few painting backgrounds** you click through — **three, kept simple**, one
  can be labelled to a destination (e.g. Contact).
- **≤ 5 sections**, converging on:
  1. **Paintings** — drill down by year → gallery subpage of that year's photos;
     include installation / "hanging in space" views from shows.
  2. **About** — bio + artist statement.
  3. **CV** — the list of past stuff (exhibitions, awards, education).
  4. **Articles / Media** — press + writings *about* the work.
  5. **Contact** — simple form + newsletter signup.
- **An interactive hook** to make people visit/return (a "game", an events feed —
  open brainstorm). Deferred to its own pass.
- **Entry pop-up** for show invites — deferred (no shows scheduled yet).

## Decisions taken (defaults — correct me if wrong)

- Replace the scroll site with the click-to-open model. ✅
- Prototype the drip on a **real painting** first (cheapest way to "see how it
  looks"): `drip-lab.html`.
- Final sections: **Paintings · About · CV · Articles · Contact**.
- Paintings organised **by year** (2007 / 2018 / 2024 / Recent), populated with the
  6 works we have. Framework is data-driven — new works drop straight in once Omar
  Dropboxes more images.
- Interactive hook + invite pop-up: **not built yet**, parked for a later pass.

## Build phases

1. **Shell** ✅ *(built 2026-06-22)* — fit-to-screen landing: name + 5 section
   buttons over a painting background; click opens a full-screen panel; Esc /
   close / browser-back returns; hash deep links (`#paintings`, `#paintings/2024`,
   …); mobile = stacked buttons / full-screen panels. The old scroll site is
   backed up in `_legacy-scroll/`.
2. **Drip** — `drip-lab.html` canvas prototype (tune look), then port into the
   landing background; 3 paintings cycle on click with a drip transition.
   *Not built yet.* For now the landing crossfades 3 paintings (click "Next
   painting" to advance) as a placeholder for the drip transition.
3. **Paintings** ✅ *(v1)* — year hub (Recent / 2024 / 2018 / 2007) → year grid →
   lightbox. Data-driven from the `WORKS` array in `script.js`; new images +
   years drop straight in. Installation / "hanging in space" views to be added
   per year once Omar sends them.
4. **Content** ✅ *(v1)* — About (bio + artist statement), CV
   (exhibitions / awards / education / representation), Articles (press quotes;
   full press releases to add), Contact (inquiry form + newsletter signup stub).
5. **Interactive hook** — separate brainstorm. *Not built yet.*
6. **Invite pop-up** — when a show is scheduled. *Not built yet.*

## Notes / open items

- The transcript is auto-transcribed speech; intent was interpreted. Flag misreads.
- Need more images + per-work years/titles from Omar (he's Dropboxing a set). The
  year galleries are sparse until then.
- Drip is v1 — meant to be reacted to, not final.
