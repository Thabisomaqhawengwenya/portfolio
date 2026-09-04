import { useEffect, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'
import Lenis from 'lenis'
import { theme as baseTheme } from './styles/theme'
import { GlobalStyles } from './styles/GlobalStyles'
import { ThemeAccentProvider, useAccent } from './styles/ThemeContext'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Journey  from './components/Journey'
import Skills   from './components/Skills'
import Projects from './components/Projects'
import Contact  from './components/Contact'
import Footer   from './components/Footer'

/* Inner component so it can consume the accent context */
function AppInner() {
  const { accent } = useAccent()

  /* Build a patched theme whenever the accent changes */
  const activeTheme = useMemo(() => {
    const ov = accent.overrides ?? {}
    const shadowOv = ov.shadows ?? {}

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        /* Always update accent colours */
        primary:      accent.primary          as string,
        primaryDim:   `${accent.primary}33`   as string,
        primaryGlow:  `${accent.primary}15`   as string,
        /* Surface / text overrides for mono themes */
        ...(ov.background   ? { background:   ov.background   } : {}),
        ...(ov.surface      ? { surface:      ov.surface      } : {}),
        ...(ov.surfaceAlt   ? { surfaceAlt:   ov.surfaceAlt   } : {}),
        ...(ov.border       ? { border:       ov.border       } : {}),
        ...(ov.borderSubtle ? { borderSubtle: ov.borderSubtle } : {}),
        ...(ov.text         ? { text:         ov.text         } : {}),
        ...(ov.textMuted    ? { textMuted:    ov.textMuted    } : {}),
        ...(ov.textFaint    ? { textFaint:    ov.textFaint    } : {}),
      } as typeof baseTheme.colors,
      shadows: {
        ...baseTheme.shadows,
        ...(shadowOv.sm    ? { sm:    shadowOv.sm    } : {}),
        ...(shadowOv.md    ? { md:    shadowOv.md    } : {}),
        ...(shadowOv.lg    ? { lg:    shadowOv.lg    } : {}),
        ...(shadowOv.xl    ? { xl:    shadowOv.xl    } : {}),
        ...(shadowOv.hover ? { hover: shadowOv.hover } : {}),
      } as typeof baseTheme.shadows,
      /* Extra tokens readable by navbar and other components */
      accentText: accent.textColor,
      navBg:      accent.navBg,
    }
  }, [accent])

  /* Lenis smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({
      duration:     1.2,
      easing:       (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:  true,
    })
    let raf: number
    const animate = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(animate) }
    raf = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />

      {/* Skip link */}
      <a href="#main-content"
        style={{
          position: 'absolute', top: -40, left: 8,
          background: accent.primary, color: accent.textColor,
          padding: '8px 16px', borderRadius: 0, fontSize: 14,
          zIndex: 9999, transition: 'top 0.2s', outline: 'none',
          border: '2px solid #000', fontWeight: 700,
        }}
        onFocus={e  => { (e.target as HTMLElement).style.top = '8px' }}
        onBlur={e   => { (e.target as HTMLElement).style.top = '-40px' }}>
        Skip to content
      </a>

      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ThemeAccentProvider>
      <AppInner />
    </ThemeAccentProvider>
  )
}
