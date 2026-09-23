# Nexgensis Product Admin Dashboard

An enterprise-grade Product Admin Dashboard built for **Nexgensis Technologies**, developed using **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, and **Axios**, following the **Impeccable Neo-Kinpaku** design system.

This codebase strictly satisfies all constraints defined in `Frontend_Assignment.pdf`:
- **Zero third-party data fetching libraries**: No React Query, SWR, or RTK Query. Pure custom hooks and vanilla state management.
- **Zero third-party table/pagination libraries**: Built entirely from scratch.
- **Strict separation of concerns**: API communication decoupled from UI components.
- **Race condition resilience**: `AbortController` cancellation + monotonic request counter.
- **Bi-directional URL state synchronization**: Fully bookmarkable and shareable views.
- **Optimistic client persistence**: Solves DummyJSON's lack of write persistence across page navigation and reloads.

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js 18.17+ or 20+
- `pnpm` (recommended) or `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/surajkumar11292/Nexgensis_Project.git
cd Nexgensis_Project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials
The authentication flow integrates directly with DummyJSON's `/auth/login` endpoint.
- **Username**: `emilys`
- **Password**: `emilyspass`
*(A "One-Click Fill" button is provided on the login page for rapid review).*

### Production Build & Typecheck
```bash
# Typecheck
pnpm exec tsc --noEmit

# Lint check
pnpm exec eslint src

# Production build
pnpm run build

# Start production server
pnpm start
```

---

## 2. Architecture & Directory Layout

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx               # Institutional split-screen login
│   ├── (dashboard)/
│   │   ├── layout.tsx                   # Protected route layout & header
│   │   ├── page.tsx                     # Redirects to /products
│   │   └── products/
│   │       ├── page.tsx                 # Main catalog listing & orchestration
│   │       └── [id]/page.tsx            # Single product detail view & reviews
│   ├── globals.css                      # Design tokens, variables & scrollbars
│   ├── layout.tsx                       # Root layout with providers
│   └── not-found.tsx                    # Institutional 404 error page
├── components/
│   ├── layout/
│   │   └── Header.tsx                   # User avatar, status pill, logout
│   └── products/
│       ├── ConfirmDeleteModal.tsx       # Delete dialog with double-click protection
│       ├── EmptyState.tsx               # Filter reset illustration
│       ├── ErrorState.tsx               # Network error card with retry trigger
│       ├── Pagination.tsx               # Custom windowed pagination with ellipsis
│       ├── ProductCardGrid.tsx          # Mobile touch-friendly card grid
│       ├── ProductFilters.tsx           # Category pills, select & sort controls
│       ├── ProductFormModal.tsx         # Add & Edit modal with validation
│       ├── ProductSkeleton.tsx          # High-fidelity shimmer skeleton
│       ├── ProductTable.tsx             # Sortable desktop table view
│       └── SearchInput.tsx              # Debounced search bar with instant clear
├── context/
│   ├── AuthContext.tsx                  # Session management & Bearer token injection
│   ├── ProductStorageContext.tsx        # Optimistic local persistence for DummyJSON
│   └── ToastContext.tsx                 # Toast notifications
├── hooks/
│   ├── useDebounce.ts                   # Generic debounce hook
│   ├── useProducts.ts                   # Race-condition resilient product fetcher
│   └── useUrlParams.ts                  # Defensive URL query parameter synchronizer
├── services/
│   ├── api.ts                           # Central Axios instance with interceptors
│   ├── authService.ts                   # Login & me endpoints
│   └── productService.ts                # Products CRUD & categories endpoints
└── types/
    ├── auth.ts                          # Auth user & session types
    └── product.ts                       # Product, review, category & filter types
```

---

## 3. Engineering Prompt Answers (Assignment Evaluation)

### Question 1: Architectural Choices & Separation of Concerns

1. **Service Layer Isolation (`src/services/`)**:
   UI components never invoke `fetch` or `axios` directly. All network interaction is mediated through `apiClient` (`src/services/api.ts`), `authService.ts`, and `productService.ts`. This encapsulates endpoint URLs, payload serialization, and parameter normalization away from React view logic.
2. **Centralized Interceptor Pipeline**:
   - **Request Interceptor**: Extracts the session Bearer token and injects `Authorization: Bearer <token>`.
   - **Response Interceptor**: Catches `401 Unauthorized` responses and dispatches a window event (`auth:unauthorized`), which `AuthContext` listens to for unified session termination without circular dependency risks.
3. **Pure Custom Hooks vs. Third-Party Libraries**:
   Per assignment instructions, React Query and SWR were completely avoided. Data fetching, pagination, and caching were engineered using three bespoke hooks:
   - `useProducts`: Coordinates network requests, handles `AbortController` cancellation, and manages loading, error, and hybrid filter states.
   - `useUrlParams`: Two-way synchronizer binding router query parameters with local filter state (`page`, `limit`, `q`, `category`, `sortBy`, `order`).
   - `useDebounce`: Emits debounced values (400ms) to throttle keystroke emissions.
