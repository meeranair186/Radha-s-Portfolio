# Radha — *Hello, I Am*

A scrollytelling portfolio built around one idea: **just me, my headphones, and my
playlist against the entire world** — told as a ride on the Mumbai local.

It's a single, scroll-driven story across six "pages", using hand-drawn sketches and
an organic, curated-chaos aesthetic.

## The journey (six pages)

1. **Hello** — the `HELLO, I AM Radha` name tag. As you scroll, it zooms out…
2. **Thane → Navi Mumbai** — a portrait wearing the tag on the chest, headphones,
   tote bag, one hand on the train handle. Notes for home (Thane) and NIFT Mumbai.
3. **The Rush** — pull back into the daily local-train crush; a bio card slides in.
4. **Likes** — a shocked beat, then the tote spills open: crochet, my playlist,
   Chupa Chups.
5. **Dislikes** — the crumpled paper opens: maths, cold climate, living alone.
6. **Next Stop: Bhubaneswar** — a Mumbai-local LED display, and a place to say hi.

A little route map at the bottom doubles as a scroll-progress indicator.

## Tech

- **Node.js only.** Targeted at **Node 24** and **npm 11** (see `engines` in
  `package.json`).
- [Vite](https://vitejs.dev/) for dev/build.
- [GSAP](https://gsap.com/) + ScrollTrigger for the scrubbed, crossfading story.
- No backend — it builds to static files you can host anywhere.

## Getting started

```bash
# use Node 24 / npm 11
node -v   # v24.x
npm -v    # 11.x

npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
index.html              # markup for all six panels + the route map
src/
  main.js               # preloading + the GSAP ScrollTrigger story
  style.css             # palette, handwritten fonts, sketchy styling
public/sketches/        # the hand-drawn scans used in the story
scripts/shoot.mjs       # optional: screenshot the scroll states (dev aid)
```

## Customizing / replacing placeholders

Everything that's a placeholder is easy to swap:

- **Sketches** live in `public/sketches/`. Replace any file with your own (keep the
  same filename, or update the `src` in `index.html` and the `SKETCHES` list in
  `src/main.js`). White backgrounds are dropped automatically via
  `mix-blend-mode: multiply`, so scans on white paper just work.
- **Bio text** is in `index.html` inside `.bio-box`.
- **Contact links** (email / Instagram / Behance) are in the `.train-display__ticker`
  in `index.html` — they're placeholders (`hello@example.com`, `#`) right now.
- **Colours & fonts** are CSS variables at the top of `src/style.css`
  (`--paper`, `--red`, `--mustard`, `--teal`, the handwritten font stack, etc.).
- **Pacing** of the story lives in `src/main.js` (the GSAP timeline). The total
  scroll length is `track.style.height` near the top of `buildStory()`.

## Accessibility

If the visitor has **Reduce Motion** turned on, the scrubbed animation is skipped and
the same content is shown as a calm, top-to-bottom page.

## Optional: visual QA screenshots

`scripts/shoot.mjs` drives a local Chrome (via `puppeteer-core`) to screenshot the
story at several scroll positions into `shots/`. It expects Chrome at
`/usr/bin/google-chrome-stable` — adjust the path for your machine.

```bash
npm run dev          # in one terminal
node scripts/shoot.mjs
```
