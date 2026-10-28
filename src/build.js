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

// ---------- field: furrows run from just under the horizon to the bottom edge,
// so they draw towards the viewer
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const vp = [500, 200];
const onGround = (bx, t) => [vp[0] + t * (bx - vp[0]), vp[1] + t * (600 - vp[1])];
let FURROWS = '', STREAKS = '';
for (let b = -1100; b <= 2100; b += 160) {
  const [ex, ey] = onGround(b, 0.05);
  const d = `M${r1(ex)} ${r1(ey)} L${b} 600`;
  FURROWS += `<path class="draw furrow" d="${d}"/>`;
  STREAKS += `<path class="streak" d="${d}"/>`;
}
// soil: small clods, bigger as they come closer
let CLODS = '';
for (let i = 0; i < 90; i++) {
  const t = 0.04 + Math.pow(rand(), 0.8) * 0.96, [x, y] = onGround(-900 + rand() * 2800, t), rx = 0.8 + 4.2 * t;
  CLODS += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(rx * 0.42)}" opacity="${r1(0.3 + rand() * 0.7)}"/>`;
}
// seeds, each with a ring for where it lands and a small sprout for the end
let SEEDS = '', RIPS = '', SPROUTS = '';
for (const b of [20, 180, 340, 500, 660, 820, 980]) for (const t of [0.32, 0.5, 0.7, 0.9]) {
  if (b === 500 && t === 0.7) continue; // the sprout grows here, clear of the nudge
  const [x, y] = onGround(b, t), k = r1(0.35 + 1.1 * t);
  SEEDS += `<circle class="seed" cx="${r1(x)}" cy="${r1(y)}" r="${r1(2 + 5 * t)}"/>`;
  RIPS += `<ellipse class="f-rip" cx="${r1(x)}" cy="${r1(y)}" rx="${r1(12 + 34 * t)}" ry="${r1(4 + 11 * t)}"/>`;
  SPROUTS += `<g transform="translate(${r1(x)} ${r1(y)}) scale(${k})"><g class="sp">` +
    '<path class="sp-stem" d="M0 0 C -2 -10 2 -20 0 -30"/>' +
    '<path class="sp-leaf" d="M0 -18 C -8 -19 -15 -27 -15 -35 C -6 -33 0 -26 0 -18 Z"/>' +
    '<path class="sp-leaf" d="M0 -25 C 8 -28 14 -36 13 -44 C 5 -41 0 -34 0 -25 Z"/></g></g>';
}
let DROPS = '';
for (let i = 0; i < 120; i++) {
  // two in three fall in the middle, which is all a phone shows
  const x = i % 3 ? 120 + rand() * 760 : -150 + rand() * 1300, y = -40 - rand() * 300;
  DROPS += `<path class="drop" d="M${r1(x)} ${r1(y)} l-8 54" opacity="0"/>`;
}
let SPLASHES = '';
for (let i = 0; i < 40; i++) {
  const t = 0.25 + rand() * 0.75, [x, y] = onGround(80 + rand() * 840, t), rx = 6 + 18 * t;
  SPLASHES += `<ellipse class="splash" cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(rx * 0.36)}"/>`;
}
// footprints, walking in from the horizon to the spot where the sprout comes up
let STEPS = '';
for (let i = 0; i < 10; i++) {
  const t = 0.14 + i * 0.056, side = i % 2 ? 1 : -1, [x, y] = onGround(590, t), rx = 3.5 + 9 * t;
  STEPS += `<ellipse class="step" cx="${r1(x + side * (5 + 14 * t))}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(rx * 0.45)}"/>`;
}
// cracks of light around the sprout
let CRACKS = '';
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + 0.3, len = 50 + rand() * 60;
  let x = 500, y = 480, d = `M500 480`;
  for (let j = 1; j <= 3; j++) {
    const aa = a + (rand() - 0.5) * 0.7, l = len / 3;
    x += Math.cos(aa) * l; y += Math.sin(aa) * l * 0.34;
    d += ` L${r1(x)} ${r1(y)}`;
  }
  CRACKS += `<path class="draw crack" d="${d}"/>`;
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
  const r = 80 + (i + 1) * 72, a = r + 10;
  RINGDEFS += `<path id="ringArc${i}" d="M${500 - a} 500 A${a} ${a} 0 0 1 ${500 + a} 500"/>`;
  RINGS += `<circle class="draw ring" cx="500" cy="500" r="${r}"/>` +
    `<text class="ring-label"><textPath href="#ringArc${i}" startOffset="50%">${label}</textPath></text>`;
});

let html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
const fill = { VB, PATHS, DRAW, FURROWS, STREAKS, CLODS, SEEDS, RIPS, SPROUTS, DROPS, SPLASHES, STEPS, CRACKS, MARKS, SUN: `${r1(sx)} ${r1(sy)}`, RINGDEFS, RINGS };
html = html.replace(/%%(\w+)%%/g, (m, k) => {
  if (!(k in fill)) throw new Error('no fill for ' + k);
  return fill[k];
});
if (/\u2014/.test(html)) throw new Error('em dash in page');
fs.writeFileSync(OUT, html);
console.log('wrote', OUT, Math.round(html.length / 1024) + 'KB');
