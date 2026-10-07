---
name: web-design-guidelines
description: Review and build UI code compliant with Web Interface Guidelines. Enforces accessibility (WCAG), focus states, form UX, motion restraint, typography, content handling, image CLS prevention, and performance.
---

# Web Design Guidelines (Web Interface Guidelines)

Use this skill whenever building, reviewing, or refactoring web interfaces, forms, typography, animations, images, or layout structures.

## 1. Accessibility (WCAG & Assistive Tech)
* **Icon Buttons:** Icon-only buttons must have an `aria-label` attribute describing their exact action.
* **Form Controls:** Every input, select, and textarea needs a visible `<label>` with `htmlFor` or an explicit `aria-label`.
* **Keyboard Navigation:** All interactive elements must support keyboard navigation (`onKeyDown`, Enter, Space).
* **Semantics First:** Always use `<button>` for actions and `<a>` / `<Link>` for navigation. Never `<div onClick>`.
* **Images & Icons:**
  * Informative images must have a descriptive `alt` attribute.
  * Decorative images and SVG icons must have `aria-hidden="true"` or `alt=""`.
* **Live Regions:** Dynamic status messages, toasts, and validation notices must use `aria-live="polite"`.
* **Heading Hierarchy:** Use clean hierarchical headings (`<h1>` through `<h6>`). Never skip heading levels for visual styling.

## 2. Focus States
* **Visible Focus:** Interactive elements must have high-visibility focus indicators (e.g. `focus-visible:ring-2` or a bold border/outline).
* **No Bare `outline: none`:** Never remove default outlines (`outline: none` / `outline-none`) without providing a distinct focus style.
* **`:focus-visible` over `:focus`:** Use `:focus-visible` so mouse clicks do not leave sticky focus rings while keyboard tabbing remains fully accessible.
* **Compound Focus:** Use `:focus-within` on search bars, input groups, and composite cards.
* **Overlay Clearance:** Fixed navigation, sticky banners, and modals must never obscure currently focused elements.

## 3. Forms & Data Input
* **Autofill Attributes:** Always provide appropriate `autocomplete` and meaningful `name` attributes.
* **Specialized Inputs:** Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode` (`numeric`, `decimal`) for mobile keyboards.
* **Never Block Paste:** Never disable clipboard paste (`onPaste` with `preventDefault`). Users rely on password managers and copy-paste.
* **Spellcheck Controls:** Explicitly set `spellCheck={false}` on email addresses, URLs, usernames, codes, and tokens.
* **Hit Targets:** Labels and checkboxes/radios must share a unified clickable hit target (minimum 44x44px).
* **Loading & Submissions:** Submit buttons must stay enabled until network requests dispatch; display inline loading spinners during submission.
* **Error Feedback:** Place validation errors inline directly beside the offending field; auto-focus the first invalid field upon submission.
* **Placeholders:** End placeholder text with an ellipsis (`…`) and show realistic formatting patterns.

## 4. Animation & Motion
* **Reduced Motion:** Always honor `prefers-reduced-motion` media queries. Provide instant transitions or reduced motion fallbacks.
* **Compositor Acceleration:** Only animate `transform` and `opacity`. Never animate layout-triggering properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
* **Explicit Transitions:** Never write `transition: all`. Always specify explicit transition properties (e.g., `transition: transform 0.2s ease, opacity 0.2s ease`).
* **Transform Origins:** Set explicit `transform-origin` for popovers, dropdowns, and scale transitions.
* **Interruptibility:** Ensure user gestures can interrupt running animations smoothly without jumping.

## 5. Typography
* **Punctuation:** Use true ellipsis character `…` instead of three periods `...`.
* **Smart Quotes:** Prefer directional curly quotes `“` `”` and apostrophes `’` in editorial copy over straight quotes.
* **Non-Breaking Spaces:** Use non-breaking spaces (`&nbsp;`) between numbers and units (e.g., `10&nbsp;MB`, `100&nbsp;px`, `⌘&nbsp;K`).
* **Tabular Numbers:** Apply `font-variant-numeric: tabular-nums` to financial data, counters, stats, and data tables to prevent horizontal jitter.
* **Balanced Headings:** Use `text-wrap: balance` or `text-wrap: pretty` on headlines and subtitles to eliminate typographic widows and orphans.

## 6. Content Resilience & Overflow
* **Text Truncation:** Ensure text containers gracefully handle unexpected content lengths with `truncate`, `line-clamp-*`, or `overflow-wrap: break-word`.
* **Flexbox Child Truncation:** Apply `min-w-0` to flex child containers so text truncation can trigger without breaking layout widths.
* **Empty States:** Always provide structured, elegant empty states for arrays, lists, search results, and filters.

## 7. Images & Layout Stability
* **Prevent Cumulative Layout Shift (CLS):** Always specify explicit `width` and `height` (or aspect-ratio containers) on `<img>` elements.
* **Lazy Loading:** Apply `loading="lazy"` to all images below the initial fold.
* **Priority Assets:** Use `fetchpriority="high"` or preload tags for above-the-fold hero banners and primary visual assets.

## 8. Web Performance
* **Virtualization:** Virtualize lists with more than 50 items (`react-window`, `virtua`, or `content-visibility: auto`).
* **Avoid Layout Thrashing:** Never read layout dimensions (`getBoundingClientRect`, `offsetHeight`, `scrollTop`) inside hot render loops.
* **Batch DOM Changes:** Read all layout values first before writing DOM updates to avoid interleaving layout reflows.
