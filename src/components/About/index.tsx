import { useRef, useState, useEffect, type ReactNode } from 'react'
import styled from 'styled-components'
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  useReducedMotion,
  animate,
  type MotionValue,
} from 'framer-motion'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle } from '../UI'
import { fadeUp, staggerContainer, staggerItem } from '../../styles/animations'
import { usePublicData } from '../../styles/PublicDataContext'

/* ─── Highlight Palette (Matches Reference Image 1) ─── */
type HighlightTone = 'yellow' | 'pink' | 'cyan' | 'mint'

const HIGHLIGHT_COLORS: Record<HighlightTone, string> = {
  yellow: '#FFDC26',
  pink:   '#FF689B',
  cyan:   '#62D8F9',
  mint:   '#A6ECD3',
}

/* ─── Styled ─── */
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
  line-height: 2;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  margin-bottom: ${({ theme }) => theme.spacing['6']};

  &:last-child { margin-bottom: 0; }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
  }
`

const HighlightWrap = styled.span`
  position: relative;
  display: inline-block;
  padding: 0.06em 0.42em;
  margin: 0 0.12em;
  border-radius: 4px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  vertical-align: baseline;
  isolation: isolate;
`

const HighlightFill = styled(motion.span)<{ $bg: string; $origin: 'left' | 'right' }>`
  position: absolute;
  top: 0.08em;
  bottom: 0.08em;
  ${({ $origin }) => ($origin === 'left' ? 'left: 0;' : 'right: 0;')}
  background: ${({ $bg }) => $bg};
  border-radius: 4px;
  z-index: -1;
  pointer-events: none;
  will-change: width;
`

const HighlightText = styled.span<{ $activeInk: boolean }>`
  position: relative;
  z-index: 1;
  color: ${({ $activeInk, theme }) => ($activeInk ? '#0D0D0D' : theme.colors.text)};
  transition: color 150ms ease;
`

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

/* ─── Scroll-linked Highlight Span ─── */
interface ScrollHighlightProps {
  children: ReactNode
  tone: HighlightTone
  index: number
  total: number
  progress: MotionValue<number>
  origin?: 'left' | 'right'
  reducedMotion: boolean
}

function ScrollHighlight({
  children,
  tone,
  index,
  total,
  progress,
  origin = 'left',
  reducedMotion,
}: ScrollHighlightProps) {
  // Stagger each phrase window across the scroll range so phrases sweep sequentially as you scroll
  const step = 0.72 / Math.max(total - 1, 1)
  const start = index * step
  const end = Math.min(start + 0.28, 1)

  const width = useTransform(
    progress,
    [start, end],
    reducedMotion ? ['100%', '100%'] : ['2px', '100%']
  )

  const [isFilled, setIsFilled] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const unsub = progress.on('change', v => {
      const ratio = (v - start) / (end - start)
      setIsFilled(ratio > 0.35)
    })
    return () => unsub()
  }, [progress, start, end, reducedMotion])

  return (
    <HighlightWrap>
      <HighlightFill
        $bg={HIGHLIGHT_COLORS[tone]}
        $origin={origin}
        style={{ width }}
      />
      <HighlightText $activeInk={isFilled}>{children}</HighlightText>
    </HighlightWrap>
  )
}

/* ─── Count-up hook ─── */
function useCountUp(target: number, duration: number, active: boolean) {
  const motionVal = useMotionValue(0)
  const rounded   = useTransform(motionVal, v => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    const unsub = rounded.on('change', v => setDisplay(v))
    return () => { controls.stop(); unsub() }
  }, [active, target, duration, motionVal, rounded])

  return display
}

/* ─── Animated stat cell ─── */
interface StatProps {
  label:    string
  value:    string | number   // string = static (location, ∞), number = animates
  suffix?:  string
  active:   boolean
}

function AnimatedStat({ label, value, suffix = '', active }: StatProps) {
  const isNumber = typeof value === 'number'
  const count = useCountUp(isNumber ? value : 0, 2, active && isNumber)

  return (
    <StatCell variants={staggerItem}>
      <StatValue>
        {isNumber ? `${count}${suffix}` : value}
      </StatValue>
      <StatLabel>{label}</StatLabel>
    </StatCell>
  )
}

const SyncMeta = styled(motion.div)`
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 2px solid ${({ theme }) => theme.colors.borderSubtle};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;

  .sync-status {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  span.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: inline-block;
  }
