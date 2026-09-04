# Maqhawe Ngwenya — Portfolio

Personal developer portfolio for Maqhawe Ngwenya, Junior Full-Stack Software Developer. Built with React, TypeScript, Styled Components, Framer Motion, and Lenis smooth scrolling.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 8 | Build tool & dev server |
| Styled Components | CSS-in-JS theming |
| Framer Motion | Animations & gestures |
| Lenis | Smooth scrolling |
| React Icons | Icon library |

## Features

- **One-page portfolio** with smooth anchor navigation
- **Animated navbar** — sticky, active-section tracking, mobile overlay menu
- **Hero section** — entrance animation sequence, avatar card, floating tech tags
- **About section** — personal bio, stats grid, philosophy quote
- **Journey timeline** — animated vertical timeline with viewport-triggered reveals
- **Skills section** — category filter, animated skill pills
- **Projects section** — featured project cards with hover interactions
- **Contact section** — mailto form + social links panel
- **Footer** — navigation, social links, back-to-top
- **Responsive** — mobile-first, tested from 320px to 1920px
- **Accessible** — semantic HTML, keyboard navigation, visible focus states, skip link, reduced-motion support
- **Dark theme** with lime-yellow accent color system
- **SEO** — title, meta description, Open Graph, Twitter cards, canonical

## Getting Started

```bash
# Clone
git clone https://github.com/Maqhawe/portfolio.git
cd portfolio

# Install dependencies
npm install
```

## Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
npm run build
```

Output is in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Deployment (Vercel)

### Option 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite.

### Option 2 — Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Framework: **Vite** (auto-detected)
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**

## Project Structure

```
src/
├── assets/
│   └── images/projects/     ← Add project screenshots here
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── About/
│   ├── Journey/
│   ├── Skills/
│   ├── Projects/
│   ├── Contact/
│   ├── Footer/
│   └── UI/                  ← Shared primitives (Container, Button, Tag...)
├── data/
│   ├── experience.ts        ← Timeline entries
│   ├── projects.ts          ← Project cards
│   ├── skills.ts            ← Skill groups
│   └── education.ts         ← Education items
├── styles/
│   ├── theme.ts             ← Color, spacing, typography tokens
│   ├── GlobalStyles.ts      ← CSS reset + global styles
│   ├── animations.ts        ← Framer Motion variants
│   └── styled.d.ts          ← DefaultTheme augmentation
├── types/
│   └── index.ts             ← Shared TypeScript interfaces
├── App.tsx                  ← Root + Lenis setup
└── main.tsx
```

## Customisation

### Update content
Edit the files in `src/data/` — no component changes needed to add projects, skills, or experience.

### Replace placeholder email
Search for `maqhawe@example.com` and replace with your real email address.

### Add project images
Place `.webp` images in `src/assets/images/projects/` and update the `image` field in `src/data/projects.ts`.

### Change accent color
Update `primary` in `src/styles/theme.ts`.

## Author

**Maqhawe Ngwenya**  
Junior Full-Stack Software Developer  
Zimbabwe

- GitHub: [github.com/Maqhawe](https://github.com/Maqhawe)
