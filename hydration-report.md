🔍 Starting Hydration Audit...

# Hydration Audit Report

**Generated:** 2025-10-22T16:25:40.965Z

## Summary

- Files Scanned: 174
- Issues Found: 10
  - 🔴 High: 10
  - 🟡 Medium: 0
  - 🔵 Low: 0

## Issues by File

### `app/api/personalize/route.ts`

| Line | Severity | Pattern | Message | Snippet | Fix |
|------|----------|---------|---------|---------|-----|
| 61 | 🔴 High | date-now | Dynamic date/time in render (causes SSR/client mismatch) | `exposure_token: `exp_${key}_${choice.key}_${Date.now()}`` | Pass date from server props or calculate in useEffect |

### `app/layout.tsx`

| Line | Severity | Pattern | Message | Snippet | Fix |
|------|----------|---------|---------|---------|-----|
| 137 | 🔴 High | browser-api-window | Direct window access in render path (SSR unsafe) | `window.dataLayer = window.dataLayer || [];` | Move to useEffect or add "use client" directive |
| 137 | 🔴 High | browser-api-window | Direct window access in render path (SSR unsafe) | `window.dataLayer = window.dataLayer || [];` | Move to useEffect or add "use client" directive |
| 141 | 🔴 High | browser-api-window | Direct window access in render path (SSR unsafe) | `page_path: window.location.pathname,` | Move to useEffect or add "use client" directive |
| 139 | 🔴 High | date-now | Dynamic date/time in render (causes SSR/client mismatch) | `gtag('js', new Date());` | Pass date from server props or calculate in useEffect |

### `app/sitemap.ts`

| Line | Severity | Pattern | Message | Snippet | Fix |
|------|----------|---------|---------|---------|-----|
| 12 | 🔴 High | date-now | Dynamic date/time in render (causes SSR/client mismatch) | `const currentDate = new Date()` | Pass date from server props or calculate in useEffect |

### `components/layout/Footer.tsx`

| Line | Severity | Pattern | Message | Snippet | Fix |
|------|----------|---------|---------|---------|-----|
| 4 | 🔴 High | date-now | Dynamic date/time in render (causes SSR/client mismatch) | `const currentYear = new Date().getFullYear();` | Pass date from server props or calculate in useEffect |

### `lib/analytics.ts`

| Line | Severity | Pattern | Message | Snippet | Fix |
|------|----------|---------|---------|---------|-----|
| 7 | 🔴 High | browser-api-window | Direct window access in render path (SSR unsafe) | `if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {` | Move to useEffect or add "use client" directive |
| 14 | 🔴 High | browser-api-window | Direct window access in render path (SSR unsafe) | `if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {` | Move to useEffect or add "use client" directive |

### `lib/eds.ts`

| Line | Severity | Pattern | Message | Snippet | Fix |
|------|----------|---------|---------|---------|-----|
| 12 | 🔴 High | browser-api-document | Direct document access in render path (SSR unsafe) | `const root = document.documentElement;` | Move to useEffect or add "use client" directive |


