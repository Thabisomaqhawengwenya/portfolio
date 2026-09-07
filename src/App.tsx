import { useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import Lenis from 'lenis'

/* Portfolio */
import { theme as baseTheme } from './styles/theme'
import { GlobalStyles }       from './styles/GlobalStyles'
import { ThemeAccentProvider, useAccent } from './styles/ThemeContext'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Journey  from './components/Journey'
import Skills   from './components/Skills'
import Projects from './components/Projects'
import Contact  from './components/Contact'
import Footer   from './components/Footer'

/* Admin */
import { adminTheme }    from './admin/adminTheme'
import AdminLayout       from './admin/components/AdminLayout'
import Login             from './admin/pages/Login'
import Setup             from './admin/pages/Setup'
import Overview          from './admin/pages/Overview'
import AdminProjects     from './admin/pages/AdminProjects'
import AdminJourney      from './admin/pages/AdminJourney'
import AdminSkills       from './admin/pages/AdminSkills'
import AdminMessages     from './admin/pages/AdminMessages'
import AdminHeroSettings from './admin/pages/AdminHeroSettings'
import AdminSettings     from './admin/pages/AdminSettings'

/* ─── Portfolio wrapper ─── */
function PortfolioApp() {
  const { accent } = useAccent()

  const activeTheme = useMemo(() => {
    const ov = accent.overrides ?? {}
    const shadowOv = ov.shadows ?? {}
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary:     accent.primary          as string,
        primaryDim:  `${accent.primary}33`   as string,
        primaryGlow: `${accent.primary}15`   as string,
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
      accentText: accent.textColor,
      navBg:      accent.navBg,
    }
  }, [accent])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf: number
    const animate = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(animate) }
    raf = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
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

/* ─── Root — portfolio lives at /, admin at /admin ─── */
export default function App() {
  return (
    <Routes>
      {/* Portfolio */}
      <Route path="/" element={
        <ThemeAccentProvider>
          <PortfolioApp />
        </ThemeAccentProvider>
      } />

      {/* Admin */}
      {/* Admin setup — one-time user creation */}
      <Route path="/admin/setup" element={
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ThemeProvider theme={adminTheme as any}>
          <GlobalStyles />
          <Setup />
        </ThemeProvider>
      } />

      <Route path="/admin/login" element={
        <ThemeProvider theme={adminTheme as any}>
          <GlobalStyles />
          <Login />
        </ThemeProvider>
      } />

      <Route path="/admin" element={
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <ThemeProvider theme={adminTheme as any}>
          <GlobalStyles />
          <AdminLayout />
        </ThemeProvider>
      }>
        <Route index       element={<Overview />}          />
        <Route path="projects" element={<AdminProjects />}   />
        <Route path="journey"  element={<AdminJourney />}    />
        <Route path="skills"   element={<AdminSkills />}     />
        <Route path="messages" element={<AdminMessages />}   />
        <Route path="hero"     element={<AdminHeroSettings />} />
        <Route path="settings" element={<AdminSettings />}   />
      </Route>
    </Routes>
  )
}
