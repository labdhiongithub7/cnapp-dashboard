# CNAPP Dashboard

React + Vite + Zustand. The dashboard is built from a JSON file (`src/data/dashboard.json`): categories, each with multiple widgets.

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev      # open http://localhost:5173
```

Production build: `npm run build` then `npm run preview`.

## Features

- Dashboard generated from `src/data/dashboard.json` (categories contain widgets).
- `+ Add Widget` (per category or top bar) opens a side panel with category tabs. Tick or untick widgets, or enter a widget name and text to create a new widget in the selected category. Press Confirm to apply.
- Each widget has a cross icon that removes it. Unticking it in the panel does the same.
- Search box filters all widgets by name or text.
- State is kept in a Zustand store and persisted to localStorage. The refresh button resets to the JSON defaults.
