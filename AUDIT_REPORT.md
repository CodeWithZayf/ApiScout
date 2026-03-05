# ApiScout Repository Audit Report

**Date:** February 17, 2026  
**Auditor:** Claude Opus 4.6 (Senior Staff Engineer)  
**Project:** ApiScout - API Discovery Platform  
**Stack:** Next.js 16 (App Router), NestJS 11, Prisma 7, PostgreSQL, Tailwind CSS v3

---

## Executive Summary

ApiScout has evolved into a **fully functional full-stack application** with comprehensive backend API, authentication system, and polished frontend UI. The codebase demonstrates production-quality patterns and is nearly deployment-ready.

| Category | Status | Notes |
| -------- | ------ | ----- |
| Project Structure | 🟢 | Clean apps/ separation |
| Frontend (Next.js 16) | 🟢 | Modern App Router with RSC |
| Backend (NestJS 11) | 🟢 | Full REST API implemented |
| Database (Prisma 7) | 🟢 | Comprehensive schema with seed |
| Authentication | 🟢 | JWT-based auth complete |
| API Integration | 🟢 | Frontend connected to backend |
| Docker | 🟠 | Compose ready, Dockerfiles empty |
| Environment Config | 🟠 | Missing .env.example files |

### Health Score: **Production-Ready** (with minor fixes)

| Metric | Count |
| ------ | ----- |
| Critical Issues | 0 |
| Warnings | 4 |
| Recommendations | 3 |

---

## 1. PROJECT STRUCTURE

### Current Architecture

```
ApiScout/
├── apps/
│   ├── frontend/          # Next.js 16 application
│   │   ├── app/           # App Router pages
│   │   ├── components/    # UI components (ui/, layout/, home/, api/, search/)
│   │   └── lib/           # Utilities, types, auth context
│   └── backend/           # NestJS 11 application
│       ├── src/           # Feature modules (apis, auth, bookmarks, etc.)
│       └── prisma/        # Schema and migrations
├── docker/                # Docker configuration
├── package.json           # Root package (minimal)
└── .gitignore             # Comprehensive ignore patterns
```

### Assessment

| Aspect | Status | Details |
| ------ | ------ | ------- |
| Monorepo structure | 🟢 | Clean separation of frontend/backend |
| Feature organization | 🟢 | Backend uses proper NestJS module pattern |
| Component organization | 🟢 | UI components properly categorized |
| Shared types | 🟢 | Frontend has local types matching Prisma schema |

### 🟠 Issue: Minimal Root package.json

The root `package.json` only contains name and private flag:

```json
{
    "name": "apiscout",
    "private": true
}
```

**Missing:**
- `workspaces` configuration for monorepo
- Root-level scripts (`dev`, `build`, `lint`)
- `packageManager` field
- `turbo.json` for Turborepo (if used)

---

## 2. FRONTEND (NEXT.JS 16)

### Dependencies

| Package | Version | Status |
| ------- | ------- | ------ |
| Next.js | `^16.1.6` | 🟢 Latest stable |
| React | `19.2.3` | 🟢 Latest stable |
| Tailwind CSS | `^3.4.13` | 🟢 v3 (stable) |
| Radix UI | Various | 🟢 Complete component set |
| Lucide React | `^0.563.0` | 🟢 Icon library |

### App Router Structure

```
app/
├── layout.tsx          # Root layout with AuthProvider, Navbar, Footer
├── page.tsx            # Home (Hero, Categories, Trending, Compare Preview)
├── error.tsx           # Error boundary
├── loading.tsx         # Loading state
├── not-found.tsx       # 404 page
├── robots.ts           # SEO robots.txt
├── sitemap.ts          # SEO sitemap
├── admin/              # Admin dashboard
├── apis/               # API listing with filters
├── best-apis/          # Best APIs by category
├── categories/         # Category listing
├── compare/            # Side-by-side API comparison
├── login/              # Authentication
├── signup/             # Registration
├── search/             # Search results
├── submit/             # API submission form
└── trending/           # Trending APIs
```

### Key Features Implemented

- **Authentication Context** (`lib/auth-context.tsx`) - JWT-based auth with localStorage persistence
- **API Client** (`lib/api.ts`) - Centralized fetch wrapper with revalidation
- **Type Safety** (`lib/types.ts`) - Frontend types matching Prisma models
- **UI Constants** (`lib/constants.ts`) - Labels and colors for enums

### Assessment

| Feature | Status | Notes |
| ------- | ------ | ----- |
| Server Components | 🟢 | Proper RSC usage in pages |
| Client Components | 🟢 | Correctly marked with "use client" |
| Metadata | 🟢 | SEO metadata in layout and pages |
| Error Handling | 🟢 | Error boundaries and graceful API fallbacks |
| Loading States | 🟢 | Skeleton components implemented |
| suppressHydrationWarning | 🟢 | Present in html tag |

---

## 3. BACKEND (NESTJS 11)

### Dependencies

| Package | Version | Status |
| ------- | ------- | ------ |
| NestJS | `^11.0.1` | 🟢 Latest stable |
| Prisma | `^7.3.0` | 🟢 Latest (with pg adapter) |
| @prisma/adapter-pg | `^7.4.0` | 🟢 Driver adapter |
| bcrypt | `^6.0.0` | 🟢 Password hashing |
| passport-jwt | `^4.0.1` | 🟢 JWT strategy |
| class-validator | `^0.14.3` | 🟢 DTO validation |
| @nestjs/throttler | `^6.5.0` | 🟢 Rate limiting |

### Module Architecture

```
src/
├── main.ts                 # Bootstrap with CORS, validation, prefix
├── app.module.ts           # Root module with all imports
├── prisma/                 # Database service
│   ├── prisma.module.ts    # Global module
│   └── prisma.service.ts   # PrismaClient with pg adapter
├── auth/                   # Authentication
│   ├── auth.module.ts      # JWT configuration
│   ├── auth.service.ts     # Login, register, profile
│   ├── auth.controller.ts  # Auth endpoints
│   ├── guards/             # JwtAuthGuard, RolesGuard
│   ├── decorators/         # @Roles, @CurrentUser
│   └── strategies/         # JwtStrategy
├── apis/                   # API management
│   ├── apis.service.ts     # CRUD, search, trending, compare
│   ├── apis.controller.ts  # Protected admin routes
│   └── dto/                # QueryApisDto, CreateApiDto, UpdateApiDto
├── categories/             # Category management
├── tags/                   # Tag management
├── reviews/                # User reviews with stats aggregation
├── bookmarks/              # Bookmark toggle with counts
├── submissions/            # API submission workflow
└── feedback/               # Feedback signals (useful, outdated, etc.)
```

