```markdown
# Goon — Build Plan

## 1. PRODUCT

Goon is an on-demand 3D printing platform with an authenticated member workspace. The public landing page stays untouched as the top-of-funnel surface (hero, features, pricing, FAQ, waitlist email capture). The product extension gives signed-up members a private workspace at `/dashboard` showing their account, an upload tool for STL/OBJ/3MF files (the core action for the hobbyist-inventor ICP who already has CAD files), a signup-analytics counter (lightweight admin-style metric visible to the logged-in user to reinforce "early builder" status without inventing fake social proof), and a profile/settings page for managing display name and password. The pain solved, per the ICP brief, is "I have a CAD file, I want a quote/print job fast, I don't want to be locked into a B2B minimum-order quote engine" — so the upload page treats file drop as the primary, single-purpose action and does not bury it under a multi-step wizard.

## 2. WHO IT'S FOR

Primary ICP: independent inventors and hobbyist creators, ages 25-55, technically inclined, who already produce CAD files (Fusion 360, Blender, TinkerCAD, OnShape). They are time-poor on the business side (don't want to talk to a sales rep, don't want a minimum-order fee) but meticulous about their files. Implications for the product:

- Tone: technical but plain. No marketing fluff inside the app. Status text uses engineer vocabulary (mesh, volume, manifold).
- Information density: higher than the landing page. The dashboard is a working tool, not a sales page.
- Single primary action per screen. No nested nav beyond a left rail with 3 items (Dashboard, Upload, Settings) plus sign out.
- Empty states are friendly but factual ("Upload your first .STL to see print estimates") — not "Get started in seconds!" cheerleading.
- No fabricated logos, testimonials, or user counts. A "members so far" counter shows the real signup count from the database.

## 3. LOOK & FEEL

The app inherits the Calm System already established on the landing page.

**Visual system (carried into the app):**
- Palette: sky blue `#6DB5D2` (primary actions, links), mint `#A5D8C1` (success states, "ready" chips), sand `#E8CDA0` (warning/pending states), soft white `#F5F8FA` (app canvas), graphite `#1E2A32` (text), muted `#6B7B85` (secondary text). Backgrounds use `bg-[#F5F8FA]` for app shell, `bg-white` for cards, `border-[#E2EAEF]` for hairlines.
- Typography: Geist Sans for UI/body, Geist Mono for filenames, hashes, file size, status codes. Lora italic is reserved for marketing-flavored landing copy only — inside the app everything is Geist.
- Spacing: 8px base. Cards `rounded-2xl`, `p-6`, `shadow-[0_1px_2px_rgba(30,42,50,0.04)]`. Dense areas (file lists) use `p-3` and 12px row gaps.
- Iconography: lucide-react, 1.5px stroke. No emoji icons inside the app. Orbit motif is reserved for the landing page only.
- Motion: 150ms ease-out for hover, 200ms for state transitions. File drop zone has a single subtle pulse on hover (sky-200 ring, no scale jitter). No parallax, no scroll-triggered animation inside the app.
- Imagery: none inside the app. The app is tool-like; hero imagery stays on the landing page.

**Layout shell (used on every authenticated route):**
- Fixed left sidebar `w-60`, `bg-white`, `border-r border-[#E2EAEF]`. Contains: logo wordmark "goon" in Geist 600, three nav items (Dashboard / Upload / Settings) with lucide icons, and a user card at the bottom showing avatar initial in a sky-blue circle + email (truncated) + sign-out button.
- Top bar `h-14`, `bg-white/80 backdrop-blur`, shows page title (Geist 600, 18px), and on the right a small "members" pill (sky-tinted, shows total signup count from `signup_events`).
- Main content area `max-w-5xl mx-auto p-8`.

**Screen-by-screen layout:**

`/dashboard` (default after login)
- Top: greeting row — "Welcome back, {firstName or 'builder'}." (Geist 600, 24px) + muted "{email}" underneath.
- Stat row: three cards in a grid.
  - Card 1 "Your uploads" — count of files this user has uploaded, large number, sub-label "files in your library".
  - Card 2 "Total members" — count of all signup events, sub-label "builders signed up". This is the real, honest counter, not a vanity number.
  - Card 3 "Account" — "Free tier" chip in sand, sub-label "AI file repair included".
