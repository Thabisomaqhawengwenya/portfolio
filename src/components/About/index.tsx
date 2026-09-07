import { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle } from '../UI'
import { fadeUp, staggerContainer, staggerItem } from '../../styles/animations'
import { usePublicData } from '../../styles/PublicDataContext'

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
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  margin-bottom: ${({ theme }) => theme.spacing['5']};

  &:last-child { margin-bottom: 0; }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
  }
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

/* ─── GitHub commits fetcher ─── */
async function fetchTotalCommits(username: string): Promise<number> {
  try {
    // Get all repos first
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    )
    if (!reposRes.ok) return 0
    const repos: Array<{ full_name: string }> = await reposRes.json()

    // Fetch commit count per repo using contributor stats
    const counts = await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${repo.full_name}/commits?author=${username}&per_page=1`,
            { headers: { Accept: 'application/vnd.github.v3+json' } }
          )
          if (!res.ok) return 0
          // GitHub returns total in Link header
          const link = res.headers.get('Link') ?? ''
          const match = link.match(/page=(\d+)>; rel="last"/)
          if (match) return parseInt(match[1], 10)
          // If no Link header, count the returned items
          const data = await res.json()
          return Array.isArray(data) ? data.length : 0
        } catch { return 0 }
      })
    )
    return counts.reduce((a, b) => a + b, 0)
  } catch { return 0 }
}

/* ─── Component ─── */
export default function About() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const { settings, projects } = usePublicData()
  const userLocation = settings.location || 'Zimbabwe'
  const projectCount = projects.length || 3  // fallback to 3

  const [commitCount, setCommitCount] = useState<number | null>(null)

  useEffect(() => {
    fetchTotalCommits('Thabisomaqhawengwenya').then(n => {
      if (n > 0) setCommitCount(n)
    })
  }, [])

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
          {/* Left: bio */}
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

              {/* Projects — count up to real number */}
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

              {/* Commits — count up if fetched, else show ∞ */}
              <AnimatedStat
                label="Commits"
                value={commitCount !== null ? commitCount : '∞'}
                suffix={commitCount !== null ? '+' : ''}
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
          </AboutRight>
        </AboutGrid>
      </Container>
    </Section>
  )
}
