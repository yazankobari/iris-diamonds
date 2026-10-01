// Page views. Each returns { title, html, mount? }. Copy uses only verified Iris facts (see PRODUCT.md).
import {
  CATEGORIES, JEWELRY, METALS, PRICE_BANDS, WEIGHT_BANDS, WEIGHT_STOPS, EDITS, PORTRAITS, portraitsFor, RING_SIZES, CARAT_MM,
  BOUTIQUE, EMIRATES, pieces, jewelry, gold, byId, countIn, totalStones, money, carat, specLine, gradeSummary, whatsapp, openNow, PAGES,
} from './data.js';
import { esc, img, src, icon, seal, stoneMap, scales, leaders, specRows, metalDot, plate, microtext, certLine, irisSVG, loupeRing, rosetteSVG, waveBandSVG, dataUri } from './parts.js';
// each word rides in its own mask so the headline can rise into place on the opening
let wordIndex = 0;
const rise = (text) => text.split(' ').map((w) => `<span class="w"><span style="--wi:${wordIndex++}">${w}</span></span>`).join(' ');

/* ---------- shared fragments ---------- */
export const opt = (piece, i = 0) => piece.options[Math.min(i, piece.options.length - 1)];
const catTitle = (p) => (p.category === 'gold' ? 'Gold' : CATEGORIES[p.category].title);
const altFor = (p, o, i) => `${p.title}${o.material ? ' in ' + o.material : ''}, ${i === 0 ? 'front view' : 'second view'}`;

export function card(p, { sizes = '(min-width: 1180px) 22vw, (min-width: 760px) 30vw, 46vw', saved = false, priority = false } = {}) {
  const o = p.options[0];
  const [a, b] = o.pack;
  const metals = p.metals.length > 1 ? `<span class="card-metals" aria-label="${p.metals.length} metals: ${p.metals.map((m) => METALS[m].label).join(', ')}">${p.metals.map(metalDot).join('')}</span>` : '';
  const from = p.options.length > 1 && p.priceTo !== p.priceFrom ? 'From ' : '';
  return `<article class="card" data-id="${p.id}">
    <a class="card-link" href="#/piece/${p.id}" aria-label="${esc(p.title)}, ${from}${money(p.priceFrom)}">
      <span class="window${b ? ' has-alt' : ''}">${img(a, { alt: altFor(p, o, 0), sizes, priority })}${b ? img(b, { alt: '', sizes, cls: 'alt' }) : ''}</span>
    </a>
    <div class="card-body">
      <h3 class="card-title"><a href="#/piece/${p.id}" tabindex="-1">${esc(p.title)}</a></h3>
      <p class="card-spec">${p.category === 'gold' ? `Gold ${p.gold.purity} · ${p.gold.weight}` : specLine(o)}</p>
      <p class="card-price">${from}${money(p.priceFrom)}${metals}${o.worn[0] ? `<span class="card-worn">${img(o.worn[0], { alt: '', sizes: '48px' })}<span>Seen worn</span></span>` : ''}</p>
    </div>
    ${p.category === 'gold' ? '' : saveButton(p.id, saved, 'card-save')}
  </article>`;
}
export const saveButton = (id, saved, cls = '', text = false) =>
  `<button type="button" class="save ${cls}" data-action="save" data-id="${id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove from saved pieces' : 'Save this piece'}: ${esc(byId[id].title)}">${icon('heart')}${text ? '<span class="when-off" aria-hidden="true">Save</span><span class="when-on" aria-hidden="true">Saved</span>' : ''}</button>`;

function certificateCard(p, o, { compact = false, heading = 'h3' } = {}) {
  return `<div class="cert${compact ? ' cert-compact' : ''}">
    <div class="cert-head"><${heading} class="cert-title">${esc(p.title)}</${heading}>${seal(p.id + (o.handle || ''), compact ? 'sm' : 'md')}</div>
    ${leaders(specRows(p, o))}
  </div>`;
}

const promise = (p) => `<ul class="promise">
  <li>${icon('truck')}<span><b>Complimentary, insured UAE delivery.</b> Same day in Dubai, Abu Dhabi, Sharjah and Ajman for eligible orders placed before the daily cut-off.</span></li>
  <li>${icon('exchange')}<span><b>${p?.category === 'earrings' ? 'Earrings are final sale.' : 'Exchange within 14 days.'}</b> Exchange value up to 80% for up to 10 years, and a 6-month manufacturing warranty. <a href="#/services">Terms</a></span></li>
  <li>${icon('gem')}<span><b>Sending it as a gift?</b> Every piece arrives in a discreet, elegant box; mark it as a gift in your bag.</span></li>
</ul>`;

