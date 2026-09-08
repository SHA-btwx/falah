# Falah Collective

Source for [falahcollective.com](https://falahcollective.com) — a single-page, restrained typographic editorial site built around the Arabic concept of *falah* (success through cultivation).

## Structure

The entire site is one self-contained `index.html`: markup, styles, and interaction scripts are all inline, with two external dependencies (Google Fonts for Fraunces / Instrument Sans / Aref Ruqaa, and Vercel Analytics). No build step is required.

- Seven numbered chapters, each a `<section data-ch="n">`, tracked by a fixed Arabic-numeral rail and a scroll progress bar
- Scroll-triggered reveal animations via `IntersectionObserver`, with a `prefers-reduced-motion` fallback
- A "the day" sequence (the five daily prayers) that shifts the section's background tone as each one scrolls into view

## Deployment

Deployed on Vercel as a static site — push to `main` and Vercel picks it up directly, no build command needed.
