---
name: awesome-design
description: Curated design system architecture and DESIGN.md protocol for AI agents. Provides guidelines for selecting, implementing, and maintaining distinct design aesthetic families, generating design tokens, and applying strict quality gates.
---

# Awesome Design: Design System Architecture & DESIGN.md Protocol

Use this skill to select appropriate aesthetic archetypes, author design systems, generate design tokens, and enforce high-craft visual quality.

## 1. Aesthetic Archetypes Registry
When initiating a visual direction or redesign, select an intentional aesthetic archetype instead of generic web defaults:

* **Neo-Brutalism:**
  * Characteristics: High-contrast solid black borders (`2px`–`4px`), tactile hard offset drop shadows (`4px 4px 0 #000`), bold primary color blocks (canary yellow, international orange, cobalt), uppercase Swiss grotesque type.
  * Best for: Developer portfolios, cutting-edge software tools, creative agencies.
* **Minimalist Editorial:**
  * Characteristics: Warm monochrome surfaces, generous whitespace, large typographic scale contrast, delicate hairline borders (`1px solid rgba(0,0,0,0.08)`), muted secondary accents.
  * Best for: Architecture showcases, publishing, luxury goods, case studies.
* **Dark Tech / Linear Aesthetic:**
  * Characteristics: Deep obsidian backgrounds (`#0a0a0a`), subtle luminous borders (`#1f1f1f`), single vivid accent pop (<80% saturation), monospaced status badges, tabular numeric counters.
  * Best for: SaaS dashboards, developer tools, financial consoles, productivity suites.
* **Cold Luxury:**
  * Characteristics: Deep titanium and silver hues, understated typography with tight letter spacing, high-damping easing curves, expansive borders, zero loud gimmicks.
  * Best for: High-end lifestyle, automotive, executive software, fintech.
* **Swiss Print / International Typographic:**
  * Characteristics: Rigid asymmetric column grids, bold functional grotesque headings, strict alignment, high readability, purposeful information hierarchy.
  * Best for: Technical documentation, data-heavy applications, directories.

## 2. DESIGN.md Protocol
When defining or standardizing a project's design system, structure tokens and rules in a standardized `DESIGN.md` specification:

```markdown
# DESIGN SYSTEM SPECIFICATION

## Aesthetic Family
- Archetype: [e.g. Neo-Brutalism / Dark Tech / Minimalist]
- Variance Dial: [1-10]
- Density Dial: [1-10]
- Motion Dial: [1-10]

## Color Tokens
- Surface: Primary background and layered container colors
- Border: Structural boundary color and stroke weight
- Text: Primary high-contrast text and secondary tinted text
- Accent: Locked single accent color (<80% saturation)

## Typography Tokens
- Display: Hero and display font family
- Body: Interface and long-form font family
- Mono: Code, labels, tags, tabular data font family
- Hierarchy: Scales from xs (0.75rem) to 4xl (2.5rem+)

## Spatial & Elevation Tokens
- Spacing Scale: Base 4px or 8px grid
- Radii: 0px (brutalist) or calibrated curve (e.g. 6px, 12px)
- Shadows: Hard offset shadows (4px 4px 0) or soft tinted diffusion
```

## 3. Strict Quality Gates
* **Component State Completeness:** Every UI component must implement:
  1. Default interactive state
  2. Hover / Active state with tactile feedback (`:active { transform: scale(0.97); }`)
  3. Focused state (`:focus-visible` ring)
  4. Disabled state with clear visual attenuation
  5. Loading state (matching layout geometry, no layout shift)
  6. Empty state with clear call to action
* **Color Discipline:**
  * Minimum contrast 4.5:1 for normal text, 3:1 for large text.
  * Lock the primary accent across the entire page layout.
  * Never mix unrelated accent colors in competing sections.
* **Grid Discipline:**
  * Consistent container margins and responsive gutters.
  * Bento grid cell count must strictly equal the actual content items (no filler cards).
