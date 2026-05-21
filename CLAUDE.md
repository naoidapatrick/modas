# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MoDaS (Mobility Data Story Suite) transforms CSV mobility data into interactive scrollytelling visualizations. It is a hybrid Python/JavaScript app: a **Streamlit** backend that handles file upload, template selection, and column mapping, and a **Vue 3 + Vite** frontend rendered inside Streamlit as a custom component.

## Running the app

Two servers must run simultaneously:

```bash
# Terminal 1 — Python backend
source .venv/bin/activate
streamlit run app.py

# Terminal 2 — Vite frontend (custom component dev server)
npm run dev
```

App is served at `http://localhost:8501`. The Vite dev server runs on port 5173 and is consumed by Streamlit via the `story_viewer` component declared in `components/__init__.py`.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
npm install
```

## Architecture

### Data flow

1. **`app.py`** — home page; user uploads a CSV. Data is parsed, normalized (columns lowercased), and stored in `st.session_state.data` as a list of dicts. A `columnLabelMap` (normalized_key → original header) is also saved to session state.
2. **`pages/template_selection.py`** — shows template cards and calls `score_templates()` from `shared.py` to auto-recommend a template based on column names.
3. **`pages/column_mapping.py`** — lets users remap CSV columns to template-expected field names. The `TEMPLATE_COLUMN_REQUIREMENTS` dict in `shared.py` defines required fields per template.
4. **`pages/simulation_mode.py`** — renders the selected story via the `story_viewer()` custom component, passing `template`, `data`, `columnLabelMap`, and `categoryColours`.

### Streamlit ↔ Vue bridge

`components/__init__.py` declares the Streamlit custom component. In development (`_RELEASE = False`) it points to `http://localhost:5173`; in production it serves from the `dist/` build. `App.vue` listens for `Streamlit.RENDER_EVENT` to receive `args` (data, template, mode, columnLabelMap, categoryColours) and routes to the correct story component.

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

## Production build

`_RELEASE = True` is already set in `components/__init__.py`. Build the Vue frontend with:

```bash
npm run build   # outputs to dist/
```

Streamlit then serves assets from `dist/` instead of the Vite dev server. In local dev, flip `_RELEASE = False` temporarily so it points to the Vite dev server on port 5173.

## Deployment (Streamlit Community Cloud — free)

**Push-to-deploy is configured.** The flow on every push to `main`:
1. `.github/workflows/build.yml` runs `npm ci && npm run build`
2. The Action commits the updated `dist/` folder back to `main` with `[skip ci]` to avoid looping
3. Streamlit Community Cloud detects the new commit and redeploys automatically

**One-time setup** (already done in code, just needs the hosting side):
1. Go to [share.streamlit.io](https://share.streamlit.io), sign in with GitHub
2. Click **New app** → select the repo → set branch to `main` → set main file to `app.py`
3. Deploy — done

After that, pushing any code change to `main` triggers the full rebuild and redeploy with no manual steps.

**If you changed only Python files:** the Action still runs but `git diff --staged --quiet` short-circuits the commit if `dist/` didn't change — no unnecessary commits.

**Local dev reminder:** set `_RELEASE = False` in `components/__init__.py` while developing (don't commit that change).