- Quick action card: full-width, sky-50 background, contains a single primary button "Upload a model →" that links to `/upload`. Right side: muted text "STL, OBJ, or 3MF up to 50 MB".
- Recent uploads list: last 5 uploads for this user, or an empty state ("No uploads yet — drop a .STL on the Upload page to get started.") Each row: filename (mono), size (mono, muted), upload date, status chip (ready=mint, failed=sand).
- Footer note: "Need help? Email hello@goon.abc..." (placeholder address, no fake support chat).

`/upload`
- Centered single-column card, `max-w-2xl`.
- Header: "Upload a model" (Geist 600, 24px), sub: "We'll check the mesh and queue it for AI repair." (muted).
- Drop zone: large `h-64` rounded-2xl area with dashed `border-2 border-dashed border-[#6DB5D2]/50`, `bg-[#F5F8FA]`. Centered icon (Upload from lucide, sky blue), primary text "Drop your file here", secondary text "or click to browse — .STL, .OBJ, .3MF, max 50 MB". On drag-over: ring becomes solid sky-500, background tints sky-50.
- Below the drop zone (after a file is selected): file summary row — filename (mono), size (mono), a small "remove" text button on the right. Then a single primary button "Upload" (sky blue filled). After click: button shows spinner, then transitions to a status block showing:
  - "Uploaded ✓" with mint chip
  - Detected format
  - Triangle count (computed client-side for STL; for OBJ/3MF shown as "—")
  - Mesh health: "Manifold" (mint) or "Needs repair" (sand). Manifold check is a lightweight client-side test (count edges with exactly 2 adjacent faces for binary STL; for OBJ/3MF show "Manifold: pending server check").
- After success: a "Upload another" text link appears, plus the file appears on the dashboard list.

`/settings`
- Two stacked cards inside `max-w-2xl`.
- Card 1 "Profile": form with fields `Display name` (text, optional, defaults to email local part), `Email` (read-only, muted). Save button is sky-blue, disabled until changed. Save shows "Saved" mint toast.
- Card 2 "Password": fields `Current password`, `New password` (min 8 chars, live hint), `Confirm new password`. Inline validation: "Passwords match" mint when valid. Submit calls Supabase `updateUser({ password })`. Success toast "Password updated".
- Card 3 "Sign out": secondary danger button (graphite text on sand-tinted bg) "Sign out of Goon". Confirms via inline expansion (no modal).

`/login` and `/signup` (auth pages, unauthenticated only)
- Same `min-h-screen bg-[#F5F8FA]` canvas as the landing page.
- Centered card `max-w-md`, white, `rounded-2xl`, `p-8`, with the wordmark on top.
- Sign up form: `Email`, `Password` (with strength hint), `Confirm password`. Primary button "Create account" (sky-blue, full width). Below: "Already have an account? Log in" link.
- Log in form: `Email`, `Password`. Primary button "Log in". Below: "New here? Create an account" link.
- On submit: button shows spinner; on error, an inline `bg-[#E8CDA0]/30` error block with one sentence ("That email and password didn't match.").
- After successful signup: a row appears below the form: "Check your inbox to confirm your email" with a sand chip "Email not confirmed" that flips to mint once the user clicks the confirmation link and returns. The user is NOT redirected to dashboard until email is confirmed (Supabase default behavior preserved).
- The auth pages also show a tiny text link at the bottom: "← Back to goon.xyz" that returns to `/` (landing page).

## 4. USER FLOWS

**Flow A — New user from landing page**
1. Visitor on `/` scrolls to the existing waitlist form (already present), enters email, submits. Row is inserted into `waitlist_emails` with `created_at`, `source='landing'`.
2. Visitor clicks "Get started" / "Sign up" in the landing nav, routed to `/signup`.
3. Enters email + password, submits. Supabase `signUp` is called. A row is inserted into `signup_events` with `user_id`, `email`, `created_at`, `source='signup_form'`.
4. Supabase sends confirmation email. Page shows the "check your inbox" state.
5. User clicks confirmation link → returns to `/login?confirmed=1`. Log in form shows a brief mint toast "Email confirmed — welcome.".
6. User logs in. Server action reads session, redirects to `/dashboard`.
7. Dashboard greets them, shows 0 uploads, real total-members count (which now includes them).

