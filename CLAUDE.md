@AGENTS.md

# Houseboys App

Fan subscription landing page for the Houseboys music group. Live at https://houzeboys.vercel.app

## Stack

- **Next.js 16** (App Router) — see `node_modules/next/dist/docs/` before making changes
- **React 19**
- **Tailwind CSS v4** — config via `@theme` in `app/globals.css`, no `tailwind.config.js`
- **TanStack Query v5** — `QueryClientProvider` in `components/Providers.tsx`
- **TypeScript**

## Project Structure

```
app/
  layout.tsx          # Root layout — Inter + Montserrat fonts, Providers wrapper, metadata
  page.tsx            # Page composition: Header → HeroSection → PlatformCards → Footer
  loading.tsx         # Next.js Suspense skeleton shown on slow loads
  globals.css         # Tailwind v4 @import + @theme tokens + scroll-behavior: smooth

components/
  Header.tsx          # "use client" — sticky nav, logo, mobile hamburger menu
  HeroSection.tsx     # Two-column hero: brand + socials left, form right (server)
  SubscriptionForm.tsx # "use client" — useMutation form with pending/success/error states
  PlatformCards.tsx   # 7 platform cards with brand colors (server)
  Footer.tsx          # Copyright footer (server)
  Providers.tsx       # "use client" — QueryClientProvider wrapper

  assets/
    houZeboysLogo.webp  # Brand logo — imported via Next.js static import in Header.tsx

  skeletons/
    HeaderSkeleton.tsx      # Matches Header layout
    HeroSkeleton.tsx        # Matches HeroSection layout
    PlatformCardsSkeleton.tsx # Matches PlatformCards layout
```

## Design System (from figma.md in /Users/bara080/bara/houZeBoys/)

| Token | Hex | Usage |
|---|---|---|
| Background | `#0f0f0f` | Page + header bg |
| White | `#ffffff` | Primary text, CTA button fill |
| Gray-300 | `#d1d5db` | CTA hover, subtitle |
| Gray-400 | `#9ca3af` | Nav links, body text |
| Gray-500 | `#6b7280` | Labels, placeholders |
| Gray-600 | `#4b5563` | Footer text |

Glass card pattern: `bg-white/[0.03] backdrop-blur-sm border border-white/10`
Header bg pattern: `bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/[0.06]`

## Anchor IDs (for nav scroll)
- `#join` → `<section id="join">` in `HeroSection.tsx` (scrolls to the subscription form area)
- `#socials` → `<section id="socials">` in `PlatformCards.tsx`

## Common Commands

```bash
npm run dev    # http://localhost:3000
npm run build  # Production build + type check
npm run lint   # ESLint
vercel --prod  # Deploy to production
```

## Form Handling

`SubscriptionForm.tsx` uses `useMutation` from TanStack Query. Currently simulates a 1.2s network delay.
To connect a real backend, replace `subscribeUser()` with:
- **Formspree**: `fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', ... })`
- **Firebase**: `addDoc(collection(db, 'subscribers'), data)`

## Key Notes

- `Header.tsx` and `SubscriptionForm.tsx` must stay `"use client"` — they use hooks
- All other components are server components
- Logo is a static import from `components/assets/houZeboysLogo.webp`
- Inline SVG icons used everywhere — no icon library dependency
- Mobile-first: hamburger menu on `< md`, full nav on `md+`
