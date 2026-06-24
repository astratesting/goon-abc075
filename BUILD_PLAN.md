# Goon — Full Product Build Plan

## 1. PRODUCT

Goon is an authenticated web app for hobbyist inventors and independent creators to upload imperfect CAD/STL files, get AI-assisted repair, request a print in a chosen material/technology, and track that order from queue → printing → shipped, all from a single dashboard. The core value is collapsing the Shapeways-era friction (file rejection, week-long lead times, MOQ barriers) into a "drop the file, get a part" flow with transparent per-part pricing and no minimums. The primary user is a 25–55 year-old technical hobbyist (per the ICP brief) who already has a `.stl`/`.step` file on their machine, is time-poor, and wants a fast, honest quote without an enterprise sales motion. The specific pain it solves is documented in the prior session notes: no major player combines consumer-friendly pricing, no MOQ, AI file repair, and same-day local fulfillment — Shapeways exited, Xometry/Hubs/Protolabs are B2B-only, Ponoko has 2-day lead times and a heavier flow.

## 2. WHO IT'S FOR

Primary ICP: independent hobbyist inventor (ages 25–55, technical, often has owned a personal FDM printer but outgrown its quality/speed), with a secondary segment of small startup founders validating physical prototypes. This shapes the product as follows:

- **Tone**: technical but not enterprise — "drag your STL here" beats "upload your CAD asset for review."
- **No MOQ, no sales contact**: pricing is a per-part quote shown in the dashboard, not a "request a quote" form that emails a rep.
- **Surface the AI file repair as a feature, not a service**: a checkbox plus a "Repair" button, with a clear before/after preview when possible.
- **Time-poor default**: the dashboard opens on the action that matters most right now (the active order), not on a nav-heavy admin layout.
- **Honest about what the network can/can't do**: tech selection shows what's actually available locally (FDM, SLA, SLS) with lead-time ranges, not a fake "all materials, all locations."

The tone is Calm System — quiet, confident, instrumental — which is appropriate for a builder who wants the UI to disappear and the part to show up.

## 3. LOOK & FEEL

### 3.1 Visual system (extends the existing landing page)

- **Vibe / positioning**: Calm System — a soft, daylight, instrument-panel feel. Cards float on a soft-white plane with hairline borders; nothing screams "SaaS." The Orbit motif (a ring with a small dot) is the only decorative mark; it's used for the empty-state of the order timeline and as a small spinner/progress ring.
- **Color palette (CSS vars in `globals.css` — DO NOT redefine, REUSE):**
  - `--sky-blue: #6DB5D2` → primary action, links, active state, focus ring
  - `--mint: #A5D8C1` → success states ("Print ready", "Shipped"), checkmarks
  - `--sand: #E8CDA0` → warning/queued states, AI repair highlight
  - `--soft-white: #F5F8FA` → page background
  - Ink: `#0F1B22` (text), mute: `#5A6A73` (secondary text), hairline: `#E3EAEE`
