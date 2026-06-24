# Goon — On-Demand 3D Printing Platform

Goon is an authenticated web app for hobbyist inventors and independent creators to upload CAD/STL files, get AI-assisted repair, request prints in chosen materials, and track orders from queue through shipment.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth:** NextAuth v4 with Credentials provider (email + password)
- **Database:** Prisma + SQLite (local dev) / Supabase (production)
- **Styling:** Tailwind CSS with Calm System design tokens
- **Analytics:** PostHog (client + server-side)
- **Icons:** Lucide React
- **Fonts:** Geist (sans) + Lora (serif accent)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push schema to database
npx prisma db push

# Seed demo accounts
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

## Demo Accounts

| Email | Password | Role |
|---|---|---|
| demo@goon.app | demo123 | user (onboarded, 3 orders) |
| admin@goon.app | admin123 | admin (onboarded) |
| user2@example.com | user2pass | user (not onboarded) |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | Yes | Random string for JWT signing |
| `NEXTAUTH_URL` | Yes | Base URL (e.g., `http://localhost:3000`) |
| `DATABASE_URL` | Yes | Prisma database URL (e.g., `file:./prisma/dev.db`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog host (default: `https://app.posthog.com`) |
| `POSTHOG_PROJECT_API_KEY` | No | PostHog server-side API key |

## Supabase Migration

When deploying to Supabase, run these SQL files against your database:

1. `supabase/migrations/0001_init.sql` — Creates all tables
2. `supabase/migrations/0002_rls.sql` — Enables Row Level Security with policies

## Project Structure

```
app/
  (auth)/login, signup    — Auth pages (centered card layout)
  dashboard/              — Authenticated home (greeting, active orders, quick upload)
  orders/new              — Order creation flow
  orders/[id]             — Order detail with timeline
  orders/                 — Full order history
  account/                — Account settings (change password, delete)
  onboarding/             — 3-step first-run wizard
  api/                    — API routes (auth, orders, account, analytics)
components/               — Reusable UI (Orbit, Timeline, StatusChip, etc.)
lib/                      — Utilities (auth, pricing, posthog, validation, AI repair)
prisma/                   — Database schema and seed data
supabase/migrations/      — SQL migrations for production Supabase
```

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm start` — Start production server
- `npx prisma db push` — Push schema to database
- `npx prisma studio` — Open Prisma Studio
- `npx tsx prisma/seed.ts` — Seed demo data
