# Goon — Full App Build Plan

## 1. PRODUCT

Goon extends its on-demand 3D printing landing page into a working web app where hobbyist inventors sign up, upload a 3D model, pick a material, and get a price quote in one sitting — without account minimums, RFQ forms, or sales calls. The product closes the loop from marketing site to first quote: the value is "go from CAD file to a real, priced print order in under three minutes." The pain it solves is the one the research names explicitly: the consumer/hobbyist segment is underserved post-Shapeways, and existing platforms (Xometry, Hubs, Ponoko) gate hobbyists behind B2B UX — minimum orders, sales contact, slow manual quotes. Goon's product removes that friction with a single dashboard flow: upload → select → quote → submit.

## 2. WHO IT'S FOR

The ICP from research is an independent inventor or hobbyist creator, 25–55, technically inclined, with imperfect CAD files who needs fast, affordable prototyping with no minimum order. This shapes every product decision:

- **No jargon-heavy B2B language.** Copy says "Upload your file," not "Submit geometry for manufacturability review."
- **No dashboards-within-dashboards.** Side nav is flat. The post-login landing is the next action: upload.
- **No fake social proof.** No "trusted by 10,000 makers" or invented logos. Honest empty states instead.
- **Mobile-tolerant, not mobile-first** — hobbyists use laptops for CAD work, but upload must work from phone.
- **Tone: calm, direct, slightly playful** — matches the Calm System visual brand. The research says this segment is time-poor; copy is short.

## 3. LOOK & FEEL

The existing Calm System is preserved exactly. New screens extend it without reinventing the visual language.

**Palette (locked, from existing globals.css):**
- Primary sky blue `#6DB5D2` — CTAs, links, focus rings
- Mint `#A5D8C1` — success states, progress, "ready" badges
- Sand `#E8CDA0` — highlights, quote panel background, warm accent
- Soft white `#F5F8FA` — page background
- Ink `#1A2330` — body text
- Mute `#6B7785` — secondary text

**Typography:** Geist Sans for UI/numbers, Lora for the one accent line per screen (used in quote panel and welcome hero). No new fonts.

**Spacing:** 8px base unit. Sections padded `py-16` desktop / `py-10` mobile. Card radius `rounded-2xl` (16px), buttons `rounded-xl` (12px). Generous whitespace — the brand is "calm."

**Iconography:** Lucide-react (already likely present; add if not). Stroke 1.5px, 20px default. Icons: Upload, Box, Layers, Clock, FileCheck, LogOut, Settings, ChevronRight, Check.

