# Typography

The design system uses a utility-driven typography scale that keeps headlines, body copy, and supporting text aligned across the application. The scale is defined in `frontend/src/styles/typography.css` and exposed through CSS custom properties and helper classes so it can be reused anywhere in the app or in documentation.

## Font families and weights

- **Sans-serif base:** `--font-family-sans` uses Inter with system fallbacks for UI and body copy.
- **Monospace:** `--font-family-mono` powers inline code snippets and technical details.
- **Weights:** `--font-weight-light` (300) through `--font-weight-bold` (700) cover the range from captions to hero headlines.

## Type scale tokens

| Token | Rem value | Approx px | Recommended usage |
| --- | --- | --- | --- |
| `--font-size-1000` | `clamp(3rem, 6vw + 1rem, 4.5rem)` | 48–72 | Hero display text (`.typography-display`) |
| `--font-size-900` | `3rem` | 48 | Feature headlines |
| `--font-size-800` | `2.25rem` | 36 | Section headlines (`.typography-headline`) |
| `--font-size-700` | `1.875rem` | 30 | Page titles (`.typography-title`) |
| `--font-size-600` | `1.5rem` | 24 | Lead copy or highlighted metrics |
| `--font-size-500` | `1.25rem` | 20 | Subtitles (`.typography-subtitle`) |
| `--font-size-400` | `1.125rem` | 18 | Feature body text (`.typography-body-large`) |
| `--font-size-300` | `1rem` | 16 | Standard body copy (`.typography-body`) |
| `--font-size-200` | `0.875rem` | 14 | Captions and annotations (`.typography-caption`) |
| `--font-size-100` | `0.75rem` | 12 | Legal copy or dense UI text |

Line heights (`--line-height-tight`, `--line-height-snug`, `--line-height-normal`, `--line-height-relaxed`) and letter-spacing tokens keep typography comfortable and readable across text sizes.

## Utility classes

| Class | Description |
| --- | --- |
| `.typography-base` | Applies the base sans-serif family and default text color token. |
| `.typography-display` | Large, bold hero headlines with tight line-height. |
| `.typography-headline` | Section-level headings with snug spacing. |
| `.typography-title` | Standard page titles and card headings. |
| `.typography-subtitle` | Medium-weight subtitles with secondary text color. |
| `.typography-body-large` | Large body copy for lead paragraphs. |
| `.typography-body` | Default body copy styling. |
| `.typography-caption` | Uppercased caption text with loose tracking. |
| `.typography-code` | Inline code styling using the monospace stack. |
| `.typography-strong` | Semantic strong emphasis with consistent weight. |
| `.typography-emphasis` | Italicized emphasis.

## Example usage

```tsx
import './styles/typography.css'

export function Hero() {
  return (
    <section className="typography-base">
      <p className="typography-caption">Release Notes</p>
      <h1 className="typography-display">Shipping improvements this week</h1>
      <p className="typography-body">
        Explore the latest updates and learn how they streamline your workflow.
      </p>
    </section>
  )
}
```

These classes can be mixed with component-level styles or utility systems to ensure consistent typography without hand-tuning sizes for each instance.
