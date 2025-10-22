# Hydration Findings & Fix Strategy

**Generated:** 2025-10-22
**Audit Date:** 2025-10-22T16:25:40.965Z
**Branch:** chore/hydration-audit

## Executive Summary

**Critical Discovery:** The audit revealed **10 high-severity hydration issues** across 6 files that explain why users see static HTML instead of the dynamic React application.

**Root Cause:** The primary culprit is `app/layout.tsx` which contains inline `<script>` tags with `dangerouslySetInnerHTML` that directly access `window.dataLayer` and `window.location` during SSR. This creates fundamental hydration mismatches between server and client.

## Issues by Priority

###  CRITICAL Priority - app/layout.tsx (4 issues)

**File:** `dynamic-api/app/layout.tsx`
**Impact:** 🔴 **CRITICAL** - Breaks entire application hydration
**Status:** ❌ Not Fixed

| Line | Pattern | Issue | Current Code |
|------|---------|-------|--------------|
| 137  | window  | Inline script accesses window.dataLayer | `window.dataLayer = window.dataLayer \|\| [];` |
| 137  | window  | Duplicate detection of same issue | Same as above |
| 141  | window  | Inline script accesses window.location | `page_path: window.location.pathname` |
| 139  | date    | Inline script uses new Date() | `gtag('js', new Date());` |

**Why This is Critical:**
- Server-rendered HTML doesn't have `window` or `location` objects
- Inline scripts in dangerouslySetInnerHTML execute during hydration
- Creates SSR/client mismatch that prevents React from taking over
- **This is likely THE primary reason users see static HTML**

**Fix Strategy:**
1. Extract Google Analytics script to separate client component
2. Use Next.js Script component with strategy="afterInteractive"
3. Or use `next/script` with proper id and data attributes

**Detailed Fix:**

```typescript
// Option 1: Extract to separate component
// components/analytics/GoogleAnalytics.tsx
"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Then in app/layout.tsx:
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
```

###  HIGH Priority - components/layout/Footer.tsx (1 issue)

**File:** `dynamic-api/components/layout/Footer.tsx`
**Impact:** 🟡 Medium-High
**Status:** ❌ Not Fixed

| Line | Pattern | Issue | Current Code |
|------|---------|-------|--------------|
| 4    | date    | new Date() in component render | `const currentYear = new Date().getFullYear();` |

**Why This Matters:**
- Copyright year calculated during render causes SSR/client timestamp mismatch
- Server generates year at build time, client at runtime
- Can cause hydration warnings

**Fix Strategy:**
Use client component with useEffect, or calculate year on server:

```typescript
// Option 1: Client component (recommended for dynamic year)
"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025); // Fallback

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer>
      <p>&copy; {currentYear} Mister DJ. Alle rechten voorbehouden.</p>
    </footer>
  );
}

// Option 2: Server component with static year (simpler, no hydration risk)
export default function Footer() {
  // Year calculated once on server, stays consistent
  const currentYear = 2025; // Update manually or use build-time env var

  return (
    <footer>
      <p>&copy; {currentYear} Mister DJ. Alle rechten voorbehouden.</p>
    </footer>
  );
}
```

### 🟡 MEDIUM Priority - app/sitemap.ts (1 issue)

