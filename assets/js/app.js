// Iris Diamonds concept site: router, state, and interaction wiring.
import { byId, CATEGORIES, JEWELRY, EDITS, gold, jewelry, countIn, money, sizeFromMeasure, RING_SIZES, whatsapp, BOUTIQUE, openNow, WEIGHT_STOPS } from './data.js';
import { icon, img, src, esc, waveBandSVG, dataUri, microtext } from './parts.js';
import * as V from './views.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const KEY = 'iris-concept-v1';

/* ---------- state (kept on this device only) ---------- */
const state = { bag: [], saved: [], checkout: { emirate: 'Dubai', gift: { on: false, note: '' } }, lastOrder: null, draftSize: {} };
try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}'), { draftSize: {} }); } catch { /* storage unavailable: session-only */ }
const persist = () => { try { const { draftSize, ...keep } = state; localStorage.setItem(KEY, JSON.stringify(keep)); } catch { /* ignore */ } };

/* ---------- shell ---------- */
function shell() {
  $('#header').innerHTML = `<div class="header-inner">
    <button type="button" class="icon-btn menu-btn" data-action="open-menu" aria-label="Open menu" aria-haspopup="dialog">${icon('menu')}</button>
    <nav class="nav nav-primary" aria-label="Shop">${JEWELRY.map((c) => `<a href="#/shop/${c}">${CATEGORIES[c].title}</a>`).join('')}<a href="#/gold">Gold</a></nav>
    <a class="logo" href="#/" aria-label="Iris Diamonds, home"><img src="assets/iris-logo.png" alt="Iris Diamonds" width="356" height="351"></a>
    <nav class="nav nav-secondary" aria-label="About Iris"><a href="#/guide">Diamond guide</a><a href="#/story">Our story</a><a href="#/boutique">Boutique</a></nav>
    <div class="tools">
      <button type="button" class="icon-btn" data-action="open-search" aria-label="Search the collection" aria-haspopup="dialog">${icon('search')}</button>
      <a class="icon-btn saved-btn" href="#/saved" data-saved-link>${icon('heart')}<span class="badge" data-saved-count></span></a>
      <button type="button" class="icon-btn bag-btn" data-action="open-bag" aria-haspopup="dialog" data-bag-btn>${icon('bag')}<span class="badge" data-bag-count></span></button>
    </div></div>`;
  $('#footer').innerHTML = `<div class="footer-band" aria-hidden="true"></div>
    <div class="footer-inner">
      <a class="footer-logo" href="#/" aria-label="Iris Diamonds, home"><img src="assets/iris-logo.png" alt="Iris Diamonds" width="356" height="351" loading="lazy"></a>
      <nav aria-label="Shop" class="footer-col"><h2>Shop</h2>${JEWELRY.map((c) => `<a href="#/shop/${c}">${CATEGORIES[c].title}</a>`).join('')}<a href="#/gold">Gold bars</a>${EDITS.map((e) => `<a href="#/shop?edit=${e.id}">${e.title}</a>`).join('')}</nav>
      <nav aria-label="Help" class="footer-col"><h2>Help</h2><a href="#/guide">Diamond guide</a><a href="#/guide/sizing">Ring size guide</a><a href="#/services">Delivery and exchange</a><a href="#/services">Warranty and buy-back</a><a href="#/saved">Saved pieces</a></nav>
      <div class="footer-col"><h2>Visit</h2><p class="open-now" data-open-now>${openNow().text}</p><p>${BOUTIQUE.lines.join('<br>')}</p><p>${BOUTIQUE.hours}</p><p><a href="${BOUTIQUE.map}" target="_blank" rel="noopener">Directions</a></p><p><a href="${BOUTIQUE.tel}">${BOUTIQUE.phone}</a><br><a href="mailto:${BOUTIQUE.email}">${BOUTIQUE.email}</a></p></div>
      <div class="footer-col footer-about"><h2>About this prototype</h2><p>A design concept for Iris Diamonds. Names, prices, specifications and photographs come from irisdiamonds.ae, retrieved 1 October 2026. The checkout is simulated: no order is placed, no payment is taken and no personal details are collected.</p><a href="https://www.irisdiamonds.ae/" target="_blank" rel="noopener">Shop the live store at irisdiamonds.ae</a></div>
    </div>
    ${microtext('IRIS DIAMONDS · MADE TO BE REMEMBERED · JORDAN 1974 · DUBAI TODAY')}`;
  $('#menu-dialog').innerHTML = `<div class="sheet-head"><a class="logo logo-sm" href="#/" aria-label="Iris Diamonds, home"><img src="assets/iris-logo.png" alt="Iris Diamonds" width="356" height="351"></a><button type="button" class="icon-btn" data-action="close-dialog" aria-label="Close menu">${icon('close')}</button></div>
    <nav class="menu" aria-label="Menu"><ul role="list">${JEWELRY.map((c) => `<li><a href="#/shop/${c}"><span>${CATEGORIES[c].title}</span><small>${countIn(c)}</small></a></li>`).join('')}<li><a href="#/gold"><span>Gold bars</span><small>${gold.length}</small></a></li><li><a href="#/shop"><span>All jewelry</span></a></li></ul>
    <ul role="list" class="menu-quiet"><li><a href="#/guide">Diamond guide</a></li><li><a href="#/guide/sizing">Ring size guide</a></li><li><a href="#/story">Our story</a></li><li><a href="#/services">Delivery and exchange</a></li><li><a href="#/boutique">Visit the boutique</a></li><li><a href="#/saved">Saved pieces</a></li></ul></nav>
    <div class="menu-foot"><a class="btn btn-ghost btn-block" href="${whatsapp('Hello Iris Diamonds, I have a question.')}" target="_blank" rel="noopener">${icon('chat')} WhatsApp a Client Advisor</a><p>${BOUTIQUE.hours} · ${BOUTIQUE.phone}</p></div>`;
  $('#search-dialog').innerHTML = `<form class="search-bar" role="search" data-search><label for="search-input" class="sr-only">Search the collection</label>${icon('search')}<input id="search-input" type="search" name="q" placeholder="Search rings, hoops, rose gold…" autocomplete="off" enterkeyhint="search"><button type="button" class="icon-btn" data-action="close-dialog" aria-label="Close search">${icon('close')}</button></form><div class="search-results" data-search-results aria-live="polite">${V.searchResults('')}</div>`;
  const band = dataUri(waveBandSVG({ w: 640, h: 28, strands: 11, waves: 7, stroke: '#000C30', opacity: 0.55, width: 0.45 }));
  const bandLight = dataUri(waveBandSVG({ w: 640, h: 28, strands: 11, waves: 7, stroke: '#F4F2F8', opacity: 0.35, width: 0.45 }));
  document.documentElement.style.setProperty('--band', band);
  document.documentElement.style.setProperty('--band-light', bandLight);
  updateBadges();
}
function updateBadges() {
  const n = V.bagCount(state), s = state.saved.length;
  $$('[data-bag-count]').forEach((b) => (b.textContent = n || ''));
  $$('[data-saved-count]').forEach((b) => (b.textContent = s || ''));
  const bagBtn = $('[data-bag-btn]'); if (bagBtn) bagBtn.setAttribute('aria-label', `Bag, ${n} ${n === 1 ? 'piece' : 'pieces'}`);
  const sv = $('[data-saved-link]'); if (sv) sv.setAttribute('aria-label', `Saved pieces, ${s}`);
}