**Flow B — Returning user**
1. Visits `/dashboard`. Middleware checks session; if absent, redirects to `/login?next=/dashboard`.
2. Logs in with email + password. Supabase `signInWithPassword`. Server action redirects to `next` or `/dashboard`.
3. Dashboard renders. Recent uploads list shows their real history.

**Flow C — Upload**
1. On `/upload`, user drags a `.stl` into the drop zone.
2. Client validates: extension ∈ {stl, obj, 3mf}, size ≤ 50 MB. Invalid → inline error in sand block ("Only .STL, .OBJ, .3MF up to 50 MB.").
3. Client computes triangle count and a simple manifold check (binary STL: every edge must appear in exactly 2 triangles). Updates the summary row.
4. User clicks "Upload". File is `POST`ed to `/api/uploads` as `multipart/form-data`. Server validates again, reads auth session, uploads to Supabase Storage bucket `user-models` under path `${user_id}/${uuid}.${ext}`, inserts row into `uploads` (id, user_id, filename, size_bytes, format, triangle_count, manifold, storage_path, status, created_at).
5. UI updates to success state with mint chip. User is offered "Upload another" or "Back to dashboard".

**Flow D — Sign out**
1. User clicks "Sign out" in the sidebar (or `/settings`).
2. `signOut()` from `@supabase/ssr` is called. Cookie cleared. Redirect to `/`.

**Edge states:**
- Unauthenticated visit to `/dashboard`, `/upload`, `/settings` → redirect to `/login?next=…`.
- Authenticated visit to `/login` or `/signup` → redirect to `/dashboard`.
- Network error on upload → error block "Upload failed — try again." (sand). No retry button auto-shown; user re-selects file.
- Email already in use on signup → error "An account with that email already exists. Log in instead."
- Password too short → client-side hint "Use at least 8 characters." (sand), submit disabled.

## 5. PAGES / ROUTES

| Route | Purpose | Auth | Layout / UI |
|---|---|---|---|
| `/` | Existing landing page (untouched) | public | Hero, Features, CTA, FAQ, Pricing, Footer |
| `/signup` | Create account | public only | Centered auth card, email/password/confirm fields |
| `/login` | Log in | public only | Centered auth card, email/password |
| `/dashboard` | Member home | protected | App shell + greeting + stat row + quick action + recent uploads |
| `/upload` | Upload a model file | protected | App shell + drop zone + file summary + upload button |
| `/settings` | Profile, password, sign out | protected | App shell + profile card + password card + sign-out card |
| `/auth/confirm` | Supabase email confirmation handler | public | Server route that exchanges the code, then redirects to `/login?confirmed=1` |
| `/auth/callback` | Generic Supabase OAuth/code exchange (unused for email/password but kept for safety) | public | Server route that calls `exchangeCodeForSession`, redirects to `/dashboard` |
| `/api/uploads` | POST: receive multipart file, store, insert row | protected | Returns JSON `{ ok, upload }` or error |
| `/api/waitlist` | POST: landing-page waitlist email | public | Returns JSON `{ ok }` or validation error |
| `/api/analytics/signup-count` | GET: total signup_events count | protected | Returns `{ count }` |

## 6. CORE FEATURES

**F1 — Supabase Auth (email + password), `@supabase/ssr`**
- Two helper modules: `lib/supabase/server.ts` (creates a server client bound to Next 15 cookies via `cookies()` from `next/headers`) and `lib/supabase/client.ts` (browser client).
- `middleware.ts` uses `@supabase/ssr` `updateSession` to refresh the auth cookie on every request and gates `/dashboard`, `/upload`, `/settings`. Routes that require auth check `user` from the Supabase client; missing user → `NextResponse.redirect('/login?next=…')`.
- Server actions for `signUp`, `signInWithPassword`, `signOut`, `updateProfile`, `updatePassword` live in `lib/actions/auth.ts`. Each returns `{ ok, error }` so the form can render errors inline.
- Confirmation flow uses `/auth/confirm/route.ts` that accepts `?code=…`, calls `supabase.auth.exchangeCodeForSession(code)`, then redirects to `/login?confirmed=1`.

**F2 — Protected dashboard**
- Server component fetches `uploads` count for current user, total `signup_events` count, and last 5 uploads.
- Renders the three stat cards, quick action, and recent uploads list described in §3.
- The signup counter reads from `signup_events` (see F4) and is rendered server-side — no client polling.

