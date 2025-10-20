# Responsive Review Notes

## Overview
- Reviewed the static design guidance in `components_responsive.html` to validate breakpoint strategy and highlight implementation gaps.
- Conceptually audited key customer journeys (Home, Bruiloft DJ, Contact) at mobile (≤767px), tablet (768–1023px), and desktop (≥1024px) breakpoints to surface responsive issues to fix later.

## Findings from `components_responsive.html`
1. **Fixed-width slide container** – The slide canvas is locked to `width: 1280px` without a max-width fallback, which will overflow on viewports narrower than the slide width when the asset is embedded outside of a presentation context. Replace with a fluid `max-width: 100%` pattern and constrain via `max-width: 1280px` if we continue to reuse it on the marketing site.【F:components_responsive.html†L26-L33】
2. **Viewport centering on body** – The body is forced into a centered flex layout with `min-height: 100vh`, causing unwanted vertical and horizontal scrollbars on small screens because the fixed-width slide cannot shrink. Updating to a top-aligned layout with responsive padding avoids this squeeze effect.【F:components_responsive.html†L18-L33】
3. **Static layout grid** – The `.content-grid` always renders two columns (`grid-template-columns: 1.2fr 0.8fr`) without media queries, so the explanatory copy and visual examples will remain side-by-side on mobile. Introduce breakpoint-based single-column fallbacks so the text and diagrams stack gracefully below 1024px.【F:components_responsive.html†L41-L53】
4. **Lack of font scaling guidance** – Typography uses fixed pixel sizes (e.g., `font-size: 42px`) for headlines and labels. Expand the guideline with `clamp()` examples to model how we expect headings to scale between mobile and desktop widths.【F:components_responsive.html†L34-L40】【F:components_responsive.html†L99-L121】

## Conceptual Breakpoint Testing

### Home (`DjSaxLanding`)
- **Hero CTA clustering on mobile** – The hero keeps both CTAs in a horizontal flex row with `space-x` utilities and no wrap, so two large buttons will overflow below ~360px width. Add responsive stacking (e.g., `flex-col sm:flex-row`) and provide top/bottom spacing for the secondary CTA.【F:mr-dj-eds-components/src/components/Organisms/HeroSection.jsx†L43-L62】
- **TrustBadges compact row** – The compact trust badge variant uses a single unwrapped flex row (`flex ... gap-6`) which can exceed narrow viewports when embedded in tight layouts. Allow wrapping or switch to a column layout under 480px.【F:mr-dj-eds-components/src/components/Molecules/TrustBadges.jsx†L55-L83】

### Bruiloft DJ (`pages/BruiloftDJPage.jsx`)
- **Double-column feature grid spacing** – Feature cards rely on `grid md:grid-cols-2` with large fixed padding. On 768px tablets the cards sit edge-to-edge because the surrounding container only has `px-4`. Introduce responsive `gap` and outer padding adjustments (e.g., `sm:px-6 lg:px-12`) to avoid cramped columns.【F:mr-dj-eds-components/src/pages/BruiloftDJPage.jsx†L44-L91】
- **Hero CTA overflow mirrors home** – This page reuses the hero component, so apply the same responsive stacking fix once the shared component is updated.【F:mr-dj-eds-components/src/pages/BruiloftDJPage.jsx†L34-L43】【F:mr-dj-eds-components/src/components/Organisms/HeroSection.jsx†L43-L62】

### Contact (`pages/ContactPage.jsx`)
- **Contact methods grid** – The three-up contact info grid switches to a single column on mobile, but the 64px icon circles and text remain centered. Consider left-aligning or reducing icon sizes under 400px to tighten the vertical rhythm and prevent excessive whitespace.【F:mr-dj-eds-components/src/pages/ContactPage.jsx†L24-L73】
- **Booking widget height on mobile** – The embedded booking widget enforces `min-h-[480px]`, which dwarfs the viewport on smaller phones. Lower the min-height below 360px or allow it to shrink via responsive utility classes.【F:mr-dj-eds-components/src/components/Organisms/BookingWidget.jsx†L21-L34】

## Next Steps
- Prioritize updating the shared `HeroSection` component so all hero instances inherit mobile-first CTA stacking.
- Introduce utility helpers (e.g., `stack-on-mobile` Tailwind variant) to standardize responsive spacing without bespoke CSS per section.
- Align the responsive design documentation with the actual Tailwind breakpoints used in production so designers and engineers share the same breakpoint map.