/* ---------- router ---------- */
function parse() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = h.split('?');
  const parts = path.split('/').filter(Boolean);
  return { parts, query: new URLSearchParams(qs || ''), path };
}
let current = null;
function resolve({ parts, query }) {
  const [a, b] = parts;
  if (!a) return V.home(state);
  if (a === 'shop') return b && !CATEGORIES[b] ? V.notFound() : V.shop(state, { cat: b, query });
  if (a === 'piece') return V.piece(state, { id: b, query });
  if (a === 'gold') return V.goldPage(state);
  if (a === 'saved') return V.savedPage(state);
  if (a === 'bag') return V.bagPage(state);
  if (a === 'checkout') return V.checkout(state);
  if (a === 'confirmation') return V.confirmation(state);
  if (a === 'story') return V.story(state);
  if (a === 'guide') return b === 'sizing' ? V.sizing(state) : V.guide(state);
  if (a === 'services') return V.services(state);
  if (a === 'boutique') return V.boutique(state);
  return V.notFound();
}
const scrolls = new Map();
let first = true;
function render({ scroll = 'top', transition = true } = {}) {
  const route = parse();
  const view = resolve(route);
  const swap = () => {
    if (!first) document.documentElement.classList.remove('intro');
    $('#main').innerHTML = view.html;
    document.title = view.title;
    current = { ...view, route };
    document.body.dataset.page = route.parts[0] || 'home';
    $$('.nav a').forEach((a) => a.toggleAttribute('aria-current', location.hash.startsWith(a.getAttribute('href'))));
    mount(view, route);
  };
  const go = () => {
    swap();
    if (scroll === 'top') window.scrollTo(0, 0);
    else if (scroll === 'restore') window.scrollTo(0, scrolls.get(location.hash) || 0);
  };
  if (transition && document.startViewTransition && !reduced.matches) {
    // an aborted transition (resize, rapid navigation) still runs the update; it just shouldn't surface as an error
    const vt = document.startViewTransition(go);
    vt.ready.catch(() => {}); vt.finished.catch(() => {});
  } else go();
  announce(view.title.split(' · ')[0]);
  if (scroll === 'top' && !first) requestAnimationFrame(() => $('#main h1')?.focus({ preventScroll: true }));
  first = false;
}
function navigate(href, opts = {}) {
  scrolls.set(location.hash, window.scrollY);
  if (opts.replace) history.replaceState(null, '', href); else history.pushState(null, '', href);
  render(opts);
}
window.addEventListener('popstate', () => {
  if (ignorePop) { ignorePop = false; return; }
  const open = $$('dialog[open]');
  if (open.length) { open.forEach((d) => { d.dataset.pushed = ''; d.close(); }); return; }
  if (!location.hash || location.hash.startsWith('#/')) render({ scroll: 'restore' });
});
history.scrollRestoration = 'manual';

/* ---------- mount: per-view behaviour ---------- */
function mount(view, route) {
  const root = $('#main');
  root.querySelectorAll('h1').forEach((h) => h.setAttribute('tabindex', '-1'));
  observeReveals(root);
  observeScenes(root);
  if (route.parts[0] === undefined) mountHome(root);
  if (route.parts[0] === 'shop') mountShop(root, view);
  if (route.parts[0] === 'piece' && view.media) mountPiece(root, view);
  if (route.parts[0] === 'checkout') mountCheckout(root);
  if (route.parts[0] === 'story') mountStory(root);
  if (route.parts[0] === 'guide' && route.parts[1] === 'sizing') mountCalc(root);
}