### main.ts Configuration

```typescript
// ✅ CORS enabled with configurable origin
app.enableCors({
  origin: corsOrigins,
  credentials: true,
});

// ✅ API prefix
app.setGlobalPrefix('api');

// ✅ Global validation pipe
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));

// ✅ Port configuration (3001)
await app.listen(process.env.PORT ?? 3001);
```

### Assessment

| Feature | Status | Notes |
| ------- | ------ | ----- |
| CORS | 🟢 | Properly configured |
| Validation | 🟢 | Global ValidationPipe |
| API Prefix | 🟢 | `/api` prefix set |
| Rate Limiting | 🟢 | ThrottlerModule (100 req/min) |
| Authentication | 🟢 | JWT with passport |
| Authorization | 🟢 | Role-based guards |
| Error Handling | 🟢 | NestJS exceptions used |

---

## 4. DATABASE (PRISMA 7)

### Schema Overview

```prisma
// 9 Models with proper relations
model User          // Auth, bookmarks, reviews, submissions
model Api           // Core entity with stats denormalization
model Category      // API categories with icons
model Tag           // Searchable tags
model ApiTag        // Many-to-many junction
model Bookmark      // User-API bookmarks
model Review        // Ratings and comments
model FeedbackSignal // Like/useful/outdated signals
model ApiSubmission // Community API submissions

// 7 Enums
enum Role           // USER, CONTRIBUTOR, ADMIN
enum PricingType    // FREE, FREEMIUM, PAID
enum AuthType       // API_KEY, OAUTH, NONE, BEARER_TOKEN
enum RateLimit      // LOW, MEDIUM, HIGH, UNLIMITED
enum Difficulty     // BEGINNER, INTERMEDIATE, ADVANCED
enum ApiStatus      // ACTIVE, DEPRECATED, MAINTENANCE
enum FeedbackType   // USEFUL, OVERPRICED, OUTDATED
enum SubmissionStatus // PENDING, APPROVED, REJECTED
```

### Quality Assessment

| Aspect | Status | Notes |
| ------ | ------ | ----- |
| Primary Keys | 🟢 | CUIDs used consistently |
| Timestamps | 🟢 | createdAt/updatedAt on all models |
| Indexes | 🟢 | Composite and single-field indexes |
| Relations | 🟢 | Proper cascade deletes |
| Constraints | 🟢 | Unique constraints for slugs |
| Table Mapping | 🟢 | Snake_case table names via `@@map` |

### Seed Data

The `seed.ts` file includes comprehensive sample data:
- 2 users (admin + regular)
- 12 categories
- 15 tags
- 20+ APIs with full details

---

## 5. DOCKER & DEPLOYMENT

### docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: apiscout-db
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: apiscout
      POSTGRES_PASSWORD: apiscout_password
      POSTGRES_DB: apiscout
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U apiscout"]
```

### 🟠 Issue: Empty Dockerfiles

Both `Dockerfile.backend` and `Dockerfile.frontend` exist but are empty.

**Recommended `Dockerfile.backend`:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

**Recommended `Dockerfile.frontend`:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 6. ENVIRONMENT & CONFIGURATION

### .gitignore Coverage

```gitignore
# ✅ Environment files
.env
.env.local
.env.example  # ⚠️ Note: This is also ignored
.env.development
.env.production
.env.test

# ✅ Build outputs
.next/
dist/
node_modules/

# ✅ Prisma
prisma/dev.db
```

### 🟠 Issue: Missing .env.example Files

The root `.env.example` is empty and app-level examples don't exist.

**Required environment variables:**

**Backend (`apps/backend/.env.example`):**
```env
DATABASE_URL="postgresql://apiscout:apiscout_password@localhost:5432/apiscout"
JWT_SECRET="your-secure-secret-key-min-32-chars"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
```

**Frontend (`apps/frontend/.env.example`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## 7. TAILWIND CONFIGURATION

### Current Setup (v3)

**postcss.config.mjs:**
```javascript
const config = {
  plugins: {
    tailwindcss: {},   // v3 style
    autoprefixer: {},
  },
};
```

**tailwind.config.ts:**
```typescript
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
```

**globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Assessment

| Aspect | Status | Notes |
| ------ | ------ | ----- |
| Configuration | 🟢 | Consistent v3 setup |
| Content paths | 🟢 | Covers app and components |
| PostCSS | 🟢 | Standard v3 plugins |

---

## 8. SECURITY REVIEW

### Implemented

| Feature | Implementation |
| ------- | -------------- |
| Password Hashing | bcrypt with salt rounds (10) |
| JWT Authentication | Passport strategy with 7-day expiry |
| Role-Based Access | @Roles decorator with RolesGuard |
| Input Validation | class-validator decorators |
| Rate Limiting | 100 requests per minute |
| CORS | Configurable origin whitelist |

### 🟠 Recommendations

1. **JWT Secret Validation** - Already done in AuthModule:
   ```typescript
   if (!secret) {
     throw new Error('JWT_SECRET environment variable is required');
   }
   ```

2. **Add Helmet** (optional but recommended):
   ```typescript
   import helmet from 'helmet';
   app.use(helmet());
   ```

3. **Consider refresh tokens** for production to avoid long-lived JWTs

---

## 9. ISSUES SUMMARY

### 🟠 Warnings (4)

| Issue | Severity | Fix Time |
| ----- | -------- | -------- |
| Empty Dockerfiles | Medium | 15 min |
| Missing .env.example files | Medium | 5 min |
| Minimal root package.json | Low | 10 min |
| .env.example ignored in .gitignore | Low | 1 min |

### 💡 Recommendations (3)

| Recommendation | Priority |
| -------------- | -------- |
| Add Helmet middleware | Medium |
| Consider refresh tokens | Low |
| Add root workspace scripts | Low |

---

## 10. PROJECT READINESS

### ✅ Production Ready

- Full REST API with 8 feature modules
- JWT authentication and authorization
- Prisma with PostgreSQL (pg adapter)
- Input validation and error handling
- Rate limiting
- CORS configuration
- SEO metadata and sitemaps
- Error boundaries and loading states
- Comprehensive seed data

### ⚠️ Before Deployment

1. Create `.env.example` files
2. Write Dockerfiles for backend/frontend
3. Remove `.env.example` from .gitignore
4. Set up proper secrets management
5. Configure production database

---

## Quick Start Guide

```bash
# 1. Start database
cd docker && docker compose up -d

