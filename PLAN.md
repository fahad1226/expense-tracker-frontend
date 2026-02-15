# Expense Tracker — Architecture + MVP Plan (Next.js Frontend + Laravel API + MySQL)

**Last updated**: 2026-02-08  
**Goal**: Build and ship a usable expense tracker MVP with clean separation between a Next.js frontend and a Laravel backend API, backed by MySQL (shared hosting friendly).

---

## Product Summary (MVP)

Users can:
- Sign up / sign in
- Create / edit / delete expenses
- Categorize expenses (default categories + optional user-defined later)
- View monthly total and category breakdown (charts)
- Filter by date range (and optionally category)

Non-goals for MVP (can be Phase 2+):
- Budgets, recurring expenses, receipt uploads, multi-currency, sharing/groups

---

## High-Level Architecture

```
Browser
  |
  | HTTPS
  v
Next.js (Frontend)
  - UI (RSC + Client Components)
  - Calls API over HTTPS
  - Stores auth (cookie-based or token-based)
  |
  | HTTPS (same domain or api subdomain)
  v
Laravel (API Backend)
  - REST API
  - Auth (Sanctum)
  - Validation, policies, rate limits
  |
  | MySQL
  v
Shared Hosting MySQL (or managed MySQL)
```

### Why this fits shared hosting
- **Laravel + MySQL** runs well on typical shared hosting/cPanel (PHP-focused).
- Next.js often needs Node hosting; this architecture keeps the database access and business logic in Laravel.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router), TypeScript
- **Tailwind CSS**
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP**: fetch (or Axios), with a small API client wrapper

### Backend
- **Laravel** (recommended: latest supported for your PHP version; typically Laravel 11 on PHP 8.2+)
- **MySQL**
- **Auth**: Laravel Sanctum
- **Validation**: Laravel Form Requests

---

## Deployment & Environments

### Recommended domain layout
- **Frontend**: `https://yourdomain.com`
- **API**: `https://api.yourdomain.com`

### Two viable auth patterns (pick one early)

#### Option A (recommended for browser apps): Sanctum SPA (cookie + CSRF)
Use this when:
- Frontend and API are on the **same top-level domain** (e.g. `yourdomain.com` + `api.yourdomain.com`)
- You want standard cookie sessions and less token handling in the UI

Key implications:
- Configure **CORS**, **SESSION_DOMAIN**, **SANCTUM_STATEFUL_DOMAINS**, and CSRF endpoints.

#### Option B: Token-based API (Bearer token)
Use this when:
- Frontend and API are on different sites/domains, or cookie-based auth is painful

Key implications:
- UI stores token securely (prefer httpOnly cookie if you implement it; otherwise memory + refresh strategy)

For MVP speed and simplicity on one domain: **Option A**.

---

## Data Model (MySQL)

### Tables

#### `users`
- `id` (bigint, pk)
- `name`, `email` (unique), `password`
- timestamps

#### `categories`
- `id` (bigint, pk)
- `name` (string)
- `icon` (nullable string)
- `color` (nullable string)
- `user_id` (nullable fk to users; null = system/default category)
- timestamps
- Unique constraint: (`user_id`, `name`)

#### `expenses`
- `id` (bigint, pk)
- `user_id` (fk to users)
- `category_id` (fk to categories)
- `amount` (decimal(10,2))
- `description` (nullable text)
- `spent_at` (datetime) — the date of the expense
- timestamps
- Indexes:
  - (`user_id`, `spent_at`)
  - (`category_id`)

---

## API Design (Laravel)

### Conventions
- Base URL: `https://api.yourdomain.com`
- All endpoints require auth (except auth endpoints)
- JSON only
- Errors: consistent JSON with message + optional field errors

### Auth (Sanctum SPA)
- `GET /sanctum/csrf-cookie` (sets CSRF cookie for SPA)
- `POST /login`
- `POST /logout`
- `GET /api/me`

