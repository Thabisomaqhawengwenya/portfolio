import { useRef } from 'react'
import styled, { css } from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi'
import {
  Container, Section, SectionHeader,
  SectionEyebrow, SectionTitle, SectionSubtitle, Tag,
  popSpring,
} from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { projects } from '../../data/projects'
import type { Project } from '../../types'

/* ──────────────────────────────────────────────
   All colours come from theme — no hardcoded hex
────────────────────────────────────────────── */
const getInitials = (title: string) =>
  title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

/* ──────────────────────────────────────────────
   LAYOUT — stacked rows
────────────────────────────────────────────── */
const RowList = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 64px 260px 1fr;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  min-height: 300px;
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.15s ease;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 48px 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`

/* Left gutter — project number, always uses theme primary */
const RowNumber = styled.div`
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing['6']};
  background: ${({ theme }) => theme.colors.primary};

  span {
    font-family: ${({ theme }) => theme.typography.fontMono};
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    letter-spacing: 0.12em;
    color: ${({ theme }) => theme.accentText ?? theme.colors.text};
    text-transform: uppercase;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    writing-mode: horizontal-tb;
    transform: none;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['5']};
    border-right: none;
    border-bottom: 3px solid ${({ theme }) => theme.colors.border};

    span {
      writing-mode: horizontal-tb;
      transform: none;
      font-size: ${({ theme }) => theme.typography.sizes.sm};
    }
  }
`

/* ──────────────────────────────────────────────
   BOOK CARD — 3-D CSS flip effect,
   adapted to neo-brutalism: no border-radius,
   hard offset shadow, thick black borders.
────────────────────────────────────────────── */
const BookWrap = styled.div`
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['8']};
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

/* The outer container holds perspective */
const Book = styled.div`
  position: relative;
  width: 160px;
  height: 220px;
  perspective: 700px;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.45s ease;
  cursor: default;

  &:hover { transform: rotateZ(-8deg); }
  &:hover .book-cover { transform: rotateY(-65deg); }
  &:hover .book-inner {
    transform: rotateZ(8deg) rotateX(-3deg) rotateY(-10deg) translateX(120px);
    box-shadow: 6px 6px 0 ${({ theme }) => theme.colors.border};
  }`

/* Shared surface styles — no border-radius, hard black border */
const bookSurface = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: left center;
  transition: transform 0.45s ease, box-shadow 0.45s ease;
`

const BookCover = styled.div`
  ${bookSurface}
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 2;
  flex-direction: column;
  gap: 0.5rem;
`

const BookCoverInitials = styled.span`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  letter-spacing: -0.04em;
  line-height: 1;
`

const BookCoverLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.55rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  opacity: 0.7;
  padding: 0 0.5rem;
  text-align: center;
`

/* Spine — left edge */
const BookSpine = styled.div`
  position: absolute;
  top: 0;
  left: -14px;
  width: 14px;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-right: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  span {
    font-family: ${({ theme }) => theme.typography.fontMono};
    font-size: 0.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.7;
  }
`

const BookInner = styled.div`
  ${bookSurface}
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`

const BookInnerLine = styled.div<{ $width?: string; $color?: string }>`
  height: 2px;
  width: ${({ $width = '80%' }) => $width};
  background: ${({ $color, theme }) => $color ?? theme.colors.border};
  border-radius: 0;
`

/* ──────────────────────────────────────────────
   DESCRIPTION PANE — right side of each row
────────────────────────────────────────────── */
const InfoPane = styled.div`
  padding: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['6']};
  }
`

const InfoTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
  flex: 1;
`

const ProjectTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  line-height: 1.1;
`

const StatusBadge = styled.span<{ $status: Project['status'] }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0.2rem 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $status, theme }) =>
    $status === 'live' ? theme.colors.primary :
    $status === 'wip'  ? theme.colors.accent1 :
    theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  width: fit-content;
`

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  max-width: 560px;
`

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['2']};
`

const InfoBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding-top: ${({ theme }) => theme.spacing['5']};
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['3']};
`

/* Chunky action buttons matching site style */
const ActionBtn = styled(motion.a)<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.65rem 1.375rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, color 0.1s ease;

  ${({ $primary, theme }) => $primary
    ? css`
        background: ${theme.colors.primary};
        color: ${theme.accentText ?? theme.colors.text};
        box-shadow: ${theme.shadows.md};
        &:hover {
          transform: translate(-2px, -2px);
          box-shadow: ${theme.shadows.hover};
        }
      `
    : css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};
        box-shadow: ${theme.shadows.sm};
        &:hover {
          background: ${theme.colors.text};
          color: ${theme.colors.background};
          transform: translate(-2px, -2px);
          box-shadow: ${theme.shadows.md};
        }
      `
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 ${({ theme }) => theme.colors.border};
  }

  svg { transition: transform 0.15s ease; }
  &:hover svg { transform: translateX(3px); }
`

/* ──────────────────────────────────────────────
   SINGLE ROW COMPONENT
────────────────────────────────────────────── */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const num    = String(index + 1).padStart(2, '0')

  return (
    <Row ref={ref}
      variants={slideLeft}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.1 }}>

      {/* Number gutter — uses theme primary */}
      <RowNumber>
        <span>Project {num}</span>
      </RowNumber>

      {/* 3-D book card */}
      <BookWrap>
        <Book className="book-host">
          <BookSpine>
            <span>{project.title}</span>
          </BookSpine>

          <BookCover className="book-cover">
            <BookCoverInitials>{getInitials(project.title)}</BookCoverInitials>
            <BookCoverLabel>{project.title}</BookCoverLabel>
          </BookCover>

          <BookInner className="book-inner">
            <BookInnerLine $width="90%" />
            <BookInnerLine $width="70%" />
            <BookInnerLine $width="80%" />
            <BookInnerLine $width="50%" />
            <BookInnerLine $width="65%" />
            <BookInnerLine $width="75%" />
            <BookInnerLine $width="40%" />
          </BookInner>
        </Book>
      </BookWrap>

      {/* Description pane */}
      <InfoPane>
        <InfoTop>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ProjectTitle>{project.title}</ProjectTitle>
            <StatusBadge $status={project.status}>{project.status}</StatusBadge>
          </div>

          <Description>
            {project.longDescription ?? project.description}
          </Description>

          <TechRow>
            {project.technologies.map(t => <Tag key={t}>{t}</Tag>)}
          </TechRow>
        </InfoTop>

        <InfoBottom>
          {project.github && (
            <ActionBtn
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              <FiGithub /> GitHub
            </ActionBtn>
          )}
          {project.liveUrl && (
            <ActionBtn
              $primary
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              Live Site <FiExternalLink />
            </ActionBtn>
          )}
          {!project.liveUrl && (
            <ActionBtn
              $primary
              href={project.github ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title}`}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              View Project <FiArrowRight />
            </ActionBtn>
          )}
        </InfoBottom>
      </InfoPane>
    </Row>
  )
}

/* ──────────────────────────────────────────────
   SECTION
────────────────────────────────────────────── */
export default function Projects() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <Section id="projects">
      <Container>
        <motion.div ref={ref}
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>Projects</SectionEyebrow>
            <SectionTitle>Things I've built.</SectionTitle>
            <SectionSubtitle>
              A selection of projects from my training and personal development.
            </SectionSubtitle>
          </SectionHeader>
        </motion.div>

        <RowList>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
        </RowList>
      </Container>
    </Section>
  )
}
