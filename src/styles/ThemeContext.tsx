import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

/* ─────────────────────────────────────────────
   Accent option shape.
   `overrides` lets a theme fully replace surface
   colours — used by the mono Black theme.
───────────────────────────────────────────── */
export interface AccentOption {
  label:      string
  primary:    string       // accent fill colour
  textColor:  string       // text ON the accent (for nav, buttons)
  navBg:      string       // navbar background

  /* Optional full surface override for mono themes */
  overrides?: {
    background?:   string
    surface?:      string
    surfaceAlt?:   string
    border?:       string
    borderSubtle?: string
    text?:         string
    textMuted?:    string
    textFaint?:    string
    shadows?: {
      sm?:    string
      md?:    string
      lg?:    string
      xl?:    string
      hover?: string
    }
  }
}

export const ACCENT_OPTIONS: AccentOption[] = [
  /* ── Default yellow ── */
  {
    label:     'Yellow',
    primary:   '#FFE500',
    textColor: '#000000',
    navBg:     '#FFE500',
  },

  /* ── Red ── */
  {
    label:     'Red',
    primary:   '#e11d48',
    textColor: '#ffffff',
    navBg:     '#e11d48',
  },

  /* ── Blue ── */
  {
    label:     'Blue',
    primary:   '#0047FF',
    textColor: '#ffffff',
    navBg:     '#0047FF',
  },

  /* ── White ── */
  {
    label:     'White',
    primary:   '#ffffff',
    textColor: '#000000',
    navBg:     '#ffffff',
  },

  /* ── Black / Mono ─────────────────────────
     Full surface inversion: everything dark.
     Background → near-black  (#0a0a0a)
     Surface    → dark grey   (#111111)
     Text       → off-white   (#F0F0F0)
     Border     → white       (#ffffff)
     Accent/primary → white   (#ffffff)
     Hard shadows → white offset
  ─────────────────────────────────────────── */
  {
    label:     'Black',
    primary:   '#ffffff',    // accent is white in mono mode
    textColor: '#000000',    // text ON white accent
    navBg:     '#000000',
    overrides: {
      background:   '#0a0a0a',
      surface:      '#111111',
      surfaceAlt:   '#1a1a1a',
      border:       '#ffffff',
      borderSubtle: '#333333',
      text:         '#F0F0F0',
      textMuted:    '#aaaaaa',
      textFaint:    '#555555',
      shadows: {
        sm:    '3px 3px 0px #ffffff',
        md:    '5px 5px 0px #ffffff',
        lg:    '7px 7px 0px #ffffff',
        xl:    '10px 10px 0px #ffffff',
        hover: '7px 7px 0px #ffffff',
      },
    },
  },
]

/* ─── Context ─── */
interface ThemeCtx {
  accent:    AccentOption
  setAccent: (a: AccentOption) => void
}

const Ctx = createContext<ThemeCtx>({
  accent:    ACCENT_OPTIONS[0],
  setAccent: () => undefined,
})

export function ThemeAccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<AccentOption>(() => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem('portfolio-accent')
      : null
    if (saved) {
      const found = ACCENT_OPTIONS.find(o => o.label === saved)
      if (found) return found
    }
    return ACCENT_OPTIONS[0]
  })

  const setAccent = useCallback((a: AccentOption) => {
    setAccentState(a)
    localStorage.setItem('portfolio-accent', a.label)
  }, [])

  return <Ctx.Provider value={{ accent, setAccent }}>{children}</Ctx.Provider>
}

export const useAccent = () => useContext(Ctx)
