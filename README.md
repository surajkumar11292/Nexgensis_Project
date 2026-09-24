# Product Admin Dashboard

A production-grade, responsive Product Admin Dashboard built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**, integrating with the [DummyJSON API](https://dummyjson.com).

This project was built from scratch without any external data-fetching or table libraries (strictly zero React Query, zero SWR, and zero third-party table dependencies), implementing full URL state synchronization, race-condition mitigation, and client-side optimistic persistence.

---

## Quick Reference

| Resource | Value |
|---|---|
| **Repository** | https://github.com/surajkumar11292/Nexgensis_Project |
| **Demo Account** | `emilys` / `emilyspass` |
| **Autofill Helper** | Click **Autofill** on the login page for instant credentials |
| **Race-Condition Test URL** | `http://localhost:3000/products?q=phone&delay=2000` |

---

## Table of Contents

1. [Setup & Installation](#1-setup--installation)
2. [What Was Finished](#2-what-was-finished)
3. [Architectural & Technical Choices](#3-architectural--technical-choices)
4. [One Problem Faced & How It Was Fixed](#4-one-problem-faced--how-it-was-fixed)
5. [Where AI Helped](#5-where-ai-helped)
6. [Project Structure](#6-project-structure)
7. [Edge Cases & Error Handling](#7-edge-cases--error-handling)

---

## 1. Setup & Installation

### Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/surajkumar11292/Nexgensis_Project.git
   cd Nexgensis_Project
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Start the local development server:**
   ```bash
   pnpm dev
   # or: npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are automatically redirected to `/login`.

### Verification Commands

Ensure zero errors across TypeScript, linting, and production builds:

```bash
# Verify TypeScript types (0 errors)
pnpm exec tsc --noEmit

# Verify ESLint rules
pnpm exec eslint src

# Create production build
pnpm run build
```

---

## 2. What Was Finished

All requirements and edge cases specified in the project assignment are completed:

### Authentication & Route Protection
- [x] **Secure Login Page**: Authenticates against `POST https://dummyjson.com/auth/login`.
- [x] **Route Guard**: Layout-level authentication check preventing unauthenticated access to `/products` and `/products/[id]`.
- [x] **Session Persistence**: Auth token and user metadata saved in `localStorage` with automated hydration on client mount.
- [x] **Sign Out**: Clears session cache and redirects to `/login`.
- [x] **Global 401 Interceptor**: Central Axios interceptor listens for unauthorized responses, clears stale tokens, and triggers a clean logout.

### Catalog & Responsive Presentation
- [x] **Desktop Table View**: Displays product preview thumbnail, title, category, price, star rating, stock badge, and action buttons.
- [x] **Mobile Card Grid**: Automatically switches from table layout to touch-friendly responsive cards on screens below 768px (`md` breakpoint).
- [x] **Tabular Numerals**: Formatted with `tabular-nums` so prices, stock counts, and ratings never cause horizontal jitter when sorting.

### Search, Filter, Sort & Pagination
- [x] **Debounced Search**: 400ms debounce prevents unnecessary API requests while typing.
- [x] **Instant Clear**: Clicking the `×` button immediately clears the input and resets query parameters without lag.
- [x] **Search Page Reset**: Any search query change resets the pagination back to page 1.
- [x] **Category Filtering**: Fetches 28 categories dynamically from `/products/categories` with quick-select pills and a dropdown selector.
- [x] **Sorting**: Multi-column sorting by price, rating, or product title in ascending or descending order.
- [x] **Custom Pagination**: Ellipsis windowing (`1 … 4 5 6 … 20`) with configurable page sizes (10, 20, 50) and live count summary (`Showing 1–10 of 194 products`).
- [x] **Bidirectional URL State**: Page, limit, search query, category, sort field, and order are fully reflected in URL search parameters (`?page=2&limit=20&sortBy=price&order=asc`).

### Product Details Page (`/products/[id]`)
- [x] **Dedicated Detail View**: Dynamic route rendering high-resolution image gallery, price discounts, stock levels, brand, SKU, warranty, shipping, and return policies.
- [x] **Customer Reviews**: Formatted list of customer ratings, comments, dates, and reviewer details.
- [x] **Smart Return Navigation**: Remembers previous catalog page, scroll position, and active filters when navigating back to the catalog.
- [x] **404 Handling**: Invalid or non-existent product IDs display an informative "Product Not Found" screen with a return link.

### Mutation Handling & Optimistic Persistence
- [x] **Add Product Modal**: Complete form with validation (title, category, price, stock, brand, image URL, description) issuing `POST /products/add`.
- [x] **Edit Product Modal**: Pre-filled form with current product details issuing `PUT /products/{id}`.
- [x] **Confirm Delete Dialog**: Two-step confirmation modal preventing accidental deletions, issuing `DELETE /products/{id}`.
- [x] **Local Persistence Layer**: DummyJSON does not persist mutations to its database. All creations, edits, and deletions are saved to `localStorage` and merged seamlessly with server responses.
- [x] **Reset Demo Changes**: A "Reset" button allows reviewers to easily clear local mutations and restore the default 194-product catalog.

### Visual Polish & Resilience States
- [x] **Shimmer Skeleton**: Content-shaped animated skeleton placeholders during data loading.
- [x] **Empty State**: Clear UI displayed when no products match the query, with a 1-click filter reset button.
- [x] **Error State with Retry**: Displays actionable network error feedback with a "Retry Request" trigger.
- [x] **Custom Toast Notifications**: Floating feedback alerts for successful additions, edits, deletions, and errors.
- [x] **Submission Throttling**: Mutation and login buttons disable and display spinner indicators during in-flight requests to prevent double-click spam.

---

## 3. Architectural & Technical Choices

### 3.1 Next.js 16 App Router & React 19
- **Decision**: Implemented using Next.js 16 App Router with route groups (`(dashboard)`) to cleanly separate authenticated layouts from the `/login` screen.
- **Rationale**: Provides native nested layouts, client-side route caching, and zero layout flicker during page transitions.

### 3.2 Hand-Rolled Hooks over React Query / SWR
- **Decision**: Built custom hooks (`useProducts`, `useDebounce`, `useUrlParams`) from scratch using standard React primitives (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`).
- **Rationale**: Strictly complies with the constraint banning third-party query managers. `useProducts` encapsulates the full lifecycle: request cancellation, monotonic request ordering, error capture, and local mutation merging.

### 3.3 Centralized Axios Client (`src/services/api.ts`)
- **Decision**: All HTTP communication is consolidated into a single exported Axios instance.
- **Rationale**: Centralizes base URL configuration (`https://dummyjson.com`), timeout thresholds (15s), request Bearer token injection, and global 401 token clearance in one maintainable file. Components never call `fetch` or instantiate Axios directly.

### 3.4 Dual-Layer Optimistic Persistence (`ProductStorageContext.tsx`)
- **Decision**: Created an optimistic overlay that merges server data with local changes (`added`, `updated`, `deleted`).
- **Rationale**: DummyJSON mock endpoints return mock success payloads without updating their remote database. Without local caching, a newly created product disappears the moment a user changes pages or refreshes. Our context intercepts server responses and patches them with local mutations, delivering a realistic production feel.

### 3.5 URL Parameters as the Single Source of Truth (`useUrlParams.ts`)
- **Decision**: Catalog state (page, search, category, sort) is driven directly by URL query parameters.
- **Rationale**: Ensures full bookmarkability and browser back/forward history support. Sharing a URL like `http://localhost:3000/products?category=smartphones&sortBy=price&order=asc` reproduces the exact filter view on another device.

### 3.6 Hybrid Filtering Architecture
- **Decision**: When both a keyword search (`q`) and category filter are active, the application requests the search dataset with an expanded limit (`limit=100`) and applies client-side category filtering in memory.
- **Rationale**: The DummyJSON API does not support combined server-side search and category filtering in a single endpoint. An informative badge informs the user that hybrid filtering is applied.

---

## 4. One Problem Faced & How It Was Fixed

### The Problem: Search Clear Button (`×`) Resurrected Old Queries

When typing a search query and subsequently clicking the clear button (`×`), the input field would clear visually, but after 400 milliseconds the previous search query would reappear in the URL and re-filter the products.

### Root Cause
The component originally synced the input value to the URL via a `useEffect` watching a debounced string value. When the user clicked the clear button, local input state was reset to `""` immediately. However, the debounce timer that was scheduled from the preceding keystroke was still queued in the JavaScript event loop with the old query. When the timer expired 400ms later, it fired an update with the stale search term, overwriting the user's clear action.

### How It Was Fixed
The indirect `useEffect` debounce pattern was replaced with explicit, direct timer management using a `useRef<NodeJS.Timeout | null>`:

```tsx
const timerRef = useRef<NodeJS.Timeout | null>(null);

// On keystroke: update local input and schedule a debounced URL change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value;
  setSearchTerm(val);

  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  timerRef.current = setTimeout(() => {
    onSearchChange(val.trim());
  }, 400);
};

// On clear: immediately cancel any queued timer, reset state, and update URL
const handleClear = () => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  setSearchTerm('');
  setPrevInitialValue('');
  onSearchChange(''); // Instant URL update without 400ms delay
};
```

By explicitly cancelling `timerRef.current` inside `handleClear()`, any queued debounced updates are discarded before they can execute. The search resets immediately without stale state resurrection.

---

## 5. Where AI Helped

Rather than using AI to write code across the board, I consulted AI as a technical sounding board when I got stuck on specific, tricky problems during implementation:

### Scenario 1: Preserving Catalog Scroll Position & Highlighting the Last-Viewed Item
- **The Problem:** When browsing the catalog, scrolling down to an item, clicking to view its `/products/[id]` detail page, and then navigating back, Next.js reset the catalog scroll to the top (`y = 0`). The user had to scroll all the way down again to find where they left off, which made browsing tedious.
- **How AI Helped:** I asked AI for a clean way to remember the user's position without installing a heavy global state library. AI suggested storing `window.scrollY` and `last_viewed_product_id` in `sessionStorage` before navigating. Upon returning, once products finish loading, it triggers `scrollIntoView({ behavior: 'instant', block: 'center' })` on the matching element ID and applies a gentle yellow flash (`bg-[#fef9c3]/70`) for 1.8 seconds. This brings the user back to the exact item they were reviewing.

### Scenario 2: Resolving the DummyJSON Search & Category Mutual Exclusion
- **The Problem:** DummyJSON does not support simultaneous search and category filtering in a single server call (calling `/products/search?q=phone` ignores categories, and `/products/category/smartphones` ignores the search query). When a user had both active, one filter silently overrode the other.
- **How AI Helped:** I consulted AI on how to handle this without setting up a custom backend proxy. AI suggested a hybrid client-side refinement pattern: when both `q` and `category` are active, request the search dataset with an expanded limit (`limit=100`) from DummyJSON, then filter by category in memory in `useProducts`. It also suggested rendering an informative amber banner explaining the hybrid filter so reviewers know why client filtering is occurring.

### Scenario 3: Bypassing Chrome's "Compromised Password" Alert on Test Credentials
- **The Problem:** The assignment requires using DummyJSON's mock credentials (`emilys` / `emilyspass`). On Google Chrome, typing `emilyspass` triggered a persistent red security modal stating *"A data breach on a site or app exposed your password"*, disrupting the testing flow.
- **How AI Helped:** I asked AI how to indicate to Chrome that this is a test/demo sandbox without changing the required credentials. AI pointed out that adding `autoComplete="new-password"` and `data-form-type="other"` prevents Chrome's automated breach scanner from triggering this false alarm.

### Scenario 4: Bulletproofing Race Conditions with Monotonic Request IDs
- **The Problem:** While testing search throttling with simulated network latency (`&delay=2000`), `AbortController.abort()` cancelled most in-flight requests, but under rapid typing bursts, occasional network race conditions occurred where a response resolved right as an abort was being processed.
- **How AI Helped:** AI suggested pairing `AbortController` with a monotonic request counter (`activeRequestIdRef`). Each fetch increments the ID (`++activeRequestIdRef.current`). When the promise resolves, it checks if `currentRequestId === activeRequestIdRef.current`. If a newer request was dispatched while waiting, the stale response is discarded before touching state.

### Where AI Was Overridden:
- **Third-Party Table & Query Libraries:** AI suggested using `@tanstack/react-table` and `swr`, which I rejected to honor the project rule banning ready-made table and query libraries.
- **Debounce Implementation:** AI initially suggested a generic `useEffect` watching a debounced query string, which caused the clear-button (`×`) race condition. I replaced this with direct `useRef` timer cancellation.

---

## 6. Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Authenticated layout wrapper & catalog header
│   │   ├── page.tsx                  # Root redirect: / → /products
│   │   └── products/
│   │       ├── page.tsx              # Main catalog view (table/cards, filters, pagination)
│   │       └── [id]/page.tsx         # Product detail view (gallery, specs, reviews, actions)
│   ├── login/
│   │   └── page.tsx                  # Split-screen responsive login page
│   ├── globals.css                   # Custom theme tokens & scrollbar styling
│   ├── layout.tsx                    # Root layout with font definitions and context providers
│   └── not-found.tsx                 # Global 404 page with return link
│
├── components/
│   ├── layout/
│   │   └── Header.tsx                # Sticky top bar with brand, search, and user profile
│   └── products/
│       ├── ConfirmDeleteModal.tsx    # Accessible deletion confirmation dialog
│       ├── EmptyState.tsx            # Zero-result fallback with filter-reset action
│       ├── ErrorState.tsx            # API error screen with retry mechanism
│       ├── Pagination.tsx            # Custom windowed pagination with per-page selector
│       ├── ProductCardGrid.tsx       # Touch-friendly card grid for mobile & tablet
│       ├── ProductFilters.tsx        # Category pills, category select, sort dropdown
│       ├── ProductFormModal.tsx      # Add & Edit modal with field validation
│       ├── ProductSkeleton.tsx       # Shimmer loading skeleton matching layout
│       ├── ProductTable.tsx          # Accessible desktop data table with sort headers
│       └── SearchInput.tsx           # Debounced input with instant clear functionality
│
├── context/
│   ├── AuthContext.tsx               # Authentication state, login/logout, 401 listener
│   ├── ProductStorageContext.tsx     # Optimistic localStorage persistence & merging
│   └── ToastContext.tsx              # Toast alerts for feedback and error reporting
│
├── hooks/
│   ├── useDebounce.ts                # Value debouncing hook
│   ├── useProducts.ts                # Race-safe product fetcher with AbortController
│   └── useUrlParams.ts               # Bidirectional URL parameter synchronization
│
├── services/
│   ├── api.ts                        # Shared Axios instance with request/response interceptors
│   ├── authService.ts                # Authentication endpoints & token storage
│   └── productService.ts             # Product CRUD, category, and search API methods
│
└── types/
    ├── auth.ts                       # User, LoginCredentials, and AuthContext types
    └── product.ts                    # Product, Category, FilterParams, and Form types
```

---

## 7. Edge Cases & Error Handling

| Scenario | Handled By | Behavior |
|---|---|---|
| **Race Conditions** | `useProducts.ts` | Uses `AbortController` to cancel in-flight requests and monotonic IDs (`activeRequestIdRef`) to discard stale responses when typing rapidly. Verified with `&delay=2000`. |
| **Malformed URL Query** | `useUrlParams.ts` | Defensively falls back to valid defaults: `?page=abc` → page 1; `?limit=999` → limit 10; `?sortBy=fake` → sort cleared. |
| **API Search + Category Conflict** | `useProducts.ts` | Fetches search results and applies category filtering in memory, displaying a notification banner explaining the hybrid filter. |
| **DummyJSON Ephemeral Mutations** | `ProductStorageContext.tsx` | All additions, edits, and deletions persist in `localStorage` and merge into server query results across page changes and browser refreshes. |
| **Rapid Double-Clicks** | All modals & forms | Handlers are protected by `isSubmitting` boolean guards; buttons are disabled with spinner feedback to prevent duplicate submissions. |
| **Session Expiration (401)** | `api.ts` | Axios response interceptor removes cached tokens and dispatches a logout event, cleanly returning the user to the login screen. |
| **Invalid Product ID** | `[id]/page.tsx` | Validates numeric ID; displays a clean "Product Not Found" card with a link back to `/products`. |
