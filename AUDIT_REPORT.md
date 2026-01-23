# ApiScout Repository Audit Report

**Date:** January 23, 2026  
**Auditor:** Claude Opus 4.5 (Senior Staff Engineer)  
**Project:** ApiScout - API Discovery Platform  
**Stack:** Next.js (App Router), NestJS, Prisma, PostgreSQL, Tailwind CSS

---

## Executive Summary

The project has **solid architectural decisions** (monorepo, clean separation, good Prisma schema) but is built on **bleeding-edge dependencies** (React 19, Tailwind v4, Next.js 15.3) that introduce unnecessary risk for a production SaaS.

| Category | Health |
|----------|--------|
| Project Structure | 🟠 Needs attention |
| Dependencies | 🔴 Critical issues |
| Tailwind/Styling | 🔴 Critical issues |
| Next.js/React | 🟠 Minor issues |
| Backend (NestJS) | 🟠 Incomplete |
| Environment/Config | 🔴 Security risks |
| Build/Deployment | 🟠 Needs setup |

---

## 1. PROJECT STRUCTURE & MONOREPO HEALTH

### Current Structure

```
ApiScout/
├── apps/
│   ├── frontend/     # Next.js app
│   └── backend/      # NestJS app
├── packages/
│   ├── config/       # ❌ Empty
│   └── shared-types/ # ❌ Empty
├── docker/           # ❌ Empty docker-compose.yml
├── package.json      # Root workspace config
└── turbo.json        # Turborepo config
```

### Findings

| Issue | Severity | Details |
|-------|----------|---------|
| **Empty shared packages** | 🟠 Warning | `packages/config/` and `packages/shared-types/` exist but are empty. These are declared in workspace but have no `package.json`, which will cause workspace resolution failures. |
| **Missing workspace package.json files** | 🔴 Critical | The packages under `packages/` lack `package.json` files. Running `npm install` from root will fail to recognize them as valid workspaces. |
| **Docker config incomplete** | 🟠 Warning | `docker/docker-compose.yml` is empty (only contains `services: {}`). No PostgreSQL service defined despite Prisma requiring it. |
| **No root tsconfig.json** | 🟠 Warning | No shared TypeScript configuration at root level for consistent compiler options across apps. |
| **Clean frontend/backend separation** | 🟢 Safe | The apps are properly isolated in separate directories. |

### Misplaced Config Files

- ✅ `components.json` correctly placed in `apps/frontend/` for shadcn/ui
- ✅ ESLint configs are per-app (acceptable pattern)
- ✅ No config file pollution at root level

---

## 2. DEPENDENCY & VERSION COMPATIBILITY CHECK

### Root package.json Analysis

```json
{
  "packageManager": "npm@10.9.2",
  "workspaces": ["apps/*", "packages/*"]
}
```

**Issue:** Workspaces declared but `packages/*` directories lack valid `package.json` files.

### Frontend Dependencies

| Package | Version | Status |
|---------|---------|--------|
| Next.js | `15.3.2` | 🟠 Very recent - bleeding edge |
| React | `^19.0.0` | 🔴 **React 19 RC** - not yet stable for production |
| Tailwind CSS | `^4.1.7` | 🔴 **Tailwind v4** - major breaking changes from v3 |
| PostCSS | `^8.5.4` | 🟢 Safe |
| lucide-react | `^0.511.0` | 🟢 Safe |
| class-variance-authority | `^0.7.1` | 🟢 Safe |
| clsx | `^2.1.1` | 🟢 Safe |
| tailwind-merge | `^3.3.0` | 🟢 Safe |

### Backend Dependencies

| Package | Version | Status |
|---------|---------|--------|
| NestJS Core | `^11.0.1` | 🟢 Latest stable |
| NestJS Common | `^11.0.1` | 🟢 Safe |
| Prisma | `^6.8.2` | 🟠 Prisma 6.x is recent - verify preview features |
| @prisma/client | `^6.8.2` | 🟢 Matches CLI version |
| reflect-metadata | `^0.2.2` | 🟢 Safe |
| rxjs | `^7.8.1` | 🟢 Safe |
| TypeScript | `^5.7.3` | 🟢 Safe |

