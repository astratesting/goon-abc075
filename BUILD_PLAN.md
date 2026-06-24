# Goon MVP Build Plan

## 1. PRODUCT

Goon is an on-demand 3D printing service for hobbyist inventors and small hardware startups who need fast, low-friction custom parts without minimum order quantities. The MVP extends the existing landing page into a working app where a maker signs up, uploads an STL/OBJ file, configures material/finish/color through a guided quote flow, submits the request, then tracks the order through a five-stage progress bar while an admin triages and updates status from a separate dashboard. The core value is collapsing the gap between "I have a CAD file" and "I have a physical part in my hand" — the research shows Shapeways' collapse left hobbyists stranded, Xometry/Protolabs are B2B-only with MOQs, and no major player combines AI file repair with same-day local fulfillment. This MVP delivers the upload → quote → track loop end-to-end so the founder can validate the workflow with real users before building the AI repair and printer-routing layers.

## 2. WHO IT'S FOR

The ICP from research is independent inventors and hobbyist creators (25–55, technically inclined, predominantly male) plus small hardware startup founders validating concepts. They are time-poor, CAD-literate, frustrated by their own printer quality, and allergic to enterprise procurement flows. This shapes every product decision:

- **No nested menus.** Dashboard opens on a single "Next step" card.
- **No jargon walls.** Material names are PLA/ABS/Resin/Nylon with one-line plain-English descriptions, not datasheets.
- **No MOQ copy, no enterprise pricing tables.** The quote form is one screen with three dropdowns.
- **Tone is maker-to-maker.** Calm, direct, slightly nerdy. No marketing fluff.
- **Mobile-friendly.** Many hobbyists upload from a phone after slicing on a laptop.
- **Status page is the homepage after login.** Makers want to know "where's my part" — that's the first thing they see.

## 3. LOOK & FEEL

### Visual system (extends existing Calm System)

