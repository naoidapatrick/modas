# MoDaS — Mobility Data Story Suite

MoDaS is a web application that transforms abstract mobility data into interactive, visual storytelling formats. It was developed as part of the mfund project MoDaS, in collaboration with TU Ilmenau.

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Python 3.10 or higher** — [Download Python](https://www.python.org/downloads/)
  > ⚠️ **Windows users:** During installation, make sure to check **"Add Python to PATH"** before clicking Install. Without this, `python` and `pip` commands won't work in the terminal.
- **Visual Studio Code** — [Download VS Code](https://code.visualstudio.com/)
- **Git** — [Download Git](https://git-scm.com/downloads/)
- **Node.js (includes npm)**
  1. Go to [https://nodejs.org/](https://nodejs.org/)
  2. Click the **LTS** download button (recommended for most users)
  3. Open the downloaded file (`.pkg` on macOS, `.msi` on Windows) and follow the installer steps
  4. Restart VS Code after installation so it picks up the new tools

## How to open a terminal in VS Code

All commands in this guide are run inside the **VS Code terminal**. Here's how to open it:

1. Open VS Code
2. In the top menu, click **Terminal → New Terminal**
3. A terminal panel will appear at the bottom of the screen — this is where you'll type all commands

> 💡 **Tip:** You can open a second terminal (needed later for running the app) by clicking the **+** icon in the top right corner of the terminal panel.

---

To check if you already have them, open your terminal and run:

```bash
python --version
git --version
node --version
npm --version
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/fluxguide/modas.git
cd modas
```

### 2. Create a virtual environment

A virtual environment keeps the project's dependencies isolated from the rest of your system.

```bash
python -m venv .venv
```

Activate it:

- **macOS / Linux:**
  ```bash
  source .venv/bin/activate
  ```
- **Windows:**
  ```bash
  .venv\Scripts\activate
  ```

You should see `(.venv)` appear at the start of your terminal prompt.

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Install JavaScript dependencies

```bash
npm install
```

---



## Running the app

You need to start **both** the Streamlit server and the Vite frontend at the same time. Open **two terminals** in VS Code by clicking the **+** icon in the terminal panel.

**Terminal 1 — Streamlit backend:**

```bash
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
streamlit run app.py
```

**Terminal 2 — Vite frontend:**

```bash
npm run dev
```

The app will open automatically in your browser at `http://localhost:8501`.

---

## How to use it

**Step 1 — Upload your data**

On the home screen, upload a `.csv` file containing your mobility data.

**Step 2 — Select a template**

After submitting your file, you'll be taken to the template selection page. Click on a template preview to see details about it, then select the one that fits your data best. Available templates include: Thuringia, VRR, Dresden, and more.

**Step 3 — Simulate your story**

In simulation mode, your data is loaded into the selected story template. You can interact with and explore how your mobility data is visualised. Use the **"Change file"** button in the top bar to go back to the start and upload a new file.

---

## Project structure

```
modas/
├── app.py                  # Main entry point (home / upload screen)
├── shared.py               # Shared layout helpers (top bar, page setup)
├── style.css               # Global styles
├── pages/
│   ├── template_selection.py   # Template browsing and selection
│   ├── simulation_mode.py      # Interactive story simulation
│   └── about_modas.py          # About page
├── components/             # Reusable UI components
├── src/                    # Core logic and data processing
├── static/                 # Images, GIFs, and other static assets
├── styles/                 # Additional styles
└── .streamlit/             # Streamlit configuration
```

---

## Requirements

All dependencies are listed in `requirements.txt`. Key packages:

- [Streamlit](https://streamlit.io/) — web app framework
- [Pandas](https://pandas.pydata.org/) — data handling
- [Pillow](https://python-pillow.org/) — image processing
- [st-clickable-images](https://github.com/vivien000/st-clickable-images) — clickable template previews

---

## Troubleshooting

**`streamlit: command not found`**
Make sure your virtual environment is activated (you should see `(.venv)` in your terminal).

**The app opens but shows a blank page or missing styles**
Make sure you're running the app from the root of the project directory (`cd modas` before running `streamlit run app.py`).

**Uploaded file causes an error**
The app expects a `.csv` file. Make sure your file is comma-separated and not corrupted.
