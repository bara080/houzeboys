# Admin Dashboard — Design Spec
Date: 2026-05-07

## Overview
An invite-only admin dashboard at `/admin` within the existing houzeboys Next.js app. Built with shadcn/ui on a dark theme. Protected by Supabase Auth — only users with an `admin` role in `app_metadata` can access it. Provides subscriber analytics, a searchable/filterable data table, and CSV + PDF report downloads.

---

## 1. Folder Structure Refactor

Migrate from flat `app/` + `components/` to a `src/` layout:

```
src/
  app/
    (public)/          # existing landing page routes
      layout.tsx
      page.tsx
      loading.tsx
      globals.css
      api/
        subscribe/
          route.ts
    (admin)/           # new admin route group
      admin/
        layout.tsx     # sidebar + auth guard
        page.tsx       # dashboard home
        subscribers/
          page.tsx     # full subscriber table
        reports/
          page.tsx     # download CSV + PDF
        team/
          page.tsx     # manage + invite admins
      login/
        page.tsx       # Supabase Auth login form
  components/
    ui/                # shadcn components (Button, Table, Card, etc.)
    admin/             # admin-specific components
    (existing public components stay here)
  lib/
    supabase.ts        # Supabase client (already exists, moved)
```

---

## 2. Authentication

- **Provider**: Supabase Auth, email + password only
- **Role gate**: Users must have `app_metadata.role = "admin"` — checked server-side via middleware
- **Middleware**: `src/middleware.ts` intercepts all `/admin/*` requests, validates session, redirects unauthenticated users to `/login`
- **No public signup**: admins are created only via invite
- **Invite flow**: Existing admin clicks "Invite User" → enters email → Supabase sends a magic-link invite email → invitee sets password on first login
- **Avatar**: Derived from the admin's email initial (e.g. "BA" for baraahmad232@gmail.com) — no image upload required

---

## 3. Dashboard — Stat Cards

Four cards across the top:

| Card | Data Source | Period |
|---|---|---|
| Total Subscribers | `SELECT COUNT(*) FROM subscribers` | All time |
| New This Week | `SELECT COUNT(*) FROM subscribers WHERE created_at > now() - interval '7 days'` | Last 7 days |
| Page Visitors | Vercel Analytics API | Configurable: last week / last month / last 30 days |
| Growth Rate | Computed: (this month signups / last month signups - 1) × 100 | Month-over-month |

---

## 4. Charts

Two charts below the stat cards:

- **Signup Growth** — bar chart, daily signup counts for the last 30 days. Data from Supabase, grouped by `DATE(created_at)`.
- **Visitor Trend** — line chart, daily unique visitors from Vercel Analytics API.

Chart library: **Recharts** (already compatible with shadcn/ui).

---

## 5. Subscriber Table

Located on `/admin` (summary, last 10) and `/admin/subscribers` (full table).

**Columns**: Name · Email · Phone · Joined date

**Filter/Search bar**: Real-time client-side filter by name or email. Input field above the table — filters as you type, no server round-trip needed given the dataset size.

**Pagination**: 20 rows per page for the full table.

---

## 6. Reports Page (`/admin/reports`)

Two download buttons:

- **Download CSV** — fetches all subscribers from Supabase, generates a `.csv` file client-side, triggers browser download
- **Download PDF** — uses `jsPDF` + `jspdf-autotable` to generate a formatted PDF with the subscriber table and a summary header (date, total count)

No server-side file generation — both are client-side to keep it simple.

---

## 7. Team Page (`/admin/team`)

- Lists all users in `auth.users` where `app_metadata.role = "admin"`
- "Invite User" button → modal with email input → calls Supabase `admin.inviteUserByEmail()` server-side via an API route (`/api/admin/invite`)
- Only admins can invite — the API route validates the caller's session and role before sending

---

## 8. Vercel Analytics Integration

Add `@vercel/analytics` package. Drop `<Analytics />` into the root layout for automatic page view tracking. The Vercel Analytics API is then queryable for visitor data to display in the dashboard.

---

## 9. Security

- Middleware blocks all `/admin/*` at the edge — no admin UI rendered for unauthenticated users
- `app_metadata.role` used for authorization (not `user_metadata` — Supabase best practice, `user_metadata` is user-editable)
- Invite API route re-validates session server-side before calling Supabase admin methods
- Service role key used only in server-side API routes, never in client code

---

## 10. shadcn/ui Components Used

`Button`, `Card`, `Table`, `Input`, `Badge`, `Avatar`, `Dialog` (invite modal), `DropdownMenu` (user menu), `Separator`, `Sheet` (mobile sidebar)

---

## Out of Scope

- Email notification on new subscriber
- Admin audit log
- Dark/light mode toggle (dark only, matching the existing site)
- Mobile-optimized admin (desktop-first)