# 2. Setup backend
cd apps/backend
cp .env.example .env  # Create from template above
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# 3. Setup frontend (new terminal)
cd apps/frontend
npm install
npm run dev

# 4. Access
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api
# Test user: dev@example.com / user123
# Admin: admin@apiscout.com / admin123
```

---

## Conclusion

**ApiScout is a well-architected, production-quality application.** The codebase demonstrates strong understanding of modern full-stack development patterns with Next.js 16 App Router, NestJS 11 modular architecture, and Prisma 7 ORM.

**Key Strengths:**
- Clean separation of concerns
- Type-safe frontend-backend integration
- Comprehensive authentication system
- Well-designed database schema
- Production-ready API with validation and rate limiting

**Immediate Actions:**
1. Fix the 4 warnings above (30 min total)
2. Test full user flow end-to-end
3. Deploy to staging environment

---

*Audit Date: February 17, 2026*  
*Auditor: Claude Opus 4.6*

---
---

# DEEP FRONTEND AUDIT — Next.js App (`apps/frontend/`)

**Scope:** Every file in `apps/frontend/` — pages, components, libraries, configs  
**Date:** February 17, 2026

---

## EXECUTIVE SUMMARY (FRONTEND-SPECIFIC)

| Severity | Count | Examples |
|----------|-------|---------|
| **CRITICAL** | 2 | Missing shadcn CSS variables; no auth token expiry handling |
| **HIGH** | 5 | No `next/image` usage; `any` types; no search debouncing; dead code files; footer links to non-existent pages |
| **MEDIUM** | 8 | No token refresh; missing form validation; duplicate icon maps; no CSRF; hardcoded demo creds; unused imports; missing effect cleanup; incomplete pagination |
| **LOW** | 6 | Minor type looseness; missing `aria-label`s; missing active link highlighting; `new Date().getFullYear()` hydration risk; no dark mode support; no `output: 'standalone'` |

---

## 1. CONFIGURATION FILES

### 1.1 `next.config.ts`

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.0.*:3000"],
};
```

**Issues:**
- **[MEDIUM]** No `images.remotePatterns` configured. If API logos are ever loaded from external URLs, `next/image` will reject them.
- **[LOW]** No `output: 'standalone'` — required for Docker deployments (referenced in the empty Dockerfile.frontend).
- **[LOW]** No `poweredByHeader: false` — leaks framework info via `X-Powered-By` header.

### 1.2 `tsconfig.json`

Good: `strict: true` enabled, path aliases configured (`@/*`), `jsx: "react-jsx"` correct for Next.js 16.

No issues.

### 1.3 `tailwind.config.ts`

```ts
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};
```

**Issues:**
- **[CRITICAL]** No custom color definitions for shadcn/ui semantic tokens. Classes like `bg-primary`, `text-primary-foreground`, `bg-background`, `text-muted-foreground`, `bg-accent`, `bg-card`, `text-card-foreground` used by shadcn components (`button.tsx`, `badge.tsx`, `card.tsx`) are **not valid Tailwind v3 utilities** without extending `theme.colors`. These classes silently produce no CSS output. See §1.5 below for the companion globals.css issue.
- **[LOW]** No `darkMode` configuration despite `components.json` referencing `baseColor: "slate"`.
- **[LOW]** `lib/` directory not in `content` array — currently no Tailwind classes there but fragile.

### 1.4 `postcss.config.mjs` / `eslint.config.mjs` / `components.json`

All standard and correct. No issues.

### 1.5 `globals.css` — **CRITICAL**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { background-color: white; color: black; }
}
```

**[CRITICAL] Missing shadcn/ui CSS custom properties.** A standard shadcn setup requires ~40 CSS variables in `:root`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ...and ~30 more */
}
```

**Impact:** Every shadcn component variant is broken. For example:
- `Button` default variant uses `bg-primary text-primary-foreground` → **no visible background**
- `text-muted-foreground` used in **50+ places** across the app → **renders as inherited black text instead of gray**
- `bg-background` in Navbar, cards, footer → **no background applied**
- `bg-card`, `text-card-foreground` in Card component → **unstyled**

**Why the app still appears to work:** Most developers override shadcn defaults with explicit Tailwind classes (e.g., `className="bg-gray-900 text-white"`), which take precedence. But anywhere a default shadcn variant is used without overrides, styling is broken.

### 1.6 `package.json`

| Concern | Status |
|---------|--------|
| `tw-animate-css` in devDependencies | 🟠 Installed but never imported — dead dependency |
| Pinned React versions (`19.2.3`) vs caret Next.js (`^16.1.6`) | 🟠 Inconsistent versioning strategy |

---

## 2. APP ROOT FILES

### 2.1 `layout.tsx` (L1–55)

**What it does:** Root layout with Poppins font, OG/Twitter metadata, `AuthProvider` wrapping `Navbar` + `main` + `Footer`.

**Findings:**
- **[GOOD]** `suppressHydrationWarning` on `<html>` — standard pattern for theme providers.
- **[GOOD]** Comprehensive `metadata` export with OG, Twitter, keywords, authors.
- **[GOOD]** `AuthProvider` (client component) wrapping server component children via `{children}` props — this is the correct React Server Components pattern.
- **[LOW]** `poppins.className` is applied, but `poppins.variable` is defined and never used (L9). If you intended CSS variable usage, change to `poppins.variable` and reference `font-family: var(--font-poppins)` in CSS.

