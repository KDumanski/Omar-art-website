/* =========================================================
   Omar Chacón — portfolio interactions
   1. Gallery + lightbox
   2. Scroll reveals, sticky nav, theme toggle
   3. Exhibition mode, count-up stats, contact form
   ========================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ----------------------------------------------------------
     1. GALLERY — render cards, wire the lightbox
  ---------------------------------------------------------- */
  const WORKS = [
    { src: 'assets/paintino-135.jpeg', title: 'Untitled Painting #135', meta: 'Acrylic on canvas · 2007', tag: 'Concentric ovals', status: 'available' },
    { src: 'assets/portrait.jpg',      title: 'Invasion 7',             meta: 'Acrylic on canvas · 2024', tag: 'Drip mosaic',    status: 'sold' },
    { src: 'assets/work-10.jpg',       title: 'Trisco 2',               meta: 'Acrylic on canvas',        tag: 'Hand-cast tiles',status: 'available' },
    { src: 'assets/work-11.jpg',       title: 'BDPM',                   meta: 'Acrylic on canvas',        tag: 'Peeled drips',   status: 'commissioned' },
    { src: 'assets/mayoyoque.jpg',     title: 'Mayoyoque CCXXXVII',     meta: 'Acrylic & resin on cast acrylic · 43½ × 31½ in', tag: 'Dashes of color', status: 'available' },
    { src: 'assets/bu-chueco-2018.jpg',title: 'Bu Chueco',             meta: 'Acrylic on paper · 26.5 × 34 in · 2018', tag: 'Columns of color', status: 'available' }
  ];

  const STATUS_LABEL = { available: 'Available', sold: 'Sold', commissioned: 'Commissioned' };

  const gallery = document.getElementById('gallery');
  if (gallery) {
    gallery.innerHTML = WORKS.map((art, i) => `
      <button class="art" data-index="${i}" aria-label="View ${escapeHtml(art.title)}">
        <span class="art__spotlight" aria-hidden="true"></span>
        <span class="art__status art__status--${art.status}">${escapeHtml(STATUS_LABEL[art.status] || '')}</span>
        <span class="art__tag">${escapeHtml(art.tag)}</span>
        <img src="${art.src}" alt="${escapeHtml(art.title)} — ${escapeHtml(art.meta)}" loading="lazy" />
        <span class="art__overlay">
          <span class="art__title">${escapeHtml(art.title)}</span>
          <span class="art__meta">${escapeHtml(art.meta)}</span>
        </span>
      </button>
    `).join('');

    // tilt-toward-cursor + spotlight follow
    if (!prefersReduced && !isCoarse) {
      gallery.querySelectorAll('.art').forEach((card) => {
        const spot = card.querySelector('.art__spotlight');
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          const rx = (0.5 - py) * 9;   // rotateX
          const ry = (px - 0.5) * 9;   // rotateY
          card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
          if (spot) { spot.style.setProperty('--mx', px * 100 + '%'); spot.style.setProperty('--my', py * 100 + '%'); }
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });
    }
  }

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  let current = 0;

  function openLightbox(i) {
    current = i;
    const art = WORKS[i];
    lbImg.src = art.src;
    lbImg.alt = art.title;
    lbCap.textContent = `${art.title} — ${art.meta}`;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function step(dir) { openLightbox((current + dir + WORKS.length) % WORKS.length); }

  if (gallery && lb) {
    gallery.addEventListener('click', (e) => {
      const card = e.target.closest('.art');
      if (card) openLightbox(+card.dataset.index);
    });
    lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', () => step(-1));
    lb.querySelector('.lightbox__nav--next').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL REVEALS, STICKY NAV, SMOOTH SCROLL, THEME
  ---------------------------------------------------------- */
  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // sticky nav state + reading-progress bar
  const nav = document.getElementById('nav');
  const progressBar = document.querySelector('#progress-top span');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 40);
    if (progressBar) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progressBar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // smooth scroll for the hero arrow + any data-scroll
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', () => {
      const t = document.querySelector(el.dataset.scroll);
      if (t) t.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  // theme toggle (persisted)
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('oc-theme');
  if (saved) root.setAttribute('data-theme', saved);
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('oc-theme', next);
    });
  }

  // year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------
     5. PAGE LOADER — fade out once the window is ready
  ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  if (loader) {
    const hide = () => setTimeout(() => loader.classList.add('is-done'), 500);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    // safety net so the loader never traps the page
    setTimeout(() => loader.classList.add('is-done'), 3500);
  }

  /* ----------------------------------------------------------
     6. SCROLL-SPY DOTS
  ---------------------------------------------------------- */
  const spyLinks = Array.from(document.querySelectorAll('.spy a'));
  const navLinks = Array.from(document.querySelectorAll('.nav__links a'));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    spyLinks.forEach((a) => {
      const sec = document.getElementById(a.dataset.spy);
      if (sec) map.set(sec, a);
    });
    // track visibility ratios; the most-visible section wins (robust for tall
    // sections like Work where a high single threshold never fires)
    const visible = new Map();
    const setActive = (id) => {
      spyLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.spy === id));
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    };
    const spyIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.intersectionRatio));
      let best = null, bestRatio = 0;
      visible.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; best = id; } });
      if (best && bestRatio > 0) setActive(best);
    }, { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: '-15% 0px -35% 0px' });
    map.forEach((_, sec) => spyIo.observe(sec));
  }

  /* ----------------------------------------------------------
     7. COUNT-UP STATS
  ---------------------------------------------------------- */
  const statsWrap = document.getElementById('stats');
  if (statsWrap && 'IntersectionObserver' in window) {
    const animateStat = (el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      if (prefersReduced || target === 0) { el.textContent = target + suffix; return; }
      const dur = 1400; const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          statsWrap.querySelectorAll('[data-count]').forEach(animateStat);
          statIo.disconnect();
        }
      });
    }, { threshold: 0.5 });
    statIo.observe(statsWrap);
  }

  /* ----------------------------------------------------------
     8. CONTACT FORM (Web3Forms) — AJAX submit + states
  ---------------------------------------------------------- */
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
        if (res.ok) {
          status.textContent = 'Thank you — your inquiry has been sent.';
          status.className = 'contact__status is-ok';
          form.reset();
        } else {
          throw new Error('bad response');
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please email directly instead.';
        status.className = 'contact__status is-err';
      } finally {
        btn.disabled = false; btn.textContent = label;
      }
    });
  }

  /* ----------------------------------------------------------
     9. EXHIBITION MODE — fullscreen one-work slideshow
  ---------------------------------------------------------- */
  const exhibit = document.getElementById('exhibit');
  if (exhibit) {
    const exImg = document.getElementById('exhibit-img');
    const exTitle = document.getElementById('exhibit-title');
    const exMeta = document.getElementById('exhibit-meta');
    const exCounter = document.getElementById('exhibit-counter');
    const exFill = document.getElementById('exhibit-fill');
    const exDots = document.getElementById('exhibit-dots');
    let exIndex = 0;

    // build dots
    exDots.innerHTML = WORKS.map((_, i) => `<button data-i="${i}" aria-label="Go to work ${i + 1}"></button>`).join('');
    const dotEls = Array.from(exDots.children);

    function renderExhibit(i) {
      exIndex = (i + WORKS.length) % WORKS.length;
      const art = WORKS[exIndex];
      exImg.classList.remove('is-shown');
      // swap after a beat so the fade reads
      setTimeout(() => {
        exImg.src = art.src;
        exImg.alt = art.title;
        exTitle.textContent = art.title;
        exMeta.textContent = art.meta;
        exImg.onload = () => exImg.classList.add('is-shown');
        // if cached, onload may not fire
        if (exImg.complete) exImg.classList.add('is-shown');
      }, 160);
      exCounter.textContent = `${exIndex + 1} / ${WORKS.length}`;
      exFill.style.width = ((exIndex + 1) / WORKS.length) * 100 + '%';
      dotEls.forEach((d, di) => d.classList.toggle('is-active', di === exIndex));
    }
    function openExhibit(i) {
      renderExhibit(i || 0);
      exhibit.classList.add('is-open');
      exhibit.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeExhibit() {
      exhibit.classList.remove('is-open');
      exhibit.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    const enterBtn = document.getElementById('enter-exhibition');
    if (enterBtn) enterBtn.addEventListener('click', () => openExhibit(0));
    document.getElementById('exhibit-close').addEventListener('click', closeExhibit);
    document.getElementById('exhibit-prev').addEventListener('click', () => renderExhibit(exIndex - 1));
    document.getElementById('exhibit-next').addEventListener('click', () => renderExhibit(exIndex + 1));
    exDots.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (b) renderExhibit(+b.dataset.i);
    });
    document.addEventListener('keydown', (e) => {
      if (!exhibit.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeExhibit();
      if (e.key === 'ArrowLeft') renderExhibit(exIndex - 1);
      if (e.key === 'ArrowRight') renderExhibit(exIndex + 1);
    });
  }

  /* ---- helpers ---- */
  function debounce(fn, ms) {
    let t;
    return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), ms); };
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
