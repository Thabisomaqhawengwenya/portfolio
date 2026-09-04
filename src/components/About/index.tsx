import { useRef } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle } from '../UI'
import { fadeUp, staggerContainer, staggerItem } from '../../styles/animations'

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const AboutLeft = styled.div`
  padding: ${({ theme }) => theme.spacing['10']};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-right: none;
    border-bottom: 3px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing['8']};
  }
`

const AboutRight = styled.div`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`

const Paragraph = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  margin-bottom: ${({ theme }) => theme.spacing['5']};

  &:last-child { margin-bottom: 0; }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
  }
`

/* Stats — each cell gets a border */
const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
`

const StatCell = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing['8']};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  border-right: 3px solid ${({ theme }) => theme.colors.border};

  &:nth-child(even) { border-right: none; }
  &:nth-child(3), &:nth-child(4) { border-bottom: none; }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    &:nth-child(3), &:nth-child(4) { border-bottom: 3px solid ${({ theme }) => theme.colors.border}; }
    &:last-child { border-bottom: none; }
  }
`

const StatValue = styled.p`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(1.25rem, 3vw, 3.5rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing['1']};
  word-break: break-word;
`

const StatLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

/* Quote block */
const QuoteBlock = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.primary};
  border-top: 3px solid ${({ theme }) => theme.colors.border};
`

const Quote = styled.blockquote`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  line-height: 1.3;
  letter-spacing: -0.01em;
`

const STATS = [
  { value: '2+',      label: 'Projects'  },
  { value: 'Zimbabwe',label: 'Location'  },
  { value: '∞',       label: 'Commits'   },
  { value: '2026',    label: 'Started'   },
]

export default function About() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section id="about">
      <Container>
        <motion.div ref={ref}
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>About</SectionEyebrow>
            <SectionTitle>A developer who cares about the craft.</SectionTitle>
          </SectionHeader>
        </motion.div>

        <AboutGrid>
          {/* Left: bio text */}
          <AboutLeft>
            <motion.div variants={staggerContainer} initial="hidden"
              animate={inView ? 'visible' : 'hidden'}>
              <Paragraph variants={staggerItem}>
                I'm <strong>Maqhawe Ngwenya</strong>, a Junior Full-Stack Software Developer from
                Zimbabwe, currently building my career through <strong>Uncommon.org</strong>. I
                work across the complete stack — from pixel-precise UI to database schema design.
              </Paragraph>
              <Paragraph variants={staggerItem}>
                My stack centres on <strong>React, TypeScript, and Node.js</strong>. I care deeply
                about code quality, developer experience, and shipping things that actually work well
                for the people using them.
              </Paragraph>
              <Paragraph variants={staggerItem}>
                I'm early in my career but deliberate about how I grow — I focus on
                <strong> fundamentals over shortcuts</strong>, and on becoming the kind of engineer
                teammates actually want to work with.
              </Paragraph>
            </motion.div>
          </AboutLeft>

          {/* Right: stats + quote */}
          <AboutRight>
            <StatsGrid variants={staggerContainer} initial="hidden"
              animate={inView ? 'visible' : 'hidden'}>
              {STATS.map(s => (
                <StatCell key={s.label} variants={staggerItem}>
                  <StatValue>{s.value}</StatValue>
                  <StatLabel>{s.label}</StatLabel>
                </StatCell>
              ))}
            </StatsGrid>

            <QuoteBlock variants={fadeUp} initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.3 }}>
              <Quote>
                "Coding for a better tomorrow."
              </Quote>
            </QuoteBlock>
          </AboutRight>
        </AboutGrid>
      </Container>
    </Section>
  )
}