**F3 — File upload (STL/OBJ/3MF)**
- Drop zone is a client component using react-dropzone for accessibility (keyboard support: Enter/Space opens file picker).
- Validation: extension whitelist `{stl, obj, 3mf}`, MIME sniff where possible, size ≤ 50 MB. All errors render inline in a sand block.
- Triangle count for binary STL: read buffer, validate it's a binary STL (80-byte header + uint32 triangle count + 50 bytes/triangle), parse `Uint32Array` at offset 80, return count. For ASCII STL: scan for "facet normal" occurrences. For OBJ/3MF: show "—".
- Manifold check (binary STL only): iterate triangles, for each of the 3 edges compute a hash (sorted pair of quantized vertex coords), count occurrences. If any edge appears once → non-manifold. Edge case: bbox quantization tolerance 1e-5 to absorb float jitter.
- After success: `POST /api/uploads` with the file. Server re-validates, uses the authenticated `user.id`, uploads to Supabase Storage bucket `user-models`, inserts a row into `uploads`. Returns the new row.
- Storage bucket policy: `user-models` is private. RLS policy `select/insert` only where `auth.uid() = (storage.foldername(name))[1]`. Downloads are by signed URL (out of scope for v1; not surfaced in UI).

**F4 — Signup analytics tracking**
- Table `signup_events` (see Data Model). Insert happens inside the `signUp` server action, AFTER Supabase confirms user creation. Insert is best-effort: failure to insert does not block signup, but logs to console.
- A SQL view or RPC `get_signup_count()` returns `count(*)`. Dashboard server component calls it.
- Future hooks (documented in code comment, not built): page-view events via `lib/analytics.ts` no-op stub.

**F5 — Profile / settings**
- `display_name` is stored on `profiles` (separate from `auth.users` to keep writes simple). RLS: user can `select/update` only their own row.
- Password change calls `supabase.auth.updateUser({ password })`. Requires the current session (Supabase re-auth challenge is out of scope; document the limitation in a comment).
- Sign out clears cookies via the server action and redirects to `/`.

**F6 — Landing-page waitlist (existing form, wired to Supabase)**
- Existing landing-page form gets a client handler that `POST`s JSON `{ email }` to `/api/waitlist`.
- Server validates (RFC-5322-lite regex, length ≤ 254), inserts into `waitlist_emails`. Idempotent: on unique-conflict, return `{ ok: true }` anyway to avoid leaking which emails are on the list.
- No email is sent back to the user from the waitlist in v1; the response is silent.

## 7. DATA MODEL

**Table `profiles`** (one row per user, created on first login via trigger or on-demand upsert)
- `user_id uuid PK references auth.users(id) on delete cascade`
- `display_name text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- RLS: `select`/`update` where `auth.uid() = user_id`.

**Table `signup_events`**
- `id bigserial PK`
- `user_id uuid references auth.users(id) on delete set null`
- `email text not null`
- `source text not null` — one of `'signup_form'`, `'admin_seed'`
- `created_at timestamptz default now()`
- RLS: `select` for authenticated users (so dashboard can show count); `insert` only via service role or via a SECURITY DEFINER function called from the signup server action. Simpler: allow `insert` for `authenticated` role only when `auth.uid() = user_id`; service-role key is used server-side anyway. Decision: insert from server using service-role client, RLS off for that client.

**Table `uploads`**
- `id uuid PK default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `filename text not null`
- `size_bytes bigint not null`
- `format text not null check (format in ('stl','obj','3mf'))`
- `triangle_count integer`
- `manifold boolean`
- `storage_path text not null`
- `status text not null default 'uploaded' check (status in ('uploaded','processing','ready','failed'))`
- `created_at timestamptz default now()`
- Index on `(user_id, created_at desc)`.
- RLS: `select`/`insert` where `auth.uid() = user_id`. No `update`/`delete` for users.

**Table `waitlist_emails`**
- `id bigserial PK`
- `email text not null unique`
- `source text default 'landing'`
- `created_at timestamptz default now()`
- RLS: `insert` for `anon` and `authenticated`; `select` only for `service_role`. This keeps emails private from other users while letting the public form write.

**Supabase Storage bucket `user-models`**
- Private. Path convention: `{user_id}/{uuid}.{ext}`. Policies per F3.

## 8. AUTH

