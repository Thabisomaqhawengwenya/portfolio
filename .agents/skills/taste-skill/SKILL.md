---
name: taste-skill
description: Enforce anti-slop design engineering, calibrated aesthetic dials (variance, motion intensity, density), palette discipline, typographic hierarchy, and craft-floor standards for frontend development.
---

# Taste-Skill: Anti-Slop Frontend Design Engineering

Use this skill whenever building, modifying, or auditing frontend interfaces, components, pages, or styling.

## 1. Brief Inference & Design Read
Before generating any frontend code or tweaking dials, always infer the user's intent and output a one-line Design Read:
> *"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."*

## 2. The Three Dials
Calibrate these baseline values for every surface:
* **`DESIGN_VARIANCE: 8`** (1 = Strict Symmetry, 10 = Artsy Chaos)
* **`MOTION_INTENSITY: 6`** (1 = Static, 10 = Cinematic/Physics)
* **`VISUAL_DENSITY: 4`** (1 = Airy Art Gallery, 10 = Dense Cockpit)

## 3. Strict Anti-Defaults & Palette Bans
* **No AI Clichés:** Ban on AI-purple/violet glow buttons, centered hero over dark mesh, and 3 identical feature cards.
* **Palette Ban:** For premium consumer briefs, never default to the warm beige/cream + brass/clay + espresso palette. Rotate across Cold Luxury, Forest, Black & Tan, Cobalt + Cream, Terracotta + Slate, or Pure Monochrome + single vivid pop.
* **Accent Discipline:** Max 1 accent color (<80% saturation). Lock the accent color across all sections of the page.
* **Typography:**
  * Discouraged as default: `Inter`. Banned display serifs: `Fraunces`, `Instrument Serif`.
  * Preferred modern sans: `Geist`, `Cabinet Grotesk`, `Satoshi`, `Outfit`, `Space Grotesk`.
  * Italic descender clearance: When italic display type contains `y, g, j, p, q`, use `leading-[1.1]` min and `pb-1`.
  * Mixed-family emphasis is banned (no random serif word inserted into a sans headline). Use italic or bold of the same font family.
* **Hero & Layout Mechanics:**
  * Hero must fit the initial viewport without requiring scroll to see the CTA.
  * Headline: Max 2 lines at desktop. Subtext: Max 20 words, max 3–4 lines.
  * Hero text stack capped at 4 elements: [Eyebrow OR Brand Strip] + [Headline] + [Subtext] + [CTAs]. Logo walls go *under* the hero, never inside it.
  * Top padding capped at `pt-24` (≈6rem).
  * CTA Button Wrap Ban: Button text must never wrap to multiple lines on desktop. Max 1-2 words.
  * Single-line Navigation: Desktop nav items must fit on one line (height 64–72px, max 80px).
  * Section layout repetition ban: Never repeat the same layout family twice on one page. Max 2 consecutive zigzag image/text splits.
  * Eyebrow restraint: Max 1 eyebrow label per 3 sections.
  * Bento cell count rule: Exact match between cell count and real content items. No empty or filler cards.
* **Hard Anti-Tells:** Complete ban on decorative em-dashes (`—`), div-based fake screenshots, and duplicate CTA intents.

## 4. Motion & Micro-Interaction Directives
* **Animation Decision:**
  * Never animate keyboard-initiated actions.
  * High-frequency actions (100+ times/day) must have zero or minimal animation.
  * Purpose: Must communicate spatial consistency, state change, feedback, or transition continuity.
* **Easing Curves:**
  * Entering / Exiting: Strong `ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`).
  * On-Screen Moving / Morphing: `ease-in-out` (`cubic-bezier(0.77, 0, 0.175, 1)`).
  * Drawers / Sheets: High-damping curve (`cubic-bezier(0.32, 0.72, 0, 1)`).
  * Prohibited: Built-in CSS easings (`ease-in`, generic `ease`) for primary interactions.
* **Micro-Details:**
  * No `transition: all`: Declare explicit animated properties (`transform`, `opacity`).
  * Scale Spawns: Never scale from `0`. Scale from `0.95` or `0.97` combined with `opacity: 0`.
  * Transform Origin: Contextual menus must set `transform-origin` to their trigger element.
  * Button Tactility: Every interactive button must provide tactile press feedback (`:active { transform: scale(0.97); }` or `-translate-y-[1px]`).
  * Shadows: Layered, tinted shadows matching the background hue. Never pitch-black drop shadows on light surfaces.
  * State Completeness: Every UI component must ship with loading skeleton, empty state, inline error state, and keyboard focus rings.
  * State Management: Never track continuous inputs (mouse, magnetic hover) in React `useState`. Use Motion values outside render cycle.

## 5. Mobile-Native Polish
* **Hover fix:** Wrap hover styles in `@media (hover: hover) and (pointer: fine)` to eliminate sticky touch hover states.
* **Viewport Stability:** Use `min-h-[100dvh]` instead of `h-screen`.
* **Input Zoom:** Input font size must be `16px` minimum to stop iOS Safari auto-zooming on focus.
* **Tap Highlights:** Set `-webkit-tap-highlight-color: transparent`.
* **Safe Areas:** Account for hardware notches and home bars with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

## 6. Craft Floor Standards
* **Contrast:** Text ≥ 4.5:1 against background. Tint secondary text from the background hue; never use neutral gray text on colored backgrounds.
* **Surface Theming:** Custom-theme `::selection`, caret color, focus rings, scrollbars, and tabular numerals (`font-variant-numeric: tabular-nums`).
