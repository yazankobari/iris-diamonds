// Shared building blocks: images, icons, certificate parts (guilloche, seal, stone map, scales).
import { images, METALS, COLOUR_SCALE, CLARITY_SCALE, clarityRange, colourRange, money, carat, gradeSummary } from './data.js';

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- images ---------- */
const EDITORIAL = { 'ed-campaign-hands': [2400, 1600], 'ed-story': [2400, 3601], 'ed-ring-edit': [2400, 3600], 'ed-earrings': [2400, 3601], 'ed-necklaces': [2400, 3600], 'ed-portrait-2': [2400, 3597], 'ed-boutique': [1280, 720], 'ed-shopfront': [1672, 941], 'ed-guide-heart': [2000, 1600], 'ed-guide-cut': [2000, 1600], 'ed-guide-colour': [2000, 1600], 'ed-guide-clarity': [2000, 1600], 'ed-guide-carat': [2000, 1600] };

export function imgMeta(stem) {
  if (images[stem]) return images[stem];
  const e = EDITORIAL[stem];
  return e ? { kind: e[0] > e[1] ? 'wide' : 'model', w: e[0], h: e[1], sizes: [960, 1600, 2400].filter((s) => s <= e[0] || s === 960) } : null;
}
export function src(stem, want = 960) {
  const m = imgMeta(stem); if (!m) return '';
  const s = m.sizes.find((x) => x >= want) || m.sizes[m.sizes.length - 1];
  return `img/${stem}-${s}.webp`;
}
export function img(stem, { alt = '', sizes = '100vw', cls = '', priority = false, lazy = true, style = '' } = {}) {
  const m = imgMeta(stem); if (!m) return '';
  const set = m.sizes.map((s) => `img/${stem}-${s}.webp ${Math.min(s, m.w)}w`).join(', ');
  const w = m.sizes[0], h = Math.round(m.sizes[0] * m.h / m.w);
  return `<img class="${cls}" src="${src(stem, 960)}" srcset="${set}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${priority ? ' fetchpriority="high"' : lazy ? ' loading="lazy"' : ''} decoding="async"${style ? ` style="${style}"` : ''}>`;
}

/* ---------- icons (one stroke system, 24px grid, 1.5 stroke) ---------- */
const P = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
  bag: '<path d="M5 8.5h14l-1 11.5H6L5 8.5Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
  back: '<path d="M20 12H5m5-5-5 5 5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  chat: '<path d="M4.5 18.5 6 15a7.5 7.5 0 1 1 3 2.6l-4.5.9Z"/>',
  phone: '<path d="M7 3.5h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5 5.7 2 2 0 0 1 7 3.5Z"/>',
  pin: '<path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  zoom: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 8v5M8 10.5h5"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  filter: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  truck: '<path d="M3 6.5h11v9H3zM14 10h4l3 3v2.5h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  exchange: '<path d="M5 9h12l-3-3M19 15H7l3 3"/>',
  ruler: '<path d="m3.5 15.5 12-12 5 5-12 12-5-5Z"/><path d="m7 12 1.8 1.8M9.5 9.5l2.6 2.6M12 7l1.8 1.8"/>',
  shield: '<path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6l-7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
  gem: '<path d="M7 4h10l4 5-9 11L3 9l4-5Z"/><path d="M3 9h18M9.5 4 12 9l2.5-5M12 9v11"/>',
  share: '<path d="M12 4v11m-4-7 4-4 4 4M5 13v6h14v-6"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="1"/><path d="M5 15V5h10"/>',
  play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
};
export const icon = (name, label = '') =>
  `<svg class="icon icon-${name}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"'}>${P[name] || ''}</svg>`;

