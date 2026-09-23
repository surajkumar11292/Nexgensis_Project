# Design System & Craft Rules: Product Admin Dashboard
*Derived from Impeccable (Operate Mode) to eliminate AI slop and deliver senior-grade UI*

---

## 1. What is "AI Slop" in Admin Dashboards (What We Strictly Forbid)

| AI Slop Tell (Banned ❌) | Why It Looks Amateur | Impeccable Standard (Required ✅) |
| :--- | :--- | :--- |
| **Gratuitous Gradients & Glowing Halos** | AI loves putting purple/pink neon gradient text and zero-offset glowing halos on basic buttons. | **Solid, purposeful color tokens**. Neutral surface, high-contrast crisp text, subtle 1px border (`border-zinc-200/80` or `border-zinc-800`), and soft blurred shadow with an offset. |
| **Kicker / Eyebrow Labels** | Putting `"✦ INVENTORY MANAGEMENT"` or `"⚡ EXPLORE PRODUCTS"` above headings. | **Delete the kicker**. Let the heading speak directly: `"Products"` with count badge `194`. |
| **Status-Chip Soup & Over-Saturation** | Every table cell having bright saturated pill badges. | **Restrained semantic color**. Stock status: subtle dot or soft pill (`text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20`). Category: clean neutral badge. |
| **Nested Cards Inside Cards** | Wrapping table in a card, inside another bordered container. | **Structural layout**. Clean white/zinc canvas, crisp borders, unified table header with clear column visual hierarchy. |
| **Jumping Numbers in Tables** | Numbers jittering when values update or sort. | **Tabular Numerals** (`tabular-nums` / `font-variant-numeric: tabular-nums`). Aligns digits evenly in price, stock, and rating. |
| **Centered Spinner in Blank Space** | Showing a generic spinning wheel in a blank white void while loading. | **Content-shaped Shimmer Skeletons**. Skeleton table rows and card placeholders matching exact dimensions of incoming data. |
| **Sluggish 1-Second Animations** | Over-orchestrated fade-ins that make an admin tool feel laggy. | **Snappy 150ms–200ms ease-out transitions** for state feedback only. The tool must disappear into the task. |
| **Missing States** | Only implementing default state; missing focus rings, disabled states, or keyboard accessibility. | **Every component has 7 states**: Default, Hover, Focus-Visible, Active, Disabled, Loading, and Error. |

---

## 2. Impeccable "Operate Mode" Specification for Nexgensis

### A. Typography & Scale
- **Primary Font**: Modern neutral sans (`Inter` / `Geist Sans` / System Apple-Blink).
- **Scale**: Tight, fixed rem scale (1.125–1.2 ratio):
  - Heading 1: `text-xl font-semibold tracking-tight text-zinc-900`
  - Subheading / Table Headers: `text-xs font-medium uppercase tracking-wider text-zinc-500`
  - Body & Table Cells: `text-sm font-normal text-zinc-700`
  - Numerals & Currency: `text-sm font-medium tabular-nums text-zinc-900`

### B. Color Hierarchy (Restrained & Accessible)
- **Canvas / Background**: `bg-zinc-50/60` (clean, calm, enterprise feel).
- **Surface / Card / Table**: `bg-white` with `border border-zinc-200/80` and `shadow-xs`.
- **Sidebar & Secondary Panels**: `bg-zinc-900` (dark high-contrast sidebar) OR `bg-zinc-100/70` with clear visual boundary.
- **Primary Action (Brand)**: Deep indigo / slate (`bg-zinc-900 hover:bg-zinc-800 text-white` or `bg-indigo-600 hover:bg-indigo-700`).
- **Semantic Accents**:
  - In Stock: `emerald-700` on `emerald-50`
  - Low Stock (< 10): `amber-700` on `amber-50`
  - Out of Stock (0): `rose-700` on `rose-50`
  - Rating: `amber-500` star with numeric score in `zinc-700`

### C. Desktop Table vs. Mobile Cards
- **Desktop (≥ 1024px)**:
  - Clean table with sticky header (`bg-zinc-50/80 backdrop-blur-xs`).
  - Columns: Image (compact rounded square `h-10 w-10`), Title + Brand, Category, Price (`tabular-nums`), Rating, Stock badge, and Action buttons (Edit/Delete).
  - Row hover: subtle `hover:bg-zinc-50/80 transition-colors duration-150`.
- **Mobile (< 1024px)**:
  - Responsive card grid (1 col on mobile, 2 col on tablet).
  - High scanability: Thumbnail on left, title + price at top right, badges and actions along bottom row.

### D. Form Controls & Modals
- **Input Fields**:
  - `bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400`
  - Focus state: `focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900`
  - Error state: `border-rose-500 focus:ring-rose-500/20 text-rose-900` + explicit error message below field.
- **Buttons**:
  - Debounced: automatically prevents double-clicking. Shows a mini spinner + `opacity-70 cursor-not-allowed` when `isSubmitting`.
- **Delete Confirmation Dialog**:
  - Clean modal with backdrop blur (`bg-zinc-900/40 backdrop-blur-xs`), direct warning copy, and destructive primary button (`bg-rose-600 hover:bg-rose-700`).

---

## 3. Resilience States
1. **Shimmer Skeletons**: Pre-drawn table rows and cards that animate smoothly with an off-white gradient pulse.
2. **Instructive Empty State**:
   - Icon: subtle neutral box/magnifying glass.
   - Heading: `"No products found"`.
   - Message: `"No products match your current search or category filters."`.
   - Recovery Action: `[Clear all filters]` button that resets URL query params.
3. **Actionable Error State**:
   - Icon: subtle amber/rose alert.
   - Message: clear error description.
   - Recovery Action: `[Retry Request]` button that dispatches query again.
