import type { Variants } from 'framer-motion'

/* ─── Shared transition presets ─── */
export const easeOut  = [0.16, 1, 0.3, 1]       as const
export const easeIn   = [0.7, 0, 0.84, 0]        as const
export const spring   = { type: 'spring', stiffness: 100, damping: 20 } as const
export const springFast = { type: 'spring', stiffness: 260, damping: 24 } as const

/* ─── Fade up (generic section entry) ─── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.65, ease: easeOut } },
}

/* ─── Fade in ─── */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { duration: 0.5, ease: easeOut } },
}

/* ─── Slide in from left ─── */
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.6, ease: easeOut } },
}

/* ─── Slide in from right ─── */
export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.6, ease: easeOut } },
}

/* ─── Staggered container ─── */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

/* ─── Staggered container (slower stagger) ─── */
export const staggerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

/* ─── Child item for stagger ─── */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.5, ease: easeOut } },
}

/* ─── Hero sequence ─── */
export const heroContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

export const heroItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.7, ease: easeOut } },
}

/* ─── Scale in ─── */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,
    transition: { duration: 0.55, ease: easeOut } },
}

/* ─── Timeline line draw ─── */
export const lineGrow: Variants = {
  hidden:  { scaleY: 0, originY: 0 },
  visible: { scaleY: 1,
    transition: { duration: 1, ease: easeOut } },
}

/* ─── Shared pop animation — used everywhere ─── */
export const popSpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
}

export const popHover  = { scale: 1.07, y: -4 }
export const popTap    = { scale: 0.94, y: 1  }

export const navUnderline: Variants = {
  rest:  { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.25, ease: easeOut } },
}

/* ─── Mobile menu ─── */
export const mobileMenu: Variants = {
  closed: { opacity: 0, y: -16, pointerEvents: 'none' as const },
  open:   { opacity: 1, y: 0, pointerEvents: 'auto' as const,
    transition: { duration: 0.3, ease: easeOut } },
}

export const mobileMenuItem: Variants = {
  closed: { opacity: 0, x: -20 },
  open:   { opacity: 1, x: 0,
    transition: { duration: 0.25, ease: easeOut } },
}
