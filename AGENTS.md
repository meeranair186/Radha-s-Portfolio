# AGENTS.md

## Cursor Cloud specific instructions

This is a static frontend ("Radha — *Hello, I Am*"), a Vite + GSAP scrollytelling
portfolio. There is no backend, database, or API — only a single web frontend.

### Node version (important gotcha)

The project requires **Node >=24 / npm >=11** (see `engines` in `package.json`).
Node 24 is installed via `nvm`, but the VM's default `node` on `PATH`
(`/exec-daemon/node`) is **v22** and takes priority. Before running any
`npm`/`vite` command in a shell, activate Node 24 and put it first on `PATH`:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
nvm use 24
export PATH="$(nvm which 24 | xargs dirname):$PATH"
node -v   # should print v24.x
```

The update script already runs `npm install` under Node 24, so dependencies are
present at session start; the step above is only needed for interactive shells.

### Running it

Standard scripts (see `package.json`): `npm run dev` (dev server on
http://localhost:5173, also exposed on the network host), `npm run build`
(static build → `dist/`), `npm run preview` (serves the prod build on port 4173).

There is **no lint script** and **no automated test suite**. To verify changes,
run the dev server and exercise the scroll-driven story in a browser, or run
`npm run build` to confirm it compiles.

The optional `scripts/shoot.mjs` screenshot helper needs Chrome at
`/usr/bin/google-chrome-stable` and is not required for normal development.
