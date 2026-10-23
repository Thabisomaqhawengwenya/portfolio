import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGithub,
  FiLinkedin,
  FiArrowDown,
  FiArrowRight,
  FiDownload,
  FiTerminal,
  FiCpu,
  FiClock,
  FiActivity,
  FiMapPin,
} from 'react-icons/fi'
import { heroContainer, heroItem, scaleIn } from '../../styles/animations'
import { popSpring } from '../UI'
import { useAccent } from '../../styles/ThemeContext'
import { usePublicData } from '../../styles/PublicDataContext'
import { recordCvDownload } from '../../services/analyticsService'

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

  /* Top architectural rule */
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
  grid-template-columns: 1fr 440px;
  gap: ${({ theme }) => theme.spacing['12']};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 1fr 390px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['12']};
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
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.8rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  svg {
    font-size: 0.95rem;
    stroke-width: 2.5;
  }
`

const HeroTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(3.25rem, 7.5vw, 6.25rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
  padding-bottom: 0.25rem;

  em {
    font-style: normal;
    display: block;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.primary};
    text-decoration-thickness: 6px;
    text-underline-offset: 8px;
  }
`

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 500px;
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
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  svg { transition: transform 0.15s ease; }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: ${({ theme }) => theme.shadows.hover};
      svg { transform: translateX(4px); }
    }
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
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: ${({ theme }) => theme.shadows.hover};
    }
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
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, color 0.1s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
      background: ${({ theme }) => theme.colors.text};
      color: ${({ theme }) => theme.colors.background};
    }
  }
`

const SocialNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-left: 2px solid ${({ theme }) => theme.colors.border};
  padding-left: ${({ theme }) => theme.spacing['3']};
`

/* ─── Interactive Brutalist Engineering ID / System Card ─── */
const HeroVisual = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 460px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 100%;
  }
`

const SystemCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const SystemTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.9rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const WindowSquares = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  span {
    width: 9px;
    height: 9px;
    border: 1.5px solid ${({ theme }) => theme.colors.background};
    display: inline-block;
  }

  span:first-child {
    background: ${({ theme }) => theme.colors.primary};
  }
`

const IdentitySection = styled.div`
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 1rem;
  align-items: center;
  position: relative;

  /* Subtle architectural dot grid */
  background-image: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.border} 1px,
    transparent 1px
  );
  background-size: 18px 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 68px 1fr;
    padding: 1rem;
  }
`

const MonogramBadge = styled.div`
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  letter-spacing: -0.05em;
  line-height: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 68px;
    height: 68px;
    font-size: 2rem;
  }
`

const IdentityInfo = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.65rem 0.85rem;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const IdentityRole = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

const IdentityName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.15;
`

const IdentityAlumnus = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  padding: 0.1rem 0.4rem;
  width: fit-content;
  margin-top: 0.15rem;
`

/* Interactive Tab Switcher inside System Card */
const SystemTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`

const SystemTabBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.6rem 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  border-right: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? (theme.accentText ?? theme.colors.text) : theme.colors.text)};
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;

  &:last-child {
    border-right: none;
  }

  &:active {
    transform: scale(0.98);
  }
`

const ConsoleBody = styled.div`
  padding: 1.15rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  min-height: 172px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TelemetryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

const TelemetryBox = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 0.65rem 0.75rem;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
`

const TelemetryValue = styled.p`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 1.45rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`

const TelemetryLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.58rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.25rem;
`

const SpecList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const SpecRow = styled.div`
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.68rem;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.borderSubtle};
  padding-bottom: 0.4rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .key {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    text-transform: uppercase;
  }

  .val {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 700;
  }
`

const ClockDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const ClockTime = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 1.65rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 0.75rem;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
`

const SystemFooter = styled.div`
  padding: 0.85rem 1.25rem;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  gap: 0.5rem;
  flex-wrap: wrap;
`

const FooterSpecText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.68rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const AvailableDot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.68rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.2rem 0.55rem;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    animation: pulse 2s infinite;

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.35; }
    }
  }
