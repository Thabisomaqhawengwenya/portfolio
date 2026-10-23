import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { staggerContainer, mobileMenuItem } from '../../styles/animations'
import { popSpring } from '../UI'
import ColorPicker from '../ColorPicker'
import { usePublicData } from '../../styles/PublicDataContext'
import type { SectionVisibility } from '../../types'

interface NavItemDef {
  key:       keyof SectionVisibility
  label:     string
  href:      string
  variant?:  'text' | 'box-flame' | 'box-plain'
}

const ALL_NAV_ITEMS: NavItemDef[] = [
  { key: 'hero',         label: 'Home',         href: '#home',         variant: 'text' },
  { key: 'about',        label: 'About',        href: '#about',        variant: 'text' },
  { key: 'journey',      label: 'Journey',      href: '#journey',      variant: 'text' },
  { key: 'skills',       label: 'Skills',       href: '#skills',       variant: 'text' },
  { key: 'projects',     label: 'Projects',     href: '#projects',     variant: 'box-flame' },
  { key: 'certificates', label: 'Certificates', href: '#certificates', variant: 'box-plain' },
  { key: 'faq',          label: 'FAQ',          href: '#faq',          variant: 'text' },
  { key: 'contact',      label: 'Contact',      href: '#contact' },
]

/* Helper for dark-mode navbar checks */
const isDarkNav = (theme: { navBg?: string }) => theme.navBg === '#000000'
const btnShadowColor = (theme: { navBg?: string }) => (isDarkNav(theme) ? '#FFFFFF' : '#000000')

/* ─── Styled ─── */
const NavOuter = styled(motion.header)`
  position: fixed;
  top: 1.15rem;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.nav};
  padding: 0 1.5rem;
  pointer-events: none;
  will-change: transform, opacity;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: 0.75rem;
    padding: 0 0.85rem;
  }
`

const NavBar = styled.div`
  pointer-events: auto;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 68px;
  padding: 0.55rem 1.25rem;
  background: ${({ theme }) =>
    isDarkNav(theme)
      ? '#141414'
      : theme.navBg === '#FFE500'
        ? '#FFDC26'
        : (theme.navBg ?? theme.colors.primary)};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: 6px 6px 0px ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  transition: background 0.12s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px ${({ theme }) => theme.colors.border};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 60px;
    padding: 0.45rem 0.85rem;
    box-shadow: 4px 4px 0px ${({ theme }) => theme.colors.border};

    &:hover {
      transform: none;
      box-shadow: 4px 4px 0px ${({ theme }) => theme.colors.border};
    }
  }
`

const ScrollProgress = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #62D8F9;
  transform-origin: 0%;
  z-index: 10;
  pointer-events: none;
`

const Logo = styled(motion.button)`
  font-family: Georgia, 'Times New Roman', ${({ theme }) => theme.typography.fontDisplay};
  font-size: 1.35rem;
  font-weight: 800;
  background: #62D8F9;
  color: #000000;
  cursor: pointer;
  height: 44px;
  padding: 0 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  letter-spacing: -0.02em;
  border-radius: 6px;
  border: 2.5px solid #000000;
  box-shadow: 3px 3px 0px ${({ theme }) => btnShadowColor(theme)};
  flex-shrink: 0;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.12s ease;

  &:hover {
    background: #7ce3ff;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px ${({ theme }) => btnShadowColor(theme)};
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px ${({ theme }) => btnShadowColor(theme)};
  }
`

const NavCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-left: auto;
`

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (max-width: 1120px) {
    display: none;
  }
`

const TextNavLink = styled(motion.button)<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.9rem;
  font-weight: 700;
  background: transparent;
  color: ${({ theme }) => (isDarkNav(theme) ? '#FFFFFF' : (theme.accentText ?? theme.colors.text))};
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.65rem;
  position: relative;
  letter-spacing: -0.01em;
  transition: color 0.12s ease, opacity 0.12s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0.65rem;
    right: 0.65rem;
    bottom: 2px;
    height: 2.5px;
    background: ${({ theme }) => (isDarkNav(theme) ? '#62D8F9' : 'currentColor')};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left center;
    transition: transform 0.18s ease;
  }

  &:hover {
    color: ${({ theme }) => (isDarkNav(theme) ? '#62D8F9' : (theme.accentText ?? theme.colors.text))};
  }

  &:hover::after {
    transform: scaleX(1);
  }
`

const BoxedNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-left: 0.35rem;
`

const BoxedNavBtn = styled(motion.button)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  height: 42px;
  padding: 0 1rem;
  background: ${({ $active }) => ($active ? '#FFF9DB' : '#FFFFFF')};
  color: #000000;
  border: 2.5px solid #000000;
  border-radius: 2px;
  box-shadow: 3px 3px 0px ${({ theme }) => btnShadowColor(theme)};
  cursor: pointer;
  font-family: Georgia, 'Playfair Display', serif;
  font-style: italic;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.12s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px ${({ theme }) => btnShadowColor(theme)};
    background: #FFFDF2;
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px ${({ theme }) => btnShadowColor(theme)};
  }
`

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`

const DesktopPickerWrap = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const ContactBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 1.15rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.88rem;
  font-weight: 700;
  color: #000000;
  background: #62D8F9;
  border-radius: 6px;
  border: 2.5px solid #000000;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: -0.01em;
  white-space: nowrap;
  box-shadow: 3px 3px 0px ${({ theme }) => btnShadowColor(theme)};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.12s ease;

  &:hover {
    background: #7ce3ff;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px ${({ theme }) => btnShadowColor(theme)};
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px ${({ theme }) => btnShadowColor(theme)};
  }

  @media (max-width: 520px) {
    display: none;
  }
`

const MenuBtn = styled(motion.button)`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  background: #62D8F9;
  border-radius: 6px;
  border: 2.5px solid #000000;
  box-shadow: 3px 3px 0px ${({ theme }) => btnShadowColor(theme)};
  cursor: pointer;
  padding: 0;

  @media (max-width: 1120px) {
    display: flex;
  }
`

const Bar = styled(motion.span)`
  display: block;
  height: 2.5px;
  background: #000000;
  border-radius: 0;
  transform-origin: center;
`

/* Mobile overlay */
const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  background: ${({ theme }) =>
    isDarkNav(theme)
      ? '#141414'
      : theme.navBg === '#FFE500'
        ? '#FFDC26'
        : (theme.navBg ?? theme.colors.primary)};
  border: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing['8']};
  padding-top: 96px;
  overflow-y: auto;