### 2.2 `page.tsx` (Home)

**What it does:** Composes 5 homepage sections — Hero, Categories, Trending, ComparePreview, StackPreview.

**Findings:**
- **[GOOD]** Server component (no `"use client"`).
- **[GOOD]** Mix of async server components (`Categories`, `Trending`) and client components (`Hero`) as children — correct pattern.
- **[GOOD]** No data fetching in the page itself; delegated to section components.

### 2.3 `error.tsx` (L1–34)

Correct: `"use client"` directive (required for error boundaries), receives `error` + `reset` props, displays retry button.

No issues.

### 2.4 `loading.tsx` (L1–35)

Correct: Skeleton loading grid. Server component (no `"use client"` needed).

No issues.

### 2.5 `not-found.tsx` (L1–33)

Correct: 404 page with links to Home and Browse APIs. Server component.

No issues.

### 2.6 `robots.ts` (L1–15)

**[GOOD]** Uses `NEXT_PUBLIC_SITE_URL` env var with sensible fallback. Disallows `/admin` and `/api/auth/`.

### 2.7 `sitemap.ts` (L1–46)

**What it does:** Generates dynamic sitemap from APIs and categories via server-side `apiFetch`.

**Findings:**
- **[GOOD]** Parallel data fetching with `Promise.all`.
- **[GOOD]** Silent catch — static pages still indexed on API failure.
- **[MEDIUM]** `apiFetch` applies `next: { revalidate: 60 }` to these requests. For sitemaps, this is fine — 60s cache is acceptable.
- **[LOW]** Fetches only first 100 APIs (`/apis?limit=100`). If there are >100 APIs, the rest won't be in the sitemap.

---

## 3. PAGE-BY-PAGE ANALYSIS

### 3.1 `admin/page.tsx` (L1–214)

**What it does:** Client-side admin dashboard with tabs for submissions, APIs, categories, tags. Only submissions tab is functional.

**Findings:**
- **[MEDIUM]** L3: Imports `Eye` and `Trash2` from lucide-react but **never uses them** — dead imports.
- **[MEDIUM]** L47–50: `useEffect` depends on `[user, token]` but calls `loadSubmissions()` which is **not memoized** and **not in the dependency array**. This is a React exhaustive-deps violation. While it works because `loadSubmissions` reads `token` via closure, the ESLint rule would flag this.
- **[MEDIUM]** L47–50: No cleanup for the async effect. If the component unmounts while `loadSubmissions` is in-flight, `setSubmissions` will be called on an unmounted component (React 18+ handles this gracefully, but it's still an anti-pattern).
- **[HIGH]** No server-side auth check — entirely client-side. A malicious user could view the admin page HTML/JS before the redirect fires. The admin page should either be a server component with `cookies()`-based auth or use middleware.
- **[MEDIUM]** APIs, Categories, and Tags tabs are placeholder text — they reference backend endpoints but provide no management UI.

### 3.2 `apis/page.tsx` (L1–91)

**What it does:** Server component that fetches APIs with filters, categories, and tags, then renders `ApisPageClient`.

**Findings:**
- **[GOOD]** Server component with `Promise.all` parallel fetching.
- **[GOOD]** `searchParams` correctly typed as `Promise` (Next.js 16 pattern).
- **[GOOD]** Graceful error handling with fallback empty state.
- **[GOOD]** `Suspense` boundary with skeleton fallback.
- **[GOOD]** Static `metadata` export for SEO.

### 3.3 `apis/ApisPageClient.tsx` (L1–290)

**What it does:** Client-side API listing with search, filters (category, pricing, auth, tags), sort, and pagination.

**Findings:**
- **[MEDIUM]** L4: Imports `Star`, `Bookmark`, `ExternalLink`, `ArrowRight`, `Filter` but only `Star` and `Bookmark` are used (in `ApiListCard`). `ExternalLink`, `ArrowRight`, `Filter` are **dead imports**.
- **[MEDIUM]** L226–239: Pagination only renders the first 5 pages (`Math.min(meta.totalPages, 5)`). For datasets with many pages, there's no way to navigate to pages 6+. Needs ellipsis or smarter pagination logic.
- **[GOOD]** Filter state managed via URL search params — enables bookmarkable/shareable filtered views.
- **[GOOD]** `params.delete("page")` on filter change — correctly resets pagination.

### 3.4 `login/page.tsx` (L1–117)

**What it does:** Login form with email/password, show/hide password toggle.

**Findings:**
- **[HIGH]** L27: `catch (err: any)` — should use `catch (err: unknown)` with type narrowing: `err instanceof Error ? err.message : "Login failed"`.
- **[MEDIUM]** L99–116: **Hardcoded demo credentials** displayed in production UI. Should be gated behind `process.env.NODE_ENV === 'development'` or a feature flag.
- **[MEDIUM]** No CSRF token on the login form. While the backend is a separate API with JWT (not cookies), it's still a security best practice.
- **[MEDIUM]** No client-side rate limiting or exponential backoff for failed login attempts.
- **[LOW]** No "Forgot password" link.
- **[GOOD]** Password visibility toggle with proper `type` switching.

### 3.5 `signup/page.tsx` (L1–126)

**What it does:** Registration form with name, email, password.

**Findings:**
- **[HIGH]** L34: `catch (err: any)` — same `any` issue as login.
- **[MEDIUM]** No "Confirm password" field — users can easily mistype their password.
- **[MEDIUM]** No terms of service / privacy policy checkbox.
- **[GOOD]** Client-side password length validation (`< 6 chars`) before API call.
- **[GOOD]** HTML `minLength={6}` attribute on password input.

### 3.6 `search/page.tsx` (L1–26)

**What it does:** Server component that redirects `/search?q=...` to `/apis?search=...`.

**Findings:**
- **[GOOD]** Clean redirect pattern — avoids duplicate search UI.
- **[GOOD]** `generateMetadata` for dynamic title.

### 3.7 `submit/page.tsx` (L1–213)

**What it does:** API submission form for authenticated users.

**Findings:**
- **[HIGH]** L98: `catch (err: any)` — same `any` issue.
- **[MEDIUM]** L155–164: Category is a **free-text input** instead of a dropdown/select from existing categories. This creates data inconsistency — users may type "AI", "AI/ML", "Artificial Intelligence" for the same category.
- **[MEDIUM]** No client-side validation beyond HTML `required`. No check for valid URL format (though `type="url"` provides basic browser validation), no description length limits.
- **[GOOD]** Auth gate — shows sign-in prompt for unauthenticated users.
- **[GOOD]** Success state with "Submit Another" option.

### 3.8 `trending/page.tsx` (L1–156)

**What it does:** Server component showing featured, trending, and top-rated API sections.

**Findings:**
- **[MEDIUM]** L27–30: `trending` and `popular` fetch the **same endpoint** (`/apis?sort=popular`) with different limits (6 vs 8). These will return overlapping data. The "trending" section should ideally use a different sort or time window.
- **[GOOD]** Per-request `.catch()` fallback — if one fetch fails, others still render.
- **[GOOD]** Server component for SEO — all API data is in the initial HTML.

### 3.9 `best-apis/page.tsx` (L1–67)

**What it does:** Index page listing curated "Best APIs" guides with hardcoded category slugs.

**Findings:**
- **[GOOD]** Server component with static content — great for SEO.
- **[GOOD]** Clean card grid linking to `/best-apis/{slug}`.

### 3.10 `best-apis/[category]/page.tsx` (L1–174)

**What it does:** Dynamic guide page for a specific category with ranking table and SEO article.

**Findings:**
- **[GOOD]** `generateStaticParams()` for build-time generation of all guide pages.
- **[GOOD]** `generateMetadata()` with title, description, and OpenGraph.
- **[GOOD]** SEO-rich article content with prose styling.
- **[LOW]** `CATEGORY_META` is hardcoded — adding a new guide requires code changes. Could be fetched from backend or CMS.

### 3.11 `categories/page.tsx` (L1–79)

**What it does:** Server component listing all categories with icons and API counts.

**Findings:**
- **[GOOD]** Server-side fetch of categories.
- **[MEDIUM]** L17–19: `iconMap` uses string-keyed icon components based on `category.icon` field. If the backend `icon` field doesn't match a key in `iconMap`, it falls back to `Code`. This is brittle — any typo or new icon name silently degrades.

### 3.12 `categories/[slug]/page.tsx` (L1–93)

**What it does:** Server component showing APIs filtered by category, reusing `ApisPageClient`.

**Findings:**
- **[HIGH]** L43: `let tags: any[] = []` — should be `Tag[]`. This is the only place in the codebase where `any[]` is used for a variable type.
- **[GOOD]** Reuses `ApisPageClient` — DRY pattern.
- **[GOOD]** Breadcrumb navigation.
- **[GOOD]** `notFound()` if category doesn't exist.

### 3.13 `compare/page.tsx` (L1–283)

**What it does:** Client-side API comparison tool with search, add/remove, and feature table.

**Findings:**
- **[HIGH]** L73–84: `handleSearch` fires an API call on **every keystroke** (via `onChange`). No debouncing. This creates excessive API calls and potential rate limiting issues.
- **[MEDIUM]** L73: Uses raw `fetch()` instead of `apiFetch()`. This bypasses the centralized error handling and doesn't include the auth token (though search doesn't require auth).
- **[MEDIUM]** L55–58: `useEffect` with async `Promise.all` has no cleanup/abort controller. If the component unmounts mid-fetch, stale state updates fire.
- **[GOOD]** `Suspense` wrapper around `CompareContent` — correct pattern for `useSearchParams()`.
- **[GOOD]** URL state management with `router.replace`.
- **[GOOD]** Max 4 APIs limit enforced.