4. **Defensive URL State Parsing**:
   URL query parameters can be manipulated by users. Values such as `?page=invalid` or `?page=99999` are defensively normalized (`Math.max(1, parseInt(...) || 1)`) and bounded to the maximum allowable page to prevent application crashes or infinite render loops.

---

### Question 2: Specific Challenges Faced & Solutions

#### Challenge A: DummyJSON Search vs. Category API Conflict
- **The Issue**: DummyJSON provides `/products/search?q=...` and `/products/category/{cat}`, but its REST API does not support querying both simultaneously (e.g. `/products/search?q=phone&category=smartphones` ignores the category).
- **Architectural Solution**: A **Hybrid Filtering Strategy** was implemented in `useProducts.ts`. When both a search keyword and a category filter are active, the hook fetches `/products/search?q=...` and performs an in-memory category filter on the returned dataset. The UI explicitly alerts the user with an amber banner explaining that hybrid filtering is currently active.

#### Challenge B: DummyJSON Fake CRUD Persistence
- **The Issue**: DummyJSON accepts `POST /products/add`, `PUT /products/{id}`, and `DELETE /products/{id}` and returns success responses, but does not actually mutate its backend database. Reloading the page or changing routes would immediately discard created or edited products.
- **Architectural Solution**: A client-side persistence layer was engineered in `ProductStorageContext.tsx`. Added, updated, and deleted product IDs are stored in `localStorage`. When the catalog or details view is loaded, server data is merged with local overrides (prepended additions, patched properties, and excluded deletions). A **"Reset Demo Changes"** action pill enables reviewers to test local persistence and return to a clean state on demand.

#### Challenge C: Search Race Conditions
- **The Issue**: Fast typing generates multiple asynchronous HTTP requests. Slower responses from older keystrokes can resolve after faster responses from newer keystrokes, displaying stale data.
- **Architectural Solution**:
  1. `AbortController` cancellation: `useProducts` aborts pending in-flight Axios requests on every query change.
  2. Monotonic request ID counter: In the event of an out-of-order response resolving before an abort signal propagates, responses whose counter does not match the active request ID are discarded. This was verified with `&delay=2000`.

#### Challenge D: Double-Click / Submission Spam
- **The Issue**: Rapid clicks on "Sign In", "Create Product", or "Confirm Delete" can dispatch multiple concurrent mutations.
- **Architectural Solution**: All interactive action handlers enforce an in-flight submission lock (`isSubmitting`, `isDeleting`). Action buttons are disabled and display a spinner until the asynchronous promise settles.

---

### Question 3: Where AI Tools Assisted in the Process

AI was used as an intelligent pair programmer during development:
1. **Accelerating Boilerplate**: Rapidly scaffolding initial TypeScript interfaces for DummyJSON's comprehensive data structure (dimensions, reviews, warranty, shipping metadata).
2. **Defensive Design Review**: Identifying browser-specific nuances, such as Chrome scanning test passwords (`emilyspass`) and triggering breach alerts, mitigated by setting `autoComplete="new-password"` and `data-form-type="other"`.
3. **Design System Adherence**: Translating Impeccable Neo-Kinpaku principles (warm paper `#f9f9f8`, deep lacquer `#141413`, verdigris emerald accents, Swiss bank elevation) into tailored Tailwind utility classes, avoiding generic black-and-white templates.
4. **Senior Engineering Oversight**: AI suggestions were strictly vetted against the PDF guidelines: rejecting any convenience libraries (no react-table, no TanStack query), ensuring atomic conventional commit history, and auditing edge-case handling.

---

## 4. Verification Checklist

- [x] **Phase 1**: Axios interceptor setup, Bearer token injection, AuthContext, Swiss bank split-screen login, protected dashboard layout.
- [x] **Phase 2**: `useProducts` hook, `AbortController` race condition protection, defensive URL sync (`useUrlParams`), local CRUD persistence (`ProductStorageContext`).
- [x] **Phase 3**: Responsive desktop table (`ProductTable`), mobile card grid (`ProductCardGrid`), custom pagination with ellipsis windowing (`Pagination`), debounced search (`SearchInput`), dynamic category dropdown (`ProductFilters`), loading/empty/error states.
- [x] **Phase 4**: Product details view (`/products/[id]`) with image gallery and reviews, Add/Edit modal (`ProductFormModal`) with validation, Delete confirmation modal (`ConfirmDeleteModal`), Toast feedback system (`ToastContext`).
- [x] **Phase 5**: Global 404 page (`not-found.tsx`), complete documentation (`README.md`), full browser verification, zero ESLint warnings, and zero TypeScript compilation errors.