- **Typography**: `Geist` (sans, body + UI), `Lora` (serif accent, used for the dashboard's "Today" greeting and section headings like "Active order" / "Order history"). Reuse the `next/font` setup from the landing.
- **Spacing & layout**: 8px base scale (`p-2, p-4, p-6, p-8, p-12`). Container max-width 1120px on dashboard, 720px on the upload flow. Cards are 1px hairline border + 16px radius + `shadow-[0_1px_0_rgba(15,27,34,0.04)]`. No heavy shadows, no gradients.
- **Iconography**: `lucide-react` only. Keep stroke width 1.5. The Orbit mark is a custom inline SVG (a 16px ring + 4px dot) — used as the favicon-style mark in the dashboard header and as the empty-state illustration.
- **Imagery**: no stock photos. The dashboard is purely product UI; the only "image" is a 3D viewport placeholder (gray rounded box labeled "Preview") where a real STL thumbnail would go.
- **Motion**: 150ms ease-out for hovers, 250ms ease-in-out for the order timeline progress, 400ms for the Orbit ring on the landing. Reduced-motion respected via `motion-safe:` Tailwind variants.

### 3.2 Screens (top-to-bottom)

**Screen A — `/login` and `/signup`**
- Centered card (max-w 420px) on soft-white, with the Orbit mark + "Goon" wordmark at top.
- Below: Lora heading ("Sign in" / "Create your account"), Geist subtitle.
- Fields: email, password (with show/hide eye toggle, lucide `Eye` / `EyeOff`), plus a single primary button (`bg-sky-blue`, white text, full width).
- "Continue" button is disabled until both fields are valid; enables with a 150ms fade.
- Below the button: a one-line link ("Don't have an account? Sign up" / "Already on Goon? Sign in") and a one-line helper ("By continuing you agree to our terms.") — no fake legal copy, just neutral placeholder text.
- On submit: button shows an inline Orbit spinner; on error, a sand-tinted banner with a single line of error text appears above the button (no toast, no alert).

**Screen B — `/onboarding` (first-login only, gated by `user.onboardedAt === null`)**
- Single-column wizard, three steps, progress dots (sky-blue filled, hairline unfilled) at top.
- Step 1: "What brings you to Goon?" — four radio cards (Hobbyist project, Prototype for a startup, Replacement part, Just exploring). Each card is a 1px hairline box that becomes `--sky-blue` border + light sky-blue tint when selected.
- Step 2: "What's your home printer situation?" — three radio cards (Don't own one, Own an FDM, Own an FDM + resin/SLA). This tunes future material recommendations.
- Step 3: "Pick your first material" — three cards (FDM PLA, SLA Resin, SLS Nylon) with one-line description + a tiny mint-tinted lead-time badge ("Same day", "1–2 days", "2–4 days"). "Skip for now" link below.
- Bottom: "Back" (ghost) + "Continue" (primary). "Continue" fires PostHog `onboarding_step_completed` with `step` property, then advances. After step 3, sets `onboardedAt = now()` server-side, fires `onboarding_completed`, routes to `/dashboard`.

**Screen C — `/dashboard` (default home)**
- Top bar (sticky, soft-white with hairline bottom border, 64px tall): Orbit mark + "Goon" left; right side shows the user's email (mute color), a chevron-down that opens a tiny popover with "Account", "Sign out" (no other settings yet).
- Greeting block: Lora "Today" + Geist date (e.g., "Tuesday, June 23") + one-line status sentence (e.g., "No active orders. Upload a file to get started." or "Your PLA bracket is printing.").
- **Active order card** (only if there's an order in `printing` or `queued` state): hairline card, 24px padding. Left: 80px "Preview" gray box. Middle: file name (Geist, medium), technology + material + color (mute), and an inline timeline (4 nodes: Queued → Printing → Quality check → Shipped) with the current node filled sky-blue, completed nodes mint, future nodes hairline. Right: an estimated-ready date and a "View details →" link to `/orders/[id]`.
- **Quick upload card**: a 1px dashed hairline box, full-width, with a centered upload icon (lucide `UploadCloud`), primary text "Drop an STL, STEP, or OBJ here", mute "or click to browse", and a tiny mint badge "AI repair included" (sand-tinted badge if the file is over 50MB). Clicking opens a native file picker; drag-and-drop also works.
- **"Recent orders" list**: max 5 rows. Each row is a 1px-bottom-bordered row: small preview thumb, file name, material chip (sky-blue outline), status chip (mint for done, sand for queued/printing, hairline for shipped), price, date. Empty state: Orbit ring + "No orders yet" + a primary "Upload your first file" button.

**Screen D — `/orders/new` (the upload flow)**
- Two-column on `lg`, stacked on mobile. Left column = file preview (gray "Preview" box, 320px square, with the file name + size below). Right column = configuration.
- Configuration sections (vertical stack of cards, each hairline-bordered, 16px radius, 24px padding):
  1. **File**: file name, size, and a sand-tinted "Run AI repair" toggle (default ON, with a one-line helper: "We auto-fix non-manifold edges, holes, and inverted normals."). A small "Repair preview" button appears after the file is analyzed; for the MVP this just flips a `repaired: true` flag on the order and logs to PostHog.
  2. **Technology**: three segmented buttons (FDM / SLA / SLS) styled like a pill segmented control (selected = sky-blue background + white text). Each shows a one-line lead time ("Same day" / "1–2 days" / "2–4 days").
  3. **Material & color**: dropdown (Geist, hairline border) for material (e.g., "PLA", "ABS", "PETG" for FDM; "Tough Resin", "Clear Resin" for SLA; "PA12 Nylon" for SLS) and a 5-swatch color row (sky-blue, mint, sand, ink black, soft-white) with the active swatch ringed sky-blue.
  4. **Quantity**: `−` / number / `+` stepper, default 1, max 99.
  5. **Shipping**: a single field "ZIP / postal code" with a one-line note: "We match you to the closest printer in our network." No address collection in MVP — the order stores zip only.
- Sticky bottom bar (soft-white, hairline top): left side shows live price (Lora, 24px) + "Estimated total" mute label. Right side: "Place order" primary button, disabled until file + tech + zip are present. On click, POSTs to `/api/orders`, fires PostHog `order_created`, then routes to `/orders/[id]`.

**Screen E — `/orders/[id]` (order detail)**
- Header: "Back to dashboard" link (with `←` arrow), then Lora "Order #GO-XXXX" + created-at date.
- Timeline card (full width): the 4-node timeline, larger (each node 24px circle, label below). Current node label is sky-blue; completed nodes mint. Below the timeline, a one-line "Latest update" with timestamp.
- Two-column below: left = file preview + filename + size + "Download repaired file" button (sandbox: links to a placeholder file in the repo's `public/placeholders/`). Right = order summary card: technology, material, color (small swatch), quantity, shipping zip, price, status.
- Empty / non-owner state: if the order id doesn't belong to the signed-in user, render a 404 (not a 403 — don't leak existence).

**Screen F — `/orders` (full history)**
- Simple table (or stacked rows on mobile). Columns: preview, file, technology, material, status, price, date. Each row clickable to `/orders/[id]`. Pagination: "Load more" button (20 per page) — no infinite scroll on MVP.

**Screen G — `/account`**
- Three cards: "Profile" (email read-only, "Change password" form with current + new + confirm), "Sign out everywhere" (red hairline button, calls NextAuth `signOut` with `redirect: false` then routes to `/login`), "Delete account" (ghost button, opens a confirm dialog that explains this is irreversible in MVP and removes the row from `users`). No billing, no notifications, no integrations in MVP.

**Screen H — Landing page (unchanged)**
- Keep exactly as the web agent built it. The header's "Sign in" / "Get started" buttons now route to `/login` and `/signup` respectively. All existing `globals.css` vars, Tailwind colors, fonts, and the Orbit component are reused — no duplication.

## 4. USER FLOWS

### Flow 1 — Sign up
1. User lands on `/` → clicks "Get started" → `/signup`.
2. Enters email + password (min 8 chars, validated client + server).
3. Server creates `users` row (Supabase), hashes password (bcrypt via NextAuth Credentials provider), creates NextAuth session, sets `onboardedAt = null`, fires PostHog `signup_completed` (server-side via `posthog-node`).
4. Redirect to `/onboarding`.
5. Onboarding completes → `onboardedAt = now()` → `onboarding_completed` event → redirect to `/dashboard`.
6. States: loading (Orbit spinner in button), email-taken (sand banner: "An account with that email already exists. Sign in instead." with a link), validation error (inline under field), network error (sand banner above form).

### Flow 2 — Sign in
1. `/login` → email + password → NextAuth Credentials `authorize` checks bcrypt hash against Supabase `users.password_hash`.
2. On success: NextAuth JWT session, redirect to `/dashboard` (or to `?callbackUrl` if present, validated to be a same-origin path).
3. On failure: sand banner "Email or password is incorrect." — never reveal which one.
4. "Sign out" from `/account` or dashboard popover: NextAuth `signOut()` → `/login`.

### Flow 3 — Place an order
1. From dashboard quick-upload card or `/orders/new`, user picks a file (drag-drop or click). Client validates extension (`.stl`, `.step`, `.obj`) and size (≤ 100MB MVP cap).
2. File is read as `ArrayBuffer`, base64-encoded, POSTed to `/api/orders` (multipart alternative is fine but base64 keeps one code path). Server validates extension + size again, stores the raw bytes in a `files` row in Supabase Storage (path `orders/{userId}/{orderId}.{ext}`), creates an `orders` row with status `queued`.
3. Server triggers (synchronously, but fire-and-forget logged) "AI repair" — for MVP this is a deterministic stub that sets `repaired: true` and logs the file hash to PostHog as `ai_repair_run` with `file_hash`, `size_bytes`. A real repair service can swap in later behind the same interface (`lib/ai/repair.ts`).
4. Client redirects to `/orders/[id]`. PostHog `order_created` fires with `tech`, `material`, `price_cents`, `ai_repair: true`.
5. States: file too big (sand banner "Max 100MB for MVP"), unsupported extension (sand banner), upload in progress (progress bar inside the dashed box, sky-blue fill), server error (sand banner with retry button), success → redirect.

### Flow 4 — Track an order
1. From `/dashboard`, user sees the Active order card. The status is polled every 15s while the dashboard tab is visible (`document.visibilityState === 'visible'`) — `GET /api/orders?status=active` returns up to 5 active orders.
2. Status transitions are driven by a server-side mock scheduler (`lib/orders/progress.ts`) that runs when an order is fetched: it advances `queued → printing → quality_check → shipped` based on `createdAt + leadTimeMinutes(tech)`. For MVP, this is a deterministic time-based simulator; the data model and API don't change when a real queue replaces it.
3. On every status change, PostHog `order_status_changed` fires with `from` and `to`.
4. Once `shipped`, the order disappears from "Active" and appears in history.

### Flow 5 — View history
1. `/orders` lists all of the user's orders, newest first. Click a row → `/orders/[id]`.

### Flow 6 — Account management
1. `/account` → change password (POST `/api/account/password`, validates current, hashes new, updates `users.password_hash`, signs out all sessions by bumping a `tokenVersion` field included in the JWT).
2. Sign out everywhere: same as above with a confirm.
3. Delete account: confirm dialog → POST `/api/account/delete` → cascades delete `orders`, `files` (storage paths), then `users` row, then signs out.

## 5. PAGES / ROUTES

| Route | Purpose | Layout | Main UI elements |
|---|---|---|---|
| `/` | Marketing landing (unchanged) | Existing | Hero, features, pricing band, footer; "Sign in" / "Get started" now link to `/login` and `/signup` |
| `/login` | Sign in | Centered 420px card | Orbit mark, Lora heading, email + password, "Continue" button, link to `/signup`, error banner |
| `/signup` | Create account | Centered 420px card | Same shape as login + password strength meter (4 dots, mint when ≥8 chars + 1 number) |
| `/onboarding` | First-run wizard | 720px column, progress dots, step cards | 3 steps as described in Screen B |
| `/dashboard` | Authenticated home | 1120px container, sticky top bar, vertical stack | Greeting, active order card (conditional), quick upload card, recent orders list |
| `/orders/new` | Order creation flow | Two-column `lg`, stacked mobile, sticky bottom bar | File preview, config cards, price + Place order |
| `/orders/[id]` | Order detail | 1120px, header + timeline + 2-col summary | Timeline, file preview, order summary, "Download repaired file" |
| `/orders` | Full history | 1120px, table/rows | Columns: preview, file, tech, material, status, price, date; "Load more" |
| `/account` | Account settings | 1120px, three stacked cards | Profile (email read-only + change password), sign out, delete account |
| `/api/auth/[...nextauth]` | NextAuth handler | n/a | Credentials provider, JWT session, Supabase adapter |
| `/api/orders` (GET) | List orders for current user (paginated, optional `?status=`) | n/a | Returns orders array |
| `/api/orders` (POST) | Create order | n/a | multipart or JSON `{ fileBase64, tech, material, color, quantity, zip, aiRepair }` |
| `/api/orders/[id]` (GET) | Fetch one order (ownership-checked) | n/a | Returns order |
| `/api/account/password` (POST) | Change password | n/a | `{ current, next }` |
| `/api/account/delete` (POST) | Delete account | n/a | Confirms with `{ confirm: "DELETE" }` |
| `/api/analytics/identify` (POST) | Server-side PostHog identify alias | n/a | `{ distinctId, email }` — used to merge pre-signup anonymous events into the user |

## 6. CORE FEATURES

1. **Email + password auth (NextAuth Credentials)**
   - What it does: lets users sign up and sign in with email + password, no OAuth buttons, no dead social sign-in.
   - How it works: NextAuth v15 with the Credentials provider; `authorize()` reads email, looks up the Supabase `users` row, bcrypt-compares the password; on success returns `{ id, email }`; JWT session strategy (no DB sessions) with a `tokenVersion` claim so password changes / deletes invalidate sessions. Adapter: `@next-auth/supabase-adapter` for the user/account tables (even though we only use Credentials, the adapter gives us the `users` schema and `signOut` cleanup).

2. **AI file repair (toggle, stubbed in MVP)**
   - What it does: when a user uploads a file with the toggle on, the order is flagged `aiRepair: true` and a server-side stub returns `{ repaired: true, issues_fixed: ['non_manifold', 'holes'] }` (deterministic based on file size hash). Logs to PostHog. Real implementation plugs into `lib/ai/repair.ts` later.
   - How it works: same code path on the client; the only thing that changes is the body of `runRepair()`.

3. **Order upload with live config**
   - What it does: file pick / drag-drop, then 4 config sections (tech, material+color, quantity, zip), live price calculation, sticky "Place order" button.
   - How it works: client-side React state, no autosave; on submit, base64-encodes the file and POSTs to `/api/orders`. Price is computed client-side from a small `lib/pricing.ts` table (FDM: $15 base + $0.08/g estimated from file size; SLA: $40 base + $0.15/g; SLS: $50 base + $0.20/g) and re-validated server-side.

4. **Order status tracking with timeline**
   - What it does: shows each order's current stage (queued → printing → quality_check → shipped) with an inline timeline and a detailed page.
   - How it works: `lib/orders/progress.ts` is a pure function `(order, now) => orderWithStatus`. The server runs it on every read; transitions are persisted to the DB so polling is cheap. Dashboard polls `/api/orders?status=active` every 15s while visible.

5. **Order history**
   - What it does: paginated list of all of a user's past orders, newest first, with a "Load more" button.
   - How it works: `GET /api/orders?cursor=<id>&limit=20`, cursor-based on `createdAt desc, id desc`.

6. **Account settings**
   - What it does: change password (with current-password re-auth), sign out, delete account.
   - How it works: `/api/account/password` and `/api/account/delete` are POST endpoints that require a valid session, validate the current password (for password change), and bump `tokenVersion` to invalidate other sessions.

7. **PostHog analytics**
   - What it does: tracks `signup_completed`, `onboarding_step_completed` (with `step: 1|2|3`), `onboarding_completed`, `order_created` (with `tech`, `material`, `price_cents`, `ai_repair`), `order_status_changed` (with `from`, `to`), `ai_repair_run` (with `file_hash`, `size_bytes`), and `$pageview` (via `PostHogProvider` on the root layout).
   - How it works: client uses `posthog-js` initialized in a client component mounted in `app/layout.tsx`; server uses `posthog-node` for events fired in API routes. `posthog-js` is gated to only load in the browser (no SSR). On signup, the server calls `posthog.alias(anonymousId, userId)` so pre-signup `$pageview`s are merged into the user. Env vars: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_API_KEY` (server).

## 7. DATA MODEL

**`users` (Supabase, managed by `@next-auth/supabase-adapter` + our extra columns)**
- `id` uuid pk
- `email` text unique not null
- `password_hash` text not null (bcrypt)
- `name` text nullable
- `image` text nullable
- `email_verified` timestamptz nullable
- `onboarded_at` timestamptz nullable (null = not onboarded)
- `use_case` text nullable (`hobbyist` | `startup` | `replacement` | `exploring`)
- `home_printer` text nullable (`none` | `fdm` | `fdm_resin`)
- `preferred_material` text nullable
- `token_version` int default 0 (bumped on password change / delete to invalidate JWTs)
- `created_at` timestamptz default now()

**`orders`**
- `id` uuid pk
- `user_id` uuid fk → users.id (cascade delete)
- `order_number` text unique (e.g., `GO-000123` — short, human-readable, generated server-side)
- `file_id` uuid fk → files.id
- `file_name` text not null
- `file_size_bytes` bigint not null
- `tech` text not null (`fdm` | `sla` | `sls`)
- `material` text not null (e.g., `pla`, `abs`, `tough_resin`, `pa12`)
- `color` text not null (hex, one of the 5 swatches)
- `quantity` int not null default 1
- `shipping_zip` text not null
- `ai_repair` boolean not null default true
- `repaired` boolean not null default false
- `repaired_issues` text[] nullable (e.g., `['non_manifold', 'holes']`)
- `price_cents` int not null
- `status` text not null default `queued` (`queued` | `printing` | `quality_check` | `shipped` | `cancelled`)
- `status_updated_at` timestamptz not null default now()
- `created_at` timestamptz not null default now()

**`files`**
- `id` uuid pk
- `user_id` uuid fk → users.id (cascade delete)
- `storage_path` text not null (Supabase Storage path `orders/{userId}/{orderId}.{ext}`)
- `mime_type` text not null
- `size_bytes` bigint not null
- `sha256` text not null (for dedup + repair stub)
- `created_at` timestamptz default now()

**`order_events` (audit log, optional in MVP but cheap to add)**
- `id` uuid pk
- `order_id` uuid fk → orders.id
- `from_status` text nullable
- `to_status` text not null
- `at` timestamptz default now()

Relationships: `users 1—N orders`, `users 1—N files`, `orders 1—1 files` (one file per order in MVP), `orders 1—N order_events`. RLS: enable on all tables; policy `auth.uid() = user_id` for select/insert/update/delete on `orders` and `files`; `users` is `auth.uid() = id`.

## 8. AUTH

NextAuth v15 with the **Credentials provider** + **JWT session strategy** + **Supabase adapter** for the user table schema. No OAuth, no social buttons, no Clerk. The Credentials `authorize()` function:

1. Receives `{ email, password }` from the client form.
2. Queries Supabase `users` by `email` (lowercased).
3. bcrypt-compares `password` against `users.password_hash`. `bcrypt.compare` rounds default to 10.
4. Returns `{ id: user.id, email: user.email }` on success, `null` on failure.
5. JWT callback adds `tokenVersion` from the user row to the token; session callback exposes it.
6. Middleware (`middleware.ts`) protects all routes under `/dashboard`, `/orders`, `/account`, and `/onboarding` (only when `onboardedAt !== null` should the user be on `/dashboard`; gate the inverse). Unauthenticated requests get redirected to `/login?callbackUrl=<original>`. `callbackUrl` is validated to be a same-origin path starting with `/` to prevent open-redirects.

Password hashing uses `bcryptjs` (no native build needed for Vercel). Sign-up is a separate API route `POST /api/auth/signup` that creates the user row, hashes the password, then returns success; the client then calls NextAuth's `signIn('credentials', { email, password, redirect: false })` to mint the session.

Env vars required: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (auto on Vercel), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only, for the adapter and the storage uploads), `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_API_KEY`.

## 9. FILES

```
FILES: [
  "frontend/app/layout.tsx",
  "frontend/app/page.tsx",
  "frontend/app/globals.css",
  "frontend/app/(auth)/login/page.tsx",
  "frontend/app/(auth)/signup/page.tsx",
  "frontend/app/(auth)/layout.tsx",
  "frontend/app/(auth)/actions.ts",
  "frontend/app/onboarding/page.tsx",
  "frontend/app/onboarding/actions.ts",
  "frontend/app/dashboard/page.tsx",
  "frontend/app/dashboard/ActiveOrderCard.tsx",
  "frontend/app/dashboard/QuickUploadCard.tsx",
  "frontend/app/dashboard/RecentOrdersList.tsx",
  "frontend/app/dashboard/DashboardPoller.tsx",
  "frontend/app/orders/new/page.tsx",
  "frontend/app/orders/new/UploadFlow.tsx",
  "frontend/app/orders/new/ConfigCard.tsx",
  "frontend/app/orders/[id]/page.tsx",
  "frontend/app/orders/[id]/OrderTimeline.tsx",
  "frontend/app/orders/page.tsx",
  "frontend/app/orders/OrdersTable.tsx",
  "frontend/app/account/page.tsx",
  "frontend/app/account/ChangePasswordForm.tsx",
  "frontend/app/api/auth/[...nextauth]/route.ts",
  "frontend/app/api/auth/signup/route.ts",
  "frontend/app/api/orders/route.ts",
  "frontend/app/api/orders/[id]/route.ts",
  "frontend/app/api/account/password/route.ts",
  "frontend/app/api/account/delete/route.ts",
  "frontend/app/api/analytics/identify/route.ts",
  "frontend/middleware.ts",
  "frontend/lib/supabase/server.ts",
  "frontend/lib/supabase/browser.ts",
  "frontend/lib/supabase/storage.ts",
  "frontend/lib/auth/options.ts",
  "frontend/lib/auth/password.ts",
  "frontend/lib/orders/progress.ts",
  "frontend/lib/orders/status.ts",
  "frontend/lib/pricing.ts",
  "frontend/lib/ai/repair.ts",
  "frontend/lib/posthog/server.ts",
  "frontend/lib/posthog/client.tsx",
  "frontend/lib/validation/orders.ts",
  "frontend/lib/validation/auth.ts",
  "frontend/components/Orbit.tsx",
  "frontend/components/Button.tsx",
  "frontend/components/Card.tsx",
  "frontend/components/Field.tsx",
  "frontend/components/StatusChip.tsx",
  "frontend/components/Timeline.tsx",
  "frontend/components/PostHogProvider.tsx",
  "frontend/components/Header.tsx",
  "frontend/supabase/migrations/0001_init.sql",
  "frontend/supabase/migrations/0002_rls.sql",
  "frontend/.env.example",
  "frontend/README.md"
]
```

## 10. ACCEPTANCE

- [ ] `npm run dev` in `frontend/` starts cleanly; `npm run build` succeeds with zero TypeScript errors.
- [ ] Landing page (`/`) renders identically to the existing build; "Sign in" and "Get started" link to `/login` and `/signup`.
- [ ] Sign up with a new email creates a Supabase `users` row, hashes the password, and signs the user in.
- [ ] Sign in with the same email + password works; wrong password shows the neutral error banner.
- [ ] Sign out from the dashboard popover and from `/account` both end the session and route to `/login`.
- [ ] First-time sign-up lands on `/onboarding`; completing the 3 steps sets `onboardedAt` and routes to `/dashboard`.
- [ ] Returning users go straight to `/dashboard`; `/onboarding` redirects to `/dashboard` if already onboarded.
- [ ] Unauthenticated visits to `/dashboard`, `/orders`, `/orders/new`, `/orders/[id]`, `/account` redirect to `/login?callbackUrl=...` and bounce back after sign-in.
- [ ] Upload flow: drag-drop or click selects a file; unsupported extension and >100MB are rejected client-side with a sand banner.
- [ ] "Place order" creates an `orders` row, uploads the file to Supabase Storage, computes price, and routes to `/orders/[id]`.
- [ ] Order detail shows the 4-node timeline; the status advances over time per `lib/orders/progress.ts` and persists to the DB.
- [ ] Dashboard active-order card reflects the current status within 15s of a change (polling).
- [ ] `/orders` lists all of the user's orders, paginated 20 per page with a working "Load more" button.
- [ ] `/orders/[id]` for an order not owned by the current user renders a 404 (no existence leak).
- [ ] Change password on `/account` works and invalidates other sessions (signing in again on another tab signs the other out).
- [ ] Delete account removes the user's orders, files (storage paths), and the user row; user is signed out.
- [ ] PostHog: `$pageview` fires on every route change; `signup_completed`, `onboarding_step_completed` (×3), `onboarding_completed`, `order_created`, `ai_repair_run`, `order_status_changed` all appear in the PostHog project.
- [ ] PostHog `alias()` is called server-side on signup so anonymous pre-signup events are merged into the user.
- [ ] All `globals.css` vars (`--sky-blue`, `--mint`, `--sand`, `--soft-white`) are reused; no new hex values introduced in Tailwind classes.
- [ ] `Orbit` component is used consistently (header mark, login mark, empty-state illustration, button spinner).
- [ ] No social sign-in buttons (no Google, no GitHub) anywhere in the UI.
- [ ] No fake testimonials, customer counts, ratings, or press logos on the landing or dashboard.
- [ ] `README.md` documents required env vars and the Supabase migration steps.
- [ ] `supabase/migrations/0001_init.sql` + `0002_rls.sql` create all tables and enable RLS with the policies above.
- [ ] Deployed to Vercel (or equivalent) with env vars set; live URL returns 200 on `/` and a redirect to `/login` on `/dashboard`.