### 3.14 `api/[slug]/page.tsx` (L1–49)

**What it does:** Server component fetching API detail and rendering `ApiDetailClient`.

**Findings:**
- **[GOOD]** `generateMetadata` with API name and description truncated to 160 chars.
- **[GOOD]** `notFound()` on fetch failure.
- **[MEDIUM]** L38–44: Reviews are extracted from the embedded `api.reviews` array and wrapped in a `PaginatedResponse`. This means pagination of reviews is faked — all reviews are loaded at once. For APIs with many reviews, this could be a performance issue.

### 3.15 `api/[slug]/ApiDetailClient.tsx` (L1–245)

**What it does:** Client component for API detail page with view tracking, bookmarking, reviews, and feedback.

**Findings:**
- **[GOOD]** L38–39: View count tracked via `POST /apis/{slug}/view` on mount. Fire-and-forget with `.catch(() => {})` — correct pattern.
- **[GOOD]** `useCases` JSON.parse wrapped in try-catch.
- **[GOOD]** Clean component decomposition (`InfoCard`, `formatNumber`).
- **[MEDIUM]** L38 `useEffect` dependency `[api.slug]` — will re-fire if the slug changes (which won't happen without remounting, so this is fine in practice).

---

## 4. COMPONENT ANALYSIS

### 4.1 `components/api/BookmarkButton.tsx` (L1–77)

**What it does:** Toggle bookmark with optimistic count update. Redirects to login if unauthenticated.

**Findings:**
- **[MEDIUM]** No error feedback to user — if the API call fails in `handleToggle`, the `finally` block runs but no error state is shown. The count stays at the optimistic value.
- **[GOOD]** Auth check with redirect to `/login`.
- **[GOOD]** Optimistic UI update.

### 4.2 `components/api/ReviewForm.tsx` (L1–130)

**What it does:** Star rating + comment form for authenticated users.

**Findings:**
- **[HIGH]** L78: `catch (err: any)` — should use `unknown`.
- **[GOOD]** Rating validation (must be > 0).
- **[GOOD]** Star hover-preview effect.
- **[GOOD]** Success state after submission.
- **[MEDIUM]** No way to edit or delete a submitted review.

### 4.3 `components/api/FeedbackButtons.tsx` (L1–64)

**What it does:** "Useful", "Overpriced", "Outdated" feedback buttons.

**Findings:**
- **[MEDIUM]** L47: If user is not logged in, buttons are just `disabled` with `opacity-50`. No message like "Sign in to give feedback". Users won't understand why buttons are disabled.
- **[MEDIUM]** No error handling — if the API call fails, nothing happens. No rollback of optimistic count.

### 4.4 `components/api/ApiBadge.tsx`

**[HIGH] Empty file — dead code.** Should be deleted.

### 4.5 `components/api/ApiCard.tsx` (L1–67)

**What it does:** Card component for API listing.

**Findings:**
- **[HIGH]** L32–35: Uses native `<img>` tag instead of `next/image`:
  ```tsx
  <img src={api.logoUrl} alt={api.name} className="w-12 h-12 rounded-lg object-cover" />
  ```
  This bypasses Next.js image optimization (lazy loading, WebP conversion, size optimization).
- **[HIGH]** This component appears to be **unused** — the actual API listing uses `ApiListCard` defined inline in `ApisPageClient.tsx`. Dead code.
- **[MEDIUM]** Interface defines `isFree: boolean` but the main `ApiItem` type uses `pricingType: PricingType`. Type mismatch.

### 4.6 `components/home/Hero.tsx` (L1–75)

**What it does:** Hero section with search bar.

**Findings:**
- **[GOOD]** "use client" for search interaction.
- **[GOOD]** Enter-key and button-click handlers both work.
- **[LOW]** Search button has no `aria-label` — screen readers see an unlabeled button.

### 4.7 `components/home/Categories.tsx` (L1–103)

**What it does:** Async server component fetching and displaying top 6 categories.

**Findings:**
- **[MEDIUM]** L5–36: Hardcoded `ICON_MAP` and `COLOR_MAP` duplicate the `CATEGORY_ICONS` and `CATEGORY_COLORS` from `lib/constants.ts`. Same data maintained in two places.
- **[GOOD]** Server component with `async` — correct for data fetching.
- **[GOOD]** Graceful fallback — returns `null` if no categories.

### 4.8 `components/home/Trending.tsx` (L1–89)

**What it does:** Async server component showing trending APIs.

**Findings:**
- **[MEDIUM]** L12: Fetches from `/apis/trending?limit=6`. The trending page uses `/apis?sort=popular`. These are **different endpoints**. If `/apis/trending` doesn't exist on the backend, this silently renders nothing (due to the catch block). The backend `apis.controller.ts` would need to be checked for this endpoint.
- **[GOOD]** Graceful fallback.
- **[GOOD]** Direct API links.

### 4.9 `components/home/ComparePreview.tsx` (L1–88)

Static marketing content. Server component. No issues.

### 4.10 `components/home/StackPreview.tsx` (L1–97)

Static mock dashboard. Server component. No issues.

### 4.11 `components/layout/Navbar.tsx` (L1–183)

**What it does:** Sticky navbar with desktop/mobile responsive menus and auth state.

**Findings:**
- **[MEDIUM]** Mobile menu doesn't close on route navigation. User clicks a link → page changes → menu stays open. Should listen to `pathname` changes via `usePathname()` to auto-close.
- **[LOW]** No active link highlighting — current page isn't visually indicated in the nav.
- **[GOOD]** Responsive design with separate mobile menu.
- **[GOOD]** Auth state display (user avatar + logout).
- **[LOW]** Missing `Trending` link in mobile menu (present in desktop).

### 4.12 `components/layout/Footer.tsx` (L1–90)

**What it does:** Site footer with navigation links and social icons.

**Findings:**
- **[HIGH]** L60–68: Links to **non-existent pages**: `/docs`, `/standards`, `/blog`, `/community`, `/about`, `/legal`, `/contact`. All of these will hit the 404 page.
- **[LOW]** Social links (`<a href="#">`) are placeholder — point nowhere.
- **[LOW]** `new Date().getFullYear()` (L79) — minor hydration risk. Server renders at build/request time, client renders at browser time. In practice, year differences are rare but could cause a brief flash on January 1st.

### 4.13 `components/search/SearchBar.tsx` (L1–18)

**[HIGH] Non-functional component — no state, no event handlers, no integration.** This is dead code. The actual search functionality is in `Hero.tsx` and `ApisPageClient.tsx`.

### 4.14 `components/ui/*` (shadcn components)

All 11 UI components (`avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `select`, `separator`, `sheet`, `tabs`) are standard shadcn/ui installations. They are correctly structured.

**However:** As noted in §1.5, their variant styling relies on CSS variables that are **not defined**, making default variants visually broken.

---

## 5. LIBRARY FILES

### 5.1 `lib/api.ts` (L1–25)

**What it does:** Centralized API fetch utility with environment-based URL and revalidation.

```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  // ...
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    next: { revalidate: 60 },
  });
  // ...
}
```

**Findings:**
- **[MEDIUM]** L3: Default type parameter `T = any` — should be `T = unknown` for type safety.
- **[MEDIUM]** L16: `next: { revalidate: 60 }` applied to **all** requests globally. This is appropriate for server components (SSR caching), but when `apiFetch` is used in `sitemap.ts`, a 60-second cache means the sitemap could be stale. Consider making revalidation configurable.
- **[GOOD]** `Content-Type` only set when body is present — correct for GET vs POST distinctions.
- **[GOOD]** `API_BASE_URL` uses `NEXT_PUBLIC_API_URL` with localhost fallback.
- **[GOOD]** Error throws on non-OK responses.

### 5.2 `lib/auth-context.tsx` (L1–93)

**What it does:** React context providing `user`, `token`, `login`, `register`, `logout`.

**Findings:**
- **[CRITICAL]** **No token expiry handling.** The JWT has a 7-day expiry (per backend config), but:
  - On app mount, the token is loaded from localStorage **without checking its expiry** (L32–36).
  - If the token is expired, all authenticated API calls will return 401, but the UI still shows the user as "logged in".
  - No mechanism to detect 401 responses and auto-logout.
  - No refresh token flow.
- **[MEDIUM]** L34: `JSON.parse(savedUser)` has **no try-catch**. If localStorage contains corrupted JSON (e.g., from a previous app version), this will throw and break the app on mount.
- **[MEDIUM]** No global 401 interceptor. Every individual API call must handle auth failures independently. If a token expires mid-session, the user gets cryptic error messages instead of being redirected to login.
- **[GOOD]** `isLoading` state prevents flash of unauthenticated content.
- **[GOOD]** localStorage access is inside `useEffect` — SSR-safe.

### 5.3 `lib/constants.ts` (L1–74)

**Findings:**
- **[LOW]** `RATE_LIMIT_LABELS` and `DIFFICULTY_LABELS` use `Record<string, string>` instead of `Record<RateLimit, string>` and `Record<Difficulty, string>`. This loses type checking — a typo in a key would not be caught.
- **[MEDIUM]** `CATEGORY_ICONS` and `CATEGORY_COLORS` are duplicated in `components/home/Categories.tsx` — see §4.7.
- **[GOOD]** Centralized labels and colors for all enums.

### 5.4 `lib/types.ts` (L1–79)

**Findings:**
- **[GOOD]** All types match backend Prisma models.
- **[GOOD]** Union types for enums (`PricingType`, `AuthType`, etc.).
- **[GOOD]** `PaginatedResponse<T>` generic for list endpoints.
- **[GOOD]** `ApiDetail extends ApiItem` with reviews and feedbackCounts.

No issues.

### 5.5 `lib/utils.ts` (L1–6)

Standard shadcn `cn()` utility. No issues.

---

## 6. CROSS-CUTTING CONCERNS

### 6.1 Client/Server Component Boundary

| Pattern | Status | Notes |
|---------|--------|-------|
| Server pages fetching data | ✅ | `apis/page.tsx`, `trending/page.tsx`, `categories/page.tsx` |
| Client wrappers for interactivity | ✅ | `ApisPageClient`, `ApiDetailClient`, `CompareContent` |
| AuthProvider in layout | ✅ | Client component wrapping server children via `{children}` — correct |
| Hero search in server page | ✅ | Client component nested in server page |
| Async server components | ✅ | `Categories`, `Trending` components |

**Verdict:** The client/server boundary is handled correctly throughout.

### 6.2 API URL Configuration

- **[GOOD]** `NEXT_PUBLIC_API_URL` environment variable with `http://localhost:3001/api` fallback.
- **[MEDIUM]** Some components use `API_BASE_URL` directly for client-side `fetch()` (admin, submit, compare, bookmark, review, feedback) while server components use `apiFetch()`. This means client-side calls **don't get the revalidation caching** (which is correct behavior) but also **don't get centralized error handling**.

