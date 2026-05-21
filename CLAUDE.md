# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MoDaS (Mobility Data Story Suite) transforms CSV mobility data into interactive scrollytelling visualizations. It is a hybrid Python/JavaScript app: a **Streamlit** backend that handles file upload, template selection, and column mapping, and a **Vue 3 + Vite** frontend rendered inside Streamlit as a custom component.

- **Live app:** https://modas-suite.streamlit.app
- **GitHub repo (fork):** https://github.com/naoidapatrick/modas
- **Original upstream:** https://github.com/fluxguide/modas
- **Hosted on:** Streamlit Community Cloud (free tier)
- **Streamlit Cloud dashboard:** https://share.streamlit.io (GitHub account: `naoidapatrick`)

---

## Local development

Two servers must run simultaneously:

```bash
# Terminal 1 — Python backend
source .venv/bin/activate
streamlit run app.py

# Terminal 2 — Vite frontend (custom component dev server)
npm run dev
```

App is served at `http://localhost:8501`. The Vite dev server runs on port 5173 and is consumed by Streamlit via the `story_viewer` component in `components/__init__.py`.

**Before running locally:** set `_RELEASE = False` in `components/__init__.py` so Streamlit points to the Vite dev server instead of `dist/`. Do not commit that change.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
npm install
```

---

## Architecture

### Data flow

1. **`app.py`** — home page; user uploads a CSV. Data is parsed, normalized (columns lowercased), and stored in `st.session_state.data` as a list of dicts. A `columnLabelMap` (normalized_key → original header) is also saved to session state.
2. **`pages/template_selection.py`** — shows template cards (using `st.image` + `st.button` in columns) and calls `score_templates()` from `shared.py` to auto-recommend a template based on column names.
3. **`pages/column_mapping.py`** — lets users remap CSV columns to template-expected field names. The `TEMPLATE_COLUMN_REQUIREMENTS` dict in `shared.py` defines required fields per template.
4. **`pages/simulation_mode.py`** — renders the selected story via the `story_viewer()` custom component, passing `template`, `data`, `columnLabelMap`, and `categoryColours`.

### Streamlit ↔ Vue bridge

`components/__init__.py` declares the Streamlit custom component. In development (`_RELEASE = False`) it points to `http://localhost:5173`; in production (`_RELEASE = True`) it serves from `dist/`. The `dist/` path resolves to `../dist` relative to `components/` — one level up, at the project root. `App.vue` listens for `Streamlit.RENDER_EVENT` to receive `args` (data, template, mode, columnLabelMap, categoryColours) and routes to the correct story component.

### Vue frontend structure

- **`App.vue`** — root component; switches between `ThuringiaApp`, `VRRApp`, `DresdenApp` based on the `template` prop from Streamlit.
- **`src/components/{Thuringia,VRR,Dresden}/`** — one self-contained component tree per story template.
- **`src/composables/`** — Vue composables split by template (e.g. `Thuringia/useDataProcessing.js`, `Thuringia/useMapControls.js`) and shared utilities in `utils.js`.
- **`src/translations.js`** — flat key→`{de, en}` object used by the Dresden template.
- **`src/composables/useColumnLabels.js`** — maps normalized column keys back to original CSV headers for display.

### Path aliases (vite.config.js)

| Alias | Resolves to |
|---|---|
| `@src` | `src/` |
| `@styles` | `styles/` |
| `@components` | `src/components/` |
| `@composables` | `src/composables/` |
| `@img` | `static/img/` |

### Templates

| Key | Story | Data signals used for auto-detection |
|---|---|---|
| `thuringia` | ÖPNV stop accessibility (scrollytelling + Leaflet map) | lat/lon columns, radius columns (100m/200m/300m) |
| `vrr` | Project changes over years (timeline + charts) | `category`, year columns (2022–2024), `label` |
| `dresden` | City survey (pixel-art style, character selection) | satisfaction/rating columns |

`score_templates()` in `shared.py` scores uploaded CSV columns against these signals and recommends the best match.

### Simulation mode editing