**Imagery:** No stock photos, no product shots of prints (we don't have any yet — honest empty state). Use abstract orbit SVG mark (existing) and gradient washes of sky→mint on hero areas. The upload screen uses a dashed-border drop zone, not a product image.

**Motion:** Subtle only. Drop zone border pulses (1.5s) on drag-over. Spinner uses the orbit mark rotating. Page transitions: no animation library — `transition-opacity duration-200` on route content. Respect `prefers-reduced-motion`.

**Components (reusable, built once):**
- `<Button variant="primary|secondary|ghost">` — primary uses sky blue, secondary is white with sky border, ghost is text-only with hover bg.
- `<Card>` — `bg-white rounded-2xl border border-slate-200/60 p-6 shadow-[0_1px_2px_rgba(26,35,48,0.04)]`
- `<Field>` — label + input + helper text, Geist Sans.
- `<Badge>` — mint bg for success, sand bg for "draft," sky bg for "in review."
- `<EmptyState icon title body cta>` — used wherever data is empty.
- `<Stepper steps={[]} current={n} />` — for onboarding.
- `<DropZone onFile accept />` — dashed border, drag-over state, file preview row.

---

### Screens, top to bottom

**`/login` and `/signup` (auth pages)**
Split layout, but on mobile stacks. Left 60% on desktop: centered card on soft-white page. Card max-width 420px, white, rounded-2xl, p-8.
- Logo + wordmark top
- H1 in Geist 28px: "Welcome back" (login) / "Create your Goon account" (signup)
- Lora accent line below: "Print your first part today."
- Fields: Email, Password (signup adds Full name, optional)
- Primary button full width: "Log in" / "Create account"
- Below button, small link: "Don't have an account? Sign up" / "Already have an account? Log in"
- Tiny footnote: "By continuing you agree to our Terms and Privacy." (No link to fake Terms — text only, neutral)
- Right 40% on desktop: subtle sky→mint gradient with large faded orbit SVG. Hidden on mobile.

**`/onboarding` (post-signup, first visit only)**
Full-height page, max-width 720px, centered.
- Top: `<Stepper>` showing 3 steps: "Upload file" / "Choose material" / "Get your quote"
- Step 1 active: title "Let's print something." Lora subline "Three minutes from file to quote."
- Single drop zone (full width, 240px tall) with upload icon and "Drop your .STL or .OBJ here, or click to browse"
- Below: small text "Max 50MB. Files stay private to your account."
- "Continue" button disabled until a file is attached. On click → Step 2.
- Step 2: radio cards for 3 materials (FDM PLA, SLA Resin, SLS Nylon) with sand highlight on selected, small description and "from $X" placeholder.
- "Continue" → Step 3.
- Step 3: quote panel — sand background, Lora headline "Your instant quote," then a line "Quote: $XX.XX" (mocked from file size heuristic), "Lead time: ~3-5 days" (honest placeholder for now). Two buttons: "Place order" (primary, submits and routes to `/dashboard/orders/[id]`) and "Save for later" (secondary, goes to `/dashboard`).
- Top-right of page: "Skip onboarding" link → `/dashboard`.

**`/dashboard` (home for logged-in users)**
Top bar: small Goon mark + wordmark (left), user email + avatar circle (initial) + dropdown (Account, Sign out) on right. Below: subtle 1px border.
Body max-width 1120px, p-8.
- H1: "Welcome back, {firstName}."
- Lora subline: "Ready to print?"
- Two columns on desktop (stacks mobile):
  - **Left col (8/12):** "Your orders" card. If empty: `<EmptyState>` with Box icon, "No orders yet," "Upload a file to get your first quote," CTA button "Start an order" → `/dashboard/orders/new`.
  - If orders exist: table-ish list (cards on mobile) with columns: Order # (e.g. `GO-000123`), File name, Material badge, Status badge, Quote amount, Date. Click row → `/dashboard/orders/[id]`. "New order" button top-right of card.
  - Below orders card: "Quick actions" row — two small cards: "Upload a file" (icon Upload) and "Browse materials" (icon Layers). Both route somewhere real (`/dashboard/orders/new` and `/dashboard/materials`).
- **Right col (4/12):** "Account" card — email, member since date, "Edit profile" link to `/dashboard/account`. Below: "Admin: Signup analytics" card — visible only to the first signed-up user (treated as admin for this build; logic in RLS/role column). Shows total signup count (big number) and a list of 10 most recent signups (email + created_at). No real PII redacted in the DB.

**`/dashboard/orders/new` (the core flow — upload → material → quote → submit)**
Single page, 3 visible sections stacked, but state-driven (no multi-page reload). Stepper at top identical to onboarding but persistent.

- **Section 1: Upload.** Drop zone 200px tall. When file attached, replace with a row: file icon, file name, size, "Remove" ghost link. If re-uploading, replace the row.
- **Section 2: Material.** 3 radio cards in a row (1 col on mobile). Each card: material name, short description (1 line), technology tag (FDM/SLA/SLS), "from $X" base price.
- **Section 3: Quote (sticky on desktop, inline on mobile).** Sand-tinted card. Shows: selected material, computed quote (mock formula: `basePrice + (fileSizeMB * perMBrate)` with sane per-material rates), lead time range. Quote is mock-calculated client-side, clearly labeled in a tiny line: "Instant estimate. Final price confirmed by email."
- Sticky bottom bar on mobile with "Place order" primary button. On desktop, button inside the quote card.
- On submit: create order row in Supabase, route to `/dashboard/orders/[id]` showing confirmation card with order #, summary, "We'll email when it's ready." (Email is mocked; honest placeholder text "Email notifications: coming soon" if Resend not configured.)

**`/dashboard/orders/[id]`**
- Back link "← All orders"
- H1: `Order GO-000123`
- Status badge (top right): "Submitted" (sky) → "In review" (sand) → "Printing" (mint) → "Shipped" (mint, with check). For now, statuses are set by the user clicking "Mark as..." buttons in a small "Update status" card — an honest dev-mode affordance. Real status will come from the fulfillment system later.
- Card: file name, material, quote, ordered at.
- "Cancel order" ghost button (only if status = Submitted).

**`/dashboard/materials`**
Static reference page. 3 expandable cards (FDM / SLA / SLS) with one paragraph each, finishes, tolerances, ideal use. All from research. No fake numbers beyond the per-material base price already shown elsewhere.

**`/dashboard/account`**
- Read-only fields: email (editable → Supabase `updateUser`), display name, member since.
- "Change password" inline form (current + new + confirm) calling Supabase `updateUser`.
- "Sign out" button bottom.

**`/dashboard/admin/signups` (admin only, role-gated)**
- If non-admin hits it: 404.
- Big number: total users.
- Table: email, created_at, last_sign_in_at. Pagination simple (limit 50, "Load more").

## 4. USER FLOWS

**Flow A — Sign up → first order (primary)**
1. Land on `/` (existing marketing page) → click "Get started" CTA in nav → `/signup`.
2. Submit email + password + name → Supabase creates user → server-side `INSERT profiles` row (trigger) → on success, redirect `/onboarding`.
3. Onboarding Step 1: drop file (client validates extension + size). Click Continue.
4. Step 2: select material. Continue.
5. Step 3: see quote. Click "Place order" → POST `/api/orders` → row created → redirect `/dashboard/orders/[id]`.
6. Dashboard `/dashboard` now shows the order in the list.

States: loading on submit (button spinner, disabled), error (inline red text under form), validation (empty file = disabled Continue), already onboarded (redirect from `/onboarding` → `/dashboard`).

**Flow B — Login**
`/login` → submit → Supabase → redirect `/dashboard`. If session is fresh and `profiles.onboarded = false`, redirect `/onboarding` instead.

**Flow C — Returning user with orders**
`/dashboard` → click order row → detail page → click "Mark as printing" → status updates → return to dashboard, badge color updated.

**Flow D — Sign out**
Avatar menu → Sign out → Supabase `signOut()` → redirect `/`.

**Flow E — Admin viewing signups**
Login as the seeded admin user → nav has "Admin" link (only shown when `profiles.role = 'admin'`) → `/dashboard/admin/signups` shows counts + list.

## 5. PAGES / ROUTES

| Route | Purpose | Auth | Layout / key UI |
|---|---|---|---|
| `/` | Existing landing | public | unchanged |
| `/login` | Email/password sign in | public | split layout, card form |
| `/signup` | Email/password register | public | split layout, card form |
| `/onboarding` | 3-step first order | auth, gated by `!onboarded` | stepper, full-width sections |
| `/dashboard` | Account home | auth | top bar, 2-col body, orders + account cards |
| `/dashboard/orders/new` | Upload + material + quote | auth | stepper, stacked sections, sticky CTA mobile |
| `/dashboard/orders/[id]` | Order detail | auth | back link, status badge, summary card |
| `/dashboard/orders` | List view (alias of dashboard orders card) | auth | same as dashboard card component, full-width |
| `/dashboard/materials` | Material reference | auth | 3 expandable cards |
| `/dashboard/account` | Profile + password | auth | form card |
| `/dashboard/admin/signups` | Signup analytics (admin) | auth + role | number card + table |
| `/api/orders` | POST create order | auth | server action or route handler |
| `/api/orders/[id]/status` | PATCH status | auth + owner | route handler |
| `/api/profile/onboarded` | POST mark complete | auth | route handler |
| `/auth/callback` | Supabase email callback (if email confirm on) | public | exchanges code, redirects |

## 6. CORE FEATURES

**F1. Email/password auth (Supabase)**
- Server client via `@supabase/ssr` `createServerClient` reading/writing cookies in App Router.
- Client client for browser interactions.
- Middleware (`middleware.ts`) refreshes session on every request and protects `/dashboard/*` and `/onboarding` (redirect to `/login?next=...` if no session).
- Sign up: `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`. DB trigger inserts `profiles` row with `id = auth.users.id`, `role = 'user'` (or `'admin'` if email matches `ADMIN_EMAIL` env).
- Login: `signInWithPassword`.
- Sign out: `signOut()` from client, then `router.push('/')` + `router.refresh()`.
- Password change on account page.
- No social buttons. No "forgot password" beyond Supabase's `resetPasswordForEmail` (a real working link in the card, sends to `redirectTo: /auth/callback?next=/dashboard/account`).

**F2. Onboarding gate**
- `profiles.onboarded` boolean, default `false`.
- Middleware OR a layout-level check: if logged in and `!onboarded` and route is not `/onboarding` or `/api/*`, redirect to `/onboarding`.
- Onboarding page marks `onboarded = true` after step 3 (or on skip).

**F3. File upload**
- Client-side only upload in this build (no real S3). File stays in component state, the filename + size + a base64 thumbnail (or just metadata) saved in `orders.file_meta` JSONB column. Honest copy: "Files are stored for 30 days for fulfillment purposes." (No fake claim of AI repair yet — that ships later. The field is reserved as `file_meta` so the schema is ready.)
- Validates extension (`.stl`, `.obj`), size (≤50MB), shows error inline.
- Drop zone with drag-over highlight (sky border, sand bg tint).

**F4. Material selection**
- Materials are a static client array (later can move to DB):
  - `fdm_pla`: base $15, per-MB $0.50, lead 3-5 days
  - `sla_resin`: base $40, per-MB $1.20, lead 4-6 days
  - `sls_nylon`: base $50, per-MB $1.80, lead 5-8 days
- Honest footnote: "Lead times are estimates. Final lead time confirmed after file review."

**F5. Instant quote (mock)**
- Pure function `computeQuote({ material, fileSizeMB })` returns `{ total, leadDaysMin, leadDaysMax }`.
- Re-computes reactively on material change.
- Rounded to 2 decimals with currency formatting.

**F6. Order submission**
- POST `/api/orders` with `{ material, file_meta: { name, size_bytes, ext } }`.
- Server validates session, validates body with zod, inserts row, returns `{ id, order_number }`.
- Order number format: `GO-` + 6-digit zero-padded sequential id (e.g. `GO-000042`).

**F7. Orders list + detail**
- Server component reads from Supabase with `eq('user_id', user.id)`, ordered `created_at desc`.
- Detail page: `eq('id', params.id)` + `eq('user_id', user.id)` (RLS enforces this too).
- Status transition: only `submitted → in_review → printing → shipped` allowed (validated server-side). `cancelled` allowed only from `submitted`.

**F8. Account editing**
- `updateUser({ password })` for password.
- `updateUser({ data: { full_name } })` for name, mirrored to `profiles.full_name` via upsert.

**F9. Admin signup analytics**
- Role check: if `profiles.role === 'admin'`, render page.
- Total count: `select count(*)`.
- Recent list: `select email, created_at, last_sign_in_at from profiles order by created_at desc limit 50`.

**F10. Analytics (PostHog or simple)**
- PostHog preferred if `NEXT_PUBLIC_POSTHOG_KEY` is set; otherwise a no-op `track()` helper that `console.debug`s in dev.
- Track: `signup_completed`, `login_completed`, `order_submitted`, `onboarding_step_completed` with `step` property.
- Loaded via `posthog-js` in a client provider, initialized after consent banner (simple "We use anonymous analytics" footer banner with Accept/Dismiss; choice stored in localStorage).

**F11. Protected route middleware**
- `middleware.ts` uses `@supabase/ssr` `updateSession`, redirects unauthenticated `/dashboard/*` to `/login?next=...`, and redirects onboarded users away from `/onboarding` to `/dashboard`.

## 7. DATA MODEL

**`profiles`** (1:1 with `auth.users`, created by trigger)
- `id uuid PK` references `auth.users(id)`
- `email text`
- `full_name text`
- `role text` — `'user' | 'admin'`, default `'user'`
- `onboarded boolean` default `false`
- `created_at timestamptz` default `now()`
- `last_sign_in_at timestamptz` (synced from auth metadata optionally, otherwise set on first dashboard load)

**`orders`**
- `id uuid PK default gen_random_uuid()`
- `order_number text UNIQUE` — `GO-` + zero-padded id-derived
- `user_id uuid` references `profiles(id)`
- `material text` — `'fdm_pla' | 'sla_resin' | 'sls_nylon'`
- `file_meta jsonb` — `{ name, size_bytes, ext }`
- `quote_cents integer`
- `lead_days_min integer`
- `lead_days_max integer`
- `status text` default `'submitted'`
- `created_at timestamptz` default `now()`
- `updated_at timestamptz` default `now()`

**`material_prices`** (optional, can stay client-side for v1; define table for future)
- `key text PK`
- `name text`
- `description text`
- `base_cents integer`
- `per_mb_cents integer`
- `lead_days_min integer`
- `lead_days_max integer`

**RLS policies (Supabase):**
- `profiles`: user can `select`/`update` own row. Admin can `select all`. (Admin can be enforced by a Postgres function `is_admin()` reading `auth.jwt() ->> 'role'` OR by checking the `profiles` table in a SECURITY DEFINER function to avoid recursion.)
- `orders`: user can `select`/`insert`/`update` own rows (`user_id = auth.uid()`).

**Trigger:** on `auth.users` insert, insert into `profiles` with `id`, `email`, and set `role` to `'admin'` if email matches an env var `ADMIN_EMAIL`.

## 8. AUTH

- **Method:** Email + password via Supabase Auth.
- **Library:** `@supabase/ssr` (Next.js 15 App Router compatible). Three clients: browser, server (route handlers + server components), middleware.
- **No social OAuth.** No Clerk.
- **Email confirmation:** Off by default for dev (`supabase.auth.admin.createUser` not needed; sign up works directly). If turned on, `/auth/callback` route handles the exchange.
- **Password reset:** "Forgot password" link on `/login` triggers `resetPasswordForEmail` with `redirectTo` → `/auth/callback?next=/dashboard/account`. Honest copy: "Check your email."
- **Session:** cookie-based, refreshed in middleware.

## 9. FILES

```
FILES: [
  "middleware.ts",
  "app/layout.tsx",
  "app/globals.css",
  "app/page.tsx",
  "app/login/page.tsx",
  "app/login/actions.ts",
  "app/signup/page.tsx",
  "app/signup/actions.ts",
  "app/auth/callback/route.ts",
  "app/onboarding/page.tsx",
  "app/onboarding/actions.ts",
  "app/dashboard/layout.tsx",
  "app/dashboard/page.tsx",
  "app/dashboard/orders/page.tsx",
  "app/dashboard/orders/new/page.tsx",
  "app/dashboard/orders/new/actions.ts",
  "app/dashboard/orders/[id]/page.tsx",
  "app/dashboard/orders/[id]/actions.ts",
  "app/dashboard/materials/page.tsx",
  "app/dashboard/account/page.tsx",
  "app/dashboard/account/actions.ts",
  "app/dashboard/admin/signups/page.tsx",
  "app/api/orders/route.ts",
  "app/api/orders/[id]/status/route.ts",
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/middleware.ts",
  "lib/supabase/admin.ts",
  "lib/auth.ts",
  "lib/analytics.ts",
  "lib/quote.ts",
  "lib/materials.ts",
  "lib/orders.ts",
  "components/ui/Button.tsx",
  "components/ui/Card.tsx",
  "components/ui/Field.tsx",
  "components/ui/Badge.tsx",
  "components/ui/EmptyState.tsx",
  "components/ui/Stepper.tsx",
  "components/ui/DropZone.tsx",
  "components/TopBar.tsx",
  "components/UserMenu.tsx",
  "components/PostHogProvider.tsx",
  "components/AnalyticsBanner.tsx",
  "supabase/migrations/0001_init.sql",
  "supabase/migrations/0002_triggers.sql",
  "supabase/migrations/0003_rls.sql",
  "supabase/seed.sql",
  "tailwind.config.ts",
  ".env.local.example",
  "package.json"
]
```

## 10. ACCEPTANCE

Done and working means:

- [ ] `npm run build` succeeds with no TS errors.
- [ ] Sign up with email + password creates a Supabase user, triggers a `profiles` row, and lands the user on `/onboarding`.
- [ ] Login with the same credentials returns to `/dashboard`.
- [ ] Visiting `/dashboard` while signed out redirects to `/login?next=/dashboard`.
- [ ] Visiting `/dashboard` for the first time (no `onboarded=true`) redirects to `/onboarding`.
- [ ] Onboarding step 1 accepts a `.stl` or `.obj` file ≤50MB; rejects other types with inline error.
- [ ] Onboarding step 2 shows 3 material options; selection is visually obvious.
- [ ] Onboarding step 3 shows a mock quote calculated from file size + selected material.
- [ ] "Place order" creates a row in `orders` and routes to `/dashboard/orders/[id]` with order number `GO-XXXXXX`.
- [ ] The order appears in the `/dashboard` orders list.
- [ ] Logout from the user menu returns to `/` and clears the session cookie.
- [ ] RLS: a second signed-up user cannot read the first user's orders (verified by manual test or SQL check).
- [ ] Admin user (matched by `ADMIN_EMAIL` env) sees an "Admin" link in the top bar and `/dashboard/admin/signups` shows the total count and a list of recent signups.
- [ ] Non-admin visiting `/dashboard/admin/signups` sees 404.
- [ ] Existing landing page renders unchanged; design system tokens (sky/mint/sand) are reused on all new screens.
- [ ] Every button on every page routes to a real, working destination (no dead buttons).
- [ ] No fake testimonials, no invented customer logos, no fake metric counters in any copy.
- [ ] PostHog (or analytics shim) fires `signup_completed`, `order_subpleted`, `onboarding_step_completed` events.
- [ ] `middleware.ts` refreshes the Supabase session on every request.
- [ ] Empty states are shown (not blank screens) on `/dashboard` orders and `/dashboard/admin/signups` for new accounts.
- [ ] Mobile (375px): all new screens are usable; sticky CTA on `/dashboard/orders/new` is reachable.# Goon — Full App Build Plan

## 1. PRODUCT

Goon extends its on-demand 3D printing landing page into a working web app where hobbyist inventors sign up, upload a 3D model, pick a material, and get a price quote in one sitting — without account minimums, RFQ forms, or sales calls. The product closes the loop from marketing site to first quote: the value is "go from CAD file to a real, priced print order in under three minutes." The pain it solves is the one the research names explicitly: the consumer/hobbyist segment is underserved post-Shapeways, and existing platforms (Xometry, Hubs, Ponoko) gate hobbyists behind B2B UX — minimum orders, sales contact, slow manual quotes. Goon's product removes that friction with a single dashboard flow: upload → select → quote → submit.

## 2. WHO IT'S FOR

The ICP from research is an independent inventor or hobbyist creator, 25–55, technically inclined, with imperfect CAD files who needs fast, affordable prototyping with no minimum order. This shapes every product decision:

- **No jargon-heavy B2B language.** Copy says "Upload your file," not "Submit geometry for manufacturability review."
- **No dashboards-within-dashboards.** Side nav is flat. The post-login landing is the next action: upload.
- **No fake social proof.** No "trusted by 10,000 makers" or invented logos. Honest empty states instead.
- **Mobile-tolerant, not mobile-first** — hobbyists use laptops for CAD work, but upload must work from phone.
- **Tone: calm, direct, slightly playful** — matches the Calm System visual brand. The research says this segment is time-poor; copy is short.

## 3. LOOK & FEEL

The existing Calm System is preserved exactly. New screens extend it without reinventing the visual language.

**Palette (locked, from existing globals.css):**
- Primary sky blue `#6DB5D2` — CTAs, links, focus rings
- Mint `#A5D8C1` — success states, progress, "ready" badges
- Sand `#E8CDA0` — highlights, quote panel background, warm accent
- Soft white `#F5F8FA` — page background
- Ink `#1A2330` — body text
- Mute `#6B7785` — secondary text

**Typography:** Geist Sans for UI/numbers, Lora for the one accent line per screen (used in quote panel and welcome hero). No new fonts.

**Spacing:** 8px base unit. Sections padded `py-16` desktop / `py-10` mobile. Card radius `rounded-2xl` (16px), buttons `rounded-xl` (12px). Generous whitespace — the brand is "calm."

**Iconography:** Lucide-react (already likely present; add if not). Stroke 1.5px, 20px default. Icons: Upload, Box, Layers, Clock, FileCheck, LogOut, Settings, ChevronRight, Check.

**Imagery:** No stock photos, no product shots of prints (we don't have any yet — honest empty state). Use abstract orbit SVG mark (existing) and gradient washes of sky→mint on hero areas. The upload screen uses a dashed-border drop zone, not a product image.

**Motion:** Subtle only. Drop zone border pulses (1.5s) on drag-over. Spinner uses the orbit mark rotating. Page transitions: no animation library — `transition-opacity duration-200` on route content. Respect `prefers-reduced-motion`.

**Components (reusable, built once):**
- `<Button variant="primary|secondary|ghost">` — primary uses sky blue, secondary is white with sky border, ghost is text-only with hover bg.
- `<Card>` — `bg-white rounded-2xl border border-slate-200/60 p-6 shadow-[0_1px_2px_rgba(26,35,48,0.04)]`
- `<Field>` — label + input + helper text, Geist Sans.
- `<Badge>` — mint bg for success, sand bg for "draft," sky bg for "in review."
- `<EmptyState icon title body cta>` — used wherever data is empty.
- `<Stepper steps={[]} current={n} />` — for onboarding.
- `<DropZone onFile accept />` — dashed border, drag-over state, file preview row.

---

### Screens, top to bottom

**`/login` and `/signup` (auth pages)**
Split layout, but on mobile stacks. Left 60% on desktop: centered card on soft-white page. Card max-width 420px, white, rounded-2xl, p-8.
- Logo + wordmark top
- H1 in Geist 28px: "Welcome back" (login) / "Create your Goon account" (signup)
- Lora accent line below: "Print your first part today."
- Fields: Email, Password (signup adds Full name, optional)
- Primary button full width: "Log in" / "Create account"
- Below button, small link: "Don't have an account? Sign up" / "Already have an account? Log in"
- Tiny footnote: "By continuing you agree to our Terms and Privacy." (No link to fake Terms — text only, neutral)
- Right 40% on desktop: subtle sky→mint gradient with large faded orbit SVG. Hidden on mobile.

**`/onboarding` (post-signup, first visit only)**
Full-height page, max-width 720px, centered.
- Top: `<Stepper>` showing 3 steps: "Upload file" / "Choose material" / "Get your quote"
- Step 1 active: title "Let's print something." Lora subline "Three minutes from file to quote."
- Single drop zone (full width, 240px tall) with upload icon and "Drop your .STL or .OBJ here, or click to browse"
- Below: small text "Max 50MB. Files stay private to your account."
- "Continue" button disabled until a file is attached. On click → Step 2.
- Step 2: radio cards for 3 materials (FDM PLA, SLA Resin, SLS Nylon) with sand highlight on selected, small description and "from $X" placeholder.
- "Continue" → Step 3.
- Step 3: quote panel — sand background, Lora headline "Your instant quote," then a line "Quote: $XX.XX" (mocked from file size heuristic), "Lead time: ~3-5 days" (honest placeholder for now). Two buttons: "Place order" (primary, submits and routes to `/dashboard/orders/[id]`) and "Save for later" (secondary, goes to `/dashboard`).
- Top-right of page: "Skip onboarding" link → `/dashboard`.

**`/dashboard` (home for logged-in users)**
Top bar: small Goon mark + wordmark (left), user email + avatar circle (initial) + dropdown (Account, Sign out) on right. Below: subtle 1px border.
Body max-width 1120px, p-8.
- H1: "Welcome back, {firstName}."
- Lora subline: "Ready to print?"
- Two columns on desktop (stacks mobile):
  - **Left col (8/12):** "Your orders" card. If empty: `<EmptyState>` with Box icon, "No orders yet," "Upload a file to get your first quote," CTA button "Start an order" → `/dashboard/orders/new`.
  - If orders exist: table-ish list (cards on mobile) with columns: Order # (e.g. `GO-000123`), File name, Material badge, Status badge, Quote amount, Date. Click row → `/dashboard/orders/[id]`. "New order" button top-right of card.
  - Below orders card: "Quick actions" row — two small cards: "Upload a file" (icon Upload) and "Browse materials" (icon Layers). Both route somewhere real (`/dashboard/orders/new` and `/dashboard/materials`).
- **Right col (4/12):** "Account" card — email, member since date, "Edit profile" link to `/dashboard/account`. Below: "Admin: Signup analytics" card — visible only to the first signed-up user (treated as admin for this build; logic in RLS/role column). Shows total signup count (big number) and a list of 10 most recent signups (email + created_at). No real PII redacted in the DB.

**`/dashboard/orders/new` (the core flow — upload → material → quote → submit)**
Single page, 3 visible sections stacked, but state-driven (no multi-page reload). Stepper at top identical to onboarding but persistent.

- **Section 1: Upload.** Drop zone 200px tall. When file attached, replace with a row: file icon, file name, size, "Remove" ghost link. If re-uploading, replace the row.
- **Section 2: Material.** 3 radio cards in a row (1 col on mobile). Each card: material name, short description (1 line), technology tag (FDM/SLA/SLS), "from $X" base price.
- **Section 3: Quote (sticky on desktop, inline on mobile).** Sand-tinted card. Shows: selected material, computed quote (mock formula: `basePrice + (fileSizeMB * perMBrate)` with sane per-material rates), lead time range. Quote is mock-calculated client-side, clearly labeled in a tiny line: "Instant estimate. Final price confirmed by email."
- Sticky bottom bar on mobile with "Place order" primary button. On desktop, button inside the quote card.
- On submit: create order row in Supabase, route to `/dashboard/orders/[id]` showing confirmation card with order #, summary, "We'll email when it's ready." (Email is mocked; honest placeholder text "Email notifications: coming soon" if Resend not configured.)

**`/dashboard/orders/[id]`**
- Back link "← All orders"
- H1: `Order GO-000123`
- Status badge (top right): "Submitted" (sky) → "In review" (sand) → "Printing" (mint) → "Shipped" (mint, with check). For now, statuses are set by the user clicking "Mark as..." buttons in a small "Update status" card — an honest dev-mode affordance. Real status will come from the fulfillment system later.
- Card: file name, material, quote, ordered at.
- "Cancel order" ghost button (only if status = Submitted).

**`/dashboard/materials`**
Static reference page. 3 expandable cards (FDM / SLA / SLS) with one paragraph each, finishes, tolerances, ideal use. All from research. No fake numbers beyond the per-material base price already shown elsewhere.

**`/dashboard/account`**
- Read-only fields: email (editable → Supabase `updateUser`), display name, member since.
- "Change password" inline form (current + new + confirm) calling Supabase `updateUser`.
- "Sign out" button bottom.

**`/dashboard/admin/signups` (admin only, role-gated)**
- If non-admin hits it: 404.
- Big number: total users.
- Table: email, created_at, last_sign_in_at. Pagination simple (limit 50, "Load more").

## 4. USER FLOWS

**Flow A — Sign up → first order (primary)**
1. Land on `/` (existing marketing page) → click "Get started" CTA in nav → `/signup`.
2. Submit email + password + name → Supabase creates user → server-side `INSERT profiles` row (trigger) → on success, redirect `/onboarding`.
3. Onboarding Step 1: drop file (client validates extension + size). Click Continue.
4. Step 2: select material. Continue.
5. Step 3: see quote. Click "Place order" → POST `/api/orders` → row created → redirect `/dashboard/orders/[id]`.
6. Dashboard `/dashboard` now shows the order in the list.

States: loading on submit (button spinner, disabled), error (inline red text under form), validation (empty file = disabled Continue), already onboarded (redirect from `/onboarding` → `/dashboard`).

**Flow B — Login**
`/login` → submit → Supabase → redirect `/dashboard`. If session is fresh and `profiles.onboarded = false`, redirect `/onboarding` instead.

**Flow C — Returning user with orders**
`/dashboard` → click order row → detail page → click "Mark as printing" → status updates → return to dashboard, badge color updated.

**Flow D — Sign out**
Avatar menu → Sign out → Supabase `signOut()` → redirect `/`.

**Flow E — Admin viewing signups**
Login as the seeded admin user → nav has "Admin" link (only shown when `profiles.role = 'admin'`) → `/dashboard/admin/signups` shows counts + list.

## 5. PAGES / ROUTES

| Route | Purpose | Auth | Layout / key UI |
|---|---|---|---|
| `/` | Existing landing | public | unchanged |
| `/login` | Email/password sign in | public | split layout, card form |
| `/signup` | Email/password register | public | split layout, card form |
| `/onboarding` | 3-step first order | auth, gated by `!onboarded` | stepper, full-width sections |
| `/dashboard` | Account home | auth | top bar, 2-col body, orders + account cards |
| `/dashboard/orders/new` | Upload + material + quote | auth | stepper, stacked sections, sticky CTA mobile |
| `/dashboard/orders/[id]` | Order detail | auth | back link, status badge, summary card |
| `/dashboard/orders` | List view (alias of dashboard orders card) | auth | same as dashboard card component, full-width |
| `/dashboard/materials` | Material reference | auth | 3 expandable cards |
| `/dashboard/account` | Profile + password | auth | form card |
| `/dashboard/admin/signups` | Signup analytics (admin) | auth + role | number card + table |
| `/api/orders` | POST create order | auth | server action or route handler |
| `/api/orders/[id]/status` | PATCH status | auth + owner | route handler |
| `/api/profile/onboarded` | POST mark complete | auth | route handler |
| `/auth/callback` | Supabase email callback (if email confirm on) | public | exchanges code, redirects |

## 6. CORE FEATURES

**F1. Email/password auth (Supabase)**
- Server client via `@supabase/ssr` `createServerClient` reading/writing cookies in App Router.
- Client client for browser interactions.
- Middleware (`middleware.ts`) refreshes session on every request and protects `/dashboard/*` and `/onboarding` (redirect to `/login?next=...` if no session).
- Sign up: `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`. DB trigger inserts `profiles` row with `id = auth.users.id`, `role = 'user'` (or `'admin'` if email matches `ADMIN_EMAIL` env).
- Login: `signInWithPassword`.
- Sign out: `signOut()` from client, then `router.push('/')` + `router.refresh()`.
- Password change on account page.
- No social buttons. No "forgot password" beyond Supabase's `resetPasswordForEmail` (a real working link in the card, sends to `redirectTo: /auth/callback?next=/dashboard/account`).

**F2. Onboarding gate**
- `profiles.onboarded` boolean, default `false`.
- Middleware OR a layout-level check: if logged in and `!onboarded` and route is not `/onboarding` or `/api/*`, redirect to `/onboarding`.
- Onboarding page marks `onboarded = true` after step 3 (or on skip).

**F3. File upload**
- Client-side only upload in this build (no real S3). File stays in component state, the filename + size + a base64 thumbnail (or just metadata) saved in `orders.file_meta` JSONB column. Honest copy: "Files are stored for 30 days for fulfillment purposes." (No fake claim of AI repair yet — that ships later. The field is reserved as `file_meta` so the schema is ready.)
- Validates extension (`.stl`, `.obj`), size (≤50MB), shows error inline.
- Drop zone with drag-over highlight (sky border, sand bg tint).

**F4. Material selection**
- Materials are a static client array (later can move to DB):
  - `fdm_pla`: base $15, per-MB $0.50, lead 3-5 days
  - `sla_resin`: base $40, per-MB $1.20, lead 4-6 days
  - `sls_nylon`: base $50, per-MB $1.80, lead 5-8 days
- Honest footnote: "Lead times are estimates. Final lead time confirmed after file review."

**F5. Instant quote (mock)**
- Pure function `computeQuote({ material, fileSizeMB })` returns `{ total, leadDaysMin, leadDaysMax }`.
- Re-computes reactively on material change.
- Rounded to 2 decimals with currency formatting.

**F6. Order submission**
- POST `/api/orders` with `{ material, file_meta: { name, size_bytes, ext } }`.
- Server validates session, validates body with zod, inserts row, returns `{ id, order_number }`.
- Order number format: `GO-` + 6-digit zero-padded sequential id (e.g. `GO-000042`).

**F7. Orders list + detail**
- Server component reads from Supabase with `eq('user_id', user.id)`, ordered `created_at desc`.
- Detail page: `eq('id', params.id)` + `eq('user_id', user.id)` (RLS enforces this too).
- Status transition: only `submitted → in_review → printing → shipped` allowed (validated server-side). `cancelled` allowed only from `submitted`.

**F8. Account editing**
- `updateUser({ password })` for password.
- `updateUser({ data: { full_name } })` for name, mirrored to `profiles.full_name` via upsert.

**F9. Admin signup analytics**
- Role check: if `profiles.role === 'admin'`, render page.
- Total count: `select count(*)`.
- Recent list: `select email, created_at, last_sign_in_at from profiles order by created_at desc limit 50`.

**F10. Analytics (PostHog or simple)**
- PostHog preferred if `NEXT_PUBLIC_POSTHOG_KEY` is set; otherwise a no-op `track()` helper that `console.debug`s in dev.
- Track: `signup_completed`, `login_completed`, `order_submitted`, `onboarding_step_completed` with `step` property.
- Loaded via `posthog-js` in a client provider, initialized after consent banner (simple "We use anonymous analytics" footer banner with Accept/Dismiss; choice stored in localStorage).

**F11. Protected route middleware**
- `middleware.ts` uses `@supabase/ssr` `updateSession`, redirects unauthenticated `/dashboard/*` to `/login?next=...`, and redirects onboarded users away from `/onboarding` to `/dashboard`.

## 7. DATA MODEL

**`profiles`** (1:1 with `auth.users`, created by trigger)
- `id uuid PK` references `auth.users(id)`
- `email text`
- `full_name text`
- `role text` — `'user' | 'admin'`, default `'user'`
- `onboarded boolean` default `false`
- `created_at timestamptz` default `now()`
- `last_sign_in_at timestamptz` (synced from auth metadata optionally, otherwise set on first dashboard load)

**`orders`**
- `id uuid PK default gen_random_uuid()`
- `order_number text UNIQUE` — `GO-` + zero-padded id-derived
- `user_id uuid` references `profiles(id)`
- `material text` — `'fdm_pla' | 'sla_resin' | 'sls_nylon'`
- `file_meta jsonb` — `{ name, size_bytes, ext }`
- `quote_cents integer`
- `lead_days_min integer`
- `lead_days_max integer`
- `status text` default `'submitted'`
- `created_at timestamptz` default `now()`
- `updated_at timestamptz` default `now()`

**`material_prices`** (optional, can stay client-side for v1; define table for future)
- `key text PK`
- `name text`
- `description text`
- `base_cents integer`
- `per_mb_cents integer`
- `lead_days_min integer`
- `lead_days_max integer`

**RLS policies (Supabase):**
- `profiles`: user can `select`/`update` own row. Admin can `select all`. (Admin can be enforced by a Postgres function `is_admin()` reading `auth.jwt() ->> 'role'` OR by checking the `profiles` table in a SECURITY DEFINER function to avoid recursion.)
- `orders`: user can `select`/`insert`/`update` own rows (`user_id = auth.uid()`).

**Trigger:** on `auth.users` insert, insert into `profiles` with `id`, `email`, and set `role` to `'admin'` if email matches an env var `ADMIN_EMAIL`.

## 8. AUTH

- **Method:** Email + password via Supabase Auth.
- **Library:** `@supabase/ssr` (Next.js 15 App Router compatible). Three clients: browser, server (route handlers + server components), middleware.
- **No social OAuth.** No Clerk.
- **Email confirmation:** Off by default for dev (`supabase.auth.admin.createUser` not needed; sign up works directly). If turned on, `/auth/callback` route handles the exchange.
- **Password reset:** "Forgot password" link on `/login` triggers `resetPasswordForEmail` with `redirectTo` → `/auth/callback?next=/dashboard/account`. Honest copy: "Check your email."
- **Session:** cookie-based, refreshed in middleware.

## 9. FILES

```
FILES: [
  "middleware.ts",
  "app/layout.tsx",
  "app/globals.css",
  "app/page.tsx",
  "app/login/page.tsx",
  "app/login/actions.ts",
  "app/signup/page.tsx",
  "app/signup/actions.ts",
  "app/auth/callback/route.ts",
  "app/onboarding/page.tsx",
  "app/onboarding/actions.ts",
  "app/dashboard/layout.tsx",
  "app/dashboard/page.tsx",
  "app/dashboard/orders/page.tsx",
  "app/dashboard/orders/new/page.tsx",
  "app/dashboard/orders/new/actions.ts",
  "app/dashboard/orders/[id]/page.tsx",
  "app/dashboard/orders/[id]/actions.ts",
  "app/dashboard/materials/page.tsx",
  "app/dashboard/account/page.tsx",
  "app/dashboard/account/actions.ts",
  "app/dashboard/admin/signups/page.tsx",
  "app/api/orders/route.ts",
  "app/api/orders/[id]/status/route.ts",
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/middleware.ts",
  "lib/supabase/admin.ts",
  "lib/auth.ts",
  "lib/analytics.ts",
  "lib/quote.ts",
  "lib/materials.ts",
  "lib/orders.ts",
  "components/ui/Button.tsx",
  "components/ui/Card.tsx",
  "components/ui/Field.tsx",
  "components/ui/Badge.tsx",
  "components/ui/EmptyState.tsx",
  "components/ui/Stepper.tsx",
  "components/ui/DropZone.tsx",
  "components/TopBar.tsx",
  "components/UserMenu.tsx",
  "components/PostHogProvider.tsx",
  "components/AnalyticsBanner.tsx",
  "supabase/migrations/0001_init.sql",
  "supabase/migrations/0002_triggers.sql",
  "supabase/migrations/0003_rls.sql",
  "supabase/seed.sql",
  "tailwind.config.ts",
  ".env.local.example",
  "package.json"
]
```

## 10. ACCEPTANCE

Done and working means:

- [ ] `npm run build` succeeds with no TS errors.
- [ ] Sign up with email + password creates a Supabase user, triggers a `profiles` row, and lands the user on `/onboarding`.
- [ ] Login with the same credentials returns to `/dashboard`.
- [ ] Visiting `/dashboard` while signed out redirects to `/login?next=/dashboard`.
- [ ] Visiting `/dashboard` for the first time (no `onboarded=true`) redirects to `/onboarding`.
- [ ] Onboarding step 1 accepts a `.stl` or `.obj` file ≤50MB; rejects other types with inline error.
- [ ] Onboarding step 2 shows 3 material options; selection is visually obvious.
- [ ] Onboarding step 3 shows a mock quote calculated from file size + selected material.
- [ ] "Place order" creates a row in `orders` and routes to `/dashboard/orders/[id]` with order number `GO-XXXXXX`.
- [ ] The order appears in the `/dashboard` orders list.
- [ ] Logout from the user menu returns to `/` and clears the session cookie.
- [ ] RLS: a second signed-up user cannot read the first user's orders (verified by manual test or SQL check).
- [ ] Admin user (matched by `ADMIN_EMAIL` env) sees an "Admin" link in the top bar and `/dashboard/admin/signups` shows the total count and a list of recent signups.
- [ ] Non-admin visiting `/dashboard/admin/signups` sees 404.
- [ ] Existing landing page renders unchanged; design system tokens (sky/mint/sand) are reused on all new screens.
- [ ] Every button on every page routes to a real, working destination (no dead buttons).
- [ ] No fake testimonials, no invented customer logos, no fake metric counters in any copy.
- [ ] PostHog (or analytics shim) fires `signup_completed`, `order_subpleted`, `onboarding_step_completed` events.
- [ ] `middleware.ts` refreshes the Supabase session on every request.
- [ ] Empty states are shown (not blank screens) on `/dashboard` orders and `/dashboard/admin/signups` for new accounts.
- [ ] Mobile (375px): all new screens are usable; sticky CTA on `/dashboard/orders/new` is reachable.