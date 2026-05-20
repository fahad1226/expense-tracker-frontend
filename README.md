# ExpenseTracker — Frontend

Web client for **ExpenseTracker**: expense tracking, budgets, categories, recurring expenses, analytics, and reports. It talks to a Laravel API (Sanctum token auth) and uses a marketing landing page plus an authenticated app shell.

## Stack

- **Next.js** 16 (App Router, `proxy.ts` for route guards)
- **React** 19, **TypeScript**
- **Tailwind CSS** v4
- **TanStack Query** for server state
- **Axios** for HTTP, **js-cookie** for the auth token
- **Framer Motion** (landing), **Recharts** (dashboards), **Sonner** (toasts)

## Prerequisites

- **Node.js** 20+ (recommended; matches `@types/node` in the repo)
- **npm** (or compatible package manager)
- A running **ExpenseTracker API** (Laravel + Sanctum). Point `NEXT_PUBLIC_API_BASE_URL` at that API’s base URL (including `/api` if that is how your backend is mounted).

## Environment variables

Create **`.env.local`** in the project root (never commit secrets). Typical values for local development with Laravel on port 8000:

| Variable                       | Required           | Description                                                                                                   |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`     | Yes                | API base URL, e.g. `http://localhost:8000/api` or `https://expense-tracker-backend.test/api`                  |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth client ID (Web application)                                                                      |
| `NEXT_PUBLIC_SUPPORT_EMAIL`    | No                 | Shown in help content; defaults to a placeholder if unset                                                     |
| `SUPPORT_CONTACT_WEBHOOK_URL`  | No                 | Optional webhook for `/api/help/contact` in production                                                        |
| `IMAGES_ALLOW_LOCAL_IP`        | No                 | Set to `true` in production if you need `next/image` to load from local IP hosts (dev allows this by default) |

Restart the dev server after changing env vars.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose                        |
| --------------- | ------------------------------ |
| `npm run dev`   | Development server (Turbopack) |
| `npm run build` | Production build               |
| `npm run start` | Serve the production build     |
| `npm run lint`  | ESLint                         |

## Authentication and routing

- The **auth token** is stored in a cookie named `auth_token` (see `config/api.client.ts`).
- **`proxy.ts`** (Next.js “proxy” convention) enforces:
    - **Protected routes:** `/dashboard` and `/expenses` redirect to `/login?redirect=…` when there is no token.
    - **Guest-only routes:** `/login` and `/signup` redirect to `/dashboard` when a token is present.
- The **landing page** reads the same cookie on the server to hide “Sign in” and show **Dashboard** when you are already logged in.

## App routes (overview)

| Area      | Paths                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Marketing | `/`                                                                                                                                      |
| Auth      | `/login`, `/signup`                                                                                                                      |
| Core app  | `/dashboard`, `/expenses/list`, `/expenses/new`, `/categories`, `/budgets`, `/recurring`, `/analytics`, `/reports`, `/settings`, `/help` |

## Project layout

```
app/                 # App Router pages, layouts, Route Handlers (e.g. api/help)
components/          # UI by feature (dashboard, account, landing, …)
config/              # api.client.ts, api.server.ts
context/             # React context (e.g. auth)
lib/                 # Helpers, auth API wrappers, settings
proxy.ts             # Edge proxy: auth redirects and matchers
```

## API and backend

This repository is only the frontend. The Laravel backend should expose JSON routes compatible with this client (auth, user, expenses, etc.). Ensure CORS and Sanctum SPA / token configuration match your frontend origin (e.g. `http://localhost:3000`).

Most authenticated requests use `NEXT_PUBLIC_API_BASE_URL` via `apiClient()`. Some unauthenticated auth calls in `lib/auth.ts` (register, login, Google) currently use a fixed base URL—if your API is not on `http://localhost:8000/api`, align that module with your env or backend URL.

## License

Private project — see repository owner for terms of use.