- **Palette (from globals.css vars, unchanged):** sky `#6DB5D2`, mint `#A5D8C1`, sand `#E8CDA0`, soft white `#F5F8FA`, ink `#2C3E50`, plus a derived muted slate `#5A6B7A` for secondary text and a hairline `#D9E2EA` for borders.
- **Typography:** Geist Sans for UI/body, Geist Mono for filenames/order IDs/material codes, Lora for the one or two marketing-style headings on auth pages. No new font loads.
- **Spacing:** 4px base, generous vertical rhythm (24/32/48px section gaps). Cards use 24px padding, 16px border-radius, 1px hairline border in `#D9E2EA`, no drop shadows except a single soft `0 1px 2px rgba(44,62,80,0.04)` on hover.
- **Iconography:** Lucide icons only (already in the repo's stack). Stroke 1.5, size 16/20/24.
- **Imagery:** No stock photos. Empty states use simple line illustrations or just a single muted icon centered in a 96px circle with sky-blue tint.
- **Motion:** 150ms ease-out on hover, 200ms on page transitions. Progress bar fills with a 400ms ease-in-out. Drag-over state pulses the dropzone border in mint.
- **Buttons:** Primary = sky-blue fill, white text, 10px radius. Secondary = white fill, hairline border, ink text. Destructive = ink text on sand-tinted background. All buttons 40px tall, 14px horizontal padding.

### Screen-by-screen layout

**`/login` and `/signup`** — Centered card (max-width 400px) on soft-white background. Logo wordmark "goon" in Lora 28px at top. Card has 32px padding, hairline border. Email field, password field (with show/hide toggle), primary submit button full-width. Below the button, a single line link: "New here? Create an account" or "Already have one? Sign in". No social buttons. No "forgot password" link in MVP (out of scope; password reset is a follow-up).

**`/dashboard`** — Top bar: "goon" wordmark left, user email + "Sign out" right, hairline bottom border. Main area is a single column, max-width 720px, centered. Top: greeting "Hey, {firstName}" in Lora 24px. Below: a "Next step" card that adapts — if no active order, it shows "Upload a file to get started" with a primary button to `/dashboard/upload`. If an active order exists, it shows the order ID, current status pill, and a link to `/orders/[id]`. Below that: a two-column grid of action cards — "Upload file" (sky tint) and "Request a quote" (mint tint). Below: a "Recent orders" list (last 5) with order ID, material, status pill, date. Empty state: muted icon + "No orders yet."

**`/dashboard/upload`** — Page title "Upload your file" (Lora 24px), subtitle "STL or OBJ, up to 50 MB." Below: a large dropzone (full-width, 240px tall, dashed hairline border, mint on drag-over) with a centered upload icon, "Drag a file here or click to browse" text, and a small "Accepted: .stl, .obj" caption. Below the dropzone: a "Selected file" row that appears after selection, showing filename (mono), size, and a remove X. Below that: a primary "Continue to quote" button (disabled until file is selected). On submit: file uploads via `POST /api/upload`, returns file ID, redirects to `/dashboard/quote?file={id}`.

**`/dashboard/quote`** — Multi-step form rendered as a single page with a step indicator at top (1 Material → 2 Color → 3 Finish → 4 Review). Step indicator is four circles connected by a line, current step filled sky-blue, completed steps filled mint, future steps hairline. Each step shows one question prominently with large radio cards (full-width, 24px padding, selected state has sky-blue left border 3px and soft sky tint background). Material options: PLA (default, "Easy to print, biodegradable"), ABS ("Tough, heat-resistant"), Resin ("High detail, smooth surface"), Nylon ("Durable, flexible"). Color: 8 swatches in a 4×2 grid (White, Black, Gray, Sky Blue, Mint, Sand, Red, Yellow) — each is a 48px circle with a hairline border, selected gets a 2px sky ring. Finish: Standard ("As-printed"), Sandblasted ("Matte, smooth"), Painted ("Color-coated, +$X"). Review step shows a summary card with all selections, the uploaded filename, and a "Submit quote request" button. On submit: `POST /api/quotes`, returns order ID, redirects to `/orders/[id]`.

**`/orders/[id]`** — Public-readable by the order owner (checked server-side). Top: order ID in mono, date, status pill. Below: a horizontal progress bar with five labeled stages — Processing, Printing, Quality Check, Shipped, Delivered. Completed stages are filled mint, current stage is filled sky-blue with a subtle pulse, future stages are hairline. Below the bar: a vertical timeline of status updates (timestamp + note from admin). Below: order details card (material, color swatch, finish, filename). If status is "Shipped" or later, show a tracking note field if admin added one.

**`/admin`** — Gated by `is_admin` flag on user. Top bar identical to dashboard but with an "Admin" badge in sand next to the email. Main area: a stats row (3 cards: Pending count, In Progress count, Shipped this week) — counts are real, not invented. Below: a table of all orders with columns: Order ID, Customer email, Material, Submitted, Status (dropdown to change), Actions (View). Status dropdown changes call `PATCH /api/orders/[id]` inline with optimistic UI. Empty state: "No orders yet." with a muted inbox icon.

**`/admin/orders/[id]`** — Full order detail. Top: order ID, customer email, current status pill with a status-change dropdown. Below: a two-column layout — left column has order details (material, color, finish, filename with download link, submitted date), right column has an "Add status update" form (status select + optional note textarea + "Post update" button). Below: the full timeline of updates. Admin can also delete the order (destructive button, requires confirmation modal).

## 4. USER FLOWS

### Flow A — Sign up & first order
1. User lands on `/`, clicks "Get started" → `/signup`.
2. Submits email + password → server action creates user in DB, hashes password with bcrypt, creates NextAuth session, redirects to `/dashboard`.
3. Dashboard shows empty state with "Upload a file" CTA.
4. User clicks → `/dashboard/upload`, drags STL file, clicks Continue.
5. File uploads to `/api/upload`, stored on disk under `uploads/{userId}/{uuid}.{ext}`, metadata saved to DB.
6. Redirects to `/dashboard/quote?file={id}` with step 1 active.
7. User picks PLA → Next → Black → Next → Standard → Next → Review → Submit.
8. `POST /api/quotes` creates order with status "Processing", links to file, redirects to `/orders/[id]`.
9. Status bar shows Processing filled mint, Printing current sky-blue.

### Flow B — Admin triages order
1. Admin logs in → `/admin` (redirected from `/dashboard` if `is_admin`).
2. Sees new order in table with "Processing" status.
3. Changes status dropdown to "Printing" → `PATCH /api/orders/[id]` updates DB, posts timeline note.
4. Clicks View → `/admin/orders/[id]`, adds note "Started print on Bambu X1C", clicks Post update.
5. Later, changes status to "Quality Check", then "Shipped" with tracking note "USPS 9400...".

### Flow C — Customer checks status
1. Customer logs in → `/dashboard` shows active order card with "In Quality Check" pill.
2. Clicks order → `/orders/[id]` sees progress bar at stage 3, timeline shows two updates.

### States
- **Loading:** Skeleton rows on tables, spinner on buttons during submit.
- **Error:** Inline form errors in `#C0392B` (a single derived red, not in palette but needed for errors) below fields. Toast for API failures.
- **Empty:** Muted icon + one-line copy on every list.
- **Unauthorized:** `/dashboard/*` and `/admin/*` redirect to `/login` if no session. `/admin/*` shows 403 page if logged in but not admin.

## 5. PAGES / ROUTES

| Route | Purpose | Auth | Layout |
|---|---|---|---|
| `/` | Existing landing page | Public | Unchanged |
| `/login` | Email/password sign in | Public | Centered card |
| `/signup` | Email/password registration | Public | Centered card |
| `/dashboard` | Customer home | Session | Top bar + single column |
| `/dashboard/upload` | File upload | Session | Top bar + dropzone |
| `/dashboard/quote` | Multi-step quote form | Session | Top bar + step indicator |
| `/orders/[id]` | Customer order tracking | Session + owner check | Top bar + progress bar |
| `/admin` | Admin order list | Session + `is_admin` | Top bar + stats + table |
| `/admin/orders/[id]` | Admin order detail | Session + `is_admin` | Top bar + two-column |
| `/api/auth/[...nextauth]` | NextAuth handler | — | Route handler |
| `/api/upload` | File upload POST | Session | Route handler |
| `/api/quotes` | Quote submission POST | Session | Route handler |
| `/api/orders` | Order list GET, create POST | Session | Route handler |
| `/api/orders/[id]` | Order GET/PATCH/DELETE | Session + owner or admin | Route handler |

## 6. CORE FEATURES

### F1 — Email/password auth (NextAuth v5 Credentials)
- `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` are server components that render client form components.
- Signup server action (`app/(auth)/signup/actions.ts`) validates input, checks email uniqueness, hashes password with `bcryptjs` (10 rounds), inserts user row, calls NextAuth `signIn` programmatically.
- Login uses NextAuth Credentials provider that looks up user by email, compares bcrypt hash, returns user object on success.
- Session strategy: JWT (no DB session table needed for MVP).
- `NEXTAUTH_SECRET` from env, `NEXTAUTH_URL` from env or inferred.
- Middleware (`middleware.ts`) protects `/dashboard/*`, `/orders/*`, `/admin/*` — redirects to `/login` if no session, to `/` with 403 if `/admin/*` without `is_admin`.

### F2 — File upload
- Client component with drag-and-drop using native HTML5 DnD events (no extra library).
- Validates extension (`.stl`, `.obj`) and size (≤50MB) client-side and server-side.
- `POST /api/upload` uses `formData()`, writes file to `uploads/{userId}/{uuid}.{ext}` via `fs/promises`, inserts `files` row with `{id, user_id, filename, size, mime, path, created_at}`.
- Returns `{fileId}` to client.

### F3 — Quote request
- Multi-step form is a single client component with internal `step` state (1–4). No URL routing between steps to keep it simple; back/next buttons in component.
- On final submit, `POST /api/quotes` with `{fileId, material, color, finish}`.
- Server validates all fields against allowed enums, creates `orders` row with status `"Processing"`, creates initial `order_updates` row with note "Order received".
- Returns `{orderId}`.

### F4 — Admin order management
- `/admin` server component fetches all orders via `lib/db.ts` helpers, passes to client table component.
- Status dropdown is a client component that calls `PATCH /api/orders/[id]` with `{status}` and on success updates local state.
- `/admin/orders/[id]` has an "Add update" form that posts to `PATCH /api/orders/[id]` with `{status?, note?}` — if status provided, updates order and appends timeline entry; if note provided without status, just appends timeline entry.

### F5 — Status tracking
- `/orders/[id]` server component fetches order + updates, checks `order.user_id === session.user.id` (or admin), renders progress bar.
- Progress bar is a client component that takes `currentStage` (1–5) and renders five labeled segments. Pure presentational, no state.
- Timeline is a vertical list of `{timestamp, status, note}` from `order_updates` table.

### F6 — Public order API
- `GET /api/orders` — returns orders for current user (or all if admin). Query params: `?status=`, `?limit=`.
- `POST /api/orders` — admin-only, creates order manually (for phone orders).
- `GET /api/orders/[id]` — owner or admin.
- `PATCH /api/orders/[id]` — admin-only for status changes; owner can only cancel (status → "Cancelled", not in MVP enum but reserved).
- `DELETE /api/orders/[id]` — admin-only.

## 7. DATA MODEL

SQLite via `better-sqlite3` (synchronous, zero-config, perfect for MVP). DB file at `./data/goon.db`, auto-created on first run by `lib/db.ts`.

**users**
- `id` TEXT PRIMARY KEY (uuid)
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `name` TEXT (optional, from signup)
- `is_admin` INTEGER NOT NULL DEFAULT 0 (boolean)
- `created_at` TEXT NOT NULL (ISO 8601)

**files**
- `id` TEXT PRIMARY KEY (uuid)
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `filename` TEXT NOT NULL (original name)
- `stored_path` TEXT NOT NULL (relative to project root)
- `size_bytes` INTEGER NOT NULL
- `mime_type` TEXT NOT NULL
- `created_at` TEXT NOT NULL

**orders**
- `id` TEXT PRIMARY KEY (uuid)
- `user_id` TEXT NOT NULL REFERENCES users(id)
- `file_id` TEXT NOT NULL REFERENCES files(id)
- `material` TEXT NOT NULL CHECK (material IN ('PLA','ABS','Resin','Nylon'))
- `color` TEXT NOT NULL CHECK (color IN ('White','Black','Gray','Sky Blue','Mint','Sand','Red','Yellow'))
- `finish` TEXT NOT NULL CHECK (finish IN ('Standard','Sandblasted','Painted'))
- `status` TEXT NOT NULL DEFAULT 'Processing' CHECK (status IN ('Processing','Printing','Quality Check','Shipped','Delivered','Cancelled'))
- `tracking_note` TEXT (optional, admin-set)
- `created_at` TEXT NOT NULL
- `updated_at` TEXT NOT NULL

**order_updates**
- `id` TEXT PRIMARY KEY (uuid)
- `order_id` TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE
- `status` TEXT NOT NULL (snapshot at time of update)
- `note` TEXT (optional)
- `created_at` TEXT NOT NULL
- `created_by` TEXT NOT NULL REFERENCES users(id) (admin user id)

Indexes: `orders(user_id)`, `orders(status)`, `order_updates(order_id, created_at DESC)`.

`lib/types.ts` exports TypeScript interfaces matching these tables plus enums for `Material`, `Color`, `Finish`, `OrderStatus`, and a `OrderWithDetails` joined type.

## 8. AUTH

NextAuth v5 (beta) with Credentials provider only. No social buttons. No Clerk.

- `auth.ts` at project root exports `auth`, `signIn`, `signOut`, `handlers` from `NextAuth({...})`.
- Credentials provider `authorize` function: looks up user by email via `lib/db.ts`, compares password with `bcjs.compare`, returns `{id, email, name, isAdmin}` on success, `null` on failure.
- JWT callback adds `isAdmin` to token, session callback exposes it as `session.user.isAdmin`.
- `middleware.ts` uses `auth` from `auth.ts` to protect routes.
- Env vars required: `NEXTAUTH_SECRET` (generated random string), `NEXTAUTH_URL` (e.g. `http://localhost:3000`).
- `.env.example` documents both. App boots and works with just these two set.

## 9. FILES

```
app/
  (auth)/
    login/
      page.tsx
      login-form.tsx
    signup/
      page.tsx
      signup-form.tsx
      actions.ts
  dashboard/
    layout.tsx
    page.tsx
    upload/
      page.tsx
      upload-zone.tsx
    quote/
      page.tsx
      quote-form.tsx
  orders/
    [id]/
      page.tsx
      progress-bar.tsx
      timeline.tsx
  admin/
    layout.tsx
    page.tsx
    orders-table.tsx
    orders/
      [id]/
        page.tsx
        status-editor.tsx
        add-update-form.tsx
  api/
    auth/
      [...nextauth]/
        route.ts
    upload/
      route.ts
    quotes/
      route.ts
    orders/
      route.ts
      [id]/
        route.ts
  layout.tsx (unchanged)
  page.tsx (unchanged)
  globals.css (unchanged)
auth.ts
middleware.ts
lib/
  db.ts
  types.ts
  auth-helpers.ts
  validators.ts
components/
  ui/
    button.tsx
    input.tsx
    card.tsx
    pill.tsx
    dropzone.tsx
    radio-card.tsx
    swatch-picker.tsx
    step-indicator.tsx
    toast.tsx
  layout/
    top-bar.tsx
data/
  .gitkeep
uploads/
  .gitkeep
.env.example
package.json (add: next-auth@beta, bcryptjs, better-sqlite3, uuid, @types/bcryptjs, @types/better-sqlite3, @types/uuid)
```

## 10. ACCEPTANCE

- [ ] Landing page (`/`) renders identically to before — no visual or copy changes.
- [ ] `/signup` creates a user, hashes password, signs in, redirects to `/dashboard`.
- [ ] `/login` authenticates existing user, redirects to `/dashboard`.
- [ ] `/dashboard` requires session; redirects to `/login` when logged out.
- [ ] `/dashboard/upload` accepts STL/OBJ via drag-drop and click, rejects other extensions and files >50MB with inline error.
- [ ] Uploaded file is written to `uploads/{userId}/` and a `files` row exists in SQLite.
- [ ] `/dashboard/quote` shows 4-step form, validates selections, submits to `/api/quotes`, creates order with status "Processing".
- [ ] `/orders/[id]` shows progress bar with correct stage highlighted, timeline of updates, order details.
- [ ] `/orders/[id]` returns 404 (or redirects) when accessed by a non-owner non-admin.
- [ ] `/admin` requires `is_admin`; non-admins get 403.
- [ ] `/admin` lists all orders, status dropdown changes persist via `PATCH /api/orders/[id]`.
- [ ] `/admin/orders/[id]` allows adding status updates with optional notes; updates appear in customer timeline.
- [ ] `GET /api/orders` returns caller's orders (or all if admin); `POST` is admin-only.
- [ ] `GET/PATCH/DELETE /api/orders/[id]` enforce owner-or-admin.
- [ ] SQLite DB auto-creates on first run; schema migrations run idempotently.
- [ ] All forms show loading states during submit and inline errors on failure.
- [ ] No social login buttons anywhere. No Clerk. No fake testimonials, logos, or user counts.
- [ ] `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are the only required env vars to boot.
- [ ] `npm run build` succeeds with no type errors.
- [ ] `npm run dev` boots and the full signup → upload → quote → track → admin-update flow works end-to-end.

FILES: ["app/(auth)/login/page.tsx", "app/(auth)/login/login-form.tsx", "app/(auth)/signup/page.tsx", "app/(auth)/signup/signup-form.tsx", "app/(auth)/signup/actions.ts", "app/dashboard/layout.tsx", "app/dashboard/page.tsx", "app/dashboard/upload/page.tsx", "app/dashboard/upload/upload-zone.tsx", "app/dashboard/quote/page.tsx", "app/dashboard/quote/quote-form.tsx", "app/orders/[id]/page.tsx", "app/orders/[id]/progress-bar.tsx", "app/orders/[id]/timeline.tsx", "app/admin/layout.tsx", "app/admin/page.tsx", "app/admin/orders-table.tsx", "app/admin/orders/[id]/page.tsx", "app/admin/orders/[id]/status-editor.tsx", "app/admin/orders/[id]/add-update-form.tsx", "app/api/auth/[...nextauth]/route.ts", "app/api/upload/route.ts", "app/api/quotes/route.ts", "app/api/orders/route.ts", "app/api/orders/[id]/route.ts", "auth.ts", "middleware.ts", "lib/db.ts", "lib/types.ts", "lib/auth-helpers.ts", "lib/validators.ts", "components/ui/button.tsx", "components/ui/input.tsx", "components/ui/card.tsx", "components/ui/pill.tsx", "components/ui/dropzone.tsx", "components/ui/radio-card.tsx", "components/ui/swatch-picker.tsx", "components/ui/step-indicator.tsx", "components/ui/toast.tsx", "components/layout/top-bar.tsx", ".env.example"]