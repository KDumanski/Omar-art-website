/* =========================================================
   Omar Chacón — click-to-open portfolio
   1. Data + paintings (by year) + lightbox
   2. Stage background crossfade
   3. View router (hash) — open/close full-screen panels
   4. Theme, loader, contact + signup forms
   ========================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const PANELS = ['paintings', 'about', 'cv', 'articles', 'contact'];

  /* ----------------------------------------------------------
     1. WORKS — loaded from the generated catalog
        (assets/works/catalog.js → window.OMAR_WORKS).
        Each record: { src, title, surface, dims, year, tier, show }
  ---------------------------------------------------------- */
  const WORKS = (window.OMAR_WORKS && window.OMAR_WORKS.length) ? window.OMAR_WORKS.slice() : [];

  /* ----------------------------------------------------------
     2. PAINTINGS — one grid with Year · Size · Surface filters
  ---------------------------------------------------------- */
  const grid = document.getElementById('works-grid');
  const countEl = document.getElementById('works-count');
  const emptyEl = document.getElementById('works-empty');
  const filterBar = document.getElementById('filters');
  const filters = { year: 'all', tier: 'all', surface: 'all' };
  let currentList = WORKS; // what the lightbox steps through

  // build the year chips from the catalog (newest first)
  const yearChips = document.getElementById('chips-year');
  if (yearChips) {
    const years = Array.from(new Set(WORKS.map((w) => w.year).filter(Boolean)))
      .sort((a, b) => Number(b) - Number(a));
    yearChips.innerHTML = '<button class="chip is-active" data-year="all">All</button>'
      + years.map((y) => `<button class="chip" data-year="${y}">${y}</button>`).join('');
  }

  function cardHTML(art, i) {
    const meta = [art.dims, art.year].filter(Boolean).join(' · ');
    return `
      <button class="art" data-index="${i}" aria-label="View ${escapeHtml(art.title)}">
        <span class="art__spotlight" aria-hidden="true"></span>
        <span class="art__tag">${escapeHtml(art.surface)}</span>
        <img src="${art.src}" alt="${escapeHtml(art.title)} — ${escapeHtml(meta)}" loading="lazy" />
        <span class="art__overlay">
          <span class="art__title">${escapeHtml(art.title)}</span>
          <span class="art__meta">${escapeHtml(meta)}</span>
        </span>
      </button>`;
  }

  function applyFilters() {
    if (!grid) return;
    currentList = WORKS.filter((w) =>
      (filters.year === 'all' || String(w.year) === filters.year) &&
      (filters.tier === 'all' || w.tier === filters.tier) &&
      (filters.surface === 'all' || w.surface === filters.surface));
    grid.innerHTML = currentList.map(cardHTML).join('');
    wireTilt(grid);
    if (countEl) countEl.textContent = currentList.length + (currentList.length === 1 ? ' work' : ' works');
    if (emptyEl) emptyEl.hidden = currentList.length !== 0;
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const row = chip.closest('.filters__row');
      const facet = row.dataset.facet;           // year | tier | surface
      filters[facet] = chip.dataset[facet];
      row.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      applyFilters();
    });
  }
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    filters.year = filters.tier = filters.surface = 'all';
    document.querySelectorAll('#filters .filters__row').forEach((row) =>
      row.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('is-active', i === 0)));
    applyFilters();
  });

  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.art');
      if (card) openLightbox(+card.dataset.index);
    });
    applyFilters(); // initial render
  }

  // tilt-toward-cursor + spotlight follow (desktop only)
  function wireTilt(scope) {
    if (prefersReduced || isCoarse) return;
    scope.querySelectorAll('.art').forEach((card) => {
      const spot = card.querySelector('.art__spotlight');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg) translateZ(0)`;
        if (spot) { spot.style.setProperty('--mx', px * 100 + '%'); spot.style.setProperty('--my', py * 100 + '%'); }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---- Lightbox ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  let current = 0;

  function openLightbox(i) {
    current = i;
    const art = currentList[i];
    lbImg.src = art.src;
    lbImg.alt = art.title;
    lbCap.textContent = `${art.title} — ${[art.surface, art.dims, art.year].filter(Boolean).join(', ')}`;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
  }
  function step(dir) { openLightbox((current + dir + currentList.length) % currentList.length); }

  if (lb) {
    lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', () => step(-1));
    lb.querySelector('.lightbox__nav--next').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.stopPropagation(); closeLightbox(); }
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ----------------------------------------------------------
     3. STAGE BACKGROUND — crossfade through a few paintings
  ---------------------------------------------------------- */
  const bgImgs = Array.from(document.querySelectorAll('.stage__bg img'));
  let bgIndex = 0; let bgTimer = null;
  function showBg(i) {
    bgIndex = (i + bgImgs.length) % bgImgs.length;
    bgImgs.forEach((img, n) => img.classList.toggle('is-active', n === bgIndex));
  }
  if (bgImgs.length) {
    showBg(0);
    const cycle = () => showBg(bgIndex + 1);
    if (!prefersReduced) bgTimer = setInterval(cycle, 6000);
    const cycleBtn = document.getElementById('stage-cycle');
    if (cycleBtn) cycleBtn.addEventListener('click', () => {
      cycle();
      if (bgTimer) { clearInterval(bgTimer); bgTimer = setInterval(cycle, 6000); } // reset the clock
    });
  }

  /* ----------------------------------------------------------
     4. VIEW ROUTER — hash drives which panel is open
  ---------------------------------------------------------- */
  const stage = document.getElementById('stage');
  const panelEls = {};
  PANELS.forEach((id) => { panelEls[id] = document.getElementById(id); });
  let lastTrigger = null; // restore focus here when we return home

  function openPanel(el) {
    if (!el || (!el.hidden && el.classList.contains('is-open'))) return;
    el.hidden = false;
    // next frame so the transition runs from the hidden state
    requestAnimationFrame(() => el.classList.add('is-open'));
    el.setAttribute('aria-hidden', 'false');
  }
  function closePanel(el) {
    if (!el || el.hidden) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    const done = () => { if (!el.classList.contains('is-open')) el.hidden = true; };
    if (prefersReduced) done();
    else setTimeout(done, 460);
  }

  function route() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    const [id, sub] = raw.split('/');
    const known = PANELS.includes(id);

    // toggle stage / body state
    document.body.classList.toggle('is-open', known);
    if (stage) stage.setAttribute('aria-hidden', known ? 'true' : 'false');

    // open the target panel, close the rest
    PANELS.forEach((pid) => {
      if (pid === id) openPanel(panelEls[pid]);
      else closePanel(panelEls[pid]);
    });

    if (known) {
      // focus the panel's close control for keyboard users
      const closeBtn = panelEls[id].querySelector('.panel__close');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
      // scroll the panel body to top on (re)entry
      const body = panelEls[id].querySelector('.panel__body');
      if (body) body.scrollTop = 0;
    } else {
      // returned home — clean the URL and restore focus
      if (location.hash) history.replaceState('', document.title, location.pathname + location.search);
      if (lastTrigger) { lastTrigger.focus({ preventScroll: true }); lastTrigger = null; }
    }
  }

  // menu buttons open a section
  document.querySelectorAll('[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => { lastTrigger = btn; location.hash = btn.dataset.open; });
  });
  // brand + close buttons return home
  document.querySelectorAll('[data-home]').forEach((btn) => {
    btn.addEventListener('click', () => goHome());
  });
  // "All years" link
  document.querySelectorAll('[data-paintings-home]').forEach((btn) => {
    btn.addEventListener('click', () => { location.hash = 'paintings'; });
  });

  function goHome() {
    if (location.hash) location.hash = '';
    else route();
  }

  // Esc closes the open panel (lightbox handles its own Esc first)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lb.classList.contains('is-open') && document.body.classList.contains('is-open')) {
      goHome();
    }
  });

  window.addEventListener('hashchange', route);
  route(); // initial

  /* ----------------------------------------------------------
     5. THEME, LOADER, YEAR, FORMS
  ---------------------------------------------------------- */
  const root = document.documentElement;
  const saved = localStorage.getItem('oc-theme');
  if (saved) root.setAttribute('data-theme', saved);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('oc-theme', next);
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const loader = document.getElementById('loader');
  if (loader) {
    const hide = () => setTimeout(() => loader.classList.add('is-done'), 400);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(() => loader.classList.add('is-done'), 3500); // safety net
  }

  // contact form (Web3Forms)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const key = form.querySelector('[name="access_key"]').value;
      if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.textContent = 'Form not configured yet — add a Web3Forms access key.';
        status.className = 'contact__status is-err';
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; const label = btn.textContent; btn.textContent = 'Sending…';
      status.textContent = ''; status.className = 'contact__status';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('bad response');
        status.textContent = 'Thank you — your inquiry has been sent.';
        status.className = 'contact__status is-ok';
        form.reset();
      } catch (err) {
        status.textContent = 'Something went wrong. Please email directly instead.';
        status.className = 'contact__status is-err';
      } finally {
        btn.disabled = false; btn.textContent = label;
      }
    });
  }

  // newsletter signup (placeholder until a provider is wired)
  const signup = document.getElementById('signup-form');
  const signupStatus = document.getElementById('signup-status');
  if (signup && signupStatus) {
    signup.addEventListener('submit', (e) => {
      e.preventDefault();
      signupStatus.textContent = 'Newsletter isn’t connected yet — coming soon.';
      signupStatus.className = 'contact__status';
    });
  }

  /* ---- helpers ---- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
