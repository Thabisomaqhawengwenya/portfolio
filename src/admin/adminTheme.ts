/* Admin dashboard uses a dedicated dark theme
   matching the neo-brutalism language of the portfolio */
export const adminTheme = {
  colors: {
    /* backgrounds */
    background:   '#F8F6F2',   // milky white / warm cream
    surface:      '#FFFFFF',   // pure white cards
    surfaceAlt:   '#F0EDE8',   // slightly deeper cream

    /* borders */
    border:       '#000000',
    borderSubtle: '#D0CCC4',

    /* text */
    text:         '#0a0a0a',
    textMuted:    '#444444',
    textFaint:    '#888888',

    /* accents */
    primary:      '#FFE500',
    primaryDim:   '#FFE50022',
    primaryGlow:  '#FFE50010',
    accent1:      '#FF3C2F',
    accent2:      '#0047FF',
    accent3:      '#00C853',
    accent:       '#000000',
    error:        '#FF3C2F',
    success:      '#00C853',
  },
  typography: {
    fontDisplay: "'Space Grotesk', 'Arial Black', system-ui, sans-serif",
    fontBody:    "'Space Grotesk', system-ui, sans-serif",
    fontMono:    "'Space Mono', 'Courier New', monospace",
    sizes: {
      xs:   '0.75rem',
      sm:   '0.875rem',
      base: '1rem',
      md:   '1.125rem',
      lg:   '1.25rem',
      xl:   '1.5rem',
      '2xl':'2rem',
      '3xl':'2.75rem',
      '4xl':'3.75rem',
      '5xl':'5.5rem',
      '6xl':'7.5rem',
    },
    weights:      { regular: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeights:  { tight: 1.0, snug: 1.2, normal: 1.55, relaxed: 1.75 },
    letterSpacings:{ tight: '-0.03em', normal: '0em', wide: '0.06em', wider: '0.12em' },
  },
  spacing: {
    '1':'0.25rem','2':'0.5rem','3':'0.75rem','4':'1rem','5':'1.25rem',
    '6':'1.5rem','8':'2rem','10':'2.5rem','12':'3rem','16':'4rem',
    '20':'5rem','24':'6rem','32':'8rem','40':'10rem',
  },
  breakpoints: { xs:'320px', sm:'480px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1440px' },
  radii:       { sm:'0px', md:'0px', lg:'0px', xl:'0px', '2xl':'0px', full:'9999px' },
  shadows: {
    sm:    '3px 3px 0px #000000',
    md:    '5px 5px 0px #000000',
    lg:    '7px 7px 0px #000000',
    xl:    '10px 10px 0px #000000',
    hover: '7px 7px 0px #000000',
    yellow:'5px 5px 0px #FFE500',
    red:   '5px 5px 0px #FF3C2F',
    blue:  '5px 5px 0px #0047FF',
  },
  transitions: {
    fast:   'all 0.1s ease',
    base:   'all 0.18s ease',
    slow:   'all 0.3s ease',
    spring: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  zIndex: { base:0, raised:10, overlay:100, nav:200, modal:300 },
  accentText: '#000000',
  navBg:      '#FFE500',   // yellow navbar matches portfolio style
} as const

export type AdminTheme = typeof adminTheme