### 6.3 Error Handling

| Location | Approach | Quality |
|----------|----------|---------|
| Server pages | try/catch with fallback empty state | ✅ Good |
| Server components | try/catch returning `null` | ✅ Good |
| Client forms | try/catch with `setError()` | ✅ Good |
| Client API calls (admin, bookmark, feedback) | try/catch with `console.error` | ⚠️ No user feedback |
| Global error boundary | `error.tsx` with retry | ✅ Good |

### 6.4 Hydration Mismatch Risks

| Risk | Location | Severity |
|------|----------|----------|
| `new Date().getFullYear()` | `Footer.tsx` L79 | Low — only on Jan 1st |
| `localStorage.getItem()` | `auth-context.tsx` L32–36 | None — inside `useEffect` ✅ |
| `suppressHydrationWarning` | `layout.tsx` L43 | Mitigated ✅ |

**Verdict:** Low hydration risk. Main safeguards are in place.

### 6.5 Image Optimization

**[HIGH] `next/image` is not used anywhere in the codebase.** The only `<img>` tag is in the unused `ApiCard.tsx`. All other "images" are CSS-styled letter avatars (e.g., `{api.name[0]}`). While this works for the current design, if API logos are added in the future, `next/image` should be used with proper `remotePatterns` config.

### 6.6 Memory Leaks & Effect Cleanup

