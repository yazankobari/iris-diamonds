// Catalog access and derived facts. Everything here is computed from window.IRIS_CATALOG
// (generated from the public irisdiamonds.ae feed); nothing is invented except the labelled
// editorial "edits", which are suggestions, not claims.

const raw = window.IRIS_CATALOG;

export const CATEGORIES = {
  rings: { id: 'rings', title: 'Rings', singular: 'ring', hero: 'ed-ring-edit', line: 'Solitaires, halos and bands, each with every stone accounted for.' },
  earrings: { id: 'earrings', title: 'Earrings', singular: 'pair of earrings', hero: 'ed-earrings', line: 'Studs, drops and hoops that catch the light at every turn.' },
  necklaces: { id: 'necklaces', title: 'Necklaces', singular: 'necklace', hero: 'ed-necklaces', line: 'From a single solitaire to a riviera of eighty-nine stones.' },
  bracelets: { id: 'bracelets', title: 'Bracelets', singular: 'bracelet', hero: 'ed-portrait-2', line: 'Bangles and a tennis bracelet in 18K white, yellow and rose gold.' },
};
export const JEWELRY = ['rings', 'earrings', 'necklaces', 'bracelets'];

export const METALS = {
  white: { id: 'white', label: 'White gold', swatch: 'var(--metal-white)' },
  yellow: { id: 'yellow', label: 'Yellow gold', swatch: 'var(--metal-yellow)' },
  rose: { id: 'rose', label: 'Rose gold', swatch: 'var(--metal-rose)' },
  'two-tone': { id: 'two-tone', label: 'Two-tone gold', swatch: 'linear-gradient(90deg, var(--metal-white) 50%, var(--metal-yellow) 50%)' },
};

export const PRICE_BANDS = [
  { id: 'u5', label: 'Under AED\u00a05,000', min: 0, max: 4999 },
  { id: '5-10', label: 'AED\u00a05,000\u00a0–\u00a010,000', min: 5000, max: 10000 },
  { id: '10-20', label: 'AED\u00a010,000\u00a0–\u00a020,000', min: 10001, max: 20000 },
  { id: 'o20', label: 'Over AED\u00a020,000', min: 20001, max: Infinity },
];

export const WEIGHT_STOPS = [0, 0.5, 1, 1.5, 2, 3, 5, 10];
export const WEIGHT_BANDS = [
  { id: 'w1', label: 'Under 1 ct', min: 0, max: 0.999 },
  { id: 'w1-3', label: '1 – 3 ct', min: 1, max: 3 },
  { id: 'w3-5', label: '3 – 5 ct', min: 3.001, max: 5 },
  { id: 'w5', label: 'Over 5 ct', min: 5.001, max: Infinity },
];

export const images = raw.images;
const round2 = (n) => Math.round(n * 100) / 100;

function deriveOption(o) {
  const stones = o.specs.reduce((n, s) => n + s.count, 0);
  const carats = round2(o.specs.reduce((n, s) => n + s.carat, 0));
  const pack = o.images.filter((s) => images[s]?.kind === 'pack');
  const worn = o.images.filter((s) => images[s]?.kind !== 'pack');
  const grades = o.specs.map((s) => s.colour).filter(Boolean);
  const clarities = o.specs.map((s) => s.clarity);
  return { ...o, stones, carats, pack, worn, grades, clarities };
}

function goldFacts(text) {
  const pick = (re) => (text.match(re) || [])[1]?.trim();
  return {
    purity: pick(/Metal:\s*Gold\s*([\d.]+)/i),
    weight: pick(/Weight:\s*([\d.]+\s*(?:Grams?|Ounces?))/i),
    thickness: pick(/Thickness:\s*([\d.]+\s*mm)/i),
    size: pick(/Size \(mm\):\s*([\d.]+\s*x\s*[\d.]+)/i),
    design: pick(/Design:\s*(Lady Fortuna)/i),
  };
}

export const pieces = raw.pieces.map((p) => {
  const options = p.options.map(deriveOption);
  const metals = [...new Set(options.map((o) => o.metal).filter(Boolean))];
  const piece = { ...p, options, metals, priceTo: Math.max(...options.map((o) => o.price)) };
  if (p.category === 'gold') {
    const o = options[0];
    piece.gold = goldFacts(o.description);
    // the obverse (front) photograph leads; the shared reverse shots follow
    o.pack = [...o.images].sort((a, b) => (/obv/.test(b) ? 1 : 0) - (/obv/.test(a) ? 1 : 0));
    o.worn = [];
  }
  piece.search = [p.title, p.kind, CATEGORIES[p.category]?.title || 'Gold', ...metals.map((m) => METALS[m].label), ...options.map((o) => o.material || '')].join(' ').toLowerCase();
  return piece;
});

