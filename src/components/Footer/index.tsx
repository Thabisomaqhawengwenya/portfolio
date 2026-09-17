import styled from 'styled-components'
import { popSpring } from '../UI'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiLock, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { usePublicData } from '../../styles/PublicDataContext'
import { useAccent } from '../../styles/ThemeContext'

/* ─── Styled Components ─── */
const FooterEl = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 4px solid ${({ theme }) => theme.colors.border};
  width: 100%;
`

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const FooterCell = styled.div`
  padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['8']};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &:last-child {
    border-right: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    &:nth-child(2) {
      border-right: none;
    }
    &:nth-child(3) {
      grid-column: span 2;
      border-top: 3px solid ${({ theme }) => theme.colors.border};
      border-right: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-right: none;
    border-bottom: 3px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing['6']};

    &:nth-child(3) {
      grid-column: span 1;
      border-top: none;
      border-bottom: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`

const BrandEyebrow = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`

const FooterName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing['2']};
  line-height: 1.1;
`

const FooterBio = styled.p`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  width: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00c853;
    display: inline-block;
  }
`

const CellLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  display: flex;
  align-items: center;
  gap: 0.35rem;
`

const FooterNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`

const FooterLink = styled(motion.button)`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0.25rem 0;
  transition: color 0.15s ease, transform 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    transform: translateX(4px);
  }
`

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`

const SocialBtn = styled(motion.a)<{ $hoverBg: string; $hoverFg: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.85rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 2px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, color 0.1s ease;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &:hover {
    background: ${({ $hoverBg }) => $hoverBg};
    color: ${({ $hoverFg }) => $hoverFg};
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

/* Bottom bar */
const FooterBottom = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['8']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['3']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
    flex-direction: column;
    align-items: flex-start;
  }
`

const Copyright = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const BackTop = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  padding: 0.45rem 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  padding: 0.45rem 0.85rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;

  svg {
    opacity: 0.8;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const LINKS = ['Home', 'About', 'Journey', 'Skills', 'Projects', 'Certificates', 'Contact']
const scrollTo = (id: string) =>
  document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })

/* ─── Component ─── */
export default function Footer() {
  const { settings } = usePublicData()
  const { accent, isMonoTheme } = useAccent()
  const hoverBg = accent.primary
  const hoverFg = isMonoTheme ? '#000000' : accent.textColor

  return (
    <FooterEl>
      <FooterContainer>
        <FooterTop>
          {/* Identity */}
          <FooterCell>
            <BrandEyebrow>// SOFTWARE DEVELOPER &amp; FRONTEND ENGINEER</BrandEyebrow>
            <FooterName>Maqhawe Thabiso Ngwenya</FooterName>
            <FooterBio>
              Building responsive, high-performance web applications, accessible user interfaces, and digital products from Zimbabwe.
            </FooterBio>
            <StatusBadge>
              <span /> Open to Work &amp; Collaborations
            </StatusBadge>
          </FooterCell>

          {/* Navigation */}
          <FooterCell>
            <CellLabel>// NAVIGATION</CellLabel>
            <FooterNav aria-label="Footer navigation">
              {LINKS.map(l => (
                <FooterLink
                  key={l}
                  onClick={() => scrollTo(l)}
                  whileTap={{ scale: 0.95 }}
                  transition={popSpring}>
                  <FiArrowRight size={12} /> {l}
                </FooterLink>
              ))}
            </FooterNav>
          </FooterCell>

          {/* Connect */}
          <FooterCell>
            <CellLabel>// CONNECT</CellLabel>
            <SocialLinks>
              <SocialBtn
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                $hoverBg={hoverBg}
                $hoverFg={hoverFg}
                whileTap={{ scale: 0.95 }}
                transition={popSpring}>
                <div>
                  <FiGithub /> GitHub
                </div>
                <FiArrowRight size={12} />
              </SocialBtn>
              <SocialBtn
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                $hoverBg={hoverBg}
                $hoverFg={hoverFg}
                whileTap={{ scale: 0.95 }}
                transition={popSpring}>
                <div>
                  <FiLinkedin /> LinkedIn
                </div>
                <FiArrowRight size={12} />
              </SocialBtn>
              <SocialBtn
                href={`mailto:${settings.email}`}
                aria-label="Email"
                $hoverBg={hoverBg}
                $hoverFg={hoverFg}
                whileTap={{ scale: 0.95 }}
                transition={popSpring}>
                <div>
                  <FiMail /> Email
                </div>
                <FiArrowRight size={12} />
              </SocialBtn>
            </SocialLinks>
          </FooterCell>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} Maqhawe Ngwenya. All rights reserved.
          </Copyright>
          <ActionGroup>
            <AdminBtn
              to="/admin"
              whileTap={{ scale: 0.95 }}
              transition={popSpring}>
              <FiLock /> Admin
            </AdminBtn>
            <BackTop
              onClick={() => scrollTo('home')}
              aria-label="Back to top"
              whileTap={{ scale: 0.95 }}
              transition={popSpring}>
              <FiArrowUp /> Back to top
            </BackTop>
          </ActionGroup>
        </FooterBottom>
      </FooterContainer>
    </FooterEl>
  )
}