// The opening plays once, on the page load that lands on home: the iris draws, the lens
// opens on the first piece, the headline rises and the stones pop in around the rim.
function playOpening() {
  const html = document.documentElement;
  if (html.classList.contains('intro')) setTimeout(() => html.classList.remove('intro'), 3600);
}
// The loupe: the lens closes like an iris, the next piece is set, the lens opens again.
// Desktop turns on its own every few seconds (pause button, stops while hovered or focused);
// phones and reduced motion turn only when asked. Only visitor-started turns are announced.
function mountLoupe(root) {
  const el = $('[data-lens]', root); if (!el) return;
  const total = V.LOUPE.length, live = $('.lens-live', el), playBtn = $('[data-lens-play]', el);
  let i = 0, busy = false, hold = false, timer = 0;
  let playing = !reduced.matches && matchMedia('(min-width: 761px) and (hover: hover)').matches;
  const setPlay = (on) => {
    playing = on;
    playBtn.setAttribute('aria-pressed', String(!on));
    playBtn.setAttribute('aria-label', on ? 'Pause the turning lens' : 'Turn the lens automatically');
    el.classList.toggle('is-paused', !on);
    schedule();
  };
  const show = (to, byVisitor) => {
    if (busy) return;
    busy = true; i = (to + total) % total;
    live.setAttribute('aria-live', byVisitor ? 'polite' : 'off');
    // warm the next lens image so the aperture opens on a decoded picture
    const swap = () => {
      $('.lens-frame', el).outerHTML = V.loupeFrame(i);
      $('[data-lens-index]', el).textContent = String(i + 1).padStart(2, '0');
      el.classList.remove('is-closing');
      if (reduced.matches) { busy = false; return; }
      el.classList.add('is-opening');
      setTimeout(() => { el.classList.remove('is-opening'); busy = false; }, 1300);
    };
    if (reduced.matches) return swap();
    el.classList.add('is-closing');
    setTimeout(swap, 560);
  };
  function schedule() {
    clearTimeout(timer);
    if (!playing || hold) return;
    timer = setTimeout(() => {
      if (!el.isConnected) return;
      if (document.visibilityState === 'visible') show(i + 1, false);
      schedule();
    }, document.documentElement.classList.contains('intro') ? 9000 : 6500);
  }
  el.addEventListener('click', (e) => {
    const step = e.target.closest('[data-lens-step]');
    if (step) { show(i + Number(step.dataset.lensStep), true); schedule(); }
    if (e.target.closest('[data-lens-play]')) setPlay(!playing);
  });
  el.addEventListener('pointerenter', () => { hold = true; clearTimeout(timer); });
  el.addEventListener('pointerleave', () => { hold = false; schedule(); });
  el.addEventListener('focusin', () => { hold = true; clearTimeout(timer); });
  el.addEventListener('focusout', (e) => { if (!el.contains(e.relatedTarget)) { hold = false; schedule(); } });
  // preload the next pieces' lens images
  V.LOUPE.forEach(([id, k]) => { const p = byId[id]; const o = p.options[Math.min(k, p.options.length - 1)]; const im = new Image(); im.src = src(o.pack[0], 960); });
  setPlay(playing);
}
// The film plays muted and only while it is on screen; the visitor can pause it, and with
// reduced motion it waits on its poster until asked. preload="none" keeps its 4 MB off first load.
function mountFilm(root) {
  const v = $('[data-film]', root); if (!v) return;
  const band = v.closest('.film'), btn = $('[data-film-toggle]', band);
  let wanted = !reduced.matches, seen = false;
  const sync = () => {
    band.classList.toggle('is-paused', !wanted);
    btn.setAttribute('aria-pressed', String(!wanted));
    btn.setAttribute('aria-label', wanted ? 'Pause the film' : 'Play the film');
    if (wanted && seen) v.play().catch(() => {}); else v.pause();
  };
  const io = new IntersectionObserver(([e]) => {
    if (!v.isConnected) return io.disconnect();
    seen = e.isIntersecting; sync();
  }, { threshold: 0.35 });
  io.observe(v);
  btn.addEventListener('click', () => { wanted = !wanted; sync(); });
  sync();
}
function mountHome(root) {
  playOpening();
  mountLoupe(root);
  mountFilm(root);
  const idx = $('.index', root), prev = $('[data-index-preview]', root);
  $$('.index-link[data-preview]', root).forEach((a) => {
    const show = () => { prev.src = a.dataset.preview; idx.dataset.active = a.getAttribute('href'); };
    a.addEventListener('pointerenter', show); a.addEventListener('focus', show);
  });
  const tabs = $$('[data-specimen]', root), panel = $('#spec-panel', root);
  const select = (t) => {
    tabs.forEach((x) => { x.setAttribute('aria-selected', x === t); x.tabIndex = x === t ? 0 : -1; });
    panel.setAttribute('aria-labelledby', t.id);
    panel.innerHTML = V.specimenPanel(byId[t.dataset.specimen]);
    observeReveals(panel, true);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return; e.preventDefault();
      const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n);
    });
  });
}