/* ---------- guilloche (engine-turned security linework, generated) ---------- */
function rosettePaths({ R = 40, A = 6, lobes = 9, strands = 12, cx = 50, cy = 50, steps = 540 }) {
  const out = [];
  for (let j = 0; j < strands; j++) {
    const phase = (j / strands) * (2 * Math.PI / lobes);
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const r = R + A * Math.cos(lobes * t + phase * lobes);
      const x = cx + r * Math.cos(t), y = cy + r * Math.sin(t);
      d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    out.push(d + 'Z');
  }
  return out;
}
function trochoid({ R, r, d, turns, steps = 1400, cx = 50, cy = 50 }) {
  let p = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
    const y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
    p += (i ? 'L' : 'M') + (cx + x).toFixed(2) + ' ' + (cy + y).toFixed(2);
  }
  return p;
}
export function rosetteSVG({ seed = 7, size = 100, stroke = '#000C30', opacity = 1, width = 0.6 } = {}) {
  // one interlaced engine-turned band, a looped centre and a rim; parameters vary per piece
  const lobes = 8 + (seed % 4) * 2, strands = 8 + (seed % 3);
  const band = rosettePaths({ R: 35, A: 8.5, lobes, strands, steps: 520 }).map((d) => `<path d="${d}"/>`).join('');
  const petals = 5 + (seed % 4);
  const centre = `<path d="${trochoid({ R: petals * 2.6, r: 2.6, d: 9.5, turns: 1, steps: 900 })}"/>`;
  const rim = `<circle cx="50" cy="50" r="48"/><circle cx="50" cy="50" r="45.5"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${width}">${rim}${band}${centre}</svg>`;
}
export function waveBandSVG({ w = 480, h = 24, strands = 9, waves = 6, stroke = '#000C30', opacity = 0.5, width = 0.5 } = {}) {
  let paths = '';
  for (let j = 0; j < strands; j++) {
    const phase = (j / strands) * Math.PI;
    let d = '';
    for (let x = 0; x <= w; x += 2) {
      const y = h / 2 + (h / 2 - 1.5) * Math.sin((x / w) * waves * Math.PI * 2 + phase) * Math.cos((x / w) * Math.PI * 2 + phase * 0.3);
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2);
    }
    paths += `<path d="${d}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${width}">${paths}</svg>`;
}
export const dataUri = (svg) => `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}')`;

/* the iris: a large engine-turned rosette for the hero; pathLength=1 lets every strand draw itself */
export function irisSVG() {
  const layers = [{ R: 46, A: 3.2, lobes: 30, strands: 7 }, { R: 37, A: 4.6, lobes: 20, strands: 9 }, { R: 27, A: 4.2, lobes: 14, strands: 9 }, { R: 17, A: 3, lobes: 10, strands: 7 }];
  let paths = '';
  layers.forEach((l, li) => {
    paths += rosettePaths({ ...l, steps: 900 }).map((d, j) => `<path pathLength="1" style="--d:${(li * 0.12 + j * 0.035).toFixed(3)}s" d="${d}"/>`).join('');
  });
  const rims = [49.4, 48.4, 31.6, 21.4].map((r, k) => `<circle pathLength="1" style="--d:${(k * 0.1).toFixed(2)}s" cx="50" cy="50" r="${r}"/>`).join('');
  return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width=".1" aria-hidden="true" focusable="false">${rims}${paths}</svg>`;
}

/* the loupe: a lens whose bezel carries the piece's record, and whose rim carries every one
   of its diamonds, drawn to scale (diameter ~ 6.4 mm x cube-root ct), largest first from 12 o'clock */
export function loupeRing(option, uid = 'lp') {
  const C = 500, RT = 376, RS = 438, K = 8.6; // text radius, stone radius, units per mm
  const stones = option.specs
    .map((g) => ({ each: g.carat / g.count, count: g.count }))
    .sort((a, b) => b.each - a.each)
    .flatMap((g) => Array.from({ length: g.count }, () => g.each));
  const n = stones.length;
  let marks = '';
  stones.forEach((ct, i) => {
    const a = (-90 + (i * 360) / n) * (Math.PI / 180);
    const r = Math.max(4, (6.4 * Math.cbrt(ct) * K) / 2);
    const x = C + RS * Math.cos(a), y = C + RS * Math.sin(a);
    const oct = (rr) => Array.from({ length: 8 }, (_, k) => {
      const t = Math.PI / 8 + (k * Math.PI) / 4;
      return `${(x + rr * Math.cos(t)).toFixed(1)},${(y + rr * Math.sin(t)).toFixed(1)}`;
    }).join(' ');
    marks += `<g class="lstone" style="--k:${i};--n:${n}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>${r > 9 ? `<polygon points="${oct(r * 0.52)}"/>` : ''}</g>`;
  });
  const g = gradeSummary(option);
  const line = [`${option.stones} lab-grown ${option.stones === 1 ? 'diamond' : 'diamonds'}`, `${option.carats.toFixed(2)} ct`, g.clarity, g.colour, option.material, money(option.price)].filter(Boolean).join('  ·  ').toUpperCase();
  // repeat the record at its natural width (about 13.6 units a character at 19px, 600, +2 tracking)
  const circ = 2 * Math.PI * RT, per = (line.length + 5) * 13.6;
  const text = Array(Math.max(1, Math.round(circ / per))).fill(line).join('  ·  ') + '  ·  ';
  return `<svg class="lens-ring" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
    <defs><path id="${uid}" d="M ${C} ${C} m -${RT} 0 a ${RT} ${RT} 0 1 1 ${RT * 2} 0 a ${RT} ${RT} 0 1 1 -${RT * 2} 0"/></defs>
    <circle class="bezel" cx="${C}" cy="${C}" r="350"/><circle class="bezel bezel-2" cx="${C}" cy="${C}" r="402"/>
    <g class="ring-text"><g class="ring-spin"><text><textPath href="#${uid}" textLength="${(circ - 8).toFixed(0)}" lengthAdjust="spacing">${esc(text)}</textPath></text></g></g>
    <g class="lstones">${marks}</g>
  </svg>`;
}

