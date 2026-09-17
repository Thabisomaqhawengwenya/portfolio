import { useRef, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import {
  Container, Section, SectionHeader,
  SectionEyebrow, SectionTitle, SectionSubtitle, Tag,
  popSpring,
} from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { projects as staticProjects } from '../../data/projects'
import { useAccent }     from '../../styles/ThemeContext'
import { usePublicData } from '../../styles/PublicDataContext'
import type { Project } from '../../types'

/* Multi-colour palette for non-mono themes */
const ROW_ACCENTS   = ['#FFE500', '#FF3C2F', '#0047FF']
const ROW_TEXT      = ['#000000', '#ffffff', '#ffffff']
const ITEMS_PER_PAGE = 3

const getInitials = (title: string) =>
  title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

/* ──────────────────────────────────────────────
   FILTER BAR — centered, matches Skills tab style
────────────────────────────────────────────── */
const FilterWrap = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing['10']};
`

const FilterBar = styled.div`
  display: flex;
  align-items: stretch;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: fit-content;
  /* no gap — tabs share borders */
`

const FilterTab = styled(motion.button)<{ $active: boolean; $activeBg: string; $activeFg: string }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.55rem 1.25rem;
  border: none;
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, $activeBg, theme }) =>
    $active ? $activeBg : theme.colors.background};
  color: ${({ $active, $activeFg, theme }) =>
    $active ? $activeFg : theme.colors.text};
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
  white-space: nowrap;

  &:last-child { border-right: none; }

  &:hover:not([data-active="true"]) {
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
  }
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
const RowNumber = styled.div<{ $bg: string; $fg: string }>`
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing['6']};
  background: ${({ $bg }) => $bg};

  span {
    font-family: ${({ theme }) => theme.typography.fontMono};
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    letter-spacing: 0.12em;
    color: ${({ $fg }) => $fg};
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

const BookCover = styled.div<{ $bg: string }>`
  ${bookSurface}
  background: ${({ $bg }) => $bg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 2;
  flex-direction: column;
  gap: 0.5rem;
`

const BookCoverInitials = styled.span<{ $fg: string }>`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $fg }) => $fg};
  letter-spacing: -0.04em;
  line-height: 1;
`

const BookCoverLabel = styled.span<{ $fg: string }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.55rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $fg }) => $fg};
  opacity: 0.7;
  padding: 0 0.5rem;
  text-align: center;
`

/* Spine — left edge */
const BookSpine = styled.div<{ $bg: string; $fg: string }>`
  position: absolute;
  top: 0;
  left: -14px;
  width: 14px;
  height: 100%;
  background: ${({ $bg }) => $bg};
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
    color: ${({ $fg }) => $fg};
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

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.accentText ?? theme.colors.text};
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
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
  const { isMonoTheme, accent } = useAccent()
  const num    = String(overallIndex + 1).padStart(2, '0')

  /* Colour selection: multi-colour in normal themes, mono in Black */
  const bg = isMonoTheme ? accent.primary           : ROW_ACCENTS[overallIndex % ROW_ACCENTS.length]
  const fg = isMonoTheme ? accent.textColor         : ROW_TEXT[overallIndex % ROW_TEXT.length]

  return (
    <Row ref={ref}
      variants={slideLeft}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.08 }}>

      <RowNumber $bg={bg} $fg={fg}>
        <span>Project {num}</span>
      </RowNumber>

      <BookWrap>
        <Book className="book-host">
          <BookSpine $bg={bg} $fg={fg}>
            <span>{project.title}</span>
          </BookSpine>

          <BookCover $bg={bg} className="book-cover">
            <BookCoverInitials $fg={fg}>{getInitials(project.title)}</BookCoverInitials>
            <BookCoverLabel $fg={fg}>{project.title}</BookCoverLabel>
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
  const { isMonoTheme, accent } = useAccent()
  /* Use public Firestore data when available, fall back to static */
  const { projects: adminProjects } = usePublicData()
  const projects = adminProjects.length ? adminProjects : staticProjects

  /* Predefined category display order */
  const ORDERED_CATEGORIES: Project['category'][] = ['Business', 'Personal', 'Mobile', 'Gift']
  
  /* Derive unique categories from data while respecting canonical order */
  const rawCategories = Array.from(new Set(projects.map(p => p.category))) as Project['category'][]
  const categories: Project['category'][] = [
    ...ORDERED_CATEGORIES.filter(c => rawCategories.includes(c)),
    ...rawCategories.filter(c => !ORDERED_CATEGORIES.includes(c)),
  ]

  const [active, setActive] = useState<Project['category']>(categories[0] ?? 'Business')
  const [currentPage, setCurrentPage] = useState<number>(1)

  /* Ensure active category remains valid if dataset changes */
  useEffect(() => {
    if (categories.length && !categories.includes(active)) {
      setActive(categories[0])
    }
  }, [categories, active])

  const filtered = projects.filter(p => p.category === active)

  /* Reset pagination when active category changes */
  useEffect(() => {
    setCurrentPage(1)
  }, [active])

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

  /* Tab active colours cycle through the accent palette */
  const TAB_COLORS = isMonoTheme
    ? categories.map(() => ({ bg: accent.primary, fg: accent.textColor }))
    : [
        { bg: '#FFE500', fg: '#000' },
        { bg: '#FF3C2F', fg: '#fff' },
        { bg: '#0047FF', fg: '#fff' },
        { bg: '#00C853', fg: '#000' },
        { bg: '#FFE500', fg: '#000' },
      ]

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

        {/* ── Centered filter tab bar ── */}
        <FilterWrap
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.15 }}>
          <FilterBar role="group" aria-label="Filter projects by category">
            {categories.map((cat, i) => {
              const { bg, fg } = TAB_COLORS[i % TAB_COLORS.length]
              return (
                <FilterTab
                  key={cat}
                  $active={active === cat}
                  $activeBg={bg}
                  $activeFg={fg}
                  data-active={active === cat ? 'true' : 'false'}
                  onClick={() => setActive(cat)}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  {cat}
                </FilterTab>
              )
            })}
          </FilterBar>
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
              <FiArrowLeft /> Prev
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
              Next <FiArrowRight />
            </PageBtn>
          </PaginationWrap>
        )}
      </Container>
    </Section>
  )
}