export const byId = Object.fromEntries(pieces.map((p) => [p.id, p]));
// "Featured" order: categories interleaved (highest price first within each) so a first view shows the range
const lanes = ['rings', 'earrings', 'necklaces', 'bracelets'].map((c) => pieces.filter((p) => p.category === c));
export const jewelry = [];
for (let i = 0; lanes.some((l) => l[i]); i++) lanes.forEach((l) => l[i] && jewelry.push(l[i]));
export const gold = pieces.filter((p) => p.category === 'gold').sort((a, b) => a.priceFrom - b.priceFrom);
export const countIn = (cat) => jewelry.filter((p) => p.category === cat).length;
export const totalStones = jewelry.reduce((n, p) => n + p.options[0].stones, 0);

// Editorial edits: suggestions to help gift and milestone shoppers start somewhere.
// They are presented as "suggested edits", never as Iris's own curation or as occasion claims.
export const EDITS = [
  { id: 'proposal', title: 'The proposal', line: 'Solitaires and halos with a single centre diamond.', ids: ['round-brilliant-solitaire-diamond-ring', 'majesty-diamond-ring', 'lumiere-halo-diamond-ring', 'crown-royale-diamond-ring', 'teardrop-halo-diamond-ring', 'elysee-bloom-diamond-ring', 'bypass-diamond-halo-ring', 'round-brilliant-halo-pave-diamond-ring'] },
  { id: 'wedding', title: 'The wedding day', line: 'Rivieras, drops and lines of light for the day itself.', ids: ['diamond-riviera-necklace', 'classic-diamond-tennis-bracelet', 'eternal-grace-diamond-drop-earrings', 'lumiere-royale-diamond-necklace', 'aurora-cascade-diamond-earrings', 'elysian-diamond-band-ring', 'eternelle-diamond-ring', 'pave-diamond-hoop-earrings'] },
  { id: 'celebration', title: 'For Eid and every celebration', line: 'Bangles and statement pieces made for gatherings.', ids: ['fleur-royale-diamond-bangle', 'crown-elysee-diamond-bangle', 'aurelian-grace-diamond-bangle', 'florence-royale-diamond-bangle', 'luna-brilliance-diamond-necklace', 'eternal-radiance-diamond-bangle', 'luna-crest-diamond-bangle', 'velour-line-diamond-bangle'] },
  { id: 'everyday', title: 'Everyday, under AED\u00a05,000', line: 'Studs, pendants and slim rings to wear every day.', ids: ['teardrop-diamond-stud-earrings', 'florea-whisper-diamond-ring', 'florea-diamond-pendant-necklace', 'solitaire-diamond-pendant-necklace', 'florea-diamond-stud-earrings', 'eternelle-diamond-ring', 'ascending-diamond-line-earrings'] },
].map((e) => ({ ...e, ids: e.ids.filter((id) => byId[id]) }));

// Campaign portraits paired with the pieces Iris attaches the same photograph to in its feed.
export const PORTRAITS = [
  { stem: '5c7a7189kopyasi-2', ids: ['pave-diamond-hoop-earrings', 'classic-diamond-tennis-bracelet'], alt: 'A model in a champagne satin camisole wearing the Pavé Diamond Hoop Earrings and the Classic Diamond Tennis Bracelet, her hand resting at her neck', focus: '50% 18%' },
  { stem: '5c7a7230kopyasi-2', ids: ['open-heart-diamond-pendant-necklace', 'ascending-diamond-line-earrings'], alt: 'A model in champagne satin wearing the Open Heart Diamond Pendant Necklace and the Ascending Diamond Line Earrings', focus: '50% 0%' },
  { stem: '5c7a7218kopyasi-2', ids: ['classic-diamond-tennis-bracelet'], alt: 'Hands crossed over champagne satin, wearing stacked tennis bracelets and solitaire rings, including the Classic Diamond Tennis Bracelet', focus: '50% 78%' },
  { stem: '5c7a7262kopyasi-2', ids: ['teardrop-diamond-stud-earrings'], alt: 'A model in champagne satin wearing the Teardrop Diamond Stud Earrings with a wreath pendant and stacked rings', focus: '50% 0%' },
  { stem: '5c7a7161kopyasi-2', ids: ['pave-diamond-hoop-earrings'], alt: 'A model with raised hands wearing the Pavé Diamond Hoop Earrings with a line necklace, rings and bangles', focus: '50% 0%' },
].map((p) => ({ ...p, ids: p.ids.filter((id) => byId[id]) }));
export const portraitsFor = (id) => PORTRAITS.filter((p) => p.ids.includes(id));

// Diamond grading scales (general gemological convention; the Iris grade is what we mark).
export const COLOUR_SCALE = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K–M', 'N–R', 'S–Z'];
// Iris grades clarity by group (VVS, VS, SI), so the scale is drawn in groups too.
export const CLARITY_SCALE = ['FL', 'IF', 'VVS', 'VS', 'SI', 'I'];
export function clarityRange(c) {
  const parts = c.split('–').map((x) => CLARITY_SCALE.indexOf(x.replace(/\d$/, '')));
  return [Math.min(...parts), Math.max(...parts)];
}
export function colourRange(g) {
  const [a, b] = g.split('–');
  return [COLOUR_SCALE.indexOf(a), COLOUR_SCALE.indexOf(b || a)];
}

