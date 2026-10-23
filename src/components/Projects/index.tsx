import { useRef, useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import {
  Container,
  Section,
  SectionTitle,
  SectionSubtitle,
  SwissHeaderGrid,
  SwissIndexCell,
  SwissTitleCell,
  SwissMetaCell,
  Tag,
  popSpring,
} from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { projects as staticProjects } from '../../data/projects'
import { useAccent }     from '../../styles/ThemeContext'
import { usePublicData } from '../../styles/PublicDataContext'
import { recordProjectClick } from '../../services/analyticsService'
import type { Project } from '../../types'

const ITEMS_PER_PAGE = 3

const getInitials = (title: string) =>
  title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

/* ──────────────────────────────────────────────
   FILTER BAR
────────────────────────────────────────────── */
const FilterWrap = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['4']};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing['8']};
`

const FilterBar = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: fit-content;
`

const FilterTab = styled(motion.button)<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.55rem 1.25rem;
  border: none;
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  z-index: 1;

  &:last-child { border-right: none; }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const FilterSummary = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textFaint};
  font-variant-numeric: tabular-nums;
`

const MastheadCount = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`

/* ──────────────────────────────────────────────
   LAYOUT — stacked rows
────────────────────────────────────────────── */
const RowList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 64px 300px 1fr;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  min-height: 300px;
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.15s ease, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;

  &:last-child { border-bottom: none; }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.surfaceAlt};
      transform: translateX(4px);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 48px 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`

/* Left gutter — project number, single-accent or inverted monochrome */
const RowNumber = styled.div<{ $isPrimary: boolean }>`
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing['6']};
  background: ${({ $isPrimary, theme }) => ($isPrimary ? theme.colors.primary : theme.colors.text)};

  span {
    font-family: ${({ theme }) => theme.typography.fontMono};
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    letter-spacing: 0.12em;
    color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.background)};
    text-transform: uppercase;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-variant-numeric: tabular-nums;
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
   BOOK CARD — 3-D CSS flip effect
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

const Book = styled.div`
  position: relative;
  width: 185px;
  height: 235px;
  perspective: 750px;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.45s ease;
  cursor: default;

  @media (hover: hover) and (pointer: fine) {
    &:hover { transform: rotateZ(-8deg); }
    &:hover .book-cover { transform: rotateY(-65deg); }
    &:hover .book-inner {
      transform: rotateZ(8deg) rotateX(-3deg) rotateY(-10deg) translateX(130px);
      box-shadow: 6px 6px 0 ${({ theme }) => theme.colors.border};
    }
  }
`

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

const BookCover = styled.div<{ $isPrimary: boolean }>`
  ${bookSurface}
  background: ${({ $isPrimary, theme }) => ($isPrimary ? theme.colors.primary : theme.colors.text)};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 2;
  flex-direction: column;
  gap: 0.5rem;
`

const BookCoverInitials = styled.span<{ $isPrimary: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.background)};
  letter-spacing: -0.04em;
  line-height: 1;
`

const BookCoverLabel = styled.span<{ $isPrimary: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.55rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.background)};
  opacity: 0.8;
  padding: 0 0.5rem;
  text-align: center;
`

const BookSpine = styled.div<{ $isPrimary: boolean }>`
  position: absolute;
  top: 0;
  left: -14px;
  width: 14px;
  height: 100%;
  background: ${({ $isPrimary, theme }) => ($isPrimary ? theme.colors.primary : theme.colors.text)};
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
    color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.background)};
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.75;
  }
`

const BookInner = styled.div`
  ${bookSurface}
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.65rem;
`

const BookInnerLine = styled.div<{ $width?: string; $accent?: boolean }>`
  height: 2px;
  width: ${({ $width = '80%' }) => $width};
  background: ${({ $accent, theme }) => ($accent ? theme.colors.primary : theme.colors.border)};
  border-radius: 0;
`

const BookInnerImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
  background: #000000;
  display: block;
