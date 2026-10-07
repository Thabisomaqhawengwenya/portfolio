# Active Agent Skills & Engineering Guidelines

This project strictly adheres to the following permanent skills and engineering protocols across all development, design, and testing tasks.

---

## 1. Active Skills

### 🎨 `taste-skill`
- **Location:** `.agents/skills/taste-skill/SKILL.md`
- **Scope:** Frontend design engineering, aesthetic calibration, and anti-slop rules.
- **Directives:**
  - Mandatory 1-line **Design Read** before frontend code generation:
    > *"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system>."*
  - Baseline Dials: `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 4`.
  - Palette ban on warm beige/cream/espresso defaults for premium briefs; strictly ban AI-purple glows and 3-card repetition.
  - Max 1 accent color (<80% saturation) locked across the entire site.
  - Tactile button feedback (`:active { transform: scale(0.97); }`).

### 📐 `web-design-guidelines`
- **Location:** `.agents/skills/web-design-guidelines/SKILL.md`
- **Scope:** Web interface standards, accessibility (WCAG), and responsive UX.
- **Directives:**
  - Accessible icon buttons (`aria-label`), visible focus states (`:focus-visible`), and semantic tags (`<button>`, `<a>`).
  - Never disable clipboard paste in input fields.
  - Explicit image dimensions (`width`, `height`) and `loading="lazy"` on below-the-fold assets to prevent CLS.
  - Honor `prefers-reduced-motion`; animate only `transform` and `opacity`; ban `transition: all`.
  - Balanced headings (`text-wrap: balance`), tabular numbers (`font-variant-numeric: tabular-nums`), and ellipsis `…`.

### 🏛️ `awesome-design`
- **Location:** `.agents/skills/awesome-design/SKILL.md`
- **Scope:** Aesthetic archetypes registry and `DESIGN.md` token architecture.
- **Directives:**
  - Enforce intentional visual styling (Neo-Brutalism, Dark Tech, Editorial Minimalist, Cold Luxury).
  - Component state completeness: every component must ship default, hover/active, focused, disabled, loading, and empty states.
  - Strict grid and bento cell fidelity: cell count must strictly match real content items (zero filler cards).

### 🖼️ `image-to-code`
- **Location:** `.agents/skills/image-to-code/SKILL.md`
- **Scope:** Faithful, pixel-accurate conversion of UI screenshots, mockups, and reference images into real code.
- **Directives:**
  - Deep visual inspection of layout geometry, typography scales, spacing tokens, and color palettes before coding.
  - Maintain exact proportions, high-contrast borders, and responsive desktop/tablet/mobile adaptations.

### 🎭 `playwright-cli`
- **Location:** `.agents/skills/playwright-cli/SKILL.md`
- **Scope:** Automated browser testing, visual verification, DOM inspection, and E2E validation.
- **Directives:**
  - Use CLI commands (`playwright-cli open`, `goto`, `snapshot`, `click`, `fill`, `screenshot`) to verify live UI rendering.
  - Inspect accessibility trees, verify responsive viewports, and capture visual proof of interface fixes.
