import styled, { keyframes } from 'styled-components'
import { useAccent } from '../../styles/ThemeContext'

const marqueeAnim = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
`

const MarqueeWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.65rem 0;
  user-select: none;
  display: flex;
  position: relative;
  z-index: 5;
  transition: background 0.12s ease;
`

const MarqueeTrack = styled.div`
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: ${marqueeAnim} 22s linear infinite;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`

const MarqueeItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding-right: 1.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  .star {
    font-size: 0.9rem;
  }
`

const PHRASES = [
  'FRONT-END SOFTWARE DEVELOPER',
  'REACT 19 & TYPESCRIPT',
  'BULAWAYO, ZIMBABWE',
  'NODE.JS & POSTGRESQL',
  'CLOUD FIRESTORE',
  'CLEAN ARCHITECTURE',
  'OPEN TO WORK & COLLABORATION',
  'ACCESSIBILITY & PERFORMANCE',
]

export default function Marquee() {
  const { isMonoTheme } = useAccent()

  return (
    <MarqueeWrapper aria-hidden="true" role="presentation">
      <MarqueeTrack>
        {/* Render twice for continuous loop */}
        {[0, 1].map((copyIndex) => (
          <span key={copyIndex} style={{ display: 'inline-flex' }}>
            {PHRASES.map((phrase, i) => (
              <MarqueeItem key={`${copyIndex}-${i}`}>
                <span className="star">{isMonoTheme ? '■' : '✦'}</span>
                <span>{phrase}</span>
              </MarqueeItem>
            ))}
          </span>
        ))}
      </MarqueeTrack>
    </MarqueeWrapper>
  )
}