The `simulation_mode.py` page listens for a `{"action": "open_data_editor"}` return value from the Vue component and opens a Streamlit dialog for live CSV row editing and per-chart color picking. `CHART_COLUMNS_BY_TEMPLATE` defines which columns are highlighted per chart/range.

### Styling

Global CSS is split across `styles/` (variables, reset, typography, global_styles). `style.css` in the root is loaded by Streamlit pages via `shared.setup_page()`. CSS custom properties are used for Streamlit file uploader label overrides injected via `:root` vars.

---

## Production build

`_RELEASE = True` is set in `components/__init__.py`. The build script in `package.json` runs:

```bash
npm run build   # vite build + cp -r static dist/static
```

Two things happen:
1. Vite bundles all imported JS/CSS/assets into `dist/assets/` with hashed filenames.
2. The entire `static/` folder is copied to `dist/static/` so the Vue component can serve dynamically-referenced images (SVGs referenced via string paths, not imports, are not bundled by Vite).

The `dist/` folder is committed to git — Streamlit Community Cloud has no build step, so built assets must be in the repo.

---

## Deployment — how it works end to end

### Infrastructure

| Layer | What it does |
|---|---|
| GitHub (`naoidapatrick/modas`, branch `main`) | Source of truth — Streamlit Cloud watches this branch |
| GitHub Actions (`.github/workflows/build.yml`) | Builds the Vue frontend and commits `dist/` on every push |
| Streamlit Community Cloud | Clones the repo, installs `requirements.txt`, runs `streamlit run app.py` |

### Push-to-deploy flow

1. You push any change to `main`
2. GitHub Action triggers: runs `npm ci && npm run build` (which includes copying `static/` to `dist/static/`)
3. Action commits the updated `dist/` back to `main` with message `chore: rebuild dist [skip ci]` — the `[skip ci]` prevents an infinite loop
4. If `dist/` didn't change (Python-only changes), the commit is skipped automatically
5. Streamlit Community Cloud detects the new commit and redeploys — usually within 1–2 minutes

### GitHub Action permissions

The Action needs `permissions: contents: write` to push the `dist/` commit back to the repo. This is set at the top of `.github/workflows/build.yml`. Without it the push fails with a 403.

### Manual build (if Action fails or dist/ is out of sync)

```bash
npm run build
git add dist/
git commit -m "chore: rebuild dist"
git push
```

---

## Normal log noise — nothing to worry about

These appear in Streamlit Cloud logs and are all benign:

- **`Please replace use_container_width with width`** — Streamlit 1.54.0 deprecation warning. Spammy but harmless. If it bothers you, replace `use_container_width=True` with `width='stretch'` everywhere.
- **`MediaFileHandler: Missing file ...`** — happens for a few seconds after every redeploy. Streamlit's in-memory image cache is invalidated; users see broken images until they refresh. Clears itself.
- **`Blocked a frame with origin ... gjmnz4vd2y07.statuspage.io`** — Streamlit Cloud loads its own status page in an internal iframe. Browser cross-origin policy blocks it. Nothing to do with this app.
- **`WebSocket connection failed: network connection was lost`** — happens briefly after a redeploy while browsers reconnect. Auto-recovers.

---

## Known issues fixed during setup

- **`st_clickable_images` (v0.0.3)** is incompatible with current Streamlit Cloud — replaced with native `st.image` + `st.button` in `pages/template_selection.py`. Do not re-add that package.
- **`dist/` path** in `components/__init__.py` must be `../dist` (one level up from `components/`), not `../../dist`. The wrong path resolves to `/mount/src/dist` on Streamlit Cloud instead of `/mount/src/modas/dist`.
- **`static/` assets** must be copied into `dist/static/` at build time. SVGs referenced via dynamic string paths in Vue are not bundled by Vite and must be physically present in the component's `path` directory.
- **GIF previews** in the template dialog use `st.image()` with local file paths, not `unsafe_allow_html` `<img>` tags — large GIFs (20–42 MB) fail to load via HTML injection.
- **GitHub Action 403** — the workflow needs `permissions: contents: write` to push commits back. Without it, the build succeeds but the `git push` is rejected.
