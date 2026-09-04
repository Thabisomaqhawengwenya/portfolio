import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, mobileMenuItem } from '../../styles/animations'
import { popSpring } from '../UI'

const NAV_ITEMS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Journey',  href: '#journey' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
]

/* ─── Styled ─── */
const NavBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.nav};
  height: 64px;
  background: ${({ theme }) => theme.navBg ?? theme.colors.primary};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  transition: background 0.3s ease;
`

const NavInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing['8']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['4']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing['6']};
  }
`

const Logo = styled(motion.button)`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 1.375rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.navBg ?? theme.colors.primary};
  border: none;
  cursor: pointer;
  padding: 0.3rem 0.75rem;
  line-height: 1;
  letter-spacing: -0.02em;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    transform: translate(-2px,-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

const NavLink = styled(motion.button)<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? (theme.accentText ?? theme.colors.text) : (theme.accentText ?? theme.colors.text)};
  border: none;
  cursor: pointer;
  padding: 0.4rem 1rem;
  transition: background 0.15s ease, color 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  }
`

const ContactBtn = styled(motion.a)`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  /* Always high contrast: bg=primary, text=accentText */
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.45rem 1.25rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    transform: translate(-2px,-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const MenuBtn = styled(motion.button)`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.text};
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  padding: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`

const Bar = styled(motion.span)`
  display: block;
  height: 2.5px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 0;
  transform-origin: center;
`

/* Mobile overlay */
const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  background: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing['8']};
  padding-top: 100px;
  overflow: hidden;
`

const MobileNavLink = styled(motion.button)`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: ${({ theme }) => theme.spacing['3']} 0;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  transition: color 0.15s ease;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-transform: uppercase;

  &:last-of-type { border-bottom: none; }
  &:hover { color: ${({ theme }) => theme.colors.background}; }
`

const MobileClose = styled(motion.button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing['5']};
  right: ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.colors.text};
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.4rem 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

/* ─── Component ─── */
export default function Navbar() {
  const [activeSection, setActive]  = useState('home')
  const [menuOpen,      setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(n => n.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]); break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1024) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false)
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <NavBar>
        <NavInner>
          <Logo onClick={() => scrollTo('#home')}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.93 }}
            transition={popSpring}>
            MN.
          </Logo>

          <DesktopNav aria-label="Primary navigation">
            {NAV_ITEMS.slice(0, -1).map(item => (
              <NavLink key={item.href}
                $active={activeSection === item.href.slice(1)}
                onClick={() => scrollTo(item.href)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={popSpring}>
                {item.label}
              </NavLink>
            ))}
          </DesktopNav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ContactBtn href="#contact"
              onClick={e => { e.preventDefault(); scrollTo('#contact') }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.93 }}
              transition={popSpring}>
              Hire Me
            </ContactBtn>

            <MenuBtn onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              whileTap={{ scale: 0.95 }}>
              <Bar
                animate={menuOpen ? { rotate: 45, y: 7.5, width: '60%' } : { rotate: 0, y: 0, width: '60%' }}
                transition={{ duration: 0.2 }} style={{ width: '60%' }} />
              <Bar
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }} style={{ width: '75%' }} />
              <Bar
                animate={menuOpen ? { rotate: -45, y: -7.5, width: '60%' } : { rotate: 0, y: 0, width: '45%' }}
                transition={{ duration: 0.2 }} style={{ width: '45%' }} />
            </MenuBtn>
          </div>
        </NavInner>
      </NavBar>

      <AnimatePresence>
        {menuOpen && (
          <MobileOverlay key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}>
            <MobileClose onClick={() => setMenuOpen(false)} whileTap={{ scale: 0.94 }}>
              ✕
            </MobileClose>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible"
              style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV_ITEMS.map((item, i) => (
                <MobileNavLink key={item.href}
                  variants={mobileMenuItem} custom={i}
                  onClick={() => scrollTo(item.href)}>
                  {item.label}
                </MobileNavLink>
              ))}
            </motion.div>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  )
}
