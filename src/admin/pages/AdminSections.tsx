import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  FiSave, FiEye, FiEyeOff, FiCheck, FiRotateCcw,
  FiExternalLink, FiSliders, FiLayout, FiActivity,
  FiUser, FiTrendingUp, FiCode, FiFolder, FiAward,
  FiHelpCircle, FiMail,
} from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { SectionVisibility } from '../../types'
import { DEFAULT_SECTION_VISIBILITY } from '../../types'

/* ─── Styled Components ─── */
const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`

const PageSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.75rem;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 1rem 1.25rem;
`

const CounterWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const CounterBadge = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 0.35rem 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const UnsavedNotice = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #ff3c2f;
  color: #fff;
  padding: 0.35rem 0.65rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const ActionBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 0.5rem 0.85rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    transform: translate(-1px, -1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`

const SaveBtn = styled(motion.button)<{ $saved?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #000;
  background: ${({ $saved, theme }) => $saved ? theme.colors.accent3 : theme.colors.primary};
  padding: 0.6rem 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translate(-2px, -2px);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`

const ViewSiteBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 0.5rem 0.85rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #000;
    transform: translate(-1px, -1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translate(1px, 1px);
  }
`

const SectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SectionCard = styled.div<{ $active: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  opacity: ${({ $active }) => $active ? 1 : 0.78};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translate(-2px, -2px);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const IconContainer = styled.div<{ $active: boolean }>`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.surfaceAlt};
  color: ${({ $active }) => $active ? '#000' : 'inherit'};
  font-size: 1.4rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  flex-shrink: 0;
`

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
`

const SectionHeading = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
`

const AnchorPill = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textFaint};
  padding: 0.15rem 0.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
`

const StatusTag = styled.span<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.55rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.accent3 : theme.colors.surfaceAlt};
  color: ${({ $active }) => $active ? '#000' : 'inherit'};
