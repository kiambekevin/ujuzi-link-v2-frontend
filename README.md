# Ujuzi Link — Frontend (React + Vite)

React frontend for the Ujuzi Link platform (Ministry of Labour and Social Protection, Kenya),
styled after the official site at https://ujuzilink.go.ke/.

## Stack

- Vite 5, React 18, react-router-dom 6, axios
- Font Awesome 6 (CDN), Google Fonts (Manrope headings / Inter body)
- Design tokens: purple brand (`#4b0082` primary, `#c084fc` / `#9333ea` accents)

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
```

The dev server proxies `/api` to the Django backend at `http://127.0.0.1:8000` by default.
To point at a different backend, set the env var before starting Vite:

```bash
VITE_PROXY_TARGET=http://127.0.0.1:8001 npm run dev
```

For a deployed build, set `VITE_API_BASE_URL` to the backend origin (e.g. `https://api.ujuzilink.go.ke`)
and serve `dist/`.

## Auth flow

- Login accepts email **or** phone in one `identifier` field (`POST /api/auth/token/`)
- JWT access/refresh tokens stored in localStorage; a 401 interceptor refreshes silently once
- Routes are role-guarded: trainee `/app`, organisations `/app/org`, ministry admin `/app/admin`
