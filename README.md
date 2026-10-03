# Falah Collective

Source for [falahcollective.com](https://www.falahcollective.com), the link in
Shabir's Instagram bio. The bio asks "if your life was a book, what would you
name this chapter?" and this page is the answer: الفلاح, Falah, success.

## The story

One chapter, told from night to sunrise as you scroll. Each scene pins to the
screen while its art plays out, then lets go:

1. **The title page.** الفلاح writes itself stroke by stroke, then *Falah*,
   then *success*
2. **The hook.** "Every chapter needs a name." over an eight point star that
   draws itself
3. **The field.** The word comes from farming: split, plant, water, wait. A
   field opens, seeds fall, rain falls, and a sprout breaks through at dawn
4. **The root.** ف ل ح branch into *falaha* (to split the earth), *fallah*
   (a farmer) and *falah* (success)
5. **The day.** The sun crosses the sky past the five prayers. Then the two
   lines of the adhan: "come to prayer", then "come to success"
6. **The rings.** Wealth in the middle, then faith, character, family, the
   people you affect and the person you become
7. **Fallen, return.** The letters of *fallen* drop off the screen, and
   *return* climbs back up
8. **The label.** The Falah Collective seal stamps down. It is a label for
   everything Shabir does, with one rule, *Strive for success in everything
   you take part in*, and anyone who lives by that rule is part of it
9. **Your turn.** The bio question goes back to the reader. What they type
   appears on a book cover, and "Send it to me" copies it and opens a chat
   with Shabir on Instagram. Nothing is stored or sent anywhere else

## How it is built

`index.html` is the whole site, generated from `src/`:

- `src/page.html` is the template: markup, styles and script
- `src/build.js` fills in the generated art (the calligraphy paths, the field's
  furrows, seeds and rain, the prayer marks on the sun's path, the rings) and
  writes `index.html`. It refuses to write a page containing an em dash
- `src/glyphs.json` holds الفلاح as SVG paths, shaped with HarfBuzz from
  Aref Ruqaa Bold. The title needs no font download and can be drawn stroke
  by stroke. To reshape it, put `ArefRuqaa-Bold.ttf` in `src/`, run
  `npm i harfbuzzjs` there, then `node src/shape.js`

Edit `src/page.html`, then run `node src/build.js`. `src/` is not deployed
(see `.vercelignore`).

Scroll animation is GSAP 3.13 with ScrollTrigger, vendored in `js/` so the
page has no runtime CDN. Fonts are Aref Ruqaa, Cormorant Garamond and
Instrument Sans from Google Fonts. Vercel Analytics is the only other script.

## Rules worth keeping

- **Phone first.** Every scene is designed at 390 px wide, then checked on a
  laptop and a desktop
- **No jump at the end of the page.** The sky is a set of fixed layers sized
  to the largest viewport (`lvh`), scenes are sized to the smallest (`svh`),
  overscroll bounce is off, and ScrollTrigger ignores the phone address bar
  showing and hiding
- **Scene tweens are always `to()`.** Start states are set up front with
  `gsap.set`. ScrollTrigger rewinds a scene when it re-measures, and a
  `from()` tween that has not started would show its final state too early
- **Reduced motion gets a static page.** The `motion` class is only added when
  motion is allowed and GSAP has loaded. Without it, every scene reads top to
  bottom with its art in its finished state
- **Gold** is for Arabic, key words, the seal and the one button
- **Nothing about what is being built** is mentioned

## Deployment

Static site on Vercel. Push to `main` and Vercel deploys it, no build command.
Run `node src/build.js` before committing so `index.html` matches `src/`.
