# Icon Guidelines

This document defines how icons are named, implemented, and maintained within the Mr. DJ design system. It establishes shared expectations for product designers and engineers when introducing or updating iconography across the application.

## Naming Conventions

- **Prefix by context:** Use short prefixes that reflect the domain the icon serves (for example, `nav-`, `action-`, `status-`).
- **Describe the metaphor:** After the prefix, use a hyphenated descriptive phrase that summarizes the visual (for example, `nav-home`, `action-download`, `status-warning`).
- **Prefer lowercase kebab case:** All icon identifiers, file names, and React component exports should be lowercase and use hyphen separators (for example, `status-warning.svg`, `status-warning.js`).
- **Avoid abbreviations:** Only abbreviate when the term is universally recognized (`cta`, `pdf`). Clarity is more important than brevity.
- **Match token names:** When an icon represents a semantic status (`success`, `info`, `warning`, `danger`) align the suffix with the design token naming to reinforce consistency.

## Placement and Usage

- **Use icons to reinforce meaning** rather than as decoration. Only include an icon when it clarifies an action, status, or navigation option.
- **Align icons with text** using the baseline grid. Icons paired with copy should be vertically centered relative to the text line height.
- **Respect spacing tokens** such as `space-2` or `space-3` when placing icons near other interface elements.
- **Group related icons** in navigation and toolbars in a consistent order (for example, primary actions first, secondary actions second).
- **Avoid using multiple icons to express the same concept** within a single surface; select a single metaphor that aligns with our brand guidelines.

## Accessibility Expectations

- **Provide accessible names:** Icons that trigger actions or convey essential information must include an accessible name via `aria-label`, `title`, or descriptive button text.
- **Hide decorative icons:** Icons that are purely decorative must include `aria-hidden="true"` and be excluded from assistive technology focus order.
- **Respect contrast:** When icons communicate status, ensure they meet WCAG contrast standards against their background using approved color tokens.
- **Announce state changes:** Icons that update dynamically (for example, `status-success`) must be paired with live region announcements or textual updates for screen reader users.

## Utility Class Usage

Our Tailwind utility classes standardize icon color and size across the system.

- **Color variants:**
  - Apply status colors using semantic classes such as `text-status-success`, `text-status-info`, `text-status-warning`, and `text-status-danger`.
  - Use neutral treatments with tokens like `text-neutral-600` or `text-neutral-400` for inactive states.
  - Never apply hard-coded hex values; always reference a tokenized utility class.
- **Sizing:**
  - Base icon size defaults to `w-5 h-5`. Scale with sizing utilities (`w-4 h-4`, `w-6 h-6`, `w-8 h-8`) to maintain proportion.
  - When pairing icons with heading text, match the icon height to the text line height by selecting the appropriate `h-*` class.
  - For responsive layouts, combine breakpoint modifiers (for example, `md:w-6 md:h-6`) to adjust icon size across viewports.

## New Icon Submission Checklist

Ensure every new icon follows this checklist before opening a pull request:

1. **Consistent viewBox:** The SVG uses a `viewBox` of `0 0 24 24` (or the established shared size) and does not rely on absolute width/height.
2. **Token alignment:** Fill and stroke colors map to design tokens and are applied via Tailwind utility classes (no inline hex values).
3. **Accessible usage:** The consuming component exposes an accessible name for meaningful icons and hides decorative icons with `aria-hidden="true"`.
4. **Documentation update:** The icon appears in Storybook or the design system catalog with its intended usage and states.
5. **Linting and tests:** Icon files pass SVG linting/optimization and the relevant unit or visual regression tests.

Following this guidance keeps iconography consistent, accessible, and easy to maintain across the product.
