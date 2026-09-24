import { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { usePublicData } from '../../styles/PublicDataContext'
import { popSpring, popHover, popTap } from '../UI'

/* ─── Keyframe Animations ─── */
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const stripeMove = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
`

/* ─── Styled Components ─── */
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  user-select: none;

  /* Subtle technical grid background */
  background-image: 
    radial-gradient(${({ theme }) => theme.colors.border} 1px, transparent 1px);
  background-size: 24px 24px;
`

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.08em;
  box-shadow: 0 3px 0 ${({ theme }) => theme.colors.border};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const HeaderBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  padding: 0.2rem 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 700;
  text-transform: uppercase;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StatusDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #00c853;
  border: 2px solid ${({ theme }) => theme.colors.border};
  animation: ${blink} 1.2s infinite ease-in-out;
`

const MainArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`

const ConsoleBox = styled(motion.div)`
  width: 100%;
  max-width: 580px;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  display: flex;
  flex-direction: column;
`

const ConsoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`

const ConsoleDots = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Dot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
`

const ConsoleBody = styled.div`
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1.25rem;
    gap: 1.25rem;
  }
`

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const Eyebrow = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const MainTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(1.75rem, 4.5vw, 2.75rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.05;
  letter-spacing: -0.02em;
`

const CounterRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
`

const PercentDisplay = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.text};
`

const StatusTag = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 0.35rem 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 24px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
`

const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-right: ${({ $percent }) => ($percent > 0 && $percent < 100 ? '3px solid' : 'none')};
  border-color: ${({ theme }) => theme.colors.border};
  transition: width 0.1s linear;

  /* Brutalist diagonal hazard stripes */
  background-image: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.12) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 0, 0, 0.12) 50%,
    rgba(0, 0, 0, 0.12) 75%,
    transparent 75%,
    transparent
  );
  background-size: 24px 24px;
  animation: ${stripeMove} 1.5s linear infinite;
`

const TerminalLog = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.75rem 1rem;
  min-height: 52px;
  display: flex;
  align-items: center;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TerminalCaret = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: ${({ theme }) => theme.colors.text};
  margin-left: 6px;
  animation: ${blink} 0.8s infinite;
`

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
`

const HintText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

const SkipButton = styled(motion.button).attrs(() => ({
  whileHover: popHover,
  whileTap: popTap,
  transition: popSpring,
}))`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.45rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  }
`

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.5rem;
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textFaint};
  letter-spacing: 0.06em;
  text-transform: uppercase;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.65rem;
    padding: 0.5rem 1rem;
  }
`

/* ─── Loading Logs ─── */
const LOG_MESSAGES = [
  'INITIALIZING SYSTEM ARCHITECTURE...',
  'LOADING NEO-BRUTALIST TOKENS & SURFACES...',
  'FETCHING PROJECTS & CREDENTIAL MATRIX...',
  'MOUNTING FRAMER-MOTION PHYSICS ENGINE...',
  'SYNCHRONIZING WITH CLOUD FIRESTORE...',
  'CALIBRATING INERTIAL SMOOTH SCROLL (LENIS)...',
  'ALL SYSTEMS NOMINAL. LAUNCHING PORTFOLIO.',
]

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { loading: dataLoading } = usePublicData()
  const [percent, setPercent] = useState(0)
  const [logIndex, setLogIndex] = useState(0)

  const finish = useCallback(() => {
    setPercent(100)
    setLogIndex(LOG_MESSAGES.length - 1)
    setTimeout(() => {
      onComplete()
    }, 280)
  }, [onComplete])

  // Progress ticker effect
  useEffect(() => {
    let currentPercent = 0
    const interval = setInterval(() => {
      // Accelerate towards 90%
      const step = currentPercent < 40 ? 5 : currentPercent < 75 ? 3 : 2
      currentPercent = Math.min(currentPercent + step, 92)
      setPercent(currentPercent)

      // Cycle terminal logs according to percentage
      const logIdx = Math.min(
        Math.floor((currentPercent / 90) * (LOG_MESSAGES.length - 2)),
        LOG_MESSAGES.length - 2
      )
      setLogIndex(logIdx)

      // When public data is done and we reached at least 90%, finish smoothly to 100%
      if (!dataLoading && currentPercent >= 90) {
        clearInterval(interval)
        finish()
      }
    }, 45)

    // Fallback safety: never hang more than 2.8s
    const timeout = setTimeout(() => {
      clearInterval(interval)
      finish()
    }, 2400)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [dataLoading, finish])

  // Keydown ESC to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [finish])

  return (
    <Overlay
      initial={{ y: 0 }}
      exit={{
        y: '-100%',
        transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      {/* Top Header */}
      <HeaderBar>
        <HeaderLeft>
          <HeaderBadge>SYS_INIT</HeaderBadge>
          <span>MAQHAWE_NGWENYA // PORTFOLIO</span>
        </HeaderLeft>
        <HeaderRight>
          <StatusDot />
          <span>STATUS: ONLINE</span>
        </HeaderRight>
      </HeaderBar>

      {/* Main Box Area */}
      <MainArea>
        <ConsoleBox
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <ConsoleHeader>
            <ConsoleDots>
              <Dot $color="#FF3C2F" />
              <Dot $color="#FFE500" />
              <Dot $color="#00C853" />
            </ConsoleDots>
            <span>BOOT_SEQUENCE.EXE</span>
            <span>v2.6</span>
          </ConsoleHeader>

          <ConsoleBody>
            <TitleSection>
              <Eyebrow>Junior Full-Stack Software Developer</Eyebrow>
              <MainTitle>Maqhawe Ngwenya</MainTitle>
            </TitleSection>

            <CounterRow>
              <PercentDisplay>
                {percent.toString().padStart(2, '0')}%
              </PercentDisplay>
              <StatusTag>
                {percent >= 100 ? 'READY' : 'BOOTING'}
              </StatusTag>
            </CounterRow>

            <ProgressBarTrack>
              <ProgressBarFill $percent={percent} />
            </ProgressBarTrack>

            <TerminalLog>
              &gt; {LOG_MESSAGES[logIndex]}
              <TerminalCaret />
            </TerminalLog>

            <FooterRow>
              <HintText>[ESC] or button to skip</HintText>
              <SkipButton onClick={finish}>
                Skip Intro &rarr;
              </SkipButton>
            </FooterRow>
          </ConsoleBody>
        </ConsoleBox>
      </MainArea>

      {/* Bottom Bar */}
      <BottomBar>
        <span>Harare, Zimbabwe</span>
        <span>React 19 &bull; TypeScript &bull; Vite</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </BottomBar>
    </Overlay>
  )
}