/* the seal: an engine-turned rosette, iridescent like diamond fire; unique per piece */
export function seal(seedText = 'iris', size = 'md') {
  const seed = [...seedText].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  const mask = dataUri(rosetteSVG({ seed, stroke: '#000C30', width: size === 'sm' ? 1.1 : 0.8 }));
  return `<span class="seal seal-${size}" aria-hidden="true" style="--seal-mask:${mask}"><span class="seal-ink"></span></span>`;
}

/* ---------- stone map: one mark per diamond, area follows weight ---------- */
// Drawn to one scale everywhere: a round brilliant's diameter is about 6.4 mm x cube-root(carats)
// (Iris's own carat guide: 0.5 ct 5.0 mm, 1 ct 6.4 mm, 2 ct 8.0 mm, 4 ct 10.2 mm).
const MAP_W = 360, PX_PER_MM = 5.2;
const mmOf = (ct) => 6.4 * Math.cbrt(ct);
export function stoneMap(option, { label = true, reference = true } = {}) {
  const groups = option.specs.map((s) => ({ ...s, each: s.carat / s.count })).sort((a, b) => b.each - a.each);
  if (!groups.length) return '';
  const gap = 4;
  let y = 2, svg = '', idx = 0;
  groups.forEach((g, gi) => {
    const r = Math.max(2.4, (mmOf(g.each) * PX_PER_MM) / 2), d = r * 2;
    const perRow = Math.max(1, Math.floor((MAP_W + gap) / (d + gap)));
    const lines = Math.ceil(g.count / perRow);
    if (gi) y += 16;
    for (let i = 0; i < g.count; i++) {
      const row = Math.floor(i / perRow), col = i % perRow;
      const inRow = Math.min(perRow, g.count - row * perRow);
      const rowW = inRow * d + (inRow - 1) * gap;
      svg += stoneMark((MAP_W - rowW) / 2 + col * (d + gap) + r, y + row * (d + gap) + r, r, idx++);
    }
    y += lines * (d + gap) - gap;
  });
  if (reference) {
    const r1 = (mmOf(1) * PX_PER_MM) / 2;
    y += 22;
    svg += `<g class="stone-ref"><circle cx="${(r1 + 1).toFixed(2)}" cy="${(y + r1).toFixed(2)}" r="${r1.toFixed(2)}"/><text x="${(r1 * 2 + 12).toFixed(2)}" y="${(y + r1 + 4).toFixed(2)}">1 ct reference, about 6.4 mm across</text></g>`;
    y += r1 * 2;
  }
  const h = Math.ceil(y + 3);
  const desc = groups.map((g) => `${g.count} ${g.count === 1 ? 'diamond' : 'diamonds'} of approximately ${carat(g.carat)} in total, ${g.clarity} clarity`).join('; ');
  return `<figure class="stone-map" data-stones="${option.stones}">
    <svg viewBox="0 0 ${MAP_W} ${h}" width="${MAP_W}" height="${h}" role="img" aria-label="Stone map drawn to scale: ${option.stones} lab-grown diamonds. ${esc(desc)}.">${svg}</svg>
    ${label ? `<figcaption>${groups.map((g) => `<span><b>${g.count}</b> ${g.count === 1 ? 'diamond' : 'diamonds'} · ${carat(g.carat)} · ${g.clarity}</span>`).join('')}</figcaption>` : ''}
  </figure>`;
}
function stoneMark(x, y, r, i) {
  // top view of a brilliant: outline + table octagon (geometry, not illustration)
  const oct = (rr) => Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return `${(x + rr * Math.cos(a)).toFixed(2)},${(y + rr * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  const inner = r > 4.5 ? `<polygon points="${oct(r * 0.52)}" class="table"/>` : '';
  return `<g class="stone" style="--i:${i}"><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}"/>${inner}</g>`;
}

