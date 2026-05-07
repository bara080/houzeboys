# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an invite-only admin dashboard at `/admin` with Supabase Auth, subscriber analytics, searchable data table, and CSV/PDF report downloads — within the existing houzeboys Next.js app refactored into a `src/` layout.

**Architecture:** All existing files migrate into `src/`. The admin lives in a `(admin)` route group at `src/app/(admin)/admin/` with its own sidebar layout, protected by a Next.js middleware that checks Supabase Auth session and `app_metadata.role === "admin"`. shadcn/ui provides all UI components. The public landing page and API routes remain unchanged, just moved under `src/`.

**Tech Stack:** Next.js 16 App Router · Supabase Auth (`@supabase/ssr`) · shadcn/ui · Tailwind v4 · Recharts · jsPDF · jspdf-autotable · @vercel/analytics

---

## File Map

**Migrated (move, no content change):**
- `app/globals.css` → `src/app/globals.css`
- `app/page.tsx` → `src/app/(public)/page.tsx`
- `app/loading.tsx` → `src/app/(public)/loading.tsx`
- `components/` → `src/components/` (all public components)

**Modified during migration:**
- `app/layout.tsx` → `src/app/layout.tsx` (add Analytics, update import path)
- `app/api/subscribe/route.ts` → `src/app/api/subscribe/route.ts` (no content change)
- `tsconfig.json` — update `@/*` alias to `./src/*`

**New — Auth & Middleware:**
- `src/middleware.ts` — edge middleware, protects `/admin/*`
- `src/lib/supabase-browser.ts` — client-side Supabase client (for login form)
- `src/lib/supabase-server.ts` — server-side Supabase client (for server components)
- `src/lib/supabase-admin.ts` — service-role client (for admin API routes)

**New — Login:**
- `src/app/login/page.tsx` — email + password login form

**New — Admin Shell:**
- `src/app/(admin)/admin/layout.tsx` — admin layout: sidebar + auth guard
- `src/components/admin/Sidebar.tsx` — left nav (Dashboard, Subscribers, Reports, Team)
- `src/components/admin/TopBar.tsx` — header with avatar + invite button

**New — Dashboard:**
- `src/app/(admin)/admin/page.tsx` — dashboard home
- `src/components/admin/StatCards.tsx` — 4 stat cards
- `src/components/admin/SignupChart.tsx` — bar chart, daily signups (Recharts)
- `src/components/admin/VisitorChart.tsx` — line chart, page views (Recharts)
- `src/lib/stats.ts` — subscriber stat queries against Supabase

**New — Subscribers:**
- `src/app/(admin)/admin/subscribers/page.tsx` — full subscriber table page
- `src/components/admin/SubscriberTable.tsx` — table + search/filter bar

**New — Reports:**
- `src/app/(admin)/admin/reports/page.tsx` — report downloads page
- `src/lib/export.ts` — CSV and PDF generation helpers

**New — Team:**
- `src/app/(admin)/admin/team/page.tsx` — team management page
- `src/components/admin/InviteModal.tsx` — invite by email modal
- `src/app/api/admin/invite/route.ts` — server-side invite endpoint

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Install all required packages**

```bash
cd /path/to/houzeboys-app
npm install @supabase/ssr recharts jspdf jspdf-autotable @vercel/analytics
npm install --save-dev @types/jspdf
```

- [ ] **Verify install succeeded**

```bash
npm ls @supabase/ssr recharts jspdf @vercel/analytics
```

Expected: each package listed without errors.

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "add admin dashboard dependencies"
```

---

## Task 2: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/components/ui/` (populated by shadcn CLI)

- [ ] **Run shadcn init**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Zinc** (closest dark match)
- CSS variables: **Yes**

- [ ] **Install required shadcn components**

```bash
npx shadcn@latest add button card table input badge avatar dialog dropdown-menu separator sheet
```

- [ ] **Verify components exist**

```bash
ls src/components/ui/
```