/* ---------- HOME ---------- */
export function home(state) {
  const hero = PORTRAITS[0];
  const heroPieces = hero.ids.map((id) => byId[id]);
  const specimens = ['lumiere-halo-diamond-ring', 'round-brilliant-solitaire-diamond-ring', 'crown-elysee-diamond-bangle', 'lumiere-royale-diamond-necklace'].map((id) => byId[id]).filter(Boolean);
  const catPick = { rings: 'majesty-diamond-ring', earrings: 'pave-diamond-hoop-earrings', necklaces: 'diamond-riviera-necklace', bracelets: 'fleur-royale-diamond-bangle' };
  const html = `
  <section class="hero hero-loupe scene" data-scene-still aria-labelledby="hero-title">
    <div class="hero-iris" aria-hidden="true">${irisSVG()}</div>
    <div class="hero-copy">
      <h1 id="hero-title" class="display-xl" aria-label="Look closer.">${(wordIndex = 0, '')}${rise('Look closer.')}</h1>
      <p class="hero-lede">Every diamond Iris sets is counted, weighed and graded. Around the lens, each mark is one stone of the piece, drawn to scale, and its record runs around the bezel.</p>
      <div class="actions">
        <a class="btn btn-primary" href="#/shop">Explore the collection ${icon('arrow')}</a>
        <a class="btn btn-ghost" href="${whatsapp('Hello Iris Diamonds, I would like some advice choosing a piece.')}" target="_blank" rel="noopener">${icon('chat')} Ask an advisor</a>
      </div>
      <p class="hero-note">Made to be remembered: lab-grown diamonds in 18K gold from a family jeweller since 1974, delivered across the UAE, the same day for eligible orders.</p>
    </div>
    <div class="lens-stage">${loupe(0)}</div>
  </section>

  ${microtext('IRIS DIAMONDS · DUBAI · SINCE 1974 · LAB-GROWN DIAMONDS · 18K GOLD')}

  <section class="index scene" aria-labelledby="index-title">
    <h2 id="index-title" class="display-l index-title">Find your piece</h2>
    <ul class="index-list" role="list">
      ${JEWELRY.map((c, i) => { const p = byId[catPick[c]]; return `<li style="--k:${i}"><a href="#/shop/${c}" class="index-link" data-preview="${src(p.options[0].pack[0], 960)}" data-preview-alt="${esc(p.title)}">
        <span class="index-name">${CATEGORIES[c].title}</span><span class="index-count">${countIn(c)} pieces</span><span class="index-line">${CATEGORIES[c].line}</span>
        <span class="index-thumb window">${img(p.options[0].pack[0], { alt: '', sizes: '96px' })}</span></a></li>`; }).join('')}
      <li style="--k:4"><a href="#/gold" class="index-link index-gold"><span class="index-name">Gold bars</span><span class="index-count">${gold.length} PAMP bars</span><span class="index-line">Lady Fortuna minted bars in 999.9 gold, priced on the day.</span></a></li>
    </ul>
    <div class="index-preview window" aria-hidden="true"><img src="${src(byId[catPick.rings].options[0].pack[0], 960)}" alt="" width="960" height="960" data-index-preview></div>
  </section>

  <section class="specimen scene" aria-labelledby="specimen-title">
    <div class="specimen-intro">
      <h2 id="specimen-title" class="display-l">Every stone, accounted for.</h2>
      <p>Iris publishes the count, weight, clarity and colour of every diamond it sets. Here each mark is one diamond, drawn to scale from its weight, beside a 1 carat reference. Choose a piece and watch the record change.</p>
      <div class="specimen-tabs" role="tablist" aria-label="Choose a piece to examine">
        ${specimens.map((p, i) => `<button role="tab" type="button" id="spec-tab-${i}" aria-controls="spec-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-specimen="${p.id}"><span>${esc(p.title.replace(/ Diamond (Ring|Necklace|Bangle)$/, ''))}</span><small>${p.options[0].stones} ${p.options[0].stones === 1 ? 'diamond' : 'diamonds'}</small></button>`).join('')}
      </div>
    </div>
    <div id="spec-panel" class="specimen-panel" role="tabpanel" aria-labelledby="spec-tab-0" aria-live="polite">${specimenPanel(specimens[0])}</div>
  </section>

  <section class="worn scene" aria-labelledby="worn-title">
    <h2 id="worn-title" class="display-l">Worn, then listed.</h2>
    <p class="worn-lede">Campaign photographs, each with the pieces Iris lists it under. Other jewelry in a photograph may not be in the online collection.</p>
    <div class="worn-grid">
      ${[PORTRAITS[0], PORTRAITS[1], PORTRAITS[3]].map((pt, i) => `<figure class="worn-item worn-${i}">
        <div class="worn-photo unveil">${img(pt.stem, { alt: pt.alt, sizes: '(min-width: 900px) 30vw, 80vw', style: `object-position:${pt.focus}` })}</div>
        <figcaption><span class="worn-label">Listed with this photograph</span>${pt.ids.map((id) => { const p = byId[id]; const o = p.options[0]; return `<a href="#/piece/${id}"><span>${esc(p.title)}</span><small>${specLine(o, { short: true })} · ${money(o.price)}</small></a>`; }).join('')}</figcaption>
      </figure>`).join('')}
    </div>
  </section>

  <section class="edits scene" aria-labelledby="edits-title">
    <div class="edits-head"><h2 id="edits-title" class="display-l">Suggested edits</h2><p>A place to start for the moments people come to Iris for. Our suggestions, from the full collection.</p></div>
    <ul class="edit-plates" role="list">
      ${EDITS.map((e) => { const lead = byId[e.ids[0]]; return `<li><a href="#/shop?edit=${e.id}" class="edit-plate">
        <span class="window">${img(lead.options[0].pack[0], { alt: '', sizes: '(min-width: 1180px) 22vw, (min-width: 760px) 44vw, 80vw' })}</span>
        <span class="edit-meta"><span class="edit-count"><b>${e.ids.length}</b> pieces</span><span class="edit-title">${e.title}</span><span class="edit-line">${e.line}</span></span></a></li>`; }).join('')}
    </ul>
  </section>

  <section class="terms plate-navy scene" aria-labelledby="terms-title">
    <div class="terms-band" aria-hidden="true"></div>
    <div class="terms-sheet">
      <div class="terms-intro">
        <h2 id="terms-title" class="display-l">The terms we keep</h2>
        <p>As Iris Diamonds publishes them, in plain words. The live terms always govern.</p>
        <div class="terms-links"><a href="#/services">All delivery and exchange terms</a><a href="${whatsapp('Hello Iris Diamonds, I have a question.')}" target="_blank" rel="noopener">Message an advisor</a><a href="#/boutique">Visit the boutique</a></div>
      </div>
      ${leaders([['Delivery', 'Complimentary and insured across the UAE'], ['Same day', 'Dubai, Abu Dhabi, Sharjah and Ajman, for eligible orders before the daily cut-off'], ['Exchange', 'Within 14 days, once per invoice; no refunds'], ['Exchange value', 'Up to 80% of the invoice toward a new piece, for up to 10 years'], ['Warranty', '6 months against manufacturing defects'], ['Advisor', 'Call or WhatsApp, daily 10 AM – 10 PM'], ['Ring size', 'Confirmed with you before any order']])}
    </div>
  </section>

  <section class="film scene scene-wide" aria-label="Look closer, a 26-second film of the collection">
    <div class="film-frame">
    <video class="film-video" data-film muted playsinline loop preload="none" poster="media/iris-look-closer-poster.webp" width="1920" height="1080" aria-label="Film: campaign photographs of the jewelry worn, two beside the records of the pieces they show">
      <source src="media/iris-look-closer.mp4?v=3" type="video/mp4">
    </video>
    <button type="button" class="icon-btn film-toggle" data-film-toggle aria-pressed="false" aria-label="Pause the film">${icon('pause')}${icon('play')}</button>
    </div>
  </section>

  <section class="heritage scene" aria-labelledby="heritage-title">
    <figure class="heritage-photo unveil">${img('ed-story', { alt: 'Stacked diamond rings in white and yellow gold worn against champagne satin', sizes: '(min-width: 900px) 34vw, 90vw' })}</figure>
    <div class="heritage-copy">
      <h2 id="heritage-title" class="display-xl heritage-years"><span>Jordan, 1974.</span><span>Dubai, today.</span></h2>
      <p>Iris Diamonds began as a family jewelry business in Jordan, rooted in precision workmanship and honest relationships with customers. Five decades on, the family serves the UAE and beyond from Dubai, with natural diamonds, lab-grown diamonds and gold jewelry.</p>
      <a class="link" href="#/story">Read the Iris story ${icon('arrow')}</a>
    </div>
  </section>

  <section class="visit scene" aria-labelledby="visit-title">
    <h2 id="visit-title" class="display-l visit-title">Al Barsha South Mall, every day until 10 PM.</h2>
    <figure class="visit-band unveil">${img('ed-shopfront', { alt: 'The Iris Diamonds boutique at Al Barsha South Mall, Dubai: a bronze shopfront with IRIS DIAMONDS lettering and lit vitrines of jewelry on navy velvet either side of the glass doors', sizes: '(min-width: 1320px) 1280px, 100vw' })}</figure>
    <div class="visit-plate cert">
      <div><p class="open-now ${openNow().open ? 'is-open' : ''}" data-open-now>${openNow().text}</p><p class="visit-lines">${BOUTIQUE.lines.join('<br>')}</p></div>
      ${leaders([['Hours', BOUTIQUE.hours], ['Call or WhatsApp', `<a href="${BOUTIQUE.tel}">${BOUTIQUE.phone}</a>`], ['Email', `<a href="mailto:${BOUTIQUE.email}">${BOUTIQUE.email}</a>`]])}
      <div class="visit-actions"><a class="btn btn-ghost" href="${BOUTIQUE.map}" target="_blank" rel="noopener">${icon('pin')} Directions</a><a class="btn btn-ghost" href="#/boutique">About the boutique</a></div>
    </div>
  </section>`;
  return { title: 'Iris Diamonds · Made to be remembered', html, mount: mountHome };
}

// The loupe turns through these pieces (listing option in brackets): one stone, dozens, ninety-one.
export const LOUPE = [['pave-diamond-hoop-earrings', 0], ['round-brilliant-solitaire-diamond-ring', 3], ['lumiere-royale-diamond-necklace', 0], ['majesty-diamond-ring', 0], ['crown-elysee-diamond-bangle', 0], ['fleur-royale-diamond-bangle', 0]].filter(([id]) => byId[id]);
export function loupeFrame(i) {
  const [id, k] = LOUPE[i], p = byId[id], o = opt(p, k), href = `#/piece/${id}${k ? '?o=' + k : ''}`;
  return `<div class="lens-frame" data-i="${i}">
    <figure class="lens-glass">
      ${loupeRing(o, 'lp-' + i)}
      <a class="lens-disc" href="${href}" aria-label="${esc(p.title)}, ${money(o.price)}">${img(o.pack[0], { alt: altFor(p, o, 0), sizes: '(min-width: 761px) 30vw, 60vw', priority: i === 0, lazy: false })}</a>
    </figure>
    <div class="lens-caption"><p class="lens-name"><a href="${href}">${esc(p.title)}</a></p><p class="lens-spec">${specLine(o)}\u00a0· ${money(o.price)}</p></div>
  </div>`;
}
export function loupe(i) {
  return `<div class="lens" data-lens aria-roledescription="carousel" aria-label="Pieces under the loupe">
    <div class="lens-live" aria-live="off">${loupeFrame(i)}</div>
    <div class="lens-controls">
      <button type="button" class="icon-btn" data-lens-step="-1" aria-label="Previous piece">${icon('back')}</button>
      <span class="lens-index"><b data-lens-index>${String(i + 1).padStart(2, '0')}</b> / ${String(LOUPE.length).padStart(2, '0')}</span>
      <button type="button" class="icon-btn" data-lens-step="1" aria-label="Next piece">${icon('arrow')}</button>
      <button type="button" class="icon-btn lens-play" data-lens-play aria-pressed="false" aria-label="Pause the turning lens">${icon('pause')}${icon('play')}</button>
    </div>
  </div>`;
}

export function specimenPanel(p) {
  const o = p.options[0];
  return `<div class="specimen-object window">${img(o.pack[0], { alt: altFor(p, o, 0), sizes: '(min-width: 900px) 30vw, 80vw' })}</div>
    <div class="specimen-record">
      <p class="specimen-number"><span class="num">${o.stones}</span> <span>${o.stones === 1 ? 'diamond' : 'diamonds'}</span><span class="num">${carat(o.carats).replace(' ct', '')}</span> <span>carats in total</span></p>
      ${stoneMap(o)}
      ${scales(o)}
      <a class="link" href="#/piece/${p.id}">${esc(p.title)}, ${money(o.price)} ${icon('arrow')}</a>
    </div>`;
}

function mountHome(root) {
  // index preview follows hover/focus (desktop); thumbnails carry it on small screens
  const prev = root.querySelector('[data-index-preview]');
  const first = root.querySelector('.index-link[data-preview]');
  if (prev && first) { prev.src = first.dataset.preview; prev.alt = ''; }
  root.querySelectorAll('.index-link[data-preview]').forEach((a) => {
    const show = () => { prev.src = a.dataset.preview; root.querySelector('.index').dataset.active = a.getAttribute('href'); };
    a.addEventListener('pointerenter', show); a.addEventListener('focus', show);
  });
}

