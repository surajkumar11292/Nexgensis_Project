# Nexgensis — Product Admin Dashboard

**Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Axios · TypeScript · pnpm**

A production-grade Product Admin Dashboard built against the [DummyJSON](https://dummyjson.com) public API, satisfying every technical requirement in `Frontend_Assignment.pdf`. Every design decision, architectural constraint, and edge-case handler in this project is documented below — written to be walked through in a live technical review.

---

## Live Demo & Repository

| | |
|---|---|
| **GitHub** | https://github.com/surajkumar11292/Nexgensis_Project |
| **Test login** | `emilys` / `emilyspass` |
| **Quick fill** | Click the **Autofill** button on the login page |

---

## Table of Contents

1. [What Was Built](#1-what-was-built)
2. [Quick Start](#2-quick-start)
3. [Project Structure](#3-project-structure)
4. [Architecture & Engineering Decisions](#4-architecture--engineering-decisions)
5. [PDF Requirements — Line-by-Line Compliance](#5-pdf-requirements--line-by-line-compliance)
6. [Things to Handle Carefully — PDF Section](#6-things-to-handle-carefully--pdf-section)
7. [Design System](#7-design-system)
8. [Commit History](#8-commit-history)
9. [One Problem I Faced — and Exactly How I Fixed It](#9-one-problem-i-faced--and-exactly-how-i-fixed-it)
10. [Where AI Helped](#10-where-ai-helped)

---

## 1. What Was Built

| Feature | Status | Details |
|---|---|---|
| Login page | ✅ | DummyJSON `/auth/login`, error states, session persistence |
| Product list | ✅ | Desktop table + mobile card grid, image, title, category, price, rating, stock |
| Pagination | ✅ | Custom windowed ellipsis, page size 10/20/50, "Showing X–Y of N" |
| Search | ✅ | 400ms debounce, URL-synced, resets to page 1, instant clear |
| Filter & sort | ✅ | Category pills + dropdown (28 categories), sort by price/rating/title, order toggle |
| Product details | ✅ | `/products/[id]` with image gallery, full metadata, reviews section |
| Add product | ✅ | Validated form modal, POSTs to DummyJSON, persisted locally |
| Edit product | ✅ | Pre-filled form modal, PUTs to DummyJSON, patched locally |
| Delete product | ✅ | Confirm dialog, DELETEs via API, removed locally |
| Empty state | ✅ | "No products found" with filter-clear recovery action |
| Error state | ✅ | Network error card with Retry button |
| Loading state | ✅ | Content-shaped shimmer skeleton rows (table & card) |
| 404 page | ✅ | Global `not-found.tsx` with navigation back to catalog |
| Logout | ✅ | Clears token from localStorage, redirects to `/login` |

---

## 2. Quick Start

### Prerequisites
- Node.js 18.17+ or 20+
- `pnpm` (or `npm`)

```bash
# Clone the repository
git clone https://github.com/surajkumar11292/Nexgensis_Project.git
cd Nexgensis_Project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open **http://localhost:3000** — it redirects to `/login` automatically if you are not authenticated.

### Test Credentials

```
Username:  emilys
Password:  emilyspass
```

Click **Autofill** on the login page to fill them in one click.

### Verify (Zero Errors)

```bash
pnpm exec tsc --noEmit      # TypeScript — 0 errors
pnpm exec eslint src        # ESLint — 0 warnings
pnpm run build              # Production build
```

### Test Race Condition (Assignment Requirement)

```
http://localhost:3000/products?q=phone&delay=2000
```

Type fast in the search box — stale responses never overwrite fresh ones.

---

## 3. Project Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx                  # Split-screen login: left panel branding, right panel form
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Protected route wrapper + sticky header (avatar, logout)
│   │   ├── page.tsx                  # Redirects "/" → "/products"
│   │   └── products/
│   │       ├── page.tsx              # Main catalog orchestrator (all state lives here)
│   │       └── [id]/page.tsx         # Product detail: gallery, specs, reviews, edit/delete
│   ├── globals.css                   # Design tokens, custom scrollbars, font variables
│   ├── layout.tsx                    # Root layout: providers, Inter + Plus Jakarta Sans fonts
│   └── not-found.tsx                 # Global 404 with branded card
│
├── components/products/
│   ├── ConfirmDeleteModal.tsx         # Two-click protection: confirm before deleting
│   ├── EmptyState.tsx                 # "No products" with clear-filters CTA
│   ├── ErrorState.tsx                 # Network error with Retry button
│   ├── Pagination.tsx                 # Windowed pagination: 1 … 4 5 6 … 20
│   ├── ProductCardGrid.tsx            # Responsive card grid (mobile/tablet)
│   ├── ProductFilters.tsx             # Category pills + sort dropdown + view toggle
│   ├── ProductFormModal.tsx           # Add/Edit modal with inline validation
│   ├── ProductSkeleton.tsx            # High-fidelity shimmer skeleton
│   ├── ProductTable.tsx               # Sortable desktop table view
│   └── SearchInput.tsx                # Debounced search with working X clear button
│
├── context/
│   ├── AuthContext.tsx                # Session management, token injection, 401 listener
│   ├── ProductStorageContext.tsx      # Optimistic CRUD persistence via localStorage
│   └── ToastContext.tsx               # Global toast notification system
│
├── hooks/
│   ├── useDebounce.ts                 # 400ms debounce for keystroke throttling
│   ├── useProducts.ts                 # Race-safe fetcher: AbortController + request ID
│   └── useUrlParams.ts                # Bidirectional URL ↔ state sync, defensive parsing
│
├── services/
│   ├── api.ts                         # Single shared Axios instance — token injected here
│   ├── authService.ts                 # POST /auth/login, GET /auth/me
│   └── productService.ts              # All product CRUD and category endpoints
│
└── types/
    ├── auth.ts                        # LoginCredentials, AuthUser, SessionState
    └── product.ts                     # Product, ProductCategory, ProductFilterParams, etc.
```

---

## 4. Architecture & Engineering Decisions

### 4.1 Single Shared Axios Client (`src/services/api.ts`)

The PDF requires *"one shared Axios setup file that adds the login token to every request and handles errors in one place."*

```ts
// Request interceptor: inject Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: centralize error handling + 401 cleanup
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(new Error(error.response?.data?.message || error.message));
  }
);
```

No UI component or hook calls `fetch` or `axios.create()` independently. All network traffic routes through this single client.

---

### 4.2 URL State Synchronization (`src/hooks/useUrlParams.ts`)

The PDF requires *"keeping page, search, filter and sort values in the URL so refreshing the page or sharing the link shows the same result."*

`useUrlParams` provides full bidirectional sync:
- Reading from URL: all 6 params (`page`, `limit`, `q`, `category`, `sortBy`, `order`) are parsed defensively on every render
- Writing to URL: `router.replace()` is called with the minimal necessary query string (removes defaults like `page=1` and `limit=10` to keep URLs clean)
- Page resets to 1 on search, category, or sort changes — matching the PDF instruction

```ts
const setSearch = useCallback((q: string) => {
  updateUrl({ q }, true); // resetPage = true → page resets to 1
}, [updateUrl]);
```

---

### 4.3 Race Condition Prevention (`src/hooks/useProducts.ts`)

The PDF requires verifying behaviour with `&delay=2000`.

Two complementary guards are in place:

**Guard 1 — AbortController:** Every new fetch cancels the previous in-flight request.
```ts
if (abortControllerRef.current) {
  abortControllerRef.current.abort(); // Cancel stale request
}
const controller = new AbortController();
abortControllerRef.current = controller;
```

**Guard 2 — Monotonic Request ID:** Even if an abort signal arrives late (a known browser timing quirk), stale responses are discarded before touching state.
```ts
const currentRequestId = ++activeRequestIdRef.current;
// ... await fetch ...
if (currentRequestId !== activeRequestIdRef.current) return; // Discard stale
setProducts(finalProducts); // Only runs for the latest request
```

---

### 4.4 Optimistic Local Persistence (`src/context/ProductStorageContext.tsx`)

The PDF states: *"Add, edit and delete are not really saved by the API. Show the change in the app anyway and explain your approach."*

DummyJSON accepts mutations and returns success responses but does not persist them. This is handled via a client-side override layer:

- `saveLocalAdd(product)` — prepends to the `added[]` array in localStorage
- `saveLocalUpdate(id, patch)` — stores partial patches in `updated{id: patch}` map
- `saveLocalDelete(id)` — adds to the `deleted[]` set

Every time products are fetched from the server, `applyLocalOverrides()` is called:
1. Locally-added products are prepended to the server list
2. Updated products have their server fields patched with local data
3. Deleted product IDs are excluded from the final list

A **Reset Demo Changes** pill appears when local data exists, allowing reviewers to restore the clean state instantly.

---

### 4.5 Hybrid Filtering Strategy

The PDF notes: *"The API cannot search and filter by category at the same time. Decide what your app does and explain why."*

DummyJSON's search endpoint (`/products/search?q=`) and category endpoint (`/products/category/{cat}`) cannot be used simultaneously in one server request.

**Decision**: When both `q` and `category` are active, the hook fetches `/products/search?q=...&limit=100` (all search results) and then applies the category filter in memory on the returned dataset.

The user is explicitly told via an amber banner:
> **Hybrid Filter Applied:** DummyJSON API does not allow simultaneous server-side search and category filtering. Items matching "phone" are filtered within category "smartphones".

---

### 4.6 No React Query / No SWR / No Table Libraries

As required by the PDF:
- `useProducts.ts` is a hand-rolled fetcher with its own loading, error, and retry states
- `Pagination.tsx` is fully custom with ellipsis windowing logic
- `ProductTable.tsx` and `ProductCardGrid.tsx` are built from scratch
- No third-party data management, table, or pagination dependencies were installed

---

### 4.7 Double-Click / Submission Spam Prevention

The PDF requires *"clicking Save or Login many times quickly must not send many requests."*

All mutation handlers (`handleSubmit`, `handleDeleteConfirm`, `handleSubmit` on login) use an `isSubmitting` boolean guard:

```ts
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return; // ← Hard gate
  setIsSubmitting(true);
  try { await login(...); }
  finally { setIsSubmitting(false); }
};
```

Buttons are also `disabled={isSubmitting}` and display a spinner — preventing both accidental and rapid intentional re-submission.

---

### 4.8 Defensive URL Parsing

The PDF requires *"wrong URL values like `?page=abc` or `?page=999` must not break the page."*

```ts
let page = parseInt(rawPage || '1', 10);
if (isNaN(page) || page < 1) page = 1;

let limit = parseInt(rawLimit || '10', 10);
if (isNaN(limit) || ![10, 20, 50].includes(limit)) limit = 10;

const sortBy = ALLOWED_SORTS.includes(rawSort) ? rawSort : '';
const order: SortOrder = rawOrder === 'desc' ? 'desc' : 'asc';
```

All six URL parameters are sanitized before use. Malformed values silently fall back to defaults.

---

## 5. PDF Requirements — Line-by-Line Compliance

| PDF Requirement | Implementation |
|---|---|
| Login with `emilys`/`emilyspass`, show errors | `AuthContext.tsx` → `authService.ts` → `POST /auth/login` with error display |
| Only logged-in users can open product pages | `(dashboard)/layout.tsx` checks `isAuthenticated`, redirects to `/login` |
| Add a logout button | `Header.tsx` — clears token, fires `router.replace('/login')` |
| Show image, title, category, price, rating, stock | `ProductTable.tsx` (desktop) + `ProductCardGrid.tsx` (mobile) |
| Table on desktop, cards on mobile | `hidden md:block` / `block md:hidden` responsive switching |
| Pagination: load by page, limit=10/20/50, show "Showing 21–40 of 194" | `Pagination.tsx` with ellipsis windowing + result count display |
| Go back to page 1 when search changes | `useUrlParams.setSearch` always passes `resetPage = true` |
| Search via `/products/search?q=`, wait for user to stop typing | `SearchInput.tsx` with 400ms debounce, cancels old timer on each keystroke |
| Filter by category via `/products/categories` | `ProductFilters.tsx` dynamically loads categories from API |
| Sort by price, rating, or title | `ProductTable.tsx` sortable headers + `useUrlParams.setSort` |
| Product detail at `/products/[id]` | `[id]/page.tsx` — image gallery, description, reviews, metadata |
| Show "not found" page for wrong id | `setNotFound(true)` → renders inline 404 card; global `not-found.tsx` for invalid routes |
| Add, edit, delete with form + confirm popup | `ProductFormModal.tsx` + `ConfirmDeleteModal.tsx` |
| Loading state | `ProductSkeleton.tsx` — content-shaped shimmer matching table/card dimensions |
| Message when nothing is found | `EmptyState.tsx` with clear-filters CTA |
| Error state with Retry button | `ErrorState.tsx` wired to `retry` from `useProducts` |
| One shared Axios setup | `src/services/api.ts` — single instance, token injected in interceptor |
| Keep values in URL | `useUrlParams.ts` — all 6 params (page, limit, q, category, sortBy, order) |
| No React Query / SWR / table libraries | Zero such dependencies in `package.json` |
| Keep components small, API calls in separate files | Services layer in `src/services/`, hooks in `src/hooks/` |
| Public GitHub repo with regular commits | 7 atomic commits covering init → fix |
| README with setup steps | This document |
| Short note on choices, one problem, where AI helped | Sections 9 and 10 below |

---

## 6. Things to Handle Carefully — PDF Section

### Race conditions — tested with `&delay=2000`

Navigate to:
```
http://localhost:3000/products?q=phone&delay=2000
```
Then type fast. The sequence:
1. Request A is sent for "p" (delayed 2s)
2. Request B is sent for "ph" (delayed 2s) — A is **aborted immediately**
3. Request B resolves — the monotonic ID check confirms it is still the current request
4. Products update — stale "p" results never appear even if A somehow resolves

### Search + Category conflict

Documented in Section 4.5. A visible amber banner informs the user when hybrid filtering is active.

### CRUD persistence

DummyJSON returns `{ id: 121, title: "New Product", ... }` for `POST /add` but the next page load does not include that product. All mutations are persisted to `localStorage` via `ProductStorageContext` and merged with every server response. The **Reset Demo Changes** button lets reviewers toggle between states.

### Wrong URL values

`?page=abc` → page 1. `?page=9999` → page 1 (server returns 0 results, not a crash). `?sortBy=invalid` → sort cleared. `?limit=99` → falls back to 10.

---

## 7. Design System

The dashboard follows the **Impeccable Neo-Kinpaku** design system (Operate mode):

| Token | Value | Usage |
|---|---|---|
| `--background` | `#f9f9f8` | Warm paper canvas |
| `--foreground` | `#141413` | Obsidian text |
| `--surface` | `#ffffff` | Card backgrounds |
| `--border` | `#e7e6e1` | Subtle warm borders |
| `--ink-muted` | `#5a5954` | Secondary labels (WCAG 4.5:1 on white) |
| Gold accent | `#d97706` | Star ratings, amber warnings |
| Verdigris | `#059669` | In-stock badges, success states |

**Typography:** Inter (body) + Plus Jakarta Sans (headings)

**What was deliberately avoided** (Impeccable bans):
- No gradient text or glowing halos
- No kicker/eyebrow labels above headings
- No same-size icon-heading-text cards as page structure
- No rainbow icon palettes (icons are unified monochrome)
- No `scale-110` image hover transforms (flagged by Impeccable inspector)
- No low-contrast secondary text below `#383733` on white

---

## 8. Commit History

```
239a0b8  fix(ui): resolve all Impeccable inspection flags
9eb0bcc  docs: add comprehensive README with architectural answers and global 404 page
ce6fd01  feat(products): add product details view, CRUD modals, and toast alerts
9eecd96  feat(products): add responsive catalog table, custom pagination, and search filters
c240662  feat(products): implement product service, URL state sync, race-condition handling, local persistence
75bcdef  feat(auth): initialize Next.js 16 app with Axios interceptor, login flow, and route protection
d86b3b6  Initial commit from Create Next App
```

Each commit covers one logical phase of the assignment, not a monolithic dump.

---

## 9. One Problem I Faced — and Exactly How I Fixed It

### The Problem: Search clear button did nothing

When typing in the search box, then clicking the `×` button, the search query would visually disappear from the input but the URL `?q=` parameter would not clear — products did not reload.

**Root cause:** The clear button set local state (`searchTerm = ''`) correctly, but the URL update was delegated to a `useEffect` that watched a 400ms debounced value. After clicking clear, the debounce timer still held the previous value and fired 400ms later, *re-writing* the old query back into the URL. The user saw the input empty but the data stay filtered.

**How I fixed it:**

Replaced the `useEffect`-based debounce delegation pattern with direct timer management:

```ts
const timerRef = useRef<NodeJS.Timeout | null>(null);

// On keystroke: set local state + start debounce timer
const handleChange = (e) => {
  const val = e.target.value;
  setSearchTerm(val);
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => onSearchChange(val.trim()), 400);
};

// On clear: kill the timer before it can fire, then immediately clear
const handleClear = () => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
  setSearchTerm('');
  setPrevInitialValue('');
  onSearchChange(''); // ← immediate URL clear, no 400ms lag
};
```

The timer is cancelled before the URL update fires — stale debounce resurrection is impossible.

---

## 10. Where AI Helped

AI was used as a pair programmer throughout this project. Here is exactly what was assisted and what was manually overridden:

**AI helped with:**
- Scaffolding TypeScript interfaces from DummyJSON's API response shape (dimensions, reviews, warranty, shipping metadata — ~25 fields)
- Spotting browser-specific issues: Chrome scans inputs named `password` and triggers password-breach alerts. AI suggested `autoComplete="new-password"` and `data-form-type="other"` as mitigation — I tested and confirmed this fix
- Translating Impeccable design tokens into specific Tailwind hex values rather than generic gray scales
- Generating the initial shimmer skeleton animation structure

**AI was overridden on:**
- Suggested using `react-table` for the product table — rejected, the PDF explicitly bans ready-made table libraries
- Suggested using SWR for data fetching — rejected, same reason
- Suggested a single `useEffect` watching `debouncedSearch` for URL sync — replaced with direct timer management after discovering the clear-button race condition
- Generated README copy that sounded AI-written — rewritten to match actual implementation decisions

Every line of code in this repository can be explained and modified live in a technical review.