Expected: `button.tsx`, `card.tsx`, `table.tsx`, `input.tsx`, `badge.tsx`, `avatar.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `separator.tsx`, `sheet.tsx`

- [ ] **Commit**

```bash
git add components.json src/components/ui/
git commit -m "add shadcn/ui components"
```

---

## Task 3: Migrate to src/ directory structure

**Files:**
- Move: `app/` → `src/app/`
- Move: `components/` → `src/components/` (excluding `src/components/ui/` already created)
- Modify: `tsconfig.json`
- Modify: `.gitignore`

- [ ] **Create src directory and move app/**

```bash
mkdir -p src
# Move app contents but keep structure
mv app src/app
```

- [ ] **Move public components into src/components (merge, don't overwrite ui/)**

```bash
# Move existing component files into src/components
mv components/Header.tsx src/components/
mv components/HeroSection.tsx src/components/
mv components/SubscriptionForm.tsx src/components/
mv components/PlatformCards.tsx src/components/
mv components/Footer.tsx src/components/
mv components/Providers.tsx src/components/
mv components/assets src/components/assets
mkdir -p src/components/skeletons
mv components/skeletons/HeaderSkeleton.tsx src/components/skeletons/
mv components/skeletons/HeroSkeleton.tsx src/components/skeletons/
mv components/skeletons/PlatformCardsSkeleton.tsx src/components/skeletons/
rmdir components/skeletons components
```

- [ ] **Create the public route group and move page/loading**

```bash
mkdir -p src/app/\(public\)
mv src/app/page.tsx src/app/\(public\)/page.tsx
mv src/app/loading.tsx src/app/\(public\)/loading.tsx
```

- [ ] **Update tsconfig.json to resolve @/* from src/**

Open `tsconfig.json` and change:
```json
"paths": {
  "@/*": ["./*"]
}
```
to:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

- [ ] **Add .superpowers to .gitignore**

Add this line to `.gitignore`:
```
.superpowers/
```

- [ ] **Verify the build still passes**

```bash
npm run build
```

Expected: same output as before — `✓ Compiled successfully`, routes `○ /` and `ƒ /api/subscribe`.

- [ ] **Commit**

```bash
git add -A
git commit -m "migrate to src/ directory structure"
```

---

## Task 4: Add env vars for Supabase service role and Vercel API

**Files:**
- Modify: `.env.local`

- [ ] **Get the Supabase service role key**

Go to [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/qdchxufrtrftoliyaisl/settings/api). Copy the **service_role** key (starts with `eyJ...`).

- [ ] **Get a Vercel API token**

Go to [Vercel → Account Settings → Tokens](https://vercel.com/account/tokens). Create a token named `houzeboys-admin`. Copy it.

- [ ] **Add to .env.local**

Append to `.env.local`:
```
# Supabase service role — server-side only, NEVER NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=<paste service role key here>

# Vercel Analytics API
VERCEL_API_TOKEN=<paste vercel token here>
VERCEL_TEAM_ID=team_7ifRPa37qR43tWlmxooMF1Yf
VERCEL_PROJECT_ID=prj_pXwBH6s5p2DDqlUlVQYeFMvDAv8x
```

- [ ] **Add same vars to Vercel project (production)**

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VERCEL_API_TOKEN
```

When prompted, paste the values and select **Production + Preview + Development**.

---

## Task 5: Create Supabase client files

**Files:**
- Create: `src/lib/supabase-browser.ts`
- Create: `src/lib/supabase-server.ts`
- Create: `src/lib/supabase-admin.ts`

- [ ] **Create browser client (for login form)**

Create `src/lib/supabase-browser.ts`:
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

- [ ] **Create server client (for server components and middleware)**

Create `src/lib/supabase-server.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

- [ ] **Create admin client (service role — for API routes only)**

Create `src/lib/supabase-admin.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

