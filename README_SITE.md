AART Gallery — Neo‑Brutalist Swiss‑style demo

This is a small static gallery using images found in `research/references/`.

How to build

1. Install dependencies if you haven't already (this repository contains quality-gate tooling; installing deps is optional for the static site itself):

```bash
npm install
```

2. Build the static site into `build/`:

```bash
npm run build
```

3. Preview the build directory (you can use a simple static server like `serve`):

```bash
npx serve build
```

Files

- `index.html` — site markup
- `styles.css` — neo‑brutalist / swiss styling
- `script.js` — lightbox + navigation
- `research/references/*` — artwork images (copied into `build/references/` during `npm run build`)

Notes

- The `build` script is a simple copy operation; change it to your real build flow if you later add a bundler.
- The design intentionally uses high-contrast typography, large scale headings, and asymmetric layout to echo swiss and neo‑brutalist aesthetics.
