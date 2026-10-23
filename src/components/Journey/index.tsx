import { useRef } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import {
  Container,
  Section,
  SectionTitle,
  SectionSubtitle,
  BannerHeaderBar,
  Tag,
} from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { experience as staticExperience } from '../../data/experience'
import { useAccent }     from '../../styles/ThemeContext'
import { usePublicData } from '../../styles/PublicDataContext'
import type { ExperienceItem } from '../../types'

/* ─── Styled ─── */
const BannerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.background};
  padding: 0.25rem 0.65rem;
  margin-bottom: ${({ theme }) => theme.spacing['3']};
  width: fit-content;
`

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const Item = styled(motion.div)`
  display: grid;
  grid-template-columns: 220px 1fr;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.2s ease;

  &:last-child { border-bottom: none; }
  @media (hover: hover) and (pointer: fine) {
    &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const ItemSide = styled.div<{ $isPrimary: boolean }>`
  padding: ${({ theme }) => theme.spacing['6']};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ $isPrimary, theme }) => ($isPrimary ? theme.colors.primary : theme.colors.surfaceAlt)};
  color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.text)};
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
  color: inherit;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
`

const LocationMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: inherit;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.5rem;
`

const TypePill = styled.span<{ $isMono?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.6rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $isMono }) => ($isMono ? '#ffffff' : '#000000')};
  color: ${({ $isMono }) => ($isMono ? '#000000' : '#ffffff')} !important;
  display: inline-block;
  line-height: 1.2;
  width: fit-content;
  box-shadow: 2px 2px 0px ${({ theme }) => theme.colors.border};
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
  const { journey: adminJourney } = usePublicData()
  const experience = adminJourney.length ? adminJourney : staticExperience

  return (
    <Section id="journey">
      <Container>
        <motion.div
          ref={headerRef}
          variants={fadeUp}
          initial="hidden"
          animate={headerView ? 'visible' : 'hidden'}>
          <BannerHeaderBar>
            <div>
              <BannerBadge>02 // CHRONOLOGY</BannerBadge>
              <SectionTitle>Where I've been, what I've built.</SectionTitle>
            </div>
            <SectionSubtitle>
              Education, engineering capstones, and production milestones.
            </SectionSubtitle>
          </BannerHeaderBar>
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
  const ref          = useRef(null)
  const inView       = useInView(ref, { once: true, margin: '-60px' })
  const { isMonoTheme } = useAccent()

  /* Single-accent discipline: alternate active theme primary and structural surfaceAlt */
  const isPrimary = index % 2 === 0
  const dateLabel = `${item.startDate}${!item.endDate ? ' / PRESENT' : ` / ${item.endDate}`}`
  const cleanTitle = item.title.replace(/\s*—\s*/g, ': ')
  const cleanDesc  = item.description.replace(/\s*—\s*/g, ': ')

  return (
    <Item
      ref={ref}
      variants={slideLeft}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.06 }}>

      <ItemSide $isPrimary={isPrimary}>
        <ItemDate>{dateLabel}</ItemDate>
        <div>
          <TypePill $isMono={isMonoTheme}>
            {item.type}
          </TypePill>
          {item.location && (
            <div>
              <LocationMeta>
                <FiMapPin aria-hidden="true" /> {item.location}
              </LocationMeta>
            </div>
          )}
        </div>
      </ItemSide>

      <ItemBody>
        <ItemTitle>{cleanTitle}</ItemTitle>
        <ItemOrg>{item.organization}</ItemOrg>
        <ItemDesc>{cleanDesc}</ItemDesc>

        {item.highlights && item.highlights.length > 0 && (
          <Highlights>
            {item.highlights.map((h, i) => <HL key={i}>{h.replace(/\s*—\s*/g, ': ')}</HL>)}
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