/* ---------- SHOP ---------- */
const SORTS = [
  ['featured', 'Featured'], ['price-asc', 'Price, low to high'], ['price-desc', 'Price, high to low'], ['weight-desc', 'Carat weight, high to low'], ['stones-desc', 'Most diamonds'],
];
export function parseFilters(q) {
  const list = (k) => (q.get(k) || '').split(',').filter(Boolean);
  const num = (k, d) => (q.has(k) && !Number.isNaN(parseFloat(q.get(k))) ? parseFloat(q.get(k)) : d);
  return { cat: list('cat'), metal: list('metal'), price: list('price'), weight: list('weight'), wmin: num('wmin', 0), wmax: num('wmax', Infinity), edit: q.get('edit') || '', sort: q.get('sort') || 'featured', q: q.get('q') || '' };
}
export function applyFilters(f, base) {
  let out = base.filter((p) => {
    const o = p.options;
    if (f.cat.length && !f.cat.includes(p.category)) return false;
    if (f.metal.length && !p.metals.some((m) => f.metal.includes(m))) return false;
    if (f.price.length && !PRICE_BANDS.filter((b) => f.price.includes(b.id)).some((b) => o.some((x) => x.price >= b.min && x.price <= b.max))) return false;
    if (f.weight.length && !WEIGHT_BANDS.filter((b) => f.weight.includes(b.id)).some((b) => o.some((x) => x.carats >= b.min && x.carats <= b.max))) return false;
    if ((f.wmin > 0 || f.wmax < Infinity) && !o.some((x) => x.carats >= f.wmin && x.carats <= f.wmax)) return false;
    if (f.edit) { const e = EDITS.find((x) => x.id === f.edit); if (e && !e.ids.includes(p.id)) return false; }
    if (f.q && !f.q.toLowerCase().split(/\s+/).every((w) => p.search.includes(w.replace(/s$/, '')))) return false;
    return true;
  });
  const by = { 'price-asc': (a, b) => a.priceFrom - b.priceFrom, 'price-desc': (a, b) => b.priceFrom - a.priceFrom, 'weight-desc': (a, b) => b.options[0].carats - a.options[0].carats, 'stones-desc': (a, b) => b.options[0].stones - a.options[0].stones };
  if (by[f.sort]) out = [...out].sort(by[f.sort]);
  else if (f.edit) { const e = EDITS.find((x) => x.id === f.edit); out = [...out].sort((a, b) => e.ids.indexOf(a.id) - e.ids.indexOf(b.id)); }
  return out;
}
export function readout(list) {
  if (!list.length) return 'No pieces match';
  const cts = list.map((p) => p.options[0].carats), prices = list.flatMap((p) => p.options.map((o) => o.price));
  const lo = Math.min(...cts), hi = Math.max(...cts);
  return `${list.length} ${list.length === 1 ? 'piece' : 'pieces'} · ${lo === hi ? carat(lo) : `${lo.toFixed(2)} – ${carat(hi)}`} · ${money(Math.min(...prices))}${list.length > 1 ? ` – ${money(Math.max(...prices)).replace('AED ', '')}` : ''}`;
}
function facet(name, label, options, chosen, type = 'checkbox') {
  return `<fieldset class="facet" data-facet="${name}"><legend>${label}</legend>${options.map(([v, l, extra = '']) => `<label class="check${type === 'radio' ? ' check-radio' : ''}"><input type="${type}" name="${name}" value="${v}" ${chosen.includes(v) ? 'checked' : ''}><span class="check-box" aria-hidden="true"></span><span class="check-label">${l}</span>${extra}<small class="check-count" data-count="${name}:${v}"></small></label>`).join('')}</fieldset>`;
}
// how many pieces each option would show, given every other active filter (OR within a facet)
export function facetCounts(f, base) {
  const out = {};
  const add = (name, values) => values.forEach((v) => { out[`${name}:${v}`] = applyFilters({ ...f, [name]: name === 'edit' ? v : [v], sort: 'featured' }, base).length; });
  add('cat', JEWELRY); add('metal', Object.keys(METALS)); add('price', PRICE_BANDS.map((b) => b.id));
  EDITS.forEach((e) => { out[`edit:${e.id}`] = applyFilters({ ...f, edit: e.id, sort: 'featured' }, base).length; });
  out['edit:'] = applyFilters({ ...f, edit: '', sort: 'featured' }, base).length;
  return out;
}
export function shop(state, { cat, query }) {
  const f = parseFilters(query);
  if (cat) f.cat = [cat];
  const base = jewelry;
  const list = applyFilters(f, base);
  const meta = cat ? CATEGORIES[cat] : null;
  const edit = EDITS.find((e) => e.id === f.edit);
  const title = meta ? meta.title : edit ? edit.title : f.q ? `Results for “${esc(f.q)}”` : 'The collection';
  const line = meta ? meta.line : edit ? `${edit.line} A suggested edit.` : `${jewelry.length} pieces of lab-grown diamond jewelry in 18K gold, each with its full specification.`;
  const html = `
  <section class="shop-head${meta ? ' has-hero' : ''}">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">/</span>${meta || edit ? `<a href="#/shop">Collection</a><span aria-hidden="true">/</span><span aria-current="page">${meta ? meta.title : edit.title}</span>` : '<span aria-current="page">Collection</span>'}</nav>
    <h1 class="display-l">${title}</h1>
    <p class="shop-line">${line}</p>
    ${meta ? `<figure class="shop-hero">${img(meta.hero, { alt: '', sizes: '(min-width: 900px) 22vw, 40vw' })}</figure>` : ''}
  </section>
  <nav class="cat-chips" aria-label="Categories"><a href="#/shop" class="chip" ${!cat && !f.edit && !f.q ? 'aria-current="page"' : ''}>All jewelry <small>${jewelry.length}</small></a>${JEWELRY.map((c) => `<a href="#/shop/${c}" class="chip" ${cat === c ? 'aria-current="page"' : ''}>${CATEGORIES[c].title} <small>${countIn(c)}</small></a>`).join('')}<a href="#/gold" class="chip">Gold bars <small>${gold.length}</small></a></nav>
  <div class="shop-bar">
    <button type="button" class="btn btn-ghost btn-filters" data-action="open-filters" aria-controls="filters-dialog">${icon('filter')} More filters<span class="filter-count" data-filter-count></span></button>
    <p class="readout" aria-live="polite" data-readout>${readout(list)}</p>
    <label class="sort"><span>Sort</span><select data-sort>${SORTS.map(([v, l]) => `<option value="${v}" ${f.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${icon('chevron')}</label>
  </div>
  ${weightScale(f)}
  <div class="shop-layout">
    <aside class="filters-rail" aria-label="More filters"><form class="filters" data-filters>${filtersForm(f, !!cat)}</form></aside>
    <div class="shop-results">
      <div class="applied" data-applied>${appliedChips(f, !!cat)}</div>
      <div class="grid" data-grid>${gridHTML(list, state, f)}</div>
    </div>
  </div>
  <dialog id="filters-dialog" class="sheet" aria-labelledby="filters-dialog-title">
    <div class="sheet-head"><h2 id="filters-dialog-title">More filters</h2><button type="button" class="icon-btn" data-action="close-dialog" aria-label="Close filters">${icon('close')}</button></div>
    <form class="filters" data-filters data-sheet>${filtersForm(f, !!cat)}</form>
    <div class="sheet-foot"><button type="button" class="btn btn-ghost" data-action="clear-filters">Clear all</button><button type="button" class="btn btn-primary" data-action="close-dialog" data-show-count>Show ${list.length} pieces</button></div>
  </dialog>`;
  return { title: `${meta ? meta.title : edit ? edit.title : 'The collection'} · Iris Diamonds`, html, filters: f, cat };
}
export function filtersForm(f, catLocked) {
  const parts = [
    facet('edit', 'Occasion', [['', 'Any occasion'], ...EDITS.map((e) => [e.id, e.title])], [f.edit], 'radio'),
    !catLocked && facet('cat', 'Category', JEWELRY.map((c) => [c, CATEGORIES[c].title]), f.cat),
    facet('metal', 'Metal', Object.values(METALS).map((m) => [m.id, m.label, `<span class="metal-dot" style="--swatch:${m.swatch}"></span>`]), f.metal),
    facet('price', 'Price', PRICE_BANDS.map((b) => [b.id, b.label]), f.price),
  ];
  return parts.filter(Boolean).join('') + `<p class="facet-note">${icon('gem')} <span>Every piece online is set with <b>lab-grown diamonds</b>. Natural diamonds can be seen at the boutique. <a href="#/guide">About lab-grown diamonds</a></span></p>`;
}
export function chipList(f, catLocked) {
  const chips = [];
  if (f.edit) { const e = EDITS.find((x) => x.id === f.edit); if (e) chips.push(['edit', f.edit, e.title]); }
  if (!catLocked) f.cat.forEach((c) => chips.push(['cat', c, CATEGORIES[c]?.title]));
  f.metal.forEach((m) => chips.push(['metal', m, METALS[m]?.label]));
  f.price.forEach((p) => chips.push(['price', p, PRICE_BANDS.find((b) => b.id === p)?.label]));
  f.weight.forEach((w) => chips.push(['weight', w, WEIGHT_BANDS.find((b) => b.id === w)?.label]));
  if (f.wmin > 0 || f.wmax < Infinity) chips.push(['wrange', '', weightLabel(f)]);
  return chips;
}
export const weightLabel = (f) => (f.wmax === Infinity ? `${fmtCt(f.wmin)} ct and over` : f.wmin > 0 ? `${fmtCt(f.wmin)} – ${fmtCt(f.wmax)} ct` : `Up to ${fmtCt(f.wmax)} ct`);
const fmtCt = (n) => ({ 0.25: '¼', 0.5: '½', 0.75: '¾', 1.5: '1½' }[n] || String(n));
// The collection's instrument: one total-weight scale, drawn like the grading scales, remaps the grid live.
export function weightScale(f) {
  const n = WEIGHT_STOPS.length - 1;
  const lo = Math.max(0, WEIGHT_STOPS.findIndex((v) => v >= f.wmin));
  const hiRaw = f.wmax === Infinity ? n : WEIGHT_STOPS.findIndex((v) => v >= f.wmax);
  const hi = hiRaw < 0 ? n : hiRaw;
  return `<div class="wscale" data-wscale style="--lo:${lo};--hi:${hi};--n:${n}">
    <div class="wscale-head"><span id="wscale-label">Total diamond weight</span><output data-wscale-out>${f.wmin > 0 || f.wmax < Infinity ? weightLabel(f) : 'Any weight'}</output></div>
    <div class="wscale-track">
      <ol class="wscale-ticks" aria-hidden="true">${WEIGHT_STOPS.map((v, i) => `<li class="${(lo > 0 || hi < n) && i >= lo && i <= hi ? 'on' : ''}">${i === n ? '10+' : fmtCt(v)}</li>`).join('')}</ol>
      <input type="range" min="0" max="${n}" step="1" value="${lo}" data-wmin aria-label="Minimum total diamond weight" aria-valuetext="${fmtCt(WEIGHT_STOPS[lo])} carats">
      <input type="range" min="0" max="${n}" step="1" value="${hi}" data-wmax aria-label="Maximum total diamond weight" aria-valuetext="${hi === n ? 'no maximum' : fmtCt(WEIGHT_STOPS[hi]) + ' carats'}">
    </div>
  </div>`;
}
export function appliedChips(f, catLocked) {
  const chips = chipList(f, catLocked);
  if (!chips.length) return '';
  return chips.map(([k, v, l]) => `<button type="button" class="chip chip-on" data-action="remove-filter" data-key="${k}" data-value="${v}" aria-label="Remove filter: ${esc(l)}">${esc(l)} ${icon('close')}</button>`).join('') + `<button type="button" class="link link-quiet" data-action="clear-filters">Clear all</button>`;
}
export function gridHTML(list, state, f, last) {
  if (!list.length) {
    const near = applyFilters({ ...f, price: [], weight: [], wmin: 0, wmax: Infinity }, jewelry).slice(0, 4);
    return `<div class="empty">
      <h2 class="display-m">${f.q ? `Nothing matches “${esc(f.q)}”${f.metal.length || f.price.length || f.weight.length ? ' with these filters' : ''}.` : 'Nothing matches all of those filters.'}</h2>
      <p>Remove the last filter, try a category, or ask a Client Advisor, who can tell you what is in the boutique today.</p>
      <div class="actions">${last ? `<button type="button" class="btn btn-primary" data-action="remove-filter" data-key="${last[0]}" data-value="${last[1]}">Remove “${esc(last[2])}”</button>` : ''}<button type="button" class="btn btn-ghost" data-action="clear-filters">Clear all filters</button></div>
      <div class="search-quick empty-cats">${JEWELRY.map((c) => `<a class="chip" href="#/shop/${c}">${CATEGORIES[c].title}</a>`).join('')}</div>
      <p class="empty-help">${icon('chat')} <a href="${whatsapp('Hello Iris Diamonds, I am looking for a piece I could not find online.')}" target="_blank" rel="noopener">WhatsApp an advisor</a> or call <a href="${BOUTIQUE.tel}">${BOUTIQUE.phone}</a></p>
      ${near.length ? `<h3 class="empty-near">Close to what you asked for</h3><div class="grid grid-near">${near.map((p) => card(p, { saved: state.saved.includes(p.id) })).join('')}</div>` : ''}
    </div>`;
  }
  const out = list.map((p, i) => card(p, { saved: state.saved.includes(p.id), priority: i < 4 }));
  if (list.length > 9 && !f.edit) {
    const pt = PORTRAITS[1];
    out.splice(6, 0, `<figure class="pane"><div class="pane-photo">${img(pt.stem, { alt: pt.alt, sizes: '(min-width: 1180px) 44vw, 90vw', style: `object-position:${pt.focus}` })}</div><figcaption>${pt.ids.map((id) => `<a href="#/piece/${id}">${esc(byId[id].title)}</a>`).join('')}</figcaption></figure>`);
  }
  return out.join('');
}

/* ---------- PIECE ---------- */
export function piece(state, { id, query }) {
  const p = byId[id];
  if (!p) return notFound();
  if (p.category === 'gold') return goldPiece(state, p, query);
  const oi = Math.max(0, Math.min(p.options.length - 1, Number(query.get('o') || 0)));
  const o = p.options[oi];
  const isRing = p.category === 'rings';
  const saved = state.saved.includes(p.id);
  const portraits = portraitsFor(p.id);
  const media = [...o.pack.map((s, i) => ({ s, alt: altFor(p, o, i), kind: 'pack' })), ...o.worn.map((s) => ({ s, alt: PORTRAITS.find((x) => x.stem === s)?.alt || `${p.title}, worn`, kind: 'worn' }))];
  const pairs = [...new Set(portraits.flatMap((x) => x.ids))].filter((x) => x !== p.id).map((x) => byId[x]);
  const similar = jewelry.filter((x) => x.category === p.category && x.id !== p.id).sort((a, b) => Math.abs(a.priceFrom - o.price) - Math.abs(b.priceFrom - o.price)).slice(0, 4 - Math.min(2, pairs.length));
  const more = [...pairs.slice(0, 2), ...similar].slice(0, 4);
  const size = state.draftSize?.[p.id] || '';
  const html = `
  <nav class="crumbs crumbs-piece" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">/</span><a href="#/shop/${p.category}">${catTitle(p)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav>
  <section class="piece" data-piece="${p.id}" data-option="${oi}">
    <div class="gallery" data-gallery>
      <div class="stage window" data-stage>
        <button type="button" class="stage-btn" data-action="zoom" data-index="0" aria-label="Open a larger view of ${esc(p.title)}">
          ${img(media[0].s, { alt: media[0].alt, sizes: '(min-width: 1000px) 52vw, 100vw', priority: true, lazy: false, cls: 'stage-img' })}
        </button>
        <span class="loupe" aria-hidden="true"></span>
      </div>
      <div class="rail-row">
      <div class="rail" role="list" aria-label="${media.length} photographs">
        ${media.map((m, i) => `<button type="button" role="listitem" class="thumb window${m.kind === 'worn' ? ' is-worn' : ''}" data-action="show-media" data-index="${i}" aria-label="Photograph ${i + 1} of ${media.length}${m.kind === 'worn' ? ', worn' : ''}" aria-current="${i === 0}">${img(m.s, { alt: '', sizes: '96px' })}</button>`).join('')}
      </div>
      <p class="stage-hint" aria-hidden="true">${icon('zoom')} Hover to examine · click to enlarge</p>
      </div>
      <ol class="swipe" aria-label="Photographs, swipe to see more">${media.map((m, i) => `<li><button type="button" class="swipe-item window${m.kind === 'worn' ? ' is-worn' : ''}" data-action="zoom" data-index="${i}" aria-label="Enlarge photograph ${i + 1} of ${media.length}">${img(m.s, { alt: m.alt, sizes: '92vw', priority: i === 0, lazy: i > 0 })}</button></li>`).join('')}</ol>
      <div class="swipe-foot"><div class="swipe-thumbs" role="list" aria-label="Choose a photograph">${media.map((m, i) => `<button type="button" role="listitem" class="thumb window${m.kind === 'worn' ? ' is-worn' : ''}" data-action="swipe-to" data-index="${i}" aria-label="Show photograph ${i + 1} of ${media.length}${m.kind === 'worn' ? ', worn' : ''}" aria-current="${i === 0}">${img(m.s, { alt: '', sizes: '64px' })}</button>`).join('')}</div><p class="swipe-count" aria-hidden="true"><span data-swipe-index>1</span> / ${media.length} · tap to zoom</p></div>
    </div>

    <div class="buy">
      <h1 class="display-m piece-title">${esc(p.title)}</h1>
      <p class="piece-price" data-price>${money(o.price)}</p>
      <p class="piece-summary">${specLine(o)} <a href="#record-title" class="summary-link">The record</a></p>
      <div class="plates">${plate('Lab-grown diamonds')}${plate('Official photographs')}</div>

      ${p.options.length > 1 ? `<fieldset class="choice" data-choice>
        <legend>${p.metals.length > 1 ? 'Metal' : 'Weight'} <span class="choice-now">${esc(o.label)}</span></legend>
        <div class="choice-options">${p.options.map((x, i) => `<label class="option${x.metal ? '' : ' option-text'}"><input type="radio" name="option" value="${i}" ${i === oi ? 'checked' : ''} data-action="choose-option"><span class="option-face">${x.metal ? metalDot(x.metal) : ''}<span class="option-label">${esc(x.label)}</span><span class="option-price">${money(x.price)}</span></span></label>`).join('')}</div>
      </fieldset>` : ''}

      ${isRing ? `<fieldset class="choice" data-size-choice>
        <legend>Ring size <span class="choice-now" data-size-now>${size ? 'US ' + size : 'Optional'}</span></legend>
        <div class="sizes">${RING_SIZES.filter((s) => !s.us.includes('.')).map((s) => `<label class="size"><input type="radio" name="size" value="${s.us}" ${size === s.us ? 'checked' : ''} data-action="choose-size"><span>${s.us}</span></label>`).join('')}<label class="size size-unsure"><input type="radio" name="size" value="" ${!size ? 'checked' : ''} data-action="choose-size"><span>Not sure</span></label></div>
        <p class="hint">${icon('ruler')} <a href="#/guide/sizing" data-action="open-sizing">Find your size</a>. The Iris team confirms your ring size with you before your order.</p>
      </fieldset>` : ''}

      <div class="buy-actions">
        <button type="button" class="btn btn-primary btn-block" data-action="add" data-id="${p.id}">${icon('bag')} Add to bag</button>
        ${saveButton(p.id, saved, 'btn btn-ghost btn-save', true)}
      </div>
      <div class="help-row">
        <a class="advisor-link" href="${whatsapp(`Hello Iris Diamonds, I would like to ask about the ${p.title}${o.label ? ' (' + o.label + ')' : ''}.`)}" target="_blank" rel="noopener">${icon('chat')} Ask about this piece</a>
        <a class="advisor-link" href="${whatsapp(`Hello Iris Diamonds, I would like to see the ${p.title}${o.label ? ' (' + o.label + ')' : ''} at the Al Barsha South Mall boutique.`)}" target="_blank" rel="noopener">${icon('pin')} See it at the boutique</a>
      </div>
      ${promise(p)}

      <div class="accordion">
        <details><summary>As listed by Iris Diamonds ${icon('plus')}</summary><div><p>${esc(o.description)}</p><p><a class="link" href="${o.url}" target="_blank" rel="noopener">View this listing on irisdiamonds.ae</a></p></div></details>
        <details><summary>Delivery ${icon('plus')}</summary><div><p>Complimentary delivery across the UAE. Orders placed before the daily cut-off are eligible for same-day delivery in Dubai, Abu Dhabi, Sharjah and Ajman, and in other UAE cities subject to location. Every delivery is fully insured, packed in a discreet, elegant box and handled by trusted couriers; the team contacts you to confirm the delivery time.</p></div></details>
        <details><summary>Exchange and buy-back ${icon('plus')}</summary><div><p>Exchange within 14 days of delivery, once per invoice, for unworn pieces returned with the invoice and certification; refunds are not offered. Eligible jewelry can be exchanged for up to 80% of its original invoice value toward another Iris piece for up to 10 years. ${p.category === 'earrings' ? 'Earrings are final sale unless a manufacturing defect is confirmed.' : ''}</p><p><a class="link" href="#/services">All services and terms</a></p></div></details>
        ${isRing ? `<details><summary>Sizing ${icon('plus')}</summary><div><p>Measure a ring that fits, or your finger, at the end of the day. If you fall between sizes, choose the larger. Resized items are final sale, so the team confirms your size with you before your order.</p><p><a class="link" href="#/guide/sizing">Ring size guide and calculator</a></p></div></details>` : ''}
      </div>
    </div>
  </section>

  <section class="record scene" aria-labelledby="record-title">
    <div class="record-sheet cert">
      <div class="record-head"><h2 id="record-title" class="display-m">The record</h2>${seal(p.id + o.handle, 'lg')}</div>
      <div class="record-grid">
        <div class="record-map">${stoneMap(o)}</div>
        <div class="record-data">${leaders(specRows(p, o))}${scales(o)}
          <details class="explain"><summary>What these grades mean ${icon('plus')}</summary><dl>
            <div><dt>Lab-grown</dt><dd>Real diamond, grown in a laboratory; visually identical to a natural diamond.</dd></div>
            <div><dt>${esc(gradeSummary(o).clarity)}</dt><dd>Clarity. VVS is very, very slightly included and VS very slightly included: inclusions generally need magnification to be seen. SI is slightly included.</dd></div>
            <div><dt>${esc(gradeSummary(o).colour)}</dt><dd>Colour, on the D (colourless) to Z scale. Iris lists it on the EW scale: ${esc(o.specs[0]?.colourScale || 'EW+ (D) – EW (E)')}.</dd></div>
            <div><dt>ct</dt><dd>Carat, the weight of a diamond: one carat is 0.2 grams. Shown as an approximate total for each group of stones.</dd></div>
            <div><dt>18K</dt><dd>18 karat gold: 75% pure gold, alloyed for strength and colour.</dd></div>
          </dl><a class="link" href="#/guide">The full diamond guide ${icon('arrow')}</a></details>
          <p class="record-note">Grades and weights as published by Iris Diamonds for this listing.</p>
        </div>
      </div>
      ${certLine(`IRIS DIAMONDS · RECORD AS LISTED · 1 OCT 2026 · ${(o.material || '').toUpperCase()}`)}
    </div>
  </section>

  ${portraits.length ? `<section class="seen" aria-labelledby="seen-title"><h2 id="seen-title" class="display-m">Seen in the campaign</h2><div class="seen-grid">${portraits.map((pt) => `<figure>${img(pt.stem, { alt: pt.alt, sizes: '(min-width: 900px) 40vw, 90vw', style: `object-position:${pt.focus}` })}<figcaption><span class="worn-label">Listed with this photograph</span> ${pt.ids.map((x) => `<a href="#/piece/${x}">${esc(byId[x].title)}</a>`).join(' · ')}</figcaption></figure>`).join('')}</div></section>` : ''}

  <section class="more scene" aria-labelledby="more-title">
    <h2 id="more-title" class="display-m">${pairs.length ? 'Worn with, and close to it' : `More ${catTitle(p).toLowerCase()} near this price`}</h2>
    <div class="grid grid-4">${more.map((x) => card(x, { saved: state.saved.includes(x.id) })).join('')}</div>
  </section>

  <div class="buybar" data-buybar aria-hidden="true">
    <span class="buybar-text"><b>${esc(p.title)}</b><span><span data-price>${money(o.price)}</span><span data-buybar-size>${size ? ` · size US ${size}` : ''}</span></span></span>
    <button type="button" class="btn btn-primary" data-action="add" data-id="${p.id}" tabindex="-1">Add to bag</button>
  </div>`;
  return { title: `${p.title} · Iris Diamonds`, html, media, piece: p, option: oi };
}

function goldPiece(state, p, query) {
  const o = p.options[0];
  const media = o.pack.map((s, i) => ({ s, alt: `${p.title}, ${i === 0 ? 'front' : 'reverse and certificate'} view`, kind: 'pack' }));
  const html = `
  <nav class="crumbs crumbs-piece" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">/</span><a href="#/gold">Gold bars</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.gold.weight)}</span></nav>
  <section class="piece piece-gold" data-piece="${p.id}" data-option="0">
    <div class="gallery" data-gallery>
      <div class="stage window" data-stage><button type="button" class="stage-btn" data-action="zoom" data-index="0" aria-label="Open a larger view">${img(media[0].s, { alt: media[0].alt, sizes: '(min-width: 1000px) 44vw, 100vw', priority: true, lazy: false, cls: 'stage-img' })}</button><span class="loupe" aria-hidden="true"></span></div>
      <div class="rail" role="list" aria-label="${media.length} photographs">${media.map((m, i) => `<button type="button" role="listitem" class="thumb window" data-action="show-media" data-index="${i}" aria-label="Photograph ${i + 1} of ${media.length}" aria-current="${i === 0}">${img(m.s, { alt: '', sizes: '96px' })}</button>`).join('')}</div>
      <ol class="swipe" aria-label="Photographs">${media.map((m, i) => `<li><button type="button" class="swipe-item window" data-action="zoom" data-index="${i}" aria-label="Enlarge photograph ${i + 1}">${img(m.s, { alt: m.alt, sizes: '92vw', lazy: i > 0 })}</button></li>`).join('')}</ol>
    </div>
    <div class="buy">
      <h1 class="display-m piece-title">${esc(p.title.replace(/ - .*$/, ''))}</h1>
      <p class="piece-price">${money(o.price)} <small>reference price, 1 Oct 2026</small></p>
      <p class="piece-summary">Gold prices move through the day. The team confirms today's price before any order.</p>
      <div class="plates">${plate('PAMP Suisse')}${plate('Gold ' + esc(p.gold.purity || '999.9'))}</div>
      ${leaders(specRows(p, o))}
      <div class="buy-actions">
        <a class="btn btn-primary btn-block" href="${whatsapp(`Hello Iris Diamonds, may I have today's price for the ${p.title}?`)}" target="_blank" rel="noopener">${icon('chat')} Ask for today's price</a>
        <button type="button" class="btn btn-ghost btn-block" data-action="add" data-id="${p.id}">${icon('bag')} Add to bag at reference price</button>
      </div>
      <p class="hint">Cash buy-back and exchange programs apply to jewelry only, not to bullion.</p>
    </div>
  </section>`;
  return { title: `${p.title} · Iris Diamonds`, html, media, piece: p, option: 0 };
}

/* ---------- GOLD ---------- */
export function goldPage(state) {
  // each bar is photographed on black; the card shows the bar itself
  const bar = (p) => p.options[0].pack.find((x) => /^\d[\d-]*g-1$|1oz-obv$/.test(x)) || p.options[0].pack[0];
  const html = `
  <section class="gold-hero scene">
    <div class="gold-hero-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Gold bars</span></nav>
      <h1 class="display-xl">Gold bars</h1>
      <p class="lede">PAMP Suisse Lady Fortuna minted bars in 999.9 fine gold, from 1 gram to 100 grams. Prices change with the market; the team confirms today's price on WhatsApp.</p>
      <div class="actions"><a class="btn btn-primary" href="${whatsapp("Hello Iris Diamonds, I would like today's price for a gold bar.")}" target="_blank" rel="noopener">${icon('chat')} Ask for today's price</a></div>
    </div>
    <figure class="gold-hero-photo unveil">${img('pamp-gold-fortuna-1oz-rev', { alt: 'The reverse of a PAMP Suisse Lady Fortuna minted gold bar', sizes: '(min-width: 1025px) 42vw, 90vw', priority: true, lazy: false })}</figure>
  </section>
  <section class="bullion-scene" aria-labelledby="bars-title">
    <h2 id="bars-title" class="display-m">${gold.length} bars, ${esc(gold[0].gold.weight.toLowerCase())} to ${esc(gold[gold.length - 1].gold.weight.toLowerCase())}</h2>
    <div class="bullion">${gold.map((p) => { const o = p.options[0]; return `<a class="bar-card" href="#/piece/${p.id}">
      <span class="bar-photo">${img(bar(p), { alt: `${p.title}, front`, sizes: '(min-width: 1025px) 22vw, 45vw' })}</span>
      <span class="bar-weight display-m">${esc(p.gold.weight)}</span>
      <span class="bar-spec">Gold ${esc(p.gold.purity)}${p.gold.size ? ` · ${esc(p.gold.size)} mm` : ''}${p.gold.thickness ? ` · ${esc(p.gold.thickness)} thick` : ''}</span>
      <span class="bar-price">${money(o.price)} <small>reference</small></span></a>`; }).join('')}</div>
  </section>`;
  return { title: 'Gold bars · Iris Diamonds', html };
}

/* ---------- SAVED ---------- */
export function savedPage(state) {
  const list = state.saved.map((id) => byId[id]).filter(Boolean);
  const share = list.map((p) => `${p.title}, ${money(p.priceFrom)}`).join('\n');
  const html = `
  <section class="page-head"><h1 class="display-l">Saved pieces</h1>
    <p class="shop-line">${list.length ? `${list.length} ${list.length === 1 ? 'piece' : 'pieces'} kept on this device. Send the list to someone, or to an advisor.` : 'Tap the heart on any piece to keep it here. Saved pieces stay on this device.'}</p>
    ${list.length ? `<div class="actions"><a class="btn btn-ghost" href="https://wa.me/?text=${encodeURIComponent('Pieces I saved at Iris Diamonds:\n' + share)}" target="_blank" rel="noopener">${icon('share')} Send the list on WhatsApp</a><a class="btn btn-ghost" href="${whatsapp('Hello Iris Diamonds, I would like advice on these pieces:\n' + share)}" target="_blank" rel="noopener">${icon('chat')} Ask an advisor about them</a></div>` : ''}
  </section>
  ${list.length ? `<div class="grid grid-4">${list.map((p) => card(p, { saved: true })).join('')}</div>` : emptyState('Nothing saved yet', 'Start with a suggested edit, or browse the full collection.')}`;
  if (!list.length) return { title: 'Saved pieces · Iris Diamonds', html: `
  <section class="saved-empty scene">
    <div class="saved-empty-copy">
      <h1 class="display-xl">Saved pieces</h1>
      <p class="lede">Tap the heart on any piece to keep it here. Saved pieces stay on this device.</p>
      ${emptyState('Nothing saved yet', 'Start with a suggested edit, or browse the full collection.')}
    </div>
    <figure class="saved-empty-photo unveil">${img('ed-ring-edit', { alt: 'A diamond necklace and stacked rings worn with a satin bodice, hands resting at the collarbone', sizes: '(min-width: 1025px) 36vw, 80vw', lazy: false })}</figure>
  </section>` };
  return { title: 'Saved pieces · Iris Diamonds', html };
}
function emptyState(title, line) {
  return `<div class="empty empty-page"><h2 class="display-m">${title}</h2><p>${line}</p>
    <ul class="empty-edits" role="list">${EDITS.map((e) => `<li><a href="#/shop?edit=${e.id}" class="chip">${e.title}</a></li>`).join('')}</ul>
    <a class="btn btn-primary" href="#/shop">Explore the collection ${icon('arrow')}</a></div>`;
}

/* ---------- BAG ---------- */
export function bagLines(state, { editable = true } = {}) {
  return state.bag.map((it) => {
    const p = byId[it.id]; if (!p) return '';
    const o = opt(p, it.opt);
    const sizeLine = p.category === 'rings' ? `<span class="line-meta">${it.size ? `Ring size US ${it.size}, to confirm with the team` : 'Ring size to confirm with the team'}</span>` : '';
    return `<li class="line" data-key="${it.key}">
      <a class="line-thumb window" href="#/piece/${p.id}${it.opt ? '?o=' + it.opt : ''}" tabindex="-1">${img(o.pack[0], { alt: '', sizes: '96px' })}</a>
      <div class="line-body">
        <a class="line-name" href="#/piece/${p.id}${it.opt ? '?o=' + it.opt : ''}">${esc(p.title)}</a>
        <span class="line-meta">${p.category === 'gold' ? `Gold ${esc(p.gold.purity)} · reference price` : specLine(o)}</span>
        ${sizeLine}
        ${editable ? `<div class="line-tools">
          <div class="stepper" role="group" aria-label="Quantity of ${esc(p.title)}">
            <button type="button" class="icon-btn" data-action="qty" data-key="${it.key}" data-delta="-1" aria-label="Decrease quantity">${icon('minus')}</button>
            <output aria-live="polite">${it.qty}</output>
            <button type="button" class="icon-btn" data-action="qty" data-key="${it.key}" data-delta="1" aria-label="Increase quantity" ${it.qty >= 5 ? 'disabled' : ''}>${icon('plus')}</button>
          </div>
          <button type="button" class="link link-quiet" data-action="later" data-key="${it.key}">Save for later</button>
          <button type="button" class="link link-quiet" data-action="remove" data-key="${it.key}">Remove</button>
        </div>` : `<span class="line-meta">Quantity ${it.qty}</span>`}
      </div>
      <span class="line-price">${money(o.price * it.qty)}</span>
    </li>`;
  }).join('');
}
export function totals(state) {
  return state.bag.reduce((n, it) => { const p = byId[it.id]; return p ? n + opt(p, it.opt).price * it.qty : n; }, 0);
}
export const bagCount = (state) => state.bag.reduce((n, it) => n + it.qty, 0);
export function summary(state, { cta = true } = {}) {
  const t = totals(state);
  return `<div class="summary">
    ${leaders([['Subtotal', money(t)], ['Delivery', 'Complimentary'], ['Total', `<strong>${money(t)}</strong>`]])}
    ${cta ? `<a class="btn btn-primary btn-block" href="#/checkout" data-action="to-checkout">Continue to checkout ${icon('arrow')}</a>` : ''}
    <p class="summary-note">${plate('Simulated checkout')} Prices in AED. This prototype places no order and takes no payment.</p>
  </div>`;
}
export function bagPanel(state) {
  if (!state.bag.length) return `<div class="empty empty-bag"><h2 class="display-m">Your bag is empty</h2><p>Pieces you add stay here on this device.</p>
    <ul class="empty-edits" role="list">${EDITS.map((e) => `<li><a href="#/shop?edit=${e.id}" class="chip">${e.title}</a></li>`).join('')}</ul>
    <a class="btn btn-primary btn-block" href="#/shop">Explore the collection</a></div>`;
  return `<ul class="lines" role="list">${bagLines(state)}</ul>
    <label class="toggle bag-gift"><input type="checkbox" data-action="gift-toggle" ${state.checkout.gift?.on ? 'checked' : ''}><span class="toggle-ui" aria-hidden="true"></span><span>This is a gift <small>It arrives in a discreet, elegant box.</small></span></label>
    ${summary(state)}${promise()}`;
}
export function bagPage(state) {
  const html = `<section class="page-head"><h1 class="display-l">Your bag</h1>${state.bag.length ? `<p class="shop-line">${bagCount(state)} ${bagCount(state) === 1 ? 'piece' : 'pieces'}</p>` : ''}</section><div class="bag-page" data-bag-page>${bagPanel(state)}</div>`;
  return { title: 'Your bag · Iris Diamonds', html };
}

/* ---------- CHECKOUT (simulated) ---------- */
export function checkout(state) {
  if (!state.bag.length) return { title: 'Checkout · Iris Diamonds', html: `<section class="page-head"><h1 class="display-l">Checkout</h1></section>${emptyState('There is nothing to check out yet', 'Add a piece to your bag first.')}` };
  const emirate = state.checkout.emirate || 'Dubai';
  const gift = state.checkout.gift;
  const rings = state.bag.filter((it) => byId[it.id]?.category === 'rings');
  const html = `
  <section class="page-head checkout-head">
    <h1 class="display-l">Checkout</h1>
    <p class="shop-line">${plate('Simulated checkout')} Sample details only. Nothing you choose here leaves this device, and no order or payment is made.</p>
  </section>
  <div class="checkout">
    <form class="steps" data-checkout novalidate>
      <fieldset class="step"><legend><span class="step-name">Delivery</span></legend>
        <p class="step-q" id="emirate-q">Where should it arrive?</p>
        <div class="choice-options emirates" role="radiogroup" aria-labelledby="emirate-q">${EMIRATES.map((e) => `<label class="option option-text"><input type="radio" name="emirate" value="${e}" ${e === emirate ? 'checked' : ''}><span class="option-face"><span class="option-label">${e}</span></span></label>`).join('')}</div>
        <div class="delivery-note" data-delivery-note>${deliveryNote(emirate)}</div>
      </fieldset>

      <fieldset class="step"><legend><span class="step-name" data-contact-title>${gift?.on ? 'Recipient' : 'Contact and address'}</span></legend>
        <p class="hint sample-note">${plate('Sample, read only')} No account needed. The live checkout would ask for these few details; this prototype fills them with samples and never sends them.</p>
        <div class="fields">
          <label class="field"><span>Full name <small>required</small></span><input type="text" value="Sample Customer" readonly autocomplete="off" tabindex="-1"></label>
          <label class="field"><span>Mobile number <small>required</small></span><input type="tel" value="+971 50 000 0000" readonly autocomplete="off" tabindex="-1"><small class="field-help">So the team can call to confirm the delivery time.</small></label>
          <label class="field"><span>Area and building <small>required</small></span><input type="text" value="Sample area, Building 1" readonly autocomplete="off" tabindex="-1"></label>
          <label class="field"><span>Apartment or villa <small>optional</small></span><input type="text" value="Apartment 101" readonly autocomplete="off" tabindex="-1"></label>
        </div>
      </fieldset>

      ${rings.length ? `<fieldset class="step"><legend><span class="step-name">Ring size</span></legend>
        <ul class="size-review" role="list">${rings.map((it) => `<li><span>${esc(byId[it.id].title)}</span><b>${it.size ? 'US ' + it.size : 'Not chosen yet'}</b></li>`).join('')}</ul>
        <p class="hint">${icon('ruler')} Before any order, the Iris team confirms each ring size with you. Resized pieces are final sale, so this step matters.</p>
      </fieldset>` : ''}

      <fieldset class="step"><legend><span class="step-name">A gift?</span></legend>
        <label class="toggle"><input type="checkbox" name="gift" ${gift?.on ? 'checked' : ''}><span class="toggle-ui" aria-hidden="true"></span><span>This is a gift <small>Delivery details become the recipient's.</small></span></label>
        <div class="gift-note" ${gift?.on ? '' : 'hidden'}>
          <label for="gift-text">A note to include <span class="optional">${plate('Proposed feature')}</span></label>
          <textarea id="gift-text" name="note" rows="3" maxlength="180" placeholder="For the moments worth remembering…">${esc(gift?.note || '')}</textarea>
          <p class="hint"><span data-note-count>${(gift?.note || '').length}</span> / 180. Kept on this device only.</p>
        </div>
        <p class="hint">Every Iris delivery already arrives in a discreet, elegant box.</p>
      </fieldset>

      <fieldset class="step"><legend><span class="step-name">Payment</span></legend>
        <div class="sample sample-pay">${icon('shield')}<div><b>No payment in this prototype.</b><p>The live checkout would take full payment before confirming an order, as Iris's terms require.</p></div></div>
      </fieldset>

      <button type="submit" class="btn btn-primary btn-block btn-place">Place simulated order · ${money(totals(state))}</button>
      <p class="hint center">You will not be charged. No order is sent to Iris Diamonds.</p>
    </form>
    <aside class="checkout-summary" aria-label="Order summary">
      <h2 class="display-s">Your order</h2>
      <ul class="lines lines-compact" role="list">${bagLines(state, { editable: false })}</ul>
      ${summary(state, { cta: false })}
      <a class="link link-quiet" href="#/bag">Edit bag</a>
    </aside>
  </div>`;
  return { title: 'Checkout · Iris Diamonds', html };
}
export function deliveryNote(emirate) {
  const sameDay = emirate !== 'Another UAE city';
  return `${icon('truck')}<div><b>${sameDay ? `Complimentary delivery in ${emirate}` : 'Complimentary delivery across the UAE'}</b>
    <p>${sameDay ? 'Same-day delivery for eligible orders placed before the daily cut-off.' : 'Same-day delivery may be available, subject to location.'} Fully insured and discreetly packed; the team calls to confirm a delivery time.</p></div>`;
}

/* ---------- CONFIRMATION ---------- */
export function confirmation(state) {
  const order = state.lastOrder;
  if (!order) return { title: 'Order · Iris Diamonds', html: `<section class="page-head"><h1 class="display-l">No simulated order yet</h1></section>${emptyState('Nothing to confirm', 'Complete the simulated checkout to see the confirmation.')}` };
  const items = order.items.map((it) => ({ ...it, p: byId[it.id] })).filter((x) => x.p);
  const html = `
  <section class="confirm">
    <div class="confirm-copy">
      <h1 class="display-l">Thank you. Your simulated order is complete.</h1>
      <div class="plates">${plate('Simulated order')}${plate('Nothing was charged')}</div>
      <p>In the live store, a member of the Iris team would now call to confirm your ${items.some((x) => x.p.category === 'rings') ? 'ring size and ' : ''}delivery time${order.emirate !== 'Another UAE city' ? ` in ${esc(order.emirate)}` : ''}. In this prototype, no order was placed and no details were sent.</p>
      <div class="actions"><a class="btn btn-primary" href="#/shop">Keep exploring</a><a class="btn btn-ghost" href="#/boutique">Visit the boutique</a></div>
    </div>
    <div class="keepsake cert">
      <div class="cert-head"><h2 class="cert-title">Order record</h2>${seal(order.ref, 'lg')}</div>
      <p class="keepsake-ref">Reference <b>${esc(order.ref)}</b> <small>simulated</small></p>
      <ul class="keepsake-items" role="list">${items.map((x) => { const o = opt(x.p, x.opt); return `<li><span class="window">${img(o.pack[0], { alt: '', sizes: '80px' })}</span><span><b>${esc(x.p.title)}</b><small>${x.p.category === 'gold' ? `Gold ${esc(x.p.gold.purity)}` : specLine(o)}${x.size ? ` · ring size US ${esc(x.size)}, to confirm` : ''}${x.qty > 1 ? ` · × ${x.qty}` : ''}</small></span><span>${money(o.price * x.qty)}</span>${x.p.category === 'gold' ? '' : `<div class="keepsake-map">${stoneMap(o, { label: false })}</div>`}</li>`; }).join('')}</ul>
      ${leaders([['Delivery', order.emirate === 'Another UAE city' ? 'Complimentary, UAE' : `Complimentary, ${esc(order.emirate)}`], ['Gift', order.gift ? 'Yes, with a note' : 'No'], ['Total', `<strong>${money(order.total)}</strong>`]])}
      <p class="keepsake-keep">Keep the invoice and certification that come with a real order: they carry your piece's exchange value, up to 80% toward another Iris piece for up to 10 years.</p>
      ${certLine(`SIMULATED RECORD · ${order.ref} · NOT AN INVOICE`)}
      <button type="button" class="btn btn-ghost btn-block keepsake-print" data-action="print">${icon('copy')} Print or save this record</button>
    </div>
  </section>`;
  return { title: 'Simulated order complete · Iris Diamonds', html };
}

/* ---------- STORY ---------- */
// Our story: fifty years through an iris. Five chapters in Iris's own words (adapted from
// irisdiamonds.ae, About Us); scrolling opens a camera iris on each chapter's photograph and closes
// it again, and a bezel of the years since 1974 turns with the story.
export const STORY = [
  { h: 'Jordan, 1974.', p: 'The family established a jewelry business rooted in traditional values, precision workmanship and honest relationships with customers.', img: 'ed-story', alt: 'Stacked diamond rings worn on a hand resting at the shoulder, against champagne satin' },
  { h: 'Over generations.', p: 'What started as a small family venture grew over generations into a name known for quality, integrity and timeless design.', img: 'ed-portrait-2', alt: 'Pear-shaped diamond rings worn across the fingers, a hand touching the chin' },
  { h: 'Five decades.', p: 'For more than five decades Iris has evolved with the jewelry industry while staying true to its principles.', img: 'ed-ring-edit', alt: 'A diamond necklace and stacked rings worn with a satin bodice, hands resting at the collarbone' },
  { h: 'Dubai, today.', p: 'Today it operates from Dubai, serving customers across the United Arab Emirates and beyond, combining that heritage with modern innovation.', img: 'ed-shopfront', alt: 'The Iris Diamonds boutique at Al Barsha South Mall, Dubai: a bronze shopfront with lit vitrines either side of the glass doors', link: ['#/boutique', 'Visit the boutique'] },
  { h: 'Made to be remembered.', p: '\u201cJewelry is deeply personal. It celebrates love, marks milestones, and tells stories that last a lifetime.\u201d', img: 'ed-campaign-hands', alt: 'A hand resting against the face, wearing stacked diamond bands with pear-shaped emerald and yellow stones', cite: 'From the Iris Diamonds philosophy' },
];
// the bezel: 1974 at the index, today 300 degrees on
export const dialAngle = (year) => ((year - 1974) / 52) * (300 * Math.PI / 180);
function irisDial() {
  let marks = '';
  for (let y = 1974; y <= 2026; y++) {
    const a = dialAngle(y), major = (y - 1974) % 10 === 0 || y === 2026, s = Math.sin(a), c = Math.cos(a), r2 = major ? 530 : 518;
    marks += `<line class="dial-tick${major ? ' major' : ''}" x1="${(506 * s).toFixed(1)}" y1="${(-506 * c).toFixed(1)}" x2="${(r2 * s).toFixed(1)}" y2="${(-r2 * c).toFixed(1)}"/>`;
    if (major) marks += `<text class="dial-label" text-anchor="middle" transform="rotate(${(a * 180 / Math.PI).toFixed(2)}) translate(0 -548)">${y === 2026 ? 'TODAY' : y}</text>`;
  }
  return `<svg class="iris-dial" viewBox="-580 -580 1160 1160" aria-hidden="true" focusable="false"><g data-dial>${marks}</g><path class="dial-index" d="M0 -498 L-9 -482 L9 -482 Z"/></svg>`;
}
export function story() {
  const two = (n) => String(n).padStart(2, '0');
  const html = `
  <article class="story-page">
    <section class="iris-story scene" data-scene-still data-iris-story aria-labelledby="story-title">${STORY.map((c, i) => `<span class="iris-snap" style="--i:${i}" aria-hidden="true"></span>`).join('')}
      <div class="iris-stage">
        <div class="iris-machine">
          <div class="iris-photos">${STORY.map((c, i) => img(c.img, { alt: c.alt, cls: 'iris-photo' + (i === 0 ? ' is-on' : ''), sizes: '(min-width: 1025px) 46vw, 80vw', lazy: false, priority: i === 0 })).join('')}</div>
          <svg class="iris-blades" viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
            <defs><linearGradient id="iris-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--bronze-1)"/><stop offset=".46" style="stop-color:var(--bronze-2)"/><stop offset=".62" style="stop-color:var(--bronze-3)"/><stop offset="1" style="stop-color:var(--bronze-4)"/></linearGradient></defs>
            <g>${'<path class="blade"/>'.repeat(9)}</g>
            <circle class="housing" r="482"/>
          </svg>
          ${irisDial()}
        </div>
        <div class="iris-copy">
          <h1 id="story-title" class="iris-title">A family story, set in 18K gold.</h1>
          <ol class="iris-chapters" role="list">
            ${STORY.map((c, i) => `<li class="iris-chapter${i === 0 ? ' is-on' : ''}"><p class="iris-num">${two(i + 1)} / ${two(STORY.length)}</p><h2 class="display-l">${c.h}</h2><p class="iris-text">${c.p}</p>${c.link ? `<a class="link" href="${c.link[0]}">${c.link[1]} ${icon('arrow')}</a>` : ''}${c.cite ? `<cite class="iris-cite">${c.cite}</cite>` : ''}</li>`).join('')}
          </ol>
          <nav class="iris-index" aria-label="Chapters">${STORY.map((c, i) => `<button type="button" data-chapter="${i}" aria-current="${i === 0}"><span>${two(i + 1)}</span>${c.h.replace(/\.$/, '')}</button>`).join('')}</nav>
        </div>
      </div>
    </section>
    <div class="story-more scene">
      <section><h2 class="display-m">Three ways to choose</h2>
        ${leaders([['Natural diamonds', 'Earth-mined; timeless, rare and enduring, selected for beauty, brilliance and authenticity.'], ['Lab-grown diamonds', 'Modern and visually identical to natural diamonds; every piece online is set with them.'], ['Gold jewelry', 'Classic to contemporary, in various purities, crafted to be worn, loved and passed down.']])}
        <p>Pieces undergo careful inspection and quality control, and the team is always available to explain diamond characteristics so you can choose with confidence.</p></section>
      <section><h2 class="display-m">The Iris promise</h2>
        <ul class="ticks" role="list"><li>${icon('check')} Authentic, high-quality diamonds and gold</li><li>${icon('check')} Ethical and responsible sourcing</li><li>${icon('check')} Transparent pricing and expert guidance</li><li>${icon('check')} Secure, insured delivery across the UAE</li><li>${icon('check')} Same-day delivery available within the UAE</li></ul></section>
    </div>
    <p class="source story-source">Text adapted from irisdiamonds.ae, About Us and The Guide to Diamonds.</p>
  </article>`;
  return { title: 'Our story · Iris Diamonds', html };
}

/* ---------- GUIDE ---------- */
export function guide() {
  const ref = byId['majesty-diamond-ring'];
  const o = ref.options[0];
  const html = `
  <article class="longread guide">
    <header class="longread-head guide-head scene">
      <div>
      <h1 class="display-xl">How to read a diamond.</h1>
      <p class="lede">Four characteristics decide a diamond's beauty and value: cut, colour, clarity and carat. Iris publishes the colour, clarity and carat weight of every diamond in its online pieces. Here is what that record means.</p>
      </div>
      <figure class="guide-photo window unveil">${img(opt(byId['round-brilliant-solitaire-diamond-ring'], 3).pack[0], { alt: 'A round brilliant solitaire diamond ring in 18K white gold', sizes: '(min-width: 1025px) 34vw, 80vw', priority: true, lazy: false })}</figure>
    </header>
    <div class="guide-chapters">
      <section class="guide-c scene"><h2 class="display-xl">Cut</h2><p>The most important factor in brilliance: how well the diamond is proportioned and how its facets interact with light. Common cuts include round, princess, cushion, oval and emerald.</p><figure class="diagram-fig">${img('ed-guide-cut', { alt: 'Diagram from the Iris guide: light entering a well-cut, a deep and a shallow diamond', sizes: '(min-width: 900px) 40vw, 90vw', cls: 'diagram' })}<figcaption>A well-cut diamond returns light through its table; a deep or shallow cut lets it escape through the sides. Diagram from the Iris Diamonds guide.</figcaption></figure></section>
      <section class="guide-c scene"><h2 class="display-xl">Colour</h2><p>Graded from D, colourless, to Z, light yellow or brown. Colourless diamonds are rare and highly prized. Iris pieces online are graded D to F, listed on the EW scale (EW+ is D, EW is E, RW+ is F).</p>${scales(o, ['colour'])}</section>
      <section class="guide-c scene"><h2 class="display-xl">Clarity</h2><p>The presence of internal or external marks, from Flawless (FL) to Included (I). Iris pieces online are mostly graded VVS to VS, grades whose inclusions generally need magnification to be seen.</p>${scales(o, ['clarity'])}</section>
      <section class="guide-c scene"><h2 class="display-xl">Carat</h2><p>The weight of a diamond: one carat is 0.2 grams. Weight alone does not decide beauty. For round brilliants, the Iris guide gives these approximate diameters:</p>
        <table class="table"><caption class="sr-only">Approximate diameter of round brilliant diamonds by carat weight</caption><thead><tr><th scope="col">Carat</th><th scope="col">Diameter</th></tr></thead><tbody>${CARAT_MM.map(([c, mm]) => `<tr><td>${c.toFixed(2)} ct</td><td>${mm.toFixed(2)} mm</td></tr>`).join('')}</tbody></table></section>
    </div>
    <section class="guide-read cert scene">
      <h2 class="display-m">Reading an Iris record</h2>
      <p>Each piece lists its diamonds in groups: a centre stone, then accents. The record shows each group's count and approximate total weight, the clarity and colour grades, and the metal. In the stone map each mark is one diamond, sized from Iris's carat-to-diameter guide, and every map carries a dashed 1 carat reference ring drawn to the same scale as its stones. Shapes other than round are approximated.</p>
      <div class="guide-read-grid"><div>${stoneMap(o)}</div><div>${leaders(specRows(ref, o))}<a class="link" href="#/piece/${ref.id}">See the ${esc(ref.title)} ${icon('arrow')}</a></div></div>
    </section>
    <section class="guide-lab scene"><h2 class="display-l">About lab-grown diamonds</h2><p>Lab-grown diamonds are modern, ethical and visually identical to natural diamonds, and Iris offers them alongside natural, earth-mined diamonds. Every piece in the online collection is set with lab-grown diamonds; the boutique can show you both.</p>
      <a class="link" href="#/guide/sizing">Next: find your ring size ${icon('arrow')}</a></section>
    <p class="source">Adapted from The Guide to Diamonds on irisdiamonds.ae.</p>
  </article>`;
  return { title: 'Diamond guide · Iris Diamonds', html };
}

export function sizing() {
  const html = `
  <article class="longread sizing">
    <header class="longread-head"><h1 class="display-xl">Find your ring size.</h1>
      <p class="lede">A comfortable ring slides over the knuckle with gentle resistance and sits securely without feeling tight. Measure more than once, and the Iris team confirms your size with you before you order.</p></header>
    <div class="sizing-grid">
      <section class="calc cert" aria-labelledby="calc-title">
        <h2 id="calc-title" class="display-m">Size calculator</h2>
        <form data-size-calc>
          <fieldset class="choice"><legend>I measured</legend><div class="choice-options">
            <label class="option option-text"><input type="radio" name="kind" value="circ" checked><span class="option-face"><span class="option-label">My finger (circumference)</span></span></label>
            <label class="option option-text"><input type="radio" name="kind" value="dia"><span class="option-face"><span class="option-label">A ring (inside diameter)</span></span></label></div></fieldset>
          <label class="field"><span>Measurement in millimetres</span><input type="number" name="mm" inputmode="decimal" min="40" max="70" step="0.1" value="54" aria-describedby="calc-help"></label>
          <p class="hint" id="calc-help">Finger circumference is usually 44 to 66 mm; a ring's inside diameter 14 to 21 mm.</p>
          <output class="calc-out" data-calc-out aria-live="polite"></output>
        </form>
      </section>
      <section><h2 class="display-m">Method 1: an existing ring</h2><ol class="steps-list"><li>Choose a ring that fits the intended finger well.</li><li>Measure the inside diameter straight across the centre, in millimetres.</li><li>Share the measurement with the team so they can confirm the closest size.</li></ol>
        <h2 class="display-m">Method 2: your finger</h2><ol class="steps-list"><li>Wrap a thin strip of paper or non-stretch string around the base of the finger.</li><li>Mark where the ends meet, without pulling tight.</li><li>Lay it flat and measure the length in millimetres: that is the circumference.</li></ol></section>
      <section><h2 class="display-m">Tips</h2><ul class="ticks" role="list"><li>${icon('check')} Measure at the end of the day, when fingers are at their natural size.</li><li>${icon('check')} Avoid measuring when your hands are unusually cold or warm.</li><li>${icon('check')} For wider bands, consider a slightly larger size.</li><li>${icon('check')} Between sizes? Choose the larger one.</li><li>${icon('check')} Measure the exact finger you will wear the ring on.</li></ul>
        <p>Prefer help? Call or WhatsApp ${BOUTIQUE.phone}, or visit the boutique for personal sizing.</p></section>
    </div>
    <section class="size-table-wrap"><h2 class="display-m">Approximate conversions</h2>
      <div class="table-scroll"><table class="table size-table"><caption class="sr-only">Approximate ring size conversions</caption><thead><tr><th scope="col">US</th><th scope="col">UK</th><th scope="col">EU / ISO</th><th scope="col">Inside diameter</th><th scope="col">Circumference</th></tr></thead>
      <tbody>${RING_SIZES.map((s) => `<tr data-size-row="${s.us}"><td>${s.us}</td><td>${s.uk}</td><td>${s.eu}</td><td>${s.dia.toFixed(1)} mm</td><td>${s.circ.toFixed(1)} mm</td></tr>`).join('')}</tbody></table></div>
      <p class="source">Conversions are approximate and for guidance only; the Iris team confirms the final size.</p></section>
  </article>`;
  return { title: 'Ring size guide · Iris Diamonds', html };
}

/* ---------- SERVICES ---------- */
export function services() {
  const html = `
  <article class="longread services">
    <section class="services-intro scene"><header class="longread-head"><h1 class="display-xl">The terms, plainly.</h1><p class="lede">Delivery, exchange, buy-back and warranty, as Iris Diamonds publishes them in its Terms and Conditions (last updated 1 January 2026).</p></header>
    <div class="terms-summary cert">${leaders([['Delivery', 'Complimentary across the UAE; same day for eligible orders'], ['Exchange', 'Within 14 days, once per invoice; no refunds'], ['Exchange value', 'Up to 80% of invoice, for up to 10 years'], ['Cash buy-back', '70% / 60% / 50% within 2 / 3 / 5 years, discretionary'], ['Warranty', '6 months, manufacturing defects'], ['Final sale', 'Earrings, custom, engraved, resized and international orders']])}</div></section>
    <div class="clauses">
      <section class="clause"><h2 class="display-m">Delivery</h2><p>Complimentary across the UAE. Orders placed before the daily cut-off are eligible for same-day delivery in Dubai, Abu Dhabi, Sharjah and Ajman, and in other UAE cities subject to location availability.</p><ul class="ticks" role="list"><li>${icon('check')} Fully insured</li><li>${icon('check')} Packed in discreet, elegant boxes</li><li>${icon('check')} Handled by trusted courier partners, with strict confidentiality</li><li>${icon('check')} Updates on dispatch; the team calls to confirm a time</li></ul></section>
      <section class="clause"><h2 class="display-m">Exchange</h2><p>Exchange only, within 14 days of delivery or purchase; refunds are not offered. One exchange per invoice. Pieces must be unused, unworn and unaltered, in original packaging with the invoice and certification, presented by the original purchaser with valid identification.</p></section>
      <section class="clause"><h2 class="display-m">Exchange value</h2><p>Eligible jewelry may be exchanged for up to 80% of its original invoice value for up to 10 years from purchase, toward another Iris Diamonds piece. It is not redeemable for cash and not combinable with promotions.</p>
        <div class="timeline" role="img" aria-label="Exchange value up to 80 percent of the invoice, available for up to 10 years"><span class="timeline-bar"></span><span class="timeline-start">Purchase</span><span class="timeline-end">10 years</span><b>Up to 80%</b></div></section>
      <section class="clause"><h2 class="display-m">Cash buy-back</h2><p>A discretionary program in the UAE for eligible Iris jewelry, subject to inspection, and not guaranteed:</p>${leaders([['Within 2 years', '70% of invoice'], ['Within 3 years', '60% of invoice'], ['Within 5 years', '50% of invoice']])}<p class="hint">Excludes bullion, coins and investment gold, and international orders.</p></section>
      <section class="clause"><h2 class="display-m">Warranty</h2><p>Six months against manufacturing defects from the date of delivery, excluding normal wear, accidental damage, misuse, loss or third-party alterations.</p></section>
      <section class="clause"><h2 class="display-m">Final sale</h2><p>Custom-made, engraved, resized and altered items, all earrings and all international orders are final sale, unless a manufacturing defect is confirmed. International customers are responsible for customs duties and taxes.</p></section>
      <section class="clause"><h2 class="display-m">Prices</h2><p>Listed in AED and may change with gold and diamond markets. Full payment is required before an order is confirmed.</p></section>
    </div>
    <p class="source">Summarised from the Delivery page and Terms &amp; Conditions on irisdiamonds.ae. The live terms always govern.</p>
  </article>`;
  return { title: 'Services and terms · Iris Diamonds', html };
}

/* ---------- BOUTIQUE ---------- */
export function boutique() {
  const html = `
  <article class="boutique-page">
    <section class="boutique-hero scene scene-wide"><figure class="boutique-photo unveil">${img('ed-shopfront', { alt: 'The Iris Diamonds boutique at Al Barsha South Mall: a bronze shopfront with IRIS DIAMONDS lettering and lit vitrines of jewelry on navy velvet either side of the glass doors', sizes: '100vw', priority: true, lazy: false })}</figure></section>
    <section class="boutique-body scene">
      <h1 class="display-xl">Come and see it in the light.</h1>
      <div class="boutique-grid">
        <div><p class="open-now ${openNow().open ? 'is-open' : ''}" data-open-now>${openNow().text}</p>${leaders([['Address', BOUTIQUE.lines.join('<br>')], ['Hours', BOUTIQUE.hours], ['Call or WhatsApp', `<a href="${BOUTIQUE.tel}">${BOUTIQUE.phone}</a>`], ['Email', `<a href="mailto:${BOUTIQUE.email}">${BOUTIQUE.email}</a>`]])}
          <div class="actions"><a class="btn btn-primary" href="${BOUTIQUE.map}" target="_blank" rel="noopener">${icon('pin')} Get directions</a><a class="btn btn-ghost" href="${whatsapp('Hello Iris Diamonds, I would like to visit the boutique.')}" target="_blank" rel="noopener">${icon('chat')} Message the boutique</a></div></div>
        <div class="boutique-why"><h2 class="display-m">At the boutique</h2><ul class="ticks" role="list"><li>${icon('check')} Personal sizing assistance</li><li>${icon('check')} Natural and lab-grown diamonds, and gold jewelry, side by side</li><li>${icon('check')} A Client Advisor to explain each diamond's characteristics</li><li>${icon('check')} Gold bars, priced on the day</li></ul></div>
      </div>
    </section>
  </article>`;
  return { title: 'Visit the boutique · Iris Diamonds', html };
}

export function notFound() {
  return { title: 'Not found · Iris Diamonds', html: `
  <section class="saved-empty notfound scene">
    <div class="saved-empty-copy">
      <h1 class="display-xl">This page is not in the collection.</h1>
      <p class="lede">The link may be old, or the piece may no longer be listed.</p>
      <div class="actions"><a class="btn btn-primary" href="#/shop">Explore the collection ${icon('arrow')}</a><a class="btn btn-ghost" href="#/">Home</a></div>
    </div>
    <figure class="saved-empty-photo unveil">${img('ed-portrait-2', { alt: 'Pear-shaped diamond rings worn across the fingers, a hand touching the chin', sizes: '(min-width: 1025px) 36vw, 80vw', lazy: false })}</figure>
  </section>` };
}

/* ---------- SEARCH ---------- */
export function searchResults(q) {
  const term = q.trim().toLowerCase();
  if (!term) return `<p class="search-hint">Try a piece, a stone or a metal, for example “solitaire”, “hoop” or “rose gold”.</p>
    <div class="search-quick">${JEWELRY.map((c) => `<a class="chip" href="#/shop/${c}">${CATEGORIES[c].title}</a>`).join('')}<a class="chip" href="#/gold">Gold bars</a></div>`;
  const words = term.split(/\s+/);
  const hits = pieces.filter((p) => words.every((w) => p.search.includes(w.replace(/s$/, '')))).slice(0, 8);
  const pages = PAGES.filter((pg) => words.some((w) => w.length > 2 && pg.words.includes(w.replace(/s$/, ''))));
  const pageList = pages.length ? `<ul class="search-pages" role="list">${pages.map((pg) => `<li><a href="${pg.href}">${pg.title} ${icon('arrow')}</a></li>`).join('')}</ul>` : '';
  if (!hits.length && pages.length) return pageList;
  if (!hits.length) return `<div class="search-none"><p><b>Nothing matches “${esc(q)}”.</b></p><p>Check the spelling, or try a category or metal. A Client Advisor can also tell you what is in the boutique.</p>
    <div class="search-quick">${JEWELRY.map((c) => `<a class="chip" href="#/shop/${c}">${CATEGORIES[c].title}</a>`).join('')}<a class="chip" href="${whatsapp(`Hello Iris Diamonds, I am looking for: ${q}`)}" target="_blank" rel="noopener">${icon('chat')} Ask an advisor</a></div></div>`;
  return `${pageList}<ul class="search-list" role="list">${hits.map((p) => { const o = p.options[0]; return `<li><a href="#/piece/${p.id}"><span class="window">${img(o.pack[0], { alt: '', sizes: '64px' })}</span><span><b>${esc(p.title)}</b><small>${p.category === 'gold' ? `Gold ${esc(p.gold.purity)}` : specLine(o)}</small></span><span>${p.options.length > 1 && p.priceTo !== p.priceFrom ? 'From ' : ''}${money(p.priceFrom)}</span></a></li>`; }).join('')}</ul>
    ${hits.length > 3 ? `<a class="link" href="#/shop?q=${encodeURIComponent(q)}">See all results ${icon('arrow')}</a>` : ''}`;
}