Email + password via Supabase Auth, using `@supabase/ssr` for Next.js 15 App Router cookie handling. **No Clerk. No social OAuth buttons.**

- Server client in `lib/supabase/server.ts` reads/writes cookies via `next/headers`.
- Browser client in `lib/supabase/client.ts` for client components.
- Middleware refreshes the session on every request via `updateSession`.
- Sign-up uses `supabase.auth.signUp({ email, password, options: { emailRedirectTo: '.../auth/confirm' } })`.
- Log-in uses `supabase.auth.signInWithPassword({ email, password })`.
- Confirmation handled at `/auth/confirm/route.ts`.
- Sign-out uses `supabase.auth.signOut()` then `redirect('/')`.
- Email + password is the ONLY sign-in method. No Google, GitHub, Apple, or "Continue with X" buttons — those would be dead without OAuth credentials.

## 9. FILE TREE (delta vs. existing landing page)

(Full file tree below in the FILES list — see end.)

## 10. ACCEPTANCE

- [ ] `npm run build` succeeds with zero TypeScript errors and zero ESLint errors.
- [ ] `npm run dev` serves `/` (landing) unchanged visually and functionally.
- [ ] Existing landing-page waitlist form submits to `/api/waitlist`; a row appears in `waitlist_emails` in Supabase.
- [ ] `/signup` creates a Supabase auth user; a row appears in `signup_events` with matching `user_id` and `email`.
- [ ] Email confirmation link from Supabase redirects through `/auth/confirm` and lands on `/login?confirmed=1` with the toast.
- [ ] `/login` with valid credentials redirects to `/dashboard`.
- [ ] `/dashboard`, `/upload`, `/settings` all redirect to `/login?next=…` when unauthenticated.
- [ ] `/login` and `/signup` redirect to `/dashboard` when already authenticated.
- [ ] `/dashboard` shows real numbers from the DB (this user's upload count, total signup count). No hardcoded fake numbers anywhere.
- [ ] `/upload` accepts a valid `.stl` ≤ 50 MB, uploads to Supabase Storage under `${user_id}/`, and inserts a row into `uploads`.
- [ ] `/upload` rejects `.txt`, `.zip`, files > 50 MB, with an inline sand error.
- [ ] Triangle count is computed client-side for binary STL and shown in the success state.
- [ ] `/settings` updates `profiles.display_name` and shows a mint "Saved" toast.
- [ ] `/settings` updates the password via `supabase.auth.updateUser` and confirms success.
- [ ] Sign out clears the session cookie and redirects to `/`.
- [ ] No use of `dynamic = 'error'`. Where dynamic rendering is required (auth reads in server components), use `export const dynamic = 'force-dynamic'` only if needed; prefer relying on cookies to opt into dynamic rendering.
- [ ] No Clerk anywhere in the codebase. No dead Google/GitHub sign-in buttons.
- [ ] No invented testimonials, logos, user counts, ratings, or press mentions anywhere in the app or on the landing page.
- [ ] Visual style (colors, fonts, spacing, components) matches the existing landing-page theme: sky `#6DB5D2`, mint `#A5D8C1`, sand `#E8CDA0`, soft white `#F5F8FA`, Geist + Lora, calm/quiet tone.

FILES: ["app/signup/page.tsx", "app/login/page.tsx", "app/dashboard/page.tsx", "app/dashboard/DashboardClient.tsx", "app/upload/page.tsx", "app/upload/UploadClient.tsx", "app/settings/page.tsx", "app/settings/SettingsClient.tsx", "app/auth/confirm/route.ts", "app/auth/callback/route.ts", "app/api/uploads/route.ts", "app/api/waitlist/route.ts", "app/api/analytics/signup-count/route.ts", "middleware.ts", "lib/supabase/client.ts", "lib/supabase/server.ts", "lib/supabase/service.ts", "lib/actions/auth.ts", "lib/actions/uploads.ts", "lib/actions/profile.ts", "lib/analytics.ts", "lib/stl.ts", "lib/validation.ts", "components/app/AppShell.tsx", "components/app/Sidebar.tsx", "components/app/TopBar.tsx", "components/app/StatCard.tsx", "components/app/DropZone.tsx", "components/app/Toast.tsx", "components/landing/WaitlistForm.tsx", "supabase/migrations/0001_init.sql", "tailwind.config.ts", "app/globals.css", ".env.local.example", "README.md"]
```