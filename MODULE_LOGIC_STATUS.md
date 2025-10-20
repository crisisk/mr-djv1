# Module Logic Inventory & Batch Plan

This document tracks generated modules that ship without production-ready logic. The gaps were identified by searching for
placeholder comments (e.g. "Add booking logic here"), TODO markers, mock data, and hard-coded API keys inside
`frontend/src/components/Generated` as well as legacy entry points that mount the new React experience.

## Modules Requiring Additional Logic

| Module | Current Gap | Notes |
| --- | --- | --- |
| `frontend/src/components/Generated/MKT4_1_20251016_062601.tsx` | CTA button only closed the popup; no analytics or booking flow hand-off. | ✅ Addressed in Batch 1. |
| `frontend/src/components/Generated/D3_1_20251016_060618.tsx` | Button logged to console instead of triggering a booking hand-off. | ✅ Addressed in Batch 1. |
| `frontend/src/components/Generated/MKT2_3_20251016_062323.tsx` | Uses mock Instagram reel data and references an undefined `captions` property. | Needs API integration & defensive data parsing. |
| `frontend/src/components/Generated/DEV2_5_20251016_061530.tsx` | Depends on undefined booking context, missing `handleSubmit`, wizard steps not implemented. | Requires wiring to actual booking flow or removal. |
| `frontend/src/components/Generated/MKT3_3_20251016_062514.tsx` | Placeholder retargeting IDs; no environment-driven configuration. | Should read from config/env and expose guard rails. |
| `frontend/src/components/Generated/MKT3_4_20251016_062533.tsx` | Hard-coded Google Ads snippet and conversion ID; no consent or environment gating. | Needs script management & configuration. |
| `frontend/src/components/Generated/DEV3_5_20251016_061839.tsx` | PostHog initialisation uses placeholder API key and lacks SSR safety. | Requires env-driven setup & lifecycle hardening. |
| `AvailabilityChecker.jsx` | Sevensa submission still contains placeholder account/form identifiers. | Needs real configuration + secrets management. |

## Batch Execution Plan

- ~~**Batch 1 – Booking CTA instrumentation**~~ ✅ *(completed in this iteration)*
  - Modules: Exit intent popup (`MKT4_1…`), Sticky booking CTA (`D3_1…`).
  - Deliverables: Shared CTA tracking utility, GA4 + CRO event logging, navigation to the contact funnel.
- **Batch 2 – Marketing & tracking configuration hardening** *(next)*
  - Modules: Retargeting config (`MKT3_3…`), YouTube Ads tracker (`MKT3_4…`), PostHog tracker (`DEV3_5…`).
  - Goal: Replace placeholder IDs with environment-aware config and add runtime safety checks & consent gating.
- **Batch 3 – Data-integrated experiences** *(following)*
  - Modules: Instagram reels showcase (`MKT2_3…`), Booking wizard shell (`DEV2_5…`), Sevensa availability checker.
  - Goal: Connect to backend APIs or CMS data, implement missing sub-components, and stabilise the booking workflow.

Total batches required: **3**. Batch 1 is now complete and crossed off above; Batches 2 and 3 remain open for future
iterations.