`

const MobileNavLink = styled(motion.button)`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => (isDarkNav(theme) ? '#FFFFFF' : (theme.accentText ?? theme.colors.text))};
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
  &:hover { color: #62D8F9; }
`

const MobileThemeSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const MobileThemeTitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => (isDarkNav(theme) ? '#FFFFFF' : (theme.accentText ?? theme.colors.text))};
`

const MobileClose = styled(motion.button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing['5']};
  right: ${({ theme }) => theme.spacing['6']};
  background: #62D8F9;
  border-radius: 6px;
  border: 2.5px solid #000000;
  cursor: pointer;
  color: #000000;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.45rem 0.75rem;
  box-shadow: 3px 3px 0px ${({ theme }) => btnShadowColor(theme)};
`

function FlameBadgeIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 24 26" fill="none" aria-hidden="true">
      <path
        d="M12.8 1.5C12.8 1.5 19.5 7.2 19.5 14.2C19.5 18.8 16.1 22.5 11.8 22.5C7.5 22.5 4.2 18.9 4.2 14.3C4.2 11.1 6.1 8.3 7.8 6.8C7.8 6.8 7.3 9.7 9.4 10.7C8.6 7.4 10.6 3.7 12.8 1.5Z"
        fill="#E53935"
      />
      <path
        d="M11.8 22.5C9.2 22.5 7.2 20.4 7.2 17.6C7.2 15.2 9.1 13.4 11.3 11.7C11.3 11.7 12.8 13.9 12.6 15.8C13.7 15.1 14.3 13.8 14.3 13.8C15.6 15.1 16.2 16.5 16.2 17.9C16.2 20.5 14.3 22.5 11.8 22.5Z"
        fill="#FFB300"
      />
    </svg>
  )
}

/* ─── Component ─── */
export default function Navbar() {
  const { sectionVisibility } = usePublicData()
  const [activeSection, setActive]    = useState('home')
  const [menuOpen,      setMenuOpen]  = useState(false)
  const [navHidden,     setNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollYProgress } = useScroll()

  const visibleNavItems = useMemo(() => {
    return ALL_NAV_ITEMS.filter(item => sectionVisibility[item.key] !== false)
  }, [sectionVisibility])

  const textNavItems = useMemo(() => {
    return visibleNavItems.filter(item => item.variant === 'text' && item.key !== 'faq')
  }, [visibleNavItems])

  const boxedNavItems = useMemo(() => {
    return visibleNavItems.filter(item => item.variant === 'box-flame' || item.variant === 'box-plain')
  }, [visibleNavItems])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      // Hide when scrolling down past top threshold; show immediately when scrolling up
      if (currentY <= 64) {
        setNavHidden(false)
      } else if (delta > 6) {
        setNavHidden(true)
      } else if (delta < -4) {
        setNavHidden(false)
      }
      lastScrollY.current = currentY

      const sections = visibleNavItems.map(n => n.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && currentY >= el.offsetTop - 130) {
          setActive(sections[i]); break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleNavItems])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1120) setMenuOpen(false) }
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

  const homeTarget = visibleNavItems[0]?.href || '#home'
  const isHidden = navHidden && !menuOpen

  return (
    <>
      <NavOuter
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isHidden ? -110 : 0,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}>
        <NavBar>
          <ScrollProgress style={{ scaleX: scrollYProgress }} />

          <Logo
            onClick={() => scrollTo(homeTarget)}
            whileTap={{ scale: 0.94 }}
            transition={popSpring}
            aria-label="Scroll to top">
            MN
          </Logo>

          <NavCluster>
            <DesktopNav aria-label="Primary navigation">
              {textNavItems.map(item => (
                <TextNavLink
                  key={item.href}
                  $active={activeSection === item.href.slice(1)}
                  onClick={() => scrollTo(item.href)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={popSpring}>
                  {item.label}
                </TextNavLink>
              ))}

              {boxedNavItems.length > 0 && (
                <BoxedNavGroup>
                  {boxedNavItems.map(item => (
                    <BoxedNavBtn
                      key={item.href}
                      $active={activeSection === item.href.slice(1)}
                      onClick={() => scrollTo(item.href)}
                      whileTap={{ scale: 0.96 }}
                      transition={popSpring}>
                      {item.variant === 'box-flame' && <FlameBadgeIcon />}
                      <span>{item.label}</span>
                    </BoxedNavBtn>
                  ))}
                </BoxedNavGroup>
              )}
            </DesktopNav>

            <NavRight>
              {sectionVisibility.contact && (
                <ContactBtn
                  href="#contact"
                  onClick={e => { e.preventDefault(); scrollTo('#contact') }}
                  whileTap={{ scale: 0.95 }}
                  transition={popSpring}>
                  Get in Touch!
                </ContactBtn>
              )}

              {/* Desktop Theme / Dark Mode Button */}
              <DesktopPickerWrap>
                <ColorPicker />
              </DesktopPickerWrap>

              <MenuBtn
                onClick={() => setMenuOpen(v => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                whileTap={{ scale: 0.95 }}>
                <Bar
                  animate={menuOpen ? { rotate: 45, y: 7.5, width: '60%' } : { rotate: 0, y: 0, width: '60%' }}
                  transition={{ duration: 0.2 }}
                  style={{ width: '60%' }}
                />
                <Bar
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: '75%' }}
                />
                <Bar
                  animate={menuOpen ? { rotate: -45, y: -7.5, width: '60%' } : { rotate: 0, y: 0, width: '45%' }}
                  transition={{ duration: 0.2 }}
                  style={{ width: '45%' }}
                />
              </MenuBtn>
            </NavRight>
          </NavCluster>
        </NavBar>
      </NavOuter>

      <AnimatePresence>
        {menuOpen && (
          <MobileOverlay
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}>
            <MobileClose onClick={() => setMenuOpen(false)} whileTap={{ scale: 0.94 }}>
              ✕
            </MobileClose>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column' }}>
              {visibleNavItems.map((item, i) => (
                <MobileNavLink
                  key={item.href}
                  variants={mobileMenuItem}
                  custom={i}
                  onClick={() => scrollTo(item.href)}>
                  {item.label}
                </MobileNavLink>
              ))}

              <MobileThemeSection>
                <MobileThemeTitle>Theme Accent</MobileThemeTitle>
                <ColorPicker mobile />
              </MobileThemeSection>
            </motion.div>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  )
}
