# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **single static front-end app** (Vite + GSAP/ScrollTrigger), no backend, no
database, no automated tests, and no lint config. It builds to static files in `dist/`.

### Node version (important gotcha)
- `package.json` `engines` requires **Node >=24 / npm >=11**.
- The VM's default `node` on `PATH` is the system `/exec-daemon/node` (**v22**), which takes
  precedence over nvm. Node 24 is installed via nvm and made the default for new login shells
  by a `PATH` prepend in `~/.bashrc`.
- If `node -v` ever reports v22 in a non-login shell, prepend Node 24 manually:
  `export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"`.

### Commands (see `package.json` scripts)
- Dev server: `npm run dev` → http://localhost:5173/
- Production build: `npm run build` → `dist/`
- Preview built site: `npm run preview` → http://localhost:4173/
- There is **no lint and no test** setup; `npm run build` is the closest thing to a check.

### Notes
- `scripts/shoot.mjs` (`node scripts/shoot.mjs`) is an optional visual-QA aid that drives Chrome
  via `puppeteer-core` and expects Chrome at `/usr/bin/google-chrome-stable`; it is not part of
  the normal dev/build flow.