`

const SectionDesc = styled.p`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`

/* ─── Brutalist Toggle Switch Button ─── */
const SwitchBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.surfaceAlt};
  color: ${({ $active }) => $active ? '#000' : 'inherit'};
  border: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
  user-select: none;
  min-width: 140px;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

interface SectionItemDef {
  key: keyof SectionVisibility
  title: string
  anchor: string
  description: string
  icon: React.ReactNode
}

const SECTION_DEFINITIONS: SectionItemDef[] = [
  {
    key: 'hero',
    title: 'Hero & Introduction',
    anchor: '#home',
    description: 'Header fold with name, animated greeting, role subtitle, CV download, and tactile sticker badges.',
    icon: <FiLayout />,
  },
  {
    key: 'marquee',
    title: 'Principles Ticker Marquee',
    anchor: 'N/A',
    description: 'Continuous animated tape displaying core developer disciplines, speed, and engineering focus.',
    icon: <FiActivity />,
  },
  {
    key: 'about',
    title: 'About Me & GitHub Stats',
    anchor: '#about',
    description: 'Personal narrative, location badge (Bulawayo, Zimbabwe), and live 12-hour synchronized GitHub metrics.',
    icon: <FiUser />,
  },
  {
    key: 'journey',
    title: 'Career & Journey Timeline',
    anchor: '#journey',
    description: 'Structured chronological timeline with education, commercial experience, and career milestones.',
    icon: <FiTrendingUp />,
  },
  {
    key: 'skills',
    title: 'Technical Skills Grid',
    anchor: '#skills',
    description: 'Tabbed skill categories (Frontend, Backend, Database, Tools, Design) with interactive spring pop pills.',
    icon: <FiCode />,
  },
  {
    key: 'projects',
    title: 'Featured Projects Showcase',
    anchor: '#projects',
    description: 'Portfolio cards with category filters, technology tags, live demo links, and GitHub repositories.',
    icon: <FiFolder />,
  },
  {
    key: 'certificates',
    title: 'Certificates & Credentials',
    anchor: '#certificates',
    description: 'Verified professional certifications grid with external credential verification links.',
    icon: <FiAward />,
  },
  {
    key: 'faq',
    title: 'Frequently Asked Questions',
    anchor: '#faq',
    description: 'Accordion providing clarity on employment availability, rates, freelance contracts, and stack choices.',
    icon: <FiHelpCircle />,
  },
  {
    key: 'contact',
    title: 'Contact Form & Social Channels',
    anchor: '#contact',
    description: 'Direct-to-Firestore contact inquiry form with validation feedback and verified social profile links.',
    icon: <FiMail />,
  },
]

export default function AdminSections() {
  const { sectionVisibility, updateSectionVisibility } = useAdmin()
  const [draft, setDraft] = useState<SectionVisibility | null>(null)
  const [saved, setSaved] = useState(false)

  const form = useMemo(() => draft ?? sectionVisibility, [draft, sectionVisibility])

  // Track if there are unsaved local edits
  const hasChanges = useMemo(() => {
    return SECTION_DEFINITIONS.some(def => form[def.key] !== sectionVisibility[def.key])
  }, [form, sectionVisibility])

  // Count active sections
  const activeCount = useMemo(() => {
    return SECTION_DEFINITIONS.filter(def => form[def.key]).length
  }, [form])

  const toggleSection = (key: keyof SectionVisibility) => {
    setDraft(prev => {
      const current = prev ?? sectionVisibility
      return { ...current, [key]: !current[key] }
    })
  }

  const handleEnableAll = () => {
    const allOn: SectionVisibility = {
      hero: true,
      marquee: true,
      about: true,
      journey: true,
      skills: true,
      projects: true,
      certificates: true,
      faq: true,
      contact: true,
    }
    setDraft(allOn)
  }

  const handleResetDefaults = () => {
    setDraft({ ...DEFAULT_SECTION_VISIBILITY })
  }

  const handleSave = async () => {
    await updateSectionVisibility(form)
    setDraft(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageTitle>Section Visibility</PageTitle>
      <PageSub>
        Toggle sections on or off across the entire portfolio website.
      </PageSub>

      {/* Control Bar */}
      <TopBar>
        <CounterWrap>
          <CounterBadge>
            <FiSliders style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            {activeCount} of {SECTION_DEFINITIONS.length} Sections Active
          </CounterBadge>
          {hasChanges && <UnsavedNotice>Unsaved Changes</UnsavedNotice>}
        </CounterWrap>

        <ActionsGroup>
          <ActionBtn onClick={handleEnableAll} whileTap={{ scale: 0.96 }}>
            <FiCheck /> Enable All
          </ActionBtn>
          <ActionBtn onClick={handleResetDefaults} whileTap={{ scale: 0.96 }}>
            <FiRotateCcw /> Reset Defaults
          </ActionBtn>
          <ViewSiteBtn
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}>
            <FiExternalLink /> Live Site
          </ViewSiteBtn>
          <SaveBtn
            $saved={saved}
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}>
            <FiSave /> {saved ? 'Saved!' : 'Save Visibility'}
          </SaveBtn>
        </ActionsGroup>
      </TopBar>

      {/* Section Cards */}
      <SectionsList>
        {SECTION_DEFINITIONS.map(def => {
          const isActive = form[def.key]
          return (
            <SectionCard key={def.key} $active={isActive}>
              <IconContainer $active={isActive}>
                {def.icon}
              </IconContainer>

              <InfoCol>
                <TitleRow>
                  <SectionHeading>{def.title}</SectionHeading>
                  {def.anchor !== 'N/A' && <AnchorPill>{def.anchor}</AnchorPill>}
                  <StatusTag $active={isActive}>
                    {isActive ? <><FiEye /> Visible</> : <><FiEyeOff /> Hidden</>}
                  </StatusTag>
                </TitleRow>
                <SectionDesc>{def.description}</SectionDesc>
              </InfoCol>

              <SwitchBtn
                $active={isActive}
                onClick={() => toggleSection(def.key)}
                role="switch"
                aria-checked={isActive}
                aria-label={`Toggle visibility of ${def.title}`}>
                {isActive ? (
                  <>
                    <span>Visible</span>
                    <FiEye />
                  </>
                ) : (
                  <>
                    <span>Hidden</span>
                    <FiEyeOff />
                  </>
                )}
              </SwitchBtn>
            </SectionCard>
          )
        })}
      </SectionsList>
    </div>
  )
}
