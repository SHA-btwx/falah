// Shape Arabic text with HarfBuzz and emit SVG glyph paths, in writing order,
// so the page can draw the calligraphy stroke by stroke with no font loaded.
const fs = require('fs');
const path = require('path');

(async () => {
  const hb = await require('harfbuzzjs');

  const font_data = fs.readFileSync(path.join(__dirname, 'ArefRuqaa-Bold.ttf'));
  const blob = hb.createBlob(font_data);
  const face = hb.createFace(blob, 0);
  const font = hb.createFont(face);
  const upem = face.upem;

  function shape(text) {
    const buf = hb.createBuffer();
    buf.addText(text);
    buf.guessSegmentProperties();
    hb.shape(font, buf);
    const out = buf.json();
    buf.destroy();

    // json() is in visual order, left to right. Lay glyphs out on a cursor,
    // flip y (fonts are y-up), then sort by cluster so index 0 is the first
    // letter written, which for Arabic is the rightmost.
    let x = 0;
    const glyphs = out.map(g => {
      const d = font.glyphToPath(g.g);
      const ox = x + g.dx, oy = g.dy;
      x += g.ax;
      return { cluster: g.cl, d: transform(d, ox, oy) };
    }).filter(g => g.d.trim());
    glyphs.sort((a, b) => a.cluster - b.cluster);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const g of glyphs) {
      const nums = g.d.match(/-?\d*\.?\d+/g).map(Number);
      for (let i = 0; i < nums.length; i += 2) {
        minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
        minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
      }
    }
    return { upem, advance: x, box: [minX, minY, maxX - minX, maxY - minY].map(Math.round), glyphs: glyphs.map(g => g.d) };
  }

  // Move every coordinate pair by (ox, oy) and flip y.
  function transform(d, ox, oy) {
    return d.replace(/([MLQCZ])([^MLQCZ]*)/g, (m, cmd, args) => {
      if (cmd === 'Z') return 'Z';
      const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
      const o = [];
      for (let i = 0; i < n.length; i += 2) o.push(Math.round(n[i] + ox), Math.round(-(n[i + 1] + oy)));
      return cmd + o.join(' ');
    });
  }

  const result = { falah: shape('الفلاح') };
  fs.writeFileSync(path.join(__dirname, 'glyphs.json'), JSON.stringify(result));
  const r = result.falah;
  console.log('upem', r.upem, 'advance', r.advance, 'box', r.box, 'glyphs', r.glyphs.length, 'chars', r.glyphs.join('').length);
})();