/* shop: filters drive the grid live, the URL keeps the state shareable */
function mountShop(root, view) {
  const cat = view.cat;
  const read = (form) => {
    const fd = new FormData(form), get = (k) => fd.getAll(k).join(',');
    return { cat: cat ? '' : get('cat'), metal: get('metal'), price: get('price'), weight: get('weight'), edit: fd.get('edit') || '' };
  };
  const apply = (vals) => {
    const q = parse().query;
    Object.entries(vals).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    const s = q.toString();
    history.replaceState(null, '', `#${parse().path}${s ? '?' + s : ''}`);
    refreshShop(root, cat);
  };
  $$('[data-filters]', root).forEach((form) => form.addEventListener('change', () => apply(read(form))));
  $('[data-sort]', root)?.addEventListener('change', (e) => apply({ sort: e.target.value === 'featured' ? '' : e.target.value }));
  // the weight scale: two thumbs on one track, the grid and readout follow live
  const ws = $('[data-wscale]', root);
  if (ws) {
    const lo = $('[data-wmin]', ws), hi = $('[data-wmax]', ws), n = WEIGHT_STOPS.length - 1;
    let frame = 0;
    const sync = (moved) => {
      if (+lo.value > +hi.value) (moved === lo ? (hi.value = lo.value) : (lo.value = hi.value));
      const a = +lo.value, b = +hi.value;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => apply({ wmin: a > 0 ? String(WEIGHT_STOPS[a]) : '', wmax: b < n ? String(WEIGHT_STOPS[b]) : '' }));
    };
    lo.addEventListener('input', () => sync(lo));
    hi.addEventListener('input', () => sync(hi));
  }
  refreshShop(root, cat, false);
}
function syncScale(root, f) {
  const ws = $('[data-wscale]', root); if (!ws) return;
  const n = WEIGHT_STOPS.length - 1;
  const a = Math.max(0, WEIGHT_STOPS.findIndex((v) => v >= f.wmin));
  const bi = f.wmax === Infinity ? n : WEIGHT_STOPS.findIndex((v) => v >= f.wmax), b = bi < 0 ? n : bi;
  const lo = $('[data-wmin]', ws), hi = $('[data-wmax]', ws);
  lo.value = a; hi.value = b;
  ws.style.setProperty('--lo', a); ws.style.setProperty('--hi', b);
  $$('.wscale-ticks li', ws).forEach((li, i) => li.classList.toggle('on', (a > 0 || b < n) && i >= a && i <= b));
  const fmt = (x) => ({ 0.25: '¼', 0.5: '½', 0.75: '¾', 1.5: '1½' }[x] || String(x));
  lo.setAttribute('aria-valuetext', `${fmt(WEIGHT_STOPS[a])} carats`);
  hi.setAttribute('aria-valuetext', b === n ? 'no maximum' : `${fmt(WEIGHT_STOPS[b])} carats`);
  $('[data-wscale-out]', ws).textContent = f.wmin > 0 || f.wmax < Infinity ? V.weightLabel(f) : 'Any weight';
}
function refreshShop(root, cat, regrid = true) {
  const f = V.parseFilters(parse().query); if (cat) f.cat = [cat];
  const list = V.applyFilters(f, jewelry);
  syncScale(root, f);
  const chips = V.chipList(f, !!cat);
  if (regrid) $('[data-grid]', root).innerHTML = V.gridHTML(list, state, f, chips[chips.length - 1]);
  $('[data-readout]', root).textContent = V.readout(list);
  const counts = V.facetCounts(f, jewelry);
  $$('[data-count]', root).forEach((el) => {
    const n = counts[el.dataset.count]; el.textContent = n ?? '';
    el.closest('.check')?.classList.toggle('is-empty', n === 0 && !el.closest('.check').querySelector('input').checked);
  });
  $('[data-applied]', root).innerHTML = V.appliedChips(f, !!cat);
  const n = f.metal.length + f.price.length + f.weight.length + (cat ? 0 : f.cat.length) + (f.edit ? 1 : 0);
  // (the weight scale shows its own state, so it is not counted on the More filters button)
  $$('[data-filter-count]', root).forEach((x) => (x.textContent = n ? ` · ${n}` : ''));
  $$('[data-show-count]', root).forEach((x) => (x.textContent = list.length ? `Show ${list.length} ${list.length === 1 ? 'piece' : 'pieces'}` : 'No pieces match'));
  $$('[data-filters]', root).forEach((form) => $$('input', form).forEach((i) => (i.checked = i.name === 'edit' ? (f.edit || '') === i.value : (f[i.name] || []).includes(i.value))));
  if (regrid) observeReveals($('[data-grid]', root));
}