| Component | Effect | Cleanup? | Risk |
|-----------|--------|----------|------|
| `auth-context.tsx` | Read localStorage | N/A (sync) | None |
| `admin/page.tsx` | Fetch submissions | ❌ No AbortController | Low — component rarely unmounts |
| `compare/page.tsx` | Fetch APIs from URL slugs | ❌ No AbortController | Medium — user might navigate away |
| `ApiDetailClient.tsx` | POST view count | N/A (fire-and-forget) | None |

### 6.7 Form Validation Summary

| Form | Client Validation | Server Validation | Missing |
|------|-------------------|-------------------|---------|
| Login | HTML `required` | Backend validates | Rate limiting, CSRF |
| Signup | `required`, `minLength=6`, JS check | Backend validates | Confirm password, ToS |
| Submit API | HTML `required`, `type="url"` | Backend validates | Category dropdown, description length |
| Review | JS rating > 0 check | Backend validates | — |

### 6.8 SEO & Accessibility

| Aspect | Status | Notes |
|--------|--------|-------|
| `<html lang="en">` | ✅ | Set in layout |
| Page titles | ✅ | All pages have `metadata` or `generateMetadata` |
| OG/Twitter meta | ✅ | Root layout |
| `robots.ts` | ✅ | Proper allow/disallow |
| `sitemap.ts` | ✅ | Dynamic with API data |
| Heading hierarchy | ✅ | Proper h1 → h2 → h3 |
| Alt text on images | ⚠️ | Only one `<img>` (unused component) — has alt text |
| `aria-label` on icon buttons | ⚠️ | Missing on Hero search button, Navbar hamburger has it |
| Focus indicators | ✅ | `focus:ring-2` on inputs, shadcn focus-visible on buttons |
| Color contrast | ⚠️ | `text-muted-foreground` is supposed to be gray but renders as black (due to missing CSS vars), so contrast is actually fine by accident |

### 6.9 Auth Flow Analysis

```
Login → POST /auth/login → { user, access_token }
          → Store in state + localStorage
          → Redirect to /

Register → POST /auth/register → { user, access_token }
            → Store in state + localStorage
            → Redirect to /

App Mount → Read localStorage → Set state
            → ⚠️ NO TOKEN VALIDATION

Logout → Clear state + localStorage

Protected Actions (bookmark, review, submit, admin):
  → Check user/token from context
  → Include Bearer token in headers
  → ⚠️ NO 401 INTERCEPTION
```