// Ring sizes: approximate international conversions (inner diameter in mm).
// Shown as guidance only; the Iris team confirms the size before an order (verified on their guide).
export const RING_SIZES = [
  ['4', 14.9, 'H½', 47], ['4.5', 15.3, 'I½', 48], ['5', 15.7, 'J½', 49], ['5.5', 16.1, 'K½', 51],
  ['6', 16.5, 'L½', 52], ['6.5', 16.9, 'M½', 53], ['7', 17.3, 'N½', 54], ['7.5', 17.8, 'O½', 56],
  ['8', 18.2, 'P½', 57], ['8.5', 18.6, 'Q½', 58], ['9', 19.0, 'R½', 60], ['9.5', 19.4, 'S½', 61], ['10', 19.8, 'T½', 62],
].map(([us, dia, uk, eu]) => ({ us, dia, uk, eu, circ: Math.round(dia * Math.PI * 10) / 10 }));
export function sizeFromMeasure(mm, kind) {
  const key = kind === 'circ' ? 'circ' : 'dia';
  return RING_SIZES.reduce((best, s) => (Math.abs(s[key] - mm) < Math.abs(best[key] - mm) ? s : best), RING_SIZES[0]);
}

// Carat-to-diameter guide for round brilliants, as printed in the Iris diamond guide.
export const CARAT_MM = [[0.5, 5.0], [0.75, 5.75], [1, 6.4], [1.5, 7.4], [2, 8.0], [2.5, 8.7], [3, 9.1], [3.5, 9.6], [4, 10.2]];

export const BOUTIQUE = {
  name: 'Iris Diamonds, Al Barsha South Mall',
  lines: ['Al Barsha South Mall, Ground Floor', 'Next to Baskin Robbins, Street 58', 'Al Barsha South First, Dubai'],
  hours: 'Daily, 10:00 AM – 10:00 PM',
  phone: '+971 50 224 0029',
  tel: 'tel:+971502240029',
  email: 'info@irisdiamondsuae.com',
  map: 'https://www.google.com/maps/search/?api=1&query=Iris+Diamonds+Al+Barsha+South+Mall+Dubai',
};
export const whatsapp = (text) => `https://wa.me/971502240029?text=${encodeURIComponent(text)}`;
export const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Another UAE city'];

export const money = (n) => 'AED\u00a0' + Math.round(n).toLocaleString('en-US');
export const carat = (n) => `${n.toFixed(2)}\u00a0ct`;
export function gradeSummary(o) {
  const CLARITY_GROUPS = CLARITY_SCALE;
  const cl = o.clarities.flatMap((c) => c.split('–')).map((c) => CLARITY_GROUPS.indexOf(c.replace(/\d$/, ''))).filter((i) => i >= 0);
  const co = o.grades.flatMap((g) => g.split('–')).map((g) => COLOUR_SCALE.indexOf(g)).filter((i) => i >= 0);
  const span = (scale, idx) => (idx.length ? [...new Set([scale[Math.min(...idx)], scale[Math.max(...idx)]])].join('–\u2060') : '');
  return { clarity: span(CLARITY_GROUPS, cl), colour: span(COLOUR_SCALE, co) };
}
// Every piece reads in the same order everywhere: diamonds, weight, clarity, colour, metal (price sits beside it).
// Disclosure first: "lab-grown" always sits directly before "diamond".
export function specLine(o, { short = false } = {}) {
  if (!o.stones) return '';
  const stones = `${o.stones}\u00a0lab-grown ${o.stones === 1 ? 'diamond' : 'diamonds'}`;
  if (short) return `${stones} · ${carat(o.carats)}`;
  const g = gradeSummary(o);
  // the separator binds to the item before it, so a wrapped line never starts with "·"
  return [stones, carat(o.carats), g.clarity, g.colour, o.material].filter(Boolean).join('\u00a0· ');
}

// Boutique hours are daily 10:00–22:00 Dubai time (UTC+4, no daylight saving).
export function openNow(now = new Date()) {
  const dubai = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000);
  const h = dubai.getHours() + dubai.getMinutes() / 60;
  return h >= 10 && h < 22 ? { open: true, text: 'Open now, until 10 PM' } : { open: false, text: h < 10 ? 'Closed now, opens at 10 AM' : 'Closed now, opens tomorrow at 10 AM' };
}

// Pages the search box can find alongside pieces.
export const PAGES = [
  { title: 'Delivery and exchange', href: '#/services', words: 'delivery same day shipping exchange returns refund buy-back buyback warranty terms policy international' },
  { title: 'Ring size guide', href: '#/guide/sizing', words: 'ring size sizing measure fit guide chart' },
  { title: 'Diamond guide', href: '#/guide', words: 'diamond guide 4cs cut colour color clarity carat lab-grown lab grown natural' },
  { title: 'Visit the boutique', href: '#/boutique', words: 'boutique store shop visit address location hours map al barsha mall dubai contact phone whatsapp' },
  { title: 'Our story', href: '#/story', words: 'story about family heritage history jordan 1974' },
];