/* story: the iris turns with the scroll */
// Nine blades, each lying between two neighbouring edges of the aperture's nine-gon extended to
// the housing, close to a point; the aperture's inradius r opens them, and they twist as they close.
function irisBlades(r, twist, N = 9, R = 476) {
  const a = Math.PI / N, k = r / Math.cos(a), V = [], T = [];
  for (let i = 0; i < N; i++) {
    const th = 2 * a * i + twist;
    V.push([k * Math.cos(th + a), k * Math.sin(th + a)]);
    T.push([-Math.sin(th), Math.cos(th)]);
  }
  const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const hit = ([x, y], [tx, ty]) => { const b = x * tx + y * ty, s = -b + Math.sqrt(b * b - (x * x + y * y - R * R)); return pt([x + s * tx, y + s * ty]); };
  return V.map((v, i) => { const j = (i + 1) % N; return `M${pt(v)}L${pt(V[j])}L${hit(V[j], T[j])}A${R} ${R} 0 0 0 ${hit(v, T[i])}Z`; });
}
// Each chapter is a screen of scroll: the iris opens on its photograph, holds, and closes as the
// next arrives (the first starts open, the last stays open); with reduced motion it stays open.
function mountStory(root) {
  const sec = $('[data-iris-story]', root); if (!sec) return;
  const blades = $$('.blade', sec), photos = $$('.iris-photo', sec), chapters = $$('.iris-chapter', sec), keys = $$('[data-chapter]', sec), dial = $('[data-dial]', sec);
  const n = chapters.length, head = () => $('.site-header').offsetHeight, span = () => Math.max(1, sec.offsetHeight - (innerHeight - head()));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), clamp = (x) => Math.min(1, Math.max(0, x));
  let raf = 0, current = -1;
  const draw = () => {
    raf = 0;
    if (!sec.isConnected) { removeEventListener('scroll', queue); removeEventListener('resize', queue); return; }
    const p = clamp((head() - sec.getBoundingClientRect().top) / span());
    const x = p * n, i = Math.min(n - 1, Math.floor(x)), q = Math.min(1, x - i);
    const open = i === 0 ? 1 : ease(clamp(q / 0.26)), shut = i === n - 1 ? 0 : ease(clamp((q - 0.8) / 0.2));
    const o = reduced.matches ? 1 : open * (1 - shut);
    irisBlades(452 * o, 0.62 * (1 - o)).forEach((d, k) => blades[k].setAttribute('d', d));
    if (i !== current) {
      current = i;
      photos.forEach((ph, k) => ph.classList.toggle('is-on', k === i));
      chapters.forEach((c, k) => c.classList.toggle('is-on', k === i));
      keys.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    }
    const shown = reduced.matches ? 1 : (i === 0 ? 1 : ease(clamp((q - 0.1) / 0.2))) * (i === n - 1 ? 1 : 1 - ease(clamp((q - 0.76) / 0.14)));
    chapters[i].style.opacity = shown.toFixed(3);
    chapters[i].style.transform = `translateY(${((1 - shown) * 18).toFixed(1)}px)`;
    // the bezel reads 1974 on the first chapter and today from "Dubai, today" on
    dial.setAttribute('transform', `rotate(${(-V.dialAngle(1974 + 52 * ease(clamp((p * n) / 3.5))) * 180 / Math.PI).toFixed(2)})`);
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  keys.forEach((b, k) => b.addEventListener('click', () => {
    scrollTo({ top: sec.getBoundingClientRect().top + scrollY - head() + ((k + 0.45) / n) * span(), behavior: reduced.matches ? 'auto' : 'smooth' });
  }));
  draw();
}

/* piece: gallery, loupe, options, sticky buy bar */
function mountPiece(root, view) {
  const stage = $('[data-stage]', root), stageImg = $('.stage-img', root), loupe = $('.loupe', root);
  const media = view.media;
  let index = 0;
  const show = (i) => {
    index = i; const m = media[i];
    stageImg.srcset = ''; stageImg.src = src(m.s, 1600); stageImg.alt = m.alt;
    stage.classList.toggle('is-worn', m.kind === 'worn');
    $('.stage-btn', root).dataset.index = i;
    $$('.thumb', root).forEach((t, k) => t.setAttribute('aria-current', k === i));
  };
  root.addEventListener('click', (e) => { const t = e.target.closest('[data-action="show-media"]'); if (t) show(+t.dataset.index); });
  if (fine.matches && loupe) {
    const Z = 2.6;
    stage.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (!loupe.style.backgroundImage.includes(media[index].s)) loupe.style.backgroundImage = `url(${src(media[index].s, 2400)})`;
      // follow the picture as drawn (contained, whatever shape the stage is)
      const nw = stageImg.naturalWidth || 1, nh = stageImg.naturalHeight || 1;
      const k = Math.min(r.width / nw, r.height / nh);
      const dw = nw * k, dh = nh * k, ox = (r.width - dw) / 2, oy = (r.height - dh) / 2;
      loupe.style.backgroundSize = `${dw * Z}px ${dh * Z}px`;
      loupe.style.backgroundPosition = `${-((x - ox) * Z - loupe.offsetWidth / 2)}px ${-((y - oy) * Z - loupe.offsetHeight / 2)}px`;
      loupe.style.transform = `translate(${x - loupe.offsetWidth / 2}px, ${y - loupe.offsetHeight / 2}px)`;
      stage.classList.add('loupe-on');
    });
    stage.addEventListener('pointerleave', () => stage.classList.remove('loupe-on'));
  }
  const swipe = $('.swipe', root), count = $('[data-swipe-index]', root);
  swipe?.addEventListener('scroll', () => {
    const i = Math.round(swipe.scrollLeft / swipe.clientWidth);
    if (count) count.textContent = i + 1;
    $$('.swipe-thumbs .thumb', root).forEach((t, k) => t.setAttribute('aria-current', k === i));
  }, { passive: true });
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action="swipe-to"]'); if (!t || !swipe) return;
    swipe.scrollTo({ left: +t.dataset.index * swipe.clientWidth, behavior: reduced.matches ? 'auto' : 'smooth' });
  });
  const buy = $('.buy-actions [data-action="add"]', root), bar = $('[data-buybar]', root);
  if (buy && bar) {
    // a scroll check, not an IntersectionObserver: a fast fling can jump straight past the button
    let pending = false;
    const check = () => {
      pending = false;
      if (!bar.isConnected) return removeEventListener('scroll', onScroll);
      const on = buy.getBoundingClientRect().bottom < 0;
      if (on === bar.classList.contains('on')) return;
      bar.classList.toggle('on', on); bar.setAttribute('aria-hidden', !on);
      $('button', bar).tabIndex = on ? 0 : -1;
    };
    const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(check); } };
    addEventListener('scroll', onScroll, { passive: true });
    check();
  }
}