**File:** `dynamic-api/app/sitemap.ts`
**Impact:** 🟢 Low (doesn't affect UI hydration, but can cause build inconsistencies)
**Status:** ❌ Not Fixed

| Line | Pattern | Issue | Current Code |
|------|---------|-------|--------------|
| 12   | date    | new Date() in sitemap generation | `const currentDate = new Date()` |

**Why This Matters:**
- Sitemap.ts runs at build time, not during client hydration
- Doesn't directly affect UI, but creates timestamp variations
- Can cause sitemap to regenerate on every request

**Fix Strategy:**
Use stable date or remove if not needed:

```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Option 1: Use fixed recent date
  const lastModified = '2025-10-22';

  // Option 2: Use build timestamp from env
  const lastModified = process.env.BUILD_TIME || new Date().toISOString().split('T')[0];

  return [
    {
      url: 'https://mr-dj.sevensa.nl',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // ... rest of sitemap
  ];
}
```

### 🟡 MEDIUM Priority - app/api/personalize/route.ts (1 issue)

**File:** `dynamic-api/app/api/personalize/route.ts`
**Impact:** 🟢 Low (API route, doesn't affect UI hydration)
**Status:** ❌ Not Fixed

| Line | Pattern | Issue | Current Code |
|------|---------|-------|--------------|
| 61   | date    | Date.now() in exposure token | `exposure_token: \`exp_${key}_${choice.key}_${Date.now()}\`` |

**Why This Matters:**
- API routes run on server, not during client hydration
- Doesn't directly cause UI hydration issues
- However, can cause session inconsistencies

**Fix Strategy:**
This is actually fine for API routes (server-only), but consider using crypto.randomUUID() for better uniqueness:

```typescript
import { randomUUID } from 'crypto';

// Instead of Date.now():
exposure_token: `exp_${key}_${choice.key}_${randomUUID()}`

// Or keep Date.now() - it's acceptable in API routes
```

### 🟡 MEDIUM Priority - lib/analytics.ts (2 issues)

**File:** `dynamic-api/lib/analytics.ts`
**Impact:** 🟡 Medium
**Status:** ❌ Not Fixed

| Line | Pattern | Issue | Current Code |
|------|---------|-------|--------------|
| 7    | window  | typeof window check | `if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production')` |
| 14   | window  | typeof window check | Same pattern |

**Why This Matters:**
- typeof window checks are heuristic guards
- Suggest library is designed for universal use
- Can cause hydration if called during render

**Fix Strategy:**
Mark as client-only or ensure only called in useEffect:

```typescript
"use client";

// Or ensure all functions only called from useEffect:
export function trackEvent(event: string, data?: any) {
  if (typeof window === 'undefined') return;

  // Safe - will only run on client
  if (window.gtag) {
    window.gtag('event', event, data);
  }
}
```

### 🟡 MEDIUM Priority - lib/eds.ts (1 issue)

**File:** `dynamic-api/lib/eds.ts`
**Impact:** 🟡 Medium
**Status:** ❌ Not Fixed

| Line | Pattern | Issue | Current Code |
|------|---------|-------|--------------|
| 12   | document | Direct document.documentElement access | `const root = document.documentElement;` |

**Why This Matters:**
- Accessing document during render causes SSR/client mismatch
- Server has no document object
- Must be called only in browser context

**Fix Strategy:**
Add "use client" or guard with typeof window:

```typescript
"use client";

export function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}
```

## Summary Table

| Priority | File | Issues | Impact | Fix Complexity |
|----------|------|--------|--------|----------------|
| 🔴 CRITICAL | app/layout.tsx | 4 | Breaks hydration | Medium |
| 🟡 HIGH | components/layout/Footer.tsx | 1 | Hydration warnings | Easy |
| 🟢 MEDIUM | app/sitemap.ts | 1 | Build inconsistency | Easy |
| 🟢 MEDIUM | app/api/personalize/route.ts | 1 | None (API only) | Easy/Optional |
| 🟡 MEDIUM | lib/analytics.ts | 2 | Potential mismatch | Easy |
| 🟡 MEDIUM | lib/eds.ts | 1 | Potential mismatch | Easy |

## Fix Implementation Order

1. **FIRST:** Fix `app/layout.tsx` - Extract Google Analytics to client component
2. **SECOND:** Fix `components/layout/Footer.tsx` - Use client component for year
3. **THIRD:** Fix `lib/eds.ts` - Add "use client" directive
4. **FOURTH:** Fix `lib/analytics.ts` - Mark as client-only
5. **FIFTH:** Fix `app/sitemap.ts` - Use stable date
6. **OPTIONAL:** Review `app/api/personalize/route.ts` - Consider crypto.randomUUID()

## Testing Strategy

After fixes:

1. Run hydration audit: `npm run audit:hydration` should show 0 issues
2. Build production: `npm run build` should complete without warnings
3. Run Playwright tests with hydration error detection
4. Manual test: Open devtools console, navigate site, check for hydration warnings
5. Verify analytics still works in production

## Commit Strategy

Following the superprompt guidelines:

1. `chore(audit): add hydration audit tool, guard & CI workflow`
2. `fix(ssr): extract Google Analytics to client component (CRITICAL)`
3. `fix(ssr): move date calculations to client-side (Footer, sitemap)`
4. `fix(client-only): mark browser APIs as client-only (eds, analytics)`
5. `test(e2e): add Playwright hydration spec`
6. `docs: document hydration fix findings and resolution`

## Definition of Done

- [ ] All 10 hydration issues resolved
- [ ] `npm run audit:hydration` returns 0 errors
- [ ] `npm run build` completes without hydration warnings
- [ ] Playwright e2e tests pass with hydration error detection
- [ ] Manual testing confirms no console hydration errors
- [ ] Documentation complete in this file
- [ ] Changes committed with structured commits
- [ ] Container rebuilt and production verified

---

**Next Action:** Begin fixing issues starting with CRITICAL priority `app/layout.tsx`
