import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiArrowDown, FiArrowRight, FiDownload } from 'react-icons/fi'
import { heroContainer, heroItem, scaleIn } from '../../styles/animations'
import { popSpring } from '../UI'
import ColorPicker from '../ColorPicker'
import { useAccent } from '../../styles/ThemeContext'

/* ─── Styled ─── */
const HeroSection = styled.section`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 64px; /* nav height */
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;

  /* Decorative corner marks */
  &::before {
    content: '';
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.primary};
  }
`

const HeroInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['16']} ${({ theme }) => theme.spacing['8']};
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${({ theme }) => theme.spacing['12']};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 1fr 340px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['10']};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['10']} ${({ theme }) => theme.spacing['6']};
  }
`

const HeroContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['6']};
`

const Greeting = styled(motion.p)`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.75rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const HeroTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};

  em {
    font-style: normal;
    display: block;
    color: ${({ theme }) => theme.colors.text};
    /* underlined with yellow */
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.primary};
    text-decoration-thickness: 6px;
    text-underline-offset: 6px;
  }
`

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 480px;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding-left: ${({ theme }) => theme.spacing['4']};
`

const HeroActions = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  flex-wrap: wrap;
`

const PrimaryBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.8rem 1.75rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  svg { transition: transform 0.15s ease; }

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    svg { transform: translateX(4px); }
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
  }
`

const SecondaryBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  padding: 0.8rem 1.75rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
  }
`

const SocialRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
`

const SocialLink = styled(motion.a)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.125rem;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
  }
`

const SocialNote = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-left: 2px solid ${({ theme }) => theme.colors.border};
  padding-left: ${({ theme }) => theme.spacing['3']};
`

/* ─── Visual / Avatar card ─── */
const HeroVisual = styled(motion.div)`
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

const AvatarCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  position: relative;
  aspect-ratio: 3/4;
  max-height: 480px;
  display: flex;
  flex-direction: column;
`

const AvatarBody = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* Dot-grid pattern — visible on both light and dark themes */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    );
    background-size: 20px 20px;
    opacity: 0.18;
  }
`

const AvatarMonogram = styled.div`
  position: relative;
  z-index: 1;
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 8rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  letter-spacing: -0.05em;
  line-height: 1;
  background: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

/* AvatarFooter background is theme.primary so text uses accentText for contrast */
const AvatarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 3px solid ${({ theme }) => theme.colors.border};
`

const AvatarNameText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  letter-spacing: -0.02em;
`

const AvailableDot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.08em;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.accentText ?? theme.colors.text};
    animation: pulse 2s infinite;

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.3; }
    }
  }
`

/* Floating sticker badges */
const Sticker = styled(motion.div)`
  position: absolute;
  background: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 0.4rem 0.875rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
`

/* ─── Component ─── */
export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  const { isMonoTheme, accent } = useAccent()

  /* Sticker colours: vivid in normal themes, mono in Black */
  const s1 = isMonoTheme ? { bg: accent.primary, fg: accent.textColor }
                         : { bg: '#FFE500', fg: '#000000' }
  const s2 = isMonoTheme ? { bg: accent.primary, fg: accent.textColor }
                         : { bg: '#FF3C2F', fg: '#ffffff' }
  const s3 = isMonoTheme ? { bg: accent.primary, fg: accent.textColor }
                         : { bg: '#0047FF', fg: '#ffffff' }

  return (
    <HeroSection id="home">
      <HeroInner>
        {/* Content */}
        <HeroContent variants={heroContainer} initial="hidden" animate="visible">
          <Greeting variants={heroItem}>
            👋 Hello, World
          </Greeting>

          <HeroTitle variants={heroItem}>
            Maqhawe<br />
            <em>Ngwenya.</em>
          </HeroTitle>

          <HeroSubtitle variants={heroItem}>
            Junior Full-Stack Software Developer. Building modern, useful, and engaging digital experiences — from Zimbabwe to the world.
          </HeroSubtitle>

          <HeroActions variants={heroItem}>
            <PrimaryBtn
              href="#contact"
              onClick={e => { e.preventDefault(); scrollToContact() }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              Get in Touch <FiArrowRight />
            </PrimaryBtn>
            <SecondaryBtn
              href="#projects"
              onClick={e => { e.preventDefault(); scrollToProjects() }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              View Projects <FiArrowDown />
            </SecondaryBtn>
            <SecondaryBtn
              as="a"
              href="/Maqhawe-Ngwenya-CV.pdf"
              download="Maqhawe-Ngwenya-CV.pdf"
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}
              style={{ cursor: 'pointer' }}>
              <FiDownload /> Download CV
            </SecondaryBtn>
          </HeroActions>

          <SocialRow variants={heroItem}>
            <SocialLink
              href="https://github.com/Thabisomaqhawengwenya"
              target="_blank" rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={popSpring}>
              <FiGithub />
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/maqhawe-ngwenya/"
              target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={popSpring}>
              <FiLinkedin />
            </SocialLink>
            <SocialNote>Zimbabwe</SocialNote>
          </SocialRow>

          {/* ── Accent colour picker ── */}
          <motion.div variants={heroItem}>
            <ColorPicker />
          </motion.div>
        </HeroContent>

        {/* Visual */}
        <HeroVisual
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.6 }}>

          <AvatarCard>
            <AvatarBody>
              <AvatarMonogram>MN</AvatarMonogram>
            </AvatarBody>
            <AvatarFooter>
              <AvatarNameText>Maqhawe Ngwenya</AvatarNameText>
              <AvailableDot>
                <span />
                Open
              </AvailableDot>
            </AvatarFooter>
          </AvatarCard>

          {/* Sticker badges */}
          <Sticker
            style={{ top: -16, right: -16, transform: 'rotate(4deg)', background: s1.bg, color: s1.fg }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}>
            React + TS
          </Sticker>
          <Sticker
            style={{ bottom: 60, left: -20, transform: 'rotate(-3deg)', background: s2.bg, color: s2.fg }}
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}>
            Node.js
          </Sticker>
          <Sticker
            style={{ bottom: -16, right: 20, transform: 'rotate(2deg)', background: s3.bg, color: s3.fg }}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}>
            Full-Stack
          </Sticker>
        </HeroVisual>
      </HeroInner>
    </HeroSection>
  )
}
