/* =========================================================
   Omar Chacón — portfolio interactions
   1. Generative paint-drip field (his technique, in code)
   2. Custom cursor drip
   3. Gallery + lightbox
   4. Scroll reveals, sticky nav, theme toggle
   ========================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* The signature palette, sampled from his canvases */
  const PALETTE = [
    '#e23b3b', '#f08a24', '#f5c518', '#2fa75a',
    '#1b9aaa', '#2a5bd7', '#7b3fb0', '#e85b9c',
    '#13b886', '#ff6f3c', '#ffd23f', '#c0e218'
  ];

  /* ----------------------------------------------------------
     1. GENERATIVE DRIP FIELD
     Each "drip" is a stack of concentric ovals — exactly how
     his peeled paint reads. They drift and gently respond to
     the cursor, like the surface is breathing.
  ---------------------------------------------------------- */
  const canvas = document.getElementById('drip-field');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, drips = [];
    const mouse = { x: -9999, y: -9999 };

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

    function makeDrip() {
      const rings = (Math.random() * 3 | 0) + 2;
      const colors = [];
      for (let i = 0; i < rings; i++) colors.push(pick(PALETTE));
      return {
        x: rand(0, w), y: rand(0, h),
        r: rand(10, 34),
        rings, colors,
        vx: rand(-0.12, 0.12), vy: rand(0.04, 0.22),
        rot: rand(0, Math.PI),
        spin: rand(-0.002, 0.002),
        wobble: rand(0, Math.PI * 2),
        depth: rand(0.4, 1) // parallax-ish
      };
    }

    function build() {
      // density scales with viewport, capped for perf
      const target = Math.min(90, Math.floor((w * h) / 26000));
      drips = [];
      for (let i = 0; i < target; i++) drips.push(makeDrip());
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function drawDrip(d) {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      // concentric ovals, outer -> inner, slightly squashed (the "drip")
      for (let i = 0; i < d.rings; i++) {
        const k = 1 - i / d.rings;
        const rx = d.r * k;
        const ry = d.r * k * 1.18;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = d.colors[i];
        ctx.fill();
      }
      ctx.restore();
    }

    let raf;
    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const d of drips) {
        // drift
        d.wobble += 0.01;
        d.x += d.vx + Math.sin(d.wobble) * 0.15 * d.depth;
        d.y += d.vy * d.depth;
        d.rot += d.spin;

        // cursor repulsion — the field parts around the pointer
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 18000) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / 134) * 2.2;
          d.x += (dx / dist) * force;
          d.y += (dy / dist) * force;
        }

        // wrap
        if (d.y - d.r > h) { d.y = -d.r; d.x = rand(0, w); }
        if (d.x < -d.r) d.x = w + d.r;
        if (d.x > w + d.r) d.x = -d.r;

        drawDrip(d);
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', debounce(resize, 200));

    // pause when tab hidden (battery / perf)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(tick); }
    });

    resize();
    tick();
  }

  /* ----------------------------------------------------------
     2. CURSOR DRIP — a single peeled drip following the pointer
  ---------------------------------------------------------- */
  const cursor = document.getElementById('cursor-drip');
  if (cursor && !isCoarse) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy, ci = 0;

    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

    function follow() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    }
    follow();

    // shift the drip's color on every interactive hover
    const hoverables = 'a, button, .art, .step, .timeline li';
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        ci = (ci + 1) % PALETTE.length;
        cursor.style.background = PALETTE[ci];
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ----------------------------------------------------------
     3. GALLERY — render cards, wire the lightbox
  ---------------------------------------------------------- */
  const WORKS = [
    { src: 'assets/paintino-135.jpeg', title: 'Untitled Paintino #135', meta: 'Acrylic on canvas · 2007', tag: 'Concentric ovals', status: 'sold' },
    { src: 'assets/portrait.jpg',      title: 'Mosaico',                meta: 'Acrylic on canvas',        tag: 'Drip mosaic',    status: 'available' },
    { src: 'assets/work-10.jpg',       title: 'Gathering X',            meta: 'Acrylic on canvas',        tag: 'Hand-cast tiles',status: 'available' },
    { src: 'assets/work-11.jpg',       title: 'Cirio',                  meta: 'Acrylic on canvas',        tag: 'Peeled drips',   status: 'commissioned' },
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

  // sticky nav state
  const nav = document.getElementById('nav');
  const onScroll = () => { if (nav) nav.classList.toggle('is-stuck', window.scrollY > 40); };
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
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    spyLinks.forEach((a) => {
      const sec = document.getElementById(a.dataset.spy);
      if (sec) map.set(sec, a);
    });
    const spyIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          spyLinks.forEach((a) => a.classList.remove('is-active'));
          const link = map.get(en.target);
          if (link) link.classList.add('is-active');
        }
      });
    }, { threshold: 0.4, rootMargin: '-20% 0px -40% 0px' });
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