`

const MobileProjectImage = styled.div`
  display: none;
  width: 100%;
  max-height: 220px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing['3']};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
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
  padding: 0.2rem 0.55rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $status, theme }) =>
    $status === 'live'
      ? theme.colors.primary
      : $status === 'wip'
      ? theme.colors.text
      : theme.colors.surfaceAlt};
  color: ${({ $status, theme }) =>
    $status === 'live'
      ? (theme.accentText ?? theme.colors.text)
      : $status === 'wip'
      ? theme.colors.background
      : theme.colors.text};
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
  padding-top: ${({ theme }) => theme.spacing['5']};
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['3']};
`

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
  white-space: nowrap;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, color 0.1s ease;

  ${({ $primary, theme }) => $primary
    ? css`
        background: ${theme.colors.primary};
        color: ${theme.accentText ?? theme.colors.text};
        box-shadow: ${theme.shadows.md};
        @media (hover: hover) and (pointer: fine) {
          &:hover {
            transform: translate(-2px, -2px);
            box-shadow: ${theme.shadows.hover};
          }
        }
      `
    : css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};
        box-shadow: ${theme.shadows.sm};
        @media (hover: hover) and (pointer: fine) {
          &:hover {
            background: ${theme.colors.text};
            color: ${theme.colors.background};
            transform: translate(-2px, -2px);
            box-shadow: ${theme.shadows.md};
          }
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
   PAGINATION CONTROLS
────────────────────────────────────────────── */
const PaginationWrap = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['4']};
  margin-top: ${({ theme }) => theme.spacing['10']};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing['2']};
    flex-wrap: wrap;
  }
`

const PageBtn = styled(motion.button)<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.65rem 1.25rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ $disabled, theme }) => $disabled ? 'none' : theme.shadows.md};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.35 : 1};
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
  user-select: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.accentText ?? theme.colors.text};
      transform: translate(-2px, -2px);
      box-shadow: ${({ theme }) => theme.shadows.hover};
    }
  }

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 ${({ theme }) => theme.colors.border};
  }

  svg {
    font-size: 1.1rem;
    stroke-width: 2.5;
  }
`

const PageIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.2rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  user-select: none;
  font-variant-numeric: tabular-nums;

  .page-num {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.accentText ?? theme.colors.text};
    padding: 0.15rem 0.5rem;
    border: 2px solid ${({ theme }) => theme.colors.border};
    font-weight: 900;
  }

  .total-num {
    opacity: 0.7;
  }
`