**Backend is significantly more stable than frontend.**

### Critical Compatibility Concerns

#### 🔴 React 19 + Next.js 15 Combination

React 19 is still in release candidate status. Combined with Next.js 15.3.2, this is an aggressive bleeding-edge setup that may have:
- Undocumented bugs
- Breaking changes in minor versions
- Limited community support for troubleshooting

#### 🔴 Tailwind CSS v4 Breaking Changes

Tailwind v4 is a complete rewrite with:
- New configuration syntax (CSS-based, not JS)
- Different plugin architecture
- Changed class names and utilities

#### 🟠 shadcn/ui Compatibility

shadcn/ui components are designed for Tailwind v3. The v4 migration may break component styling.

---

## 3. TAILWIND & STYLING PIPELINE VALIDATION

### Configuration Files Status

#### tailwind.config.ts (v3 Syntax)

```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // ❌ No pages/ in App Router
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",      // ❌ No src/ directory exists
],
```

#### postcss.config.mjs (v4 Plugin)

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},  // v4 plugin
  },
};
```

#### globals.css (v4 Syntax)

```css
@import "tailwindcss";          // v4 import

:root {
  --background: oklch(1 0 0);   // v4 OKLCH colors
}

@theme inline {                  // v4 @theme directive
  /* ... */
}
```

### 🔴 Critical Tailwind Assessment

The project has a **hybrid v3/v4 configuration** that is fundamentally broken:

| File | Version Pattern |
|------|-----------------|
| `tailwind.config.ts` | v3 (JS config with `theme.extend`) |
| `postcss.config.mjs` | v4 (`@tailwindcss/postcss`) |
| `globals.css` | v4 (`@import`, `@theme inline`, OKLCH) |

**This will cause silent CSS failures.** Tailwind v4 ignores `tailwind.config.ts` by default and expects CSS-based configuration.

---

## 4. NEXT.JS APP ROUTER & REACT USAGE

### App Router Structure

```
apps/frontend/app/
├── layout.tsx       ✅ Root layout
├── page.tsx         ✅ Home page
├── globals.css      ✅ Global styles
├── fonts/           ✅ Local fonts (Geist)
├── apis/[slug]/     ✅ Dynamic route
├── bookmarks/       ✅ Static route
├── categories/      ✅ Static route
├── compare/         ✅ Static route
└── search/          ✅ Static route
```

**Structure is correct for App Router.**

### Layout Issues

| Issue | Severity | Details |
|-------|----------|---------|
| No `suppressHydrationWarning` on `<html>` | 🟠 Warning | Will cause hydration errors if dark mode or browser extensions modify the DOM |
| Navbar included in root layout | 🟠 Warning | Cannot have pages without navbar (e.g., auth pages, error pages) |
| No loading.tsx or error.tsx | 🟠 Warning | Missing error boundaries and loading states |

### Client/Server Component Analysis

- ✅ `Navbar.tsx` - Correctly marked as client component
- ⚠️ `ApiCard.tsx` - Uses interactive elements but not marked as client component (will break when handlers added)
- ✅ Page components are Server Components by default

---

## 5. BACKEND (NESTJS + PRISMA) HEALTH CHECK

### NestJS Project Structure

```
apps/backend/src/
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── app.controller.spec.ts
└── main.ts
```

### Missing Components

| Issue | Severity | Details |
|-------|----------|---------|
| No feature modules | 🟠 Warning | Only AppModule exists. No `users/`, `apis/`, `categories/`, `reviews/`, `bookmarks/` modules |
| No PrismaModule | 🔴 Critical | Prisma schema exists but no PrismaService or PrismaModule to use it |
| No DTOs | 🟠 Warning | No data transfer objects for validation |
| No guards/interceptors | 🟠 Warning | No auth guards, no response interceptors |

### Prisma Configuration

| Issue | Severity | Details |
|-------|----------|---------|
| `prismaSchemaFolder` preview feature | 🟠 Warning | This is a preview feature that may change |
| No connection pooling | 🟠 Warning | For production, should use connection pooling |
| No shadow database URL | 🟠 Warning | Needed for `prisma migrate dev` in some environments |

### Prisma Schema Quality

- ✅ Uses UUIDs as primary keys
- ✅ Has timestamps (createdAt, updatedAt)
- ✅ Proper relations defined
- ✅ Enums for constrained values
- ✅ Appropriate indexes

**The Prisma schema is production-ready.**

---

## 6. ENVIRONMENT & CONFIG SAFETY

### .gitignore Analysis

| Issue | Severity | Details |
|-------|----------|---------|
| Backend .gitignore missing `.env` | 🔴 Critical | `.env` files in backend are NOT gitignored and could be committed with secrets |
| No root .gitignore | 🟠 Warning | Should have unified gitignore at root |

### Missing Environment Documentation

Required environment variables (undocumented):

**Frontend:**
- `NEXT_PUBLIC_API_URL` (for backend communication)

**Backend:**
- `DATABASE_URL` (required by Prisma)
- `PORT` (optional, defaults to 3000 which conflicts with frontend)
- `NODE_ENV`

### Port Conflict

Both Next.js and NestJS default to port 3000. This will cause conflicts in development.

---

## 7. BUILD, DEV, AND DEPLOYMENT READINESS

### npm Scripts Status

| Location | Status |
|----------|--------|
| Root package.json | ❌ Empty - no scripts |
| Frontend | ✅ Standard Next.js scripts |
| Backend | ✅ Comprehensive NestJS scripts |

### Build Risks

| Command | Status | Risk |
|---------|--------|------|
| `npm run dev` (frontend) | 🟠 | Turbopack experimental, may have edge cases |
| `npm run build` (frontend) | 🔴 | Tailwind v3/v4 config mismatch may cause missing styles |
| `npm run dev` (backend) | 🟢 | Should work |
| `npm run build` (backend) | 🟢 | Should work |
| Prisma migrate | 🔴 | No DATABASE_URL, no PostgreSQL running |

### Turbo.json Issues

- Only defines outputs for Next.js (`.next/**`)
- Missing NestJS outputs (`dist/**`)
- Incorrect caching behavior for backend

### Windows-Specific

| Issue | Severity | Details |
|-------|----------|---------|
| Path separators | 🟢 Safe | Using forward slashes in configs |
| Script syntax | 🟢 Safe | No bash-specific syntax |
| Line endings | 🟠 Warning | No `.gitattributes` to enforce LF endings |

### Docker Readiness

`docker/docker-compose.yml` is **completely empty**. Required:
- PostgreSQL service
- Network configuration
- Volume persistence

---

## 8. CRITICAL ISSUES SUMMARY

### 🔴 Critical (Must Fix Now)

1. **Tailwind v3/v4 Configuration Conflict**
   - `tailwind.config.ts` uses v3 syntax
   - `postcss.config.mjs` uses v4 plugin
   - `globals.css` uses v4 features
   - **Impact:** Styles may not compile correctly, custom theme won't apply

2. **React 19 in Production**
   - React 19 is release candidate, not stable
   - **Impact:** Potential breaking changes, limited ecosystem support

3. **Backend .gitignore Missing .env**
   - `.env` files not ignored in backend
   - **Impact:** Secrets could be committed to repository

4. **No PrismaService Implementation**
   - Prisma schema exists but no service to use it
   - **Impact:** Backend cannot connect to database

5. **Empty Workspace Packages**
   - `packages/config/` and `packages/shared-types/` have no package.json
   - **Impact:** `npm install` may fail or behave unexpectedly

### 🟠 Warning (Fix Soon)

1. **No Root Scripts** - Cannot run `npm run dev` from root
2. **Port Conflict (3000)** - Both frontend and backend use same port
3. **No .env.example Files** - Required environment variables undocumented
4. **No Error Boundaries** - Missing `error.tsx` and `loading.tsx`
5. **Empty Docker Configuration** - No PostgreSQL service defined
6. **Missing Turborepo Outputs** - `dist/**` not configured for backend
7. **Turbopack Experimental** - Using experimental `--turbopack` flag

### 🟢 Safe (No Action Needed)

1. App Router structure is correct
2. Prisma schema is well-designed
3. NestJS project structure is standard
4. shadcn/ui components are properly installed
5. Font loading is correct
6. Component composition patterns are good
7. TypeScript configuration is appropriate

---

## 9. RECOMMENDED FIXES

### Immediate Actions (Will Not Break Project)

#### 1. Fix Backend .gitignore

Add to `apps/backend/.gitignore`:

```gitignore
# Environment
.env
.env.local
.env.*.local

# Prisma
prisma/*.db
prisma/*.db-journal
```

#### 2. Create Environment Example Files

Create `apps/backend/.env.example`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apiscout?schema=public"

# Server
PORT=3001
NODE_ENV=development
```

Create `apps/frontend/.env.example`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3. Fix Empty Workspace Packages

Create `packages/shared-types/package.json`:

```json
{
  "name": "@apiscout/shared-types",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

Create `packages/shared-types/src/index.ts`:

```typescript
// Shared types will be exported from here
export {};
```

Create `packages/config/package.json`:

```json
{
  "name": "@apiscout/config",
  "version": "0.0.1",
  "private": true
}
```

#### 4. Add Root Scripts

Update root `package.json`:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "dev:frontend": "npm run dev --workspace=apps/frontend",
    "dev:backend": "npm run start:dev --workspace=apps/backend",
    "db:generate": "npm run prisma generate --workspace=apps/backend",
    "db:migrate": "npm run prisma migrate dev --workspace=apps/backend"
  }
}
```

#### 5. Fix Backend Port

Update `apps/backend/src/main.ts`:

```typescript
await app.listen(process.env.PORT ?? 3001);  // Changed from 3000
```

#### 6. Add Docker Compose for PostgreSQL

Update `docker/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: apiscout-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: apiscout
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 10. TAILWIND DECISION REQUIRED

### Option A: Commit to Tailwind v4

**Actions:**
- Remove `tailwind.config.ts`
- Move all configuration to `globals.css` using `@theme`
- Update shadcn/ui components for v4 compatibility

**Pros:** Latest features, future-proof  
**Cons:** shadcn/ui may not fully support v4, less documentation

### Option B: Downgrade to Tailwind v3 (Recommended)

**Actions:**
- Change `package.json`: `"tailwindcss": "^3.4.0"`
- Change `postcss.config.mjs` to use `tailwindcss: {}`
- Update `globals.css` to use `@tailwind` directives
- Revert OKLCH colors to HSL

**Pros:** Stability, ecosystem support, production-ready  
**Cons:** Lose v4 features

**Recommendation:** Option B for production SaaS. Tailwind v4 is too new.

---

## 11. REACT VERSION DECISION

### Option A: Stay on React 19

- Accept bleeding-edge risks
- Benefits from latest features
- May need workarounds for ecosystem incompatibilities

### Option B: Downgrade to React 18 + Next.js 14

- More stable, better ecosystem support
- Requires significant package changes
- Recommended for immediate production needs

**Recommendation:** Evaluate based on timeline. For 3-6 month timeline, React 19 may stabilize.

---

## Conclusion

**Highest Priority:** Resolve the Tailwind v3/v4 configuration conflict before any further frontend development.

**Second Priority:** Create PrismaService and basic backend modules to enable database connectivity.

**Third Priority:** Add environment documentation and fix gitignore to prevent security issues.

---

*Report generated by Claude Opus 4.5 on January 23, 2026*