`

/* ─── Component ─── */
export default function About() {
  const ref    = useRef<HTMLDivElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = Boolean(useReducedMotion())

  const { scrollYProgress } = useScroll({
    target: bioRef,
    offset: ['start 85%', 'end 40%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  })

  const { settings, githubStats } = usePublicData()
  const userLocation = settings.location || 'Zimbabwe'
  const projectCount = githubStats?.projectCount || 94
  const commitCount  = githubStats?.commitCount || 312

  const totalHighlights = 11

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
          {/* Left: bio with scroll-linked marker highlights */}
          <AboutLeft ref={bioRef}>
            <motion.div variants={staggerContainer} initial="hidden"
              animate={inView ? 'visible' : 'hidden'}>
              <Paragraph variants={staggerItem}>
                I'm{' '}
                <ScrollHighlight
                  index={0}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="yellow"
                  origin="left"
                  reducedMotion={prefersReducedMotion}
                >
                  Maqhawe Thabiso Ngwenya
                </ScrollHighlight>{' '}
                (also known as{' '}
                <ScrollHighlight
                  index={1}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="pink"
                  origin="right"
                  reducedMotion={prefersReducedMotion}
                >
                  Thabiso
                </ScrollHighlight>{' '}
                or{' '}
                <ScrollHighlight
                  index={2}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="cyan"
                  origin="left"
                  reducedMotion={prefersReducedMotion}
                >
                  thabisongwenya
                </ScrollHighlight>
                ), a Front-End Software Developer based in{' '}
                <ScrollHighlight
                  index={3}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="mint"
                  origin="right"
                  reducedMotion={prefersReducedMotion}
                >
                  Bulawayo, Zimbabwe
                </ScrollHighlight>
                . Currently advancing my craft through{' '}
                <ScrollHighlight
                  index={4}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="yellow"
                  origin="left"
                  reducedMotion={prefersReducedMotion}
                >
                  Uncommon.org
                </ScrollHighlight>
                , I build modern web applications, accessible user interfaces, and responsive digital products.
              </Paragraph>

              <Paragraph variants={staggerItem}>
                My primary technical focus is on{' '}
                <ScrollHighlight
                  index={5}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="pink"
                  origin="left"
                  reducedMotion={prefersReducedMotion}
                >
                  React, TypeScript, JavaScript, and Node.js
                </ScrollHighlight>
                . From building fluid UI/UX layouts to architecting backend services with{' '}
                <ScrollHighlight
                  index={6}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="cyan"
                  origin="right"
                  reducedMotion={prefersReducedMotion}
                >
                  PostgreSQL and Cloud Firestore
                </ScrollHighlight>
                , I care deeply about{' '}
                <ScrollHighlight
                  index={7}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="mint"
                  origin="left"
                  reducedMotion={prefersReducedMotion}
                >
                  clean code architecture
                </ScrollHighlight>
                , web performance, and delivering intuitive digital experiences.
              </Paragraph>

              <Paragraph variants={staggerItem}>
                I focus on{' '}
                <ScrollHighlight
                  index={8}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="yellow"
                  origin="right"
                  reducedMotion={prefersReducedMotion}
                >
                  engineering fundamentals over shortcuts
                </ScrollHighlight>{' '}
                —{' '}
                <ScrollHighlight
                  index={9}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="cyan"
                  origin="left"
                  reducedMotion={prefersReducedMotion}
                >
                  continuous learning
                </ScrollHighlight>
                , deliberate problem-solving, and writing{' '}
                <ScrollHighlight
                  index={10}
                  total={totalHighlights}
                  progress={smoothProgress}
                  tone="pink"
                  origin="right"
                  reducedMotion={prefersReducedMotion}
                >
                  maintainable code
                </ScrollHighlight>{' '}
                that teammates and users enjoy working with.
              </Paragraph>
            </motion.div>
          </AboutLeft>

          {/* Right: stats + quote */}
          <AboutRight>
            <StatsGrid variants={staggerContainer} initial="hidden"
              animate={inView ? 'visible' : 'hidden'}>

              {/* Projects — count up to real number of GitHub projects */}
              <AnimatedStat
                label="Projects"
                value={projectCount}
                suffix="+"
                active={inView}
              />

              {/* Location — static string */}
              <AnimatedStat
                label="Location"
                value={userLocation}
                active={inView}
              />

              {/* Commits — count up to real number of GitHub commits */}
              <AnimatedStat
                label="Commits"
                value={commitCount}
                suffix="+"
                active={inView}
              />

              {/* Started — count up to 2026 */}
              <AnimatedStat
                label="Started"
                value={2026}
                active={inView}
              />
            </StatsGrid>

            <QuoteBlock variants={fadeUp} initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.3 }}>
              <Quote>
                "Coding for a better tomorrow."
              </Quote>
            </QuoteBlock>

            <SyncMeta variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <span className="sync-status">
                <span className="dot" />
                Live GitHub Sync
              </span>
              <span>Updated every 12h</span>
            </SyncMeta>
          </AboutRight>
        </AboutGrid>
      </Container>
    </Section>
  )
}