- [ ] **Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/lib/
git commit -m "add supabase client helpers"
```

---

## Task 6: Create admin user in Supabase

**Files:** None (Supabase dashboard action)

- [ ] **Enable email auth in Supabase**

Go to [Authentication → Providers](https://supabase.com/dashboard/project/qdchxufrtrftoliyaisl/auth/providers). Ensure **Email** is enabled.

- [ ] **Create the first admin user**

Go to [Authentication → Users](https://supabase.com/dashboard/project/qdchxufrtrftoliyaisl/auth/users). Click **Add user → Create new user**. Enter:
- Email: `baraahmad232@gmail.com`
- Password: choose a strong password
- Check "Auto Confirm User"

- [ ] **Set admin role on the user**

Go to the [Supabase SQL Editor](https://supabase.com/dashboard/project/qdchxufrtrftoliyaisl/sql) and run:
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'baraahmad232@gmail.com';
```

Verify it worked:
```sql
SELECT email, raw_app_meta_data FROM auth.users WHERE email = 'baraahmad232@gmail.com';
```

Expected: `raw_app_meta_data` contains `{"role": "admin"}`.

---

## Task 7: Middleware — protect /admin routes

**Files:**
- Create: `src/middleware.ts`

- [ ] **Create middleware**

Create `src/middleware.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in — redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in but not admin — redirect to login
  const role = (user.app_metadata as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Verify build passes**

```bash
npm run build
```

Expected: compiles without errors, middleware shown in output.

- [ ] **Commit**

```bash
git add src/middleware.ts
git commit -m "add admin route middleware with supabase auth guard"
```

---

## Task 8: Login page

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Create login page**

Create `src/app/login/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <Card className="w-full max-w-sm bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">
            Houzeboys admin access only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold hover:bg-gray-200"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Test login manually**

```bash
npm run dev
```

