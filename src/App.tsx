import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

/* Portfolio */
import { theme as baseTheme } from './styles/theme'
import { GlobalStyles }       from './styles/GlobalStyles'
import { ThemeAccentProvider, useAccent } from './styles/ThemeContext'
import { PublicDataProvider } from './styles/PublicDataContext'
import LoadingScreen from './components/LoadingScreen'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Journey  from './components/Journey'
import Skills   from './components/Skills'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact  from './components/Contact'
import Footer   from './components/Footer'

/* Admin (Lazy Loaded for performance & SEO) */
import { adminTheme }    from './admin/adminTheme'
const AdminLayout       = lazy(() => import('./admin/components/AdminLayout'))
const Login             = lazy(() => import('./admin/pages/Login'))
const Setup             = lazy(() => import('./admin/pages/Setup'))
const Overview          = lazy(() => import('./admin/pages/Overview'))
const AdminProjects     = lazy(() => import('./admin/pages/AdminProjects'))
const AdminCertificates = lazy(() => import('./admin/pages/AdminCertificates'))
const AdminJourney      = lazy(() => import('./admin/pages/AdminJourney'))
const AdminSkills       = lazy(() => import('./admin/pages/AdminSkills'))
const AdminMessages     = lazy(() => import('./admin/pages/AdminMessages'))
const AdminHeroSettings = lazy(() => import('./admin/pages/AdminHeroSettings'))
const AdminSettings     = lazy(() => import('./admin/pages/AdminSettings'))

const AdminLoadingFallback = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace' }}>
    LOADING ADMIN CONSOLE…
  </div>
)

/* ─── Portfolio wrapper ─── */
function PortfolioApp() {
  const { accent } = useAccent()
  const [isLoading, setIsLoading] = useState(true)

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

  // Prevent scrolling behind the loading screen
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  // Initialize smooth scrolling after loader completes
  useEffect(() => {
    if (isLoading) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf: number
    const animate = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(animate) }
    raf = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [isLoading])

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="portfolio-loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
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
        <Certificates />
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
        <PublicDataProvider>
          <ThemeAccentProvider>
            <PortfolioApp />
          </ThemeAccentProvider>
        </PublicDataProvider>
      } />

      {/* Admin */}
      {/* Admin setup — one-time user creation */}
      <Route path="/admin/setup" element={
        <Suspense fallback={<AdminLoadingFallback />}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ThemeProvider theme={adminTheme as any}>
            <GlobalStyles />
            <Setup />
          </ThemeProvider>
        </Suspense>
      } />

      <Route path="/admin/login" element={
        <Suspense fallback={<AdminLoadingFallback />}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ThemeProvider theme={adminTheme as any}>
            <GlobalStyles />
            <Login />
          </ThemeProvider>
        </Suspense>
      } />

      <Route path="/admin" element={
        <Suspense fallback={<AdminLoadingFallback />}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ThemeProvider theme={adminTheme as any}>
            <GlobalStyles />
            <AdminLayout />
          </ThemeProvider>
        </Suspense>
      }>
        <Route index       element={<Suspense fallback={<AdminLoadingFallback />}><Overview /></Suspense>}          />
        <Route path="projects"     element={<Suspense fallback={<AdminLoadingFallback />}><AdminProjects /></Suspense>}     />
        <Route path="certificates" element={<Suspense fallback={<AdminLoadingFallback />}><AdminCertificates /></Suspense>} />
        <Route path="journey"      element={<Suspense fallback={<AdminLoadingFallback />}><AdminJourney /></Suspense>}      />
        <Route path="skills"       element={<Suspense fallback={<AdminLoadingFallback />}><AdminSkills /></Suspense>}       />
        <Route path="messages"     element={<Suspense fallback={<AdminLoadingFallback />}><AdminMessages /></Suspense>}     />
        <Route path="hero"         element={<Suspense fallback={<AdminLoadingFallback />}><AdminHeroSettings /></Suspense>} />
        <Route path="settings"     element={<Suspense fallback={<AdminLoadingFallback />}><AdminSettings /></Suspense>}     />
      </Route>
    </Routes>
  )
}