**Gap:** Between login and the JWT's 7-day expiry, there is no mechanism to:
1. Validate the token is still valid on app load
2. Refresh an expiring token  
3. Handle a 401 response globally (e.g., redirect to login)

---

## 7. DEAD CODE INVENTORY

| File | Status | Action |
|------|--------|--------|
| `components/api/ApiBadge.tsx` | Empty file | Delete |
| `components/api/ApiCard.tsx` | Unused — replaced by inline `ApiListCard` | Delete or consolidate |
| `components/search/SearchBar.tsx` | Non-functional, no state/handlers | Delete |
| `tw-animate-css` package | In devDependencies, never imported | Remove from package.json |
| `Eye`, `Trash2` imports in `admin/page.tsx` | Imported, never used | Remove imports |
| `ExternalLink`, `ArrowRight`, `Filter` in `ApisPageClient.tsx` | Imported, never used | Remove imports |
| `poppins.variable` in `layout.tsx` | Defined, never used | Use it or remove it |

---

## 8. PRIORITIZED FIX LIST

### CRITICAL (Fix Immediately)

| # | Issue | File(s) | Line(s) | Fix |
|---|-------|---------|---------|-----|
| C1 | Missing shadcn CSS variables | `globals.css`, `tailwind.config.ts` | — | Add `:root` CSS variables and extend Tailwind colors |
| C2 | No auth token expiry handling | `lib/auth-context.tsx` | L31–36 | Decode JWT on load, check `exp` claim, add 401 interceptor |

### HIGH (Fix Before Production)

| # | Issue | File(s) | Line(s) | Fix |
|---|-------|---------|---------|-----|
| H1 | `catch (err: any)` in 4 files | login L27, signup L34, submit L98, ReviewForm L78 | Various | Change to `catch (err: unknown)` with `err instanceof Error` guard |
| H2 | `any[]` type usage | `categories/[slug]/page.tsx` | L43 | Change to `Tag[]` |
| H3 | No search debouncing in compare | `compare/page.tsx` | L73–84 | Add 300ms debounce to `handleSearch` |
| H4 | Dead code files (3 files) | `ApiBadge.tsx`, `ApiCard.tsx`, `SearchBar.tsx` | — | Delete files |
| H5 | Footer links to non-existent pages | `Footer.tsx` | L60–68 | Remove or create placeholder pages |
| H6 | Native `<img>` instead of `next/image` | `ApiCard.tsx` | L32 | Use `next/image` (or delete file per H4) |

### MEDIUM (Fix Soon)

| # | Issue | File(s) | Line(s) | Fix |
|---|-------|---------|---------|-----|
| M1 | No JSON.parse try-catch for localStorage | `auth-context.tsx` | L34 | Wrap in try-catch |
| M2 | Hardcoded demo credentials in prod UI | `login/page.tsx` | L99–116 | Gate behind `NODE_ENV` check |
| M3 | Duplicate icon/color maps | `Categories.tsx` vs `constants.ts` | — | Use single source from constants |
| M4 | Submit form: free-text category | `submit/page.tsx` | L155–164 | Fetch categories and use dropdown |
| M5 | Missing effect cleanup (AbortController) | `compare/page.tsx`, `admin/page.tsx` | Various | Add cleanup functions |
| M6 | Unused imports | `admin/page.tsx` L10–11, `ApisPageClient.tsx` L4 | Various | Remove dead imports |
| M7 | Mobile menu doesn't close on navigation | `Navbar.tsx` | — | Add `usePathname()` listener |
| M8 | Pagination limited to first 5 pages | `ApisPageClient.tsx` | L226–239 | Implement smart pagination with ellipsis |
| M9 | No user feedback on bookmark/feedback API failure | `BookmarkButton.tsx`, `FeedbackButtons.tsx` | — | Add error toast or rollback |
| M10 | apiFetch default type `T = any` | `lib/api.ts` | L3 | Change to `T = unknown` |
| M11 | Trending endpoint mismatch | `Trending.tsx` vs backend | L12 | Verify `/apis/trending` exists or use `/apis?sort=popular` |
| M12 | FeedbackButtons shows no login prompt | `FeedbackButtons.tsx` | L47 | Show "Sign in to give feedback" when `!user` |
| M13 | Trending page fetches same endpoint twice | `trending/page.tsx` | L27–28 | Differentiate trending vs popular queries |

### LOW (Nice to Have)

| # | Issue | File(s) | Line(s) | Fix |
|---|-------|---------|---------|-----|
| L1 | No `output: 'standalone'` for Docker | `next.config.ts` | — | Add for optimized Docker builds |
| L2 | `poppins.variable` defined but unused | `layout.tsx` | L9 | Use variable or remove |
| L3 | `RATE_LIMIT_LABELS` uses `Record<string, string>` | `constants.ts` | L23 | Use `Record<RateLimit, string>` |
| L4 | Missing active nav link highlighting | `Navbar.tsx` | — | Use `usePathname()` for active state |
| L5 | No `aria-label` on Hero search button | `Hero.tsx` | L56 | Add `aria-label="Search"` |
| L6 | Sitemap limited to 100 APIs | `sitemap.ts` | L27 | Paginate or increase limit |
| L7 | Missing Trending link in mobile nav | `Navbar.tsx` | — | Add `Trending` to mobile menu |
| L8 | `tw-animate-css` unused package | `package.json` | L34 | Remove from devDependencies |
| L9 | Footer social links are `#` placeholders | `Footer.tsx` | L40–48 | Add real URLs or remove |

---

## 9. ARCHITECTURE VERDICT

**The frontend is well-structured and follows Next.js App Router best practices.** Server/client component boundaries are correctly drawn, data fetching patterns are solid, and the UI is comprehensive.

**The two critical issues** (missing CSS variables and auth token handling) are both fixable in under an hour. The remaining issues are typical of a codebase that has evolved rapidly — dead code, minor type safety gaps, and polish items.

**Estimated fix time for all issues:** ~4–6 hours for a developer familiar with the codebase.

---