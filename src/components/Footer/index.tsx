import styled from 'styled-components'
import { popSpring } from '../UI'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiArrowUp, FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAdmin } from '../../admin/context/AdminContext'

/* ─── Styled ─── */
const FooterEl = styled.footer`
  background: ${({ theme }) => theme.colors.text};
  border-top: 3px solid ${({ theme }) => theme.colors.border};
`

const FooterTop = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing['8']};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 3px solid #1a1a1a;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    padding: 0 ${({ theme }) => theme.spacing['6']};
  }
`

const FooterCell = styled.div`
  padding: ${({ theme }) => theme.spacing['8']};
  border-right: 3px solid #1a1a1a;

  &:last-child { border-right: none; }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-right: none;
    border-bottom: 3px solid #1a1a1a;
    padding: ${({ theme }) => theme.spacing['6']};

    &:last-child { border-bottom: none; }
  }
`

const FooterName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing['1']};
`

const FooterRole = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const CellLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`

const FooterNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`

const FooterLink = styled(motion.button)`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: color 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`

const SocialBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #888;
  text-decoration: none;
  transition: color 0.15s ease;
  width: fit-content;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`

/* Bottom bar */
const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['8']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['3']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
  }
`

const Copyright = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const BackTop = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #555;
  background: none;
  border: 2px solid #333;
  cursor: pointer;
  padding: 0.4rem 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.primary};
  }
`

const AdminBtn = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #444;
  text-decoration: none;
  padding: 0.4rem 0.875rem;
  border: 2px solid #2a2a2a;
  transition: color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

  svg { opacity: 0.6; }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: #444;
    box-shadow: 3px 3px 0 #333;
    svg { opacity: 1; }
  }
`

const LINKS = ['Home','About','Journey','Skills','Projects','Contact']
const scrollTo = (id: string) =>
  document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })

/* ─── Component ─── */
export default function Footer() {
  const { settings } = useAdmin()
  return (
    <FooterEl>
      <FooterTop>
        <FooterCell>
          <FooterName>Maqhawe Ngwenya</FooterName>
          <FooterRole>Junior Full-Stack Dev</FooterRole>
        </FooterCell>

        <FooterCell>
          <CellLabel>Navigation</CellLabel>
          <FooterNav aria-label="Footer navigation">
            {LINKS.map(l => (
              <FooterLink key={l} onClick={() => scrollTo(l)}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.94 }}
                transition={popSpring}>
                {l}
              </FooterLink>
            ))}
          </FooterNav>
        </FooterCell>

        <FooterCell>
          <CellLabel>Connect</CellLabel>
          <SocialLinks>
            <SocialBtn href={settings.githubUrl} target="_blank"
              rel="noopener noreferrer" aria-label="GitHub"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.92 }}
              transition={popSpring}>
              <FiGithub /> GitHub
            </SocialBtn>
            <SocialBtn href={settings.linkedinUrl} target="_blank"
              rel="noopener noreferrer" aria-label="LinkedIn"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.92 }}
              transition={popSpring}>
              <FiLinkedin /> LinkedIn
            </SocialBtn>
          </SocialLinks>
        </FooterCell>
      </FooterTop>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} Maqhawe Ngwenya. All rights reserved.
        </Copyright>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <AdminBtn to="/admin"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={popSpring}>
            <FiLock /> Admin
          </AdminBtn>
          <BackTop onClick={() => scrollTo('home')} aria-label="Back to top"
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.92 }}
            transition={popSpring}>
            <FiArrowUp /> Back to top
          </BackTop>
        </div>
      </FooterBottom>
    </FooterEl>
  )
}
