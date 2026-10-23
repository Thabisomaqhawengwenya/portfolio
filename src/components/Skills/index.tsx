import { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Container,
  Section,
  SectionTitle,
  SectionSubtitle,
  SplitSectionHeader,
  SectionIndexRule,
  popSpring,
} from '../UI'
import { fadeUp } from '../../styles/animations'
import { skillGroups as staticSkills } from '../../data/skills'
import { useAccent }     from '../../styles/ThemeContext'
import { usePublicData } from '../../styles/PublicDataContext'
import type { SkillCategory } from '../../types'

/* ─── Styled ─── */
const FilterRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  border: 3px solid ${({ theme }) => theme.colors.border};
  width: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const FilterBtn = styled(motion.button)<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border: none;
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:last-child { border-right: none; }
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const GroupCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing['6']};
  transition: background 0.15s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }
  }
`

const GroupHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  gap: 0.5rem;
`

const GroupLabel = styled.div<{ $isPrimary: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.background)};
  background: ${({ $isPrimary, theme }) => ($isPrimary ? theme.colors.primary : theme.colors.text)};
  padding: 0.2rem 0.55rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: inline-block;
`

const GroupCount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textFaint};
  font-variant-numeric: tabular-nums;
`

const SkillsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['2']};
`

const SkillPill = styled(motion.span)`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.35rem 0.75rem;
  cursor: default;
  transition: background 0.1s ease, color 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.accentText ?? theme.colors.text};
      box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.border};
    }
  }
`

const ALL = 'All' as const
type Filter = typeof ALL | SkillCategory

export default function Skills() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<Filter>(ALL)
  const { accent } = useAccent()
  const { skillGroups: adminSkills } = usePublicData()
  const skillGroups = adminSkills.length ? adminSkills : staticSkills

  const categories: Filter[] = [ALL, ...skillGroups.map(g => g.category)]
  const filtered = active === ALL ? skillGroups : skillGroups.filter(g => g.category === active)

  return (
    <Section id="skills">
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}>
          <SplitSectionHeader>
            <div>
              <SectionIndexRule>
                <span className="num">03</span> // CAPABILITIES &amp; STACK
              </SectionIndexRule>
              <SectionTitle>Technologies I work with.</SectionTitle>
              <SectionSubtitle>
                A focused engineering stack honed through production project work.
              </SectionSubtitle>
            </div>

            {/* Integrated Filter Bar in Split Header */}
            <FilterRow
              role="group"
              aria-label="Filter skills by category"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.15 }}>
              {categories.map(cat => {
                const isCatActive = active === cat
                return (
                  <FilterBtn
                    key={cat}
                    $active={isCatActive}
                    data-active={isCatActive ? 'true' : 'false'}
                    onClick={() => setActive(cat)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={popSpring}>
                    {isCatActive && (
                      <motion.div
                        layoutId="activeSkillCategoryPill"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: accent.primary,
                          zIndex: 0,
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                      />
                    )}
                    <span
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        color: isCatActive ? accent.textColor : undefined,
                      }}>
                      {cat}
                    </span>
                  </FilterBtn>
                )
              })}
            </FilterRow>
          </SplitSectionHeader>
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <GroupsGrid key={active}>
            {filtered.map((group, gi) => (
              <GroupCard
                key={group.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: gi * 0.05 }}>
                <GroupHeaderRow>
                  <GroupLabel $isPrimary={gi % 2 === 0}>
                    {group.category}
                  </GroupLabel>
                  <GroupCount>{String(group.skills.length).padStart(2, '0')} ITEMS</GroupCount>
                </GroupHeaderRow>
                <SkillsWrap>
                  {group.skills.map((skill, si) => (
                    <SkillPill
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: si * 0.03 }}
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.95 }}>
                      {skill.name}
                    </SkillPill>
                  ))}
                </SkillsWrap>
              </GroupCard>
            ))}
          </GroupsGrid>
        </AnimatePresence>
      </Container>
    </Section>
  )
}
