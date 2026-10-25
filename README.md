# Falah Collective

Source for [falahcollective.com](https://www.falahcollective.com), the link in
Shabir's Instagram bio. The bio asks "if your life was a book, what would you
name this chapter?" and this page is the answer: الفلاح, Falah, success.

## The story

One chapter, told from night to sunrise. The story plays on a single pinned
stage, one page at a time, like Instagram Stories: a bar of seven segments at
the top fills as you go, and every swipe or scroll lands on the next page.

1. **The title page.** الفلاح writes itself stroke by stroke, then *Falah*,
   then *success*
2. **The hook.** "Every chapter needs a name. I named mine Falah." A medallion
   draws itself around the name, and a promise sits under it: "At the end,
   you'll name yours."
3. **The field.** The word comes from farming: split, plant, water, wait. Most
   days nothing shows, the farmer comes back anyway, and one morning a sprout
   breaks through
4. **The root.** ف ل ح branch into *falaha* (to split the earth), *fallah*
   (a farmer) and *falah* (success). "So falah isn't a place you reach. It's a
   field you keep coming back to."
5. **The day.** The sun crosses the sky past the five prayers. Then the two
   lines of the adhan: "come to prayer", then "come to success"
6. **The rings.** Wealth in the middle, then the camera pulls back through
   faith, character, family, the people you affect and the person you become.
   "How wide is yours?"
7. **Fallen, return.** "Maybe you have too." The letters of *fallen* drop
   away, and *return* climbs back up
8. **The label.** The medallion returns softly with "Falah Collective" under
   it. Not a company, a label on everything Shabir does, with one rule,
   *Strive for success in everything you take part in*. Lights leave it and
   join up: anyone who lives by the rule is part of it. That's the movement
9. **Your turn.** The bio question goes back to the reader. What they type
   appears on a book cover, and "Send it to me" copies it and opens a chat
   with Shabir on Instagram. Nothing is stored or sent anywhere else

Every scene ends on an open loop (a question, a promise, a "but") so there is
always a reason to turn one more page. Copy stays at a third grade reading
level.

## Moving through it

- **Swipe or scroll** lands on the next page (snap to labels, `inertia: false`
  so a hard flick still moves one page)
- **Tap** the right side of the screen for the next page, the left side to go
  back. Arrow keys do the same. On a laptop, a ring follows the mouse and says
  "Next" or "Back"
- **The nudge.** If the reader stops, a chevron appears. The first time it
  says "Tap or scroll to turn the page"
- **After the last page** a tap or scroll goes on to the chapter box. The
  stars and dust quieten there so the last page reads cleanly

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

- **Phone first.** Every scene is designed at 390 px wide, then checked on an
  iPhone SE (375 x 667) and a laptop (1440 x 900)
- **Nothing ever overlaps.** Each scene is a three row grid: words at the top,
  art in the middle, words at the bottom. Words in the middle of the screen
  only appear once the art has gone. Every part is pinned to column 1, or
  the middle words open a second column and squeeze the others. A beat always
  finishes leaving before the next one arrives (`outs()` waits for the
  slowest of a group)
- **One timeline.** `T` is a write head: `inn()` and `out()` move it on,
  `rest()` adds a page label where the reader can stop. Sky colours and the
  stars' mood are tweened on the same timeline
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

## Checking it

Two Playwright scripts live outside the repo, in
`C:/Users/shabi/.claude/tools/playwright/`:

- `falah-v3.mjs <outdir> <width> <height> [mobile] [shots]` screenshots every
  page, then steps through the whole story every 0.1 s and reports any words
  over other words, words off the screen, or art left under middle words
- `falah-v3-ui.mjs <outdir>` tests taps, arrow keys, snapping, the move into
  the chapter box, the box itself, and the reduced motion page

`window.__falah` exposes the timeline and ScrollTrigger for them.

## Deployment

Static site on Vercel. Push to `main` and Vercel deploys it, no build command.
Run `node src/build.js` before committing so `index.html` matches `src/`.
