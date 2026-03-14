# RCF Connect — Platform Instructions

**The River Christian Fellowship** website and member portal.
Built with Next.js 14, Tailwind CSS, TypeScript, and MongoDB.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see Environment section below)
# Make sure .env.local has MONGODB_URI set

# 3. Seed the database (first time only, or to reset data)
MONGODB_URI="your-connection-string" npx tsx scripts/seed-mongodb.ts

# 4. Run the dev server
npm run dev
```

The site will be available at `http://localhost:3000` (or 3001 if 3000 is in use).

---

## Environment Variables

Create a `.env.local` file in the project root with:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string (lpai database) |
| `JWT_SECRET` | Yes | Secret key for signing JWT access/refresh tokens |
| `GHL_LOCATION_ID` | Yes | GoHighLevel location ID for CRM integration |
| `NEXT_PUBLIC_GHL_LOCATION_ID` | Yes | Same as above, exposed to client |
| `GHL_PIT` | Yes | GoHighLevel API token for contact creation |

---

## Site Structure

### Public Pages (no login required)

| Route | Purpose |
|-------|---------|
| `/` | Landing page — 6 pathway cards for visitors |
| `/connect/new` | New visitor form (interests + contact info) |
| `/connect/involved` | Get involved form (ministry interests) |
| `/connect/families` | Families & kids form (children's ministry) |
| `/connect/events` | Events listing (summer, upcoming, weekly) |
| `/connect/give` | Giving options (DonorPerfect, Venmo, Text) |
| `/connect/agape` | Agape Meals info + signup |
| `/connect/invite` | Share/invite friends page |
| `/connect/success` | Confirmation after form submission |

### Login & Auth

| Route | Purpose |
|-------|---------|
| `/login` | Staff and member login — enter email to receive magic link |
| `/auth/verify?token=xxx` | Member magic link verification landing |
| `/admin/auth/verify?token=xxx` | Staff magic link verification landing |

### Member Portal (requires login)

| Route | Purpose |
|-------|---------|
| `/member` | Member home — welcome message, latest sermon, stats, events |
| `/member/sermon` | Sermon library — full sermons with AI summaries, discussion questions, daily devotionals, kids version |
| `/member/events` | Events calendar for members |
| `/member/give` | Giving history + giving options |
| `/member/prayer` | Submit prayer requests |
| `/member/profile` | Member profile — family, groups, notification settings |

### Admin Dashboard (requires staff login)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard — stats overview, recent visitors, quick actions |
| `/admin/visitors` | Visitor management — view/filter all visitor submissions |
| `/admin/bulletin` | Weekly bulletin editor |
| `/admin/agape` | Agape Meals tracking (headcount, donations) |
| `/admin/ai` | AI sermon tools (summary generation, devotionals) |
| `/admin/social` | Social media engagement stats |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Creates contact in GoHighLevel CRM |
| `/api/auth/staff/request-link` | POST | Generate staff magic link token |
| `/api/auth/staff/verify` | POST | Verify staff token, return JWT pair |
| `/api/auth/staff/refresh` | POST | Refresh staff access token |
| `/api/auth/member/request-link` | POST | Generate member magic link token |
| `/api/auth/member/verify` | POST | Verify member token, return JWT pair |
| `/api/auth/member/refresh` | POST | Refresh member access token |
| `/api/rcf/[...path]` | * | Proxy to NestJS backend (future use) |

### Admin CRUD API Routes (staff JWT required)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/visitors` | GET | List all visitors |
| `/api/admin/visitors/[id]/status` | PUT | Update visitor follow-up status |
| `/api/admin/visitors/[id]/notes` | POST | Add note to a visitor record |
| `/api/admin/sermons` | GET | List all sermons (including unpublished) |
| `/api/admin/sermons` | POST | Create a new sermon |
| `/api/admin/sermons/[id]` | PUT | Update sermon (edit, publish) |
| `/api/admin/sermons/[id]` | DELETE | Delete a sermon |
| `/api/admin/events` | GET | Get all events |
| `/api/admin/events` | PUT | Update events (summer, upcoming, weekly) |
| `/api/admin/settings` | GET | Get all settings as key-value map |
| `/api/admin/settings` | PUT | Update settings (upsert by key) |
| `/api/admin/bulletins` | GET | List all bulletins |
| `/api/admin/bulletins` | POST | Create a new bulletin |
| `/api/admin/bulletins/[id]` | PUT | Update a bulletin |
| `/api/admin/bulletins/[id]` | DELETE | Delete a bulletin |
| `/api/admin/agape/checkins` | GET | List recent agape meal check-ins |
| `/api/admin/agape/checkins` | POST | Log a family check-in (updates mealsServed stat) |
| `/api/admin/prayer-requests` | GET | List all prayer requests |
| `/api/admin/prayer-requests/[id]` | PUT | Update prayer request status |
| `/api/admin/stats` | GET | Get dashboard stats |
| `/api/admin/stats` | PUT | Update dashboard stats |

---

## User Accounts

### Staff Accounts (Super-Admins)

| Name | Email | Role |
|------|-------|------|
| Tim Aulger | taulger@gmail.com | super-admin |
| Sinuhe Montoya | sinuhe@leadprospecting.ai | super-admin |

### Demo Member Account

| Name | Email | Role |
|------|-------|------|
| Sarah Mitchell | sarah.m@example.com | member |

---

## How Data Works

All page data flows through `lib/data.ts`. This file contains 11 async functions that query MongoDB, with hardcoded fallback data if the database is unavailable:

| Function | Collection | Returns |
|----------|-----------|---------|
| `getChurch()` | rcfSettings | Church name, address, phone, social links, verse |
| `getEvents()` | rcfEvents | Summer, upcoming, and weekly events |
| `getInterestTags()` | rcfSettings | Interest tag options for visitor forms |
| `getGiveFunds()` | rcfGivingFunds | Available giving fund options |
| `getGiveMethods()` | rcfGivingMethods | Giving method options |
| `getGivingHistory()` | rcfGiving | Member giving records |
| `getMember()` | rcfMembers | Member profile data |
| `getSermons()` | rcfSermons | Published sermons with full content |
| `getVisitors()` | rcfCheckins | Visitor check-in records |
| `getStats()` | rcfSettings | Dashboard statistics |
| `getUsers()` | rcfStaff | Staff user accounts |

### Architecture Pattern

Every page follows this pattern:

1. **`page.tsx`** — Thin async Server Component. Calls data functions and passes results as props.
2. **`*Client.tsx`** — Client Component with `"use client"`. Receives all data as props. Contains all UI and interactivity.

This separation means:
- Data fetching happens on the server (fast, secure, no client-side API keys)
- UI components are reusable and testable with any data source
- Switching data sources (constants → MongoDB → API) only changes `lib/data.ts`

---

## MongoDB Collections

All collections live in the `lpai` database with the `rcf` prefix:

| Collection | Records | Purpose |
|------------|---------|---------|
| `rcfStaff` | 2 | Staff accounts (Tim, Sinuhe) |
| `rcfMembers` | 1 | Congregation member profiles |
| `rcfSermons` | 3 | Sermon content + AI-generated summaries |
| `rcfEvents` | 1 | Events document (summer, upcoming, weekly) |
| `rcfGivingFunds` | 4 | Fund options (General, Agape, Pantry, Missions) |
| `rcfGivingMethods` | 4 | Payment methods (DonorPerfect, Venmo, Text, Cash) |
| `rcfGiving` | 6 | Individual giving records |
| `rcfCheckins` | 6 | Visitor check-in records from forms/QR |
| `rcfSettings` | 18 | Key-value store (church info, stats, interest tags) |
| `rcfBulletins` | — | Weekly bulletin data (empty, ready) |
| `rcfPrayerRequests` | — | Member prayer submissions (empty, ready) |
| `rcfAgapeCheckins` | — | Agape meal headcount tracking (empty, ready) |
| `rcfSchedule` | — | Recurring weekly schedule (empty, ready) |

### Re-seeding the Database

To reset all collections to their default state:

```bash
MONGODB_URI="your-connection-string" npx tsx scripts/seed-mongodb.ts
```

This will clear and repopulate all `rcf*` collections with the seed data from the script.

---

## NestJS Backend (API)

The NestJS RCF module lives at:
```
lpai-freshmonorepo/services/api-nestjs/src/rcf/
```

| File | Purpose |
|------|---------|
| `rcf.module.ts` | Module registration |
| `rcf.controller.ts` | All REST endpoints under `/api/rcf/` |
| `rcf.service.ts` | Public data queries |
| `rcf-auth.service.ts` | Member magic link auth (Phase 3 — scaffolded) |
| `rcf-admin.service.ts` | Staff auth + CMS CRUD operations |

### API Endpoints (when deployed)

**Public (no auth):**
- `GET /api/rcf/settings` — Church info
- `GET /api/rcf/sermons` — Published sermons (paginated)
- `GET /api/rcf/sermons/:id` — Single sermon
- `GET /api/rcf/events` — All events
- `GET /api/rcf/schedule` — Weekly schedule
- `GET /api/rcf/giving/funds` — Giving fund options
- `GET /api/rcf/giving/methods` — Payment methods
- `GET /api/rcf/interest-tags` — Interest tag options

**Member Auth (Phase 3):**
- `POST /api/rcf/auth/request-link` — Request magic link
- `POST /api/rcf/auth/verify` — Verify token, get JWT
- `POST /api/rcf/auth/refresh` — Refresh access token
- `GET /api/rcf/member/profile` — Member profile (JWT required)
- `GET /api/rcf/member/giving` — Giving history (JWT required)

**Staff Auth (Phase 3):**
- `POST /api/rcf/staff/auth/login` — Staff magic link
- `POST /api/rcf/staff/auth/verify` — Verify, get JWT with role
- `POST /api/rcf/staff/auth/refresh` — Refresh staff token
- `GET /api/rcf/staff/dashboard` — Stats + visitors
- `GET /api/rcf/staff/visitors` — All visitors
- `GET /api/rcf/staff/users` — Staff list
- `GET/POST/PUT/DELETE /api/rcf/staff/sermons` — Sermon CRUD
- `PUT /api/rcf/staff/settings` — Update church settings
- `PUT /api/rcf/staff/events` — Update events
- `PUT /api/rcf/staff/visitors/:id/status` — Update visitor status

---

## CRM Integration

Visitor form submissions go to GoHighLevel (GHL) via the `/api/contact` route:

1. Visitor fills out a connect form (new, involved, families, agape)
2. Form submits to `/api/contact` with name, email, phone, interests
3. API creates/updates contact in GHL with tags based on the form
4. Visitor sees the success page

GHL Location: `mhVkT4IdOZj6jHuxoWTZ`

---

## Build Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| V1 Landing Page | Done | Public-facing pages, CRM integration, deployed on Vercel |
| Phase 2.0 Prop Refactoring | Done | All components accept data as props, zero direct constants imports |
| Phase 2.5 Content Layer | Done | MongoDB collections seeded, data.ts queries MongoDB, NestJS module scaffolded |
| Phase 3 Auth + RBAC | Done | Magic link auth, JWT tokens, protected routes, auth guards |
| Phase 4 Full CMS | Done | Admin CRUD API routes, real DB writes, revalidation on staff edits |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/data.ts` | All data-fetching functions (the ONE file to change for data sources) |
| `lib/types.ts` | Shared TypeScript interfaces for the entire app |
| `lib/mongodb.ts` | MongoDB connection helper (HMR-safe singleton) |
| `lib/constants.ts` | Hardcoded fallback data + NESTJS_API URL |
| `lib/auth-utils.ts` | Server-side JWT signing, magic link token generation |
| `lib/staff-auth.ts` | Client-side staff auth (localStorage tokens, fetchWithStaffAuth) |
| `lib/member-auth.ts` | Client-side member auth (localStorage tokens, fetchWithMemberAuth) |
| `components/ui.tsx` | Shared UI components (Tag, Input, Btn, Header, Section, Card, Footer) |
| `components/ContactForm.tsx` | Reusable visitor contact form |
| `scripts/seed-mongodb.ts` | Database seed script |
| `app/api/contact/route.ts` | GHL CRM contact creation endpoint |
| `app/api/auth/*/route.ts` | Auth API routes (magic link, verify, refresh) |
| `app/api/rcf/[...path]/route.ts` | NestJS API proxy (future use) |

---

## Authentication

### How It Works

RCF uses **magic link authentication** — no passwords are stored anywhere.

**Login Flow:**
1. User visits `/login` and enters their email
2. Chooses "Staff Login" or "Member Login"
3. API generates a one-time token (64-char hex), stores it in MongoDB with 1-hour expiry
4. In production: email sent via GHL with verify link
5. In dev mode: link shown directly on screen (yellow "Dev Mode" button)
6. User clicks link → `/auth/verify?token=xxx` or `/admin/auth/verify?token=xxx`
7. Verify page calls API to exchange token for JWT pair (access + refresh)
8. Tokens stored in localStorage, user redirected to portal

**Token Storage (localStorage):**

| Key | Purpose |
|-----|---------|
| `rcf_staff_access_token` | Staff JWT access token (1-hour expiry) |
| `rcf_staff_refresh_token` | Staff refresh token (1-year expiry) |
| `rcf_staff_token_expiry` | ISO timestamp for access token expiry |
| `rcf_staff_user` | Staff user object (name, email, role) |
| `rcf_access_token` | Member JWT access token |
| `rcf_refresh_token` | Member refresh token |
| `rcf_token_expiry` | Member token expiry |
| `rcf_member_user` | Member user object |

**Auth Guards:**
- `/admin/*` routes — checks `isStaffLoggedIn()`, redirects to `/login` if not
- `/member/*` routes — checks `isMemberLoggedIn()`, redirects to `/login` if not
- `/admin/auth/verify` is excluded from the guard (needs to work pre-auth)

**Auto-refresh:** `getStaffAccessToken()` and `getMemberAccessToken()` automatically refresh the token when it's within 5 minutes of expiry.

### Testing Auth Locally

1. Go to `/login`
2. Enter a staff email (e.g., `taulger@gmail.com`) and click "Send Login Link"
3. A yellow "Dev Mode" button appears — click it to verify and sign in
4. For member login, use `sarah.m@example.com` with the "Member Login" tab

---

## Ambassador Program

The Ambassador Program is a full referral/rewards system adapted from the LPAI ambassador platform. Church members sign up as ambassadors, share referral links, and earn points when their invitees take actions (visit, join small groups, attend events, etc.).

### Architecture

- **Service**: `lib/ambassador.ts` — all business logic (signup, auth, click tracking, conversion, stats, leaderboard, rewards, admin)
- **Types**: `lib/ambassador-types.ts` — TypeScript interfaces for all ambassador entities
- **Client Auth**: `lib/ambassador-auth.ts` — client-side session management (not JWT — uses session tokens)
- **Seed Script**: `scripts/seed-ambassador-config.ts` — seeds `rcfAmbassadorConfig` with church-themed products and rewards

### Collections (MongoDB `lpai` database)

| Collection | Purpose |
|-----------|---------|
| `rcfAmbassadorConfig` | Program config: products, rewards, branding, leaderboard settings |
| `rcfAmbassadors` | Ambassador profiles: email, slug, points, referrals, risk score |
| `rcfAmbassadorClicks` | Click tracking: each referral link click with IP hash, session, path |
| `rcfAmbassadorConversions` | Conversion records: visitor actions attributed to ambassadors |
| `rcfAmbassadorSessions` | Session tokens for ambassador portal auth (30-day TTL) |
| `rcfAmbassadorAuthTokens` | Magic link tokens (15-min TTL, one-time use) |
| `rcfAmbassadorRedemptions` | Reward redemption records (pending → fulfilled by staff) |

### Ambassador API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/ambassador/config` | Get program config |
| POST | `/api/ambassador/signup` | Register ambassador (fraud-checked) |
| POST | `/api/ambassador/auth/magic-link` | Request login link |
| POST | `/api/ambassador/auth/verify` | Verify token, create session |
| GET | `/api/ambassador/auth/session` | Validate session token |
| POST | `/api/ambassador/track-click` | Track referral click |
| POST | `/api/ambassador/record-conversion` | Record conversion + award points |
| GET | `/api/ambassador/stats` | Ambassador dashboard data |
| GET | `/api/ambassador/leaderboard/:locationId` | Leaderboard (aggregation) |
| POST | `/api/ambassador/redeem` | Redeem reward (deduct points) |
| GET | `/api/ambassador/admin/ambassadors` | List all ambassadors (staff auth) |
| PUT | `/api/ambassador/admin/ambassadors/:id/status` | Update status (staff auth) |
| DELETE | `/api/ambassador/admin/ambassadors/:id` | Delete ambassador + data (staff auth) |
| GET | `/api/ambassador/admin/dashboard` | Admin stats (staff auth) |
| GET | `/api/ambassador/admin/redemptions` | List redemptions (staff auth) |
| PUT | `/api/ambassador/admin/redemptions/:id/fulfill` | Fulfill redemption (staff auth) |

### Ambassador Portal Pages

| Route | Purpose |
|-------|---------|
| `/ambassador` | Signup page |
| `/ambassador/login` | Magic link login |
| `/ambassador/verify` | Token verification + session creation |
| `/ambassador/dashboard` | Stats, referral link, recent conversions/clicks |
| `/ambassador/leaderboard` | Ranked ambassadors by period |
| `/ambassador/rewards` | Reward catalog + redemption |
| `/ref/[slug]` | Referral redirect (tracks click, sets cookie, redirects to /) |

### Admin Ambassador Management

Located at `/admin/ambassadors` with three tabs:
- **Overview**: Program stats (total ambassadors, clicks, conversions, pending redemptions)
- **Ambassadors**: List all ambassadors with activate/suspend/delete actions
- **Redemptions**: Pending reward fulfillments with one-click fulfill button

### Fraud Detection

Ambassador signups are scored with a multi-check system (mirrors LPAI):
- Disposable email domain detection (40+ known domains)
- Spam TLD detection (.ru, .tk, .xyz, etc.)
- Suspicious email patterns (test123@, admin@, etc.)
- Gibberish name detection (Shannon entropy, consonant clusters, vowel ratio)
- Domain velocity (5+ signups/hour from same domain = block)
- Global velocity (10+ signups/10min = block)
- Risk score > 40 blocks signup

### Referral Flow

```
1. Ambassador signs up at /ambassador → gets slug (e.g. john-doe)
2. Ambassador shares link: /ref/john-doe
3. Visitor clicks link → /ref/[slug] page:
   - Sets cookie: rcf_ref=john-doe (90 days)
   - POST /api/ambassador/track-click
   - Redirects to /
4. Visitor fills out connect form → form reads rcf_ref cookie
   - POST /api/ambassador/record-conversion with items
   - Points awarded per trackableProducts config
5. Ambassador sees points on dashboard, can redeem rewards
```

---

## Development Notes

- **Local only**: All changes are local. Do not push to git or deploy until authorized.
- **No passwords**: Auth uses magic link emails (no password storage). In dev mode, the magic link is shown directly on screen.
- **Fallback data**: If MongoDB is unavailable, all pages gracefully fall back to hardcoded data from `lib/constants.ts`.
- **Server Components**: All `page.tsx` files are async Server Components. They fetch data on the server and pass it to Client Components as props.
- **Hot reload**: The MongoDB connection persists across Next.js HMR reloads in development (no connection leak).
