## Analytics Dashboard with Filters

Modern analytics dashboard built with React (Vite) + TailwindCSS. It renders interactive charts and refetches analytics data whenever filters change. Includes dark mode and a one-click “Export Report” PDF feature.

## Features

- **React Hooks**: `useState`, `useEffect`, `useMemo`, `useCallback`
- **API Integration (Axios)**: `GET /analytics` with query params
- **Dynamic Filtering**: date range, category, region, sort
- **Data Visualization**: Recharts (Line, Bar, Pie)
- **Export PDF**: html2canvas + jsPDF
- **Dark Mode**: Context API + localStorage persistence
- **Performance**: memoized components (`React.memo`) + memoized transforms (`useMemo`)

## Tech Stack

- **React** (Vite)
- **JavaScript**
- **TailwindCSS**
- **Axios**, **Recharts**, **React Icons**, **html2canvas**, **jsPDF**

## Installation

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Folder Structure

```text
src/
  components/
    ChartCard.jsx
    FilterPanel.jsx
  pages/
    Dashboard.jsx
  services/
    api.js
  hooks/
    useAnalytics.js
  utils/
    exportPDF.js
  context/
    ThemeContext.jsx
  App.jsx
  main.jsx
```

## API Notes (Mock-Friendly)

The configured base URL is `https://mock-api.com`.

- If that endpoint is reachable, the app will render the real response from `GET /analytics`.
- If it is not reachable (common for mock URLs), the app **falls back to local mock data** while still exercising the full Axios request path and dynamic filtering logic.

Expected response shape:

```json
{
  "traffic": [120, 200, 150, 300, 250],
  "sales": [
    { "category": "Electronics", "value": 5000 },
    { "category": "Clothing", "value": 3000 },
    { "category": "Books", "value": 2000 }
  ],
  "users": [
    { "region": "Asia", "value": 40 },
    { "region": "Europe", "value": 25 },
    { "region": "America", "value": 35 }
  ]
}
```

## Screenshots

Add your screenshots here:

- `./screenshots/dashboard-light.png`
- `./screenshots/dashboard-dark.png`

## Deployment (Vercel / Netlify)

### Build

```bash
npm run build
```

Deploy the generated `dist/` directory.

### Vercel

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Output directory**: `dist`

### Netlify

- **Build command**: `npm run build`
- **Publish directory**: `dist`