`

/* Floating sticker badges — locked to single-accent + monochrome discipline */
const Sticker = styled(motion.div)<{ $bg: string; $fg: string }>`
  position: absolute;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 0.35rem 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  cursor: grab;
  user-select: none;
  touch-action: none;
  z-index: 10;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`

type CardTab = 'telemetry' | 'stack' | 'node'

/* ─── Component ─── */
export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  const { accent } = useAccent()
  const { heroContent, settings, sectionVisibility, githubStats } = usePublicData()
  const [activeTab, setActiveTab] = useState<CardTab>('telemetry')
  const [catTime, setCatTime] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date()
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Harare',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
        setCatTime(`${formatted} CAT`)
      } catch {
        setCatTime('UTC+02:00 CAT')
      }
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  /* Use admin-managed content with em-dash sanitization */
  const greeting  = (heroContent.greeting || 'Hello, World').replace(/\s*—\s*/g, ' // ')
  const rawRole   = heroContent.role || 'Front-End Software Developer building modern, high-performance web applications from Bulawayo, Zimbabwe.'
  const role      = rawRole.replace(/\s*—\s*/g, '. ')
  const cvUrl     = heroContent.cvUrl || '/Maqhawe-Ngwenya-CV.pdf'
  const available = heroContent.available !== false
  const stick1    = heroContent.sticker1 || 'React + TS'
  const stick2    = heroContent.sticker2 || 'Node.js'
  const stick3    = heroContent.sticker3 || 'Front-End'

  return (
    <HeroSection id="home">
      <HeroInner>
        {/* Left Column: Copy & CTAs */}
        <HeroContent variants={heroContainer} initial="hidden" animate="visible">
          <Greeting variants={heroItem}>
            <FiTerminal aria-hidden="true" /> {greeting}
          </Greeting>

          <HeroTitle variants={heroItem} aria-label="Maqhawe Thabiso Ngwenya">
            Maqhawe<br />
            <em>Ngwenya.</em>
          </HeroTitle>

          <HeroSubtitle variants={heroItem}>
            {role}
          </HeroSubtitle>

          <HeroActions variants={heroItem}>
            {sectionVisibility.contact ? (
              <PrimaryBtn
                href="#contact"
                onClick={e => { e.preventDefault(); scrollToContact() }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={popSpring}>
                Get in Touch <FiArrowRight aria-hidden="true" />
              </PrimaryBtn>
            ) : (
              <PrimaryBtn
                as="a"
                href={`mailto:${settings.email}`}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={popSpring}>
                Email Me <FiArrowRight aria-hidden="true" />
              </PrimaryBtn>
            )}
            {sectionVisibility.projects && (
              <SecondaryBtn
                href="#projects"
                onClick={e => { e.preventDefault(); scrollToProjects() }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={popSpring}>
                View Work <FiArrowDown aria-hidden="true" />
              </SecondaryBtn>
            )}
            <SecondaryBtn
              as="a"
              href={cvUrl}
              download="Maqhawe-Ngwenya-CV.pdf"
              onClick={() => recordCvDownload(cvUrl)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={popSpring}>
              <FiDownload aria-hidden="true" /> Resume PDF
            </SecondaryBtn>
          </HeroActions>

          <SocialRow variants={heroItem}>
            <SocialLink
              href={settings.githubUrl || 'https://github.com/Thabisomaqhawengwenya'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile - Thabisomaqhawengwenya"
              whileHover={{ scale: 1.12, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              <FiGithub aria-hidden="true" />
            </SocialLink>
            <SocialLink
              href={settings.linkedinUrl || 'https://www.linkedin.com/in/maqhawe-ngwenya/'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile - Maqhawe Ngwenya"
              whileHover={{ scale: 1.12, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              <FiLinkedin aria-hidden="true" />
            </SocialLink>
            <SocialNote>
              <FiMapPin aria-hidden="true" /> {settings.location || 'Bulawayo, Zimbabwe'}
            </SocialNote>
          </SocialRow>
        </HeroContent>

        {/* Right Column: Interactive Brutalist Engineering ID Card */}
        <HeroVisual
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35, duration: 0.55 }}>

          <SystemCard>
            <SystemTopBar>
              <span>SYS.ID // MT-NGWENYA</span>
              <WindowSquares aria-hidden="true">
                <span />
                <span />
                <span />
              </WindowSquares>
            </SystemTopBar>

            <IdentitySection>
              <MonogramBadge aria-hidden="true">MN</MonogramBadge>
              <IdentityInfo>
                <IdentityRole>Front-End Software Engineer</IdentityRole>
                <IdentityName>Maqhawe T. Ngwenya</IdentityName>
                <IdentityAlumnus>Uncommon.org Alumnus</IdentityAlumnus>
              </IdentityInfo>
            </IdentitySection>

            <SystemTabs role="tablist" aria-label="Engineering telemetry tabs">
              <SystemTabBtn
                type="button"
                role="tab"
                aria-selected={activeTab === 'telemetry'}
                $active={activeTab === 'telemetry'}
                onClick={() => setActiveTab('telemetry')}>
                <FiActivity aria-hidden="true" /> Telemetry
              </SystemTabBtn>
              <SystemTabBtn
                type="button"
                role="tab"
                aria-selected={activeTab === 'stack'}
                $active={activeTab === 'stack'}
                onClick={() => setActiveTab('stack')}>
                <FiCpu aria-hidden="true" /> Spec
              </SystemTabBtn>
              <SystemTabBtn
                type="button"
                role="tab"
                aria-selected={activeTab === 'node'}
                $active={activeTab === 'node'}
                onClick={() => setActiveTab('node')}>
                <FiClock aria-hidden="true" /> Node
              </SystemTabBtn>
            </SystemTabs>

            <ConsoleBody role="tabpanel">
              <AnimatePresence mode="wait">
                {activeTab === 'telemetry' && (
                  <motion.div
                    key="telemetry"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}>
                    <TelemetryGrid>
                      <TelemetryBox>
                        <TelemetryValue>{githubStats?.projectCount || 94}+</TelemetryValue>
                        <TelemetryLabel>Public Repositories</TelemetryLabel>
                      </TelemetryBox>
                      <TelemetryBox>
                        <TelemetryValue>{githubStats?.commitCount || 312}+</TelemetryValue>
                        <TelemetryLabel>Authored Commits</TelemetryLabel>
                      </TelemetryBox>
                      <TelemetryBox>
                        <TelemetryValue>React 19</TelemetryValue>
                        <TelemetryLabel>Core UI Engine</TelemetryLabel>
                      </TelemetryBox>
                      <TelemetryBox>
                        <TelemetryValue>TypeScript</TelemetryValue>
                        <TelemetryLabel>Strict Type Safety</TelemetryLabel>
                      </TelemetryBox>
                    </TelemetryGrid>
                  </motion.div>
                )}

                {activeTab === 'stack' && (
                  <motion.div
                    key="stack"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}>
                    <SpecList>
                      <SpecRow>
                        <span className="key">Frontend</span>
                        <span className="val">React 19 · TypeScript · Vite</span>
                      </SpecRow>
                      <SpecRow>
                        <span className="key">Styling</span>
                        <span className="val">Styled Components · Framer</span>
                      </SpecRow>
                      <SpecRow>
                        <span className="key">Backend</span>
                        <span className="val">Node.js · Express · REST APIs</span>
                      </SpecRow>
                      <SpecRow>
                        <span className="key">Database</span>
                        <span className="val">PostgreSQL · Prisma · Firestore</span>
                      </SpecRow>
                    </SpecList>
                  </motion.div>
                )}

                {activeTab === 'node' && (
                  <motion.div
                    key="node"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}>
                    <ClockDisplay>
                      <ClockTime>{catTime || '12:00:00 CAT'}</ClockTime>
                      <SpecList>
                        <SpecRow>
                          <span className="key">Base Node</span>
                          <span className="val">Bulawayo, ZW (20.15° S, 28.58° E)</span>
                        </SpecRow>
                        <SpecRow>
                          <span className="key">Sync Zone</span>
                          <span className="val">UTC+2 (EU / UK / US-East Overlap)</span>
                        </SpecRow>
                      </SpecList>
                    </ClockDisplay>
                  </motion.div>
                )}
              </AnimatePresence>
            </ConsoleBody>

            <SystemFooter>
              <FooterSpecText>STATUS // {available ? 'READY FOR DISPATCH' : 'ENGAGED'}</FooterSpecText>
              {available && (
                <AvailableDot>
                  <span />
                  Open to Work
                </AvailableDot>
              )}
            </SystemFooter>
          </SystemCard>

          {/* Draggable Stickers — Locked to Single-Accent + High-Contrast Monochrome */}
          <Sticker
            drag
            dragConstraints={{ top: -35, bottom: 35, left: -35, right: 35 }}
            dragElastic={0.35}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
            whileHover={{ scale: 1.08, rotate: 0 }}
            whileDrag={{ scale: 1.16, zIndex: 100 }}
            whileTap={{ scale: 0.95 }}
            $bg={accent.primary}
            $fg={accent.textColor}
            style={{ top: -16, right: -14, rotate: 3 }}
            title="Drag sticker">
            {stick1}
          </Sticker>
          <Sticker
            drag
            dragConstraints={{ top: -35, bottom: 35, left: -35, right: 35 }}
            dragElastic={0.35}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
            whileHover={{ scale: 1.08, rotate: 0 }}
            whileDrag={{ scale: 1.16, zIndex: 100 }}
            whileTap={{ scale: 0.95 }}
            $bg="#000000"
            $fg="#ffffff"
            style={{ bottom: 54, left: -18, rotate: -3 }}
            title="Drag sticker">
            {stick2}
          </Sticker>
          <Sticker
            drag
            dragConstraints={{ top: -35, bottom: 35, left: -35, right: 35 }}
            dragElastic={0.35}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
            whileHover={{ scale: 1.08, rotate: 0 }}
            whileDrag={{ scale: 1.16, zIndex: 100 }}
            whileTap={{ scale: 0.95 }}
            $bg={accent.primary}
            $fg={accent.textColor}
            style={{ bottom: -16, right: 20, rotate: 2 }}
            title="Drag sticker">
            {stick3}
          </Sticker>
        </HeroVisual>
      </HeroInner>
    </HeroSection>
  )
}