Visit `http://localhost:3000/login`. Sign in with the admin credentials from Task 6. Should redirect to `/admin` (will 404 until Task 9 — that's expected).

Trying to visit `http://localhost:3000/admin` without being logged in should redirect to `/login`.

- [ ] **Commit**

```bash
git add src/app/login/
git commit -m "add admin login page"
```

---

## Task 9: Subscriber stats library

**Files:**
- Create: `src/lib/stats.ts`

- [ ] **Create stats module**

Create `src/lib/stats.ts`:
```typescript
import { createAdminClient } from "@/lib/supabase-admin";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface DailyCount {
  date: string;
  count: number;
}

export async function getTotalSubscribers(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getNewSubscribersCount(days: number): Promise<number> {
  const supabase = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .gte("created_at", since.toISOString());
  return count ?? 0;
}

export async function getGrowthRate(): Promise<number> {
  const supabase = createAdminClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [{ count: thisMonth }, { count: lastMonth }] = await Promise.all([
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth.toISOString())
      .lt("created_at", startOfMonth.toISOString()),
  ]);

  if (!lastMonth || lastMonth === 0) return thisMonth ? 100 : 0;
  return Math.round(((thisMonth! - lastMonth) / lastMonth) * 100);
}

export async function getDailySignups(days: number): Promise<DailyCount[]> {
  const supabase = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("subscribers")
    .select("created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (!data) return [];

  const counts: Record<string, number> = {};
  data.forEach(({ created_at }) => {
    const date = created_at.slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  });

  const result: DailyCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    result.push({ date, count: counts[date] ?? 0 });
  }
  return result;
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscribers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}
```

- [ ] **Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/lib/stats.ts
git commit -m "add subscriber stats library"
```

---

## Task 10: Vercel Analytics visitor stats

**Files:**
- Create: `src/lib/analytics.ts`

- [ ] **Create analytics module**

Create `src/lib/analytics.ts`:
```typescript
export interface VisitorStats {
  totalVisitors: number;
  lastWeek: number;
  lastMonth: number;
  last30Days: number;
}

export interface DailyVisitors {
  date: string;
  visitors: number;
}

async function fetchVercelAnalytics(from: string, to: string) {
  const params = new URLSearchParams({
    projectId: process.env.VERCEL_PROJECT_ID!,
    teamId: process.env.VERCEL_TEAM_ID!,
    from,
    to,
    granularity: "day",
    environment: "production",
  });

  const res = await fetch(
    `https://vercel.com/api/web/insights/stats/visitors?${params}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      },
      next: { revalidate: 3600 }, // cache 1 hour
    }
  );

  if (!res.ok) return null;
  return res.json();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function sumVisitors(data: { data: { key: string; total: number }[] } | null): number {
  if (!data?.data) return 0;
  return data.data.reduce((sum, d) => sum + (d.total ?? 0), 0);
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const today = new Date().toISOString().slice(0, 10);

  const [week, month, thirty] = await Promise.all([
    fetchVercelAnalytics(daysAgo(7), today),
    fetchVercelAnalytics(daysAgo(30), today),
    fetchVercelAnalytics(daysAgo(30), today),
  ]);

  return {
    totalVisitors: sumVisitors(month),
    lastWeek: sumVisitors(week),
    lastMonth: sumVisitors(month),
    last30Days: sumVisitors(thirty),
  };
}

export async function getDailyVisitors(days: number): Promise<DailyVisitors[]> {
  const today = new Date().toISOString().slice(0, 10);
  const data = await fetchVercelAnalytics(daysAgo(days), today);
  if (!data?.data) return [];
  return data.data.map((d: { key: string; total: number }) => ({
    date: d.key,
    visitors: d.total,
  }));
}
```

- [ ] **Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add src/lib/analytics.ts
git commit -m "add vercel analytics visitor stats helper"
```

---

## Task 11: Admin layout, Sidebar, and TopBar components

**Files:**
- Create: `src/app/(admin)/admin/layout.tsx`
- Create: `src/components/admin/Sidebar.tsx`
- Create: `src/components/admin/TopBar.tsx`

- [ ] **Create Sidebar**

Create `src/components/admin/Sidebar.tsx`:
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileDown, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileDown },
  { href: "/admin/team", label: "Team", icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-white/[0.06] bg-[#0a0a0a] flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <span className="text-white font-bold text-sm tracking-wide">Houzeboys Admin</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-white/10 text-white font-medium"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Create TopBar**

Create `src/components/admin/TopBar.tsx`:
```typescript
import { createClient } from "@/lib/supabase-server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import InviteModal from "@/components/admin/InviteModal";

export default async function TopBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const initials = (user?.email ?? "A")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0">
      <span className="text-white font-semibold text-sm">Dashboard</span>
      <div className="flex items-center gap-3">
        <InviteModal />
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
```

- [ ] **Create admin layout**

Create `src/app/(admin)/admin/layout.tsx`:
```typescript
import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Add lucide-react (required by Sidebar)**

```bash
npm install lucide-react
```

- [ ] **Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors (InviteModal will be a stub until Task 15 — create a placeholder now).

Create a stub `src/components/admin/InviteModal.tsx`:
```typescript
export default function InviteModal() {
  return null;
}
```

- [ ] **Commit**

```bash
git add src/app/\(admin\)/ src/components/admin/
git commit -m "add admin layout, sidebar, and topbar"
```

---

## Task 12: Stat cards component

**Files:**
- Create: `src/components/admin/StatCards.tsx`

- [ ] **Create StatCards**

Create `src/components/admin/StatCards.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTotalSubscribers,
  getNewSubscribersCount,
  getGrowthRate,
} from "@/lib/stats";
import { getVisitorStats } from "@/lib/analytics";

export default async function StatCards() {
  const [total, newThisWeek, growthRate, visitors] = await Promise.all([
    getTotalSubscribers(),
    getNewSubscribersCount(7),
    getGrowthRate(),
    getVisitorStats(),
  ]);

  const cards = [
    {
      title: "Total Subscribers",
      value: total.toLocaleString(),
      sub: `+${newThisWeek} this week`,
      positive: newThisWeek > 0,
    },
    {
      title: "New This Week",
      value: newThisWeek.toLocaleString(),
      sub: "last 7 days",
      positive: newThisWeek > 0,
    },
    {
      title: "Page Visitors",
      value: visitors.last30Days.toLocaleString(),
      sub: `${visitors.lastWeek} last week · ${visitors.lastMonth} last month`,
      positive: visitors.last30Days > 0,
    },
    {
      title: "Growth Rate",
      value: `${growthRate > 0 ? "+" : ""}${growthRate}%`,
      sub: "month over month",
      positive: growthRate >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-white/[0.03] border-white/10">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className={`text-xs mt-1 ${card.positive ? "text-green-400" : "text-gray-500"}`}>
              {card.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/admin/StatCards.tsx
git commit -m "add admin stat cards"
```

---

## Task 13: Charts — SignupChart and VisitorChart

**Files:**
- Create: `src/components/admin/SignupChart.tsx`
- Create: `src/components/admin/VisitorChart.tsx`

- [ ] **Create SignupChart (client component — Recharts)**

Create `src/components/admin/SignupChart.tsx`:
```typescript
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyCount } from "@/lib/stats";

export default function SignupChart({ data }: { data: DailyCount[] }) {
  const formatted = data.map((d) => ({
    date: d.date.slice(5), // "MM-DD"
    count: d.count,
  }));

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <p className="text-sm font-semibold text-white mb-4">Signup Growth (30 days)</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={formatted}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="count" fill="#ffffff" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Create VisitorChart**

Create `src/components/admin/VisitorChart.tsx`:
```typescript
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyVisitors } from "@/lib/analytics";

export default function VisitorChart({ data }: { data: DailyVisitors[] }) {
  const formatted = data.map((d) => ({
    date: d.date.slice(5),
    visitors: d.visitors,
  }));

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <p className="text-sm font-semibold text-white mb-4">Visitor Trend (30 days)</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={formatted}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
          />
          <Line
            dataKey="visitors"
            stroke="#ffffff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/admin/SignupChart.tsx src/components/admin/VisitorChart.tsx
git commit -m "add signup and visitor charts"
```

---

## Task 14: Subscriber table with search/filter

**Files:**
- Create: `src/components/admin/SubscriberTable.tsx`
- Create: `src/app/(admin)/admin/subscribers/page.tsx`

- [ ] **Create SubscriberTable (client — needs filter state)**

Create `src/components/admin/SubscriberTable.tsx`:
```typescript
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Subscriber } from "@/lib/stats";

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SubscriberTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(0); }}
        className="max-w-sm bg-white/5 border-white/10 text-white placeholder:text-gray-600"
      />
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-500">Name</TableHead>
              <TableHead className="text-gray-500">Email</TableHead>
              <TableHead className="text-gray-500">Phone</TableHead>
              <TableHead className="text-gray-500">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((s) => (
                <TableRow key={s.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="text-white font-medium">{s.name}</TableCell>
                  <TableCell className="text-gray-400">{s.email}</TableCell>
                  <TableCell className="text-gray-400">{s.phone}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(s.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded border border-white/10 disabled:opacity-30 hover:text-white"
          >
            ← Prev
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded border border-white/10 disabled:opacity-30 hover:text-white"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Create subscribers page**

Create `src/app/(admin)/admin/subscribers/page.tsx`:
```typescript
import { getAllSubscribers } from "@/lib/stats";
import SubscriberTable from "@/components/admin/SubscriberTable";

export default async function SubscribersPage() {
  const subscribers = await getAllSubscribers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Subscribers</h1>
        <p className="text-sm text-gray-500 mt-1">{subscribers.length} total</p>
      </div>
      <SubscriberTable subscribers={subscribers} />
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/admin/SubscriberTable.tsx src/app/\(admin\)/admin/subscribers/
git commit -m "add subscriber table with search and pagination"
```

---

## Task 15: Export library — CSV and PDF

**Files:**
- Create: `src/lib/export.ts`

- [ ] **Create export module**

Create `src/lib/export.ts`:
```typescript
import type { Subscriber } from "@/lib/stats";

export function downloadCSV(subscribers: Subscriber[]) {
  const headers = ["Name", "Email", "Phone", "Joined"];
  const rows = subscribers.map((s) => [
    s.name,
    s.email,
    s.phone,
    new Date(s.created_at).toLocaleDateString("en-US"),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `houzeboys-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPDF(subscribers: Subscriber[], totalCount: number) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Houzeboys — Subscriber Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US")}`, 14, 28);
  doc.text(`Total subscribers: ${totalCount}`, 14, 34);

  autoTable(doc, {
    startY: 42,
    head: [["Name", "Email", "Phone", "Joined"]],
    body: subscribers.map((s) => [
      s.name,
      s.email,
      s.phone,
      new Date(s.created_at).toLocaleDateString("en-US"),
    ]),
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 9 },
  });

  doc.save(`houzeboys-subscribers-${new Date().toISOString().slice(0, 10)}.pdf`);
}
```

- [ ] **Commit**

```bash
git add src/lib/export.ts
git commit -m "add csv and pdf export helpers"
```

---

## Task 16: Reports page

**Files:**
- Create: `src/app/(admin)/admin/reports/page.tsx`

- [ ] **Create reports page**

Create `src/app/(admin)/admin/reports/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { downloadCSV, downloadPDF } from "@/lib/export";
import type { Subscriber } from "@/lib/stats";
import { useEffect } from "react";

export default function ReportsPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((data) => { setSubscribers(data); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-white">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Download subscriber data</p>
      </div>

      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">Subscriber Export</CardTitle>
          <CardDescription className="text-gray-500">
            {loading ? "Loading…" : `${subscribers.length} subscribers`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => downloadCSV(subscribers)}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Download CSV
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => downloadPDF(subscribers, subscribers.length)}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Create the subscribers data API route (used by reports page)**

Create `src/app/api/admin/subscribers/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAllSubscribers } from "@/lib/stats";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || (user.app_metadata as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await getAllSubscribers();
  return NextResponse.json(subscribers);
}
```

- [ ] **Commit**

```bash
git add src/app/\(admin\)/admin/reports/ src/app/api/admin/subscribers/
git commit -m "add reports page with csv and pdf download"
```

---

## Task 17: Invite modal and Team page

**Files:**
- Modify: `src/components/admin/InviteModal.tsx` (replace stub)
- Create: `src/app/api/admin/invite/route.ts`
- Create: `src/app/(admin)/admin/team/page.tsx`

- [ ] **Create invite API route**

Create `src/app/api/admin/invite/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  // Validate caller is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || (user.app_metadata as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role: "admin" },
  });

  if (error) {
    console.error("[invite]", error.code);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }

  // Set admin role on invited user after invite
  const { data: invited } = await admin.auth.admin.listUsers();
  const invitedUser = invited?.users.find((u) => u.email === email);
  if (invitedUser) {
    await admin.auth.admin.updateUserById(invitedUser.id, {
      app_metadata: { role: "admin" },
    });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Replace InviteModal stub with real component**

Replace `src/components/admin/InviteModal.tsx`:
```typescript
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InviteModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Failed to send invite");
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setStatus("idle"); }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 text-white hover:bg-white/10 text-xs"
        >
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
        </DialogHeader>
        {status === "success" ? (
          <p className="text-green-400 text-sm">Invite sent! They'll receive an email.</p>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            {status === "error" && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-white text-black font-bold hover:bg-gray-200"
            >
              {status === "loading" ? "Sending…" : "Send Invite"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Create team page**

Create `src/app/(admin)/admin/team/page.tsx`:
```typescript
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import InviteModal from "@/components/admin/InviteModal";

export default async function TeamPage() {
  // Validate caller is admin before fetching user list
  const supabase = await createClient();
  const { data: { user: caller } } = await supabase.auth.getUser();
  if (!caller || (caller.app_metadata as { role?: string })?.role !== "admin") {
    return <p className="text-red-400">Unauthorized</p>;
  }

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers();
  const admins = (data?.users ?? []).filter(
    (u) => (u.app_metadata as { role?: string })?.role === "admin"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Team</h1>
          <p className="text-sm text-gray-500 mt-1">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
        </div>
        <InviteModal />
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-500">Email</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((u) => (
              <TableRow key={u.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell className="text-white">{u.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={u.confirmed_at ? "border-green-500/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}
                  >
                    {u.confirmed_at ? "Active" : "Invited"}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US") : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/admin/InviteModal.tsx src/app/api/admin/ src/app/\(admin\)/admin/team/
git commit -m "add team page and admin invite flow"
```

---

## Task 18: Dashboard home page — wire everything together

**Files:**
- Create: `src/app/(admin)/admin/page.tsx`

- [ ] **Create dashboard page**

Create `src/app/(admin)/admin/page.tsx`:
```typescript
import StatCards from "@/components/admin/StatCards";
import SignupChart from "@/components/admin/SignupChart";
import VisitorChart from "@/components/admin/VisitorChart";
import SubscriberTable from "@/components/admin/SubscriberTable";
import { getDailySignups, getAllSubscribers } from "@/lib/stats";
import { getDailyVisitors } from "@/lib/analytics";

export default async function AdminPage() {
  const [signupData, visitorData, subscribers] = await Promise.all([
    getDailySignups(30),
    getDailyVisitors(30),
    getAllSubscribers(),
  ]);

  // Show latest 5 on dashboard
  const recent = subscribers.slice(0, 5);

  return (
    <div className="space-y-6">
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SignupChart data={signupData} />
        <VisitorChart data={visitorData} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Recent Subscribers</p>
          <a href="/admin/subscribers" className="text-xs text-gray-500 hover:text-white transition-colors">
            View all →
          </a>
        </div>
        <SubscriberTable subscribers={recent} />
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/app/\(admin\)/admin/page.tsx
git commit -m "add admin dashboard home page"
```

---

## Task 19: Add Vercel Analytics tracking to root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Add Analytics to root layout**

Open `src/app/layout.tsx` and update it:
```typescript
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "Houzeboys | Stay Connected",
  description:
    "Subscribe to get updates on new music, videos, events, and exclusive announcements from the houzeboys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Commit**

```bash
git add src/app/layout.tsx
git commit -m "add vercel analytics to root layout"
```

---

## Task 20: Final build verification and deploy

- [ ] **Run full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Run production build**

```bash
npm run build
```

Expected: all routes listed, no type errors, no build errors. Routes should include:
- `○ /` (landing)
- `○ /login`
- `ƒ /admin`
- `ƒ /admin/subscribers`
- `ƒ /admin/reports`
- `ƒ /admin/team`
- `ƒ /api/admin/invite`
- `ƒ /api/admin/subscribers`
- `ƒ /api/subscribe`

- [ ] **Smoke test locally**

```bash
npm run dev
```

1. Visit `http://localhost:3000` — landing page renders ✓
2. Visit `http://localhost:3000/admin` — redirects to `/login` ✓
3. Log in at `/login` — redirects to `/admin` ✓
4. Check dashboard: stat cards, charts, recent subscribers ✓
5. Visit `/admin/subscribers` — full table, search filter works ✓
6. Visit `/admin/reports` — CSV and PDF download ✓
7. Visit `/admin/team` — admin list, Invite User opens modal ✓

- [ ] **Add env vars to Vercel if not already done**

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VERCEL_API_TOKEN
vercel env add VERCEL_TEAM_ID
vercel env add VERCEL_PROJECT_ID
```

- [ ] **Deploy to production**

```bash
vercel --prod
```

- [ ] **Final commit**

```bash
git add -A
git commit -m "complete admin dashboard with auth, analytics, and reports"
```
