import { Navigate, Outlet, useLocation, Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  FiGrid, FiFolder, FiCode, FiMail, FiSettings,
  FiLogOut, FiExternalLink, FiMenu, FiX, FiActivity, FiLayout,
} from 'react-icons/fi'
import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

/* ─── Styled ─── */
const Shell = styled.div`
  display: flex;
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontBody};
`

const Sidebar = styled(motion.aside)<{ $open: boolean }>`
  width: 240px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 50;
  transition: transform 0.25s ease;

  @media (max-width: 1024px) {
    transform: ${({ $open }) => $open ? 'translateX(0)' : 'translateX(-100%)'};
  }
`

const SidebarHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Logo = styled.div`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`

const LogoBadge = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 0.15rem 0.4rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
`

const Nav = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: ${({ $active, theme }) => $active ? '#000' : theme.colors.textMuted};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.15s ease;

  svg { font-size: 1rem; flex-shrink: 0; }

  &:hover:not([data-active="true"]) {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-left-color: ${({ theme }) => theme.colors.border};
  }
`

const SidebarFooter = styled.div`
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FooterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textFaint};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;

  svg { font-size: 0.9rem; }
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

/* Main content */
const Main = styled.div`
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100svh;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`

const Topbar = styled.header`
  height: 60px;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 40;
`

const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Breadcrumb = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.1em;

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`

const HamburgerBtn = styled.button`
  display: none;
  background: none;
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 1.1rem;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    display: flex;
  }
`

const ViewSiteLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  padding: 0.35rem 0.875rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  transition: all 0.15s ease;

  &:hover { background: ${({ theme }) => theme.colors.primary}; color: #000; }
`

const PageContent = styled.main`
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1100px;
  width: 100%;
`

const Overlay = styled.div<{ $visible: boolean }>`
  display: none;
  @media (max-width: 1024px) {
    display: ${({ $visible }) => $visible ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 49;
  }
`

/* ─── Nav items config ─── */
const NAV = [
  { to: '/admin',          label: 'Overview',     icon: <FiGrid />     },
  { to: '/admin/projects', label: 'Projects',     icon: <FiFolder />   },
  { to: '/admin/journey',  label: 'Journey',      icon: <FiActivity /> },
  { to: '/admin/skills',   label: 'Skills',       icon: <FiCode />     },
  { to: '/admin/messages', label: 'Messages',     icon: <FiMail />     },
  { to: '/admin/hero',     label: 'Hero Content', icon: <FiLayout />   },
  { to: '/admin/settings', label: 'Settings',     icon: <FiSettings /> },
]

/* ─── Page label from path ─── */
const pageLabel = (pathname: string) => {
  const map: Record<string, string> = {
    '/admin':          'Overview',
    '/admin/projects': 'Projects',
    '/admin/journey':  'Journey',
    '/admin/skills':   'Skills',
    '/admin/messages': 'Messages',
    '/admin/hero':     'Hero Content',
    '/admin/settings': 'Settings',
  }
  return map[pathname] ?? 'Dashboard'
}

/* ─── Component ─── */
export default function AdminLayout() {
  const { isAuthed, authLoading, logout, messages } = useAdmin()
  const location = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  if (authLoading) return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0d0d0d', fontFamily: 'Space Mono', fontSize: '0.75rem',
      color: '#FFE500', textTransform: 'uppercase', letterSpacing: '0.1em',
    }}>
      Loading…
    </div>
  )

  if (!isAuthed) return <Navigate to="/admin/login" replace />

  const unread = messages.filter(m => !m.read).length

  return (
    <Shell>
      <Overlay $visible={sideOpen} onClick={() => setSideOpen(false)} />

      <Sidebar $open={sideOpen}>
        <SidebarHeader>
          <Logo>MN<span style={{ color: '#fff' }}>.</span></Logo>
          <LogoBadge>Admin</LogoBadge>
        </SidebarHeader>

        <Nav>
          {NAV.map(item => (
            <NavItem
              key={item.to}
              to={item.to}
              $active={location.pathname === item.to}
              onClick={() => setSideOpen(false)}>
              {item.icon}
              {item.label}
              {item.label === 'Messages' && unread > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#FF3C2F',
                  color: '#fff',
                  fontFamily: 'Space Mono',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  border: '1.5px solid #fff',
                }}>
                  {unread}
                </span>
              )}
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <FooterBtn as="a" href="/" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}>
            <FiExternalLink /> View Portfolio
          </FooterBtn>
          <FooterBtn onClick={() => logout()}>
            <FiLogOut /> Sign Out
          </FooterBtn>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <Topbar>
          <TopbarLeft>
            <HamburgerBtn onClick={() => setSideOpen(v => !v)} aria-label="Toggle sidebar">
              {sideOpen ? <FiX /> : <FiMenu />}
            </HamburgerBtn>
            <Breadcrumb>
              Admin / <span>{pageLabel(location.pathname)}</span>
            </Breadcrumb>
          </TopbarLeft>
          <ViewSiteLink href="/" target="_blank" rel="noopener noreferrer">
            <FiExternalLink /> Live Site
          </ViewSiteLink>
        </Topbar>

        <PageContent>
          <Outlet />
        </PageContent>
      </Main>
    </Shell>
  )
}