/* checkout: sample-only form */
function mountCheckout(root) {
  const form = $('[data-checkout]', root); if (!form) return;
  form.addEventListener('change', (e) => {
    if (e.target.name === 'emirate') { state.checkout.emirate = e.target.value; $('[data-delivery-note]', root).innerHTML = V.deliveryNote(e.target.value); persist(); }
    if (e.target.name === 'gift') { state.checkout.gift.on = e.target.checked; $('.gift-note', root).hidden = !e.target.checked; $('[data-contact-title]', root).textContent = e.target.checked ? 'Recipient' : 'Contact and address'; persist(); }
  });
  form.addEventListener('input', (e) => {
    if (e.target.name === 'note') { state.checkout.gift.note = e.target.value; $('[data-note-count]', root).textContent = e.target.value.length; persist(); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.lastOrder = {
      ref: 'SIM-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      items: state.bag.map(({ id, opt, qty, size }) => ({ id, opt, qty, size })),
      total: V.totals(state), emirate: state.checkout.emirate, gift: state.checkout.gift.on,
    };
    state.bag = []; persist(); updateBadges();
    navigate('#/confirmation');
  });
}

/* ring size calculator (guide page and sizing sheet) */
function mountCalc(root) {
  const form = $('[data-size-calc]', root); if (!form) return;
  const out = $('[data-calc-out]', form);
  const run = () => {
    const kind = new FormData(form).get('kind'), input = form.elements.mm;
    if (kind === 'dia') { input.min = 13; input.max = 22; } else { input.min = 40; input.max = 70; }
    const mm = parseFloat(input.value);
    const ok = mm >= +input.min && mm <= +input.max;
    $$('[data-size-row]', root).forEach((r) => r.classList.remove('on'));
    if (!ok) { out.innerHTML = `<span class="calc-warn">${kind === 'dia' ? 'Enter an inside diameter between 13 and 22 mm.' : 'Enter a circumference between 40 and 70 mm.'}</span>`; return; }
    const s = sizeFromMeasure(mm, kind);
    out.innerHTML = `<span class="calc-size">US ${s.us}</span><span>UK ${s.uk} · EU ${s.eu} · ${s.dia.toFixed(1)} mm inside diameter</span><span class="hint">Closest approximate size. The team confirms it with you before your order.</span>`;
    $(`[data-size-row="${s.us}"]`, root)?.classList.add('on');
  };
  form.addEventListener('input', run); form.addEventListener('change', (e) => {
    if (e.target.name === 'kind') form.elements.mm.value = e.target.value === 'dia' ? 17.3 : 54;
    run();
  });
  run();
}

/* reveal: stone maps count in, sections settle (content is visible by default) */
let io;
function observeReveals(root, immediate = false) {
  const maps = $$('.stone-map', root);
  if (reduced.matches || !('IntersectionObserver' in window)) { maps.forEach((m) => m.classList.add('counted')); return; }
  io ||= new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('counted'); io.unobserve(en.target); } }), { threshold: 0.35 });
  maps.forEach((m) => { m.classList.add('will-count'); if (immediate) requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('counted'))); else io.observe(m); });
}

// Scenes settle into view: their headings rise and marked photographs unveil, once each.
// Scenes with their own choreography (the home hero, the story iris) are left alone.
let sio;
function observeScenes(root) {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  sio ||= new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); sio.unobserve(en.target); } }), { threshold: 0.18 });
  $$('.scene', root).forEach((sc) => {
    if (sc.hasAttribute('data-scene-still')) return;
    $$('h1, h2', sc).forEach((h) => h.classList.add('rise'));
    sc.classList.add('will-reveal');
    if (sc.getBoundingClientRect().top < innerHeight * 0.85) requestAnimationFrame(() => requestAnimationFrame(() => sc.classList.add('is-in')));
    else sio.observe(sc);
  });
}

/* ---------- actions ---------- */
function dialog(id) { return document.getElementById(id); }
// Each open sheet owns one history entry, so the Back button closes it instead of leaving the page.
let ignorePop = false;
function openDialog(d) {
  if (d.open) return;
  d.showModal();
  if (!d.dataset.pushed) { history.pushState({ sheet: d.id }, '', location.href); d.dataset.pushed = '1'; }
}
function closeDialogs({ silent = false } = {}) {
  $$('dialog[open]').forEach((d) => { if (silent) d.dataset.pushed = ''; d.close(); });
}
document.addEventListener('close', (e) => {
  const d = e.target;
  if (d.tagName === 'DIALOG' && d.dataset.pushed) { d.dataset.pushed = ''; if (history.state?.sheet === d.id) { ignorePop = true; history.back(); } }
}, true);
function openBag() {
  $('#bag-dialog').innerHTML = `<div class="sheet-head"><h2 id="bag-title" class="display-s">Your bag <small>${V.bagCount(state) || ''}</small></h2><button type="button" class="icon-btn" data-action="close-dialog" aria-label="Close bag">${icon('close')}</button></div><div class="sheet-body">${V.bagPanel(state)}</div>`;
  openDialog($('#bag-dialog'));
}
function refreshBagViews() {
  updateBadges();
  if ($('#bag-dialog').open) openBag();
  const page = $('[data-bag-page]'); if (page) page.innerHTML = V.bagPanel(state);
}
function toast(html) {
  const t = $('#toast'); t.innerHTML = html; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 3200);
}
function announce(text) { const a = $('#announcer'); a.textContent = ''; setTimeout(() => (a.textContent = text), 60); }

