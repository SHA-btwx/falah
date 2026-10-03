// Builds falah-site/index.html from page.html, filling in the generated art:
// the calligraphy paths, the field, the sun's path and the rings.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'index.html');
const g = require('./glyphs.json').falah;
const r1 = n => Math.round(n * 10) / 10;

// ---------- calligraphy
const [bx, by, bw, bh] = g.box;
const pad = 40;
const VB = `${bx - pad} ${by - pad} ${bw + 2 * pad} ${bh + 2 * pad}`;
const PATHS = g.glyphs.map(d => `<path d="${d}"/>`).join('');
const DRAW = g.glyphs.map(d => `<path class="gl" d="${d}"/>`).join('');

// ---------- field: furrows run from the bottom edge to just under the horizon
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const vp = [500, 200];
let FURROWS = '';
for (let b = -1100; b <= 2100; b += 160) {
  const ex = vp[0] + 0.05 * (b - vp[0]), ey = vp[1] + 0.05 * (600 - vp[1]);
  FURROWS += `<path class="draw furrow" d="M${b} 600 L${r1(ex)} ${r1(ey)}"/>`;
}
let SEEDS = '';
for (const b of [180, 340, 500, 660, 820]) for (const t of [0.36, 0.6, 0.86]) {
  if (b === 500 && t === 0.86) continue; // the sprout grows here
  const x = vp[0] + t * (b - vp[0]), y = vp[1] + t * (600 - vp[1]);
  SEEDS += `<circle class="seed" cx="${r1(x)}" cy="${r1(y)}" r="${r1(2 + 5 * t)}"/>`;
}
let DROPS = '';
for (let i = 0; i < 28; i++) {
  const x = 180 + rand() * 640, y = -40 - rand() * 160;
  DROPS += `<path class="drop" d="M${r1(x)} ${r1(y)} l-3 26"/>`;
}

// ---------- the day: the sun's path, centre (400, 640), radius 330
const C = [400, 640], R = 330;
const PRAYERS = [
  ['Fajr', 'dawn', 186], ['Dhuhr', 'midday', 86], ['Asr', 'afternoon', 42],
  ['Maghrib', 'sunset', -4], ['Isha', 'night', -40],
];
const at = (deg, r) => [C[0] + r * Math.cos(deg * Math.PI / 180), C[1] - r * Math.sin(deg * Math.PI / 180)];
let MARKS = '';
for (const [name, time, deg] of PRAYERS) {
  const [px, py] = at(deg, R), [lx, ly] = at(deg, R - 78);
  MARKS += `<g class="mark" data-deg="${deg}"><circle class="dot" cx="${r1(px)}" cy="${r1(py)}" r="6"/>` +
    `<text class="p-name" x="${r1(lx)}" y="${r1(ly)}">${name}</text>` +
    `<text class="p-time" x="${r1(lx)}" y="${r1(ly + 34)}">${time}</text></g>`;
}
const [sx, sy] = at(86, R);

// ---------- the rings
const LABELS = ['Faith', 'Character', 'Family', 'The people you affect', 'The person you become'];
let RINGDEFS = '', RINGS = '';
LABELS.forEach((label, i) => {
  const r = 80 + (i + 1) * 80, a = r + 10;
  RINGDEFS += `<path id="ringArc${i}" d="M${500 - a} 500 A${a} ${a} 0 0 1 ${500 + a} 500"/>`;
  RINGS += `<circle class="draw ring" cx="500" cy="500" r="${r}"/>` +
    `<text class="ring-label"><textPath href="#ringArc${i}" startOffset="50%">${label}</textPath></text>`;
});

let html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
const fill = { VB, PATHS, DRAW, FURROWS, SEEDS, DROPS, MARKS, SUN: `${r1(sx)} ${r1(sy)}`, RINGDEFS, RINGS };
html = html.replace(/%%(\w+)%%/g, (m, k) => {
  if (!(k in fill)) throw new Error('no fill for ' + k);
  return fill[k];
});
if (/2014/.test(html)) throw new Error('em dash in page');
fs.writeFileSync(OUT, html);
console.log('wrote', OUT, Math.round(html.length / 1024) + 'KB');
