# Maqhawe Ngwenya — Portfolio

> Personal developer portfolio for **Maqhawe Ngwenya**, Junior Full-Stack Software Developer from Zimbabwe.

Live at → _deploy to Vercel and add URL here_

---

## Overview

A single-page portfolio built with a **neo-brutalism** design system — hard black borders, bold offset shadows, sharp corners, and a live accent-colour switcher with five themes: **Yellow, Red, Blue, White, and Black (mono)**.

The Black theme fully inverts the surface palette to a dark system with white borders and white-offset shadows, staying consistent with the brutalist visual language.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Styled Components v6 |
| Animation | Framer Motion |
| Smooth Scroll | Lenis |
| Icons | React Icons |
| Fonts | Space Grotesk · Space Mono (Google Fonts) |

---

## Features

- **Neo-brutalism design system** — hard borders, offset shadows, zero border-radius, bold typography
- **Live theme switcher** — 5 accent colours (Yellow / Red / Blue / White / Black mono), persisted in `localStorage`
- **Black mono theme** — full dark-mode surface inversion with white offset shadows
- **Sticky navbar** — active section tracking, animated hamburger, full-screen mobile overlay
- **Hero section** — animated entrance sequence, floating sticker badges, avatar card with dot-grid pattern
- **Journey timeline** — stacked bordered rows, left accent column, viewport-triggered slide animations
- **Skills section** — category filter tabs, animated pill pop on hover
- **Projects section** — horizontal rows with 3-D CSS book card flip effect on hover, GitHub + Live Site links
- **Contact section** — mailto form with loading/success state, social links panel
- **Footer** — three-column dark grid, back-to-top button
- **Spring pop animations** — every button, skill pill, and tag has a spring-physics hover pop
- **Fully responsive** — mobile-first, tested from 320 px to 1920 px
- **Accessible** — semantic HTML, keyboard navigation, skip link, focus-visible outlines, reduced-motion support

---

## Project Structure

```
src/
├── assets/
│   └── images/projects/        ← Add project screenshots here (.webp)
│
├── components/
│   ├── ColorPicker/            ← Live accent colour switcher
│   ├── Contact/
│   ├── Footer/
│   ├── Hero/
│   ├── Journey/
│   ├── Navbar/
│   ├── Projects/
│   ├── Skills/
│   └── UI/                     ← Shared primitives (Container, Button, Tag, Section…)
│
├── data/
│   ├── education.ts            ← Education entries
│   ├── experience.ts           ← Timeline / journey entries
│   ├── projects.ts             ← Project cards
│   └── skills.ts               ← Skill groups
│
├── styles/
│   ├── GlobalStyles.ts         ← CSS reset + base styles
│   ├── ThemeContext.tsx        ← Accent colour context + 5 theme options
│   ├── animations.ts           ← Framer Motion variant presets
│   ├── styled.d.ts             ← DefaultTheme augmentation
│   └── theme.ts                ← All design tokens
│
├── types/
│   └── index.ts                ← Shared TypeScript interfaces
│
├── App.tsx                     ← Root: ThemeProvider + Lenis setup
└── main.tsx
```

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/Thabisomaqhawengwenya/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Customisation

### Update your content
All content lives in `src/data/` — edit without touching any component.

| File | What to edit |
|---|---|
| `experience.ts` | Timeline entries (education, projects, milestones) |
| `projects.ts` | Project cards (title, description, GitHub URL, live URL) |
| `skills.ts` | Skill groups and individual skills |
| `education.ts` | Education items |

### Add project images
Drop `.webp` files into `src/assets/images/projects/` and set the `image` field in `src/data/projects.ts`.

### Change your email
Search the codebase for `maqhawe@example.com` and replace with your real address.

### Change the default accent colour
Open `src/styles/ThemeContext.tsx` and reorder `ACCENT_OPTIONS` — the first item is the default.

### Add a new theme colour
Add a new entry to the `ACCENT_OPTIONS` array in `src/styles/ThemeContext.tsx` — the picker renders all entries automatically.

---

## Deployment (Vercel)

### Option A — Dashboard (recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import `portfolio` repository
4. Framework preset: **Vite** (auto-detected)
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click **Deploy**

### Option B — CLI

```bash
npm install -g vercel
vercel
```

---

## Design System

### Colours

| Token | Value | Usage |
|---|---|---|
| `background` | `#F5F0E8` | Page background (cream) |
| `surface` | `#FFFFFF` | Card backgrounds |
| `border` | `#000000` | All borders (hard black) |
| `primary` | `#FFE500` | Accent (default yellow) |
| `text` | `#000000` | Body and heading text |
| `textMuted` | `#222222` | Secondary text |

### Shadows

All shadows are hard-offset with no blur — the defining trait of neo-brutalism.

```
sm:    3px 3px 0 #000
md:    5px 5px 0 #000
lg:    7px 7px 0 #000
xl:    10px 10px 0 #000
hover: 7px 7px 0 #000  (used on :hover with translate(-2px,-2px))
```

In Black mono theme all shadows flip to white offset.

---

## Author

**Maqhawe Ngwenya**
Junior Full-Stack Software Developer · Zimbabwe

- GitHub: [github.com/Thabisomaqhawengwenya](https://github.com/Thabisomaqhawengwenya)

---

© 2026 Maqhawe Ngwenya