### Expenses
- `GET /api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&categoryId=123`
- `POST /api/expenses`
- `GET /api/expenses/{id}`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

### Categories
- `GET /api/categories` (includes defaults + user categories)
- (Phase 2+) `POST /api/categories`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}`

### Analytics (MVP)
- `GET /api/analytics/summary?month=YYYY-MM` → totals for month
- `GET /api/analytics/by-category?month=YYYY-MM` → breakdown

---

## Frontend App (Next.js)

### Pages (MVP)
- `/login` (or a simple auth screen)
- `/dashboard` (monthly total + recent expenses + breakdown chart)
- `/expenses` (list + filters)
- `/expenses/new` (create)
- `/expenses/[id]` (edit)

### Frontend ↔ API client
Create a small wrapper:
- Reads `NEXT_PUBLIC_API_BASE_URL`
- Includes credentials for cookie-based auth (`credentials: "include"`)
- Handles 401 redirects to login

---

## Repo / Folder Structure (recommended)

If you keep Next.js at repo root, add Laravel in a folder:

```
expense-tracker/
  app/                    # Next.js
  public/
  package.json
  backend/                # Laravel API (new)
    app/
    routes/
    database/
    composer.json
```

Alternative (monorepo-style):
```
expense-tracker/
  frontend/ (Next.js)
  backend/  (Laravel)
```

Pick whichever you prefer; MVP works with either.

---

## MVP Implementation Plan (7 days)

### Day 1 — Backend foundation (Laravel + MySQL)
- Create Laravel project in `backend/`
- Configure `.env` for MySQL (shared hosting credentials in prod)
- Add Sanctum + CORS config
- Create migrations + models: `Category`, `Expense`
- Seed default categories (Food, Rent, Transport, Shopping, Misc)

### Day 2 — Auth + “Me” endpoint
- Implement auth with Sanctum (SPA cookies)
- Add `GET /api/me`
- Ensure session/cookie works cross-subdomain (if using `api.`)

### Day 3 — Expense CRUD API
- Add FormRequest validation
- Implement endpoints for create/list/update/delete
- Enforce authorization (Policies: users can only see their own expenses)

### Day 4 — Analytics API
- Monthly total endpoint
- By-category aggregation endpoint
- Ensure indexes support the queries

### Day 5 — Frontend: scaffolding + auth wiring
- Add API client wrapper
- Create login flow (calls backend)
- Protected routes/layout in Next.js

### Day 6 — Frontend: expenses UI
- Expense form (amount, category, date, description)
- Expense list with date filtering
- Edit/delete flow + loading/error states

### Day 7 — Dashboard + charts + polish
- Monthly total card
- Category breakdown chart
- Responsive layout and basic empty states

---

## Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL="https://api.yourdomain.com"
```

### Backend (`backend/.env`)
```env
APP_URL="https://api.yourdomain.com"

DB_CONNECTION=mysql
DB_HOST=YOUR_HOST
DB_PORT=3306
DB_DATABASE=YOUR_DB
DB_USERNAME=YOUR_USER
DB_PASSWORD=YOUR_PASSWORD

SESSION_DRIVER=cookie
SESSION_DOMAIN=".yourdomain.com"

SANCTUM_STATEFUL_DOMAINS="yourdomain.com,api.yourdomain.com,localhost,localhost:3000"
FRONTEND_URL="https://yourdomain.com"
```

---

## Security & Quality Baselines (MVP)
- **Auth required** for all `/api/*` routes (except auth endpoints)
- **Policies**: expenses/categories scoped to `user_id`
- **Validation**: use FormRequests for all writes
- **Rate limiting**: basic throttling on auth endpoints
- **CORS**: allow only your frontend origin(s)

---

## Next Actions (practical)
- Create `backend/` Laravel API (Sanctum + MySQL)
- Confirm domain setup: `yourdomain.com` (frontend) and `api.yourdomain.com` (backend)
- Decide auth pattern (Sanctum SPA cookies recommended if same top-level domain)