/* ──────────────────────────────────────────────
   SINGLE ROW COMPONENT
────────────────────────────────────────────── */
function ProjectRow({
  project,
  index,
  overallIndex,
}: {
  project: Project
  index: number
  overallIndex: number
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [imgFailed, setImgFailed] = useState(false)
  const num    = String(overallIndex + 1).padStart(2, '0')

  /* Single-accent discipline: alternate active theme primary and high-contrast inverse */
  const isPrimary = overallIndex % 2 === 0
  const showImage = Boolean(project.image) && !imgFailed
  const rawDescription = project.longDescription ?? project.description
  const cleanDescription = rawDescription.replace(/\s*—\s*/g, ': ')

  return (
    <Row
      ref={ref}
      variants={slideLeft}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.08 }}>

      <RowNumber $isPrimary={isPrimary}>
        <span>Project {num}</span>
      </RowNumber>

      <BookWrap>
        <Book className="book-host">
          <BookSpine $isPrimary={isPrimary}>
            <span>{project.title}</span>
          </BookSpine>

          <BookCover $isPrimary={isPrimary} className="book-cover">
            <BookCoverInitials $isPrimary={isPrimary}>{getInitials(project.title)}</BookCoverInitials>
            <BookCoverLabel $isPrimary={isPrimary}>{project.title}</BookCoverLabel>
          </BookCover>

          <BookInner className="book-inner">
            {showImage ? (
              <BookInnerImagePreview
                src={project.image}
                alt={project.title}
                width={165}
                height={215}
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <>
                <BookInnerLine $width="90%" $accent />
                <BookInnerLine $width="70%" />
                <BookInnerLine $width="80%" />
                <BookInnerLine $width="50%" />
                <BookInnerLine $width="65%" $accent />
                <BookInnerLine $width="75%" />
                <BookInnerLine $width="40%" />
              </>
            )}
          </BookInner>
        </Book>
      </BookWrap>

      {/* Description pane */}
      <InfoPane>
        <InfoTop>
          {showImage && (
            <MobileProjectImage>
              <img
                src={project.image}
                alt={project.title}
                width={600}
                height={220}
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            </MobileProjectImage>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ProjectTitle>{project.title.replace(/\s*—\s*/g, ': ')}</ProjectTitle>
            <StatusBadge $status={project.status}>{project.status}</StatusBadge>
          </div>

          <Description>
            {cleanDescription}
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
              onClick={() => recordProjectClick(project.title, 'github')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={popSpring}>
              <FiGithub aria-hidden="true" /> GitHub
            </ActionBtn>
          )}
          {project.liveUrl && (
            <ActionBtn
              $primary
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              onClick={() => recordProjectClick(project.title, 'live')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={popSpring}>
              Live Site <FiExternalLink aria-hidden="true" />
            </ActionBtn>
          )}
          {!project.liveUrl && (
            <ActionBtn
              $primary
              href={project.github ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title}`}
              onClick={() => recordProjectClick(project.title, 'github')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={popSpring}>
              Inspect Code <FiArrowRight aria-hidden="true" />
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
  const { accent } = useAccent()
  const { projects: adminProjects } = usePublicData()
  const projects = adminProjects.length ? adminProjects : staticProjects

  const categories = useMemo(() => {
    const ORDERED_CATEGORIES: Project['category'][] = ['Business', 'Personal', 'Mobile', 'Gift']
    const rawCategories = Array.from(new Set(projects.map(p => p.category))) as Project['category'][]
    return [
      ...ORDERED_CATEGORIES.filter(c => rawCategories.includes(c)),
      ...rawCategories.filter(c => !ORDERED_CATEGORIES.includes(c)),
    ]
  }, [projects])

  const [selectedCategory, setSelectedCategory] = useState<Project['category'] | null>(null)
  const active = selectedCategory && categories.includes(selectedCategory) ? selectedCategory : (categories[0] ?? 'Business')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleSelectCategory = (cat: Project['category']) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  const filtered = projects.filter(p => p.category === active)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const displayedProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      const el = document.getElementById('projects')
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        if (window.scrollY > top) {
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      const el = document.getElementById('projects')
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        if (window.scrollY > top) {
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <Section id="projects">
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}>
          <SwissHeaderGrid>
            <SwissIndexCell>
              04
              <span>Work</span>
            </SwissIndexCell>
            <SwissTitleCell>
              <SectionTitle>Things I've built.</SectionTitle>
              <SectionSubtitle style={{ marginTop: '0.25rem' }}>
                Production web applications, developer tools, and full-stack capstones.
              </SectionSubtitle>
            </SwissTitleCell>
            <SwissMetaCell>
              <MastheadCount>// TOTAL ARCHIVE: {String(projects.length).padStart(2, '0')} PROJECTS</MastheadCount>
              <MastheadCount>// CATEGORY: {active.toUpperCase()}</MastheadCount>
            </SwissMetaCell>
          </SwissHeaderGrid>
        </motion.div>

        {/* ── Filter tab bar ── */}
        <FilterWrap
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.15 }}>
          <FilterBar role="group" aria-label="Filter projects by category">
            {categories.map(cat => {
              const isCatActive = active === cat
              return (
                <FilterTab
                  key={cat}
                  $active={isCatActive}
                  data-active={isCatActive ? 'true' : 'false'}
                  onClick={() => handleSelectCategory(cat)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}>
                  {isCatActive && (
                    <motion.div
                      layoutId="activeProjectCategoryPill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: accent.primary,
                        zIndex: 0,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1, color: isCatActive ? accent.textColor : undefined }}>
                    {cat}
                  </span>
                </FilterTab>
              )
            })}
          </FilterBar>

          <FilterSummary>
            SHOWING {String(startIndex + 1).padStart(2, '0')}–{String(Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)).padStart(2, '0')} OF {String(filtered.length).padStart(2, '0')} IN {active.toUpperCase()}
          </FilterSummary>
        </FilterWrap>

        {/* ── Project rows ── */}
        <AnimatePresence mode="wait">
          <RowList key={`${active}-page-${safePage}`}>
            {displayedProjects.map((p, i) => (
              <ProjectRow
                key={p.id}
                project={p}
                index={i}
                overallIndex={startIndex + i}
              />
            ))}
          </RowList>
        </AnimatePresence>

        {/* ── Pagination Navigation Controls ── */}
        {totalPages > 1 && (
          <PaginationWrap
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <PageBtn
              onClick={handlePrevPage}
              $disabled={currentPage <= 1}
              disabled={currentPage <= 1}
              aria-label="Previous Projects Page"
              whileHover={currentPage > 1 ? { scale: 1.04, y: -2 } : {}}
              whileTap={currentPage > 1 ? { scale: 0.96 } : {}}>
              <FiArrowLeft aria-hidden="true" /> Prev
            </PageBtn>

            <PageIndicator aria-label={`Page ${safePage} of ${totalPages}`}>
              PAGE <span className="page-num">{String(safePage).padStart(2, '0')}</span> <span className="total-num">/ {String(totalPages).padStart(2, '0')}</span>
            </PageIndicator>

            <PageBtn
              onClick={handleNextPage}
              $disabled={currentPage >= totalPages}
              disabled={currentPage >= totalPages}
              aria-label="Next Projects Page"
              whileHover={currentPage < totalPages ? { scale: 1.04, y: -2 } : {}}
              whileTap={currentPage < totalPages ? { scale: 0.96 } : {}}>
              Next <FiArrowRight aria-hidden="true" />
            </PageBtn>
          </PaginationWrap>
        )}
      </Container>
    </Section>
  )
}