function addToBag(id) {
  const p = byId[id]; if (!p) return;
  const pieceEl = $(`[data-piece="${id}"]`);
  const optIdx = pieceEl ? +pieceEl.dataset.option : 0;
  const size = p.category === 'rings' ? state.draftSize[id] || '' : '';
  const key = `${id}:${optIdx}:${size}`;
  const line = state.bag.find((x) => x.key === key);
  if (line) line.qty = Math.min(5, line.qty + 1); else state.bag.push({ key, id, opt: optIdx, size, qty: 1 });
  persist(); refreshBagViews();
  openBag();
  announce(`${p.title} added to your bag`);
}
function toggleSave(id) {
  const i = state.saved.indexOf(id);
  if (i >= 0) state.saved.splice(i, 1); else state.saved.unshift(id);
  persist(); updateBadges();
  const on = state.saved.includes(id);
  $$(`[data-action="save"][data-id="${id}"]`).forEach((b) => {
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', `${on ? 'Remove from saved pieces' : 'Save this piece'}: ${byId[id].title}`);
  });
  toast(on ? `Saved. <a href="#/saved">See saved pieces</a>` : 'Removed from saved pieces.');
  if (parse().parts[0] === 'saved') render({ scroll: 'keep', transition: false });
}

document.addEventListener('click', (e) => {
  if (e.target.closest('a.skip')) { e.preventDefault(); $('#main').focus(); return; }
  // in-page fragment links scroll without replacing the route in the URL
  const frag = e.target.closest('a[href^="#"]:not([href^="#/"])');
  if (frag) { const el = document.getElementById(frag.getAttribute('href').slice(1)); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' }); } return; }
  const a = e.target.closest('a[href^="#/"]');
  const t = e.target.closest('[data-action]');
  if (t) {
    const act = t.dataset.action;
    const handled = {
      'open-bag': () => openBag(),
      'open-menu': () => openDialog(dialog('menu-dialog')),
      'open-search': () => { openDialog(dialog('search-dialog')); $('#search-input').focus(); },
      'open-filters': () => openDialog(dialog('filters-dialog')),
      'close-dialog': () => t.closest('dialog')?.close(),
      'clear-filters': () => { const p = parse(); const q = new URLSearchParams(); if (p.query.get('sort')) q.set('sort', p.query.get('sort')); history.replaceState(null, '', `#${p.path}${q.toString() ? '?' + q : ''}`); refreshShop($('#main'), current?.cat); },
      'remove-filter': () => {
        const p = parse(), k = t.dataset.key, v = t.dataset.value;
        if (k === 'wrange') { p.query.delete('wmin'); p.query.delete('wmax'); }
        const vals = (p.query.get(k) || '').split(',').filter((x) => x && x !== v);
        if (k !== 'wrange') vals.length && k !== 'edit' ? p.query.set(k, vals.join(',')) : p.query.delete(k);
        history.replaceState(null, '', `#${p.path}${p.query.toString() ? '?' + p.query : ''}`); refreshShop($('#main'), current?.cat);
      },
      add: () => addToBag(t.dataset.id),
      save: () => toggleSave(t.dataset.id),
      qty: () => { const l = state.bag.find((x) => x.key === t.dataset.key); if (!l) return; l.qty = Math.max(0, Math.min(5, l.qty + +t.dataset.delta)); state.bag = state.bag.filter((x) => x.qty > 0); persist(); refreshBagViews(); },
      remove: () => { const l = state.bag.find((x) => x.key === t.dataset.key); state.bag = state.bag.filter((x) => x.key !== t.dataset.key); persist(); refreshBagViews(); if (l) announce(`${byId[l.id].title} removed`); },
      later: () => { const l = state.bag.find((x) => x.key === t.dataset.key); if (!l) return; state.bag = state.bag.filter((x) => x.key !== t.dataset.key); if (!state.saved.includes(l.id)) state.saved.unshift(l.id); persist(); refreshBagViews(); toast(`Moved to saved pieces. <a href="#/saved">See saved</a>`); },
      zoom: () => openZoom(+t.dataset.index || 0),
      print: () => window.print(),
      'open-sizing': () => { e.preventDefault(); openSizing(); },
      'zoom-step': () => zoomStep(+t.dataset.delta),
      'zoom-toggle': () => $('#zoom-dialog').classList.toggle('zoomed'),
    }[act];
    if (handled) { if (t.tagName === 'A' && act !== 'to-checkout') e.preventDefault(); handled(); if (act !== 'to-checkout') return; }
  }
  if (a && !a.target && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    // leaving from inside a sheet: its history entry becomes the new page instead of being popped
    const fromSheet = $$('dialog[open]').some((d) => d.dataset.pushed);
    closeDialogs({ silent: true });
    const cardImg = a.closest('.card')?.querySelector('.window img');
    if (cardImg && !reduced.matches) cardImg.style.viewTransitionName = 'piece-hero';
    navigate(a.getAttribute('href'), { replace: fromSheet && history.state?.sheet });
  }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.action === 'choose-option') {
    const id = t.closest('[data-piece]').dataset.piece;
    const q = new URLSearchParams(); if (+t.value) q.set('o', t.value);
    navigate(`#/piece/${id}${q.toString() ? '?' + q : ''}`, { replace: true, scroll: 'keep', transition: false });
    // the page re-rendered for the new listing: keep keyboard focus on the chosen option
    $(`input[name="option"][value="${t.value}"]`)?.focus({ preventScroll: true });
    announce(`${byId[id].title}, ${$('.choice-now')?.textContent || ''}, ${$('[data-price]')?.textContent || ''}`);
  }
  if (t.dataset.action === 'choose-size') {
    const id = t.closest('[data-piece]').dataset.piece;
    state.draftSize[id] = t.value;
    const now = $('[data-size-now]'); if (now) now.textContent = t.value ? `US ${t.value}` : 'Optional';
    const bs = $('[data-buybar-size]'); if (bs) bs.textContent = t.value ? ` · size US ${t.value}` : '';
  }
  if (t.dataset.action === 'gift-toggle') { state.checkout.gift.on = t.checked; persist(); }
});