/* ---------- grading scales ---------- */
export function scales(option, which = ['colour', 'clarity']) {
  if (!option.specs.length) return '';
  const g = option.specs[0];
  const [c0, c1] = colourRange(option.grades.reduce((a, b) => (COLOUR_SCALE.indexOf(b.split('–')[1] || b) > COLOUR_SCALE.indexOf(a.split('–')[1] || a) ? b : a), g.colour || 'D–E'));
  const ranges = option.clarities.map(clarityRange);
  const k0 = Math.min(...ranges.map((r) => r[0])), k1 = Math.max(...ranges.map((r) => r[1]));
  const row = (scale, a, b, name, note) => `<div class="scale" role="img" aria-label="${name}: ${esc(note)}">
      <span class="scale-name" aria-hidden="true">${name}</span>
      <ol aria-hidden="true">${scale.map((s, i) => `<li class="${i >= a && i <= b ? 'on' : ''}${i === a ? ' first' : ''}${i === b ? ' last' : ''}">${s}</li>`).join('')}</ol>
    </div>`;
  const colourNote = `${COLOUR_SCALE[c0]}${c1 !== c0 ? ' to ' + COLOUR_SCALE[c1] : ''}, at the colourless end of the D to Z scale`;
  const clarityNote = `${CLARITY_SCALE[k0]}${k1 !== k0 ? ' to ' + CLARITY_SCALE[k1] : ''} on the scale from flawless (FL) to included (I)`;
  return `<div class="scales">${which.includes('colour') ? row(COLOUR_SCALE, c0, c1, 'Colour', colourNote) : ''}${which.includes('clarity') ? row(CLARITY_SCALE, k0, k1, 'Clarity', clarityNote) : ''}</div>`;
}

/* ---------- certificate (dotted-leader specification) ---------- */
export function leaders(rows) {
  return `<dl class="leaders">${rows.filter(Boolean).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
}
export function specRows(piece, o) {
  if (piece.category === 'gold') {
    const g = piece.gold;
    return [['Metal', `Gold ${g.purity || '999.9'}`], ['Weight', g.weight], g.size && ['Size', `${g.size} mm`], g.thickness && ['Thickness', g.thickness], g.design && ['Design', g.design], ['Price', `${money(o.price)} <small>reference</small>`]];
  }
  const { colour, clarity } = gradeSummary(o);
  return [
    ['Diamonds', `${o.stones} lab-grown`],
    ['Total weight', `approx. ${carat(o.carats)}`],
    ['Clarity', clarity],
    ['Colour', colour],
    ['Metal', o.material || ''],
    ['Price', money(o.price)],
  ];
}
export function metalDot(m) {
  return m ? `<span class="metal-dot" style="--swatch:${METALS[m].swatch}" title="${METALS[m].label}"></span>` : '';
}
export const plate = (text, cls = '') => `<span class="plate ${cls}">${text}</span>`;
export const certLine = (text) => `<p class="cert-micro" aria-hidden="true">${esc(text)}</p>`;
export function microtext(text, cls = '') {
  // two identical halves, so sliding the run left by half loops without a seam
  const half = `<span>${Array(7).fill(esc(text)).join(' · ')} · </span>`;
  return `<div class="microtext ${cls}" aria-hidden="true"><div class="microtext-run">${half}${half}</div></div>`;
}
