# Falah Collective

Source for [falahcollective.com](https://falahcollective.com), the link in
Shabir's Instagram bio. The bio asks "if your life was a book, what would you
name this chapter?" and this page is the answer: الفلاح, Falah, success.

## Structure

The whole site is one self-contained `index.html`: markup, styles and a few
lines of script inline. Two external dependencies: Google Fonts (Aref Ruqaa for
Arabic, Literata for English) and Vercel Analytics. No build step.

The page reads as one chapter, in four parts:

1. The title page: الفلاح, Falah, success
2. The word: the root ف ل ح, shared with *fallah*, a farmer
3. The call: "come to prayer, come to success" from the adhan
4. Shabir's own reason, ending on the rule "Strive for success in everything
   you take part in", then the bio question turned back to the reader

Design rules worth keeping:

- The background is one gradient the length of the page, night at the top and
  sunrise at the bottom, so scrolling is the dawn. No scroll script
- Gold is used for Arabic only. Every English word is in paper colour
- There is one animation: the title inks in right to left, the way Arabic is
  written. It waits for the calligraphy font, and is skipped for reduced motion
- Nothing about what is being built is mentioned

## Deployment

Static site on Vercel. Push to `main` and Vercel deploys it, no build command.
