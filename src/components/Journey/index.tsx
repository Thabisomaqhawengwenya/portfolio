import { useRef } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle, SectionSubtitle, Tag } from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { experience } from '../../data/experience'
import type { ExperienceItem } from '../../types'

/* ─── Styled ─── */
const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const Item = styled(motion.div)`
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.2s ease;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

/* Left side uses the theme's primary as the accent — always on-theme */
const ItemSide = styled.div`
  padding: ${({ theme }) => theme.spacing['6']};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['3']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-right: none;
    border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  }
`

const ItemDate = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const TypePill = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  width: fit-content;
`

const ItemBody = styled.div`
  padding: ${({ theme }) => theme.spacing['6']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`

const ItemTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.15;
`

const ItemOrg = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const ItemDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`

const Highlights = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['1']};
`

const HL = styled.li`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.55;
  display: flex;
  gap: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.weights.medium};

  &::before {
    content: '→';
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    flex-shrink: 0;
  }
`

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['2']};
  padding-top: ${({ theme }) => theme.spacing['2']};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`

/* ─── Section ─── */
export default function Journey() {
  const headerRef  = useRef(null)
  const headerView = useInView(headerRef, { once: true })

  return (
    <Section id="journey">
      <Container>
        <motion.div ref={headerRef}
          variants={fadeUp} initial="hidden" animate={headerView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>Journey</SectionEyebrow>
            <SectionTitle>Where I've been,<br />what I've built.</SectionTitle>
            <SectionSubtitle>
              My development journey — education, projects, and milestones.
            </SectionSubtitle>
          </SectionHeader>
        </motion.div>

        <TimelineWrapper>
          {experience.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </TimelineWrapper>
      </Container>
    </Section>
  )
}

function TimelineItem({ item, index }: { item: ExperienceItem; index: number }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const dateLabel = `${item.startDate}${!item.endDate ? ' – Present' : ''}`

  return (
    <Item ref={ref}
      variants={slideLeft} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.06 }}>

      {/* Left accent column — always theme primary, no hardcoded colours */}
      <ItemSide>
        <ItemDate>{dateLabel}</ItemDate>
        <div>
          <TypePill>{item.type}</TypePill>
          {item.location && (
            <ItemDate style={{ marginTop: '0.5rem', display: 'block', fontSize: '0.7rem' }}>
              📍 {item.location}
            </ItemDate>
          )}
        </div>
      </ItemSide>

      <ItemBody>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemOrg>{item.organization}</ItemOrg>
        <ItemDesc>{item.description}</ItemDesc>

        {item.highlights && item.highlights.length > 0 && (
          <Highlights>
            {item.highlights.map((h, i) => <HL key={i}>{h}</HL>)}
          </Highlights>
        )}

        {item.technologies && item.technologies.length > 0 && (
          <TechRow>
            {item.technologies.map(t => <Tag key={t}>{t}</Tag>)}
          </TechRow>
        )}
      </ItemBody>
    </Item>
  )
}