/* search */
document.addEventListener('input', (e) => {
  if (e.target.id === 'search-input') $('[data-search-results]').innerHTML = V.searchResults(e.target.value);
});
document.addEventListener('submit', (e) => {
  if (e.target.matches('[data-search]')) { e.preventDefault(); const q = e.target.q.value.trim(); if (q) { closeDialogs({ silent: true }); navigate(`#/shop?q=${encodeURIComponent(q)}`, { replace: history.state?.sheet === 'search-dialog' }); } }
});

/* zoom viewer */
let zoomIndex = 0;
function openZoom(i) {
  const media = current?.media; if (!media) return;
  zoomIndex = i;
  const d = $('#zoom-dialog');
  d.classList.remove('zoomed');
  d.innerHTML = `<div class="zoom-head"><p class="zoom-title">${esc(current.piece.title)} <span data-zoom-count>${i + 1} / ${media.length}</span></p>
    <div class="zoom-tools"><button type="button" class="icon-btn" data-action="zoom-toggle" aria-label="Zoom in or out">${icon('zoom')}</button><button type="button" class="icon-btn" data-action="close-dialog" aria-label="Close the enlarged view">${icon('close')}</button></div></div>
    <div class="zoom-stage" data-zoom-stage><img data-zoom-img src="${src(media[i].s, 2400)}" alt="${esc(media[i].alt)}"></div>
    <div class="zoom-nav"><button type="button" class="icon-btn" data-action="zoom-step" data-delta="-1" aria-label="Previous photograph">${icon('back')}</button><button type="button" class="icon-btn" data-action="zoom-step" data-delta="1" aria-label="Next photograph">${icon('arrow')}</button></div>`;
  zoomStep(0);
  openDialog(d);
  $('[data-zoom-stage]').addEventListener('click', (ev) => { if (ev.target.tagName === 'IMG') d.classList.toggle('zoomed'); });
}
function zoomStep(delta) {
  const media = current.media; zoomIndex = (zoomIndex + delta + media.length) % media.length;
  const m = media[zoomIndex], im = $('[data-zoom-img]');
  im.src = src(m.s, 2400); im.alt = m.alt;
  $('[data-zoom-count]').textContent = `${zoomIndex + 1} / ${media.length}`;
}
document.addEventListener('keydown', (e) => {
  if ($('#zoom-dialog').open && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) zoomStep(e.key === 'ArrowRight' ? 1 : -1);
  // a search field's Escape would only clear the text; close the search instead
  if (e.key === 'Escape' && e.target.id === 'search-input') { e.preventDefault(); $('#search-dialog').close(); }
});

/* sizing sheet on the piece page */
function openSizing() {
  const d = $('#sizing-dialog');
  d.innerHTML = `<div class="sheet-head"><h2 class="display-s">Find your ring size</h2><button type="button" class="icon-btn" data-action="close-dialog" aria-label="Close sizing">${icon('close')}</button></div>
    <div class="sheet-body">${V.sizing().html.match(/<section class="calc cert"[\s\S]*?<\/section>/)[0]}
    <p class="hint">Wrap a paper strip around the base of your finger, mark where it meets, and measure the length. Or measure the inside of a ring that fits.</p>
    <a class="btn btn-ghost btn-block" href="${whatsapp(`Hello Iris Diamonds, could you help me confirm my ring size for the ${current?.piece?.title || 'ring'}?`)}" target="_blank" rel="noopener">${icon('chat')} Confirm my size with an advisor</a>
    <a class="link" href="#/guide/sizing">Full size guide and conversion table ${icon('arrow')}</a></div>`;
  openDialog(d); mountCalc(d);
}

/* seal shimmer follows the pointer, like light moving across foil */
let raf = 0;
function shimmer(x, y) {
  if (raf) return;
  raf = requestAnimationFrame(() => { raf = 0; document.documentElement.style.setProperty('--seal-a', `${Math.round((x / innerWidth) * 360 + y / 4)}deg`); });
}
if (!reduced.matches) {
  addEventListener('pointermove', (e) => shimmer(e.clientX, e.clientY), { passive: true });
  addEventListener('scroll', () => shimmer(innerWidth / 2, scrollY), { passive: true });
}

/* compact header after the first scroll */
const sentinel = document.createElement('div'); sentinel.className = 'scroll-sentinel'; document.body.prepend(sentinel);
new IntersectionObserver(([en]) => document.body.classList.toggle('scrolled', !en.isIntersecting)).observe(sentinel);

/* dialogs: close on backdrop click; light-dismiss */
$$('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

/* optional WebMCP tools (feature-detected; simulated actions only) */
if (document.modelContext?.registerTool) {
  const reg = (t) => { try { Promise.resolve(document.modelContext.registerTool(t)).catch(() => {}); } catch { /* not supported */ } };
  reg({ name: 'iris_navigate', description: 'Open a page of the Iris Diamonds concept prototype. No orders are placed.', inputSchema: { type: 'object', properties: { route: { type: 'string', description: 'e.g. /shop/rings, /piece/<id>, /bag, /checkout' } }, required: ['route'] }, execute: ({ route }) => { navigate('#' + route); return { title: document.title }; } });
  reg({ name: 'iris_add_to_simulated_bag', description: 'Add a catalog piece to the simulated bag (no purchase).', inputSchema: { type: 'object', properties: { id: { type: 'string', enum: Object.keys(byId) } }, required: ['id'] }, execute: ({ id }) => { addToBag(id); return { items: V.bagCount(state), total: money(V.totals(state)) }; } });
}

shell();
render({ transition: false });
